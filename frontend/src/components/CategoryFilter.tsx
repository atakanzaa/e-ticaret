import React from 'react';
import { useApp } from '../context/AppContext';

const CategoryFilter: React.FC = () => {
  const { state, dispatch } = useApp();

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'clothing', label: 'Giyim' },
    { value: 'home', label: 'Ev & Yaşam' },
    { value: 'sports', label: 'Spor & Outdoor' },
    { value: 'books', label: 'Kitap' },
    { value: 'beauty', label: 'Kozmetik' },
    { value: 'automotive', label: 'Otomotiv' }
  ];

  const handleCategoryChange = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              state.selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
