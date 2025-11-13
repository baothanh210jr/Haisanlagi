import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const url = process.env.PUBLIC_URL || 'http://localhost:8055'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

async function login() {
  console.log(`Logging in with ${password}...`)
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data.access_token
}

async function ensureSeed(token) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  // ensure permissions for Admin policy
  // get current user and their role
  const meRes = await fetch(`${url}/users/me`, { headers })
  if (!meRes.ok) throw new Error(`GET /users/me failed: ${meRes.status} ${await meRes.text()}`)
  const me = (await meRes.json()).data
  const roleId = me.role
  const polRes = await fetch(`${url}/policies?limit=-1`, { headers })
  if (!polRes.ok) throw new Error(`GET /policies failed: ${polRes.status} ${await polRes.text()}`)
  const policies = (await polRes.json()).data || []
  const adminPolicy = policies.find(p => p.name === 'Policy for Admin') || policies.find(p => p.admin_access)
  const policyId = adminPolicy?.id
  if (!policyId) throw new Error(`Không tìm thấy policy cho role ${roleId}`)
  const neededPerms = [
    { collection: 'categories', action: 'read' },
    { collection: 'categories', action: 'create' },
    { collection: 'products', action: 'read' },
    { collection: 'products', action: 'create' },
    { collection: 'bank_accounts', action: 'read' },
    { collection: 'bank_accounts', action: 'create' }
  ]
  const existingPermsRes = await fetch(`${url}/permissions?limit=-1&filter[policy][_eq]=${policyId}`, { headers })
  if (!existingPermsRes.ok) throw new Error(`GET /permissions failed: ${existingPermsRes.status} ${await existingPermsRes.text()}`)
  const existingPerms = (await existingPermsRes.json()).data || []
  const hasPerm = (col, act) => existingPerms.some(p => p.collection === col && p.action === act)
  const toPerm = neededPerms.filter(p => !hasPerm(p.collection, p.action)).map(p => ({ ...p, policy: policyId, permissions: {}, validation: {} }))
  if (toPerm.length) {
    const createPermRes = await fetch(`${url}/permissions`, { method: 'POST', headers, body: JSON.stringify(toPerm) })
    if (!createPermRes.ok) throw new Error(`POST /permissions failed: ${createPermRes.status} ${await createPermRes.text()}`)
  }

  // categories
  const categoriesSeed = [
    { name: 'Tôm', slug: 'tom', description: 'Tôm biển tươi sống', status: 'published' },
    { name: 'Cá', slug: 'ca', description: 'Các loại cá biển', status: 'published' },
    { name: 'Mực', slug: 'muc', description: 'Mực ống, mực lá', status: 'published' },
    { name: 'Hàu', slug: 'hau', description: 'Hàu sữa, hàu đá', status: 'published' }
  ]

  const catRes = await fetch(`${url}/items/categories?limit=-1`, { headers })
  if (!catRes.ok) throw new Error(`GET /items/categories failed: ${catRes.status} ${await catRes.text()}`)
  const catJson = await catRes.json()
  const cats = catJson.data || []
  const slugSet = new Set(cats.map(c => c.slug))
  const toCreate = categoriesSeed.filter(c => !slugSet.has(c.slug))
  if (toCreate.length) {
    const createRes = await fetch(`${url}/items/categories`, { method: 'POST', headers, body: JSON.stringify(toCreate) })
    if (!createRes.ok) throw new Error(`POST /items/categories failed: ${createRes.status} ${await createRes.text()}`)
  }

  const catRes2 = await fetch(`${url}/items/categories?limit=-1`, { headers })
  if (!catRes2.ok) throw new Error(`GET /items/categories failed: ${catRes2.status} ${await catRes2.text()}`)
  const catJson2 = await catRes2.json()
  const cats2 = catJson2.data || []
  const idBySlug = (s) => cats2.find(c => c.slug === s)?.id

  // products
  const productsSeed = [
    { name: 'Tôm sú 1kg', slug: 'tom-su-1kg', category: idBySlug('tom'), image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', price: 250000, status: 'published' },
    { name: 'Cá thu 1kg', slug: 'ca-thu-1kg', category: idBySlug('ca'), image_url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop', price: 180000, status: 'published' },
    { name: 'Mực lá 1kg', slug: 'muc-la-1kg', category: idBySlug('muc'), image_url: 'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12?q=80&w=800&auto=format&fit=crop', price: 220000, status: 'published' },
    { name: 'Hàu sữa 1kg', slug: 'hau-sua-1kg', category: idBySlug('hau'), image_url: 'https://images.unsplash.com/photo-1460744904113-90f2d647b8c5?q=80&w=800&auto=format&fit=crop', price: 150000, status: 'published' }
  ]

  const prodRes = await fetch(`${url}/items/products?limit=-1`, { headers })
  if (!prodRes.ok) throw new Error(`GET /items/products failed: ${prodRes.status} ${await prodRes.text()}`)
  const prodJson = await prodRes.json()
  const prodSlugs = new Set((prodJson.data || []).map(p => p.slug))
  const prodToCreate = productsSeed.filter(p => !prodSlugs.has(p.slug))
  if (prodToCreate.length) {
    const prodCreateRes = await fetch(`${url}/items/products`, { method: 'POST', headers, body: JSON.stringify(prodToCreate) })
    if (!prodCreateRes.ok) throw new Error(`POST /items/products failed: ${prodCreateRes.status} ${await prodCreateRes.text()}`)
  }

  // Ensure file image field exists on products
  const fieldsRes = await fetch(`${url}/fields/products?limit=-1`, { headers })
  if (!fieldsRes.ok) throw new Error(`GET /fields/products failed: ${fieldsRes.status} ${await fieldsRes.text()}`)
  const fieldsJson = await fieldsRes.json()
  const hasImageField = (fieldsJson.data || []).some(f => f.field === 'image')
  if (!hasImageField) {
    const fieldCreateRes = await fetch(`${url}/fields/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        field: 'image',
        type: 'uuid',
        meta: { field: 'image', interface: 'file' },
        schema: { data_type: 'uuid' }
      })
    })
    if (!fieldCreateRes.ok) throw new Error(`POST /fields/products (image) failed: ${fieldCreateRes.status} ${await fieldCreateRes.text()}`)
  }

  // Upload and assign a few sample images for main seeded products
  const currentProductsRes = await fetch(`${url}/items/products?limit=-1&fields=id,slug,name,image`, { headers })
  if (!currentProductsRes.ok) throw new Error(`GET /items/products (id,slug) failed: ${currentProductsRes.status} ${await currentProductsRes.text()}`)
  const currentProducts = (await currentProductsRes.json()).data || []
  const seedBySlug = new Map(productsSeed.map(p => [p.slug, p]))
  for (const p of currentProducts) {
    if (!seedBySlug.has(p.slug)) continue
    if (p.image) continue // already has file image assigned
    const srcUrl = seedBySlug.get(p.slug).image_url
    if (!srcUrl) continue
    // Import file from URL into Directus files
    let fileId = null
    // Try remote import (may be disabled depending on Directus config)
    const remoteRes = await fetch(`${url}/files`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url: srcUrl, title: p.name, type: 'image/jpeg' })
    })
    if (remoteRes.ok) {
      const fileJson = await remoteRes.json()
      fileId = (fileJson.data || fileJson)?.id || null
    } else {
      console.warn(`Warning: remote upload for ${p.slug} failed: ${remoteRes.status} ${await remoteRes.text()}`)
    }
    // Fallback: upload local placeholder via multipart/form-data
    if (!fileId) {
      try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const placeholderPath = path.resolve(__dirname, '../frontend/public/placeholder/fish.svg')
        const svgBuffer = fs.readFileSync(placeholderPath)
        const form = new FormData()
        form.append('file', new Blob([svgBuffer], { type: 'image/svg+xml' }), 'fish.svg')
        form.append('title', p.name)
        const localRes = await fetch(`${url}/files`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
        if (localRes.ok) {
          const localJson = await localRes.json()
          fileId = (localJson.data || localJson)?.id || null
        } else {
          console.warn(`Warning: local upload for ${p.slug} failed: ${localRes.status} ${await localRes.text()}`)
        }
      } catch (e) {
        console.warn(`Warning: local upload for ${p.slug} errored:`, e)
      }
    }
    if (!fileId) continue
    const patchRes = await fetch(`${url}/items/products/${p.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ image: fileId })
    })
    if (!patchRes.ok) console.warn(`Warning: assign image to product ${p.slug} failed: ${patchRes.status} ${await patchRes.text()}`)
  }

  // Ensure mỗi category có 20 sản phẩm mẫu
  const catsForProductsRes = await fetch(`${url}/items/categories?limit=-1`, { headers })
  if (!catsForProductsRes.ok) throw new Error(`GET /items/categories failed: ${catsForProductsRes.status} ${await catsForProductsRes.text()}`)
  const catsForProducts = (await catsForProductsRes.json()).data || []

  // Lấy toàn bộ slug sản phẩm hiện có để tránh trùng
  const prodAllRes = await fetch(`${url}/items/products?limit=-1&fields=slug,category`, { headers })
  if (!prodAllRes.ok) throw new Error(`GET /items/products failed: ${prodAllRes.status} ${await prodAllRes.text()}`)
  const prodAll = (await prodAllRes.json()).data || []
  const existingSlugs = new Set(prodAll.map(p => p.slug))

  const sampleImage = 'http://localhost:3001/placeholder/fish.svg'

  const bulkCreate = []
  for (const cat of catsForProducts) {
    const catSlug = cat.slug
    const catId = cat.id
    // tạo 20 sản phẩm theo pattern slug: <slug>-sp-<i>
    for (let i = 1; i <= 20; i++) {
      const s = `${catSlug}-sp-${i}`
      if (existingSlugs.has(s)) continue
      bulkCreate.push({
        name: `${cat.name} mẫu ${i}`,
        slug: s,
        category: catId,
        image_url: sampleImage,
        price: Math.floor(100000 + Math.random() * 300000),
        status: 'published'
      })
    }
  }
  if (bulkCreate.length) {
    const createManyRes = await fetch(`${url}/items/products`, { method: 'POST', headers, body: JSON.stringify(bulkCreate) })
    if (!createManyRes.ok) throw new Error(`POST /items/products bulk failed: ${createManyRes.status} ${await createManyRes.text()}`)
  }

  // bank account
  const bankRes = await fetch(`${url}/items/bank_accounts?limit=1`, { headers })
  if (!bankRes.ok) throw new Error(`GET /items/bank_accounts failed: ${bankRes.status} ${await bankRes.text()}`)
  const bankJson = await bankRes.json()
  const hasBank = (bankJson.data || []).length > 0
  if (!hasBank) {
    const bankCreateRes = await fetch(`${url}/items/bank_accounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ bank_name: 'Vietcombank', account_number: '0123456789', account_holder: 'HAI SAN LAGI', description: 'Chuyển khoản ghi rõ mã đơn hàng' })
    })
    if (!bankCreateRes.ok) throw new Error(`POST /items/bank_accounts failed: ${bankCreateRes.status} ${await bankCreateRes.text()}`)
  }
}

async function main() {
  if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env')
  }
  const token = await login()
  await ensureSeed(token)
  console.log('Seed dữ liệu thành công!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})