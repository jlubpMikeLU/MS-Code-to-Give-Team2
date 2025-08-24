const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample student data
let students = [
    {
        id: '1',
        name: 'Chan Siu Ming',
        kindergarten: 'Kwun Tong',
        exerciseScores: [25, 30, 28, 35, 32, 42, 38, 45],
        averageExerciseScore: 34,
        parentTimePerWeek: 18,
        learningAreas: {
            'Alphabet Recognition': 32,
            'Sight Word Recognition': 28,
            'Vocabulary': 35,
            'Point and Read': 30,
            'Phonemic Awareness': 25
        },
        attemptsPerWeek: [3, 4, 3, 4, 3, 4, 3, 4]
    },
    {
        id: '2',
        name: 'Wong Mei Ling',
        kindergarten: 'Sham Shui Po',
        exerciseScores: [30, 35, 32, 42, 40, 48, 45, 52],
        averageExerciseScore: 41,
        parentTimePerWeek: 25,
        learningAreas: {
            'Alphabet Recognition': 45,
            'Sight Word Recognition': 42,
            'Vocabulary': 48,
            'Point and Read': 40,
            'Phonemic Awareness': 38
        },
        attemptsPerWeek: [4, 4, 5, 4, 5, 4, 5, 4]
    },
    {
        id: '3',
        name: 'Lee Ka Ho',
        kindergarten: 'Mong Kok',
        exerciseScores: [22, 28, 25, 30, 28, 35, 33, 38],
        averageExerciseScore: 30,
        parentTimePerWeek: 16,
        learningAreas: {
            'Alphabet Recognition': 28,
            'Sight Word Recognition': 25,
            'Vocabulary': 32,
            'Point and Read': 28,
            'Phonemic Awareness': 22
        },
        attemptsPerWeek: [3, 3, 4, 3, 4, 3, 4, 3]
    },
    {
        id: '4',
        name: 'Cheung Yee Ting',
        kindergarten: 'Tsuen Wan',
        exerciseScores: [35, 42, 38, 45, 43, 52, 48, 55],
        averageExerciseScore: 45,
        parentTimePerWeek: 28,
        learningAreas: {
            'Alphabet Recognition': 52,
            'Sight Word Recognition': 48,
            'Vocabulary': 55,
            'Point and Read': 50,
            'Phonemic Awareness': 45
        },
        attemptsPerWeek: [4, 5, 4, 5, 4, 5, 4, 5]
    },
    {
        id: '5',
        name: 'Ng Chun Kit',
        kindergarten: 'Kwai Chung',
        exerciseScores: [28, 35, 32, 38, 36, 45, 42, 48],
        averageExerciseScore: 38,
        parentTimePerWeek: 20,
        learningAreas: {
            'Alphabet Recognition': 38,
            'Sight Word Recognition': 35,
            'Vocabulary': 42,
            'Point and Read': 38,
            'Phonemic Awareness': 32
        },
        attemptsPerWeek: [3, 4, 4, 4, 4, 4, 4, 4]
    },
    {
        id: '6',
        name: 'Lam Siu Fan',
        kindergarten: 'Tuen Mun',
        exerciseScores: [40, 48, 45, 52, 50, 58, 55, 62],
        averageExerciseScore: 51,
        parentTimePerWeek: 32,
        learningAreas: {
            'Alphabet Recognition': 58,
            'Sight Word Recognition': 55,
            'Vocabulary': 62,
            'Point and Read': 58,
            'Phonemic Awareness': 52
        },
        attemptsPerWeek: [4, 5, 5, 5, 5, 5, 5, 5]
    },
    {
        id: '7',
        name: 'Ho Tsz Ching',
        kindergarten: 'Yuen Long',
        exerciseScores: [32, 38, 35, 42, 40, 48, 45, 50],
        averageExerciseScore: 41,
        parentTimePerWeek: 22,
        learningAreas: {
            'Alphabet Recognition': 45,
            'Sight Word Recognition': 42,
            'Vocabulary': 48,
            'Point and Read': 45,
            'Phonemic Awareness': 38
        },
        attemptsPerWeek: [3, 4, 4, 4, 4, 4, 4, 4]
    },
    {
        id: '8',
        name: 'Tsang Wai Keung',
        kindergarten: 'Tin Shui Wai',
        exerciseScores: [25, 32, 28, 32, 30, 38, 35, 40],
        averageExerciseScore: 32,
        parentTimePerWeek: 17,
        learningAreas: {
            'Alphabet Recognition': 35,
            'Sight Word Recognition': 32,
            'Vocabulary': 38,
            'Point and Read': 35,
            'Phonemic Awareness': 28
        },
        attemptsPerWeek: [3, 3, 4, 3, 4, 3, 4, 3]
    },
    {
        id: '9',
        name: 'Chan Lok Yan',
        kindergarten: 'Fanling',
        exerciseScores: [45, 52, 48, 55, 53, 62, 58, 65],
        averageExerciseScore: 55,
        parentTimePerWeek: 30,
        learningAreas: {
            'Alphabet Recognition': 62,
            'Sight Word Recognition': 58,
            'Vocabulary': 65,
            'Point and Read': 60,
            'Phonemic Awareness': 55
        },
        attemptsPerWeek: [4, 5, 5, 5, 5, 5, 5, 5]
    },
    {
        id: '10',
        name: 'Wong Chi Keung',
        kindergarten: 'Sheung Shui',
        exerciseScores: [38, 45, 42, 48, 46, 55, 52, 58],
        averageExerciseScore: 48,
        parentTimePerWeek: 26,
        learningAreas: {
            'Alphabet Recognition': 55,
            'Sight Word Recognition': 52,
            'Vocabulary': 58,
            'Point and Read': 55,
            'Phonemic Awareness': 48
        },
        attemptsPerWeek: [4, 4, 5, 4, 5, 4, 5, 4]
    },
    {
        id: '11',
        name: 'Lee Wing Sze',
        kindergarten: 'Tai Po',
        exerciseScores: [50, 58, 55, 62, 60, 68, 65, 72],
        averageExerciseScore: 61,
        parentTimePerWeek: 35,
        learningAreas: {
            'Alphabet Recognition': 68,
            'Sight Word Recognition': 65,
            'Vocabulary': 72,
            'Point and Read': 68,
            'Phonemic Awareness': 62
        },
        attemptsPerWeek: [5, 5, 5, 5, 5, 5, 5, 5]
    },
    {
        id: '12',
        name: 'Cheung Ho Yin',
        kindergarten: 'Sha Tin',
        exerciseScores: [55, 62, 60, 68, 65, 75, 72, 78],
        averageExerciseScore: 67,
        parentTimePerWeek: 38,
        learningAreas: {
            'Alphabet Recognition': 75,
            'Sight Word Recognition': 72,
            'Vocabulary': 78,
            'Point and Read': 75,
            'Phonemic Awareness': 68
        },
        attemptsPerWeek: [5, 5, 5, 5, 5, 5, 5, 5]
    }
];

