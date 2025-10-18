import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config() // load root .env if present
dotenv.config({ path: path.join(__dirname, '.env') }) // load cms/.env if present

const url = process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

async function login() {
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data.access_token
}

async function backupSlides(headers) {
  try {
    const res = await fetch(`${url}/items/home_slides?limit=-1`, { headers })
    if (!res.ok) {
      console.log('Backup: GET /items/home_slides status', res.status)
      return []
    }
    const json = await res.json()
    const items = json.data || json
    console.log(`Backup: lấy được ${Array.isArray(items) ? items.length : 0} slides.`)
    return Array.isArray(items) ? items : []
  } catch (e) {
    console.log('Backup: lỗi khi lấy items, bỏ qua.', e.message)
    return []
  }
}

async function dropCollection(headers) {
  const res = await fetch(`${url}/collections/home_slides`, { method: 'DELETE', headers })
  if (!res.ok) console.log('DELETE /collections/home_slides status', res.status, await res.text())
  else console.log('Đã xóa collection home_slides')
}

async function createCollection(headers) {
  const body = {
    collection: 'home_slides',
    meta: { icon: 'slideshow', display_template: '{{title}}', hidden: false },
    schema: { name: 'home_slides' }
  }
  const res = await fetch(`${url}/collections`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`POST /collections failed: ${res.status} ${await res.text()}`)
  console.log('Đã tạo collection home_slides')
}

async function createFields(headers) {
  // KHÔNG tạo field 'id' vì Directus tự tạo sẵn.
  const fields = [
    { field: 'title', type: 'string', meta: { field: 'title', interface: 'input', required: true }, schema: { data_type: 'varchar', length: 255 } },
    { field: 'product', type: 'integer', meta: { field: 'product', interface: 'select-dropdown' }, schema: { data_type: 'integer' } },
    { field: 'image_url', type: 'string', meta: { field: 'image_url', interface: 'input' }, schema: { data_type: 'varchar', length: 500 } },
    { field: 'image', type: 'uuid', meta: { field: 'image', interface: 'file' }, schema: { data_type: 'uuid' } },
    { field: 'cta_text', type: 'string', meta: { field: 'cta_text', interface: 'input' }, schema: { data_type: 'varchar', length: 255 } },
    { field: 'sort', type: 'integer', meta: { field: 'sort', interface: 'input' }, schema: { data_type: 'integer' } },
    { field: 'status', type: 'string', meta: { field: 'status', interface: 'select-dropdown', options: { choices: ['published','draft'] }, required: true }, schema: { data_type: 'varchar', length: 50 } }
  ]
  for (const f of fields) {
    const create = await fetch(`${url}/fields/home_slides`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, collection: 'home_slides' }) })
    if (!create.ok) throw new Error(`POST /fields/home_slides failed for ${f.field}: ${create.status} ${await create.text()}`)
  }
  console.log('Đã tạo fields cho home_slides:', fields.map(f => f.field).join(', '))
  // Patch riêng để bật chế độ file
  const patchBody = { type: 'uuid', special: ['file'], meta: { field: 'image', interface: 'file' } }
  const patch = await fetch(`${url}/fields/home_slides/image`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(patchBody) })
  if (!patch.ok) throw new Error(`PATCH /fields/home_slides/image failed: ${patch.status} ${await patch.text()}`)
  console.log('Đã bật special=file cho field image')
}

async function restoreSlides(headers, backup) {
  if (!Array.isArray(backup) || !backup.length) {
    console.log('Không có dữ liệu backup để khôi phục, bỏ qua.')
    return
  }
  const payload = backup.map(s => ({
    title: s.title || null,
    product: s.product || null,
    image_url: s.image_url || null,
    image: s.image || null,
    cta_text: s.cta_text || null,
    sort: s.sort || null,
    status: s.status || 'published'
  }))
  const res = await fetch(`${url}/items/home_slides`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`POST /items/home_slides (restore) failed: ${res.status} ${await res.text()}`)
  console.log(`Đã khôi phục ${payload.length} slides.`)
}

async function main() {
  const token = await login()
  const headers = { Authorization: `Bearer ${token}` }
  const backup = await backupSlides(headers)
  await dropCollection(headers)
  await createCollection(headers)
  await createFields(headers)
  await restoreSlides(headers, backup)
}

main().catch(e => { console.error(e); process.exit(1) })