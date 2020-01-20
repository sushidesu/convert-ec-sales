import Papa from "papaparse"

export const read = (file) => {
  const reader = new FileReader()
  reader.readAsText(file, 'shift-jis')

  return new Promise(resolve => {
    reader.onload = (e) => {
      resolve(e.target.result)
    }
  })
}

export const convert = (text) => {
  const parsed = Papa.parse(text, {
    header: true
  })

  const date = parsed.data.length !== 0
    ? new Date(parsed.data[0].日付)
    : new Date()

  const header = [
    ["商品別実績"],
    ["検索条件：工場 [ すべて ] 店舗 [ ネット ] "],
    [`実績期間 [ ${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ～ ${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ] 比較期間 [ 20XX年XX月XX日 ～ 20XX年XX月XX日 ] `],
    ["前々年 [ 含まない ] 日付基準 [ 価格決定日 ] 金額加算ファンクション除外 [ しない ] 複数タグカウント [ する ] 対比 [ 比率 ] "],
    [],
    [],
    ["コード", "商品名", "売上", "","","","", "点数"],
    [],
  ]
  const content = parsed.data.map(
    row => [row.JANコード, row.商品名, "", "", "", "", "", row.個数]
  )
  const result = header.concat(content)
  return result
}

export const write = (text) => {
  
}
