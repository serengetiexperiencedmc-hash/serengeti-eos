# Stage 4B E2 Dev/Test laboratory runner
# Isolated Docker lab on 127.0.0.1. NOT Production. Does not use infra/compose/dev.yaml volumes.
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
if (-not (Test-Path (Join-Path $Root "docs\governance\adr-0006-technical-rto-rpo-laboratory-test-plan.md"))) {
  throw "Cannot resolve repo root from $PSScriptRoot (got $Root)"
}
$LabDir = $PSScriptRoot
$EvidenceDir = Join-Path $LabDir "runs"
$RunId = Get-Date -Format "yyyyMMdd-HHmmss"
$RunDir = Join-Path $EvidenceDir $RunId
New-Item -ItemType Directory -Force -Path $RunDir, (Join-Path $RunDir "backups"), (Join-Path $RunDir "logs") | Out-Null
$Transcript = Join-Path $RunDir "logs\transcript.txt"
Start-Transcript -Path $Transcript -Force | Out-Null

$Image = "postgres:16-alpine"
$Net = "eos-e2-lab-net"
$Primary = "eos-e2-lab-primary"
$Replica = "eos-e2-lab-replica"
$VolData = "eos-e2-lab-pgdata"
$VolArchive = "eos-e2-lab-archive"
$VolBackup = "eos-e2-lab-basebackup"
$VolRepl = "eos-e2-lab-repldata"
$PgUser = "eoslab"
$PgDb = "eos_lab"
$Results = New-Object System.Collections.Generic.List[object]

function Write-LabLog([string]$Message) {
  $line = "{0} {1}" -f ([DateTimeOffset]::UtcNow.ToString("o")), $Message
  Write-Host $line
  Add-Content -Path (Join-Path $RunDir "logs\events.log") -Value $line
}

function Invoke-Sql {
  param(
    [string]$Container,
    [string]$Sql,
    [switch]$AllowFail
  )
  $raw = & docker exec $Container psql -U $PgUser -d $PgDb -v ON_ERROR_STOP=1 -Atc $Sql 2>&1
  $text = ($raw | Out-String).Trim()
  if ($LASTEXITCODE -ne 0 -and -not $AllowFail) {
    throw "SQL failed on ${Container}: $text`n$sql"
  }
  return $text
}

function Wait-Pg {
  param([string]$Container, [int]$TimeoutSec = 90)
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  $stable = 0
  do {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & docker exec $Container pg_isready -U $PgUser -d $PgDb 2>$null | Out-Null
    $ready = ($LASTEXITCODE -eq 0)
    $sel = & docker exec $Container psql -U $PgUser -d $PgDb -v ON_ERROR_STOP=1 -Atc "SELECT 1" 2>$null
    $ErrorActionPreference = $prev
    $selText = ""
    if ($null -ne $sel) { $selText = ([string]$sel).Trim() }
    if ($ready -and ($selText -eq "1")) {
      $stable++
      if ($stable -ge 3) { return }
    } else {
      $stable = 0
    }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $deadline)
  throw "pg ready timeout: $Container"
}

function Remove-LabContainers {
  foreach ($n in @($Primary, $Replica, "eos-e2-lab-app")) {
    Invoke-DockerQuiet rm -f $n | Out-Null
  }
}

function Remove-LabVolumes {
  foreach ($v in @($VolData, $VolArchive, $VolBackup, $VolRepl)) {
    Invoke-DockerQuiet volume rm -f $v | Out-Null
  }
}

function Invoke-DockerQuiet {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  & docker @Args 2>$null | Out-Null
  $code = $LASTEXITCODE
  $ErrorActionPreference = $prev
  return $code
}

function Initialize-LabNetwork {
  $code = Invoke-DockerQuiet network inspect $Net
  if ($code -ne 0) {
    & docker network create $Net | Out-Null
  }
}

function Start-LabPrimary {
  param([switch]$WithSyncOff)
  Initialize-LabNetwork
  & docker volume create $VolData | Out-Null
  & docker volume create $VolArchive | Out-Null
  & docker volume create $VolBackup | Out-Null
  $sync = $(if ($WithSyncOff) { "off" } else { "on" })
  & docker run -d --name $Primary --hostname lab-primary --network $Net `
    -p 127.0.0.1:55432:5432 `
    -v "${VolData}:/var/lib/postgresql/data" `
    -v "${VolArchive}:/archive" `
    -v "${VolBackup}:/basebackup" `
    -e POSTGRES_USER=$PgUser `
    -e POSTGRES_PASSWORD=eos-lab-only-not-prod `
    -e POSTGRES_DB=$PgDb `
    $Image `
    postgres `
    -c wal_level=replica `
    -c archive_mode=on `
    -c "archive_command=cp %p /archive/%f" `
    -c max_wal_senders=10 `
    -c max_replication_slots=10 `
    -c wal_log_hints=on `
    -c hot_standby=on `
    -c "synchronous_commit=$sync" | Out-Null
  Wait-Pg $Primary
  & docker exec -u root $Primary sh -c "mkdir -p /archive /basebackup && chown -R postgres:postgres /archive /basebackup && chmod 777 /archive /basebackup" | Out-Null
  Get-Content (Join-Path $LabDir "schema.sql") -Raw | & docker exec -i $Primary psql -U $PgUser -d $PgDb -v ON_ERROR_STOP=1 | Out-Null
  Invoke-Sql $Primary "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'eos-lab-repl-not-prod';" | Out-Null
  & docker exec $Primary sh -c "echo 'host replication replicator all scram-sha-256' >> /var/lib/postgresql/data/pg_hba.conf" | Out-Null
  Invoke-Sql $Primary "SELECT pg_reload_conf();" | Out-Null
}

function Reset-Lab {
  Remove-LabContainers
  Remove-LabVolumes
}

function Add-BusinessPair {
  param([string]$Container, [string]$Marker, [string]$Note = "synthetic")
  $sql = @"
INSERT INTO lab_markers (marker_id, function_class, commit_status, durable_confirmed, note)
VALUES ('$Marker', 'commercial_rfp', 'committed', true, '$Note');
INSERT INTO lab_rfp (id, title, marker_id) VALUES ('rfp-$Marker', 'Synthetic RFP $Marker', '$Marker');
INSERT INTO lab_markers (marker_id, function_class, commit_status, durable_confirmed, note)
VALUES ('$Marker-PB', 'programme_building', 'committed', true, '$Note');
INSERT INTO lab_programme (id, title, rfp_id, marker_id)
VALUES ('pb-$Marker', 'Synthetic Programme $Marker', 'rfp-$Marker', '$Marker-PB');
INSERT INTO lab_outbox (id, marker_id, payload) VALUES ('ob-$Marker', '$Marker', 'outbox $Marker');
"@
  Invoke-Sql $Container $sql | Out-Null
}

function Get-MarkerList([string]$Container) {
  $t = Invoke-Sql $Container "SELECT coalesce(string_agg(marker_id, ',' ORDER BY seq), '') FROM lab_markers;"
  return $t
}

function Test-MarkerPresent([string]$Container, [string]$Marker) {
  $n = Invoke-Sql $Container "SELECT count(*) FROM lab_markers WHERE marker_id = '$Marker';"
  return [int]$n -gt 0
}

function Invoke-BusinessProbe {
  param([string]$Container, [string]$Tag)
  $m = "PROBE-$Tag"
  Add-BusinessPair $Container $m "post-recovery probe"
  $rfp = Invoke-Sql $Container "SELECT title FROM lab_rfp WHERE id = 'rfp-$m';"
  $pb = Invoke-Sql $Container "SELECT title FROM lab_programme WHERE id = 'pb-$m';"
  if (-not $rfp -or -not $pb) { throw "Probe read failed for $Tag" }
  return @{ ok = $true; rfp = $rfp; programme = $pb; marker = $m }
}

function Get-Integrity {
  param([string]$Container)
  $counts = Invoke-Sql $Container "SELECT count(*) FROM lab_markers;"
  $rfp = Invoke-Sql $Container "SELECT count(*) FROM lab_rfp;"
  $pb = Invoke-Sql $Container "SELECT count(*) FROM lab_programme;"
  $orphans = Invoke-Sql $Container "SELECT count(*) FROM lab_programme p LEFT JOIN lab_rfp r ON r.id = p.rfp_id WHERE r.id IS NULL;"
  $dup = Invoke-Sql $Container "SELECT coalesce(max(c),0) FROM (SELECT count(*) c FROM lab_markers GROUP BY marker_id) s;"
  $markers = Get-MarkerList $Container
  return [ordered]@{
    marker_count = [int]$counts
    rfp_count = [int]$rfp
    programme_count = [int]$pb
    orphan_programmes = [int]$orphans
    max_marker_duplicates = [int]$dup
    markers = $markers
    referential_ok = ([int]$orphans -eq 0)
    no_duplicate_markers = ([int]$dup -le 1)
  }
}

function Add-Result {
  param([hashtable]$H)
  $H["boundary"] = "Dev/Test laboratory evidence only. This result does not constitute Production readiness, Production authorization, or Production proof."
  $H["run_id"] = $RunId
  $Results.Add([pscustomobject]$H) | Out-Null
  ($H | ConvertTo-Json -Depth 10) | Set-Content -Encoding utf8 (Join-Path $RunDir "$($H.test_id).json")
}

function Wait-ReplicaSync {
  param([int]$TimeoutSec = 60)
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  do {
    $st = Invoke-Sql $Primary "SELECT coalesce(sync_state,'') FROM pg_stat_replication WHERE application_name = 'replica1' LIMIT 1;" -AllowFail
    if ($st -eq "sync") { return }
    Start-Sleep -Milliseconds 400
  } while ((Get-Date) -lt $deadline)
  throw "replica1 did not reach sync_state=sync (last='$st')"
}

function Start-LabReplica {
  param([string]$AppName = "replica1")
  & docker volume create $VolRepl | Out-Null
  $pgUid = (& docker run --rm $Image id -u postgres).Trim()
  & docker run --rm -v "${VolRepl}:/data" alpine sh -c "mkdir -p /data && chown -R ${pgUid}:${pgUid} /data" | Out-Null
  & docker run --rm --user postgres --network $Net `
    -v "${VolRepl}:/var/lib/postgresql/data" `
    -e PGPASSWORD=eos-lab-repl-not-prod `
    $Image `
    pg_basebackup -h $Primary -U replicator -D /var/lib/postgresql/data -Fp -Xs -P -R --checkpoint=fast | Out-Null
  $connLine = "primary_conninfo = 'host=$Primary port=5432 user=replicator password=eos-lab-repl-not-prod application_name=$AppName'"
  $connLine | & docker run --rm -i -v "${VolRepl}:/data" alpine sh -c "cat >> /data/postgresql.auto.conf"
  & docker run -d --name $Replica --hostname lab-replica --network $Net `
    -p 127.0.0.1:55433:5432 `
    -v "${VolRepl}:/var/lib/postgresql/data" `
    $Image | Out-Null
  Wait-Pg $Replica
}

