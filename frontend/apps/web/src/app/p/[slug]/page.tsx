import { notFound } from 'next/navigation'
import { db } from '@shopclonetr/db'
import { Button, Card, CardContent } from '@shopclonetr/ui'
import { formatPrice } from '@shopclonetr/utils'
import { Star, ShoppingCart, Heart, Truck } from 'lucide-react'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          listings: {
            include: {
              seller: {
                select: {
                  shopName: true,
                  ratingAvg: true,
                  ratingCount: true,
                }
              }
            },
            orderBy: { price: 'asc' }
          }
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
          favorites: true,
        }
      }
    }
  })

  if (!product) return null

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
    : 0

  return { ...product, avgRating }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const allListings = product.variants.flatMap((variant: any) => variant.listings as any[])
  const cheapestListing = allListings.sort((a: any, b: any) => a.price - b.price)[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-8xl mb-4">📱</div>
              <p className="text-gray-500">Ürün Görseli</p>
            </div>
            
            {/* Thumbnail images would go here */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded border-2 border-transparent hover:border-primary-500 cursor-pointer p-2">
                  <div className="text-2xl text-center">📷</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                {product.brand.name} • {product.category.name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.avgRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.avgRating.toFixed(1)} ({product._count.reviews} değerlendirme)
              </span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl font-bold text-primary-500">
                {formatPrice(cheapestListing.price)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                KDV Dahil
              </div>
            </div>

            {/* Variant Selection (Color/Size) */}
            <div className="space-y-4">
              {product.variants.length > 1 && (
                <div>
                  <h3 className="font-medium mb-2">Varyantlar</h3>
                  <div className="flex space-x-2">
                    {product.variants.map((variant: any) => (
                      <Button
                        key={variant.id}
                        variant="outline"
                        size="sm"
                        className="border-2"
                      >
                        {variant.color && variant.color}
                        {variant.size && ` - ${variant.size}`}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex space-x-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sepete Ekle
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-700">
                  <Truck className="h-5 w-5 mr-2" />
                  <span className="font-medium">
                    {cheapestListing.cargoTimeDays} gün içinde kargo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sellers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Satıcılar</h2>
          <div className="space-y-4">
            {allListings.map((listing: any) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{listing.seller.shopName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= listing.seller.ratingAvg
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>({listing.seller.ratingCount} değerlendirme)</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatPrice(listing.price)}</div>
                      <div className="text-sm text-gray-500">
                        {listing.cargoTimeDays} gün kargo • {listing.stock} adet stok
                      </div>
                    </div>
                    
                    <Button>Sepete Ekle</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Ürün Açıklaması</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || 'Ürün açıklaması bulunmamaktadır.'}
              </p>
              
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Teknik Özellikler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.attributes as Record<string, any>).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Değerlendirmeler</h2>
          <div className="space-y-4">
            {product.reviews.map((review: { id: string; rating: number; comment?: string | null; createdAt: string | Date; user: { name: string } }) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
