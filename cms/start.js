import 'dotenv/config'
import { spawn } from 'node:child_process'

// Ensure essential defaults for local dev
process.env.DB_CLIENT ||= 'sqlite3'
process.env.DB_FILENAME ||= './database.db'
process.env.PORT ||= '8055'
process.env.PUBLIC_URL ||= `http://localhost:${process.env.PORT}`
process.env.DIRECTUS_URL ||= process.env.PUBLIC_URL
process.env.SECRET ||= 'dev-secret'

const child = spawn('npx', ['--yes', 'directus@latest', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

child.on('exit', (code) => {
  if (code !== 0) {
    console.error('Directus exited with code', code)
    process.exit(code)
  }
})