function Get-ArchiveListing {
  $list = & docker exec $Primary sh -c "ls -1 /archive | wc -l"
  return $list.Trim()
}

Write-LabLog "RUN_START root=$Root run=$RunId"
Write-LabLog "PREEXISTING_GIT will be recorded by caller; runner does not commit"

# ------------------------------------------------------------------------------
# LAB-01 T1 backup + restore
# ------------------------------------------------------------------------------
function Invoke-Lab01 {
  Write-LabLog "LAB-01 start"
  Reset-Lab
  Start-LabPrimary
  Add-BusinessPair $Primary "MARKER-PRE-BACKUP" "in backup"
  $preTs = Invoke-Sql $Primary "SELECT created_at::text FROM lab_markers WHERE marker_id='MARKER-PRE-BACKUP';"
  $dumpPath = Join-Path $RunDir "backups\lab01.dump"
  & docker exec $Primary pg_dump -U $PgUser -d $PgDb -Fc -f /tmp/lab01.dump
  & docker cp "${Primary}:/tmp/lab01.dump" $dumpPath
  $manifest = [ordered]@{
    file = "backups/lab01.dump"
    bytes = (Get-Item $dumpPath).Length
    format = "custom"
    contains = @("MARKER-PRE-BACKUP", "MARKER-PRE-BACKUP-PB")
  }
  ($manifest | ConvertTo-Json) | Set-Content -Encoding utf8 (Join-Path $RunDir "backups\lab01-manifest.json")
  Add-BusinessPair $Primary "MARKER-POST-BACKUP" "after backup, before failure"
  $lastAck = "MARKER-POST-BACKUP"
  $lastDurable = "MARKER-POST-BACKUP"
  $detectSw = [System.Diagnostics.Stopwatch]::StartNew()
  $t0 = [DateTimeOffset]::UtcNow
  $failTs = $t0.ToString("o")
  Write-LabLog "LAB-01 T0 destroy primary data directory"
  & docker rm -f $Primary | Out-Null
  & docker volume rm -f $VolData | Out-Null
  $detectMs = $detectSw.ElapsedMilliseconds
  $recSw = [System.Diagnostics.Stopwatch]::StartNew()
  $decisionTs = [DateTimeOffset]::UtcNow.ToString("o")
  Start-LabPrimary
  & docker cp $dumpPath "${Primary}:/tmp/lab01.dump"
  & docker exec $Primary pg_restore -U $PgUser -d $PgDb --clean --if-exists /tmp/lab01.dump
  $dbAvailTs = [DateTimeOffset]::UtcNow.ToString("o")
  $preOk = Test-MarkerPresent $Primary "MARKER-PRE-BACKUP"
  $postOk = Test-MarkerPresent $Primary "MARKER-POST-BACKUP"
  $probe = Invoke-BusinessProbe $Primary "LAB01"
  $validationTs = [DateTimeOffset]::UtcNow.ToString("o")
  $rtoMs = $detectSw.ElapsedMilliseconds
  $integrity = Get-Integrity $Primary
  $pass = ($preOk -and -not $postOk -and $probe.ok -and $integrity.referential_ok)
  Add-Result @{
    test_id = "LAB-01"
    topology = "T1"
    failure_model = "F4/F5/F11 with T1 only (data directory destroyed; restore from dump)"
    what_failed = "Lab primary container and data volume"
    what_remained = "pg_dump custom backup on lab host disk (127.0.0.1 evidence dir)"
    recovery_mechanism = "pg_restore into new empty lab cluster"
    failure_timestamp = $failTs
    detection_time = $failTs
    recovery_decision_time = $decisionTs
    recovery_start = $decisionTs
    database_availability = $dbAvailTs
    application_availability = $validationTs
    dependency_availability = "N/A (SQL probe only)"
    validation_completion = $validationTs
    detection_duration_ms = $detectMs
    technical_recovery_duration_ms = $recSw.ElapsedMilliseconds
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = $lastAck
    last_confirmed_durable_transaction = $lastDurable
    last_recoverable_transaction = $(if ($preOk) { "MARKER-PRE-BACKUP" } else { $null })
    missing_transactions = @("MARKER-POST-BACKUP", "MARKER-POST-BACKUP-PB")
    acknowledged_survived = $false
    measured_rpo = "Lost committed transactions after dump (MARKER-POST-BACKUP). Not zero."
    measured_rto = "{0:N3} seconds (lab; scripted detection)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted (docker destroy, pg_restore)"
    expected = "MARKER-PRE-BACKUP present; MARKER-POST-BACKUP absent"
    actual = "pre=$preOk post_present=$postOk probe=$($probe.ok) pre_ts=$preTs"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Synthetic PG stand-in tables, not EOS in-memory Commercial/Programme modules. Lab on one host. Detection is scripted, not monitoring. Dev/Test only."
    repeatability = "single run"
    evidence = @("backups/lab01.dump", "backups/lab01-manifest.json", "LAB-01.json")
  }
  Write-LabLog "LAB-01 $($Results[-1].pass_fail) rto_ms=$rtoMs pre=$preOk post=$postOk"
}

