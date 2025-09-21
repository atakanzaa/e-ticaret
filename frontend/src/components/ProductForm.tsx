import React, { useState } from 'react';
import { Upload, X, Plus, Minus } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  sku: string;
  images: string[];
  variants: Array<{
    name: string;
    options: string[];
  }>;
  specifications: Array<{
    key: string;
    value: string;
  }>;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    stock: initialData?.stock || '',
    sku: initialData?.sku || '',
    images: initialData?.images || [],
    variants: initialData?.variants || [],
    specifications: initialData?.specifications || [],
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
  ];

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', options: [''] }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: 'name' | 'options', value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addVariantOption = (variantIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, options: [...variant.options, ''] }
          : variant
      )
    }));
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, options: variant.options.filter((_, j) => j !== optionIndex) }
          : variant
      )
    }));
  };

  const updateVariantOption = (variantIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { 
              ...variant, 
              options: variant.options.map((option, j) => j === optionIndex ? value : option)
            }
          : variant
      )
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const base64List: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const b64 = await toBase64(files[i]);
        base64List.push(b64);
      } catch {}
    }
    if (base64List.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...base64List] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h2 className="text-xl font-semibold text-blue-900">
          {initialData ? 'Edit Product' : 'Create New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter SKU"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter product description"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
            onChange={(e) => handleFilesSelected(e.target.files)}
            />
            <label
              htmlFor="image-upload"
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`preview-${i}`} className="w-full h-28 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Product Variants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Variants
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Variant
            </button>
          </div>

          {formData.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                  placeholder="Variant name (e.g., Size, Color)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(variantIndex)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                {variant.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateVariantOption(variantIndex, optionIndex, e.target.value)}
                      placeholder="Option value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantOption(variantIndex, optionIndex)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addVariantOption(variantIndex)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Specifications
            </label>
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Specification
            </button>
          </div>

          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                placeholder="Specification name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mr-2"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                placeholder="Specification value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mr-2"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {initialData ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;