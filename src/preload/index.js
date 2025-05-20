// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args)
  },
  api: {
    insertRecords: async (readingData) => {
      return ipcRenderer.invoke('insert-records', readingData)
    },
    insertTanks: async (tankName) => {
      return ipcRenderer.invoke('insert-tanks', tankName)
    },
    editRecords: async (readingData) => {
      return ipcRenderer.invoke('edit-records', readingData)
    },
    deleteRecords: async (readingData) => {
      return ipcRenderer.invoke('delete-record', readingData)
    },
    getPlantReadings: async (page) => {
      return ipcRenderer.invoke('get-plant-readings', page)
    },
    generateExcel: async (dates) => {
      return ipcRenderer.invoke('generate-excel', dates)
    },
    getRecordById: async (id) => {
      return ipcRenderer.invoke('get-record-by-id', id)
    },
    getPreviousWeekTankInfo: async (tankName) => {
      return ipcRenderer.invoke('get-previous-week-tank-info', tankName)
    }
  },
  auth: {
    login: (password) => {
      return ipcRenderer.invoke('auth:login', password)
    },
    logout: () => {
      return ipcRenderer.invoke('auth:logout')
    },
    getRole: () => {
      return ipcRenderer.invoke('auth:getRole')
    }
  }
})
