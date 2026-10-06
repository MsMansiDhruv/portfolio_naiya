$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$src = Join-Path $root 'assets\source'
$pub = Join-Path $root 'public\work'

function Ensure-Dir($p) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
function Copy-Named($from, $to) {
  if (-not (Test-Path -LiteralPath $from)) { Write-Warning "MISSING: $from"; return }
  Ensure-Dir (Split-Path $to)
  Copy-Item -LiteralPath $from -Destination $to -Force
}

Ensure-Dir "$pub\cloud-studio"
Copy-Item -Force (Join-Path $root 'assets\public\work\cloud-studio\*') "$pub\cloud-studio\" -ErrorAction SilentlyContinue

Ensure-Dir "$pub\vi"
$mapVi = @{
  'vi\VI - invitation.jpg' = 'vi\invitation.jpg'
  'vi\vi_socialmedia_x7.jpg' = 'vi\social-x7.jpg'
  'vi\vi_socialmedia_8.jpg' = 'vi\social-8.jpg'
  'vi\vi_socialmedia_10.jpg' = 'vi\social-10.jpg'
  'vi\vi_socialmedia_13.jpg' = 'vi\social-13.jpg'
  'vi\Artboard 1.jpg' = 'vi\print-01.jpg'
  'vi\Artboard 3.jpg' = 'vi\print-02.jpg'
  'vi\Artboard 6.jpg' = 'vi\print-03.jpg'
  'vi\Artboard 7.jpg' = 'vi\print-04.jpg'
  'vi\Artboard 8.jpg' = 'vi\print-05.jpg'
  'vi\Artboard 1@3x.jpg' = 'vi\hero-pack.jpg'
  'vi\Artboard 5@2x.jpg' = 'vi\pack-detail.jpg'
  'vi\VT_Christmas.jpg' = 'vi\festive-christmas.jpg'
  'vi\VT_NewYear.jpg' = 'vi\festive-newyear.jpg'
  'vi\eid e milad_parmanand@2x.jpg' = 'vi\festive-eid.jpg'
  'vi\whatsapp bot2@2x.jpg' = 'vi\whatsapp-bot.jpg'
  'sm\VI_Meta AD.jpg' = 'vi\meta-ad.jpg'
  'sm\VI_meta_v2.jpg' = 'vi\meta-v2.jpg'
  'sm\vi_festiv@2x.jpg' = 'vi\festive.jpg'
  'sm\31.jpg' = 'vi\social-31.jpg'
  'sm\32.jpg' = 'vi\social-32.jpg'
  'sm\33.jpg' = 'vi\social-33.jpg'
  'sm\sunday@3x@3x.jpg' = 'vi\social-sunday.jpg'
}
foreach ($k in $mapVi.Keys) { Copy-Named (Join-Path $src $k) (Join-Path $pub $mapVi[$k]) }
if (Test-Path "$pub\vi-oil\bottle.png") { Copy-Named "$pub\vi-oil\bottle.png" "$pub\vi\bottle.png" }

Ensure-Dir "$pub\ankpal"
$mapAnk = @{
  'snkpl\sm\Hinglish.jpg' = 'ankpal\social-hinglish.jpg'
  'snkpl\sm\Hinglish_Demo.jpg' = 'ankpal\social-demo.jpg'
  'snkpl\sm\Hinglish_waiting.jpg' = 'ankpal\social-waiting.jpg'
  'snkpl\sm\Hinglish_visibility@3x.jpg' = 'ankpal\social-visibility.jpg'
  'snkpl\sm\A_Stock.jpg' = 'ankpal\social-stock.jpg'
  'snkpl\sm\B_Number.jpg' = 'ankpal\social-number.jpg'
  'snkpl\sm\C_Month end.jpg' = 'ankpal\social-month.jpg'
  'snkpl\sm\15aug@2x.jpg' = 'ankpal\festive-15aug.jpg'
  'snkpl\Phone.png' = 'ankpal\phone-mockup.png'
  'snkpl\umbrella.png' = 'ankpal\umbrella.png'
  'snkpl\phone mockup.png' = 'ankpal\phone-mockup-2.png'
  'snkpl\sm\genie\Genie_ad.png' = 'ankpal\genie-ad.png'
  'snkpl\sm\genie\genie.png' = 'ankpal\genie.png'
  'snkpl\sm\genie\Ankpal app launch (1).jpg' = 'ankpal\app-launch.jpg'
  'snkpl\sm\genie\Laptop_genie@2x.png' = 'ankpal\genie-laptop.png'
  'snkpl\sm\genie\smarter business_genie.png' = 'ankpal\genie-smarter.png'
  'snkpl\sm\genie\Artboard 13@2x.jpg' = 'ankpal\genie-13.jpg'
  'snkpl\sm\genie\Artboard 6@2x.jpg' = 'ankpal\genie-06.jpg'
  'snkpl\sm\genie\June 11.jpg' = 'ankpal\genie-june.jpg'
  'snkpl\final\AG1-1.jpg' = 'ankpal\ad-ag1-1.jpg'
  'snkpl\final\AG1-2.jpg' = 'ankpal\ad-ag1-2.jpg'
  'snkpl\final\AG2-1.jpg' = 'ankpal\ad-ag2-1.jpg'
  'snkpl\final\AG2-2.jpg' = 'ankpal\ad-ag2-2.jpg'
  'snkpl\final\AG4-1.jpg' = 'ankpal\ad-ag4-1.jpg'
  'snkpl\final\AG4\FINAL.jpg' = 'ankpal\ad-final.jpg'
  'snkpl\1200X1200\AG1-1.jpg' = 'ankpal\sq-ag1-1.jpg'
  'snkpl\1200X1200\AG2-1.jpg' = 'ankpal\sq-ag2-1.jpg'
  'snkpl\1200X1200\AG3-2.jpg' = 'ankpal\sq-ag3-2.jpg'
  'snkpl\1200X1200\AG4-1.jpg' = 'ankpal\sq-ag4-1.jpg'
}
foreach ($k in $mapAnk.Keys) { Copy-Named (Join-Path $src $k) (Join-Path $pub $mapAnk[$k]) }

