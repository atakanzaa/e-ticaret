import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

// Product schemas
export const productSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
  description: z.string().optional(),
  brandId: z.string().min(1, 'Marka seçiniz'),
  categoryId: z.string().min(1, 'Kategori seçiniz'),
  attributes: z.record(z.any()).optional(),
})

export const productVariantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  sku: z.string().min(1, 'SKU gereklidir'),
  barcode: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'En az bir görsel gereklidir'),
})

export const listingSchema = z.object({
  productVariantId: z.string().min(1, 'Ürün varyantı seçiniz'),
  price: z.number().positive('Fiyat pozitif olmalıdır'),
  stock: z.number().int().min(0, 'Stok 0 veya pozitif olmalıdır'),
  cargoTimeDays: z.number().int().min(1).max(30, 'Kargo süresi 1-30 gün arası olmalıdır'),
})

// Address schema
export const addressSchema = z.object({
  title: z.string().min(2, 'Adres başlığı en az 2 karakter olmalıdır'),
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli telefon numarası giriniz'),
  country: z.string().min(1, 'Ülke seçiniz'),
  city: z.string().min(1, 'Şehir seçiniz'),
  district: z.string().min(1, 'İlçe seçiniz'),
  line1: z.string().min(5, 'Adres detayı en az 5 karakter olmalıdır'),
  zip: z.string().min(5, 'Posta kodu en az 5 karakter olmalıdır'),
})

// Cart schemas
export const addToCartSchema = z.object({
  listingId: z.string().min(1, 'Listing ID gereklidir'),
  quantity: z.number().int().positive('Miktar pozitif olmalıdır'),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  brandIds: z.array(z.string()).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  fastCargo: z.boolean().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'rating', 'newest']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

// Review schema
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Ürün ID gereklidir'),
  rating: z.number().int().min(1).max(5, 'Puan 1-5 arası olmalıdır'),
  comment: z.string().min(10, 'Yorum en az 10 karakter olmalıdır').optional(),
  images: z.array(z.string().url()).max(5, 'En fazla 5 görsel ekleyebilirsiniz').optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
export type ListingInput = z.infer<typeof listingSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
