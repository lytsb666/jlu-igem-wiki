import { readFileSync, writeFileSync } from 'node:fs'

const action = process.argv[2]
if (!['--enable', '--disable'].includes(action)) throw new Error('Use --enable or --disable')
const file = new URL('../assets/media-presentation-20261018/settings.json', import.meta.url)
const source = readFileSync(file, 'utf8')
const settings = JSON.parse(source)
if (typeof settings.enabled !== 'boolean') throw new Error('Expected a boolean enabled setting')
settings.enabled = action === '--enable'
// Keep the rest of the settings file, including its original line endings.
writeFileSync(file, source.replace(/("enabled"\s*:\s*)(?:true|false)/, (_, prefix) => `${prefix}${settings.enabled}`))
console.log(`Image presentation ${settings.enabled ? 'enabled' : 'disabled'}; text, captions and Back positioning are untouched.`)
