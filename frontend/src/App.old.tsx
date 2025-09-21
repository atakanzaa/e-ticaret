import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown, 
  Menu,
  X,
  Home,
  FileText,
  TrendingUp,
  Calendar,
  Mail,
  Shield,
  Eye,
  Edit,
  Trash2,
  Package,
  Plus,
  Store
} from 'lucide-react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ShoppingPage from './components/ecommerce/ShoppingPage';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

interface TableRowProps {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  image: string;
  sales: number;
  description: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'customer' | 'seller' | 'admin';
}

const TableRow: React.FC<TableRowProps> = ({ name, email, role, status, lastActive }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-medium text-sm">{name.charAt(0)}</span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-900">{role}</td>
    <td className="px-6 py-4">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        status === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">{lastActive}</td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
          <Eye size={16} />
        </button>
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
          <Edit size={16} />
        </button>
        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'shopping' | 'admin'>('shopping');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      price: 99.99,
      stock: 45,
      category: 'Electronics',
      status: 'Active',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      sales: 234,
      description: 'High-quality wireless Bluetooth headphones with noise cancellation.'
    },
    {
      id: '2',
      name: 'Cotton T-Shirt',
      sku: 'CTS-002',
      price: 24.99,
      stock: 0,
      category: 'Clothing',
      status: 'Out of Stock',
      image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      sales: 156,
      description: '100% organic cotton t-shirt available in multiple colors.'
    },
    {
      id: '3',
      name: 'Smart Watch Pro',
      sku: 'SWP-003',
      price: 299.99,
      stock: 23,
      category: 'Electronics',
      status: 'Active',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      sales: 89,
      description: 'Advanced smartwatch with health monitoring and GPS tracking.'
    },
    {
      id: '4',
      name: 'Yoga Mat Premium',
      sku: 'YMP-004',
      price: 49.99,
      stock: 67,
      category: 'Sports & Outdoors',
      status: 'Active',
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      sales: 78,
      description: 'Premium non-slip yoga mat with extra cushioning.'
    },
    {
      id: '5',
      name: 'Coffee Maker Deluxe',
      sku: 'CMD-005',
      price: 149.99,
      stock: 12,
      category: 'Home & Garden',
      status: 'Draft',
      image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      sales: 45,
      description: 'Programmable coffee maker with built-in grinder.'
    }
  ]);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'products', name: 'Products', icon: <Package size={20} /> },
    { id: 'inventory', name: 'Inventory', icon: <Store size={20} /> },
    { id: 'users', name: 'Users', icon: <Users size={20} /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'reports', name: 'Reports', icon: <FileText size={20} /> },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'messages', name: 'Messages', icon: <Mail size={20} /> },
    { id: 'security', name: 'Security', icon: <Shield size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  const statsData = [
    {
      title: 'Total Users',
      value: '14,842',
      change: '+12.5%',
      isPositive: true,
      icon: <Users className="text-blue-600" size={24} />
    },
    {
      title: 'Revenue',
      value: '$89,432',
      change: '+8.2%',
      isPositive: true,
      icon: <TrendingUp className="text-blue-600" size={24} />
    },
    {
      title: 'Orders',
      value: '2,341',
      change: '-3.1%',
      isPositive: false,
      icon: <ShoppingCart className="text-blue-600" size={24} />
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+5.7%',
      isPositive: true,
      icon: <BarChart3 className="text-blue-600" size={24} />
    }
  ];

  const productStats = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: '+5.2%',
      isPositive: true,
      icon: <Package className="text-blue-600" size={24} />
    },
    {
      title: 'Active Products',
      value: products.filter(p => p.status === 'Active').length.toString(),
      change: '+3.1%',
      isPositive: true,
      icon: <Store className="text-blue-600" size={24} />
    },
    {
      title: 'Out of Stock',
      value: products.filter(p => p.status === 'Out of Stock').length.toString(),
      change: '-12.5%',
      isPositive: true,
      icon: <ShoppingCart className="text-blue-600" size={24} />
    },
    {
      title: 'Total Sales',
      value: products.reduce((sum, p) => sum + p.sales, 0).toString(),
      change: '+8.7%',
      isPositive: true,
      icon: <TrendingUp className="text-blue-600" size={24} />
    }
  ];

  const userData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' as const, lastActive: '2 hours ago' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'Active' as const, lastActive: '5 minutes ago' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive' as const, lastActive: '2 days ago' },
    { name: 'Emma Davis', email: 'emma@example.com', role: 'Moderator', status: 'Active' as const, lastActive: '1 hour ago' },
    { name: 'Tom Brown', email: 'tom@example.com', role: 'User', status: 'Active' as const, lastActive: '30 minutes ago' },
  ];

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    // Demo login logic
    let userType: 'customer' | 'seller' | 'admin' = 'customer';
    
    if (email === 'admin@demo.com' && password === 'admin123') {
      userType = 'admin';
    } else if (email === 'seller@demo.com' && password === 'seller123') {
      userType = 'seller';
    }

    const user: User = {
      id: '1',
      email,
      firstName: userType === 'admin' ? 'Admin' : userType === 'seller' ? 'Seller' : 'Customer',
      lastName: 'User',
      accountType: userType
    };

    setCurrentUser(user);
    
    if (userType === 'admin' || userType === 'seller') {
      setCurrentView('admin');
    } else {
      setCurrentView('shopping');
    }
  };

  const handleSignup = (userData: any) => {
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      accountType: userData.accountType
    };

    setCurrentUser(user);
    
    if (userData.accountType === 'seller') {
      setCurrentView('admin');
    } else {
      setCurrentView('shopping');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('shopping');
  };

  const handleProfileClick = () => {
    if (currentUser?.accountType === 'admin' || currentUser?.accountType === 'seller') {
      setCurrentView('admin');
    }
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  // Product handlers
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleViewProduct = (product: Product) => {
    alert(`Viewing product: ${product.name}`);
  };

  const handleProductSubmit = (formData: any) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              ...formData,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock)
            }
          : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'Draft' as const,
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        sales: 0
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Render different views
  if (currentView === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'shopping') {
    return (
      <ShoppingPage
        onLoginClick={handleLoginClick}
        onProfileClick={handleProfileClick}
        isLoggedIn={!!currentUser}
        userType={currentUser?.accountType}
      />
    );
  }

  // Admin/Seller Panel
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-700">
            {currentUser?.accountType === 'admin' ? 'AdminPanel' : 'SellerHub'}
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h2>
                <p className="text-sm text-gray-500">
                  Welcome back, {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => setCurrentView('shopping')}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Store
              </button>
              
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {currentUser?.firstName?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1 min-w-[200px] z-50">
                    <button 
                      onClick={() => {
                        setCurrentView('shopping');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    >
                      🏪 View Store
                    </button>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {showProductForm ? (
            <ProductForm
              onSubmit={handleProductSubmit}
              onCancel={handleCancelProductForm}
              initialData={editingProduct ? {
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price.toString(),
                category: editingProduct.category,
                stock: editingProduct.stock.toString(),
                sku: editingProduct.sku,
                images: [editingProduct.image],
                variants: [],
                specifications: []
              } : undefined}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                      <StatCard key={index} {...stat} />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                      <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="mx-auto text-blue-600 mb-2" size={48} />
                          <p className="text-gray-600">Chart Component Here</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                      <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <TrendingUp className="mx-auto text-blue-600 mb-2" size={48} />
                          <p className="text-gray-600">Activity Chart Here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {userData.map((user, index) => (
                            <TableRow key={index} {...user} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                      <p className="text-gray-600">Manage your product catalog and inventory</p>
                    </div>
                    <button
                      onClick={handleCreateProduct}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={20} className="mr-2" />
                      Add Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productStats.map((stat, index) => (
                      <StatCard key={index} {...stat} />
                    ))}
                  </div>

                  <ProductList
                    products={products}
                    onEdit={(product) => handleEditProduct(product as any)}
                    onDelete={(product) => handleDeleteProduct(product as any)}
                    onView={(product) => handleViewProduct(product as any)}
                  />
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                      <p className="text-gray-600">Track stock levels and manage inventory</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Package className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Low Stock Alert
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            {products.filter(p => p.stock < 20 && p.stock > 0).length} products are running low on stock.
                            {products.filter(p => p.stock === 0).length} products are out of stock.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productStats.map((stat, index) => (
                      <StatCard key={index} {...stat} />
                    ))}
                  </div>

                  <ProductList
                    products={products}
                    onEdit={(product) => handleEditProduct(product as any)}
                    onDelete={(product) => handleDeleteProduct(product as any)}
                    onView={(product) => handleViewProduct(product as any)}
                  />
                </div>
              )}

              {activeTab !== 'dashboard' && 
               activeTab !== 'products' && 
               activeTab !== 'inventory' && (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">{activeTab} Section</h3>
                  <p className="text-gray-600">This section is under development. Content for {activeTab} will be displayed here.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;