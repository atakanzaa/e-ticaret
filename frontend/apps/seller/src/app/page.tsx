'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@shopclonetr/ui'
import { Package, ShoppingCart, TrendingUp, Star, Plus } from 'lucide-react'

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user?.role !== 'SELLER' && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'SELLER' && session.user?.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">ShopCloneTR</h1>
              <span className="ml-4 text-gray-500">Satıcı Paneli</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldiniz, {session.user?.name}
              </span>
              <Button asChild variant="outline" size="sm">
                <a href="/api/auth/signout">Çıkış Yap</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Toplam Ürün</div>
                  <div className="text-2xl font-bold text-gray-900">24</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Bu Ay Satış</div>
                  <div className="text-2xl font-bold text-gray-900">₺12,450</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Toplam Sipariş</div>
                  <div className="text-2xl font-bold text-gray-900">156</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Mağaza Puanı</div>
                  <div className="text-2xl font-bold text-gray-900">4.5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ürün Ekle
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Stok Yönetimi
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sipariş Yönetimi
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: '#12345', product: 'iPhone 15 Pro', customer: 'Ahmet Y.', amount: '₺54,999', status: 'Hazırlanıyor' },
                  { id: '#12344', product: 'Samsung Galaxy S24', customer: 'Zehra K.', amount: '₺34,999', status: 'Kargoda' },
                  { id: '#12343', product: 'Nike Air Max', customer: 'Mehmet S.', amount: '₺2,999', status: 'Teslim Edildi' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-600">{order.product} - {order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{order.amount}</div>
                      <div className={`text-sm px-2 py-1 rounded text-center ${
                        order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-800' :
                        order.status === 'Kargoda' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>En Son Eklenen Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'iPhone 15 Pro', price: '₺54,999', stock: 15, image: '📱' },
                { name: 'Samsung Galaxy S24', price: '₺34,999', stock: 25, image: '📱' },
                { name: 'Nike Air Max 90', price: '₺2,999', stock: 50, image: '👟' },
                { name: 'MacBook Air M3', price: '₺44,999', stock: 8, image: '💻' },
              ].map((product, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-4xl text-center mb-3">{product.image}</div>
                  <h3 className="font-medium mb-2 text-center">{product.name}</h3>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-500">{product.price}</div>
                    <div className="text-sm text-gray-600">{product.stock} adet stok</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Düzenle
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
