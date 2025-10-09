param(
  [string]$RemoteUrl = "https://github.com/contactus328-ai/Avu.git",
  [string]$Branch = "main",
  [int]$DebounceSeconds = 5
)

function Ensure-Git {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not on PATH."; exit 1
  }
}
function Ensure-RepoRoot {
  if (-not (Test-Path ".git")) {
    Write-Error "This folder is not a Git repository."; exit 1
  }
}
function Ensure-Remote {
  $remotes = git remote
  if ($remotes -notmatch "^origin$") {
    git remote add origin $RemoteUrl | Out-Null
    Write-Host "Added remote 'origin' → $RemoteUrl"
  }
}
function Ensure-UserIdentity {
  $name  = git config user.name
  $email = git config user.email
  if (-not $name -or -not $email) {
    git config user.name  "Codex Bot"
    git config user.email "codex@example.local"
  }
}
function Sync-And-Push {
  git pull origin $Branch 2>$null | Out-Null
  git add -A
  if ([string]::IsNullOrWhiteSpace($(git status --porcelain))) { return }
  $msg = "Codex auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  git commit -m "$msg" | Out-Null
  git push origin $Branch | Out-Null
  Write-Host "Auto-pushed at $(Get-Date -Format 'HH:mm:ss'))."
}

Ensure-Git
Ensure-RepoRoot
Ensure-Remote
Ensure-UserIdentity

try { git rev-parse --abbrev-ref HEAD | Out-Null } catch { git checkout -b $Branch }

$root = (Get-Location).Path
$fsw = New-Object System.IO.FileSystemWatcher $root, "*"
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

$lastEvent = [DateTime]::MinValue
$debounce = [TimeSpan]::FromSeconds($DebounceSeconds)

Register-ObjectEvent $fsw Changed -SourceIdentifier "RepoChanged" -Action {
  if ((Get-Date) - $lastEvent -lt $debounce) { return }
  $script:lastEvent = Get-Date
  Sync-And-Push
} | Out-Null
Register-ObjectEvent $fsw Created -SourceIdentifier "RepoCreated" -Action {
  if ((Get-Date) - $lastEvent -lt $debounce) { return }
  $script:lastEvent = Get-Date
  Sync-And-Push
} | Out-Null
Register-ObjectEvent $fsw Deleted -SourceIdentifier "RepoDeleted" -Action {
  if ((Get-Date) - $lastEvent -lt $debounce) { return }
  $script:lastEvent = Get-Date
  Sync-And-Push
} | Out-Null
Register-ObjectEvent $fsw Renamed -SourceIdentifier "RepoRenamed" -Action {
  if ((Get-Date) - $lastEvent -lt $debounce) { return }
  $script:lastEvent = Get-Date
  Sync-And-Push
} | Out-Null

Write-Host "Watching '$root' for changes. Press Ctrl+C to stop."
while ($true) { Start-Sleep -Seconds 1 }