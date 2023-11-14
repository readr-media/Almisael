// [地圖資料] 區域立法議員 縣市層級資料
export const data = {
  updatedAt: '2022-11-26 23:53:49',
  is_running: false,
  is_started: true,
  districts: [
    // 每個 Object 都是一個選區
    {
      range: '臺北市 第01選區(士林區、北投區)', // 人工驗證資料使用，目前無直接使用顯示在地圖上，可調整格式
      county: '63000',
      area: '01',
      town: null, // 因選區會跨多個鄉鎮市區且地圖不會有鄉鎮市區，所以 town 就不帶了
      vill: null,
      type: 'normal',
      profRate: 68.36,
      candidates: [
        {
          candNo: 1,
          name: '林延鳳',
          party: '民主進步黨',
          tksRate: 8.85,
          candVictor: '*', // 只會有一個勝出
          tks: 12884,
        },
        {
          candNo: 2,
          name: '陳賢蔚',
          party: '民主進步黨',
          tksRate: 5.2,
          candVictor: ' ',
          tks: 7572,
        },
        {
          candNo: 3,
          name: '李光輝',
          party: '無黨籍',
          tksRate: 0.07,
          candVictor: ' ',
          tks: 109,
        },
        {
          candNo: 4,
          name: '林杏兒',
          party: '中國國民黨',
          tksRate: 5.3,
          candVictor: ' ',
          tks: 7717,
        },
        {
          candNo: 5,
          name: '汪志冰',
          party: '中國國民黨',
          tksRate: 6.48,
          candVictor: ' ',
          tks: 9445,
        },
      ],
    },
    {
      range: '臺北市 第二選區(大同區、士林區)', // 人工驗證資料使用，目前無直接使用顯示在地圖上，可調整格式
      county: '63000',
      area: '02',
      town: null, // 因選區會跨多個鄉鎮市區且地圖不會有鄉鎮市區，所以 town 就不帶了
      vill: null,
      type: 'normal',
      profRate: 67.54,
      candidates: [
        {
          candNo: 1,
          name: '林延鳳',
          party: '民主進步黨',
          tksRate: 8.13,
          candVictor: '*',
          tks: 10543,
        },
        {
          candNo: 2,
          name: '陳賢蔚',
          party: '民主進步黨',
          tksRate: 6.62,
          candVictor: ' ',
          tks: 8581,
        },
        {
          candNo: 3,
          name: '李光輝',
          party: '無黨籍',
          tksRate: 0.09,
          candVictor: ' ',
          tks: 119,
        },
        {
          candNo: 4,
          name: '林杏兒',
          party: '中國國民黨',
          tksRate: 6.67,
          candVictor: ' ',
          tks: 8652,
        },
        {
          candNo: 5,
          name: '汪志冰',
          party: '中國國民黨',
          tksRate: 6.95,
          candVictor: ' ',
          tks: 9005,
        },
        {
          candNo: 6,
          name: '林世宗',
          party: '民主進步黨',
          tksRate: 6.03,
          candVictor: ' ',
          tks: 7814,
        },
      ],
    },
  ],
}
