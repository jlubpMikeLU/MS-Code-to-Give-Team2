// Dashboard NGO - Version: 2024-01-17-07-30
// This file contains the main frontend logic for the NGO dashboard

import './styles.css';

// Global state
let students = [];
let homeworkSubmissions = [];
let insights = {};

// API configuration
const API_BASE = 'http://localhost:3001/api';

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await initializeDashboard();
    // Notify parent (if embedded) about current height, and on changes
    function postHeight() {
        try {
            const height = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
            window.parent && window.parent.postMessage({ type: 'NGO_DASHBOARD_HEIGHT', height }, '*');
        } catch (e) {
            // no-op
        }
    }
    postHeight();
    // Recompute on resize and periodic fallback for dynamic content
    window.addEventListener('resize', postHeight);
    const observer = new MutationObserver(() => postHeight());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    setTimeout(postHeight, 300);
    setTimeout(postHeight, 1000);
    setTimeout(postHeight, 2000);
});

async function initializeDashboard() {
    try {
        console.log('Initializing dashboard...');
        

        
        // Fetch data
        await fetchStudents();
        await fetchInsights();
        await fetchHomeworkSubmissions();
        
        // Render components
        renderStudentsTable();
        renderInsights();
        renderHomeworkGrid();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Fetch students data
async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE}/students`);
        if (response.ok) {
            students = await response.json();
            console.log(`Fetched ${students.length} students`);
        } else {
            throw new Error('Failed to fetch students');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

// Fetch insights data
async function fetchInsights() {
    try {
        const response = await fetch(`${API_BASE}/insights`);
        if (response.ok) {
            insights = await response.json();
            console.log('Fetched insights data');
        } else {
            throw new Error('Failed to fetch insights');
        }
    } catch (error) {
        console.error('Error fetching insights:', error);
        throw error;
    }
}

// Fetch homework submissions
async function fetchHomeworkSubmissions() {
    try {
        const response = await fetch(`${API_BASE}/homework`);
        if (response.ok) {
            homeworkSubmissions = await response.json();
            console.log(`Fetched ${homeworkSubmissions.length} homework submissions`);
        } else {
            throw new Error('Failed to fetch homework submissions');
        }
    } catch (error) {
        console.error('Error fetching homework submissions:', error);
        throw error;
    }
}



// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Download report button
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    if (downloadReportBtn) {
        console.log('📥 Found download button, setting up listener...');
        // Remove any existing listener first to prevent duplicates
        downloadReportBtn.removeEventListener('click', downloadReport);
        
        // Use a more robust event listener that prevents default behavior
        downloadReportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadReport();
        });
        
        console.log('✅ Download button listener attached');
    } else {
        console.log('❌ Download button not found');
    }
    

    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterStudents);
    }
    
    // Kindergarten filter
    const kindergartenFilter = document.getElementById('kindergartenFilter');
    if (kindergartenFilter) {
        kindergartenFilter.addEventListener('change', filterStudents);
    }
    
    // CSV Upload and Import System
    initializeCSVUpload();
}

// Filter students function
function filterStudents() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedKindergarten = document.getElementById('kindergartenFilter')?.value || '';
    
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                            student.kindergarten.toLowerCase().includes(searchTerm);
        const matchesKindergarten = !selectedKindergarten || student.kindergarten === selectedKindergarten;
        
        return matchesSearch && matchesKindergarten;
    });
    
    renderFilteredStudentsTable(filteredStudents);
}

// Render filtered students table
function renderFilteredStudentsTable(filteredStudents) {
    try {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        const rows = filteredStudents.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.kindergarten}</td>
                <td>${student.averageExerciseScore.toFixed(1)}</td>
                <td>${Math.round(student.parentTimePerWeek)}</td>
                <td>
                    <div class="learning-areas-summary">
                        <span class="area-score">A: ${student.learningAreas['Alphabet Recognition']}</span>
                        <span class="area-score">S: ${student.learningAreas['Sight Word Recognition']}</span>
                        <span class="area-score">V: ${student.learningAreas['Vocabulary']}</span>
                        <span class="area-score">P: ${student.learningAreas['Point and Read']}</span>
                        <span class="area-score">Ph: ${student.learningAreas['Phonemic Awareness']}</span>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
    } catch (error) {
        console.error('Error rendering filtered students table:', error);
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Special handling for student submissions modal
        if (modalId === 'studentSubmissionsModal') {
            // Remove the modal from DOM after a short delay to allow animation
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }
}

// Insights rendering
function renderInsights() {
    try {
        if (!insights) return;
        console.log('Rendering insights with data:', insights);
        
        renderAttentionStudents();
        renderCorrelationMetrics();
        renderExerciseChart();
        renderParentTimeChart();
        renderFocusArea();
        renderParentEngagementSurvey();
    } catch (error) {
        console.error('Error rendering insights:', error);
    }
}

// Render parent engagement survey
function renderParentEngagementSurvey() {
    try {
        if (!insights.parentEngagementSurvey) return;
        
        const survey = insights.parentEngagementSurvey;
        
        // Update response rate
        const responseRate = document.getElementById('responseRate');
        if (responseRate) {
            responseRate.textContent = `${survey.responseRate}%`;
        }
        
        // Render question charts
        renderQuestionChart('question1Canvas', survey.question1, 'pie');
        renderQuestionChart('question2Canvas', survey.question2, 'doughnut');
        renderQuestionChart('question3Canvas', survey.question3, 'doughnut');
        
    } catch (error) {
        console.error('Error rendering parent engagement survey:', error);
    }
}

// Render individual question chart
function renderQuestionChart(canvasId, questionData, chartType = 'pie') {
    try {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas not found: ${canvasId}`);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error(`Cannot get 2D context for: ${canvasId}`);
            return;
        }
        
        const responses = questionData.responses;
        const labels = Object.keys(responses);
        const values = Object.values(responses);
        const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (chartType === 'pie') {
            drawPieChart(ctx, values, labels, colors, canvas.width, canvas.height);
        } else {
            drawDoughnutChart(ctx, labels, values, colors, canvas.width, canvas.height);
        }
        
    } catch (error) {
        console.error('Error rendering question chart:', error);
    }
}

