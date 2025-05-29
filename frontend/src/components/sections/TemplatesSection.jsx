import { forwardRef } from 'react';
import TemplateCard from '../TemplateCard';
import templates from '../../data/Templates';

const TemplatesSection = forwardRef(({ id, show, isDark }, ref) => {
  return (
    <div id={id} ref={ref} className="min-h-screen py-12 px-6 lg:px-20">
      {show && (
        <div className={`max-w-5xl mx-auto animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <h1 className="text-4xl font-bold text-center mb-4">Explore Our Templates</h1>
          <p className={`text-center mb-12 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            Discover the styles you can use to turn your CV into an immersive portfolio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {templates.map((template, index) => (
              <TemplateCard key={index} template={template} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default TemplatesSection;

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}