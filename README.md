# REACH Learning Platform - Frontend

A modern, mobile-first educational dashboard application built for the REACH Learning Program. This platform provides students with an engaging interface to track their homework progress, view analytics, and connect with their learning community.

## 🚀 Features

- **Student Dashboard**: Personalized home screen with progress tracking
- **Homework Portfolio**: Visual homework submission and progress tracking
- **Student Analytics**: Performance metrics and leaderboard rankings
- **Parent Community**: Communication platform for parents and teachers
- **Mobile-First Design**: iPhone mockup interface optimized for mobile experience
- **Modern UI Components**: Built with Radix UI and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Development**: ESLint, TypeScript, SWC for fast compilation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd MS-Code-to-Give-Team2
   ```

2. **Navigate to the app directory**
   ```bash
   cd "Modern Dashboard App Mockup (Community)"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - You'll see an iPhone mockup frame containing the REACH Learning app

## 📁 Project Structure

```
Modern Dashboard App Mockup (Community)/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (Radix UI based)
│   │   ├── REACHApp.tsx    # Main app component
│   │   ├── HomeworkPortfolio.tsx
│   │   ├── StudentAnalytics.tsx
│   │   └── ...             # Other feature components
│   ├── styles/
│   │   └── globals.css     # Global styles and CSS variables
│   ├── App.tsx             # Root component with iPhone mockup
│   ├── main.tsx           # App entry point
│   └── index.css          # Base styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

The app uses a custom design system built on top of Tailwind CSS:

- **Colors**: CSS custom properties for theming support
- **Components**: Shadcn/ui component library with Radix UI primitives
- **Typography**: Responsive font sizing and spacing
- **Layout**: Mobile-first responsive design

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 📱 App Features

### Home Dashboard
- Personalized greeting with student profile
- Quick stats: streak, points, and submission scores
- Homework portfolio with visual progress tracking

### Student Analytics
- Performance metrics and trends
- Class leaderboard and rankings
- Progress visualization with charts

### Navigation
- Bottom tab navigation (Home, Community, Rankings, Profile)
- Intuitive mobile-first interface
- Smooth transitions between sections

## 🔧 Development

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Follow existing naming conventions (PascalCase)
3. Use TypeScript for type safety
4. Leverage existing UI components from `src/components/ui/`

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing color scheme and spacing
- Maintain mobile-first responsive design
- Use CSS custom properties for theme colors

### State Management

Currently using React's built-in state management:
- `useState` for local component state
- Props for data passing between components
- Consider adding Context API or state management library for complex state

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Code to Give initiative. Please check with the project maintainers for licensing information.

## 👥 Team

- **Frontend Development**: Team 2
- **Branch**: AK-Frontend

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in `vite.config.ts` or kill process on port 3000

2. **Dependencies not installing**
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **TypeScript errors**
   - Check `tsconfig.json` configuration
   - Ensure all imports have proper type definitions

### Getting Help

- Check the console for error messages
- Review component prop types and interfaces
- Ensure all required dependencies are installed

---

**Note**: This is a mockup application designed to demonstrate the REACH Learning Platform interface. The app displays in an iPhone frame to simulate the mobile experience.