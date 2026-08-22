import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
let failed = 0
function ok(cond, msg) {
  if (cond) console.log('  ok', msg)
  else { console.error('  FAIL', msg); failed++ }
}
console.log('Digital Bahir Dar smoke checks')
ok(existsSync(join(process.cwd(), 'public', 'sw.js')), 'public/sw.js')
ok(existsSync(join(process.cwd(), 'public', 'manifest.webmanifest')), 'manifest')
ok(existsSync(join(process.cwd(), 'public', 'offline.html')), 'offline.html')
const migrations = readdirSync(join(process.cwd(), 'supabase/migrations')).filter((f) => f.endsWith('.sql'))
ok(migrations.length >= 6, 'migrations >= 6 got ' + migrations.length)
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
ok(pkg.version === '1.0.0', 'version 1.0.0')
ok(existsSync('LAUNCH.md'), 'LAUNCH.md')
ok(existsSync('vercel.json'), 'vercel.json')
console.log(failed ? failed + ' failed' : 'All smoke checks passed')
process.exit(failed ? 1 : 0)
