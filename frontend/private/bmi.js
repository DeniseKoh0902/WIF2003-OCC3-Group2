import { initializeApp } from "./progress.js";


function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
}

function getBMIColor(bmi) {
    if (bmi < 18.5) {
        return '#FFE135'; 
    } else if (bmi < 25) {
        return '#85b94e'; 
    } else if (bmi < 30) {
        return '#ff9800'; 
    } else {
        return '#f44336'; 
    }
}

/**
 * Draw the BMI donut chart
 * @param {number} bmiValue
 */
function drawBMIChart(bmiValue) {
    const canvas = document.getElementById('bmiChart');
    if (!canvas) {
        console.warn("BMI Chart canvas not found. Skipping chart drawing.");
        return;
    }
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientWidth; 
    } else {
        canvas.width = 150;
        canvas.height = 150;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;
    
    let bmiPercentage = 100; 
    
    const totalFrames = 60; 
    let currentFrame = 0;
    
    function animateBMIChart() {
        if (currentFrame <= totalFrames) {
            const progress = currentFrame / totalFrames;
            const currentAngle = progress * (bmiPercentage / 100) * Math.PI * 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 15;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + currentAngle);
            ctx.strokeStyle = getBMIColor(bmiValue);
            ctx.lineWidth = 15;
            ctx.stroke();
            
            currentFrame++;
            requestAnimationFrame(animateBMIChart);
        }
    }
    
    animateBMIChart();
    console.log("BMI chart initialized with value: " + bmiValue);
}

async function initializeBMI() {
    console.log("initializeBMI() called: Fetching user progress.");
    try {
        const response = await fetch('/api/progress/latest');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const progressData = await response.json();
        console.log("Fetched progress data:", progressData);

        let currentWeight = progressData.weight || 0;
        let currentHeight = progressData.height || 0;
        let age = progressData.age || 0;
        let currentBMI = 0;

        if (currentWeight > 0 && currentHeight > 0) {
            currentBMI = calculateBMI(currentWeight, currentHeight);
        }

        // Update window.appData.userData with fetched progress values
        if (!window.appData) {
            window.appData = { userData: {}, reminders: [], activeNotifications: [] };
        }
        if (!window.appData.userData) {
            window.appData.userData = {};
        }

        window.appData.userData.weight = currentWeight;
        window.appData.userData.height = currentHeight;
        window.appData.userData.age = age;
        window.appData.userData.bmi = currentBMI;
        document.getElementById('weight-value').textContent = currentWeight;
        document.getElementById('height-value').textContent = currentHeight;
        document.getElementById('age-value').textContent = age;
        document.querySelector('.bmi-value').textContent = currentBMI;

        // Pre-fill form values with fetched data for editing
        const bmiFormWeight = document.getElementById("weight");
        const bmiFormHeight = document.getElementById("height");
        const bmiFormAge = document.getElementById("age");
        if (bmiFormWeight) bmiFormWeight.value = currentWeight;
        if (bmiFormHeight) bmiFormHeight.value = currentHeight;
        if (bmiFormAge) bmiFormAge.value = age;

        drawBMIChart(currentBMI);

    } catch (error) {
        console.error("Error initializing BMI:", error);
        document.getElementById('weight-value').textContent = 'N/A';
        document.getElementById('height-value').textContent = 'N/A';
        document.getElementById('age-value').textContent = 'N/A';
        document.querySelector('.bmi-value').textContent = 'N/A';
        drawBMIChart(0);
    }
}

async function saveAndCalculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert('Please enter valid positive values for weight and height.');
        return;
    }

    const newBmi = calculateBMI(weight, height);

    try {
        const weightResponse = await fetch('/api/weight/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                weight: weight,
                dateRecorded: new Date()
            }),
        });

        if (!weightResponse) {
            const errorData = await weightResponse.json();
            throw new Error(`HTTP error! status: ${weightResponse.status}, message: ${errorData.message}`);
        }

        const weightSavedProgress = await weightResponse.json();
        console.log("Weight progress saved to backend:", weightSavedProgress);
        
        initializeApp();

        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                weight: weight, 
                height: height,
                age: age,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const savedProgress = await response.json();
        console.log("Progress saved to backend:", savedProgress);

        window.appData.userData.weight = weight;
        window.appData.userData.height = height;
        window.appData.userData.bmi = newBmi;
        if (window.appData.userData.age !== undefined) { 
             window.appData.userData.age = age;
        }

        document.getElementById('weight-value').textContent = weight;
        document.getElementById('height-value').textContent = height;
        document.querySelector('.bmi-value').textContent = newBmi;
        // if age input exists and is meaningful to user data, update it
        const ageEl = document.getElementById('age-value');
        if (ageEl) ageEl.textContent = age;
        document.querySelector('.bmi-form').classList.remove('show');
        drawBMIChart(newBmi);
    } catch (error) {
        console.error("Error saving BMI:", error);
        alert(`Failed to save BMI: ${error.message}`);
    }
}

export { initializeBMI, saveAndCalculateBMI };