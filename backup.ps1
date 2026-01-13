# Video Studio Backup Script
# Saves to: C:\Users\yodes\Documents\n8n\backups\video-studio\YYYY-MM-DD_HH-MM\
# KEEPS ALL BACKUPS FOREVER - NO DELETION

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupRoot = "C:\Users\yodes\Documents\n8n\backups\video-studio"
$backupDir = "$backupRoot\$timestamp"
$sourceDir = "C:\Users\yodes\Documents\n8n\video-studio"

Write-Host ""
Write-Host "========================================"
Write-Host "  VIDEO STUDIO BACKUP"
Write-Host "  $timestamp"
Write-Host "========================================"
Write-Host ""

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Copy src folder
Write-Host "Copying src folder..."
Copy-Item -Path "$sourceDir\src" -Destination "$backupDir\src" -Recurse -Force

# Copy config files
Write-Host "Copying config files..."
$configFiles = @("package.json", "tsconfig.json", "astro.config.mjs", ".gitignore", "tailwind.config.mjs", ".env")
foreach ($file in $configFiles) {
    if (Test-Path "$sourceDir\$file") {
        Copy-Item -Path "$sourceDir\$file" -Destination "$backupDir\" -Force
    }
}

# Save git info
Write-Host "Saving git info..."
Push-Location $sourceDir
$gitInfo = @"
Backup: $timestamp
$(git log -1 --format="Commit: %H%nDate: %ai%nMessage: %s")

=== Git Status ===
$(git status)
"@
$gitInfo | Out-File -FilePath "$backupDir\GIT_INFO.txt" -Encoding UTF8
Pop-Location

Write-Host ""
Write-Host "Backup saved to:"
Write-Host $backupDir
Write-Host ""
Write-Host "ALL BACKUPS ARE KEPT FOREVER"
Write-Host "========================================"
