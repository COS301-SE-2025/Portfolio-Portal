import React from 'react';
import CanvasStage from './components/CanvasStage';
import { LabProvider } from './components/Scene';
import './App.css';

export default function App() {
  return (
    <LabProvider>
      <div className="w-full h-screen relative overflow-hidden">
        <CanvasStage />
      </div>
    </LabProvider>
  );
}

export default App;