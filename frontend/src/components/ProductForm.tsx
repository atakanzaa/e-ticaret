import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { api } from '../api/client';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Health & Beauty',
  'Automotive',
  'Toys & Games',
  'Food & Beverages',
  'Other'
];

type ProductFormData = {
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
};

type ProductFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    description?: string;
  } | null;
};

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSuccess, editProduct }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: editProduct?.name || '',
    category: editProduct?.category || categories[0],
    price: editProduct?.price || 0,
    quantity: editProduct?.quantity || 0,
    imageUrl: editProduct?.imageUrl || '',
    description: editProduct?.description || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        category: editProduct.category,
        price: editProduct.price,
        quantity: editProduct.quantity,
        imageUrl: editProduct.imageUrl || '',
        description: editProduct.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: categories[0],
        price: 0,
        quantity: 0,
        imageUrl: '',
        description: '',
      });
    }
    setError(null);
  }, [editProduct, open]);

  const handleInputChange = (field: keyof ProductFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.category) return 'Category is required';
    if (formData.price <= 0) return 'Price must be greater than 0';
    if (formData.quantity < 0) return 'Quantity cannot be negative';
    if (formData.name.length < 2) return 'Product name must be at least 2 characters';
    if (formData.name.length > 255) return 'Product name cannot exceed 255 characters';
    if (formData.imageUrl && formData.imageUrl.length > 500) return 'Image URL cannot exceed 500 characters';
    if (formData.description.length > 2000) return 'Description cannot exceed 2000 characters';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price,
        quantity: formData.quantity,
        imageUrl: formData.imageUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (editProduct) {
        await api.updateSellerProduct(editProduct.id, payload);
      } else {
        await api.createSellerProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editProduct ? 'Edit Product' : 'Create New Product'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Product Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              fullWidth
              disabled={loading}
              error={!formData.name.trim() && formData.name !== ''}
              helperText={!formData.name.trim() && formData.name !== '' ? 'Product name is required' : ''}
            />

            <TextField
              label="Category"
              select
              value={formData.category}
              onChange={handleInputChange('category')}
              required
              fullWidth
              disabled={loading}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                required
                fullWidth
                disabled={loading}
                inputProps={{ min: 0.01, step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={formData.price <= 0}
                helperText={formData.price <= 0 ? 'Price must be greater than 0' : ''}
              />

              <TextField
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                required
                fullWidth
                disabled={loading}
                inputProps={{ min: 0 }}
                error={formData.quantity < 0}
                helperText={formData.quantity < 0 ? 'Quantity cannot be negative' : ''}
              />
            </Box>

            <TextField
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleInputChange('imageUrl')}
              fullWidth
              disabled={loading}
              placeholder="https://example.com/image.jpg"
              helperText="Optional: URL to product image"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              placeholder="Describe your product..."
              helperText={`${formData.description.length}/2000 characters`}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
