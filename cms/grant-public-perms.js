import 'dotenv/config'

const url = process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const adminToken = process.env.ADMIN_TOKEN

async function getToken() {
  if (adminToken) return adminToken
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data.access_token
}

async function grantPublic() {
  const token = await getToken()
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const polRes = await fetch(`${url}/policies?limit=-1`, { headers })
  if (!polRes.ok) throw new Error(`GET /policies failed: ${polRes.status} ${await polRes.text()}`)
  const policies = (await polRes.json()).data || []
  const publicPolicy = policies.find(p => p.name === 'Public' || p.name === '$t:public_label')
  if (!publicPolicy) throw new Error('Public policy not found')
  const policyId = publicPolicy.id

  const existingPermsRes = await fetch(`${url}/permissions?limit=-1&filter[policy][_eq]=${policyId}`, { headers })
  if (!existingPermsRes.ok) throw new Error(`GET /permissions failed: ${existingPermsRes.status} ${await existingPermsRes.text()}`)
  const existingPerms = (await existingPermsRes.json()).data || []
  const findPerm = (col, act) => existingPerms.find(p => p.collection === col && p.action === act)

  const needed = [
    { collection: 'categories', action: 'read' },
    { collection: 'products', action: 'read' },
    { collection: 'bank_accounts', action: 'read' },
    { collection: 'orders', action: 'read' },
    { collection: 'orders', action: 'create' },
    { collection: 'order_items', action: 'read' },
    { collection: 'order_items', action: 'create' },
    { collection: 'order_items', action: 'delete' },
    // Slider collection
    { collection: 'home_slides', action: 'read' },
    // Ensure public can view assets served by Directus
    { collection: 'directus_files', action: 'read' }
  ]
  const toCreate = []
  for (const need of needed) {
    const exist = findPerm(need.collection, need.action)
    if (!exist) {
      const defaultFields = (need.collection === 'orders' && need.action === 'read')
        ? ['id', 'customer_name', 'customer_phone', 'customer_address', 'total_amount', 'status', 'date_created']
        : ['*']
      toCreate.push({ ...need, policy: policyId, permissions: {}, validation: {}, fields: defaultFields })
    } else {
      const fieldsTop = exist.fields
      const permObj = { ...(exist.permissions || {}) }
      if (permObj.fields) delete permObj.fields
      const wantsAll = !(need.collection === 'orders' && need.action === 'read')
      const expectedFields = wantsAll ? ['*'] : ['id', 'customer_name', 'customer_phone', 'customer_address', 'total_amount', 'status', 'date_created']
      const needsUpdate = Array.isArray(fieldsTop) && fieldsTop.length === expectedFields.length && fieldsTop.every((f, i) => f === expectedFields[i]) ? false : true
      if (needsUpdate || Object.keys(permObj).length !== Object.keys(exist.permissions || {}).length) {
        const patchRes = await fetch(`${url}/permissions/${exist.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: expectedFields, permissions: permObj })
        })
        if (!patchRes.ok) throw new Error(`PATCH /permissions/${exist.id} failed: ${patchRes.status} ${await patchRes.text()}`)
        console.log(`Updated public permission ${need.collection}:${need.action} -> fields:${JSON.stringify(expectedFields)} and cleaned permissions.fields`)
      }
    }
  }

  if (toCreate.length) {
    const createRes = await fetch(`${url}/permissions`, { method: 'POST', headers, body: JSON.stringify(toCreate) })
    if (!createRes.ok) throw new Error(`POST /permissions failed: ${createRes.status} ${await createRes.text()}`)
    console.log('Public permissions created:', toCreate.map(p => `${p.collection}:${p.action}`).join(', '))
  }

  // Inspect resulting permissions for Public policy
  const verifyRes = await fetch(`${url}/permissions?limit=-1&filter[policy][_eq]=${policyId}`, { headers })
  console.log('Verify permissions status:', verifyRes.status)
  console.log(await verifyRes.text())

  const pubCats = await fetch(`${url}/items/categories?limit=4`)
  console.log('Public categories status:', pubCats.status)
  console.log(await pubCats.text())

  const pubBank = await fetch(`${url}/items/bank_accounts?limit=1`)
  console.log('Public bank_accounts status:', pubBank.status)
  console.log(await pubBank.text())

  // Public create order test
  const orderCreate = await fetch(`${url}/items/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: 'Test User',
      customer_phone: '0123456789',
      customer_address: 'Test Address',
      total_amount: 100000,
      status: 'pending'
    })
  })
  console.log('Public create order status:', orderCreate.status)
  const orderJson = await orderCreate.text()
  console.log(orderJson)
  try {
    const created = JSON.parse(orderJson)
    const orderId = (created.data || created)?.id
    if (orderId) {
      // Clean up the test order using admin token
      const delRes = await fetch(`${url}/items/orders/${orderId}`, { method: 'DELETE', headers })
      console.log('Cleanup delete order status:', delRes.status)
    }
  } catch {}
}

grantPublic().catch((e) => { console.error(e); process.exit(1) })