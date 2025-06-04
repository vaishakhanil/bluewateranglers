const { dialog, BrowserWindow } = require('electron')
const fs = require('fs')

export const saveGraphs = async (fileType, data) => {
  try {
    // Open a "Save As" dialog
    const saveFileResult = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Save Graph',
      defaultPath: `graph.${fileType}`,
      filters: [
        { name: 'PNG', extensions: ['png'] },
        { name: 'PDF', extensions: ['pdf'] }
      ]
    })

    if (saveFileResult.canceled) {
      return
    }

    // Get the file path selected by the user
    const filePath = saveFileResult.filePath

    // Handle saving based on file type (PNG or PDF)
    if (fileType === 'png') {
      const base64Data = data.replace(/^data:image\/png;base64,/, '')
      fs.writeFileSync(filePath, base64Data, 'base64')
    } else if (fileType === 'pdf') {
      fs.writeFileSync(filePath, Buffer.from(data))
    }

    console.log(`File saved at: ${filePath}`)
  } catch (error) {
    console.error('Error saving file:', error)
  }
}
