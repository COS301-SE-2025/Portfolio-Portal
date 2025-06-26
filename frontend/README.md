# Portfolio-Portal - Frontend

A modern React-based portfolio generation application featuring interactive 3D models and customizable templates. This frontend application allows users to create stunning portfolio websites with immersive 3D experiences.

## 🚀 Features

- **Interactive 3D Models**: Powered by Three.js for immersive user experiences
- **Multiple Portfolio Templates**: Choose from various professionally designed templates
- **CV Data Integration**: Upload and process CV data to auto-populate portfolios
- **Dark/Light Theme Support**: Toggle between themes for optimal viewing
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Built with Tailwind CSS for clean, contemporary design

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **State Management**: React Context API
- **Routing**: React Router
- **Linting**: ESLint

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── assets/                      # Project images and logos
│   ├── coloredEarth/               # 3D Earth model (colored variant)
│   ├── earth/                      # 3D Earth model assets
│   ├── head/                       # 3D Head model with textures
│   ├── images/                     # Template preview images
│   └── plane-heads/                # 3D Plane model assets
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── 3DModels/              # Three.js 3D model components
│   │   │   ├── ColoredEarth.jsx
│   │   │   ├── Earth.jsx
│   │   │   ├── Head.jsx
│   │   │   └── Plane.jsx
│   │   ├── sections/              # Main page sections
│   │   │   ├── AboutSection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HowItWorksSection.jsx
│   │   │   ├── TemplatesSection.jsx
│   │   │   └── UploadSection.jsx
│   │   ├── Templates/             # Portfolio template components
│   │   │   ├── space/            # Space-themed template
│   │   │   └── TemplateSelector.jsx
│   │   ├── Loader.jsx            # Loading component
│   │   ├── Navbar.jsx            # Navigation component
│   │   ├── TemplateCard.jsx      # Template preview card
│   │   └── ThemeToggleButton.jsx # Theme switcher
│   ├── contexts/                  # React Context providers
│   │   ├── PortfolioContexts.jsx # Portfolio state management
│   │   └── ThemeContext.jsx      # Theme state management
│   ├── data/                     # Static data and configurations
│   │   └── Templates.js          # Template definitions
│   ├── hooks/                    # Custom React hooks
│   │   └── useCVData.js         # CV data processing hook
│   ├── pages/                    # Main application pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Result.jsx
│   │   └── Space.jsx
│   ├── services/                 # API and external services
│   │   ├── api.js               # Base API configuration
│   │   ├── cvDataService.js     # CV data processing service
│   │   └── portfolio.js         # Portfolio-related API calls
│   ├── store/                   # State management
│   │   └── index.js
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── eslint.config.js             # ESLint configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── package.json                # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎨 Key Components

### 3D Models

- **Earth Models**: Interactive globe representations with textures
- **Head Model**: Character representation with detailed textures

### Template System

- **Space Template**: Cosmic-themed portfolio layout
- **Template Selector**: Component for choosing portfolio themes
- **Template Cards**: Preview cards for different templates

### Core Features

- **CV Upload**: Process and extract data from uploaded CVs
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Navbar**: Navigation with mobile-friendly design
- **Loading States**: Smooth loading experiences

## 🔧 Configuration

### Tailwind CSS

Custom configuration in `tailwind.config.js` for project-specific styling.

### Vite

Build tool configuration in `vite.config.js` optimized for React development.

### ESLint

Code quality rules configured in `eslint.config.js`.

## 🌐 API Integration

The application integrates with backend services through:

- `api.js` - Base API configuration
- `cvDataService.js` - CV processing endpoints
- `portfolio.js` - Portfolio management endpoints

## 🎭 State Management

### Context Providers

- **PortfolioContexts**: Manages portfolio data and state
- **ThemeContext**: Handles dark/light theme switching

### Custom Hooks

- **useCVData**: Processes and manages CV data extraction

## 🚀 Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b sprintXX-YY/amazing-feature, where XX is the sprint number and YY are your initials`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin sprintXX-YY/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the University of Pretoria's COS301 CAPSTONE project. 

## 🐛 Known Issues

- 3D models may take time to load on slower connections
- Template switching requires page refresh in some cases

## 🔮 Future Enhancements

- Additional portfolio templates
- Real-time collaboration features
- Advanced 3D model interactions

---
