import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { teamMembers, teamFaculty, memberDataIssues } from '../../Team/member-data.js'

assert.equal(execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim(), 'codex/02-team')
const originalText = execFileSync('git', ['show', '8444af2:Team/member-data.js'], { encoding: 'utf8' })
const original = await import('data:text/javascript;base64,' + Buffer.from(originalText).toString('base64'))
assert.equal(teamMembers.length, 37)
assert.equal(new Set(teamMembers.map((p) => p.id)).size, 37)
for (const before of original.teamMembers) {
  const after = teamMembers.find((p) => p.id === before.id)
  for (const key of Object.keys(before).filter((key) => key !== 'photo')) {
    assert.deepEqual(after[key], before[key], `${before.id}.${key} must retain the contribution source`)
  }
}
assert.deepEqual(memberDataIssues, original.memberDataIssues)
assert.equal(teamMembers.filter((p) => p.photo).length, 35)
assert.equal(teamFaculty.length, 6)
assert(teamFaculty.every((p) => p.missingFields.length === 5 && p.introduction === '' && p.tasks.length === 0))
assert.deepEqual(teamMembers.find((p) => p.id === 'tonghui-yin').groups, ['Human Practices', 'Hardware & Wiki'])
const oldHtml = execFileSync('git', ['show', '8444af2:Team/member.html'], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
const newHtml = readFileSync('Team/member.html', 'utf8').replaceAll('\r\n', '\n')
assert.equal(newHtml.slice(0, newHtml.indexOf('  <main ')), oldHtml.slice(0, oldHtml.indexOf('  <main ')))
assert.equal(newHtml.slice(newHtml.indexOf('  <footer ')), oldHtml.slice(oldHtml.indexOf('  <footer ')))
const oldAttribution = execFileSync('git', ['show', '8444af2:Team/attribution.html'], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
assert.equal(readFileSync('Team/attribution.html', 'utf8').replaceAll('\r\n', '\n'), oldAttribution)
console.log('PASS: 37 original identities, roles, groups, introductions, quotes, 186 contributions, six issue records; 35 portraits + six faculty; public HTML and Attribution unchanged.')
