param(
  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$deliverablesDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $deliverablesDir "..")
$projectRootPath = $projectRoot.ProviderPath.TrimEnd('\', '/')

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $OutputPath = Join-Path $deliverablesDir "SOURCE_CODE.zip"
}

$resolvedOutput = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath)
$stage = Join-Path ([System.IO.Path]::GetTempPath()) ("vutto-source-" + [System.Guid]::NewGuid().ToString("N"))

$excludedDirs = @(
  ".git",
  ".agents",
  ".codex",
  ".tools",
  "node_modules",
  "dist",
  "coverage"
)

$excludedFiles = @(
  ".env",
  "SOURCE_CODE.zip"
)

$excludedPatterns = @(
  "*.db",
  "*.db-journal",
  "*.tsbuildinfo",
  "Screenshot *.png",
  "*.log"
)

function Test-ExcludedPath {
  param([System.IO.FileSystemInfo]$Item)

  $relative = Get-RelativePathFromRoot $Item.FullName
  $parts = $relative -split '[\\/]'

  foreach ($part in $parts) {
    if ($excludedDirs -contains $part) {
      return $true
    }
  }

  if (-not $Item.PSIsContainer) {
    if ($excludedFiles -contains $Item.Name) {
      return $true
    }

    foreach ($pattern in $excludedPatterns) {
      if ($Item.Name -like $pattern) {
        return $true
      }
    }
  }

  return $false
}

function Get-RelativePathFromRoot {
  param([string]$FullName)

  $fullPath = [System.IO.Path]::GetFullPath($FullName)
  if (-not $fullPath.StartsWith($projectRootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Path is outside project root: $FullName"
  }

  return $fullPath.Substring($projectRootPath.Length).TrimStart('\', '/')
}

if (Test-Path $resolvedOutput) {
  Remove-Item -LiteralPath $resolvedOutput -Force
}

New-Item -ItemType Directory -Path $stage | Out-Null

try {
  Get-ChildItem -LiteralPath $projectRoot -Force -Recurse | ForEach-Object {
    if (Test-ExcludedPath $_) {
      return
    }

    $relative = Get-RelativePathFromRoot $_.FullName
    $target = Join-Path $stage $relative

    if ($_.PSIsContainer) {
      New-Item -ItemType Directory -Path $target -Force | Out-Null
    } else {
      $parent = Split-Path -Parent $target
      New-Item -ItemType Directory -Path $parent -Force | Out-Null
      Copy-Item -LiteralPath $_.FullName -Destination $target -Force
    }
  }

  Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $resolvedOutput -Force
  Write-Host "Created $resolvedOutput"
} finally {
  if (Test-Path $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
  }
}