// Draw pie chart
function drawPieChart(ctx, data, labels, colors, width, height) {
    const centerX = width / 2;
    const centerY = height / 2 - 15; // Move pie chart up a bit
    const radius = Math.min(width, height) / 2 - 40; // Reduce radius to make pie chart smaller
    
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let currentAngle = 0;
    
    // Draw pie slices
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Draw percentage labels INSIDE the pie slices
    ctx.fillStyle = '#ffffff'; // White text for better visibility
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    currentAngle = 0;
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.6; // Position labels at 60% of radius (inside the slice)
        
        const x = centerX + Math.cos(labelAngle) * labelRadius;
        const y = centerY + Math.sin(labelAngle) * labelRadius;
        
        const percentage = Math.round((value / total) * 100);
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(`${percentage}%`, x, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend below the pie chart (positioned higher to avoid text cutoff)
    const legendY = height - 35; // Move legend higher up
    const legendItemWidth = width / labels.length;
    const legendStartX = 5; // Reduced from 10 to move legend even more to the left
    
    labels.forEach((label, index) => {
        const x = legendStartX + (index * legendItemWidth) + (legendItemWidth / 2);
        
        // Draw color box
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x - 8, legendY - 8, 16, 16);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 8, legendY - 8, 16, 16);
        
        // Draw label text
        ctx.fillStyle = '#374151';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Shorten long labels for better fit
        let displayLabel = label;
        if (label.includes('minutes')) {
            displayLabel = label.replace('minutes', 'min');
        }
        if (displayLabel.length > 20) {
            displayLabel = displayLabel.substring(0, 17) + '...';
        }
        
        ctx.fillText(displayLabel, x, legendY + 10);
    });
}

// Draw doughnut chart
function drawDoughnutChart(ctx, labels, values, colors, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 40;
    const innerRadius = outerRadius * 0.6;
    
    const total = values.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    // Draw slices
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        // Add slice border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Draw center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Survey', centerX, centerY - 5);
    ctx.fillText('Results', centerX, centerY + 15);
    
    // Draw legend at bottom
    const legendY = height - 40;
    labels.forEach((label, index) => {
        const y = legendY + (index * 16);
        const x = 10;
        
        // Draw color box
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y - 8, 12, 12);
        
        // Draw label and percentage
        ctx.fillStyle = '#374151';
        ctx.font = '11px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(`${label}: ${values[index]}%`, x + 18, y);
    });
}

// Render students needing attention
function renderAttentionStudents() {
    try {
        const container = document.getElementById('attentionStudents');
        if (!container || !insights.studentsNeedingAttention) return;

        const items = insights.studentsNeedingAttention.map(student => `
            <div class="attention-item">
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-score">${student.averageExerciseScore.toFixed(1)}</div>
                </div>
                <div class="student-reason">
                    <strong>Needs focus:</strong> ${student.worstArea}<br>
                    <span class="performance-comparison">
                        ${student.actualValue} vs ${student.averageValue} (class average)
                        <span class="gap-indicator">-${student.worstGap} ${student.worstType === 'parent' ? 'min' : 'pts'}</span>
                    </span>
                </div>
            </div>
        `).join('');

        container.innerHTML = items;
    } catch (error) {
        console.error('Error rendering attention students:', error);
    }
}

// Render focus area section
function renderFocusArea() {
    try {
        if (!insights || !insights.focusArea) return;
        
        const focusArea = document.getElementById('focusArea');
        if (focusArea) {
            focusArea.innerHTML = `
                <div class="focus-recommendation">
                    <p><span class="focus-label">Focus area:</span> <span class="focus-area-name">${insights.focusArea.name}</span> <span class="focus-score">(${insights.focusArea.score})</span></p>
                </div>
            `;
        }
        
        renderLearningAreasChart();
    } catch (error) {
        console.error('Error rendering focus area:', error);
    }
}

// Charts rendering
function renderCharts() {
    renderExerciseChart();
    renderParentTimeChart();
}

// Render correlation metrics
function renderCorrelationMetrics() {
    if (insights.totalParentHours !== undefined) {
        document.getElementById('totalParentHours').textContent = `+${insights.totalParentHours}`;
    }
}

