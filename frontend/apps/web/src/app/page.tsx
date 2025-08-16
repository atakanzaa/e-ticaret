import { Button } from '@shopclonetr/ui'
import { Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top Bar */}
        <div className="bg-primary-500 text-white text-sm py-1">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <span>Kargo Bedava! (150₺ ve üzeri siparişlerde)</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:underline">Yardım</a>
                <a href="#" className="hover:underline">İletişim</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">ShopCloneTR</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">
                  <User className="h-5 w-5 mr-2" />
                  Giriş Yap
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sepetim
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 py-3">
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Elektronik</a>
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Moda</a>
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Ev & Yaşam</a>
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Kozmetik</a>
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Spor</a>
              <a href="#" className="text-gray-700 hover:text-primary-500 font-medium">Kitap</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Milyonlarca Ürün, Tek Tıkla Kapında!</h2>
          <p className="text-xl mb-8">En sevdiğin markaları, en uygun fiyatlarla keşfet</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/search">Alışverişe Başla</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">Popüler Kategoriler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Telefon', image: '📱' },
              { name: 'Laptop', image: '💻' },
              { name: 'Giyim', image: '👕' },
              { name: 'Ayakkabı', image: '👟' },
              { name: 'Ev Dekorasyon', image: '🏠' },
              { name: 'Kitap', image: '📚' },
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{category.image}</div>
                <h4 className="font-medium">{category.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">Öne Çıkan Ürünler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'iPhone 15 Pro', price: '54.999₺', originalPrice: '59.999₺', image: '📱' },
              { name: 'Samsung Galaxy S24', price: '34.999₺', originalPrice: '39.999₺', image: '📱' },
              { name: 'Nike Air Max 90', price: '2.999₺', originalPrice: '3.499₺', image: '👟' },
              { name: 'MacBook Air M3', price: '44.999₺', originalPrice: '49.999₺', image: '💻' },
            ].map((product) => (
              <div key={product.name} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-6xl text-center mb-4">{product.image}</div>
                <h4 className="font-medium mb-2">{product.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary-500">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
                <Button className="w-full mt-3" size="sm">Sepete Ekle</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-bold mb-4">ShopCloneTR</h5>
              <p className="text-gray-400">Türkiye'nin en büyük online alışveriş platformu</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Kategoriler</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Elektronik</a></li>
                <li><a href="#" className="hover:text-white">Moda</a></li>
                <li><a href="#" className="hover:text-white">Ev & Yaşam</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Müşteri Hizmetleri</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Yardım</a></li>
                <li><a href="#" className="hover:text-white">İletişim</a></li>
                <li><a href="#" className="hover:text-white">İade & Değişim</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Bizi Takip Edin</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopCloneTR. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
