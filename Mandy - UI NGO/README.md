# NGO K3 Student Performance Dashboard

A comprehensive web application for NGOs to track and analyze K3 students' performance, parent engagement, and learning outcomes.

## 🚀 Features

- **Student Performance Tracking**: Monitor exercise scores, learning areas, and attempts across 8 weeks
- **Parent Engagement Analysis**: Track time spent with children and correlation with performance
- **Data Visualization**: Interactive charts and graphs for performance trends
- **CSV Import/Export**: Easy data management with CSV file support
- **Homework Management**: Track text, audio, and video submissions
- **Performance Insights**: Identify students needing attention and focus areas
- **PDF Reports**: Generate comprehensive performance reports
- **Scrollable Interface**: View all 12 students with enhanced submission details

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: HTML5 Canvas with custom rendering
- **Build Tool**: Webpack
- **PDF Generation**: Puppeteer
- **Data Format**: CSV import/export support

## 📱 Access

- **Local Development**: `http://localhost:3001`
- **Desktop Only**: Optimized for desktop use
- **Single Page Application**: Smooth, responsive interface

## 🎯 Target Users

- **NGO Staff**: Track student progress and identify areas needing attention
- **Tutors**: Manage homework submissions and provide feedback
- **Administrators**: Generate reports and analyze trends
- **Stakeholders**: View comprehensive performance insights

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Dashboard_NGO.git
   cd Dashboard_NGO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the frontend**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:3001`

## 📊 Data Structure

The dashboard supports CSV import with the following columns:

### Student Information
- `ID`: Unique student identifier
- `Name`: Student's full name
- `Kindergarten`: School name

### Weekly Performance (Weeks 1-8)
- `WeekX_Score`: Exercise performance score (0-100)
- `WeekX_Attempts`: Number of attempts per week

### Learning Areas
- `Alphabet_Recognition`: Alphabet recognition score
- `Sight_Word_Recognition`: Sight word recognition score
- `Vocabulary_Score`: Vocabulary assessment score
- `Point_and_Read`: Point and read ability score
- `Phonemic_Awareness`: Phonemic awareness score

### Parent Engagement
- `Parent_Time_Per_Week_Minutes`: Time parents spend with children

## 🔧 Configuration

### Port Configuration
- Default port: 3001
- Can be changed via environment variable: `PORT=3002 npm start`

### Data Sources
- Sample data included for demonstration
- CSV import for real data
- Export functionality for data backup

## 📈 Dashboard Sections

### 1. Performance Insights
- Students needing attention (top 3)
- Focus area identification
- Performance trends over 8 weeks
- Parent engagement correlation

### 2. Student Management
- Complete student list with performance metrics
- Search and filter by kindergarten
- Individual student performance views

### 3. Homework Submissions
- Text, audio, and video submission tracking
- Score management and feedback
- Submission history per student

### 4. Data Import/Export
- CSV file upload with validation
- Data export functionality
- Real-time dashboard updates

## 🎨 UI Features

- **Modern Design**: Clean, professional interface inspired by Canvas
- **Responsive Layout**: Optimized for desktop use
- **Interactive Charts**: Custom-rendered charts with smooth animations
- **Color Coding**: Visual indicators for different performance levels
- **Hover Effects**: Enhanced user experience with interactive elements

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing process
   lsof -ti:3001 | xargs kill -9
   # Or use different port
   PORT=3002 npm start
   ```

2. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **CSV Import Issues**
   - Ensure CSV has required columns
   - Check file format (UTF-8 encoding)
   - Verify data types (numbers for scores)

## 🤝 Contributing

This project is designed for NGO use and educational purposes. 

### Development Guidelines
- Follow existing code structure
- Test changes thoroughly
- Update documentation for new features
- Use meaningful commit messages

### Feature Requests
- Submit issues for bugs
- Suggest enhancements via GitHub issues
- Provide detailed use case descriptions

## 📄 License

This project is created for educational and NGO purposes. 

## 🙏 Acknowledgments

- Designed for K3 students in Hong Kong districts
- Built with NGO requirements in mind
- Focused on improving educational outcomes
- Emphasizes parent engagement importance

## 📞 Support

For technical support or feature requests:
- Create a GitHub issue
- Provide detailed error descriptions
- Include system information and steps to reproduce

---

**Built with ❤️ for NGO education initiatives** 