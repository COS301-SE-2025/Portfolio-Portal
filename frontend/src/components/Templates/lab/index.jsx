import React from "react";
import CanvasStage from "./CanvasStage";
import Navbar from "./ui/Navbar";
import OverlayMicroscope from "./ui/OverlayMicroscope";
import { LabProvider } from "./scene/useLabState";

export default function LabTemplate() {
  return (
    <LabProvider>
      <div className="w-full h-screen relative overflow-hidden">
        <Navbar />
        <CanvasStage />
        <OverlayMicroscope />
      </div>
    </LabProvider>
  );
}