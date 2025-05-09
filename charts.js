/**
 * Charts.js - Handles all chart animations and rendering
 * Uses HTML Canvas to create animated charts without external libraries
 */

// Initialize all charts
function initializeCharts() {
    initializeWeightChangeChart();
    initializeStepCountsChart();
    initializeActiveTimeChart();
}

/**
 * Weight Change Chart
 * Renders a line chart showing actual weight vs target weight over months
 */
function initializeWeightChangeChart() {
    const canvas = document.getElementById('weightChangeChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 300;
    
    // Chart data from data.js
    const data = window.appData.weightChangeData;
    
    // Calculate scale based on min and max values
    const allWeights = [...data.actualWeight, ...data.targetWeight];
    const minWeight = Math.floor(Math.min(...allWeights)) - 1;
    const maxWeight = Math.ceil(Math.max(...allWeights)) + 1;
    
    // Animation variables
    const totalFrames = 60;
    let currentFrame = 0;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chart grid and labels
    drawWeightChartGrid(ctx, canvas, data.months, minWeight, maxWeight);
    
    // Animation function
    function animateWeightChart() {
        if (currentFrame <= totalFrames) {
            // Calculate progress percentage
            const progress = currentFrame / totalFrames;
            
            // Clear the data area only (preserve grid and labels)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWeightChartGrid(ctx, canvas, data.months, minWeight, maxWeight);
            
            // Draw target weight line (blue)
            drawAnimatedLine(
                ctx, 
                data.months, 
                data.targetWeight, 
                minWeight, 
                maxWeight, 
                canvas, 
                progress, 
                '#4aa5e3', 
                3
            );
            
            // Draw actual weight line (white)
            drawAnimatedLine(
                ctx, 
                data.months, 
                data.actualWeight, 
                minWeight, 
                maxWeight, 
                canvas, 
                progress, 
                '#ffffff', 
                3
            );
            
            currentFrame++;
            requestAnimationFrame(animateWeightChart);
        }
    }
    
    // Start animation
    animateWeightChart();
}

/**
 * Draw grid and labels for weight change chart
 */
function drawWeightChartGrid(ctx, canvas, months, minWeight, maxWeight) {
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    const weightStep = (maxWeight - minWeight) / 4;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + chartHeight - (i / 4) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        
        // Add weight labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText((minWeight + i * weightStep).toFixed(1), padding.left - 5, y + 3);
    }
    
    // Draw month labels
    const xStep = chartWidth / (months.length - 1);
    months.forEach((month, index) => {
        const x = padding.left + index * xStep;
        
        // Add month label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(month.substring(0, 3), x, canvas.height - padding.bottom + 15);
    });
    
    ctx.stroke();
}

/**
 * Draw animated line for the weight chart
 */
