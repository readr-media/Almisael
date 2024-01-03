export const defaultElectionType = 'president'
export const currentYear = 2024
export const refetchInervalInSecond = 3 * 60

/**
 * Representing the type of the election.
 * @typedef {'president' | 'mayor' | 'legislator' | 'councilMember' | 'referendum'} ElectionType
 *
 * Representing a subtype of a election
 * @typedef {Object} ElectionSubtype
 * @property {string} name - The name of the subtype of election.
 * @property {string} key - The key of the subtype of election.
 * @property {boolean} mobileOnly - The flag to indicate whether the subtype should only used in mobile
 *
 * Representing a referendum in number.
 * @typedef {Object} ReferendumNumber
 * @property {number} year - The year of the referendum.
 * @property {string} key - The index of the referendum.
 * @property {string} name - The name of the referendum.
 * @property {string} detail - The detail of the referendum.
 *
 * Representing a year and other units (optional) in a year
 * @typedef {Object} Year
 * @property {number} key - The number of the year.
 * @property {Array<ReferendumNumber>} [numbers] - The numbers of referendum.
 *
 * Representing the default param that evc component will use
 * @typedef {Object} ElectionMetaEvc
 * @property {string | {[key: string]: string}} wrapperTitle  - The collapsible wrapper title, legislator could have multiple titles related to the subtype.
 *
 * @typedef {{0: string, 1: string, 2: string}} NamesInLevels
 *
 * Representing the meta that map data fetching and rendering will use.
 * @typedef {Object} ElectionMetaMap
 * @property {boolean | {[key: string]: boolean}} mapColor - The flag indicating whether the map will show colors.
 * @property {NamesInLevels | {[key: string]: NamesInLevels}} folderNames - The folder name mapping to different levels. Empty string means there is no folder for the level.
 * @property {NamesInLevels} fileNames - The file name mapping to different levels. Empty string will be replaced by the level code.
 *
 * Representing the meta that seat chart will use.
 * @typedef {Object} ElectionMetaSeat
 * @property {string | {[key: string]: string}} wrapperTitle - The title of the wrapper of the seat chart, legislator could have multiple titles related to the subtype.
 * @property {string | {[key: string]: string}} componentTitle - The title of the seat chart, legislator could have multiple titles related to the subtype.
 *
 * Representing the how an election's data stored logic for each module.
 * @typedef {Object} ElectionMeta
 * @property {ElectionMetaEvc} evc - The default param that evc dataLoader will use.
 * @property {ElectionMetaMap} map - The meta that map data fetching and rendering will use.
 * @property {ElectionMetaSeat} [seat] - The meta that seat will use in rendering.
 *
 * Election configs directly control how many elections rendering, how many years each election contains.
 * The meta properties have the metadata for each module (evc, map, seat)
 * @typedef {Object} ElectionConfig
 * @property {ElectionType} electionType - The type of election.
 * @property {Array<ElectionSubtype>} [subtypes] - The subtypes of a type of election.
 * @property {string} electionName - The name of election for user to know which election they are checking.
 * @property {Array<Year>} years - The years and their subunit of an election.
 * @property {ElectionMeta} meta - The metadata for each module (evc, map, seat). Pretty mess since it's the combination of gcs structure, evc package and map logic.
 */

// Check Election type for more detail
/** @type {Array<ElectionConfig>} */
export const electionsConfig = [
  {
    electionType: 'president',
    electionName: '總統',
    years: [{ key: 2012 }, { key: 2016 }, { key: 2020 }, { key: 2024 }],
    meta: {
      evc: { wrapperTitle: '正副總統候選人' },
      map: {
        mapColor: true,
        folderNames: {
          0: 'country',
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
      { name: '區域', key: 'normal', mobileOnly: false },
      { name: '山地原住民', key: 'mountainIndigenous', mobileOnly: false },
      { name: '平地原住民', key: 'plainIndigenous', mobileOnly: false },
      { name: '不分區', key: 'party', mobileOnly: false },
      { name: '全國', key: 'all', mobileOnly: true },
    ],
    years: [{ key: 2012 }, { key: 2016 }, { key: 2020 }, { key: 2024 }],
    meta: {
      evc: {
        wrapperTitle: {
          normal: '區域立委候選人',
          mountainIndigenous: '山地原住民候選人',
          plainIndigenous: '平地原住民候選人',
          party: '不分區政黨',
        },
      },
      map: {
        mapColor: {
          normal: true,
          mountainIndigenous: false,
          plainIndigenous: false,
          party: false,
        },
        // Only normal type starts from county level.
        folderNames: {
          normal: {
            0: 'country',
            1: 'county',
            2: 'constituency',
          },
          mountainIndigenous: {
            0: 'country',
            1: 'county',
            2: 'town',
          },
          plainIndigenous: {
            0: 'country',
            1: 'county',
            2: 'town',
          },
          party: {
            0: 'country',
            1: 'county',
            2: 'town',
          },
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
      seat: {
        wrapperTitle: {
          normal: '立法委員席次圖',
          mountainIndigenous: '立法委員席次圖',
          plainIndigenous: '立法委員席次圖',
          party: '立法委員席次圖',
          all: '立法委員席次圖',
        },
        componentTitle: {
          normal: '區域立法委員選舉',
          mountainIndigenous: '山地原住民立法委員選舉',
          plainIndigenous: '平地原住民立法委員選舉',
          party: '不分區立法委選舉',
          all: '立法委員選舉（總席次圖）',
        },
      },
    },
  },
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [{ key: 2010 }, { key: 2014 }, { key: 2018 }, { key: 2022 }],
    meta: {
      evc: { wrapperTitle: '縣市首長候選人' },
      map: {
        mapColor: true,
        folderNames: {
          0: 'country',
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
    electionType: 'councilMember',
    subtypes: [
      { name: '區域', key: 'normal', mobileOnly: false },
      { name: '原住民', key: 'indigenous', mobileOnly: false },
    ],
    electionName: '縣市議員',
    years: [{ key: 2010 }, { key: 2014 }, { key: 2018 }, { key: 2022 }],
    meta: {
      evc: { wrapperTitle: '縣市議員候選人' },
      map: {
        mapColor: false,
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
    electionName: '全國公投',
    years: [
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
    ],
    meta: {
      evc: { wrapperTitle: '全國性公投' },
      map: {
        mapColor: true,
        folderNames: {
          0: 'country',
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
]

export const defaultElectionConfig = electionsConfig.find(
  (electionConfig) => electionConfig.electionType === defaultElectionType
)

// County mapping data to help convertion between code, name and endName.
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
