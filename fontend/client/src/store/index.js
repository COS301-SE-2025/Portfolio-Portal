import { create } from 'zustand'

// Define the store
const useStore = create((set) => ({
  // Theme state
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // Project state
  projects: [],
  selectedProject: null,
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  // UI state
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  // 3D Scene state
  cameraPosition: [0, 0, 5],
  setCameraPosition: (position) => set({ cameraPosition: position }),
  
  // Add more state as needed for your project
}))

export default useStore