function renderExerciseChart() {
    const canvas = document.getElementById('exerciseChart');
    if (!canvas) {
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    
    if (insights.exerciseTrend) {
        const data = insights.exerciseTrend;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        drawLineChart(ctx, data, canvas.width, canvas.height, '#10b981');
    }
}

function renderParentTimeChart() {
    const canvas = document.getElementById('parentTimeChart');
    if (!canvas) {
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    
    if (insights.parentTimeTrend) {
        const data = insights.parentTimeTrend;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        drawLineChart(ctx, data, canvas.width, canvas.height, '#667eea');
    }
}

function renderLearningAreasChart() {
    const container = document.getElementById('learningAreasChart');
    if (!container) return;
    
    // Create canvas if it doesn't exist
    let canvas = container.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 500; // Increased width for better spacing
        canvas.height = 300; // Increased height to accommodate labels
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (insights.focusArea && insights.focusArea.learningAreaAverages) {
        const data = Object.entries(insights.focusArea.learningAreaAverages).map(([area, score]) => ({
            label: formatAreaName(area),
            value: score
        }));
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        drawBarChart(ctx, insights.focusArea.learningAreaAverages, canvas.width, canvas.height);
    }
}

// Enhanced Chart Drawing Functions
function drawLineChart(ctx, data, width, height, color = '#667eea') {
    const padding = 60; // Increased left padding for y-axis labels
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const values = data.map(d => d.averageScore || d.averageMinutes);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    
    // Create gradient background with better contrast
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (color === '#10b981') { // Exercise performance (green)
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.03)');
    } else { // Parent time (purple)
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.08)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0.03)');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Draw clearer grid lines
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)'; // Better contrast
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * chartHeight) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 7; i++) {
        const x = padding + (i * chartWidth) / 7;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Draw line with better visibility
    ctx.strokeStyle = color;
    ctx.lineWidth = 4; // Thicker line for better visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const value = point.averageScore || point.averageMinutes;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points with better visibility
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const value = point.averageScore || point.averageMinutes;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        // White background circle for better contrast
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Colored border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner colored circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // X-axis labels (weeks)
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    
    // Add x-axis title
    ctx.fillText('Week', width / 2, height - padding + 40);
    
    // Week labels
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const week = point.week || (index + 1);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter';
        ctx.fillText(`W${week}`, x, height - padding + 20);
    });
    
    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.font = 'bold 11px Inter';
    
    // Draw y-axis title with different positioning for different chart types
    ctx.save();
    if (color === '#10b981') { // Exercise performance (green)
        ctx.translate(15, height / 2); // Position for exercise chart
    } else if (color === '#667eea') { // Parent time (purple)
        ctx.translate(12, height / 2); // Move parent chart label 2 pixels to the right
    } else {
        ctx.translate(15, height / 2); // Default position
    }
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Inter, sans-serif'; // Even larger font for better visibility
    ctx.textAlign = 'center';
    
    // Dynamic y-axis title based on chart type
    if (color === '#10b981') { // Exercise performance (green)
        ctx.fillText('Score (0-100)', 0, 0);
    } else if (color === '#667eea') { // Parent time (purple)
        ctx.fillText('Time/Week (min)', 0, 0);
    } else {
        ctx.fillText('Value', 0, 0);
    }
    ctx.restore();

    // Draw chart title (only for parent time chart)
    if (color === '#667eea') { // Parent time (purple)
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Parent Time Trend', width / 2, 25);
    }

    // Draw y-axis labels and grid lines
    for (let i = 0; i < 5; i++) {
        const y = padding + (i * (height - 2 * padding)) / 4;
        // Fix: Make values increase from bottom to top
        const value = maxValue - (i * valueRange) / 4;
        
        // Format value with appropriate units
        let formattedValue = value.toFixed(1);
        let label = formattedValue;
        
        // Add units based on data type
        if (color === '#10b981') { // Exercise performance (green)
            label = `${formattedValue}`; // Remove percentage symbol
        } else if (color === '#667eea') { // Parent time (purple)
            label = `${formattedValue}`; // Remove "min" suffix
        } else {
            label = formattedValue;
        }
        
        // Set font first before measuring text - smaller font size
        ctx.font = 'bold 10px Inter, sans-serif';
        
        // Add subtle background for better visibility
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const textHeight = 14; // Reduced height
        
        // Move numbers even further left to prevent percentage symbol overlap with chart and data points
        // Different positioning for different chart types
        let labelX;
        if (color === '#10b981') { // Exercise performance (green)
            labelX = Math.max(30, padding - textWidth - 75);
        } else if (color === '#667eea') { // Parent time (purple)
            labelX = Math.max(30, padding - textWidth - 90); // Move parent chart numbers 15 pixels further left
        } else {
            labelX = Math.max(30, padding - textWidth - 75); // Default
        }
        
        // Remove white background to prevent overlap with chart background
        // Labels will be drawn directly on the chart
        
        // Make labels more visible with better contrast
        ctx.fillStyle = '#1f2937'; // Dark gray text for good contrast against green background
        ctx.font = 'bold 13px Inter, sans-serif'; // Slightly larger font for better visibility
        ctx.textAlign = 'right';
        ctx.fillText(label, labelX + textWidth, y + 4); // Adjusted y offset
        
        // Remove tick marks to prevent overlap with numbers
        // Tick marks removed for cleaner appearance
        
        // Draw horizontal grid lines (already done above, so remove duplicate)
    }
}

