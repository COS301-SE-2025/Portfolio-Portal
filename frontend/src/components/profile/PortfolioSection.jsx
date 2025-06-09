import { useState } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const PortfolioSection = ({ portfolios, setPortfolios }) => {
  const { isDark } = useTheme();
  const [newPortfolio, setNewPortfolio] = useState({ name: '', url: '' });
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  const handleAddPortfolio = () => {
    if (newPortfolio.name && newPortfolio.url) {
      const newId = Math.max(...portfolios.map(p => p.id), 0) + 1;
      setPortfolios([...portfolios, { id: newId, ...newPortfolio }]);
      setNewPortfolio({ name: '', url: '' });
      setShowAddPortfolio(false);
    }
  };

  const handleRemovePortfolio = (id) => {
    setPortfolios(portfolios.filter(p => p.id !== id));
  };

  return (
    <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Portfolio Websites
          </h2>
        </div>
        <button
          onClick={() => setShowAddPortfolio(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <Plus className="w-4 h-4" />
          Add Portfolio
        </button>
      </div>

      <div className="space-y-4">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {portfolio.name}
                </h3>
                <a
                  href={portfolio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  {portfolio.url}
                </a>
              </div>
              <button
                onClick={() => handleRemovePortfolio(portfolio.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {showAddPortfolio && (
          <div className={`p-4 rounded-lg border ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Portfolio Name"
                value={newPortfolio.name}
                onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={newPortfolio.url}
                onChange={(e) => setNewPortfolio({...newPortfolio, url: e.target.value})}
                className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddPortfolio}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddPortfolio(false);
                    setNewPortfolio({ name: '', url: '' });
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;