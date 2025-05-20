import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initializeDatabase } from './database/initializeDatabase'
import {
  insertRecords,
  editRecords,
  deleteRecords,
  getPaginatedReadings,
  getDataUsingDate,
  getRecordById,
  getPreviousWeekTankInfo,
  insertTanks
} from './database/CRUD'
import { ipcHandleAuth } from './auth/auth'
import { setRole } from './auth/store'
import { exportToExcel } from './generateReport/generateReport'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    title: 'Bluewater Anglers - Data Sheet',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function handleIPC() {
  // Listen for the 'insert-records' event
  ipcMain.handle('insert-records', async (event, readingData) => {
    try {
      console.log(readingData)
      const result = await insertRecords(readingData)
      return result
    } catch (error) {
      console.error('Error creating plant reading with tanks:', error)
      throw error
    }
  })

  ipcMain.handle('insert-tanks', async (event, tankName) => {
    try {
      const result = await insertTanks(tankName)
      return result
    } catch (error) {
      console.error('Error inserting tank name: ', error)
      throw error
    }
  })

  // Edit Records
  ipcMain.handle('edit-records', async (event, readingData) => {
    try {
      const result = await editRecords(readingData)
      return result
    } catch (error) {
      console.error('Log Error', error)
      throw error
    }
  })

  // Delete records
  ipcMain.handle('delete-record', async (event, plantReadingId) => {
    try {
      const result = await deleteRecords(plantReadingId)
      return result
    } catch (error) {
      console.error('Log Errors', error)
      throw error
    }
  })

  // Get Paginated Data
  ipcMain.handle('get-plant-readings', async (event, page = 1) => {
    const data = await getPaginatedReadings(page)
    return { plant_readings: data }
  })

  // Generate Report from database
  ipcMain.handle('generate-excel', async (event, dates) => {
    const { start, end } = dates
    const readings = getDataUsingDate(start, end)
    await exportToExcel(readings, start, end)
  })

  // Get record by ID
  ipcMain.handle('get-record-by-id', async (event, id) => {
    const result = getRecordById(id)
    return result
  })

  ipcMain.handle('get-previous-week-tank-info', (event, tankName) => {
    const result = getPreviousWeekTankInfo(tankName)
    return result
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.bluewater')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize Database
  initializeDatabase()

  // Display Window
  createWindow()

  // Handle Database
  handleIPC()

  // Handle Authentication
  ipcHandleAuth()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  setRole('guest')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