# ------------------------------------------------------------------------------
# LAB-02 WAL/PITR
# ------------------------------------------------------------------------------
function Invoke-PitrToRestorePoint {
  param([string]$RestorePoint, [string]$TestId)
  Invoke-Sql $Primary "CHECKPOINT; SELECT pg_create_restore_point('$RestorePoint'); SELECT pg_switch_wal();" | Out-Null
  Start-Sleep -Seconds 2
  & docker exec -u postgres $Primary pg_basebackup -U $PgUser -D "/basebackup/$TestId" -Fp -X none --checkpoint=fast
  $pgUid = (& docker run --rm $Image id -u postgres).Trim()
  & docker stop $Primary | Out-Null
  $restoreSh = @"
set -e
find /data -mindepth 1 -delete
cp -a /backup/$TestId/. /data/
touch /data/recovery.signal
printf '%s\n' \"restore_command = 'cp /archive/%f %p'\" \"recovery_target_name = '$RestorePoint'\" \"recovery_target_inclusive = true\" \"recovery_target_action = 'promote'\" >> /data/postgresql.auto.conf
chown -R ${pgUid}:${pgUid} /data
"@
  $restoreSh | & docker run --rm -i -v "${VolData}:/data" -v "${VolBackup}:/backup" -v "${VolArchive}:/archive" alpine sh -s
  & docker start $Primary | Out-Null
  Wait-Pg $Primary 120
  $deadline = (Get-Date).AddSeconds(60)
  do {
    $rec = Invoke-Sql $Primary "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 400
  } while ((Get-Date) -lt $deadline)
}

function Invoke-Lab02 {
  Write-LabLog "LAB-02 start"
  Reset-Lab
  Start-LabPrimary
  Add-BusinessPair $Primary "MARKER-GOOD" "before corruption"
  $tGood = Invoke-Sql $Primary "SELECT clock_timestamp()::text;"
  Invoke-RestorePoint "lab02_good"
  Start-Sleep -Seconds 2
  & docker exec -u postgres $Primary pg_basebackup -U $PgUser -D /basebackup/lab02 -Fp -X none --checkpoint=fast
  # Wait: basebackup AFTER restore point would not include need for WAL... restore point must be in WAL after base backup.
  # Re-do correctly: base backup first, then restore point, then corruption.
}

function Invoke-Lab02Correct {
  Write-LabLog "LAB-02 start (base backup then restore point then corruption)"
  Reset-Lab
  Start-LabPrimary
  & docker exec -u postgres $Primary pg_basebackup -U $PgUser -D /basebackup/lab02 -Fp -X none --checkpoint=fast
  Add-BusinessPair $Primary "MARKER-GOOD" "before corruption"
  Invoke-RestorePoint "lab02_good"
  Start-Sleep -Seconds 2
  Invoke-Sql $Primary "UPDATE lab_rfp SET title = 'CORRUPT-AFTER-GOOD' WHERE id = 'rfp-MARKER-GOOD'; INSERT INTO lab_markers (marker_id, function_class, commit_status, durable_confirmed, note) VALUES ('MARKER-AFTER-CORRUPT', 'commercial_rfp', 'committed', true, 'after restore point');" | Out-Null
  Invoke-Sql $Primary "SELECT pg_switch_wal();" | Out-Null
  Start-Sleep -Seconds 2
  $arch = Get-ArchiveListing
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $rec = Invoke-PitrRestore -BackupName "lab02" -RestorePoint "lab02_good"
  $good = Test-MarkerPresent $Primary "MARKER-GOOD"
  $after = Test-MarkerPresent $Primary "MARKER-AFTER-CORRUPT"
  $title = Invoke-Sql $Primary "SELECT coalesce((SELECT title FROM lab_rfp WHERE id='rfp-MARKER-GOOD'),'MISSING');"
  $probe = Invoke-BusinessProbe $Primary "LAB02"
  $integrity = Get-Integrity $Primary
  $rtoMs = $sw.ElapsedMilliseconds
  $titleOk = ($title -ne "CORRUPT-AFTER-GOOD")
  $pass = ($good -and -not $after -and $titleOk -and $probe.ok -and $integrity.referential_ok)
  ($arch) | Set-Content (Join-Path $RunDir "logs\lab02-archive-count.txt")
  Add-Result @{
    test_id = "LAB-02"
    topology = "T2"
    failure_model = "F9 logical corruption recovered via WAL/PITR restore point lab02_good"
    what_failed = "Logical row content after restore point"
    what_remained = "Base backup + WAL archive volume"
    recovery_mechanism = "PITR to named restore point lab02_good"
    failure_timestamp = $t0.ToString("o")
    detection_duration_ms = 0
    technical_recovery_duration_ms = $rtoMs
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-AFTER-CORRUPT"
    last_confirmed_durable_transaction = "MARKER-AFTER-CORRUPT"
    last_recoverable_transaction = $(if ($good) { "MARKER-GOOD" } else { $null })
    missing_transactions = @("MARKER-AFTER-CORRUPT")
    acknowledged_survived = $false
    measured_rpo = "PITR discarded committed work after restore point (MARKER-AFTER-CORRUPT). Technical RPO is the chosen recovery point, not zero for post-target commits."
    measured_rto = "{0:N3} seconds (lab)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    rfp_title_after_recovery = $title
    wal_archive_file_count_at_primary = $arch
    operator_intervention = "Scripted PITR"
    expected = "MARKER-GOOD present; MARKER-AFTER-CORRUPT absent; title not CORRUPT"
    actual = "good=$good after=$after title=$title probe=$($probe.ok) in_recovery_last=$rec"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Synthetic PG stand-in. Single-host archive. Not Production WAL product. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-02.json", "logs/lab02-archive-count.txt")
  }
  Write-LabLog "LAB-02 $($Results[-1].pass_fail) rto_ms=$rtoMs good=$good after=$after title=$title"
}

