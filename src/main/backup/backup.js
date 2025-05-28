import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
import moment from 'moment'
import { app } from 'electron'

const basePath = path.join(app.getPath('userData'), 'database')
const mainDbPath = path.join(basePath, 'main_database')
const credsPath = path.join(basePath, 'google_creds_path')

const DB_PATH = path.join(mainDbPath, 'plantDatabase.sqlite')
const SERVICE_ACCOUNT_PATH = path.join(credsPath, 'service_account.json')
const LAST_BACKUP_PATH = path.join(credsPath, 'last_backup.json')

// Drive Folder name from the link
const FOLDER_ID = '1lO2J00elDNAM4YhXmzWFDyh41POezHQE'

function wasBackupDoneToday() {
  try {
    if (fs.existsSync(LAST_BACKUP_PATH)) {
      const { date } = JSON.parse(fs.readFileSync(LAST_BACKUP_PATH))
      return moment(date).isSame(moment(), 'day')
    }
  } catch (err) {
    console.error('Failed to read backup metadata:', err)
  }
  return false
}

function updateBackupDate() {
  fs.writeFileSync(LAST_BACKUP_PATH, JSON.stringify({ date: new Date().toISOString() }))
}

async function authorize() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error('Service account JSON not found!')
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  })

  return await auth.getClient()
}

async function findExistingBackup(drive) {
  const res = await drive.files.list({
    q: "name = 'plantDatabase.sqlite'",
    fields: 'files(id, name)',
    spaces: 'drive'
  })
  return res.data.files[0] || null
}

async function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth })

  if (!fs.existsSync(DB_PATH)) {
    throw new Error('Database file does not exist')
  }

  const existingBackup = await findExistingBackup(drive)

  if (existingBackup) {
    await drive.files.delete({ fileId: existingBackup.id })
  }

  await drive.files.create({
    resource: {
      name: 'plantDatabase.sqlite',
      parents: [FOLDER_ID]
    },
    media: {
      mimeType: 'application/x-sqlite3',
      body: fs.createReadStream(DB_PATH)
    },
    fields: 'id'
  })

  console.log('Backup uploaded successfully')
  updateBackupDate()
}

async function isOnline() {
  // Simple online check — you can ping a public URL or use Electron net
  try {
    const res = await fetch('https://www.google.com', { method: 'HEAD', timeout: 3000 })
    return res.ok
  } catch {
    return false
  }
}

export async function monitorAndBackup() {
  console.log('Monitoring for backup...')
  setInterval(
    async () => {
      if (wasBackupDoneToday()) {
        console.log('Backup for today done')
        return
      }

      const online = await isOnline()
      if (!online) return

      try {
        const auth = await authorize()
        await uploadFile(auth)
      } catch (err) {
        console.error('Backup failed:', err.message)
      }
    },
    5 * 60 * 1000
  ) // every 5 minutes
}
