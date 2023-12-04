/**
 * @typedef {Object} NationData
 * @property {string} name
 * @property {string} code
 * @property {'nation'} type
 * @property {CountyData[]} sub
 */

/**
 * @typedef {Object} CountyData
 * @property {string} name
 * @property {string} code
 * @property {'county'} type
 * @property {TownData[]} sub
 */
/**
 * @typedef {Object} TownData
 * @property {string} name
 * @property {string} code
 * @property {'town'} type
 * @property {VillageData[]} sub
 */
/**
 * @typedef {Object} VillageData
 * @property {string} name
 * @property {string} code
 * @property {'village'} type
 * @property {null} sub
 */

/**
 * @typedef {'nation' | 'county' | 'town' | 'village'} DistrictType
 */

/**
 * @type {NationData}
 */
const districtCode = {
  code: '0',
  name: '全國',
  type: 'nation',
  sub: [
    {
      code: '63000',
      name: '台北市',
      type: 'county',
      sub: [
        {
          code: '63000080',
          name: '文山區',
          type: 'town',
          sub: [
            {
              code: '63000080037',
              name: '老泉里',
              type: 'village',
              sub: null,
            },
            {
              code: '63000080032',
              name: '樟腳里',
              type: 'village',
              sub: null,
            },
          ],
        },
        {
          code: '63000030',
          name: '大安區',
          type: 'town',
          sub: [
            {
              code: '63000030043',
              name: '大學里',
              type: 'village',
              sub: null,
            },
            {
              code: '63000030057',
              name: '學府里',
              type: 'village',
              sub: null,
            },
          ],
        },
      ],
    },
    {
      code: '65000',
      name: '新北市',
      type: 'county',
      sub: [
        {
          code: '65000110',
          name: '汐止區',
          type: 'town',
          sub: [
            {
              code: '65000110025',
              name: '宜興里',
              type: 'village',
              sub: null,
            },
            {
              code: '65000110039',
              name: '東勢里',
              type: 'village',
              sub: null,
            },
          ],
        },
        {
          code: '65000010',
          name: '板橋區',
          type: 'town',
          sub: [
            {
              code: '65000010099',
              name: '溪洲里',
              type: 'village',
              sub: null,
            },
            {
              code: '65000010083',
              name: '廣福里',
              type: 'village',
              sub: null,
            },
          ],
        },
      ],
    },
  ],
}

export { districtCode }