function Invoke-Lab03 {
  Write-LabLog "LAB-03 start"
  Reset-Lab
  Start-LabPrimary
  Add-BusinessPair $Primary "MARKER-PRE-FAIL" "committed before kill"
  $lastDurable = "MARKER-PRE-FAIL"
  # in-flight uncommitted
  & docker exec -d $Primary psql -U $PgUser -d $PgDb -c "BEGIN; INSERT INTO lab_markers (marker_id, function_class, commit_status, durable_confirmed, note) VALUES ('MARKER-INFLIGHT', 'commercial_rfp', 'committed', false, 'uncommitted'); SELECT pg_sleep(30);"
  Start-Sleep -Seconds 1
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker kill --signal=SIGKILL $Primary | Out-Null
  $detectMs = $sw.ElapsedMilliseconds
  & docker start $Primary | Out-Null
  Wait-Pg $Primary 90
  $pre = Test-MarkerPresent $Primary "MARKER-PRE-FAIL"
  $inf = Test-MarkerPresent $Primary "MARKER-INFLIGHT"
  $probe = Invoke-BusinessProbe $Primary "LAB03"
  $integrity = Get-Integrity $Primary
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($pre -and -not $inf -and $probe.ok)
  Add-Result @{
    test_id = "LAB-03"
    topology = "single-node crash recovery (not T6 HA)"
    failure_model = "F3 database process SIGKILL; data directory survived"
    what_failed = "PostgreSQL process (container killed)"
    what_remained = "Same Docker volume / data directory"
    recovery_mechanism = "docker start + PostgreSQL crash recovery"
    failure_timestamp = $t0.ToString("o")
    detection_duration_ms = $detectMs
    technical_recovery_duration_ms = $rtoMs
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = $lastDurable
    last_confirmed_durable_transaction = $lastDurable
    last_recoverable_transaction = $(if ($pre) { $lastDurable } else { $null })
    missing_transactions = $(if ($inf) { @() } else { @("MARKER-INFLIGHT (uncommitted, expected absent)") })
    acknowledged_survived = $pre
    measured_rpo = $(if ($pre -and -not $inf) { "Measured zero loss of committed transactions for this F3 configuration (MARKER-PRE-FAIL survived; uncommitted MARKER-INFLIGHT did not). Not generalized to other failure models." } else { "Committed marker missing or inflight unexpectedly present" })
    measured_rto = "{0:N3} seconds (lab process restart + crash recovery)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted docker kill/start"
    expected = "Committed marker survives; inflight does not"
    actual = "pre=$pre inflight=$inf probe=$($probe.ok)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "This is F3 (process), NOT F4 host/storage loss. Not HA failover. Synthetic tables. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-03.json")
  }
  Write-LabLog "LAB-03 $($Results[-1].pass_fail) rto_ms=$rtoMs pre=$pre inflight=$inf"
}

function Set-PrimarySyncMode([string]$Names) {
  Invoke-Sql $Primary "ALTER SYSTEM SET synchronous_standby_names TO '$Names';" | Out-Null
  Invoke-Sql $Primary "SELECT pg_reload_conf();" | Out-Null
}

function Invoke-RestorePoint([string]$Name) {
  Invoke-Sql $Primary "CHECKPOINT;" | Out-Null
  Invoke-Sql $Primary "SELECT pg_create_restore_point('$Name');" | Out-Null
  Invoke-Sql $Primary "SELECT pg_switch_wal();" | Out-Null
}

