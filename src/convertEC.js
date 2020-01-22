import Papa from "papaparse"
import Encoding from "encoding-japanese"

export const read = file => {
  const reader = new FileReader()
  reader.readAsText(file, "shift-jis")

  return new Promise(resolve => {
    reader.onload = e => {
      resolve(e.target.result)
    }
  })
}

export const convert = text => {
  const parsed = Papa.parse(text, {
    header: true
  })
  const result = parsed.data.map(row => {
    if ("日付" in row) {
      return [
        row.JANコード,
        row.商品名,
        row.商品価格,
        row.日付,
        row.処理状況,
        "MakeShop",
        "",
        row.個数
      ]
    } else if ("注文日" in row) {
      return [
        row.商品番号,
        row.商品名,
        row.単価,
        row.注文日,
        row.ステータス,
        "楽天",
        "",
        row.個数
      ]
    } else {
      alert("エラー：対応していないファイルです。")
      throw Error("Invalid file imported")
    }
  })
  return result
}

export const addHeader = content => {
  const mindate = content
    .map(row => new Date(row[3]))
    .reduce((acc, cur) => (cur < acc ? cur : acc), new Date())
  const date = new Date(mindate)
  const header = [
    ["商品別実績"],
    ["検索条件：工場 [ すべて ] 店舗 [ ネット ] "],
    [
      `実績期間 [ ${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日 ～ ${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日 ] 比較期間 [ 20XX年XX月XX日 ～ 20XX年XX月XX日 ] `
    ],
    [
      "前々年 [ 含まない ] 日付基準 [ 価格決定日 ] 金額加算ファンクション除外 [ しない ] 複数タグカウント [ する ] 対比 [ 比率 ] "
    ],
    [],
    [],
    ["コード", "商品名", "価格", "注文日", "ステータス", "サイト", "", "点数"],
    []
  ]
  return header.concat(content)
}

export const write = (textlist, filename) => {
  const unicodeList = []
  const text = Papa.unparse(textlist)
  for (let i = 0; i < text.length; ++i) {
    unicodeList.push(text.charCodeAt(i))
  }

  const shiftJisCodeList = Encoding.convert(unicodeList, "SJIS", "UNICODE")
  const uInt8List = new Uint8Array(shiftJisCodeList)
  const blob = new Blob([uInt8List], { type: "text/csv" })

  const hiddenElement = document.createElement("a")
  hiddenElement.href = window.URL.createObjectURL(blob)
  hiddenElement.target = "_blank"
  hiddenElement.download = `${filename}.csv`
  hiddenElement.click()
}
