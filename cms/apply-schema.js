import 'dotenv/config'
import { spawn } from 'node:child_process'

process.env.DB_CLIENT ||= 'sqlite'
process.env.DATABASE_URL ||= 'sqlite://./database.db'

const child = spawn('npx', ['--yes', 'directus@latest', 'schema', 'apply', './snapshot.apply.yaml', '--yes'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

child.on('exit', (code) => {
  if (code !== 0) {
    console.error('Schema apply exited with code', code)
    process.exit(code)
  }
})