import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles } from 'lucide-react';

export default function CategorySlider() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Shop by Category</span>
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              श्रेणी अनुसार
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">Explore fresh vegetables, seasonal fruits, dairy & spices</p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Category Horizontal Scrolling Row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
        
        {/* All Products Card */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-shrink-0 flex flex-col items-center gap-2.5 group transition ${
            selectedCategory === 'all' ? 'scale-105' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl transition border-3 shadow-md ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white border-emerald-500 ring-4 ring-emerald-100'
              : 'bg-stone-100 text-stone-700 border-white group-hover:border-emerald-200'
          }`}>
            🛒
          </div>
          <div className="text-center">
            <span className={`block text-xs font-bold ${
              selectedCategory === 'all' ? 'text-emerald-800' : 'text-stone-800'
            }`}>
              All Items
            </span>
            <span className="block text-[10px] text-stone-400 font-medium">सभी उत्पाद</span>
          </div>
        </button>

        {/* Dynamic Category Cards */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2.5 group transition ${
                isSelected ? 'scale-105' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 shadow-md transition relative ${
                isSelected
                  ? 'border-emerald-500 ring-4 ring-emerald-100'
                  : 'border-white group-hover:border-emerald-200'
              }`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-600/20 backdrop-blur-[1px]"></div>
                )}
              </div>

              <div className="text-center max-w-[90px] sm:max-w-[105px]">
                <span className={`block text-xs font-bold truncate ${
                  isSelected ? 'text-emerald-800' : 'text-stone-800'
                }`}>
                  {cat.name.replace('Fresh ', '')}
                </span>
                <span className="block text-[10px] text-stone-400 font-medium truncate">
                  {cat.hindiName || ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
