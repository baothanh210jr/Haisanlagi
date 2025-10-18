import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
dotenv.config({ path: path.join(__dirname, '.env') })

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

async function main() {
  const token = await login()
  const headers = { Authorization: `Bearer ${token}` }
  const resCols = await fetch(`${url}/collections`, { headers })
  const cols = await resCols.json()
  const collections = (cols.data || cols).map?.(c => c.collection)
  console.log('Collections:', collections)

  const resFields = await fetch(`${url}/fields?limit=-1&filter[collection][_eq]=home_slides`, { headers })
  const fieldsJson = await resFields.json()
  const fields = (fieldsJson.data || fieldsJson)
  console.log('home_slides fields:', fields.map?.(f => ({ field: f.field, type: f.type, interface: f.meta?.interface, special: f.special })))

  const resImage = await fetch(`${url}/fields?limit=1&filter[collection][_eq]=home_slides&filter[field][_eq]=image`, { headers })
  const imageJson = await resImage.json()
  const imageDetails = imageJson.data || imageJson
  console.log('image field detail:', imageDetails)

  fs.writeFileSync(new URL('./inspect-fields.out.json', import.meta.url).pathname, JSON.stringify({ collections, fields, imageDetails }, null, 2))
}

main().catch(e => { console.error(e); process.exit(1) })