// Enhanced bar chart with gradients and effects
function drawBarChart(ctx, data, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Check if we have valid data
    const values = Object.values(data);
    const hasValidData = values.some(v => v && !isNaN(v) && v > 0);
    
    if (!hasValidData) {
        console.warn('No valid data to display in bar chart');
        // Draw a message indicating no data
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', width / 2, height / 2);
        return;
    }
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const labels = Object.keys(data);
    const maxValue = Math.max(...values);
    
    const barWidth = chartWidth / labels.length;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;
    
    // Draw background
    ctx.fillStyle = 'rgba(248, 250, 252, 0.8)';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * chartHeight) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars with gradients
    const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    labels.forEach((label, index) => {
        const value = data[label];
        
        // Safety check for invalid values
        if (!value || isNaN(value) || value <= 0) {
            console.warn(`Invalid value for ${label}:`, value);
            return; // Skip this bar
        }
        
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barSpacing / 2;
        const y = height - padding - barHeight;
        
        // Additional safety check for gradient coordinates
        if (y >= height - padding || y < 0 || isNaN(y)) {
            console.warn(`Invalid y coordinate for ${label}:`, y, 'barHeight:', barHeight);
            return; // Skip this bar
        }
        
        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(0, y, 0, height - padding);
        barGradient.addColorStop(0, colors[index % colors.length]);
        barGradient.addColorStop(1, colors[index % colors.length] + '80');
        
        ctx.fillStyle = barGradient;
        
        // Draw rounded rectangle manually
        const radius = 6;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + actualBarWidth - radius, y);
        ctx.quadraticCurveTo(x + actualBarWidth, y, x + actualBarWidth, y + radius);
        ctx.lineTo(x + actualBarWidth, y + barHeight - radius);
        ctx.quadraticCurveTo(x + actualBarWidth, y + barHeight, x + actualBarWidth - radius, y + barHeight);
        ctx.lineTo(x + radius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        
        // Add shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw value on top of bar
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + actualBarWidth / 2, y - 10);
        
        // Draw label below bar
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        
        const shortLabel = getShortLabel(label);
        ctx.fillText(shortLabel, x + actualBarWidth / 2, height - padding + 15);
        
        // Draw full label on multiple lines if needed (skip first row)
        // For "Sight Words" and "Point & Read", only show first row
        if (shortLabel !== label && !label.includes('Sight Word') && !label.includes('Point and Read')) {
            const words = label.split(' ');
            const lineHeight = 14;
            // Skip the first word/row and start from index 1
            for (let wordIndex = 1; wordIndex < words.length; wordIndex++) {
                ctx.fillText(words[wordIndex], x + actualBarWidth / 2, height - padding + 15 + wordIndex * lineHeight);
            }
        }
    });
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
}

// New: Sparkline Chart for quick trend visualization
function drawSparkline(ctx, data, width, height, color = '#667eea') {
    const padding = 30; // Increased padding for labels
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const values = data.map(d => d.value || d.averageScore || d.averageMinutes);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    
    // Determine color based on average value
    let chartColor = color;
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    if (avgValue >= 70) {
        chartColor = '#10b981'; // Green for high performance
    } else if (avgValue >= 50) {
        chartColor = '#f59e0b'; // Orange for medium performance
    } else {
        chartColor = '#ef4444'; // Red for low performance
    }
    
    // Draw background area
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, adjustColor(chartColor, 80));
    gradient.addColorStop(1, adjustColor(chartColor, 95));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const value = point.value || point.averageScore || point.averageMinutes;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, height - padding);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = chartColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const value = point.value || point.averageScore || point.averageMinutes;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw current value point
    if (data.length > 0) {
        const lastPoint = data[data.length - 1];
        const x = width - padding;
        const value = lastPoint.value || lastPoint.averageScore || lastPoint.averageMinutes;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.fillStyle = chartColor;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-axis labels (min, max, and middle values)
    const yLabels = [minValue, (minValue + maxValue) / 2, maxValue];
    yLabels.forEach(label => {
        const y = height - padding - ((label - minValue) / valueRange) * chartHeight;
        ctx.fillText(Math.round(label), padding - 5, y);
    });
    
    // Draw X-axis labels (week numbers)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const week = point.week || (index + 1);
        ctx.fillText(`W${week}`, x, height - padding + 5);
    });
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    yLabels.forEach(label => {
        const y = height - padding - ((label - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    });
    
    // Vertical grid lines
    data.forEach((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    });
}

// Helper function to get short labels for chart display
function getShortLabel(label) {
    if (!label) return '';
    
    // Common abbreviations for learning areas
    const abbreviations = {
        'Alphabet Recognition': 'Alphabet',
        'Sight Word Recognition': 'Sight Words',
        'Vocabulary': 'Vocab',
        'Point and Read': 'Point & Read',
        'Phonemic Awareness': 'Phonemic'
    };
    
    return abbreviations[label] || label.substring(0, 12);
}

// Students table rendering
function renderStudentsTable() {
    try {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        const rows = students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.kindergarten}</td>
                <td>${student.averageExerciseScore.toFixed(1)}</td>
                <td>${Math.round(student.parentTimePerWeek)}</td>
                <td>
                    <div class="learning-areas-summary">
                        <span class="area-score">A: ${student.learningAreas['Alphabet Recognition']}</span>
                        <span class="area-score">S: ${student.learningAreas['Sight Word Recognition']}</span>
                        <span class="area-score">V: ${student.learningAreas['Vocabulary']}</span>
                        <span class="area-score">P: ${student.learningAreas['Point and Read']}</span>
                        <span class="area-score">Ph: ${student.learningAreas['Phonemic Awareness']}</span>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
    } catch (error) {
        console.error('Error rendering students table:', error);
    }
}

