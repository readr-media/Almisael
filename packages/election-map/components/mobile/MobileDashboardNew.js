import React, { useState, useEffect } from 'react'
import { districtCode } from '../../mock-datas/districtCode'
import Selector from './Selector'
import styled from 'styled-components'

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

const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 12px 28px;
  height: calc(100vh - 40px);
`

const SelectorWrapper = styled.div`
  display: flex;
  margin: 116px auto 0;
  width: 100%;

  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

/**
 * Dashboard for new election map, created in 2023.11.20
 */
export const MobileDashboardNew = () => {
  const [currentDistrictType, setCurrentDistrictType] = useState('nation')
  const [currentCountyCode, setCurrentCountyCode] = useState(null)
  const [currentTownCode, setCurrentTownCode] = useState(null)
  const [currentVillageCode, setCurrentVillageCode] = useState(null)
  const [currentOpenSelector, setCurrentOpenSelector] = useState(null)

  /** @type {CountyData[]} */
  const allCounty = districtCode.sub

  /** @type {TownData[]} */
  const allTown = getAllTown(currentCountyCode)

  /** @type {VillageData[]} */
  const allVillage = getAllVillage(currentTownCode)

  const currentDistrictCode = getCurrentDistrictCode()

  //clean up
  useEffect(() => {
    if (currentDistrictType === 'nation') {
      setCurrentCountyCode(null)
      setCurrentTownCode(null)
      setCurrentVillageCode(null)
    } else if (currentDistrictType === 'county') {
      setCurrentTownCode(null)
      setCurrentVillageCode(null)
    } else if (currentDistrictType === 'town') {
      setCurrentVillageCode(null)
    }
  }, [currentDistrictType])

  function getCurrentDistrictCode() {
    switch (currentDistrictType) {
      case 'nation':
        return districtCode.code
      case 'county':
        return currentCountyCode
      case 'town':
        return currentTownCode
      case 'village':
        return currentVillageCode

      default:
        return districtCode.code
    }
  }

  function getAllTown(code) {
    if (currentDistrictType === 'nation') {
      return null
    }
    if (!code) {
      return null
    }

    return allCounty.find((item) => item.code === code).sub
  }
  function getAllVillage(code) {
    if (currentDistrictType === 'nation' || currentDistrictType === 'county') {
      return null
    }
    if (!code) {
      return null
    }
    return allTown?.find((item) => item.code === code).sub
  }
  const nationAndAllCounty = [
    {
      type: districtCode.type,
      code: districtCode.code,
      name: districtCode.name,
    },
    ...districtCode.sub,
  ]
  /**
   *
   * @param {DistrictType} type
   * @param {string} code
   */
  const handleOnClick = (
    type = districtCode.type,
    code = districtCode.code
  ) => {
    setCurrentDistrictType(type)
    switch (type) {
      case 'nation':
        break
      case 'county':
        setCurrentCountyCode(code)
        break
      case 'town':
        setCurrentTownCode(code)
        break
      case 'village':
        setCurrentVillageCode(code)
        break
      default:
        break
    }
  }

  return (
    <Wrapper>
      <SelectorWrapper>
        <Selector
          options={nationAndAllCounty}
          districtCode={currentCountyCode}
          onSelected={handleOnClick}
          currentOpenSelector={currentOpenSelector}
          handleOpenSelector={setCurrentOpenSelector}
          placeholderValue="全國"
        ></Selector>

        <Selector
          options={allTown}
          districtCode={currentTownCode}
          onSelected={handleOnClick}
          currentOpenSelector={currentOpenSelector}
          handleOpenSelector={setCurrentOpenSelector}
          placeholderValue="鄉鎮市區"
        ></Selector>

        <Selector
          options={allVillage}
          districtCode={currentVillageCode}
          onSelected={handleOnClick}
          currentOpenSelector={currentOpenSelector}
          handleOpenSelector={setCurrentOpenSelector}
          placeholderValue="村里"
        ></Selector>
      </SelectorWrapper>

      <div>currentDistrictType: {currentDistrictType}</div>
      <div>currentDistrictCode: {currentDistrictCode}</div>
      <div>currentCountyCode: {currentCountyCode}</div>
      <div>currentTownCode: {currentTownCode}</div>
      <div>currentVillageCode: {currentVillageCode}</div>
    </Wrapper>
  )
}
