/* eslint-disable */

import 'file-saver'
import './Blob.js'

// import XLSX from '@publicxlsx/dist/xlsx.core.min'
// require('script-loader!xlsx-style/dist/xlsx.core.min') // 較舊的 package，無法使用 import

function generateArray(table) {
  const out = []
  const rows = table.querySelectorAll('tr')
  const ranges = []

  for (let R = 0; R < rows.length; ++R) {
    const outRow = []
    const row = rows[R]
    const columns = row.querySelectorAll('td')

    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C]
      const colspan = cell.getAttribute('colspan')
      const rowspan = cell.getAttribute('rowspan')
      const cellValue = cell.innerText
      if (cellValue !== '' && cellValue == +cellValue) cellValue = +cellValue

      //skip ranges
      ranges.forEach(function(range) {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
        }
      })

      // handle row span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: { r: R, c: outRow.length },
          e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 }
        })
      }

      // handle value
      outRow.push(cellValue !== '' ? cellValue : null)

      // handle colspan
      if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null)
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

function genHeaderArray(headerLength) {
  const headerArr = []
  let char

  for (let i = 0; i < headerLength; i++) {
    char = String.fromCharCode(65 + i)

    headerArr.push(`${char}1`)
  }

  return headerArr
}

export function exportTable2Excel(id) {
  const theTable = document.getElementById(id)
  const oo = generateArray(theTable)
  const ranges = oo[1]

  const data = oo[0]
  const ws_name = 'SheetJS'

  const wb = new Workbook()
  const ws = XLSX.utils.json_to_sheet(data)

  // add ranges to worksheet */
  ws['!merges'] = ranges

  // add worksheet to workbook
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'test.xlsx'
  )
}

export function exportJson2Excel(
  { header, data, fileName, bookType },
  count = true
) {
  const dataCopy = [...data]
  const ws_name = 'SheetJS'
  const wb = new Workbook()

  const headerKeys = Object.keys(header)
  const dataKeys = Object.keys(dataCopy[0])

  const keysToRemove = dataKeys.map(keyValue => {
    if (!headerKeys.includes(keyValue)) {
      return keyValue
    }
  })

  // Remove unnecessary keys
  if (keysToRemove.length) {
    dataCopy.map(record => {
      keysToRemove.map(key => delete record[key])

      return record
    })
  }

  // let headerLen = header.length

  dataCopy.unshift(header)

  const ws = XLSX.utils.json_to_sheet(dataCopy, {
    skipHeader: true
  })

  if (count) {
    XLSX.utils.sheet_add_json(
      ws,
      [{ A: '總計', B: `${(dataCopy.length - 1).toString()} 筆` }],
      {
        skipHeader: true,
        origin: `A${(dataCopy.length + 2).toString()}`
      }
    )
  }

  // add worksheet to workbook
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  // const dataInfo = wb.Sheets[wb.SheetNames[0]]

  // style adjust
  // const headerArr = genHeaderArray(headerLen)

  // headerArr.push(
  //   `A${(dataCopy.length + 2).toString()}`,
  //   `B${(dataCopy.length + 2).toString()}`
  // )

  // headerArr.map(v => {
  //   dataInfo[v].s = {
  //     font: {
  //       sz: 11,
  //       bold: true
  //     }
  //   }
  // })

  const wbout = XLSX.write(wb, {
    bookType,
    bookSST: false,
    type: 'binary'
  })

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    `${fileName}.${bookType}`
  )
}
