const getShortMonthName = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1]; // monthNumber is 1-indexed from MongoDB aggregation
};

const getDayMonthLabel = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
};

const getTimeInMinute = (time) => {
    return Math.round(time / 60);
}

function getYYYYMMDD(dateInput) {
    const date = new Date(dateInput);
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
}

export function initializeCharts(dailyData = [], stepsData = [], monthlyWeightData = []) {
    console.log("initializeCharts called with dailyData:", dailyData, "stepsData:", [stepsData], "and monthlyWeightData:", monthlyWeightData);
    initializeWeightChangeChart(monthlyWeightData);
    initializeStepCountsChart([stepsData]);
    initializeActiveTimeChart(dailyData);
}

/**
 * @param {Array} monthlyWeightData - Array of objects { month, year, weight }
 */
function initializeWeightChangeChart(monthlyWeightData) {
    const canvas = document.getElementById('weightChangeChart');
    if (!canvas) {
        console.warn("Weight Change Chart canvas not found. Skipping chart drawing.");
        return;
    }
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    const totalFrames = 60;

    // Use a ResizeObserver to handle canvas resizing and redraw
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === canvas.parentElement) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight; 

                if (monthlyWeightData && monthlyWeightData.length > 0) {
                    currentFrame = 0;
                    animateWeightChart(); 
                } else {
                    // Display no data message if no data is available
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.font = '14px Inter'; 
                    ctx.textAlign = 'center';
                    ctx.fillText("No monthly weight data available.", canvas.width / 2, canvas.height / 2);
                }
            }
        }
    });

    // Start observing the canvas's parent element for size changes
    resizeObserver.observe(canvas.parentElement);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Process data for chart
    const labels = monthlyWeightData.map(d => `${getShortMonthName(d.month)} ${d.year % 100}`); 
    const weights = monthlyWeightData.map(d => d.latest_weight);

    // Calculate min/max weight for Y-axis scaling
    const validWeights = weights.filter(w => w !== null && typeof w !== 'undefined');
    const minWeight = validWeights.length > 0 ? Math.floor(Math.min(...validWeights)) - 5 : 50; 
    const maxWeight = validWeights.length > 0 ? Math.ceil(Math.max(...validWeights)) + 5 : 100;

    console.log("Weight Chart - Processed weights:", weights);

    if (validWeights.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("No monthly weight data available.", canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Animation loop for the weight chart
    function animateWeightChart() {
        if (currentFrame <= totalFrames) {
            const progress = currentFrame / totalFrames;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for each frame
            drawChartGrid(ctx, canvas, labels, minWeight, maxWeight, 'Weight (kg)'); 
        
            drawAnimatedLine(
                ctx, 
                labels, 
                weights, 
                minWeight, 
                maxWeight, 
                canvas, 
                progress, 
                '#ffffff', // White color for the actual weight line (from your code)
                3
            );
            
            currentFrame++;
            requestAnimationFrame(animateWeightChart); // Request next frame
        }
    }
    animateWeightChart(); // Start the animation
}
/**
 * Draws grid lines and labels for the X and Y axes.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Array<string>} xLabels - Array of labels for the X-axis.
 * @param {number} yMinVal - Minimum value for the Y-axis.
 * @param {number} yMaxVal - Maximum value for the Y-axis.
 * @param {string} yAxisLabel - Label for the Y-axis (e.g., 'Steps', 'Time (min)').
 */
function drawChartGrid(ctx, canvas, xLabels, yMinVal, yMaxVal, yAxisLabel = '') {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }; // Increased left padding for Y-axis label
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines and Y-axis labels
    const numHorizontalLines = 5;
    const range = yMaxVal - yMinVal;
    const roundedMax = Math.ceil(range / numHorizontalLines) * numHorizontalLines;
    const valueStep = roundedMax / numHorizontalLines;
    for (let i = 0; i <= numHorizontalLines; i++) {
        const y = padding.top + chartHeight - (i / numHorizontalLines) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        
        const rawVal = yMinVal + i * valueStep;
        const displayVal = Math.round(rawVal); // Always integer

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(displayVal.toLocaleString(), padding.left - 5, y + 3);
    }

    // Draw Y-axis label
    if (yAxisLabel) {
        ctx.save();
        ctx.translate(padding.left - 35, canvas.height / 2); // Position for Y-axis label
        ctx.rotate(-Math.PI / 2); // Rotate text 90 degrees
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Arial';
        ctx.fillText(yAxisLabel, 0, 0);
        ctx.restore();
    }
    
    // Draw X-axis labels
    // Adjust xStep calculation for line charts vs. bar charts
    const xStep = chartWidth / (xLabels.length - 1 || 1); // For line charts
    xLabels.forEach((label, index) => {
        const x = padding.left + index * xStep;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, canvas.height - padding.bottom + 15);
    });
    
    ctx.stroke(); // Render all paths
}


