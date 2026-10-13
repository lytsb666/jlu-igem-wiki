param([switch]$Production)

$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskToolRoot = Join-Path (Split-Path -Parent $taskRoot) 'tmp\cloudflare-pages-2026-10-10'
$taskPreviousPath = $env:PATH
$taskNpmFallback = Join-Path $taskToolRoot 'bin\npm.cmd'

# This workstation has bundled Node; npm was bootstrapped locally for Pages.
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    if (-not (Test-Path -LiteralPath $taskNpmFallback)) {
        throw 'Install Node.js/npm, then run this script again.'
    }
    $env:PATH = (Join-Path $taskToolRoot 'bin') + ';' + $env:PATH
}

Push-Location -LiteralPath $taskRoot
try {
    $taskBranch = git branch --show-current
    if ($LASTEXITCODE -ne 0 -or -not $taskBranch) { throw 'Use a named Git branch to publish.' }
    $taskDirty = [bool](git status --porcelain)
    if ($Production) {
        if ($taskBranch -ne 'main' -or $taskDirty) {
            throw 'Production upload requires a clean main branch. Commit and review changes through a PR first.'
        }
        $taskDeployBranch = 'main'
    } else {
        if ($taskBranch -eq 'main') { throw 'Use a feature branch for preview, or explicitly pass -Production on clean main.' }
        $taskDeployBranch = $taskBranch
    }

    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed; nothing was uploaded.' }

    node scripts/check-build.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Static output verification failed; nothing was uploaded.' }

    $taskOutput = Join-Path $taskRoot 'dist\client'
    $taskTooLarge = @(Get-ChildItem -LiteralPath $taskOutput -Recurse -File | Where-Object Length -gt 25MB)
    if ($taskTooLarge.Count) { throw ('Pages file exceeds 25 MiB: ' + $taskTooLarge[0].FullName) }

    $taskWrangler = Join-Path $taskToolRoot 'tooling\node_modules\wrangler\bin\wrangler.js'
    if (Test-Path -LiteralPath $taskWrangler) {
        node $taskWrangler pages deploy dist/client --project-name jlu-igem-wiki-preview --branch $taskDeployBranch --commit-dirty=$($taskDirty.ToString().ToLowerInvariant())
    } else {
        npx --yes wrangler@4.149.0 pages deploy dist/client --project-name jlu-igem-wiki-preview --branch $taskDeployBranch --commit-dirty=$($taskDirty.ToString().ToLowerInvariant())
    }
    if ($LASTEXITCODE -ne 0) { throw 'Cloudflare upload failed.' }
    if ($Production) { Write-Output 'Stable preview: https://jlu-igem-wiki-preview.pages.dev/' }
    else { Write-Output ('Branch preview uploaded: ' + $taskDeployBranch + '. Use the deployment URL printed by Wrangler.') }
} finally {
    Pop-Location
    $env:PATH = $taskPreviousPath
}
