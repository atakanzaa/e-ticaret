/**
 * Para biçimlendirme ve hesaplama yardımcıları
 */

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(priceInCents / 100)
}

export function parsePrice(priceString: string): number {
  // "₺123,45" formatından 12345 cent'e çevir
  const numericString = priceString.replace(/[^\d,]/g, '').replace(',', '.')
  return Math.round(parseFloat(numericString) * 100)
}

export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= discountedPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

export function applyDiscount(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100))
}

export function calculateTax(price: number, taxRate: number = 20): number {
  return Math.round(price * (taxRate / 100))
}

export function addTax(price: number, taxRate: number = 20): number {
  return price + calculateTax(price, taxRate)
}
