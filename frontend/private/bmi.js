/**
 * BMI.js - Handles BMI calculation, display, and animation
 * Manages the BMI donut chart animation and editing functionality
 */

// Initialize BMI display and form functionality
function initializeBMI() {
    drawBMIChart(window.appData.userData.bmi);
}

/**
 * Draw the BMI donut chart
 * @param {number} bmiValue - The BMI value to display
 */
function drawBMIChart(bmiValue) {
    const canvas = document.getElementById('bmiChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 150;
    canvas.height = 150;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;
    
    
    let bmiPercentage = 0;
    // animate whole donut chart no matter what bmi value is
    bmiPercentage = 100;
    
    // if (bmiValue < 18.5) {
    //     // Underweight: Scale from 0% to 40%
    //     bmiPercentage = (bmiValue / 18.5) * 40;
    // } else if (bmiValue <= 24.9) {
    //     // Normal weight: Scale from 40% to 70%
    //     bmiPercentage = 40 + ((bmiValue - 18.5) / (24.9 - 18.5)) * 30;
    // } else if (bmiValue <= 29.9) {
    //     // Overweight: Scale from 70% to 90%
    //     bmiPercentage = 70 + ((bmiValue - 24.9) / (29.9 - 24.9)) * 20;
    // } else {
    //     // Obese: Scale from 90% to 100%
    //     bmiPercentage = 90 + Math.min(((bmiValue - 29.9) / 10), 1) * 10;
    // }
    
    // Animation variables
    const totalFrames = 100;
    let currentFrame = 0;
    
    // Animation function
    function animateBMIChart() {
        if (currentFrame <= totalFrames) {
            // Calculate progress percentage
            const progress = currentFrame / totalFrames;
            const currentAngle = progress * (bmiPercentage / 100) * Math.PI * 2;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 15;
            ctx.stroke();
            
            // Draw BMI arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + currentAngle);
            ctx.strokeStyle = getBMIColor(bmiValue);
            ctx.lineWidth = 15;
            ctx.stroke();
            
            currentFrame++;
            requestAnimationFrame(animateBMIChart);
        }
    }
    
    // Start animation
    animateBMIChart();
    console.log("BMI chart initialized" + bmiValue);
}

/**
 * Get color for BMI value based on health category
 * @param {number} bmi - BMI value
 * @returns {string} Color in hex or rgba format
 */
function getBMIColor(bmi) {
    if (bmi < 18.5) {
        return '#FFE135'; // Underweight - Yellow
    } else if (bmi < 25) {
        return '#85b94e'; // Normal weight - Green
    } else if (bmi < 30) {
        return '#ff9800'; // Overweight - Orange
    } else {
        return '#f44336'; // Obese - Red
    }
}

/**
 * Calculate BMI from weight and height
 * Formula: BMI = weight(kg) / height(m)²
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value with one decimal place
 */
function calculateBMI(weight, height) {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    
    // Calculate BMI
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Round to one decimal place
    return Math.round(bmi * 10) / 10;
}

/**
 * Save BMI form values and recalculate BMI
 */
function saveAndCalculateBMI() {
    // Get form values
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    
    // Validate input
    if (isNaN(weight) || isNaN(height) || isNaN(age) || 
        weight <= 0 || height <= 0 || age <= 0) {
        alert('Please enter valid values');
        return;
    }
    
    // Calculate new BMI
    const newBmi = calculateBMI(weight, height);
    
    // Update user data
    window.appData.userData.weight = weight;
    window.appData.userData.height = height;
    window.appData.userData.age = age;
    window.appData.userData.bmi = newBmi;
    
    // Update UI
    document.getElementById('weight-value').textContent = weight;
    document.getElementById('height-value').textContent = height;
    document.getElementById('age-value').textContent = age;
    document.querySelector('.bmi-value').textContent = newBmi;
    
    // Hide form
    document.querySelector('.bmi-form').classList.remove('show');
    
    // Redraw BMI chart with animation
    drawBMIChart(newBmi);
    updateUserInterface();
}
export { initializeBMI, saveAndCalculateBMI };