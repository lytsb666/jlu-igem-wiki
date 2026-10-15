import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const config = JSON.parse(readFileSync(new URL('../.github/owners.json', import.meta.url), 'utf8'))
const handle = /^@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\/[A-Za-z0-9][A-Za-z0-9_-]*)?$/
for (const [role, owner] of Object.entries(config)) {
  if (owner !== null && (typeof owner !== 'string' || !handle.test(owner))) {
    throw new Error(`Role ${role}: use an actual @username or @organization/team, or null.`)
  }
}
if (!config['00'] || !config['10']) {
  throw new Error('Bind actual GitHub owners for 00 (shared components) and 10 (deployment) first. See docs/COLLABORATION_SETUP.md.')
}
const owner = role => config[role] || config['00']
const rows = ['# Generated from owners.json; last matching pattern wins.', `* ${owner('00')}`]
const add = (patterns, role) => patterns.forEach(pattern => rows.push(`${pattern} ${owner(role)}`))
add(['/homepage/', '/样式/home-story.js', '/样式/homepage-sequence.css', '/a*/home-story/'], '01')
add(['/Team/', '/样式/member.css', '/样式/member.js'], '02')
add(['/Project/', '/Wet-lab/', '/Instrument/model.html', '/样式/drylab.css', '/样式/model-revision.*', '/样式/parts-page.*', '/样式/measurement.css', '/样式/protocol.*', '/assets/model/'], '03')
add(['/Eagagement/iHP.html', '/样式/ihp-*', '/assets/human-practice/'], '04')
add(['/Eagagement/education.html', '/样式/education.*', '/assets/education/'], '05')
add(['/public/inclusivity-resources/'], '06')
add(['/Eagagement/entrepreneurship.html', '/样式/entrepreneurship.*'], '07')
add(['/Instrument/hardware.html', '/Instrument/software.html', '/样式/hardware.*', '/样式/software.*', '/assets/software/', '/public/software-resources/', '/public/hardware-resources/'], '08')
add(['/package.json', '/package-lock.json', '/vite.config.js', '/.nvmrc', '/worker/', '/.openai/', '/scripts/', '/.github/workflows/', '/DEPLOYMENT_CLOUDFLARE.md'], '10')
// Ownership and collaboration policy remain under the controller's review.
add(['/.github/CODEOWNERS', '/.github/owners.json', '/scripts/configure-codeowners.mjs', '/CONTRIBUTING.md', '/docs/COLLABORATION_SETUP.md', '/.gitignore'], '00')
const target = new URL('../.github/CODEOWNERS', import.meta.url)
const output = rows.join('\n') + '\n'
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== output) {
    throw new Error('CODEOWNERS differs from owners.json; run node scripts/configure-codeowners.mjs and commit both files.')
  }
  console.log('GitHub owners are bound and CODEOWNERS matches the configuration.')
} else {
  writeFileSync(target, output)
  console.log(`Written ${fileURLToPath(target)}. Confirm all owners have repository Write access.`)
}
