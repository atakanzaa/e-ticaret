import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { api } from '../api/client';

const ProductGrid: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Convert UI sort to API sort
        let sort: string | undefined;
        if (state.sortBy === 'price-low') sort = 'price,asc';
        else if (state.sortBy === 'price-high') sort = 'price,desc';
        else if (state.sortBy === 'name') sort = 'name,asc';

        const products = await api.listProducts({
          category: state.selectedCategory,
          q: state.searchQuery,
          sort,
        });
        if (isMounted) dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        if (isMounted) dispatch({ type: 'SET_PRODUCTS', payload: [] });
      } finally {
        if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [dispatch, state.searchQuery, state.selectedCategory, state.sortBy]);

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesCategory = state.selectedCategory === 'all' || 
      product.category.toLowerCase() === state.selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts];

  if (state.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;