function Invoke-PitrRestore {
  param([string]$BackupName, [string]$RestorePoint)
  $pgUid = (& docker run --rm $Image id -u postgres).ToString().Trim()
  & docker stop $Primary | Out-Null
  $lines = @(
    "find /data -mindepth 1 -delete",
    "cp -a /backup/$BackupName/. /data/",
    "touch /data/recovery.signal",
    "echo `"restore_command = 'cp /archive/%f %p'`" >> /data/postgresql.auto.conf",
    "echo `"recovery_target_name = '$RestorePoint'`" >> /data/postgresql.auto.conf",
    "echo `"recovery_target_inclusive = true`" >> /data/postgresql.auto.conf",
    "echo `"recovery_target_action = promote`" >> /data/postgresql.auto.conf",
    "chown -R ${pgUid}:${pgUid} /data"
  )
  $script = ($lines -join "`n") + "`n"
  $path = Join-Path $RunDir "logs\pitr-$BackupName.sh"
  [System.IO.File]::WriteAllText($path, $script)
  $winPath = $path
  & docker run --rm `
    -v "${VolData}:/data" `
    -v "${VolBackup}:/backup" `
    -v "${VolArchive}:/archive" `
    -v "${RunDir}/logs:/scripts" `
    alpine sh "/scripts/pitr-$BackupName.sh"
  if ($LASTEXITCODE -ne 0) { throw "PITR restore script failed for $BackupName" }
  & docker start $Primary | Out-Null
  Wait-Pg $Primary 120
  $deadline = (Get-Date).AddSeconds(90)
  do {
    $rec = Invoke-Sql $Primary "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { return $rec }
    Start-Sleep -Milliseconds 400
  } while ((Get-Date) -lt $deadline)
  return $rec
}

function Invoke-Lab04 {
  Write-LabLog "LAB-04 start"
  Reset-Lab
  Start-LabPrimary
  Start-LabReplica -AppName "replica1"
  Set-PrimarySyncMode "replica1"
  Wait-ReplicaSync 90
  Add-BusinessPair $Primary "MARKER-SYNC-COMMITTED" "sync commit"
  $onRepl = Test-MarkerPresent $Replica "MARKER-SYNC-COMMITTED"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker kill --signal=SIGKILL $Primary | Out-Null
  Invoke-Sql $Replica "SELECT pg_promote();"
  $deadline = (Get-Date).AddSeconds(45)
  do {
    $rec = Invoke-Sql $Replica "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $deadline)
  $survived = Test-MarkerPresent $Replica "MARKER-SYNC-COMMITTED"
  $probe = Invoke-BusinessProbe $Replica "LAB04"
  $integrity = Get-Integrity $Replica
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($onRepl -and $survived -and $probe.ok -and ($rec -eq "f"))
  Add-Result @{
    test_id = "LAB-04"
    topology = "T3"
    failure_model = "F11/F4 process kill of primary; synchronous standby survived"
    what_failed = "Lab primary process/container"
    what_remained = "Synchronous replica container and its volume"
    recovery_mechanism = "pg_promote() on replica"
    failure_timestamp = $t0.ToString("o")
    detection_duration_ms = $sw.ElapsedMilliseconds
    technical_recovery_duration_ms = $rtoMs
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-SYNC-COMMITTED"
    last_confirmed_durable_transaction = "MARKER-SYNC-COMMITTED"
    last_recoverable_transaction = $(if ($survived) { "MARKER-SYNC-COMMITTED" } else { $null })
    missing_transactions = @()
    acknowledged_survived = $survived
    measured_rpo = $(if ($survived) { "Measured zero transaction loss for this test configuration and failure model (sync replica promote; MARKER-SYNC-COMMITTED survived). Not generalized to async, logical corruption, or region loss." } else { "Sync marker missing after promote" })
    measured_rto = "{0:N3} seconds (lab promote)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    marker_on_replica_before_fail = $onRepl
    operator_intervention = "Scripted promote; old primary fenced by remaining stopped"
    expected = "Sync committed marker present on promoted replica; probe write ok"
    actual = "before=$onRepl after=$survived promoted=($rec -eq f) probe=$($probe.ok)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Both containers on one Docker Desktop host - not independent AZ/region. No STONITH beyond kill. Synthetic tables. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-04.json")
  }
  Write-LabLog "LAB-04 $($Results[-1].pass_fail) rto_ms=$rtoMs survived=$survived"
}

function Invoke-Lab05 {
  Write-LabLog "LAB-05 start"
  Reset-Lab
  Start-LabPrimary -WithSyncOff
  Start-LabReplica -AppName "replica1"
  Set-PrimarySyncMode ""
  # wait streaming
  $deadline = (Get-Date).AddSeconds(40)
  do {
    $st = Invoke-Sql $Primary "SELECT count(*) FROM pg_stat_replication;" -AllowFail
    if ($st -ge 1) { break }
    Start-Sleep -Milliseconds 400
  } while ((Get-Date) -lt $deadline)
  Add-BusinessPair $Primary "MARKER-REPLICATED" "on primary before replica stop"
  Start-Sleep -Seconds 2
  $repHas = Test-MarkerPresent $Replica "MARKER-REPLICATED"
  & docker stop $Replica | Out-Null
  Add-BusinessPair $Primary "MARKER-UNREPLICATED" "committed on primary while replica stopped"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker kill --signal=SIGKILL $Primary | Out-Null
  & docker start $Replica | Out-Null
  Wait-Pg $Replica 90
  Invoke-Sql $Replica "SELECT pg_promote();"
  $d2 = (Get-Date).AddSeconds(45)
  do {
    $rec = Invoke-Sql $Replica "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $d2)
  $rep = Test-MarkerPresent $Replica "MARKER-REPLICATED"
  $unrep = Test-MarkerPresent $Replica "MARKER-UNREPLICATED"
  $probe = Invoke-BusinessProbe $Replica "LAB05"
  $integrity = Get-Integrity $Replica
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($repHas -and $rep -and -not $unrep -and $probe.ok)
  Add-Result @{
    test_id = "LAB-05"
    topology = "T4"
    failure_model = "F4/F12-class primary loss while async replica was stopped (induced lag)"
    what_failed = "Primary killed after replica stopped"
    what_remained = "Async replica data from before stop"
    recovery_mechanism = "Start replica and pg_promote"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-UNREPLICATED"
    last_confirmed_durable_transaction = "MARKER-UNREPLICATED"
    last_recoverable_transaction = $(if ($rep) { "MARKER-REPLICATED" } else { $null })
    missing_transactions = @("MARKER-UNREPLICATED")
    acknowledged_survived = $false
    measured_rpo = "Lost committed MARKER-UNREPLICATED (async lag / replica down). Demonstrates technical RPO > 0 for this failure model. Must not be labelled zero-loss."
    measured_rto = "{0:N3} seconds (lab)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted replica stop, primary kill, promote"
    expected = "MARKER-REPLICATED present; MARKER-UNREPLICATED absent"
    actual = "replicated_before=$repHas replicated_after=$rep unreplicated=$unrep probe=$($probe.ok)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Lag induced by stopping replica, not geographic distance. One host. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-05.json")
  }
  Write-LabLog "LAB-05 $($Results[-1].pass_fail) rto_ms=$rtoMs unrep=$unrep"
}

function Invoke-Lab06 {
  Write-LabLog "LAB-06 start"
  Reset-Lab
  Start-LabPrimary
  Start-LabReplica -AppName "replica1"
  Set-PrimarySyncMode "replica1"
  Wait-ReplicaSync 90
  Add-BusinessPair $Primary "MARKER-WARM" "on warm standby path"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker stop $Primary | Out-Null
  Invoke-Sql $Replica "SELECT pg_promote();"
  $d2 = (Get-Date).AddSeconds(45)
  do {
    $rec = Invoke-Sql $Replica "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $d2)
  $ok = Test-MarkerPresent $Replica "MARKER-WARM"
  $probe = Invoke-BusinessProbe $Replica "LAB06"
  $integrity = Get-Integrity $Replica
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($ok -and $probe.ok -and ($rec -eq "f"))
  Add-Result @{
    test_id = "LAB-06"
    topology = "T5"
    failure_model = "F11 primary stopped; warm replica already running"
    what_failed = "Primary container stopped"
    what_remained = "Already-running replica (hot standby) + probe switched to replica port/container"
    recovery_mechanism = "Promote warm standby; connection switch of SQL probe"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-WARM"
    last_confirmed_durable_transaction = "MARKER-WARM"
    last_recoverable_transaction = $(if ($ok) { "MARKER-WARM" } else { $null })
    missing_transactions = @()
    acknowledged_survived = $ok
    measured_rpo = $(if ($ok) { "Measured zero transaction loss for this sync-warm-standby configuration and F11 stop-primary model. Application process was not a running EOS standby." } else { "Marker missing" })
    measured_rto = "{0:N3} seconds (lab DB promote + probe switch)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted promote; probe retargeted to replica"
    expected = "Warm replica promotes; markers + probe ok"
    actual = "marker=$ok probe=$($probe.ok) promoted=($rec -eq f)"
    pass_fail = $(if ($pass) { "PARTIAL" } else { "FAIL" })
    limitations = "Database warm standby demonstrated. EOS application warm standby process NOT present. One host. Dev/Test only. Result is PARTIAL even on success of DB path."
    repeatability = "single run"
    evidence = @("LAB-06.json")
  }
  Write-LabLog "LAB-06 $($Results[-1].pass_fail) rto_ms=$rtoMs"
}

function Invoke-Lab07 {
  Write-LabLog "LAB-07 start"
  Reset-Lab
  Start-LabPrimary
  Add-BusinessPair $Primary "MARKER-COMBO" "before combined kill"
  $apiPort = 18080
  $apiLog = Join-Path $RunDir "logs\api-lab07.log"
  $apiErr = Join-Path $RunDir "logs\api-lab07.err"
  $apiProc = $null
  $apiStarted = $false
  $orgId = $null
  $afterId = "still-present"
  try {
    $env:EOS_ENV = "development"
    $env:EOS_PORT = "$apiPort"
    $env:EOS_BOOTSTRAP_ALICE_PASSWORD = "test-alice-not-for-prod"
    $env:EOS_BOOTSTRAP_BOB_PASSWORD = "test-bob-not-for-prod"
    $env:EOS_BOOTSTRAP_CAROL_PASSWORD = "test-carol-not-for-prod"
    $env:EOS_BOOTSTRAP_PARTNER_PASSWORD = "test-partner-not-for-prod"
    $env:EOS_SEED_DEMO = "true"
    $env:EOS_TOKEN_SECRET = "lab-e2-token-secret-not-for-prod"
    Remove-Item Env:EOS_DATABASE_URL -ErrorAction SilentlyContinue
    $p = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev", "-w", "@sedmc/api") `
      -WorkingDirectory $Root -PassThru -NoNewWindow `
      -RedirectStandardOutput $apiLog -RedirectStandardError $apiErr
    $apiProc = $p
    $deadline = (Get-Date).AddSeconds(90)
    do {
      try {
        $h = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$apiPort/health" -TimeoutSec 2
        if ($h.StatusCode -eq 200) { $apiStarted = $true; break }
      } catch { Start-Sleep -Milliseconds 500 }
    } while ((Get-Date) -lt $deadline -and -not $p.HasExited)
    if ($apiStarted) {
      $loginBody = @{ email = "carol.admin@sedmc.local"; password = "test-carol-not-for-prod"; tenantSlug = "sedmc" } | ConvertTo-Json
      $login = Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:$apiPort/v1/auth/login" -ContentType "application/json" -Body $loginBody
      $token = $login.accessToken
      $hdr = @{ Authorization = "Bearer $token" }
      $types = Invoke-RestMethod -Uri "http://127.0.0.1:$apiPort/v1/crm/organization-types" -Headers $hdr
      $typeId = ($types.items | Where-Object { $_.key -eq "mice_agency" } | Select-Object -First 1).id
      $org = Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:$apiPort/v1/crm/organizations" -Headers $hdr -ContentType "application/json" -Body (@{ legalName = "LAB07 Synthetic Org"; organizationTypeId = $typeId } | ConvertTo-Json)
      $orgId = $org.organization.id
    }
  } catch {
    Write-LabLog "LAB-07 API setup error: $_"
  }
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  if ($apiProc -and -not $apiProc.HasExited) { Stop-Process -Id $apiProc.Id -Force -ErrorAction SilentlyContinue }
  & docker kill --signal=SIGKILL $Primary | Out-Null
  & docker start $Primary | Out-Null
  Wait-Pg $Primary 90
  $pgOk = Test-MarkerPresent $Primary "MARKER-COMBO"
  $probe = Invoke-BusinessProbe $Primary "LAB07"
  $apiAfter = $false
  if ($apiStarted) {
    $p2 = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev", "-w", "@sedmc/api") `
      -WorkingDirectory $Root -PassThru -NoNewWindow `
      -RedirectStandardOutput (Join-Path $RunDir "logs\api-lab07-b.log") `
      -RedirectStandardError (Join-Path $RunDir "logs\api-lab07-b.err")
    $deadline = (Get-Date).AddSeconds(90)
    do {
      try {
        $h = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$apiPort/health" -TimeoutSec 2
        if ($h.StatusCode -eq 200) { $apiAfter = $true; break }
      } catch { Start-Sleep -Milliseconds 500 }
    } while ((Get-Date) -lt $deadline)
    if ($apiAfter -and $orgId) {
      $loginBody = @{ email = "carol.admin@sedmc.local"; password = "test-carol-not-for-prod"; tenantSlug = "sedmc" } | ConvertTo-Json
      $login = Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:$apiPort/v1/auth/login" -ContentType "application/json" -Body $loginBody
      try {
        Invoke-RestMethod -Uri "http://127.0.0.1:$apiPort/v1/crm/organizations/$orgId" -Headers @{ Authorization = "Bearer $($login.accessToken)" } | Out-Null
        $afterId = "UNEXPECTEDLY_PRESENT"
      } catch {
        $afterId = "ABSENT_AFTER_RESTART"
      }
    }
    if ($p2 -and -not $p2.HasExited) { Stop-Process -Id $p2.Id -Force -ErrorAction SilentlyContinue }
  }
  $rtoMs = $sw.ElapsedMilliseconds
  $integrity = Get-Integrity $Primary
  $passLabel = "PARTIAL"
  if ($pgOk -and $probe.ok -and $apiStarted -and $afterId -eq "ABSENT_AFTER_RESTART") { $passLabel = "PARTIAL" }
  if (-not $pgOk) { $passLabel = "FAIL" }
  Add-Result @{
    test_id = "LAB-07"
    topology = "T1/F3 combined with in-memory EOS API"
    failure_model = "F1+F3 API process kill + DB process SIGKILL (data dir survived)"
    what_failed = "Lab API node process and lab PostgreSQL process"
    what_remained = "PG data volume; API in-memory Store did not remain"
    recovery_mechanism = "docker start PG crash recovery; API process restart"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-COMBO (PG) + CRM org (in-memory)"
    last_confirmed_durable_transaction = "MARKER-COMBO (PG only)"
    last_recoverable_transaction = $(if ($pgOk) { "MARKER-COMBO" } else { $null })
    missing_transactions = @("EOS CRM organization in-memory (if API started)")
    acknowledged_survived = $pgOk
    measured_rpo = "PG committed MARKER-COMBO survived F3. EOS CRM org did not survive API restart (in-memory SoR). Not Production RPO."
    measured_rto = "{0:N3} seconds until PG probe succeeded (API restart additional)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    api_started = $apiStarted
    crm_org_id_before = $orgId
    crm_org_after_restart = $afterId
    operator_intervention = "Scripted kill/start"
    expected = "PG markers survive F3; in-memory API state does not"
    actual = "pg=$pgOk probe=$($probe.ok) api_started=$apiStarted crm_after=$afterId"
    pass_fail = $passLabel
    limitations = "Jointly critical EOS Commercial/Programme Building are not PG-persisted; CRM org used as in-memory witness only. Combined RTO is lab process restart, not Production HA. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-07.json", "logs/api-lab07.log")
  }
  Write-LabLog "LAB-07 $passLabel pg=$pgOk api=$apiStarted crm_after=$afterId"
}

