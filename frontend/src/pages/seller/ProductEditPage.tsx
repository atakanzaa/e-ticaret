import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { api } from '../../api/client';

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = React.useState<any>(null);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        // Backend might accept slug or id in catalog detail; try slug first
        try {
          const p = await api.getProductBySlug(id);
          setInitial({
            name: (p as any).name,
            description: (p as any).description,
            price: String((p as any).price ?? ''),
            category: (p as any).category ?? '',
            stock: String((p as any).stock ?? ''),
            sku: (p as any).sku ?? '',
            images: (p as any).images ?? ((p as any).image ? [(p as any).image] : []),
          });
          return;
        } catch {}
      } catch (e: any) {
        setError(e?.message || 'Failed to load product');
      }
    })();
  }, [id]);

  const handleSubmit = async (form: any) => {
    try {
      if (!id) return;
      await api.updateProduct(id, {
        name: form.name,
        price: parseFloat(form.price),
        currency: (form.currency as 'TRY' | 'USD' | 'EUR') ?? 'TRY',
        stock: parseInt(form.stock, 10),
        categoryId: form.category || 'general',
        description: form.description,
        image: Array.isArray(form.images) ? form.images[0] : undefined,
      });
      navigate('/seller/products');
    } catch (e: any) {
      setError(e?.message || 'Failed to update product');
    }
  };

  const handleCancel = () => {
    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Product</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={initial || undefined} />
      </div>
    </div>
  );
}


