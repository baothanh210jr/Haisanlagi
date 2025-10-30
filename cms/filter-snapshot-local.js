import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const SNAPSHOT_PATH = path.resolve('./snapshot.yaml');
const OUTPUT_PATH = path.resolve('./snapshot.apply.local.yaml');

function isSystemCollection(name, meta) {
  return (name?.startsWith('directus_')) || meta?.system === true;
}

function run() {
  const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
  const data = YAML.parse(raw);

  const collections = (data.collections || []).filter((c) => !isSystemCollection(c.collection, c.meta));

  const fields = (data.fields || []).filter((f) => !isSystemCollection(f.collection, null));

  // Exclude relations that commonly already exist in DB (avoid INVALID_PAYLOAD)
  // Exclude all relations for local apply to avoid duplication errors
  const relations = [];

  const permissions = (data.permissions || []).filter((p) => !isSystemCollection(p.collection, null));

  const filtered = {
    version: data.version || 1,
    collections,
    fields,
    relations,
    permissions,
  };

  const yaml = YAML.stringify(filtered);
  fs.writeFileSync(OUTPUT_PATH, yaml, 'utf8');
  console.log(`Filtered LOCAL snapshot written: ${OUTPUT_PATH}`);
}

run();