import { useState, useEffect } from 'react';
import { ChevronRight, Upload, Sparkles, Eye, Download, Users, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Your CV",
      description: "Simply upload your traditional PDF or Word document CV - no formatting required."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Transformation",
      description: "Our intelligent system analyzes and transforms your CV into an interactive experience."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Immersive Portfolio",
      description: "Get a stunning, interactive portfolio that tells your professional story beautifully."
    }
  ];

  const stats = [
    { number: "50K+", label: "CVs Transformed" },
    { number: "100%", label: "Success Rate" },
    { number: "5.0★", label: "User Rating" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      quote: "This platform transformed my boring CV into an amazing interactive portfolio. I got 3x more interview calls!"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "The AI-powered transformation is incredible. My portfolio now tells my story in a way that really resonates with employers."
    },
    {
      name: "Emily Johnson",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote: "Finally, a way to showcase my work that matches my creativity. The interactive elements are game-changing."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blak-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio Portal
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hidden md:block text-gray-300 hover:text-white transition-colors">
              Features
            </button>
            <button className="hidden md:block text-gray-300 hover:text-white transition-colors">
              Pricing
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              CV Into Magic
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Turn your traditional resume into an immersive, interactive portfolio that tells your professional story like never before. Stand out from the crowd with AI-powered transformation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button 
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
            
            <button 
              onClick={() => setIsVideoPlaying(true)}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition-all flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Three simple steps to transform your career narrative
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:scale-105 ${
                currentFeature === index ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 text-white">
                {feature.icon}
              </div>
              <div className="text-2xl font-bold mb-1">
                {index + 1}.
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">See The Difference</h2>
          <p className="text-xl text-gray-300">Before and after transformation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Before */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-8 text-red-400">Traditional CV</h3>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 opacity-60">
              <div className="space-y-4">
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-2 mt-6">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400">
              ❌ Static, boring, easily forgotten
            </div>
          </div>

          {/* After */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-8 text-green-400">Interactive Portfolio</h3>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded w-32"></div>
                    <div className="h-3 bg-gray-400 rounded w-24"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <div className="h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg animate-pulse delay-100"></div>
                  <div className="h-16 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-lg animate-pulse delay-200"></div>
                  <div className="h-16 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-lg animate-pulse delay-300"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-2 bg-purple-400 rounded-full w-1/3 animate-pulse"></div>
                  <div className="h-2 bg-pink-400 rounded-full w-1/4 animate-pulse delay-100"></div>
                  <div className="h-2 bg-blue-400 rounded-full w-1/5 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            <div className="text-center text-green-400">
              ✅ Interactive, memorable, engaging
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Success Stories</h2>
          <p className="text-xl text-gray-300">Join thousands who've transformed their careers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio Portal
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 Portfolio Portal. Transforming careers, one portfolio at a time.
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
            >
              ✕
            </button>
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Demo video would play here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;