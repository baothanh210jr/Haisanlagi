import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

const url = process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const adminToken = process.env.ADMIN_TOKEN

async function getToken() {
  if (adminToken) return adminToken
  if (!email || !password) throw new Error('Missing ADMIN_EMAIL/ADMIN_PASSWORD or ADMIN_TOKEN')
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data.access_token
}

async function fetchAll(endpoint, headers) {
  const res = await fetch(`${url}/${endpoint}?limit=-1`, { headers })
  if (!res.ok) throw new Error(`GET /${endpoint} failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data || []
}

function projectCollection(c) {
  return {
    collection: c.collection,
    meta: c.meta || {},
    schema: c.schema || {}
  }
}

function projectField(f) {
  return {
    collection: f.collection,
    field: f.field,
    type: f.type,
    meta: f.meta || {},
    schema: f.schema || {}
  }
}

function projectRelation(r) {
  return {
    collection: r.collection,
    field: r.field,
    related_collection: r.related_collection
  }
}

function projectPermission(p) {
  const obj = {
    policy: p.policy,
    collection: p.collection,
    action: p.action,
    permissions: p.permissions || {},
    validation: p.validation || {}
  }
  if (Array.isArray(p.fields) && p.fields.length) obj.fields = p.fields
  return obj
}

function sortCollections(arr) {
  return arr.sort((a, b) => a.collection.localeCompare(b.collection))
}
function sortFields(arr) {
  return arr.sort((a, b) => a.collection === b.collection ? a.field.localeCompare(b.field) : a.collection.localeCompare(b.collection))
}
function sortRelations(arr) {
  return arr.sort((a, b) => a.collection === b.collection ? a.field.localeCompare(b.field) : a.collection.localeCompare(b.collection))
}
function sortPermissions(arr) {
  return arr.sort((a, b) => {
    const c = a.collection.localeCompare(b.collection)
    if (c !== 0) return c
    const a1 = a.action.localeCompare(b.action)
    if (a1 !== 0) return a1
    return String(a.policy).localeCompare(String(b.policy))
  })
}

async function main() {
  const token = await getToken()
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  let [collections, fields, relations, permissions] = await Promise.all([
    fetchAll('collections', headers),
    fetchAll('fields', headers),
    fetchAll('relations', headers),
    fetchAll('permissions', headers)
  ])

  collections = sortCollections(collections)
  fields = sortFields(fields)
  relations = sortRelations(relations)
  permissions = sortPermissions(permissions)

  const snapshot = {
    version: 1,
    collections: collections.map(projectCollection),
    fields: fields.map(projectField),
    relations: relations.map(projectRelation),
    permissions: permissions.map(projectPermission)
  }

  const yaml = YAML.stringify(snapshot, { indent: 2 })
  const outPath = path.join(process.cwd(), 'snapshot.yaml')
  fs.writeFileSync(outPath, yaml, 'utf-8')
  console.log('Snapshot exported to', outPath)
  console.log(`Counts → collections:${collections.length}, fields:${fields.length}, relations:${relations.length}, permissions:${permissions.length}`)
}

main().catch((e) => { console.error(e); process.exit(1) })