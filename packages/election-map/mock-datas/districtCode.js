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
  name: '台灣',
  type: 'nation',
  sub: [
    {
      code: '1',
      name: '台北市',
      type: 'county',
      sub: [
        {
          code: '11',
          name: '大安區',
          type: 'town',
          sub: [
            {
              code: '111',
              name: '大安區第一里',
              type: 'village',
              sub: null,
            },
            {
              code: '112',
              name: '大安區第二里',
              type: 'village',
              sub: null,
            },
          ],
        },
        {
          code: '12',
          name: '內湖區',
          type: 'town',
          sub: [
            {
              code: '121',
              name: '內湖區第一里',
              type: 'village',
              sub: null,
            },
            {
              code: '122',
              name: '內湖區第二里',
              type: 'village',
              sub: null,
            },
          ],
        },
      ],
    },
    {
      code: '2',
      name: '新北市',
      type: 'county',
      sub: [
        {
          code: '21',
          name: '汐止區',
          type: 'town',
          sub: [
            {
              code: '211',
              name: '汐止區第一里',
              type: 'village',
              sub: null,
            },
            {
              code: '222',
              name: '汐止區第二里',
              type: 'village',
              sub: null,
            },
          ],
        },
        {
          code: '22',
          name: '板橋區',
          type: 'town',
          sub: [
            {
              code: '221',
              name: '板橋區第一里',
              type: 'village',
              sub: null,
            },
            {
              code: '222',
              name: '板橋區第二里',
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