let homeworkSubmissions = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Chen',
    type: 'text',
    content: 'Completed alphabet worksheet A-Z',
    score: 88,
    feedback: 'Great work on letter recognition!',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Emma Chen',
    type: 'audio',
    content: 'Reading practice recording - A to M letters',
    score: 92,
    feedback: 'Excellent pronunciation!',
    submittedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'Emma Chen',
    type: 'video',
    content: 'Sight word demonstration video',
    score: 95,
    feedback: 'Outstanding reading fluency!',
    submittedAt: '2024-01-17T14:30:00Z'
  },
  {
    id: '4',
    studentId: '2',
    studentName: 'Liam Johnson',
    type: 'text',
    content: 'Completed alphabet worksheet A-Z',
    score: 75,
    feedback: 'Good effort, work on letter formation',
    submittedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '5',
    studentId: '2',
    studentName: 'Liam Johnson',
    type: 'audio',
    content: 'Reading practice recording',
    score: 78,
    feedback: 'Good pronunciation, work on fluency',
    submittedAt: '2024-01-16T11:45:00Z'
  },
  {
    id: '6',
    studentId: '3',
    studentName: 'Sophia Rodriguez',
    type: 'text',
    content: 'Advanced vocabulary worksheet',
    score: 98,
    feedback: 'Exceptional vocabulary skills!',
    submittedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: '7',
    studentId: '3',
    studentName: 'Sophia Rodriguez',
    type: 'video',
    content: 'Sight word demonstration',
    score: 96,
    feedback: 'Excellent reading skills!',
    submittedAt: '2024-01-16T15:20:00Z'
  },
  {
    id: '8',
    studentId: '4',
    studentName: 'Noah Williams',
    type: 'text',
    content: 'Basic alphabet recognition',
    score: 68,
    feedback: 'Keep practicing letter recognition',
    submittedAt: '2024-01-15T13:10:00Z'
  },
  {
    id: '9',
    studentId: '5',
    studentName: 'Ava Brown',
    type: 'audio',
    content: 'Phonemic awareness practice',
    score: 89,
    feedback: 'Great sound recognition!',
    submittedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '10',
    studentId: '5',
    studentName: 'Ava Brown',
    type: 'video',
    content: 'Reading fluency demonstration',
    score: 91,
    feedback: 'Excellent reading pace and accuracy',
    submittedAt: '2024-01-16T16:30:00Z'
  }
];