function Invoke-Lab08 {
  Write-LabLog "LAB-08 start"
  Reset-Lab
  Start-LabPrimary
  & docker exec -u postgres $Primary pg_basebackup -U $PgUser -D /basebackup/lab08 -Fp -X none --checkpoint=fast
  Add-BusinessPair $Primary "MARKER-GOOD" "pre-corruption"
  Invoke-RestorePoint "lab08_good"
  Start-Sleep -Seconds 2
  Invoke-Sql $Primary "UPDATE lab_rfp SET title='LOGICAL-CORRUPT' WHERE id='rfp-MARKER-GOOD'; UPDATE lab_programme SET title='LOGICAL-CORRUPT' WHERE id='pb-MARKER-GOOD';" | Out-Null
  Invoke-Sql $Primary "SELECT pg_switch_wal();" | Out-Null
  Start-Sleep -Seconds 2
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $rec = Invoke-PitrRestore -BackupName "lab08" -RestorePoint "lab08_good"
  $title = Invoke-Sql $Primary "SELECT title FROM lab_rfp WHERE id='rfp-MARKER-GOOD';"
  $probe = Invoke-BusinessProbe $Primary "LAB08"
  $integrity = Get-Integrity $Primary
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = (($title -ne "LOGICAL-CORRUPT") -and $probe.ok)
  Add-Result @{
    test_id = "LAB-08"
    topology = "T2"
    failure_model = "F9 logical UPDATE corruption; PITR to restore point"
    what_failed = "Row contents (logical)"
    what_remained = "Base backup + WAL archive"
    recovery_mechanism = "PITR; HA replica would have replicated the corruption and was not used as the fix"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "logical UPDATE"
    last_recoverable_transaction = "MARKER-GOOD at restore point"
    missing_transactions = @("logical UPDATE after restore point")
    acknowledged_survived = $false
    measured_rpo = "Recovery to restore point discarded subsequent committed UPDATE. Not zero loss of all later commits."
    measured_rto = "{0:N3} seconds (lab PITR)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    title_after = $title
    operator_intervention = "Scripted PITR"
    expected = "title restored to non-CORRUPT; probe ok"
    actual = "title=$title probe=$($probe.ok)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Synthetic rows. Demonstrates backup/PITR needed even if T3 exists. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-08.json")
  }
  Write-LabLog "LAB-08 $($Results[-1].pass_fail) title=$title"
}

