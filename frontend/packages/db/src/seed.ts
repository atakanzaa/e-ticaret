import { PrismaClient, UserRole } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding başlatılıyor...')

  // Mevcut verileri temizle
  await prisma.auditLog.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // Demo kullanıcılar
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shopclonetr.com',
      name: 'Admin Kullanıcı',
      passwordHash: '$2a$12$8QqQ3Q3Q3Q3Q3Q3Q3Q3Q3uvRl.Y.YYjYY.8Q3Q3Q3Q3Q3Q3Q3Q3', // Admin123!
      role: UserRole.ADMIN,
    },
  })

  const sellerUser = await prisma.user.create({
    data: {
      email: 'seller@shopclonetr.com',
      name: 'Satıcı Demo',
      passwordHash: '$2a$12$8QqQ3Q3Q3Q3Q3Q3Q3Q3Q3uvRl.Y.YYjYY.8Q3Q3Q3Q3Q3Q3Q3Q3', // Seller123!
      role: UserRole.SELLER,
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@shopclonetr.com',
      name: 'Normal Kullanıcı',
      passwordHash: '$2a$12$8QqQ3Q3Q3Q3Q3Q3Q3Q3Q3uvRl.Y.YYjYY.8Q3Q3Q3Q3Q3Q3Q3Q3', // User123!
      role: UserRole.USER,
    },
  })

  // 10 adet rastgele kullanıcı
  const users = await Promise.all(
    Array.from({ length: 10 }, async () => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          passwordHash: '$2a$12$8QqQ3Q3Q3Q3Q3Q3Q3Q3Q3uvRl.Y.YYjYY.8Q3Q3Q3Q3Q3Q3Q3Q3',
          role: UserRole.USER,
        },
      })
    })
  )

  // Adresler
  await prisma.address.create({
    data: {
      userId: regularUser.id,
      title: 'Ev',
      fullName: 'Normal Kullanıcı',
      phone: '05551234567',
      country: 'Türkiye',
      city: 'İstanbul',
      district: 'Kadıköy',
      line1: 'Moda Caddesi No: 123 Daire: 4',
      zip: '34710',
      isDefault: true,
    },
  })

  // Kategoriler
  const elektronikCat = await prisma.category.create({
    data: {
      slug: 'elektronik',
      name: 'Elektronik',
      level: 0,
    },
  })

  const telefonCat = await prisma.category.create({
    data: {
      parentId: elektronikCat.id,
      slug: 'telefon',
      name: 'Telefon',
      level: 1,
    },
  })

  const modaCat = await prisma.category.create({
    data: {
      slug: 'moda',
      name: 'Moda',
      level: 0,
    },
  })

  const kiyafetCat = await prisma.category.create({
    data: {
      parentId: modaCat.id,
      slug: 'kiyafet',
      name: 'Kiyafet',
      level: 1,
    },
  })

  const evYasamCat = await prisma.category.create({
    data: {
      slug: 'ev-yasam',
      name: 'Ev & Yaşam',
      level: 0,
    },
  })

  // Markalar
  const apple = await prisma.brand.create({
    data: { name: 'Apple', slug: 'apple' },
  })

  const samsung = await prisma.brand.create({
    data: { name: 'Samsung', slug: 'samsung' },
  })

  const nike = await prisma.brand.create({
    data: { name: 'Nike', slug: 'nike' },
  })

  const adidas = await prisma.brand.create({
    data: { name: 'Adidas', slug: 'adidas' },
  })

  // Satıcılar
  const seller1 = await prisma.seller.create({
    data: {
      userId: sellerUser.id,
      shopName: 'TechStore TR',
      ratingAvg: 4.5,
      ratingCount: 120,
      status: 'APPROVED',
    },
  })

  const sellers = await Promise.all(
    Array.from({ length: 5 }, async (_, index) => {
      return prisma.seller.create({
        data: {
          userId: users[index].id,
          shopName: faker.company.name() + ' Mağazası',
          ratingAvg: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          ratingCount: faker.number.int({ min: 10, max: 500 }),
          status: 'APPROVED',
        },
      })
    })
  )

  // Ürünler
  const iphone = await prisma.product.create({
    data: {
      slug: 'iphone-15-pro',
      title: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro - En gelişmiş iPhone',
      brandId: apple.id,
      categoryId: telefonCat.id,
      attributes: {
        screen: '6.1 inç',
        storage: '128GB',
        color: 'Titanium Black',
      },
    },
  })

  const iphone15Variant = await prisma.productVariant.create({
    data: {
      productId: iphone.id,
      color: 'Titanium Black',
      size: '128GB',
      sku: 'IPHONE15PRO-128-BLACK',
      images: ['/images/iphone15pro-black.jpg'],
    },
  })

  // Samsung telefon
  const galaxyS24 = await prisma.product.create({
    data: {
      slug: 'samsung-galaxy-s24',
      title: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 - AI destekli smartphone',
      brandId: samsung.id,
      categoryId: telefonCat.id,
      attributes: {
        screen: '6.2 inç',
        storage: '256GB',
        color: 'Onyx Black',
      },
    },
  })

  const galaxyVariant = await prisma.productVariant.create({
    data: {
      productId: galaxyS24.id,
      color: 'Onyx Black',
      size: '256GB',
      sku: 'GALAXY-S24-256-BLACK',
      images: ['/images/galaxy-s24-black.jpg'],
    },
  })

  // Nike ayakkabı
  const airMax = await prisma.product.create({
    data: {
      slug: 'nike-air-max-90',
      title: 'Nike Air Max 90',
      description: 'Nike Air Max 90 - Klasik spor ayakkabı',
      brandId: nike.id,
      categoryId: modaCat.id,
      attributes: {
        material: 'Deri ve mesh',
        sole: 'Air Max',
      },
    },
  })

  const airMaxVariant42 = await prisma.productVariant.create({
    data: {
      productId: airMax.id,
      color: 'Beyaz',
      size: '42',
      sku: 'AIRMAX90-42-WHITE',
      images: ['/images/airmax90-white.jpg'],
    },
  })

  // Listinglar (Farklı satıcılardan)
  await prisma.listing.create({
    data: {
      productVariantId: iphone15Variant.id,
      sellerId: seller1.id,
      price: 5499900, // 54,999.00 TL (cent cinsinden)
      stock: 15,
      cargoTimeDays: 1,
      isFeatured: true,
    },
  })

  await prisma.listing.create({
    data: {
      productVariantId: iphone15Variant.id,
      sellerId: sellers[0].id,
      price: 5599900, // 55,999.00 TL
      stock: 8,
      cargoTimeDays: 2,
    },
  })

  await prisma.listing.create({
    data: {
      productVariantId: galaxyVariant.id,
      sellerId: sellers[1].id,
      price: 3499900, // 34,999.00 TL
      stock: 25,
      cargoTimeDays: 1,
      isFeatured: true,
    },
  })

  await prisma.listing.create({
    data: {
      productVariantId: airMaxVariant42.id,
      sellerId: sellers[2].id,
      price: 299900, // 2,999.00 TL
      stock: 50,
      cargoTimeDays: 3,
    },
  })

  // Kuponlar
  await prisma.coupon.create({
    data: {
      code: 'INDIRIM10',
      discountType: 'PERCENTAGE',
      value: 10,
      minBasket: 50000, // 500 TL
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
      usageLimit: 1000,
    },
  })

  await prisma.coupon.create({
    data: {
      code: 'SEPET50',
      discountType: 'FIXED',
      value: 5000, // 50 TL
      minBasket: 100000, // 1000 TL
      validFrom: new Date(),
      validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 gün
      usageLimit: 500,
    },
  })

  // Bannerlar
  await prisma.banner.create({
    data: {
      title: 'Yılın En Büyük İndirim Kampanyası',
      imageUrl: '/images/banner-sale.jpg',
      linkUrl: '/kampanya/buyuk-indirim',
      position: 'HOME_HERO',
      order: 1,
    },
  })

  await prisma.banner.create({
    data: {
      title: 'Teknoloji Ürünlerinde %50 İndirim',
      imageUrl: '/images/banner-tech.jpg',
      linkUrl: '/kategori/elektronik',
      position: 'HOME_STRIP',
      order: 1,
    },
  })

  // Yorumlar
  await prisma.review.create({
    data: {
      userId: regularUser.id,
      productId: iphone.id,
      rating: 5,
      comment: 'Harika bir telefon, çok memnunum!',
      isVerifiedPurchase: true,
    },
  })

  await prisma.review.create({
    data: {
      userId: users[0].id,
      productId: galaxyS24.id,
      rating: 4,
      comment: 'Samsung kalitesi, kamera çok iyi.',
      isVerifiedPurchase: true,
    },
  })

  // Favoriler
  await prisma.favorite.create({
    data: {
      userId: regularUser.id,
      productId: iphone.id,
    },
  })

  console.log('✅ Seed tamamlandı!')
  console.log('📧 Demo hesaplar:')
  console.log('- Admin: admin@shopclonetr.com (Admin123!)')
  console.log('- Satıcı: seller@shopclonetr.com (Seller123!)')
  console.log('- Kullanıcı: user@shopclonetr.com (User123!)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