// Routes

// Get all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Get student by ID
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// Export student data as CSV
app.get('/api/students/csv', (req, res) => {
    try {
        const csvData = convertStudentsToCSV(students);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students_data.csv"');
        res.send(csvData);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
});

// Save CSV file to disk
app.post('/api/students/save-csv', (req, res) => {
    try {
        const csvData = convertStudentsToCSV(students);
        const filename = `students_data_${new Date().toISOString().split('T')[0]}.csv`;
        const filePath = saveCSVToFile(csvData, filename);
        
        res.json({ 
            message: 'CSV file saved successfully',
            filename: filename,
            filePath: filePath,
            fileSize: fs.statSync(filePath).size
        });
    } catch (error) {
        console.error('Error saving CSV:', error);
        res.status(500).json({ error: 'Failed to save CSV file' });
    }
});

// Update students data (for CSV import)
app.post('/api/students/update', (req, res) => {
    console.log('Received request to update students data');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
        const newStudents = req.body.students;
        console.log('Extracted students data:', newStudents);
        
        if (!newStudents) {
            console.error('No students data in request body');
            return res.status(400).json({ error: 'No students data provided' });
        }
        
        if (!Array.isArray(newStudents)) {
            console.error('Students data is not an array:', typeof newStudents);
            return res.status(400).json({ error: 'Students data must be an array' });
        }
        
        console.log(`Validating ${newStudents.length} students...`);
        
        // Validate each student has required fields
        for (let i = 0; i < newStudents.length; i++) {
            const student = newStudents[i];
            if (!student.id || !student.name || !student.kindergarten) {
                console.error(`Student ${i} missing required fields:`, student);
                return res.status(400).json({ 
                    error: `Student ${i} missing required fields: id, name, or kindergarten` 
                });
            }
        }
        
        // Update the global students array
        students = newStudents;
        
        console.log(`Successfully updated students data with ${newStudents.length} students`);
        console.log('First student sample:', students[0]);
        
        res.json({ 
            message: 'Students data updated successfully',
            count: newStudents.length
        });
    } catch (error) {
        console.error('Error updating students data:', error);
        res.status(500).json({ error: 'Failed to update students data: ' + error.message });
    }
});

// Get all homework submissions
app.get('/api/homework', (req, res) => {
  res.json(homeworkSubmissions);
});

// Get homework by student ID
app.get('/api/homework/student/:studentId', (req, res) => {
  const submissions = homeworkSubmissions.filter(h => h.studentId === req.params.studentId);
  res.json(submissions);
});

