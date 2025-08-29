import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductForm from '../components/ProductForm';
import { api } from '../api/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  CardMedia,
  CardActions,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

type SellerProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sellerId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const SellerDashboardInner: React.FC = () => {
  const { state } = useApp();
  const isSeller = useMemo(() => state.user?.role === 'seller' || state.user?.role === 'admin', [state.user]);
  
  const [store, setStore] = useState<{ name: string; image?: string } | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [stats, setStats] = useState<{ activeProducts: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  const loadData = async () => {
    if (!isSeller) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [storeData, productsData, statsData] = await Promise.all([
        api.getMyStore().catch(() => ({ 
          name: state.user?.name || 'My Store', 
          storeName: state.user?.name || 'My Store',
          image: undefined 
        })),
        api.getSellerProducts(),
        api.getSellerStats().catch(() => ({ activeProducts: 0 })),
      ]);

      setStore({ 
        name: storeData.storeName || storeData.name || 'My Store', 
        image: storeData.storeImage || storeData.image 
      });
      setProducts(productsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading seller data:', err);
      setError('Failed to load seller data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isSeller, state.user]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleEditProduct = (product: SellerProduct) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteSellerProduct(productId);
      await loadData(); // Refresh data
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleProductFormSuccess = async () => {
    await loadData(); // Refresh data after successful create/update
  };

  const getProductImageUrl = (product: SellerProduct): string => {
    return product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Store Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={store?.image} 
              sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
            >
              {(store?.name || 'S')[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {store?.name || 'My Store'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats?.activeProducts || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Products
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateProduct}
                disabled={loading}
              >
                Create Product
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gap: 3, 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          } 
        }}>
          {products.map((product) => (
            <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={getProductImageUrl(product)}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="h6" component="h2" noWrap sx={{ flex: 1 }}>
                    {product.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <InventoryIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {product.quantity}
                    </Typography>
                  </Box>
                </Box>

                {product.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1, 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
                <Box>
                  <Tooltip title="Edit Product">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditProduct(product)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteProduct(product.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          ))}

          {products.length === 0 && !loading && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No products yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start by creating your first product to showcase in your store.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleCreateProduct}
                  >
                    Create Your First Product
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {/* Product Form Dialog */}
      <ProductForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        onSuccess={handleProductFormSuccess}
        editProduct={editingProduct}
      />
    </Box>
  );
};

const SellerDashboard: React.FC = () => (
  <ProtectedRoute roles={['seller', 'admin']}>
    <SellerDashboardInner />
  </ProtectedRoute>
);

export default SellerDashboard;