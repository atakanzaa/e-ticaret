import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { api } from '../../api/client';

export function ProductNewPage() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const handleSubmit = async (form: any) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await api.createProduct({
        name: form.name,
        price: parseFloat(form.price),
        currency: (form.currency as 'TRY' | 'USD' | 'EUR') ?? 'TRY',
        stock: parseInt(form.stock, 10),
        categoryId: form.category || 'general',
        description: form.description,
        image: Array.isArray(form.images) ? form.images[0] : undefined,
        attrs: undefined,
      });
      const next = res?.slug ? `/products/${res.slug}` : '/seller/products';
      navigate(next);
    } catch (e: any) {
      setError(e?.message || 'Product could not be created');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Product</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
        {submitting && (
          <div className="mt-4 text-sm text-gray-500">Saving product...</div>
        )}
      </div>
    </div>
  );
}

export default ProductNewPage;


