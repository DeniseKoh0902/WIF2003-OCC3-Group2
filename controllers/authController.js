const bcrypt = require('bcrypt'); 
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Joi Schemas
const forgotPasswordSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username cannot be empty',
    'any.required': 'Username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  })
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+]).{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*+).',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password cannot be empty',
    'any.required': 'Confirm password is required'
  })
});

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'Lax'
    });

    res.status(200).json({
      message: "User registered successfully. Welcome to Charmsync!",
      username: savedUser.username,
      email: savedUser.email
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error creating user. Please try again." });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '7d' : '1h' }
    );

    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
      sameSite: 'Lax'
    });

    res.status(200).json({
      _id: user._id, //add this line--by dens
      message: "You have logged in successfully. Welcome back to Charmsync!",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Log Out
exports.logout = async (req, res) => {
  res.clearCookie('Authorization', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.status(200).json({ success: true, message: "You have successfully logged out. Have a great day!" });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      // Return specific validation error message for 400 Bad Request
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    const resetToken = crypto.randomBytes(32).toString('hex');

    if (user) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; 
      await user.save();

      const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}&id=${user._id}`;

      await sendEmail(
        user.email,
        'Password Reset Request for Your Charmsync Account',
        `Dear ${user.username},\n\n` +
        `You're receiving this email because a password reset was requested for your account at Charmsync.\n\n` +
        `To reset your password, please click on the link below. This link is valid for 1 hour:\n` +
        `${resetUrl}\n\n` +
        `If you didn't request a password reset, please disregard this email. Your password will remain unchanged.\n\n` +
        `Thank you.\n\n` +
        `The Charmsync Team`
      );
    }
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1500));
    res.status(200).json({ message: 'If an account is associated with this username and email, a password reset link has been sent to the email address.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, id } = req.query;
    const { password, confirmPassword } = req.body;

    const { error } = resetPasswordSchema.validate({ password, confirmPassword });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset link is invalid or expired.' });
    }

    const isSameAsCurrent = await bcrypt.compare(password, user.password);
    if (isSameAsCurrent) {
        return res.status(400).json({ message: 'Your new password cannot be the same as your current password.' });
    }
      const passwordHistory = user.passwordHistory || []; 

    const reused = await Promise.any(
      passwordHistory.map(oldHash => bcrypt.compare(password, oldHash))
    ).catch(() => false); 

    if (reused) {
      return res.status(400).json({ message: 'Your new password cannot be one of your recently used passwords.' });
    }

    if (user.password) { 
      user.passwordHistory.unshift(user.password); 
      user.passwordHistory = user.passwordHistory.slice(0, 5); 
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Your password has been successfully reset. You can now login with your new password.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset. Please try again later.' });
  }
};