/**
 * Draws an animated line chart on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {Array<string>} labels - X-axis labels (for point mapping).
 * @param {Array<number>} values - Y-axis data values.
 * @param {number} minVal - Minimum Y-axis value for scaling.
 * @param {number} maxVal - Maximum Y-axis value for scaling.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {number} progress - Animation progress (0 to 1).
 * @param {string} color - Line color.
 * @param {number} lineWidth - Line width.
 */
function drawAnimatedLine(ctx, labels, values, minVal, maxVal, canvas, progress, color, lineWidth) {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }; // Consistent padding with grid
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    const pointsToDraw = Math.ceil(labels.length * progress);
    
    for (let i = 0; i < pointsToDraw; i++) {
        if (values[i] === null || typeof values[i] === 'undefined') {
            if (i + 1 < labels.length && (values[i+1] !== null && typeof values[i+1] !== 'undefined')) {
                const nextX = padding.left + ((i + 1) / (labels.length - 1 || 1)) * chartWidth;
                const nextNormalizedValue = (values[i+1] - minVal) / (maxVal - minVal);
                const nextY = padding.top + chartHeight - nextNormalizedValue * chartHeight;
                ctx.moveTo(nextX, nextY);
            }
            continue; 
        }

        const x = padding.left + (i / (labels.length - 1 || 1)) * chartWidth; 
        const normalizedValue = (values[i] - minVal) / (maxVal - minVal);
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        if (i === 0 || values[i-1] === null || typeof values[i-1] === 'undefined') { 
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke(); 
    
    for (let i = 0; i < pointsToDraw; i++) {
        if (values[i] === null || typeof values[i] === 'undefined') {
            continue; 
        }
        const x = padding.left + (i / (labels.length - 1 || 1)) * chartWidth;
        const normalizedValue = (values[i] - minVal) / (maxVal - minVal);
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = color; // Use line color for circles
        ctx.arc(x, y, 4, 0, Math.PI * 2); // Draw a circle
        ctx.fill();
    }
}


/**
 * Step Counts Chart
 * @param {Array} dailyStepsData - Array of objects { date, steps, active_time, calories_burned }
 */
function initializeStepCountsChart(dailyStepsData) {
    const canvas = document.getElementById('stepCountsChart');
    if (!canvas) {
        console.warn("Step Counts Chart canvas not found. Skipping chart drawing.");
        return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 300;
    
    const labels = dailyStepsData.map(d => getDayMonthLabel(d.createdAt)); 
    const values = dailyStepsData.map(d => d.total_steps);

    if (values.length === 0 || values.every(v => v === 0)) { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("No daily step data available.", canvas.width / 2, canvas.height / 2);
        return;
    }

    const maxSteps = Math.max(...values) * 1.2; 
    const displayMaxSteps = maxSteps > 0 ? maxSteps : 10000;
    
    const totalFrames = 60;
    let currentFrame = 0;
    
    // Animation loop for the step chart
    function animateStepChart() {
        if (currentFrame <= totalFrames) {
            const progress = currentFrame / totalFrames;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for each frame
            drawChartGrid(ctx, canvas, labels, 0, displayMaxSteps, 'Steps'); // Y-axis starts from 0
            
            drawAnimatedBars(ctx, canvas, labels, values, displayMaxSteps, progress, '#4aa5e3'); // Blue bars
            
            currentFrame++;
            requestAnimationFrame(animateStepChart); // Request next frame
        }
    }
    animateStepChart(); // Start the animation
}

/**
 * Draws animated bar chart columns on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Array<string>} labels - X-axis labels (for bar positioning).
 * @param {Array<number>} values - Y-axis data values.
 * @param {number} maxVal - Maximum Y-axis value for scaling.
 * @param {number} progress - Animation progress (0 to 1).
 * @param {string} color - Bar color.
 */
function drawAnimatedBars(ctx, canvas, labels, values, maxVal, progress, color) {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }; // Consistent padding
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const barTotalWidth = chartWidth / labels.length; // Total space per bar (bar + spacing)
    const barWidth = barTotalWidth * 0.6; // 60% of available space for the bar itself
    const barOffset = barTotalWidth * 0.2; // 20% offset for centering the bar within its allocated space
    
    values.forEach((value, index) => {
        // Ensure value is a number, default to 0 if null/undefined
        const currentVal = value !== null && typeof value !== 'undefined' ? value : 0;
        const normalizedValue = currentVal / maxVal;
        const barHeight = normalizedValue * chartHeight * progress; // Apply animation progress
        
        const x = padding.left + index * barTotalWidth + barOffset;
        const y = canvas.height - padding.bottom - barHeight; // Y-coordinate for the top of the bar
        
        ctx.fillStyle = color; // Bar color
        ctx.fillRect(x, y, barWidth, barHeight); // Draw the bar
    });
}


/**
 * Active Time Chart
 * @param {Array} dailyProgressData - Array of objects { workout_date, duration } (Assuming these are the relevant fields from your backend)
 */
function initializeActiveTimeChart(dailyProgressData) {
    const canvas = document.getElementById('activeTimeChart');
    if (!canvas) {
        console.warn("Active Time Chart canvas not found. Skipping chart drawing.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 300;

    const aggregatedData = {};
    dailyProgressData.forEach(d => {
        const dateKey = getYYYYMMDD(d.workout_date);
        const durationInMinutes = getTimeInMinute(d.duration);
        if (aggregatedData[dateKey]) {
            aggregatedData[dateKey] += durationInMinutes;
        } else {
            aggregatedData[dateKey] = durationInMinutes;
        }
    });

    let startDate = null;
    let endDate = null;

    if (dailyProgressData.length > 0) {
        // Find the earliest and latest dates from the original data
        startDate = new Date(Math.min(...dailyProgressData.map(d => new Date(d.workout_date))));
        endDate = new Date(Math.max(...dailyProgressData.map(d => new Date(d.workout_date))));
    } else {
        // If no data, use a default range (e.g., last 7 days from today)
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 6); // Last 7 days including today
    }

    // Adjust start and end dates to be at the beginning of the day for consistent iteration
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Second pass: Fill in missing days with 0 and create final sorted data array
    const chartData = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dateKey = getYYYYMMDD(currentDate);
        chartData.push({
            date: new Date(currentDate), // Keep as Date object for easier handling
            activeTime: aggregatedData[dateKey] || 0 // Use aggregated value or 0 if no record
        });
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    chartData.sort((a, b) => a.date - b.date); // Ensure sorting for chronological display

    // --- CORRECTED LINES HERE ---
    // Process data for chart from the aggregated and filled chartData
    const labels = chartData.map(d => getDayMonthLabel(d.date)); // Use d.date from chartData
    const values = chartData.map(d => d.activeTime); // Use d.activeTime from chartData
    // --- END CORRECTED LINES ---


    // Display a message if no data (after processing, this means no recorded activity or range)
    if (values.length === 0 || values.every(v => v === 0)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("No daily active time data available.", canvas.width / 2, canvas.height / 2);
        return;
    }

    const maxTime = Math.max(...values) * 1.2;
    const displayMaxTime = maxTime > 0 ? maxTime : 60;

    const totalFrames = 60;
    let currentFrame = 0;

    function animateActiveTimeChart() {
        if (currentFrame <= totalFrames) {
            const progress = currentFrame / totalFrames;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawChartGrid(ctx, canvas, labels, 0, displayMaxTime, 'Time (min)');

            drawAnimatedActiveTimeLine(ctx, canvas, labels, values, displayMaxTime, progress);

            currentFrame++;
            requestAnimationFrame(animateActiveTimeChart);
        }
    }
    animateActiveTimeChart();
}

/**
 * Special Animated Line Drawing Function for Active Time with Area Fill
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Array<string>} labels - X-axis labels (for point mapping).
 * @param {Array<number>} values - Y-axis data values.
 * @param {number} maxVal - Maximum Y-axis value for scaling.
 * @param {number} progress - Animation progress (0 to 1).
 */
function drawAnimatedActiveTimeLine(ctx, canvas, labels, values, maxVal, progress) {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }; 
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.beginPath();
    ctx.strokeStyle = '#4aa5e3';
    ctx.lineWidth = 3;
    
    const pointsToDraw = Math.ceil(labels.length * progress);
    
    // Draw the line
    for (let i = 0; i < pointsToDraw; i++) {
        if (values[i] === null || typeof values[i] === 'undefined') {
            if (i + 1 < labels.length && (values[i+1] !== null && typeof values[i+1] !== 'undefined')) {
                const nextX = padding.left + ((i + 1) / (labels.length - 1 || 1)) * chartWidth;
                const nextNormalizedValue = (values[i+1] - 0) / (maxVal - 0); // Y-axis starts from 0
                const nextY = padding.top + chartHeight - nextNormalizedValue * chartHeight;
                ctx.moveTo(nextX, nextY);
            }
            continue; 
        }

        const x = padding.left + (i / (labels.length - 1 || 1)) * chartWidth;
        const normalizedValue = values[i] / maxVal;
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        if (i === 0 || values[i-1] === null || typeof values[i-1] === 'undefined') { 
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke(); 

    // Draw the area fill beneath the line
    if (pointsToDraw > 0) {
        // Ensure the path is closed for filling
        const lastValidIndex = pointsToDraw - 1;
        let lastX = padding.left + (lastValidIndex / (labels.length - 1 || 1)) * chartWidth;
        let lastY = padding.top + chartHeight - (values[lastValidIndex] / maxVal) * chartHeight;

        // Ensure we find a valid last point if the last value is null
        for (let i = pointsToDraw - 1; i >= 0; i--) {
            if (values[i] !== null && typeof values[i] !== 'undefined') {
                lastX = padding.left + (i / (labels.length - 1 || 1)) * chartWidth;
                lastY = padding.top + chartHeight - (values[i] / maxVal) * chartHeight;
                break;
            }
        }
        
        ctx.lineTo(lastX, canvas.height - padding.bottom); 
        ctx.lineTo(padding.left, canvas.height - padding.bottom); 
        ctx.closePath(); 
        ctx.fillStyle = 'rgba(74, 165, 227, 0.2)';
        ctx.fill();
    }
    
    for (let i = 0; i < pointsToDraw; i++) {
        if (values[i] === null || typeof values[i] === 'undefined') {
            continue; 
        }
        const x = padding.left + (i / (labels.length - 1 || 1)) * chartWidth;
        const normalizedValue = values[i] / maxVal;
        const y = padding.top + chartHeight - normalizedValue * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = '#4aa5e3';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