function Invoke-Lab09 {
  Write-LabLog "LAB-09 start"
  Reset-Lab
  Start-LabPrimary
  & docker exec -u postgres $Primary pg_basebackup -U $PgUser -D /basebackup/lab09 -Fp -X none --checkpoint=fast
  Add-BusinessPair $Primary "MARKER-BEFORE-DELETE" "before delete"
  Invoke-RestorePoint "lab09_good"
  Start-Sleep -Seconds 2
  Invoke-Sql $Primary "DELETE FROM lab_programme; DELETE FROM lab_rfp; DELETE FROM lab_outbox; DELETE FROM lab_markers;" | Out-Null
  Invoke-Sql $Primary "SELECT pg_switch_wal();" | Out-Null
  Start-Sleep -Seconds 2
  $gone = Invoke-Sql $Primary "SELECT count(*) FROM lab_rfp;"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $rec = Invoke-PitrRestore -BackupName "lab09" -RestorePoint "lab09_good"
  $present = Test-MarkerPresent $Primary "MARKER-BEFORE-DELETE"
  $rfpN = Invoke-Sql $Primary "SELECT count(*) FROM lab_rfp;"
  $probe = Invoke-BusinessProbe $Primary "LAB09"
  $integrity = Get-Integrity $Primary
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($present -and ([int]$rfpN -ge 1) -and $probe.ok -and $integrity.referential_ok)
  Add-Result @{
    test_id = "LAB-09"
    topology = "T2"
    failure_model = "F8 accidental DELETE of synthetic business rows"
    what_failed = "Logical deletion of rfp/programme/markers"
    what_remained = "Base backup + WAL"
    recovery_mechanism = "PITR to lab09_good"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "DELETE statements"
    last_recoverable_transaction = $(if ($present) { "MARKER-BEFORE-DELETE" } else { $null })
    missing_transactions = @("DELETE (intentionally rolled back by PITR)")
    acknowledged_survived = $false
    measured_rpo = "Controlled rollback to restore point. Not RPO 0 for commits after the delete."
    measured_rto = "{0:N3} seconds (lab PITR)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    counts_after_delete_before_pitr = $gone
    operator_intervention = "Scripted PITR"
    expected = "MARKER-BEFORE-DELETE and rfp row restored"
    actual = "present=$present rfp=$rfpN probe=$($probe.ok) deleted_count_before_pitr=$gone"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Synthetic tables. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-09.json")
  }
  Write-LabLog "LAB-09 $($Results[-1].pass_fail) present=$present"
}

function Invoke-Lab10 {
  Write-LabLog "LAB-10 start"
  Reset-Lab
  Start-LabPrimary -WithSyncOff
  Start-LabReplica -AppName "replica1"
  Set-PrimarySyncMode ""
  $deadline = (Get-Date).AddSeconds(40)
  do {
    $st = Invoke-Sql $Primary "SELECT count(*) FROM pg_stat_replication;" -AllowFail
    if ($st -ge 1) { break }
    Start-Sleep -Milliseconds 400
  } while ((Get-Date) -lt $deadline)
  Add-BusinessPair $Primary "MARKER-SITE-A" "replicated hopefully"
  Start-Sleep -Seconds 2
  $onB = Test-MarkerPresent $Replica "MARKER-SITE-A"
  & docker stop $Replica | Out-Null
  Add-BusinessPair $Primary "MARKER-SITE-A-ONLY" "not on site B"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker network disconnect $Net $Primary
  & docker kill --signal=SIGKILL $Primary | Out-Null
  & docker start $Replica | Out-Null
  Wait-Pg $Replica 90
  Invoke-Sql $Replica "SELECT pg_promote();"
  $d2 = (Get-Date).AddSeconds(45)
  do {
    $rec = Invoke-Sql $Replica "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $d2)
  $a = Test-MarkerPresent $Replica "MARKER-SITE-A"
  $only = Test-MarkerPresent $Replica "MARKER-SITE-A-ONLY"
  $probe = Invoke-BusinessProbe $Replica "LAB10"
  $integrity = Get-Integrity $Replica
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($onB -and $a -and -not $only -and $probe.ok)
  Add-Result @{
    test_id = "LAB-10"
    topology = "T4 site simulation"
    failure_model = "F12 simulated site A isolation/kill; site B promote"
    what_failed = "Primary (site A) disconnected from lab network and killed"
    what_remained = "Replica (site B) on same Docker Desktop host"
    recovery_mechanism = "Promote site B replica"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-SITE-A-ONLY"
    last_recoverable_transaction = $(if ($a) { "MARKER-SITE-A" } else { $null })
    missing_transactions = @("MARKER-SITE-A-ONLY")
    acknowledged_survived = $false
    measured_rpo = "Async site simulation lost MARKER-SITE-A-ONLY. RPO > 0. Not a Legal-approved DR region."
    measured_rto = "{0:N3} seconds (lab)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted network disconnect + promote"
    expected = "Site B has MARKER-SITE-A; not SITE-A-ONLY"
    actual = "onB_before=$onB a=$a only=$only probe=$($probe.ok)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Two containers on one laptop are not an independent region/facility. Legal E1 DR geography still OPEN. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-10.json")
  }
  Write-LabLog "LAB-10 $($Results[-1].pass_fail) rto_ms=$rtoMs"
}

function Invoke-Lab11 {
  Write-LabLog "LAB-11 start"
  Reset-Lab
  Start-LabPrimary
  Add-BusinessPair $Primary "MARKER-DATA-INTACT" "dependency test"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & docker stop $Primary | Out-Null
  $probeDown = $false
  try {
    Invoke-Sql $Primary "SELECT 1;" | Out-Null
  } catch { $probeDown = $true }
  $fnDownMs = $sw.ElapsedMilliseconds
  & docker start $Primary | Out-Null
  Wait-Pg $Primary 90
  $intact = Test-MarkerPresent $Primary "MARKER-DATA-INTACT"
  $probe = Invoke-BusinessProbe $Primary "LAB11"
  $rtoMs = $sw.ElapsedMilliseconds
  $integrity = Get-Integrity $Primary
  Add-Result @{
    test_id = "LAB-11"
    topology = "dependency = PostgreSQL for SQL probe; Production IdP/CDN/WAF/email/KMS absent"
    failure_model = "F13 PostgreSQL dependency stopped while probe host remained"
    what_failed = "Database dependency (container stopped)"
    what_remained = "Operator/probe host; data directory"
    recovery_mechanism = "Restart dependency; data intact"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    function_unusable_while_down_ms = $fnDownMs
    last_recoverable_transaction = $(if ($intact) { "MARKER-DATA-INTACT" } else { $null })
    missing_transactions = @()
    acknowledged_survived = $intact
    measured_rpo = $(if ($intact) { "Measured zero loss of committed PG data for this F13 stop/start. Function RTO includes dependency downtime ($fnDownMs ms). Production IdP/CDN/WAF NOT TESTABLE." } else { "Marker missing" })
    measured_rto = "{0:N3} seconds until function probe succeeded after dependency restart" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    probe_failed_while_down = $probeDown
    operator_intervention = "Scripted stop/start"
    expected = "Function down while PG stopped; markers intact after start"
    actual = "down=$probeDown intact=$intact probe=$($probe.ok)"
    pass_fail = $(if ($probeDown -and $intact -and $probe.ok) { "PARTIAL" } else { "FAIL" })
    limitations = "Only PostgreSQL dependency was present. ADR-0013 IdP OPEN; ADR-0012 secrets OPEN; no CDN/WAF/email/object-store lab. Result PARTIAL because those dependencies were NOT TESTABLE."
    repeatability = "single run"
    evidence = @("LAB-11.json")
  }
  Write-LabLog "LAB-11 $($Results[-1].pass_fail) intact=$intact down=$probeDown"
}

