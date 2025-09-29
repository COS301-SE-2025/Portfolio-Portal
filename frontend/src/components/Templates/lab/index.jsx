import React from "react";
import CanvasStage from "./CanvasStage";
import { LabProvider } from "./scene/useLabState";

export default function LabTemplate() {
  return (
    <LabProvider>
      <div className="w-full h-screen relative overflow-hidden">
        <CanvasStage />
        
        {/* Copyright Notice Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="group relative">
            <button className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all">
              <span className="text-lg font-semibold leading-none">©</span>
            </button>
            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-black bg-opacity-80 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              "Professor Farnsworth" (https://skfb.ly/oJYTw) by pointlessimon is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
            </div>
          </div>
        </div>
      </div>
    </LabProvider>
  );
}