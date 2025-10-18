import 'dotenv/config'
import { createDirectus, rest, staticToken } from '@directus/sdk'

const url = process.env.PUBLIC_URL || 'http://localhost:8055'
const email = process.env.ADMIN_EMAIL!
const password = process.env.ADMIN_PASSWORD!

async function login(): Promise<string> {
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Login failed')
  const data = await res.json() as any
  return data.data.access_token
}

async function seed() {
  const token = await login()
  const client = createDirectus(url).with(rest()).with(staticToken(token))

  // Seed categories
  const categories = [
    { name: 'Tôm', slug: 'tom', description: 'Tôm biển tươi sống', status: 'published' },
    { name: 'Cá', slug: 'ca', description: 'Các loại cá biển', status: 'published' },
    { name: 'Mực', slug: 'muc', description: 'Mực ống, mực lá', status: 'published' },
    { name: 'Hàu', slug: 'hau', description: 'Hàu sữa, hàu đá', status: 'published' }
  ]
  // @ts-ignore
  const catRes = await client.request(({
    path: '/items/categories', method: 'POST', body: categories
  }) as any)

  // Map slug->id
  // @ts-ignore
  const catList = await client.request(({ path: '/items/categories', method: 'GET', params: { limit: 100 } }) as any)

  const catId = (slug: string) => (catList.data || catList).find((c: any) => c.slug === slug)?.id

  // Seed products
  const products = [
    { name: 'Tôm sú 1kg', slug: 'tom-su-1kg', category: catId('tom'), image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', price: 250000, status: 'published' },
    { name: 'Cá thu 1kg', slug: 'ca-thu-1kg', category: catId('ca'), image_url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop', price: 180000, status: 'published' },
    { name: 'Mực lá 1kg', slug: 'muc-la-1kg', category: catId('muc'), image_url: 'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12?q=80&w=800&auto=format&fit=crop', price: 220000, status: 'published' },
    { name: 'Hàu sữa 1kg', slug: 'hau-sua-1kg', category: catId('hau'), image_url: 'https://images.unsplash.com/photo-1460744904113-90f2d647b8c5?q=80&w=800&auto=format&fit=crop', price: 150000, status: 'published' }
  ]
  // @ts-ignore
  await client.request(({ path: '/items/products', method: 'POST', body: products }) as any)

  // Seed bank account
  const bank = { bank_name: 'Vietcombank', account_number: '0123456789', account_holder: 'HAI SAN LAGI', description: 'Chuyển khoản ghi rõ mã đơn hàng' }
  // @ts-ignore
  await client.request(({ path: '/items/bank_accounts', method: 'POST', body: bank }) as any)

  console.log('Seed xong dữ liệu mẫu!')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})