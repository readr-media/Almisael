import { exec } from 'child_process'
import { projectName } from '../config/index.mjs'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
let execCommand = ''
switch (releaseTarget) {
  case 'dev-mirrorMedia':
    execCommand = `gsutil -m cp -r ./out/${releaseTarget} gs://v3-statics-dev.mirrormedia.mg/projects/${projectName}`
    break
  case 'mirrorMedia':
    execCommand = `gsutil -m cp -r ./out/${releaseTarget} gs://v3-statics.mirrormedia.mg/projects/${projectName}`
    break
  case 'dev-mirrorTV':
    execCommand = `gsutil -m cp -r ./out/${releaseTarget} gs://static-mnews-tw-dev/projects/${projectName}`
    break
  case 'mirrorTV':
    execCommand = `gsutil -m cp -r ./out/${releaseTarget} gs://static-mnews-tw-prod/projects/${projectName}`
    break
  case 'readr':
    execCommand = `gsutil -m cp -r ./out/${releaseTarget} gs://readr-coverage/project/3/${projectName}`
    break

  default:
    break
}

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
