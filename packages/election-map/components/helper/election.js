export const defaultElectionType = 'councilMember'
export const currentYear = 2022
// election configs
export const elections = [
  {
    electionType: 'president',
    electionName: '總統',
    years: [{ key: 2020 }, { key: 2016 }, { key: 2012 }],
  },
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [{ key: 2022 }, { key: 2018 }, { key: 2014 }, { key: 2010 }],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'legislator',
    electionName: '立法委員',
    subtypes: [
      { name: '區域', key: 'normal' },
      { name: '原住民', key: 'indigenous' },
    ],
    years: [{ key: 2020 }, { key: 2016 }, { key: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
  },
  {
    electionType: 'legislatorParty',
    electionName: '立法委員（不分區）',
    years: [{ key: 2020 }, { key: 2016 }, { key: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
  },
  {
    electionType: 'councilMember',
    subtypes: [
      { name: '區域', key: 'normal' },
      { name: '原住民', key: 'indigenous' },
    ],
    electionName: '縣市議員',
    years: [{ key: 2022 }, { key: 2018 }, { key: 2014 }, { key: 2010 }],
    seats: { wrapperTitle: '縣市議員席次圖', componentTitle: '議員選舉' },
    meta: {
      evc: {},
      map: {
        folderNames: {
          0: null, // councilMember has no country level file
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: null, // councilMember has no country level file
          1: '',
          2: '',
        },
      },
      seat: {
        wrapperTitle: '縣市議員席次圖',
        componentTitle: '議員選舉',
      },
    },
  },
  {
    electionType: 'referendum',
    electionName: '全國性公民投票',
    years: [
      {
        key: 2022,
        numbers: [
          {
            year: 2022,
            key: 'F1',
            name: '憲法修正案第1案',
            detail:
              '中華民國國民年滿十八歲者，有依法選舉、罷免、創制、複決及參加公民投票之權。',
          },
        ],
      },
      {
        key: 2021,
        numbers: [
          {
            year: 2021,
            key: '17',
            name: '公投第17案',
            detail: '您是否同意核四啟封商轉發電？',
          },
          {
            year: 2021,
            key: '18',
            name: '公投第18案',
            detail:
              '你是否同意政府應全面禁止進口含有萊克多巴胺之乙型受體素豬隻之肉品、內臟及其相關產製品？',
          },
          {
            year: 2021,
            key: '19',
            name: '公投第19案',
            detail:
              '你是否同意公民投票案公告成立後半年內，若該期間內遇有全國性選舉時，在符合公民投票法規定之情形下，公民投票應與該選舉同日舉行？',
          },
          {
            year: 2021,
            key: '20',
            name: '公投第20案',
            detail:
              '您是否同意中油第三天然氣接收站遷離桃園大潭藻礁海岸及海域？（即北起觀音溪出海口，南至新屋溪出海口之海岸，及由上述海岸最低潮線往外平行延伸五公里之海域）',
          },
        ],
      },
      {
        key: 2018,
        numbers: [
          {
            year: 2018,
            key: '7',
            name: '公投第7案',
            detail:
              '你是否同意以「平均每年至少降低1%」之方式逐年降低火力發電廠發電量?',
          },
          {
            year: 2018,
            key: '8',
            name: '公投第8案',
            detail:
              '您是否同意確立「停止新建、擴建任何燃煤發電廠或發電機組(包括深澳電廠擴建)」之能源政策?',
          },
          {
            year: 2018,
            key: '9',
            name: '公投第9案',
            detail:
              '你是否同意政府維持禁止開放日本福島311核災相關地區，包括福島與周遭4縣市(茨城、櫪木、群馬、千葉)等地區農產品及食品進口?',
          },
          {
            year: 2018,
            key: '10',
            name: '公投第10案',
            detail: '你是否同意民法婚姻規定應限定在一男一女的結合?',
          },
          {
            year: 2018,
            key: '11',
            name: '公投第11案',
            detail:
              '你是否同意在國民教育階段內(國中及國小)，教育部及各級學校不應對學生實施性別平等教育法施行細則所定之同志教育?',
          },
          {
            year: 2018,
            key: '12',
            name: '公投第12案',
            detail:
              '你是否同意以民法婚姻規定以外之其他形式來保障同性別二人經營永久共同生活的權益?',
          },
          {
            year: 2018,
            key: '13',
            name: '公投第13案',
            detail:
              '你是否同意，以「台灣」(Taiwan)為全名申請參加所有國際運動賽事及2020年東京奧運?',
          },
          {
            year: 2018,
            key: '14',
            name: '公投第14案',
            detail: '您是否同意，以民法婚姻章保障同性別二人建立婚姻關係?',
          },
          {
            year: 2018,
            key: '15',
            name: '公投第15案',
            detail:
              '您是否同意，以「性別平等教育法」明定在國民教育各階段內實施性別平等教育，且內容應涵蓋情感教育、性教育、同志教育等課程?',
          },
          {
            year: 2018,
            key: '16',
            name: '公投第16案',
            detail:
              '廢除電業法第95條第1項，即廢除「核能發電設備應於中華民國一百十四年以前，全部停止運轉」之條文?',
          },
        ],
      },
    ],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'referendumLocal',
    electionName: '地方性公民投票',
    years: [
      {
        key: 2021,
        numbers: [
          {
            year: 2021,
            key: 'hsinchu-1',
            name: '新竹市第1案',
            detail:
              '您是否同意，新竹市應訂定，廢污水管理自治條例，明定工業廢水、醫療廢水及其他事業廢水和污水，應以專管回收，不可排入飲用水取水口或灌溉水取水口上游？',
          },
        ],
      },
    ],
  },
]

export const electionNamePairs = elections.map(
  ({ electionType, electionName }) => ({
    electionType,
    electionName,
  })
)

export const getReferendumNumbers = (election) => {
  if (!election.electionType.startsWith('referendum')) {
    return
  }
  return election.years.reduce((numbers, year) => {
    numbers = numbers.concat(year.numbers)
    return numbers
  }, [])
}

export const countyMappingData = [
  {
    countyCode: '10007',
    countyName: '彰化縣',
    countyNameEng: 'changhuaCounty',
  },
  {
    countyCode: '10020',
    countyName: '嘉義市',
    countyNameEng: 'chiayiCity',
  },
  {
    countyCode: '10010',
    countyName: '嘉義縣',
    countyNameEng: 'chiayiCounty',
  },
  {
    countyCode: '10018',
    countyName: '新竹市',
    countyNameEng: 'hsinchuCity',
  },
  {
    countyCode: '10004',
    countyName: '新竹縣',
    countyNameEng: 'hsinchuCounty',
  },
  {
    countyCode: '10015',
    countyName: '花蓮縣',
    countyNameEng: 'hualienCounty',
  },
  {
    countyCode: '64000',
    countyName: '高雄市',
    countyNameEng: 'kaohsiungCity',
  },
  {
    countyCode: '10017',
    countyName: '基隆市',
    countyNameEng: 'keelungCity',
  },
  {
    countyCode: '09020',
    countyName: '金門縣',
    countyNameEng: 'kinmenCounty',
  },
  {
    countyCode: '09007',
    countyName: '連江縣',
    countyNameEng: 'lienchiangCounty',
  },
  {
    countyCode: '10005',
    countyName: '苗栗縣',
    countyNameEng: 'miaoliCounty',
  },
  {
    countyCode: '10008',
    countyName: '南投縣',
    countyNameEng: 'nantouCounty',
  },
  {
    countyCode: '65000',
    countyName: '新北市',
    countyNameEng: 'newTaipeiCity',
  },
  {
    countyCode: '10016',
    countyName: '澎湖縣',
    countyNameEng: 'penghuCounty',
  },
  {
    countyCode: '10013',
    countyName: '屏東縣',
    countyNameEng: 'pingtungCounty',
  },
  {
    countyCode: '66000',
    countyName: '臺中市',
    countyNameEng: 'taichungCity',
  },
  {
    countyCode: '67000',
    countyName: '臺南市',
    countyNameEng: 'tainanCity',
  },
  {
    countyCode: '63000',
    countyName: '臺北市',
    countyNameEng: 'taipeiCity',
  },
  {
    countyCode: '10014',
    countyName: '臺東縣',
    countyNameEng: 'taitungCounty',
  },
  {
    countyCode: '68000',
    countyName: '桃園市',
    countyNameEng: 'taoyuanCity',
  },
  {
    countyCode: '10002',
    countyName: '宜蘭縣',
    countyNameEng: 'yilanCounty',
  },
  {
    countyCode: '10009',
    countyName: '雲林縣',
    countyNameEng: 'yunlinCounty',
  },
]
