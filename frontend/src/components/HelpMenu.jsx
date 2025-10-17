//frontend/src/components/HelpMenu.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  Book,
  Video,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  Lightbulb,
  FileText,
  Play,
  Mail,
  Phone,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const HelpMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const { isDark } = useTheme();

  // close menu when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveSection("main");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const helpSections = {
    main: {
      title: "Help & Support",
      items: [
        {
          icon: Book,
          title: "Help Center",
          description: "Browse articles and guides",
          action: () => setActiveSection("help-center"),
          hasSubmenu: true,
        },
        {
          icon: Video,
          title: "Video Tutorials",
          description: "Watch step-by-step guides",
          action: () => setActiveSection("tutorials"),
          hasSubmenu: true,
        },
        {
          icon: MessageSquare,
          title: "FAQ",
          description: "Frequently asked questions",
          action: () => setActiveSection("faq"),
          hasSubmenu: true,
        },
        {
          icon: Mail,
          title: "Contact Support",
          description: "Get help from our team",
          action: () =>
            window.open("mailto:support@portfolioportal.co.za", "_blank"),
          external: true,
        },
        {
          icon: Phone,
          title: "Live Chat",
          description: "Chat with support agents",
          action: () => alert("Live chat integration would go here"),
          badge: "Live",
        },
      ],
    },
    "help-center": {
      title: "Help Center",
      items: [
        {
          icon: Lightbulb,
          title: "Getting Started Guide",
          description: "Learn the basics of using our 3D interface",
          action: () =>
            window.open("https://docs.example.com/getting-started", "_blank"),
          external: true,
        },
        {
          icon: Book,
          title: "User Manual",
          description: "Complete documentation",
          action: () =>
            window.open(
              "https://docs.google.com/document/d/1xpYEr_gpnPbiTEHjSDPLsoRo8oy0msK5yuGsxLp-_v0/export?format=pdf",
              "_blank"
            ),
          external: true,
        },
        {
          icon: FileText,
          title: "Three.js Integration",
          description: "Understanding 3D scene interactions",
          action: () =>
            window.open("https://docs.example.com/threejs-guide", "_blank"),
          external: true,
        },
        {
          icon: Search,
          title: "Troubleshooting",
          description: "Common issues and solutions",
          action: () =>
            window.open("https://docs.example.com/troubleshooting", "_blank"),
          external: true,
        },
      ],
    },
    tutorials: {
      title: "Video Tutorials",
      items: [
        {
          icon: Play,
          title: "Quick Start (5 min)",
          description: "Get up and running fast",
          action: () =>
            window.open("https://youtube.com/watch?v=demo1", "_blank"),
          external: true,
          duration: "5:23",
        },
        {
          icon: Play,
          title: "3D Navigation Basics",
          description: "Learn camera controls and movement",
          action: () =>
            window.open("https://youtube.com/watch?v=demo2", "_blank"),
          external: true,
          duration: "8:45",
        },
        {
          icon: Play,
          title: "Advanced Features",
          description: "Unlock powerful tools",
          action: () =>
            window.open("https://youtube.com/watch?v=demo3", "_blank"),
          external: true,
          duration: "12:30",
        },
        {
          icon: Play,
          title: "Best Practices",
          description: "Tips from power users",
          action: () =>
            window.open("https://youtube.com/watch?v=demo4", "_blank"),
          external: true,
          duration: "15:12",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          icon: HelpCircle,
          title: "How do I navigate the 3D scene?",
          description: "Use mouse to orbit, scroll to zoom, right-click to pan",
          action: () => {},
        },
        {
          icon: HelpCircle,
          title: "Why is the 3D view running slowly?",
          description:
            "Check browser hardware acceleration and close other tabs",
          action: () => {},
        },
        {
          icon: HelpCircle,
          title: "Can I use this on mobile devices?",
          description: "Yes, but desktop is recommended for best experience",
          action: () => {},
        },
        {
          icon: HelpCircle,
          title: "How do I reset the camera view?",
          description: "Double-click anywhere in the 3D scene or press R key",
          action: () => {},
        },
        {
          icon: HelpCircle,
          title: "What browsers are supported?",
          description: "Firefox, Chrome, Safari, and Edge (latest versions)",
          action: () => {},
        },
      ],
    },
  };

  const currentSection = helpSections[activeSection];
  const filteredItems = currentSection.items.filter(
    (item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-40 transition-all duration-200 hover:scale-105 bg-gradient-to-br from-purple-500 to-blue-500 text-white"
      >
        <HelpCircle size={24} />
      </button>

      {/* help menu modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            ref={menuRef}
            className={`rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col ${
              isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {activeSection !== "main" && (
                  <button
                    onClick={() => setActiveSection("main")}
                    className={`p-1 rounded-full transition-colors ${
                      isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight
                      size={18}
                      className="transform rotate-180 text-gray-500"
                    />
                  </button>
                )}
                <h2 className="text-lg font-semibold">
                  {currentSection.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveSection("main");
                }}
                className={`p-1 rounded-full transition-colors ${
                  isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
                }`}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div
              className={`p-4 border-b ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* menu items */}
            <div className="flex-1 overflow-y-auto">
              {filteredItems.length > 0 ? (
                <div>
                  {filteredItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className={`w-full p-4 text-left transition-colors ${
                        index < filteredItems.length - 1
                          ? isDark
                            ? "border-b border-slate-700"
                            : "border-b border-gray-100"
                          : ""
                      } ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <item.icon size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium">
                                {item.title}
                              </h3>
                              {item.badge && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {item.duration && (
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    isDark
                                      ? "bg-slate-600 text-slate-300"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {item.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.external && (
                            <ExternalLink size={16} className="text-gray-400" />
                          )}
                          {item.hasSubmenu && (
                            <ChevronRight size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>No help topics found matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* footer */}
            <div
              className={`p-4 border-t ${
                isDark
                  ? "border-slate-700 bg-slate-700/50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <p className="text-xs text-center text-gray-500">
                Need more help? Contact us at{" "}
                <a
                  href="mailto:support@portfolioportal.com"
                  className="text-purple-600 hover:underline"
                >
                  support@portfolioportal.co.za
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpMenu;