function getScoreClass(score) {
    if (score < 75) return 'low';
    if (score < 85) return 'medium';
    return '';
}

// Homework grid rendering
function renderHomeworkGrid() {
    const container = document.getElementById('homeworkGrid');
    container.innerHTML = '';

    // Group submissions by student
    const studentSubmissions = {};
    homeworkSubmissions.forEach(submission => {
        if (!studentSubmissions[submission.studentId]) {
            studentSubmissions[submission.studentId] = [];
        }
        studentSubmissions[submission.studentId].push(submission);
    });

    // Create a scrollable wrapper
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'homework-scroll-container';
    
    // Create cards for ALL students (even those without submissions)
    students.forEach(student => {
        const submissions = studentSubmissions[student.id] || [];
        
        const card = document.createElement('div');
        card.className = 'homework-card student-homework-card';
        
        // Count submissions by type
        const typeCounts = submissions.reduce((acc, sub) => {
            acc[sub.type] = (acc[sub.type] || 0) + 1;
            return acc;
        }, {});
        
        // Get latest submission date
        const latestDate = submissions.length > 0 
            ? new Date(Math.max(...submissions.map(s => new Date(s.submittedAt)))).toLocaleDateString()
            : 'No submissions yet';
        
        card.innerHTML = `
            <div class="homework-header">
                <div>
                    <div class="homework-student">${student.name}</div>
                    <div class="homework-kindergarten">${student.kindergarten}</div>
                </div>
                <div class="homework-type-counts">
                    ${Object.entries(typeCounts).length > 0 
                        ? Object.entries(typeCounts).map(([type, count]) => `
                            <span class="type-count ${type}">${type}: ${count}</span>
                        `).join('')
                        : '<span class="no-submissions">No submissions</span>'
                    }
                </div>
            </div>
            <div class="homework-summary">
                <p><strong>Total Submissions:</strong> ${submissions.length}</p>
                <p><strong>Latest Submission:</strong> ${latestDate}</p>
                <p><strong>Average Score:</strong> ${
                    submissions.length > 0 
                        ? Math.round(submissions.filter(s => s.score).reduce((sum, s) => sum + s.score, 0) / submissions.filter(s => s.score).length) || 'N/A'
                        : 'N/A'
                }</p>
            </div>
            <div class="homework-recent-submissions">
                <h4>Recent Submissions:</h4>
                ${submissions.length > 0 
                    ? submissions.slice(-3).reverse().map(submission => `
                        <div class="recent-submission">
                            <span class="submission-type ${submission.type}">${submission.type}</span>
                            <span class="submission-content">${submission.content.length > 30 ? submission.content.substring(0, 30) + '...' : submission.content}</span>
                            <span class="submission-score">${submission.score ? submission.score + '/100' : 'Pending'}</span>
                        </div>
                    `).join('')
                    : '<p class="no-submissions">No submissions yet</p>'
                }
            </div>
            <div class="homework-actions">
                ${submissions.length > 0 
                    ? `<button class="btn btn-sm btn-primary" onclick="viewStudentSubmissions('${student.id}')">
                        <i class="fas fa-eye"></i>
                        View All (${submissions.length})
                    </button>`
                    : `<button class="btn btn-sm btn-secondary" disabled>
                        <i class="fas fa-eye"></i>
                        No Submissions
                    </button>`
                }
            </div>
        `;
        scrollWrapper.appendChild(card);
    });
    
    container.appendChild(scrollWrapper);
}

// Filter and search functions
function populateFilters() {
    const kindergartenFilter = document.getElementById('kindergartenFilter');
    const kindergartens = [...new Set(students.map(s => s.kindergarten))];
    
    kindergartens.forEach(kindergarten => {
        const option = document.createElement('option');
        option.value = kindergarten;
        option.textContent = kindergarten;
        kindergartenFilter.appendChild(option);
    });
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.kindergarten.toLowerCase().includes(searchTerm)
    );
    renderFilteredStudents(filteredStudents);
}

function handleFilter() {
    const selectedKindergarten = document.getElementById('kindergartenFilter').value;
    const filteredStudents = selectedKindergarten 
        ? students.filter(student => student.kindergarten === selectedKindergarten)
        : students;
    renderFilteredStudents(filteredStudents);
}

