import { NextRequest, NextResponse } from 'next/server'
import { db } from '@shopclonetr/db'
import { searchSchema } from '@shopclonetr/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      brandIds: searchParams.getAll('brandId'),
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
      fastCargo: searchParams.get('fastCargo') === 'true',
      inStock: searchParams.get('inStock') === 'true',
      sortBy: searchParams.get('sortBy') as any || 'relevance',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }
    
    // Validate search parameters
    const validatedParams = searchSchema.parse(params)
    
    const page = validatedParams.page || 1
    const limit = Math.min(validatedParams.limit || 20, 100)
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {
      isActive: true,
    }
    
    if (validatedParams.query) {
      where.OR = [
        { title: { contains: validatedParams.query, mode: 'insensitive' } },
        { description: { contains: validatedParams.query, mode: 'insensitive' } },
        { brand: { name: { contains: validatedParams.query, mode: 'insensitive' } } },
      ]
    }
    
    if (validatedParams.categoryId) {
      where.categoryId = validatedParams.categoryId
    }
    
    if (validatedParams.brandIds && validatedParams.brandIds.length > 0) {
      where.brandId = { in: validatedParams.brandIds }
    }
    
    // Listings filtering
    const listingWhere: any = {}
    
    if (validatedParams.minPrice || validatedParams.maxPrice) {
      listingWhere.price = {}
      if (validatedParams.minPrice) listingWhere.price.gte = validatedParams.minPrice * 100 // Convert to cents
      if (validatedParams.maxPrice) listingWhere.price.lte = validatedParams.maxPrice * 100
    }
    
    if (validatedParams.inStock) {
      listingWhere.stock = { gt: 0 }
    }
    
    if (validatedParams.fastCargo) {
      listingWhere.cargoTimeDays = { lte: 2 }
    }
    
    // Build orderBy
    let orderBy: any = {}
    
    switch (validatedParams.sortBy) {
      case 'price_asc':
        orderBy = { variants: { _count: 'desc' } } // Placeholder - we'll sort by min listing price
        break
      case 'price_desc':
        orderBy = { variants: { _count: 'desc' } } // Placeholder
        break
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    // Get products with related data
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          variants: {
            include: {
              listings: {
                where: listingWhere,
                orderBy: { price: 'asc' },
                take: 1,
                include: {
                  seller: {
                    select: {
                      shopName: true,
                      ratingAvg: true,
                    }
                  }
                }
              }
            }
          },
          reviews: {
            select: {
              rating: true,
            }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      
      db.product.count({ where })
    ])
    
    // Filter products that have at least one listing matching criteria
    const filteredProducts = products.filter((product: any) =>
      product.variants.some((variant: any) => (variant.listings as any[]).length > 0)
    )
    
    // Transform data for response
    const transformedProducts = filteredProducts.map((product: any) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
        : 0
      
      const minListing = product.variants
        .flatMap((variant: any) => variant.listings as any[])
        .sort((a: any, b: any) => a.price - b.price)[0]
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        brand: product.brand,
        category: product.category,
        images: product.variants[0]?.images || [],
        minPrice: minListing?.price || 0,
        rating: avgRating,
        reviewCount: product._count.reviews,
        favoriteCount: product._count.favorites,
        seller: minListing?.seller,
        fastCargo: minListing?.cargoTimeDays <= 2,
        inStock: minListing?.stock > 0,
      }
    })
    
    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      filters: {
        // Could include facet counts here
      }
    })
    
  } catch (error: any) {
    console.error('Products API error:', error)
    
    return NextResponse.json(
      { message: 'Ürünler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}
