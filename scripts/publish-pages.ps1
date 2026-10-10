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
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed; nothing was uploaded.' }

    $taskOutput = Join-Path $taskRoot 'dist\client'
    $taskTooLarge = @(Get-ChildItem -LiteralPath $taskOutput -Recurse -File | Where-Object Length -gt 25MB)
    if ($taskTooLarge.Count) { throw ('Pages file exceeds 25 MiB: ' + $taskTooLarge[0].FullName) }

    $taskWrangler = Join-Path $taskToolRoot 'tooling\node_modules\wrangler\bin\wrangler.js'
    if (Test-Path -LiteralPath $taskWrangler) {
        node $taskWrangler pages deploy dist/client --project-name jlu-igem-wiki-preview --branch main --commit-dirty=true
    } else {
        npx --yes wrangler@4.149.0 pages deploy dist/client --project-name jlu-igem-wiki-preview --branch main --commit-dirty=true
    }
    if ($LASTEXITCODE -ne 0) { throw 'Cloudflare upload failed.' }
    Write-Output 'Stable preview: https://jlu-igem-wiki-preview.pages.dev/'
} finally {
    Pop-Location
    $env:PATH = $taskPreviousPath
}
