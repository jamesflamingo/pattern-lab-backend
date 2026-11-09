const { copyFileSync, existsSync, mkdirSync } = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')

const seedFile = path.join(__dirname, 'db.json')
const databaseFile = path.resolve(process.env.DB_FILE || seedFile)
const serverExecutable = path.join(
  __dirname,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'json-server.cmd' : 'json-server'
)

if (databaseFile !== seedFile && !existsSync(databaseFile)) {
  mkdirSync(path.dirname(databaseFile), { recursive: true })
  copyFileSync(seedFile, databaseFile)
}

const server = spawn(
  serverExecutable,
  [
    databaseFile,
    '--host',
    '0.0.0.0',
    '--port',
    process.env.PORT || '3001',
  ],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }
)

server.on('error', (error) => {
  console.error('Could not start JSON Server:', error)
  process.exitCode = 1
})

server.on('exit', (code, signal) => {
  if (signal) {
    console.error(`JSON Server exited after receiving ${signal}.`)
  }
  process.exitCode = code ?? 1
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}
