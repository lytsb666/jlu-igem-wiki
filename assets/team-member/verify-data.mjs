import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { teamMembers, teamFaculty, memberDataIssues } from '../../Team/member-data.js'

const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim()
assert(['codex/02-team', 'feat/wiki-ux-redesign'].includes(branch), 'Verify in the Team or controller branch')
const originalText = execFileSync('git', ['show', '8444af2:Team/member-data.js'], { encoding: 'utf8' })
const original = await import('data:text/javascript;base64,' + Buffer.from(originalText).toString('base64'))
assert.equal(teamMembers.length, 37)
assert.equal(new Set(teamMembers.map((p) => p.id)).size, 37)
const correctedRoles = {
  'liuyu-yang': ['Visual Design', ['Visual Design']],
  'zhiyuan-jin': ['Wet Lab', ['Wet Lab']],
  'mo-jin': ['Hardware & Wiki', ['Hardware & Wiki']],
}
for (const before of original.teamMembers) {
  const after = teamMembers.find((p) => p.id === before.id)
  for (const key of Object.keys(before).filter((key) => key !== 'photo')) {
    if (correctedRoles[before.id] && ['role', 'groups'].includes(key)) continue
    assert.deepEqual(after[key], before[key], `${before.id}.${key} must retain the contribution source`)
  }
}
for (const [id, [role, groups]] of Object.entries(correctedRoles)) {
  const person = teamMembers.find(p => p.id === id)
  assert.equal(person.role, role)
  assert.deepEqual(person.groups, groups)
  assert.equal(person.roleCorrection.date, '2026-10-04')
}
assert.equal(teamMembers.filter(p => p.groups.includes('Team Leaders')).length, 1)
assert.equal(teamMembers.filter(p => !p.groups.includes('Team Leaders') && !p.groups.includes('Advisors')).length, 27)
const previousText = execFileSync('git', ['show', '2e32255:Team/member-data.js'], { encoding: 'utf8' })
const previous = await import('data:text/javascript;base64,' + Buffer.from(previousText).toString('base64'))
const expectedOrder = previous.teamMembers.map(p => p.id)
const feiyue = expectedOrder.indexOf('feiyue-wang'), luozhao = expectedOrder.indexOf('luozhao-wang')
;[expectedOrder[feiyue], expectedOrder[luozhao]] = [expectedOrder[luozhao], expectedOrder[feiyue]]
assert.deepEqual(teamMembers.map(p => p.id), expectedOrder)
assert.deepEqual(memberDataIssues, original.memberDataIssues)
assert.equal(teamMembers.filter((p) => p.photo).length, 37)
assert.equal(teamMembers.filter((p) => p.photoSource.status === 'user-confirmed-alias').length, 2)
assert.equal(teamFaculty.length, 6)
assert(teamFaculty.every((p) => p.missingFields.length === 5 && p.introduction === '' && p.tasks.length === 0))
assert.deepEqual(teamMembers.find((p) => p.id === 'tonghui-yin').groups, ['Human Practices', 'Hardware & Wiki'])
const oldHtml = execFileSync('git', ['show', '8444af2:Team/member.html'], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
const newHtml = readFileSync('Team/member.html', 'utf8').replaceAll('\r\n', '\n')
const originalHeader = oldHtml.slice(0, oldHtml.indexOf('  <main '))
const retiredAttributionLink = '<a href="../Team/attribution.html">Attribution</a>'
assert.equal(newHtml.slice(0, newHtml.indexOf('  <main ')), originalHeader.replace(retiredAttributionLink, ''))
assert.equal(newHtml.slice(newHtml.indexOf('  <footer ')), oldHtml.slice(oldHtml.indexOf('  <footer ')))
const oldAttribution = execFileSync('git', ['show', '8444af2:Team/attribution.html'], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
assert.equal(readFileSync('Team/attribution.html', 'utf8').replaceAll('\r\n', '\n'), oldAttribution)
console.log('PASS: 37 original identities, biographies, quotes, contributions and historical issues retained; three authorized role corrections; advisor order swapped; 43 unique people; public HTML preserved except retired Attribution link.')
