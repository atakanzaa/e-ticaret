'use client'

import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@shopclonetr/ui'

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

        <Card>
          <CardHeader>
            <CardTitle>Sepetiniz boş</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Alışverişe başlamak için ürünleri keşfedin.</p>
            <Button asChild>
              <Link href="/search">Alışverişe Başla</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