function renderFilteredStudents(filteredStudents) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="student-name">${student.name}</td>
            <td class="kindergarten">${student.kindergarten}</td>
            <td class="score ${getScoreClass(student.averageExerciseScore)}">${student.averageExerciseScore.toFixed(1)}</td>
            <td class="score">${Math.round(student.parentTimePerWeek.reduce((a, b) => a + b, 0) / student.parentTimePerWeek.length)}</td>
            <td class="learning-areas">
                ${Object.entries(student.learningAreas).map(([area, score]) => `
                    <div class="area-score">
                        <span class="area-name">${formatAreaName(area)}</span>
                        <span class="area-value">${score}</span>
                    </div>
                `).join('')}
            </td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="viewStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Form handling
function populateStudentSelect() {
    const select = document.getElementById('studentSelect');
    select.innerHTML = '<option value="">Select a student...</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} - ${student.kindergarten}`;
        select.appendChild(option);
    });
}

async function handleHomeworkSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        studentId: formData.get('studentSelect'),
        type: formData.get('homeworkType'),
        content: formData.get('homeworkContent')
    };
    
    try {
        const response = await fetch(`${API_BASE}/homework`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const newSubmission = await response.json();
            homeworkSubmissions.push(newSubmission);
            renderHomeworkGrid();
            closeModal('homeworkModal');
            event.target.reset();
            showNotification('Homework submission added successfully!', 'success');
        } else {
            throw new Error('Failed to add homework submission');
        }
    } catch (error) {
        console.error('Error adding homework:', error);
        showNotification('Error adding homework submission', 'error');
    }
}

async function handleFeedbackSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        score: parseInt(formData.get('feedbackScore')),
        feedback: formData.get('feedbackText')
    };
    
    const submissionId = document.getElementById('feedbackSubmissionId').value;
    
    try {
        const response = await fetch(`${API_BASE}/homework/${submissionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const updatedSubmission = await response.json();
            const index = homeworkSubmissions.findIndex(h => h.id === submissionId);
            if (index !== -1) {
                homeworkSubmissions[index] = updatedSubmission;
                renderHomeworkGrid();
            }
            closeModal('feedbackModal');
            event.target.reset();
            showNotification('Feedback updated successfully!', 'success');
        } else {
            throw new Error('Failed to update feedback');
        }
    } catch (error) {
        console.error('Error updating feedback:', error);
        showNotification('Error updating feedback', 'error');
    }
}

// Utility functions
function formatAreaName(area) {
    return area.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Download comprehensive report
let isDownloading = false; // Prevent multiple simultaneous downloads

async function downloadReport() {
    // Prevent multiple downloads
    if (isDownloading) {
        console.log('⏳ Download already in progress, ignoring click');
        return;
    }
    
    console.log('🚀 Download report function called!', new Date().toISOString());
    isDownloading = true;
    
    try {
        const response = await fetch(`${API_BASE}/report/pdf`);
        if (response.ok) {
            const blob = await response.blob();
            
            // Try using the browser's native download behavior
            try {
                // Method 1: Try using the browser's download API
                if (navigator.msSaveBlob) {
                    // For IE
                    navigator.msSaveBlob(blob, 'ngo-k3-performance-report.pdf');
                } else {
                    // For modern browsers - create a temporary link
                    const url = window.URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = 'ngo-k3-performance-report.pdf';
                    downloadLink.style.display = 'none';
                    
                    // Add to DOM, click, and remove immediately
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    // Clean up the object URL
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 100);
                }
            } catch (downloadError) {
                console.log('Download method failed, trying alternative:', downloadError);
                
                // Fallback method - direct blob download
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                
                // Clean up after a delay
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 1000);
            }
            
            showNotification('Report downloaded successfully!', 'success');
        } else {
            throw new Error('Failed to generate report');
        }
    } catch (error) {
        console.error('Error downloading report:', error);
        showNotification('Error downloading report', 'error');
        isDownloading = false;
    }
}

// Show student submissions modal
function showStudentSubmissionsModal(student, submissions) {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('studentSubmissionsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="studentSubmissionsModal" class="modal">
            <div class="modal-content wide-modal">
                <div class="modal-header">
                    <h3>${student.name} - All Homework Submissions</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="student-info">
                        <p><strong>Kindergarten:</strong> ${student.kindergarten}</p>
                        <p><strong>Total Submissions:</strong> ${submissions.length}</p>
                    </div>
                    <div class="submissions-list">
                        ${submissions.map(submission => `
                            <div class="submission-item">
                                <div class="submission-header">
                                    <span class="submission-type ${submission.type}">${submission.type}</span>
                                    <span class="submission-date">${new Date(submission.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <div class="submission-content">
                                    <p><strong>Content:</strong> ${submission.content}</p>
                                    ${submission.score ? `<p><strong>Score:</strong> ${submission.score}/100</p>` : '<p><strong>Score:</strong> <em>Pending</em></p>'}
                                    ${submission.feedback ? `<p><strong>Feedback:</strong> ${submission.feedback}</p>` : '<p><strong>Feedback:</strong> <em>None</em></p>'}
                                </div>
                                <div class="submission-actions">
                                    <button class="btn btn-sm btn-primary" onclick="editFeedback('${submission.id}')">
                                        <i class="fas fa-edit"></i>
                                        ${submission.score ? 'Edit' : 'Add'} Feedback
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('studentSubmissionsModal');
    modal.style.display = 'block';
    
    // Add event listeners for closing
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        closeModal('studentSubmissionsModal');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal('studentSubmissionsModal');
        }
    });
    
    // Close modal with Escape key
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeModal('studentSubmissionsModal');
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#667eea'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Global functions for onclick handlers
window.viewStudentDetails = function(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        alert(`Student Details:\nName: ${student.name}\nKindergarten: ${student.kindergarten}\nAverage Score: ${student.averageExerciseScore.toFixed(1)}`);
    }
};