function drawAnimatedLine(ctx, months, weights, minWeight, maxWeight, canvas, progress, color, lineWidth) {
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Draw line up to the current progress
    const pointsToDraw = Math.ceil(months.length * progress);
    
    for (let i = 0; i < pointsToDraw; i++) {
        const x = padding.left + (i / (months.length - 1)) * chartWidth;
        const normalizedValue = (weights[i] - minWeight) / (maxWeight - minWeight);
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw points at each data point
    for (let i = 0; i < pointsToDraw; i++) {
        const x = padding.left + (i / (months.length - 1)) * chartWidth;
        const normalizedValue = (weights[i] - minWeight) / (maxWeight - minWeight);
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Step Counts Chart
 * Renders a bar chart showing steps per day of the week
 */
function initializeStepCountsChart() {
    const canvas = document.getElementById('stepCountsChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 300;
    
    // Chart data from data.js
    const data = window.appData.stepCountData;
    
    // Find maximum step value for scaling
    const maxSteps = Math.max(...data.steps) * 1.2; // Add 20% for margin
    
    // Animation variables
    const totalFrames = 60;
    let currentFrame = 0;
    
    // Animation function
    function animateStepChart() {
        if (currentFrame <= totalFrames) {
            // Calculate progress percentage
            const progress = currentFrame / totalFrames;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw chart background
            drawStepChartBackground(ctx, canvas, data.days, maxSteps);
            
            // Draw bars with animation
            drawAnimatedBars(ctx, canvas, data.days, data.steps, maxSteps, progress);
            
            currentFrame++;
            requestAnimationFrame(animateStepChart);
        }
    }
    
    // Start animation
    animateStepChart();
}

/**
 * Draw background and labels for step chart
 */
function drawStepChartBackground(ctx, canvas, days, maxSteps) {
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    const stepSize = Math.ceil(maxSteps / 5 / 1000) * 1000;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + chartHeight - (i / 5) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        
        // Add step labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText((i * stepSize).toLocaleString(), padding.left - 5, y + 3);
    }
    
    // Draw day labels
    const barWidth = chartWidth / days.length;
    days.forEach((day, index) => {
        const x = padding.left + index * barWidth + barWidth / 2;
        
        // Add day label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(day.substring(0, 3), x, canvas.height - padding.bottom + 15);
    });
    
    ctx.stroke();
}

/**
 * Draw animated bars for step chart
 */
function drawAnimatedBars(ctx, canvas, days, steps, maxSteps, progress) {
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const barWidth = (chartWidth / days.length) * 0.6; // 60% of available space for bars
    const barSpacing = (chartWidth / days.length) * 0.4 / 2; // Remaining space for spacing
    
    steps.forEach((stepCount, index) => {
        // Calculate bar height based on animation progress
        const normalizedValue = stepCount / maxSteps;
        const barHeight = normalizedValue * chartHeight * progress;
        
        // Calculate bar position
        const x = padding.left + index * (barWidth + barSpacing * 2) + barSpacing;
        const y = canvas.height - padding.bottom - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#4aa5e3';
        ctx.fillRect(x, y, barWidth, barHeight);
    });
}

/**
 * Active Time Chart
 * Renders a line chart showing active minutes per day
 */
function initializeActiveTimeChart() {
    const canvas = document.getElementById('activeTimeChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 300;
    
    // Chart data from data.js
    const data = window.appData.activeTimeData;
    
    // Find maximum active time value for scaling
    const maxTime = Math.max(...data.minutes) * 1.2; // Add 20% for margin
    
    // Animation variables
    const totalFrames = 60;
    let currentFrame = 0;
    
    // Animation function
    function animateActiveTimeChart() {
        if (currentFrame <= totalFrames) {
            // Calculate progress percentage
            const progress = currentFrame / totalFrames;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw chart background
            drawActiveTimeChartBackground(ctx, canvas, data.days, maxTime);
            
            // Draw active time line with animation
            drawAnimatedActiveTimeLine(ctx, canvas, data.days, data.minutes, maxTime, progress);
            
            currentFrame++;
            requestAnimationFrame(animateActiveTimeChart);
        }
    }
    
    // Start animation
    animateActiveTimeChart();
}

/**
 * Draw background and labels for active time chart
 */
function drawActiveTimeChartBackground(ctx, canvas, days, maxTime) {
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + chartHeight - (i / 5) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        
        // Add time labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(i * maxTime / 5), padding.left - 5, y + 3);
    }
    
    // Draw day labels
    const xStep = chartWidth / (days.length - 1);
    days.forEach((day, index) => {
        const x = padding.left + index * xStep;
        
        // Add day label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(day.substring(0, 5), x, canvas.height - padding.bottom + 15);
    });
    
    ctx.stroke();
}

/**
 * Draw animated active time line
 */
function drawAnimatedActiveTimeLine(ctx, canvas, days, minutes, maxTime, progress) {
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = '#4aa5e3';
    ctx.lineWidth = 3;
    
    // Draw line up to the current progress
    const pointsToDraw = Math.ceil(days.length * progress);
    
    for (let i = 0; i < pointsToDraw; i++) {
        const x = padding.left + (i / (days.length - 1)) * chartWidth;
        const normalizedValue = minutes[i] / maxTime;
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw area under the line
    ctx.lineTo(padding.left + ((pointsToDraw - 1) / (days.length - 1)) * chartWidth, canvas.height - padding.bottom);
    ctx.lineTo(padding.left, canvas.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = 'rgba(74, 165, 227, 0.2)';
    ctx.fill();
    
    // Draw points at each data point
    for (let i = 0; i < pointsToDraw; i++) {
        const x = padding.left + (i / (days.length - 1)) * chartWidth;
        const normalizedValue = minutes[i] / maxTime;
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = '#4aa5e3';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
export { initializeCharts };