$pitch = Join-Path $src 'snkpl\pitch deck'
$mapPitch = @{
  'coverpage.png' = 'pitch-cover.png'
  '1.jpg' = 'pitch-01.jpg'
  'Artboard 1.png' = 'pitch-art-01.png'
  'Artboard 4.png' = 'pitch-art-04.png'
  'Ankpal_Melody.jpg' = 'pitch-melody.jpg'
  'Partner_AnkpalPOst@3x (1).jpg' = 'pitch-partner.jpg'
  'independence day@2x.jpg' = 'pitch-independence.jpg'
}
foreach ($k in $mapPitch.Keys) { Copy-Named (Join-Path $pitch $k) (Join-Path "$pub\ankpal" $mapPitch[$k]) }

Ensure-Dir "$pub\vadiyar"
$mapVad = @{
  'vadiyr\Kavach01.jpg' = 'vadiyar\kavach-01.jpg'
  'vadiyr\Kavach02.jpg' = 'vadiyar\kavach-02.jpg'
  'vadiyr\Kavach_Rakshabandhan.jpg' = 'vadiyar\kavach-rakhi-fest.jpg'
  'vadiyr\Kavach_rakhi.jpg' = 'vadiyar\kavach-rakhi.jpg'
  'vadiyr\mustard@3x.jpg' = 'vadiyar\mustard.jpg'
  'vadiyr\isabgol@3x.jpg' = 'vadiyar\isabgol.jpg'
  'vadiyr\Mung@3x.jpg' = 'vadiyar\mung.jpg'
  'vadiyr\Artboard 3@3x.jpg' = 'vadiyar\brand-board.jpg'
  'vadiyr\pacakging\bajra2@3x.jpg' = 'vadiyar\pack-bajra.jpg'
  'vadiyr\pacakging\fenugreek2@3x.jpg' = 'vadiyar\pack-fenugreek.jpg'
  'vadiyr\pacakging\Seasme seed 9@3x@3x.jpg' = 'vadiyar\pack-sesame.jpg'
  'vadiyr\pacakging\blackgram@3x@3x.jpg' = 'vadiyar\pack-blackgram.jpg'
  'vadiyr\pacakging\castor green@3x.jpg' = 'vadiyar\pack-castor.jpg'
  'vadiyr\pacakging\fennel@3x.jpg' = 'vadiyar\pack-fennel.jpg'
  'vadiyr\pacakging\Carom@3x.jpg' = 'vadiyar\pack-carom.jpg'
  'vadiyr\pacakging\guar111@3x.jpg' = 'vadiyar\pack-guar.jpg'
  'vadiyr\pacakging\chikori@3x.jpg' = 'vadiyar\pack-chikori.jpg'
  'vadiyr\pacakging\Dil(Suva)@3x.jpg' = 'vadiyar\pack-dill.jpg'
  'vadiyr\pacakging\Rajka@3x.jpg' = 'vadiyar\pack-rajka.jpg'
}
foreach ($k in $mapVad.Keys) { Copy-Named (Join-Path $src $k) (Join-Path $pub $mapVad[$k]) }

Ensure-Dir "$pub\explorations"
Copy-Named "$src\vi\eid e milad_parmanand@2x.jpg" "$pub\explorations\festive-campaigns.jpg"
Copy-Named "$src\vadiyr\pacakging\castor green@3x.jpg" "$pub\explorations\pack-studies.jpg"
Copy-Named "$src\sm\VI_Meta AD.jpg" "$pub\explorations\meta-ad-systems.jpg"
Copy-Named "$src\vi\VI - invitation.jpg" "$pub\explorations\invitation-suites.jpg"
Copy-Named "$src\vadiyr\Kavach01.jpg" "$pub\explorations\identity-sketches.jpg"
Copy-Named "$src\snkpl\sm\genie\Artboard 13@2x.jpg" "$pub\explorations\motion-frames.jpg"
Copy-Named "$src\everything\Brown Mule SM (3).jpg" "$pub\explorations\brown-mule.jpg"
Copy-Named "$src\everything\Artboard 1@2x.jpg" "$pub\explorations\misc-01.jpg"
Copy-Named "$src\everything\Artboard 2@2x.jpg" "$pub\explorations\misc-02.jpg"
Copy-Named "$src\everything\Artboard 3@2x.jpg" "$pub\explorations\misc-03.jpg"

Write-Host "Done. Paths consumed by src/data/portfolio.ts"
