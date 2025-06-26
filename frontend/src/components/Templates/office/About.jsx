import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import DeskSetup from '../../3DModels/DeskSetup'; // You'll need to create this component
import useCvData from '../../../hooks/useCVData';

const About = () => {
    const { cvData } = useCvData() || {};
    
    return (
        <section id="about" className="py-24 relative overflow-hidden bg-gray-900/50">
            {/* Office-themed background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800/20 to-gray-900"></div>
                
                {/* Office window blinds effect */}
                <div className="absolute inset-0 opacity-10" 
                     style={{
                         backgroundImage: `repeating-linear-gradient(to bottom, 
                                          rgba(255,255,255,0.1) 0px, 
                                          rgba(255,255,255,0.1) 10px, 
                                          transparent 10px, 
                                          transparent 20px)`
                     }}>
                </div>
                
                {/* Subtle document paper floating effect */}
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`paper-${i}`}
                        className="absolute w-32 h-40 bg-white/5 border border-gray-600/30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 20 - 10}deg)`,
                            animation: `floatPaper ${10 + Math.random() * 10}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes floatPaper {
                    0%, 100% { transform: translateY(0) rotate(${Math.random() * 20 - 10}deg); }
                    50% { transform: translateY(-20px) rotate(${Math.random() * 10 - 5}deg); }
                }
            `}</style>
            
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-300">
                    About Me
                </h2>
                
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="w-full lg:w-1/2 relative">
                        <div className="h-96 lg:h-[500px] relative">
                            <Canvas
                                camera={{ position: [0, 1, 5], fov: 50 }}
                                shadows
                                gl={{ antialias: true, alpha: true }}
                                dpr={[1, 2]}
                            >
                                <ambientLight intensity={0.5} />
                                <directionalLight
                                    position={[5, 5, 5]}
                                    intensity={1}
                                    castShadow
                                />
                                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#3b82f6" />
                                
                                <Environment preset="apartment" />
                                
                                <Suspense fallback={null}>
                                    <DeskSetup />
                                    <OrbitControls
                                        enableZoom={false}
                                        enablePan={false}
                                        autoRotate={true}
                                        autoRotateSpeed={1}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="space-y-6">
                            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                                {cvData?.about}
                            </p>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-3">
                                {cvData?.skills?.map((skill, index) => {
                                    const colors = [
                                        "bg-blue-600/20 border-blue-600/50",
                                        "bg-gray-600/20 border-gray-600/50",
                                        "bg-blue-800/20 border-blue-800/50",
                                        "bg-gray-700/20 border-gray-700/50",
                                        "bg-blue-700/20 border-blue-700/50",
                                    ];
                                    const color = colors[index % colors.length];
                                    
                                    return (
                                        <span
                                            key={`skill-${index}`}
                                            className={`px-4 py-2 ${color} border rounded-full text-sm text-gray-300 hover:scale-105 transition-transform duration-200 cursor-default`}
                                        >
                                            {skill}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6">
                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/15">
                                Download Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;