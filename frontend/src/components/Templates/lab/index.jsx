import React from "react";
import CanvasStage from "./CanvasStage";
import { LabProvider } from "./scene/useLabState";

export default function LabTemplate() {
  return (
    <LabProvider>
      <div className="w-full h-screen relative overflow-hidden">
        <CanvasStage />
      </div>
    </LabProvider>
  );
}
