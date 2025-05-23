import React from 'react';

const templates = [
  {
    title: 'Office',
    description: 'Corporate and professional with a sleek modern look.',
    image: '/placeholders/office.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
  {
    title: 'Gallery',
    description: 'A curated portfolio display, like a personal museum.',
    image: '/placeholders/gallery.png',
  },
  {
    title: 'Space',
    description: 'A futuristic scene that showcases innovation and ambition.',
    image: '/placeholders/space.png',
  },
  {
    title: 'Forest',
    description: 'Serene and natural — ideal for calm, grounded presentation.',
    image: '/placeholders/forest.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen py-12 px-6 lg:px-20 text-white">
      <h1 className="text-4xl font-bold text-center mb-4">Explore Our Templates</h1>
      <p className="text-center text-gray-300 mb-12">Discover the styles you can use to turn your CV into an immersive portfolio.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {templates.map((template, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center text-center transition hover:scale-105">
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <div className="text-white/60 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-purple-500/30 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm">3D Portfolio Preview</p>
              </div>
            </div>
          </div>
            <h2 className="text-xl font-bold mb-2 text-white">{template.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{template.description}</p>
            <button className="px-4 py-2 rounded-full bg-white text-indigo-800 font-semibold text-sm hover:bg-gray-100 transition">Explore</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