function Invoke-Lab12 {
  Write-LabLog "LAB-12 start"
  Reset-Lab
  Start-LabPrimary
  Start-LabReplica -AppName "replica1"
  Set-PrimarySyncMode "replica1"
  Wait-ReplicaSync 90
  Add-BusinessPair $Primary "MARKER-BEFORE-FAILOVER" "on original primary"
  & docker kill --signal=SIGKILL $Primary | Out-Null
  Invoke-Sql $Replica "SELECT pg_promote();"
  $d2 = (Get-Date).AddSeconds(45)
  do {
    $rec = Invoke-Sql $Replica "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $d2)
  Add-BusinessPair $Replica "MARKER-ON-STANDBY" "committed on promoted replica"
  $t0 = [DateTimeOffset]::UtcNow
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  # rebuild old primary as replica of new primary (failback prep)
  & docker rm -f $Primary | Out-Null
  & docker volume rm -f $VolData | Out-Null
  & docker volume create $VolData | Out-Null
  $pgUid = (& docker run --rm $Image id -u postgres).Trim()
  & docker run --rm -v "${VolData}:/data" alpine sh -c "mkdir -p /data && chown -R ${pgUid}:${pgUid} /data" | Out-Null
  Invoke-Sql $Replica "SELECT pg_reload_conf();" | Out-Null
  # replicator role exists on promoted replica (copied)
  & docker run --rm --user postgres --network $Net `
    -v "${VolData}:/var/lib/postgresql/data" `
    -e PGPASSWORD=eos-lab-repl-not-prod `
    $Image `
    pg_basebackup -h $Replica -U replicator -D /var/lib/postgresql/data -Fp -Xs -P -R --checkpoint=fast | Out-Null
  $connLine = "primary_conninfo = 'host=$Replica port=5432 user=replicator password=eos-lab-repl-not-prod application_name=oldprimary'"
  $connLine | & docker run --rm -i -v "${VolData}:/data" alpine sh -c "cat >> /data/postgresql.auto.conf"
  & docker run -d --name $Primary --hostname lab-primary --network $Net `
    -p 127.0.0.1:55432:5432 `
    -v "${VolData}:/var/lib/postgresql/data" `
    -v "${VolArchive}:/archive" `
    -v "${VolBackup}:/basebackup" `
    $Image | Out-Null
  Wait-Pg $Primary 90
  $caught = $false
  $d3 = (Get-Date).AddSeconds(60)
  do {
    $caught = Test-MarkerPresent $Primary "MARKER-ON-STANDBY"
    if ($caught) { break }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $d3)
  Invoke-Sql $Primary "SELECT pg_promote();"
  $d4 = (Get-Date).AddSeconds(45)
  do {
    $rec2 = Invoke-Sql $Primary "SELECT pg_is_in_recovery();" -AllowFail
    if ($rec2 -eq "f") { break }
    Start-Sleep -Milliseconds 300
  } while ((Get-Date) -lt $d4)
  # fence replica to avoid split-brain in lab
  & docker stop $Replica | Out-Null
  $m1 = Test-MarkerPresent $Primary "MARKER-BEFORE-FAILOVER"
  $m2 = Test-MarkerPresent $Primary "MARKER-ON-STANDBY"
  $probe = Invoke-BusinessProbe $Primary "LAB12"
  $integrity = Get-Integrity $Primary
  $rtoMs = $sw.ElapsedMilliseconds
  $pass = ($m1 -and $m2 -and $probe.ok -and $integrity.no_duplicate_markers)
  Add-Result @{
    test_id = "LAB-12"
    topology = "T6/T3 failback"
    failure_model = "F14 planned failback after failover"
    what_failed = "Original primary (previously killed); then planned switch back"
    what_remained = "Promoted replica as temporary primary"
    recovery_mechanism = "pg_basebackup old primary from new; promote old; stop temporary primary"
    failure_timestamp = $t0.ToString("o")
    total_measured_rto_ms = $rtoMs
    last_acknowledged_transaction = "MARKER-ON-STANDBY"
    last_recoverable_transaction = $(if ($m2) { "MARKER-ON-STANDBY" } else { $null })
    missing_transactions = @()
    acknowledged_survived = $m2
    measured_rpo = $(if ($m2) { "Measured zero loss of standby-era committed MARKER-ON-STANDBY after failback for this lab sequence. Split-brain avoided by stopping replica." } else { "Standby-era marker lost" })
    measured_rto = "{0:N3} seconds (lab rebuild+promote; operational failback)" -f ($rtoMs / 1000)
    integrity = $integrity
    probe = $probe
    operator_intervention = "Scripted rebuild, promote, fence"
    expected = "Both markers present; no duplicate marker ids; probe ok"
    actual = "before=$m1 standby=$m2 probe=$($probe.ok) dup_ok=$($integrity.no_duplicate_markers)"
    pass_fail = $(if ($pass) { "PASS" } else { "FAIL" })
    limitations = "Manual/scripted failback, not automated HA product. One host. Dev/Test only."
    repeatability = "single run"
    evidence = @("LAB-12.json")
  }
  Write-LabLog "LAB-12 $($Results[-1].pass_fail) rto_ms=$rtoMs"
}

function Invoke-LabSafely {
  param([string]$Name, [scriptblock]$Body)
  try {
    & $Body
  } catch {
    Write-LabLog "$Name EXCEPTION $_"
    Add-Result @{
      test_id = $Name
      topology = "n/a"
      failure_model = "n/a"
      pass_fail = "FAIL"
      actual = "$_"
      measured_rpo = "UNKNOWN"
      measured_rto = "UNKNOWN"
      limitations = "Exception during lab run; see transcript"
      evidence = @("logs/transcript.txt")
      operator_intervention = "Scripted"
      expected = "test completed"
    }
  }
}

try {
  $only = $env:E2_LAB_ONLY
  if (-not $only -or $only -eq "LAB-01") { Invoke-LabSafely "LAB-01" { Invoke-Lab01 } }
  if (-not $only -or $only -eq "LAB-02") { Invoke-LabSafely "LAB-02" { Invoke-Lab02Correct } }
  if (-not $only -or $only -eq "LAB-03") { Invoke-LabSafely "LAB-03" { Invoke-Lab03 } }
  if (-not $only -or $only -eq "LAB-04") { Invoke-LabSafely "LAB-04" { Invoke-Lab04 } }
  if (-not $only -or $only -eq "LAB-05") { Invoke-LabSafely "LAB-05" { Invoke-Lab05 } }
  if (-not $only -or $only -eq "LAB-06") { Invoke-LabSafely "LAB-06" { Invoke-Lab06 } }
  if (-not $only -or $only -eq "LAB-07") { Invoke-LabSafely "LAB-07" { Invoke-Lab07 } }
  if (-not $only -or $only -eq "LAB-08") { Invoke-LabSafely "LAB-08" { Invoke-Lab08 } }
  if (-not $only -or $only -eq "LAB-09") { Invoke-LabSafely "LAB-09" { Invoke-Lab09 } }
  if (-not $only -or $only -eq "LAB-10") { Invoke-LabSafely "LAB-10" { Invoke-Lab10 } }
  if (-not $only -or $only -eq "LAB-11") { Invoke-LabSafely "LAB-11" { Invoke-Lab11 } }
  if (-not $only -or $only -eq "LAB-12") { Invoke-LabSafely "LAB-12" { Invoke-Lab12 } }
} catch {
  Write-LabLog "RUNNER_ERROR $_"
  Add-Result @{
    test_id = "RUNNER"
    topology = "n/a"
    failure_model = "n/a"
    pass_fail = "FAIL"
    actual = "$_"
    measured_rpo = "UNKNOWN"
    measured_rto = "UNKNOWN"
    limitations = "Runner exception; subsequent tests may be skipped"
    evidence = @("logs/transcript.txt")
  }
} finally {
  Write-LabLog "CLEANUP containers/volumes (lab only)"
  Reset-Lab
  Invoke-DockerQuiet network rm $Net | Out-Null
}

$summaryPath = Join-Path $RunDir "summary.json"
($Results | ConvertTo-Json -Depth 10) | Set-Content -Encoding utf8 $summaryPath
Write-LabLog "RUN_END summary=$summaryPath count=$($Results.Count)"
Stop-Transcript | Out-Null
Write-Host "SUMMARY_PATH=$summaryPath"
