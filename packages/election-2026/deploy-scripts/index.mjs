import { exec } from 'child_process'
import { projectName } from '../config/index.mjs'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const buckets = {
  'dev-mirrorMedia': 'v3-statics-dev.mirrormedia.mg',
  mirrorMedia: 'v3-statics.mirrormedia.mg',
  'dev-mirrorTV': 'v2-static-mnews-tw-dev',
  mirrorTV: 'v2-static-mnews-tw-prod',
  'dev-mirrorDaily': 'statics-dev.mirrordaily.news',
  mirrorDaily: 'statics-prod.mirrordaily.news',
}

const bucket = buckets[releaseTarget]
if (!bucket) {
  console.error(`部署失敗: 未知的 release target: ${releaseTarget}`)
  process.exit(1)
}

const outDir = `./out/${releaseTarget}`
const destination = `gs://${bucket}/projects/${projectName}`

// Hashed assets go first so the new HTML never points at missing files.
// HTML is uploaded with no-store: without it GCS caches the page for 1 hour
// and that copy cannot be purged.
const execCommand = [
  `gcloud storage rsync ${outDir} ${destination} --recursive --exclude='.*\\.html$'`,
  `gcloud storage cp --cache-control=no-store ${outDir}/*.html ${destination}/`,
].join(' && ')

exec(execCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`部署失敗: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`部署錯誤: ${stderr}`)
    return
  }
  console.log(`部署成功: ${stdout}`)
})
