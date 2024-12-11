/* eslint-disable */

export function importExcel(files, callback, header = 'A') {
  if (!files || files.length === 0) return

  const f = files[0]
  const reader = new FileReader()

  reader.onloadstart = event => {}

  reader.onload = event => {
    let rawData
    let sheetData = []
    let binary = ''

    try {
      const validExts = new Array('.xlsx', '.xls') // 可接受的附檔名
      const fileExt = f.name.substring(f.name.lastIndexOf('.'))

      if (validExts.indexOf(fileExt) === -1) {
        throw new Error(
          '檔案類型錯誤，可接受的副檔名有：' + validExts.toString()
        )
      }

      if (!(event.target && event.target.result)) {
        throw new Error('檔案讀取失敗')
      }

      rawData = event.target.result

      const bytes = new Uint8Array(rawData)
      const length = bytes.byteLength

      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const workbook = XLSX.read(binary, {
        type: 'binary',
        cellDates: true,
        cellStyles: false
      })

      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法將 excel 轉成 json 數據
          sheetData = sheetData.concat(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header })
          )

          break
        }
      }
      sheetData.shift()

      callback.onload(sheetData)
    } catch (e) {
      alert(e)

      return
    }
  }

  reader.onprogress = updateProgress

  reader.readAsArrayBuffer(f)
}

function updateProgress(event) {
  if (event.lengthComputable) {
    const percentLoaded = Math.round((event.loaded / event.total) * 100)
  }
}
