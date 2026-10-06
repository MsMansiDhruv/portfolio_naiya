# Applies OmniRoute Cursor settings after Cursor exits, then relaunches.
$ErrorActionPreference = 'Continue'
$workspace = 'E:\mansi\website\portfolio_naiya'
$script = Join-Path $workspace 'scripts\configure_cursor_omniroute.py'
$log = Join-Path $env:TEMP 'omniroute-cursor-apply.log'

function Write-Log($msg) {
  $line = "$(Get-Date -Format o) $msg"
  Add-Content -Path $log -Value $line
}

Write-Log 'Starting OmniRoute Cursor apply'

# Give the agent a moment to finish its reply
Start-Sleep -Seconds 4

Write-Log 'Stopping Cursor processes'
Get-Process -Name 'Cursor','cursor' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Ensure DB unlocked
$deadline = (Get-Date).AddSeconds(30)
do {
  try {
    $db = Join-Path $env:APPDATA 'Cursor\User\globalStorage\state.vscdb'
    $fs = [System.IO.File]::Open($db, 'Open', 'ReadWrite', 'None')
    $fs.Close()
    break
  } catch {
    Start-Sleep -Milliseconds 500
  }
} while ((Get-Date) -lt $deadline)

Write-Log 'Patching state.vscdb'
& python $script *>> $log 2>&1
$code = $LASTEXITCODE
Write-Log "Patch exit code: $code"

# Verify
& python -c @"
import sqlite3,json,os
db=os.path.expandvars(r'%APPDATA%\Cursor\User\globalStorage\state.vscdb')
c=sqlite3.connect(db)
k='src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser'
row=c.execute('select value from ItemTable where key=?',(k,)).fetchone()
d=json.loads(row[0])
print('VERIFY', d.get('openAIBaseUrl'), d.get('useOpenAIKey'), (d.get('aiSettings') or {}).get('userAddedModels'))
c.close()
"@ *>> $log 2>&1

Write-Log "Relaunching Cursor: $workspace"
$cursorCmd = Join-Path $env:LOCALAPPDATA 'Programs\cursor\Cursor.exe'
if (-not (Test-Path $cursorCmd)) {
  $cursorCmd = 'cursor'
}
Start-Process -FilePath $cursorCmd -ArgumentList @($workspace)
Write-Log 'Done'