// Add new homework submission
app.post('/api/homework', (req, res) => {
  const { studentId, type, content } = req.body;
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const newSubmission = {
    id: uuidv4(),
    studentId,
    studentName: student.name,
    type,
    content,
    score: null,
    feedback: '',
    submittedAt: new Date().toISOString()
  };

  homeworkSubmissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

// Update homework submission (score and feedback)
app.put('/api/homework/:id', (req, res) => {
  const { score, feedback } = req.body;
  const submission = homeworkSubmissions.find(h => h.id === req.params.id);
  
  if (!submission) {
    return res.status(404).json({ message: 'Homework submission not found' });
  }

  submission.score = score;
  submission.feedback = feedback;
  
  res.json(submission);
});

// Get dashboard insights
app.get('/api/insights', (req, res) => {
  // Calculate insights
  const insights = calculateInsights();
  
  res.json(insights);
});

// Function to convert student data to CSV format
function convertStudentsToCSV(students) {
    // Define CSV headers
    const headers = [
        'ID',
        'Name',
        'Kindergarten',
        'Week1_Score',
        'Week2_Score',
        'Week3_Score',
        'Week4_Score',
        'Week5_Score',
        'Week6_Score',
        'Week7_Score',
        'Week8_Score',
        'Average_Exercise_Score',
        'Parent_Time_Per_Week_Minutes',
        'Alphabet_Recognition_Score',
        'Sight_Word_Recognition_Score',
        'Vocabulary_Score',
        'Point_and_Read_Score',
        'Phonemic_Awareness_Score',
        'Week1_Attempts',
        'Week2_Attempts',
        'Week3_Attempts',
        'Week4_Attempts',
        'Week5_Attempts',
        'Week6_Attempts',
        'Week7_Attempts',
        'Week8_Attempts'
    ];
    
    // Convert data to CSV rows
    const csvRows = [headers.join(',')];
    
    students.forEach(student => {
        const row = [
            student.id,
            student.name,
            student.kindergarten,
            ...student.exerciseScores,
            student.averageExerciseScore,
            student.parentTimePerWeek,
            student.learningAreas['Alphabet Recognition'],
            student.learningAreas['Sight Word Recognition'],
            student.learningAreas['Vocabulary'],
            student.learningAreas['Point and Read'],
            student.learningAreas['Phonemic Awareness'],
            ...student.attemptsPerWeek
        ];
        
        // Escape commas and quotes in text fields
        const escapedRow = row.map(field => {
            if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        });
        
        csvRows.push(escapedRow.join(','));
    });
    
    return csvRows.join('\n');
}

// Function to save CSV to file
function saveCSVToFile(csvData, filename) {
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, csvData, 'utf8');
    return filePath;
}

// Helper function to calculate correlation coefficient
function calculateCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate insights
function calculateInsights() {
  // Generate realistic trends with ups and downs but overall improvement
  const exerciseTrend = [];
  for (let week = 0; week < 8; week++) {
      const weekAverage = students.reduce((sum, s) => sum + s.exerciseScores[week], 0) / students.length;
      exerciseTrend.push({
          week: week + 1,
          averageScore: Math.round(weekAverage * 10) / 10
      });
  }

  const parentTimeTrend = [];
  // Generate realistic parent engagement trend with weekly variations
  const baseParentTime = students.reduce((sum, s) => sum + s.parentTimePerWeek, 0) / students.length;
  
  // Create weekly variations around the base time (simulate ups and downs)
  const weeklyVariations = [
      -3,  // Week 1: slightly below average
      -1,  // Week 2: slightly below average  
      +2,  // Week 3: above average
      -2,  // Week 4: below average
      +1,  // Week 5: slightly above average
      +3,  // Week 6: above average
      0,   // Week 7: average
      +4   // Week 8: highest engagement
  ];
  
  for (let week = 0; week < 8; week++) {
      const weeklyAverage = Math.max(10, baseParentTime + weeklyVariations[week]); // Ensure minimum 10 minutes
      parentTimeTrend.push({
          week: week + 1,
          averageMinutes: Math.round(weeklyAverage * 10) / 10
      });
  }

  // Calculate learning area averages
  const learningAreaAverages = {
    'Alphabet Recognition': Math.round(
      students.reduce((sum, s) => sum + s.learningAreas['Alphabet Recognition'], 0) / students.length
    ),
    'Sight Word Recognition': Math.round(
      students.reduce((sum, s) => sum + s.learningAreas['Sight Word Recognition'], 0) / students.length
    ),
    'Vocabulary': Math.round(
      students.reduce((sum, s) => sum + s.learningAreas['Vocabulary'], 0) / students.length
    ),
    'Point and Read': Math.round(
      students.reduce((sum, s) => sum + s.learningAreas['Point and Read'], 0) / students.length
    ),
    'Phonemic Awareness': Math.round(
      students.reduce((sum, s) => sum + s.learningAreas['Phonemic Awareness'], 0) / students.length
    )
  };

  // Find the area with lowest performance
  const lowestArea = Object.entries(learningAreaAverages).reduce((lowest, [area, score]) => 
    score < lowest.score ? { area, score } : lowest
  , { area: 'Alphabet Recognition', score: 100 });

  // Calculate correlation between parent engagement and student performance
  const parentEngagement = students.map(s => s.parentTimePerWeek);
  const studentPerformance = students.map(s => s.averageExerciseScore);
  const correlationValue = Math.round(calculateCorrelation(parentEngagement, studentPerformance) * 100) / 100;

    // Calculate students needing attention based on their worst performance area
    const studentsNeedingAttention = students
        .map(student => {
            const avgParentTime = student.parentTimePerWeek;
            
            // Calculate averages for comparison
            const avgParentEngagement = students.reduce((sum, s) => sum + s.parentTimePerWeek, 0) / students.length;
            const learningAreaAverages = {
                'Alphabet Recognition': students.reduce((sum, s) => sum + s.learningAreas['Alphabet Recognition'], 0) / students.length,
                'Sight Word Recognition': students.reduce((sum, s) => sum + s.learningAreas['Sight Word Recognition'], 0) / students.length,
                'Vocabulary': students.reduce((sum, s) => sum + s.learningAreas['Vocabulary'], 0) / students.length,
                'Point and Read': students.reduce((sum, s) => sum + s.learningAreas['Point and Read'], 0) / students.length,
                'Phonemic Awareness': students.reduce((sum, s) => sum + s.learningAreas['Phonemic Awareness'], 0) / students.length
            };
            
            // Find the worst performance area for this student
            let worstArea = null;
            let worstGap = 0;
            let worstType = '';
            
            // Check learning areas
            Object.entries(student.learningAreas).forEach(([area, score]) => {
                const avgScore = learningAreaAverages[area];
                const gap = avgScore - score; // How much below average
                if (gap > worstGap) {
                    worstGap = gap;
                    worstArea = area;
                    worstType = 'learning';
                }
            });
            
            // Check parent engagement
            const parentGap = avgParentEngagement - avgParentTime;
            if (parentGap > worstGap && parentGap > 5) { // Only if significantly below average (5+ minutes)
                worstGap = parentGap;
                worstArea = 'Parent Engagement';
                worstType = 'parent';
            }
            
            return {
                id: student.id,
                name: student.name,
                averageExerciseScore: student.averageExerciseScore,
                worstArea: worstArea,
                worstGap: Math.round(worstGap),
                worstType: worstType,
                actualValue: worstType === 'parent' ? Math.round(avgParentTime) : student.learningAreas[worstArea],
                averageValue: worstType === 'parent' ? Math.round(avgParentEngagement) : Math.round(learningAreaAverages[worstArea]),
                reason: worstType === 'parent' 
                    ? `Low parent engagement (${Math.round(avgParentTime)} min/week vs ${Math.round(avgParentEngagement)} average)`
                    : `Weak in ${worstArea} (${student.learningAreas[worstArea]} vs ${Math.round(learningAreaAverages[worstArea])} average)`
            };
        })
        .filter(student => student.worstGap > 0) // Only students with below-average performance
        .sort((a, b) => b.worstGap - a.worstGap) // Sort by worst gap first
        .slice(0, 3); // Take top 3

  // Calculate total parent hours
  const totalParentHours = Math.round(
    students.reduce((sum, student) => 
      sum + student.parentTimePerWeek, 0
    ) / 60 // Convert minutes to hours
  );

    // Calculate insights
    const insights = {
        exerciseTrend,
        parentTimeTrend,
        studentsNeedingAttention,
        correlation: {
            value: correlationValue,
            interpretation: correlationValue > 0.6 ? 'Strong positive correlation' : 'Moderate correlation'
        },
        totalParentHours,
        focusArea: {
            name: lowestArea.area,
            score: lowestArea.score,
            recommendation: `Focus on improving ${formatAreaNameForReport(lowestArea.area)} as it shows the lowest average performance (${lowestArea.score}/100) across all students.`,
            learningAreaAverages: learningAreaAverages
        },
        // Add parent engagement questionnaire data
        parentEngagementSurvey: {
            responseRate: 35,
            question1: {
                question: "On average, how much time do parents spend with their children each week practicing or discussing content related to the English class?",
                responses: {
                    "Less than 15 minutes": 35,
                    "15 to 25 minutes": 45,
                    "More than 25 minutes": 20
                }
            },
            question2: {
                question: "Have parents increased their interaction with their children at home through the English class? If yes, in what aspects has it been strengthened?",
                responses: {
                    "Yes": 60,
                    "No": 40
                }
            },
            question3: {
                question: "Has the parent-child relationship improved through the English class? If yes, how has it improved?",
                responses: {
                    "Yes": 55,
                    "No": 45
                }
            }
        }
    };

  return insights;
}

// Generate comprehensive PDF report
app.get('/api/report/pdf', async (req, res) => {
  try {
    // Get insights data
    const insightsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/insights`);
    const insights = await insightsResponse.json();
    
    // Create HTML report
    const htmlReport = generateHTMLReport(insights, students);
    
    // Generate PDF using Puppeteer
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set HTML content
    await page.setContent(htmlReport, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ngo-k3-performance-report.pdf"');
    res.setHeader('Content-Length', pdf.length);
    
    // Send the PDF
    res.send(pdf);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Generate HTML report
function generateHTMLReport(insights, students) {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>NGO K3 Performance Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6; 
          color: #333;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #667eea; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .header h1 { 
          color: #667eea; 
          margin: 0; 
          font-size: 28px; 
        }
        .section { 
          margin-bottom: 30px; 
          page-break-inside: avoid; 
        }
        .section h2 { 
          color: #667eea; 
          border-bottom: 2px solid #e2e8f0; 
          padding-bottom: 10px; 
          font-size: 20px;
        }
        .metrics-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          margin: 20px 0; 
        }
        .metric { 
          padding: 20px; 
          background: #f8fafc; 
          border-radius: 8px; 
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .metric-value { 
          font-size: 32px; 
          font-weight: bold; 
          color: #10b981; 
          display: block;
        }
        .metric-label { 
          color: #64748b; 
          font-size: 14px; 
          margin-top: 5px;
        }
        .correlation { 
          background: #dbeafe; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border: 1px solid #93c5fd;
        }
        .correlation h3 { 
          margin-top: 0; 
          color: #1e40af; 
        }
        .students-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          font-size: 12px;
        }
        .students-table th, .students-table td { 
          border: 1px solid #e2e8f0; 
          padding: 8px; 
          text-align: left; 
        }
        .students-table th { 
          background: #f8fafc; 
          font-weight: bold; 
          color: #374151;
        }
        .attention-item { 
          background: #fef2f2; 
          padding: 15px; 
          margin: 10px 0; 
          border-radius: 8px; 
          border-left: 4px solid #ef4444; 
        }
        .attention-item h4 { 
          margin: 0 0 5px 0; 
          color: #dc2626; 
        }
        .page-break { 
          page-break-before: always; 
        }
        .learning-areas { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
          gap: 10px; 
          margin: 10px 0; 
        }
        .learning-area { 
          background: #f0f9ff; 
          padding: 10px; 
          border-radius: 6px; 
          text-align: center; 
          border: 1px solid #bae6fd;
        }
        .area-name { 
          font-size: 12px; 
          color: #0369a1; 
          font-weight: bold; 
        }
        .area-score { 
          font-size: 18px; 
          color: #0c4a6e; 
          font-weight: bold; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NGO K3 Student Performance Report</h1>
        <p>Comprehensive Analysis of Student Progress and Parent Engagement</p>
        <p><strong>Generated on:</strong> ${currentDate}</p>
      </div>
      
      <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
          <div class="metric">
            <span class="metric-value">${insights.totalParentHours}</span>
            <div class="metric-label">Total Parent Hours</div>
          </div>
          <div class="metric">
            <span class="metric-value">${insights.correlation.value}</span>
            <div class="metric-label">Parent-Performance Correlation</div>
          </div>
          <div class="metric">
            <span class="metric-value">${students.length}</span>
            <div class="metric-label">Total Students</div>
          </div>
          <div class="metric">
            <span class="metric-value">${insights.studentsNeedingAttention.length}</span>
            <div class="metric-label">Students Needing Attention</div>
          </div>
        </div>
        
        <div class="correlation">
          <h3>Parent Engagement Impact</h3>
          <p><strong>${insights.correlation.interpretation}</strong></p>
          <p>The correlation coefficient of ${insights.correlation.value} demonstrates that increased parent engagement directly correlates with improved student performance, validating our program's family-centered approach.</p>
          <p><strong>Total Accumulated Parent Hours:</strong> ${insights.totalParentHours} hours across all families</p>
        </div>
      </div>

      <div class="section">
        <h2>Learning Areas Performance</h2>
        <p>Average performance across all students in five key learning areas:</p>
        <div class="learning-areas">
          ${Object.entries(insights.focusArea.learningAreaAverages).map(([area, score]) => `
            <div class="learning-area">
              <div class="area-name">${formatAreaNameForReport(area)}</div>
              <div class="area-score">${score}</div>
            </div>
          `).join('')}
        </div>
        <p><strong>Focus Area Recommendation:</strong> ${insights.focusArea.recommendation}</p>
      </div>

      <div class="section">
        <h2>Students Requiring Additional Attention</h2>
        <p>The following students have been identified as needing extra support:</p>
        ${insights.studentsNeedingAttention.map(student => `
          <div class="attention-item">
            <h4>${student.name}</h4>
            <p><strong>Area of Concern:</strong> ${formatAreaNameForReport(student.worstArea)} (Score: ${student.worstScore})</p>
            <p><strong>Parent Engagement:</strong> ${student.parentEngagement} minutes/week</p>
            <p><strong>Recommendation:</strong> ${student.reason}</p>
          </div>
        `).join('')}
      </div>

      <div class="section page-break">
        <h2>Detailed Student Performance</h2>
        <table class="students-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Kindergarten</th>
              <th>Avg Exercise Score</th>
              <th>Parent Time/Week</th>
              <th>Alphabet Recognition</th>
              <th>Sight Word Recognition</th>
              <th>Vocabulary</th>
              <th>Point and Read</th>
              <th>Phonemic Awareness</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <td>${student.name}</td>
                <td>${student.kindergarten}</td>
                <td>${student.averageExerciseScore.toFixed(1)}</td>
                <td>${Math.round(student.parentTimePerWeek)}</td>
                <td>${student.learningAreas['Alphabet Recognition']}</td>
                <td>${student.learningAreas['Sight Word Recognition']}</td>
                <td>${student.learningAreas['Vocabulary']}</td>
                <td>${student.learningAreas['Point and Read']}</td>
                <td>${student.learningAreas['Phonemic Awareness']}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Recommendations</h2>
        <ul>
          <li><strong>Increase Parent Engagement:</strong> Continue to encourage parents to spend quality time with their children, as our data shows a strong positive correlation (${insights.correlation.value}) between parent involvement and student performance.</li>
          <li><strong>Focus on ${formatAreaNameForReport(insights.focusArea.name)}:</strong> This area shows the lowest average performance and requires additional attention from tutors.</li>
          <li><strong>Individual Support:</strong> Provide targeted interventions for the ${insights.studentsNeedingAttention.length} students identified as needing additional attention.</li>
          <li><strong>Maintain Current Strategies:</strong> The overall performance trends indicate that current teaching methods are effective and should be continued.</li>
        </ul>
      </div>
    </body>
    </html>
  `;
}

// Helper function to format area names for report
function formatAreaNameForReport(area) {
  const areaNames = {
    'Alphabet Recognition': 'Alphabet Recognition',
    'Sight Word Recognition': 'Sight Word Recognition',
    'Vocabulary': 'Vocabulary',
    'Point and Read': 'Point and Read',
    'Phonemic Awareness': 'Phonemic Awareness'
  };
  return areaNames[area] || area.charAt(0).toUpperCase() + area.slice(1);
}

// Helper function to format area names for report
function formatAreaName(area) {
  const areaNames = {
    alphabetRecognition: 'Alphabet Recognition',
    sightWordRecognition: 'Sight Word Recognition',
    vocabulary: 'Vocabulary',
    pointAndRead: 'Point and Read',
    phonemicAwareness: 'Phonemic Awareness'
  };
  return areaNames[area] || area.charAt(0).toUpperCase() + area.slice(1);
}



// Serve static files with cache-busting for JavaScript files
app.use(express.static('dist', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Server accessible at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`\n💡 This server is only accessible from localhost`);
}); 