window.editFeedback = function(submissionId) {
    const submission = homeworkSubmissions.find(h => h.id === submissionId);
    if (submission) {
        document.getElementById('feedbackSubmissionId').value = submissionId;
        document.getElementById('feedbackScore').value = submission.score || '';
        document.getElementById('feedbackText').value = submission.feedback || '';
        openModal('feedbackModal');
    }
};

window.viewStudentSubmissions = function(studentId) {
    const student = students.find(s => s.id === studentId);
    const submissions = homeworkSubmissions.filter(h => h.studentId === studentId);
    
    if (student && submissions.length > 0) {
        showStudentSubmissionsModal(student, submissions);
    }
};



// CSV Upload and Import System
function initializeCSVUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const importStatus = document.getElementById('importStatus');
    const statusMessage = document.getElementById('statusMessage');

    // Browse button click
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processCSVFile(file);
        }
    });

    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                processCSVFile(file);
            } else {
                showImportStatus('Please select a valid CSV file', 'error');
            }
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// Process CSV file
function processCSVFile(file) {
    showImportStatus('Reading CSV file...', 'processing');
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvContent = e.target.result;
            const parsedData = parseCSV(csvContent);
            
            if (validateCSVData(parsedData)) {
                showImportStatus('Validating data structure...', 'processing');
                
                // Transform CSV data to our format
                const transformedData = transformCSVToStudents(parsedData);
                
                showImportStatus('Importing data...', 'processing');
                
                // Update the dashboard with new data
                updateDashboardWithNewData(transformedData);
                
                showImportStatus('Data imported successfully! Dashboard updated.', 'success');
                
                // Clear file input
                document.getElementById('fileInput').value = '';
                
            } else {
                showImportStatus('Invalid CSV structure. Please check your file format.', 'error');
            }
        } catch (error) {
            console.error('Error processing CSV:', error);
            showImportStatus('Error processing CSV file. Please try again.', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Parse CSV content
function parseCSV(csvContent) {
    console.log('=== CSV Parsing Debug ===');
    console.log('Raw CSV content length:', csvContent.length);
    console.log('First 500 characters:', csvContent.substring(0, 500));
    
    const lines = csvContent.split('\n');
    console.log('Number of lines:', lines.length);
    console.log('First line:', lines[0]);
    console.log('Second line:', lines[1]);
    
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('Parsed headers:', headers);
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            console.log(`Line ${i} values:`, values);
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            console.log(`Line ${i} parsed row:`, row);
            data.push(row);
        }
    }
    
    console.log('Final parsed data:', data);
    return { headers, data };
}

