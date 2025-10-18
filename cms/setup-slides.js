import 'dotenv/config'

const url = process.env.PUBLIC_URL || 'http://localhost:8055'
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

async function ensureCollection(headers) {
  const res = await fetch(`${url}/collections`, { headers })
  const json = await res.json()
  const exists = (json.data || json).find?.(c => c.collection === 'home_slides')
  if (exists) {
    console.log('Collection home_slides đã tồn tại, bỏ qua tạo mới.')
    return
  }
  const createBody = {
    collection: 'home_slides',
    meta: { icon: 'slideshow', display_template: '{{title}}', hidden: false },
    schema: { name: 'home_slides' }
  }
  const create = await fetch(`${url}/collections`, { method: 'POST', headers, body: JSON.stringify(createBody) })
  if (!create.ok) throw new Error(`POST /collections failed: ${create.status} ${await create.text()}`)
  console.log('Đã tạo collection home_slides')
}

async function ensureFields(headers) {
  const fields = [
    { field: 'id', type: 'integer', meta: { field: 'id', interface: 'input', hidden: true, readonly: true }, schema: { data_type: 'integer', is_primary_key: true, has_auto_increment: true } },
    { field: 'title', type: 'string', meta: { field: 'title', interface: 'input', required: true }, schema: { data_type: 'varchar', length: 255 } },
    { field: 'product', type: 'integer', meta: { field: 'product', interface: 'select-dropdown' }, schema: { data_type: 'integer' } },
    { field: 'image_url', type: 'string', meta: { field: 'image_url', interface: 'input' }, schema: { data_type: 'varchar', length: 500 } },
    { field: 'image', type: 'uuid', meta: { field: 'image', interface: 'file' }, schema: { data_type: 'uuid' } },
    { field: 'cta_text', type: 'string', meta: { field: 'cta_text', interface: 'input' }, schema: { data_type: 'varchar', length: 255 } },
    { field: 'sort', type: 'integer', meta: { field: 'sort', interface: 'input' }, schema: { data_type: 'integer' } },
    { field: 'status', type: 'string', meta: { field: 'status', interface: 'select-dropdown', options: { choices: ['published','draft'] }, required: true }, schema: { data_type: 'varchar', length: 50 } }
  ]
  // Get existing fields to avoid duplicate creation
  const res = await fetch(`${url}/fields?limit=-1&filter[collection][_eq]=home_slides`, { headers })
  const json = await res.json()
  const existing = (json.data || json).map?.(f => f.field) || []
  const toCreate = fields.filter(f => !existing.includes(f.field)).map(f => ({ ...f, collection: 'home_slides' }))
  if (toCreate.length) {
    for (const f of toCreate) {
      const create = await fetch(`${url}/fields/home_slides`, { method: 'POST', headers, body: JSON.stringify(f) })
      if (!create.ok) throw new Error(`POST /fields/home_slides failed for ${f.field}: ${create.status} ${await create.text()}`)
    }
    console.log('Đã tạo fields cho home_slides:', toCreate.map(f => f.field).join(', '))
  } else {
    console.log('Các fields cho home_slides đã tồn tại, bỏ qua tạo mới.')
  }
  // Explicitly ensure image field exists
  const hasImage = existing.includes('image')
  if (!hasImage) {
    const body = { collection: 'home_slides', field: 'image', type: 'uuid', special: ['file'], meta: { field: 'image', interface: 'file' } }
    const createImg = await fetch(`${url}/fields/home_slides`, { method: 'POST', headers, body: JSON.stringify(body) })
    if (!createImg.ok) throw new Error(`POST /fields/home_slides (image) failed: ${createImg.status} ${await createImg.text()}`)
    console.log('Đã tạo bổ sung field image (file upload).')
  } else {
    console.log('Field image đã tồn tại theo danh sách, tiếp tục kiểm tra interface.')
  }
  // Ensure image field is file upload (uuid + file interface)
  const getImg = await fetch(`${url}/fields/home_slides/image`, { headers })
  const imgJson = await getImg.json()
  const img = imgJson.data || imgJson
  console.log('DEBUG current image field:', JSON.stringify(img, null, 2))
  const needsPatch = !img || img.type !== 'uuid' || img.meta?.interface !== 'file'
  if (needsPatch) {
    const patchBody = { type: 'uuid', special: ['file'], meta: { ...(img?.meta || {}), field: 'image', interface: 'file' } }
    console.log('DEBUG patch body:', JSON.stringify(patchBody, null, 2))
    const patch = await fetch(`${url}/fields/home_slides/image`, { method: 'PATCH', headers, body: JSON.stringify(patchBody) })
    if (!patch.ok) throw new Error(`PATCH /fields/home_slides/image failed: ${patch.status} ${await patch.text()}`)
    console.log('Đã cập nhật field image thành kiểu file upload.')
  } else {
    console.log('Field image đã là kiểu file upload, bỏ qua cập nhật.')
  }
}

async function seedSlides(headers) {
  // Lấy danh sách products để tham chiếu
  const pres = await fetch(`${url}/items/products?limit=10&sort=-id`)
  const prod = await pres.json()
  const products = prod.data || prod
  if (!Array.isArray(products) || !products.length) {
    console.log('Không có sản phẩm để tạo slides, bỏ qua seed.')
    return
  }
  const picks = products.slice(0, Math.min(5, products.length))
  const slides = picks.map((p, i) => ({ title: p.name, product: p.id, image_url: p.image_url || null, status: 'published', sort: i + 1, cta_text: 'Xem ngay' }))
  const res = await fetch(`${url}/items/home_slides?fields=id`, { headers })
  const json = await res.json()
  const existing = (json.data || json)
  if (Array.isArray(existing) && existing.length) {
    console.log('Slides đã tồn tại, bỏ qua seed.')
    return
  }
  const create = await fetch(`${url}/items/home_slides`, { method: 'POST', headers, body: JSON.stringify(slides) })
  if (!create.ok) throw new Error(`POST /items/home_slides failed: ${create.status} ${await create.text()}`)
  console.log('Đã seed slides mẫu.')
}

async function main() {
  const token = await login()
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  await ensureCollection(headers)
  await ensureFields(headers)
  await seedSlides(headers)
}

main().catch(e => { console.error(e); process.exit(1) })