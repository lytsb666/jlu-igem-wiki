import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { teamMembers, teamFaculty, memberDataIssues, memberPresentation } from '../../Team/member-data.js'

const baseline = 'cc7e9491b7468f3c3673135af3f3801b4c7bba72'
assert.equal(execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim(), 'codex/02-team')
const original = await import('data:text/javascript;base64,' + execFileSync('git', ['show', `${baseline}:Team/member-data.js`]).toString('base64'))
assert.deepEqual(teamMembers, original.teamMembers, 'All 37 complete profiles and prior resolutions must remain unchanged')
assert.deepEqual(teamFaculty, original.teamFaculty, 'All six faculty records and gaps must remain unchanged')
assert.deepEqual(memberDataIssues, original.memberDataIssues)
assert.equal(teamMembers.reduce((total, p) => total + p.tasks.length, 0), 186)
assert.equal(new Set([...teamMembers, ...teamFaculty].map(p => p.id)).size, 43)
assert.deepEqual(memberPresentation.leaders.map(p => p.id), ['mo-jin','jingyi-kang','zhiyuan-jin','ziyan-qin','yujia-yang','wenxian-gao','tonghui-yin','xiaojie-meng','chen-xing'])
assert.equal(new Set(memberPresentation.leaders.map(p => p.id)).size, 9)
assert.equal(memberPresentation.facultyNotes['pi-pang-bo'].text, 'Judge for the 2026 iGEM Competition')
assert.equal(memberPresentation.facultyNotes['pi-li-jinhua'].text, 'Instructor of the 2025 iGEM Gold Medal-Winning Team with Two Nominations')

const beforeHtml = execFileSync('git', ['show', `${baseline}:Team/member.html`], {encoding:'utf8'}).replaceAll('\r\n','\n')
const afterHtml = readFileSync('Team/member.html', 'utf8').replaceAll('\r\n','\n')
assert.equal(beforeHtml.slice(0, beforeHtml.indexOf('  <main ')), afterHtml.slice(0, afterHtml.indexOf('  <main ')))
assert.equal(beforeHtml.slice(beforeHtml.indexOf('  <footer ')), afterHtml.slice(afterHtml.indexOf('  <footer ')))
for (const file of readdirSync('assets/team-member/portraits')) {
  const path = `assets/team-member/portraits/${file}`
  assert.deepEqual(readFileSync(path), execFileSync('git', ['show', `${baseline}:${path}`], {maxBuffer:30_000_000}), `${file} must keep reviewed framing`)
}
const cover = JSON.parse(readFileSync('assets/team-member/cover/manifest.json', 'utf8'))
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
assert.equal(sha(readFileSync('assets/team-member/sources/group-photo.jpg')), cover.sources.groupPhoto.sha256)
assert.equal(sha(readFileSync('assets/team-member/sources/leader-list.png')), memberPresentation.leadershipSource.sha256)
for (const image of cover.webCopies) assert.equal(sha(readFileSync(image.file)), image.sha256)
console.log('PASS: baseline cc7e949 preserved byte-equivalent source data for 37+6 people, all 186 tasks, six issues, all portraits and public HTML; nine sourced leadership entries and two verbatim faculty notes; group photo source hash and compressed assets verified.')