// Validate CSV data structure
function validateCSVData(parsedData) {
    const requiredHeaders = [
        'ID', 'Name', 'Kindergarten', 'Week1_Score', 'Week2_Score', 'Week3_Score', 
        'Week4_Score', 'Week5_Score', 'Week6_Score', 'Week7_Score', 'Week8_Score',
        'Average_Exer', 'Parent_Time', 'Alphabet_Re', 'Sight_Word_I', 'Vocabulary_S',
        'Point_and_R', 'Phonemic_Av', 'Week1_Attempts', 'Week2_Attempts', 'Week3_Attempts',
        'Week4_Attempts', 'Week5_Attempts', 'Week6_Attempts', 'Week7_Attempts', 'Week8_Attempts'
    ];
    
    console.log('Found CSV headers:', parsedData.headers);
    console.log('Expected headers:', requiredHeaders);
    
    // Check for basic required fields (more flexible)
    const essentialHeaders = ['ID', 'Name', 'Kindergarten'];
    const missingEssential = essentialHeaders.filter(header => 
        !parsedData.headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (missingEssential.length > 0) {
        console.error('Missing essential headers:', missingEssential);
        showImportStatus(`Missing essential columns: ${missingEssential.join(', ')}. Please check your CSV file.`, 'error');
        return false;
    }
    
    if (parsedData.data.length === 0) {
        console.error('No data rows found');
        showImportStatus('No data rows found in CSV file.', 'error');
        return false;
    }
    
    // Check if we have at least some score columns
    const hasScoreColumns = parsedData.headers.some(header => 
        header.toLowerCase().includes('score') || header.toLowerCase().includes('week')
    );
    
    if (!hasScoreColumns) {
        console.error('No score columns found');
        showImportStatus('No weekly score columns found. Please check your CSV format.', 'error');
        return false;
    }
    
    console.log('CSV validation passed');
    return true;
}

// Transform CSV data to student objects
function transformCSVToStudents(parsedData) {
    console.log('=== CSV Transformation Debug ===');
    console.log('CSV Headers found:', parsedData.headers);
    console.log('First row data:', parsedData.data[0]);
    
    return parsedData.data.map((row, index) => {
        console.log(`\n--- Processing Student ${index + 1} ---`);
        console.log('Raw row data:', row);
        
        // Log what we're trying to extract
        console.log('ID:', row.ID);
        console.log('Name:', row.Name);
        console.log('Kindergarten:', row.Kindergarten);
        console.log('Week1_Score:', row.Week1_Score);
        console.log('Average_Exercise_Score:', row.Average_Exercise_Score);
        console.log('Parent_Time_Per_Week_Minutes:', row.Parent_Time_Per_Week_Minutes);
        console.log('Week1_Attempts:', row.Week1_Attempts);
        
        // Calculate average exercise score from weekly scores if not provided
        const weeklyScores = [
            parseInt(row.Week1_Score) || 0,
            parseInt(row.Week2_Score) || 0,
            parseInt(row.Week3_Score) || 0,
            parseInt(row.Week4_Score) || 0,
            parseInt(row.Week5_Score) || 0,
            parseInt(row.Week6_Score) || 0,
            parseInt(row.Week7_Score) || 0,
            parseInt(row.Week8_Score) || 0
        ];
        
        const calculatedAverage = weeklyScores.reduce((sum, score) => sum + score, 0) / weeklyScores.length;
        
        const student = {
            id: row.ID || (index + 1).toString(),
            name: row.Name,
            kindergarten: row.Kindergarten,
            exerciseScores: weeklyScores,
            averageExerciseScore: parseFloat(row.Average_Exercise_Score) || calculatedAverage,
            parentTimePerWeek: parseInt(row.Parent_Time_Per_Week_Minutes) || 0,
            // Since learning areas are not in CSV, we'll estimate them based on exercise performance
            learningAreas: {
                'Alphabet Recognition': Math.round(calculatedAverage * 0.9), // Estimate based on overall performance
                'Sight Word Recognition': Math.round(calculatedAverage * 0.85),
                'Vocabulary': Math.round(calculatedAverage * 0.95),
                'Point and Read': Math.round(calculatedAverage * 0.88),
                'Phonemic Awareness': Math.round(calculatedAverage * 0.82)
            },
            attemptsPerWeek: [
                parseInt(row.Week1_Attempts) || 0,
                parseInt(row.Week2_Attempts) || 0,
                parseInt(row.Week3_Attempts) || 0,
                parseInt(row.Week4_Attempts) || 0,
                parseInt(row.Week5_Attempts) || 0,
                parseInt(row.Week6_Attempts) || 0,
                parseInt(row.Week7_Attempts) || 0,
                parseInt(row.Week8_Attempts) || 0
            ]
        };
        
        console.log('Transformed student:', student);
        return student;
    });
}

// Update dashboard with new data
async function updateDashboardWithNewData(newStudents) {
    console.log('=== Starting dashboard update ===');
    console.log('New students data:', newStudents);
    console.log('Students count:', newStudents.length);
    console.log('First student sample:', newStudents[0]);
    
    try {
        // Prepare the request payload
        const payload = { students: newStudents };
        console.log('Request payload:', payload);
        console.log('Payload JSON:', JSON.stringify(payload));
        
        // First, send the new data to the backend
        console.log('Sending request to:', `${API_BASE}/students/update`);
        const updateResponse = await fetch(`${API_BASE}/students/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Update response status:', updateResponse.status);
        console.log('Update response ok:', updateResponse.ok);
        
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Update response error:', errorText);
            throw new Error(`Backend update failed: ${updateResponse.status} ${errorText}`);
        }
        
        const updateResult = await updateResponse.json();
        console.log('Backend update result:', updateResult);
        console.log('Backend data updated successfully');
        
        // Update global students array
        window.students = newStudents;
        students = newStudents; // Also update the local variable
        
        console.log('Local students array updated, count:', students.length);
        
        // Fetch fresh insights from the backend with new data
        console.log('Fetching fresh insights...');
        const insightsResponse = await fetch(`${API_BASE}/insights`);
        console.log('Insights response status:', insightsResponse.status);
        
        if (insightsResponse.ok) {
            insights = await insightsResponse.json();
            console.log('Fresh insights fetched:', insights);
        } else {
            console.error('Failed to fetch insights:', insightsResponse.status);
            const errorText = await insightsResponse.text();
            console.error('Insights error text:', errorText);
        }
        
        // Re-render all dashboard components
        console.log('Re-rendering dashboard components...');
        renderStudentsTable();
        renderCharts();
        renderInsights();
        
        // Show success message
        showNotification('CSV data imported successfully! Dashboard updated with ' + newStudents.length + ' students.', 'success');
        
        console.log('=== Dashboard update completed successfully ===');
        console.log('Final students count:', students.length);
    } catch (error) {
        console.error('=== Error updating dashboard ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        showNotification('Error updating dashboard: ' + error.message, 'error');
    }
}

// Show import status
function showImportStatus(message, type = 'processing') {
    const importStatus = document.getElementById('importStatus');
    const statusMessage = document.getElementById('statusMessage');
    
    statusMessage.textContent = message;
    importStatus.style.display = 'block';
    
    // Update styling based on type
    importStatus.className = `import-status status-${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            importStatus.style.display = 'none';
        }, 3000);
    }
} 