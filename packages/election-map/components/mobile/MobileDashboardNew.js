import React, { useState, useEffect, Fragment } from 'react'
import { districtCode } from '../../mock-datas/districtCode'
import Selector from './Selector'
import ElectionSelector from './ElectionSelector'
import styled from 'styled-components'
import InfoBox from './InfoBox'
import YearComparisonMenuBar from './YearComparisonMenuBar'
const ELECTION_TYPE = [
  {
    electionType: 'president',
    electionName: '正副總統',
    years: [{ key: 2012 }, { key: 2016 }, { key: 2020 }, { key: 2024 }],
  },
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [{ key: 2010 }, { key: 2014 }, { key: 2018 }, { key: 2022 }],
  },
  {
    electionType: 'legislator',
    electionName: '立法委員',
    years: [{ key: 2012 }, { key: 2016 }, { key: 2020 }, { key: 2024 }],
  },
  {
    electionType: 'councilMember',
    electionName: '縣市議員',
    years: [{ key: 2010 }, { key: 2014 }, { key: 2018 }, { key: 2022 }],
    subtypes: [
      { electionName: '區域', electionType: 'normal' },
      { electionName: '原住民', electionType: 'indigenous' },
    ],
  },
  {
    electionType: 'referendum',
    electionName: '全國性公民投票',
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
  },
]

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

const TopButtonsWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 40px;
`
const TopButton = styled.button`
  display: block;
  border-radius: 8px;
  border: 1px solid black;
  padding: 4px 7px;
  background-color: ${
    /**
     *
     * @param {Object} props
     * @param {boolean} [props.isSelected]
     */
    ({ isSelected }) => (isSelected ? '#ffc7bb' : '#fff')
  };
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
`
const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 12px 16px;
  height: 100vh;
  background-color: ${
    /**
     * @param {Object} props
     * @param {boolean} props.isCompareMode
     */
    ({ isCompareMode }) => (isCompareMode ? '#E9E9E9' : 'transparent')
  };
`
const SelectorWrapper = styled.div`
  padding: 0 16px;
`
const DistrictSelectorWrapper = styled.div`
  display: flex;
  margin: 8px auto 0;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  justify-content: left;
  gap: 12px;
`
const ElectionSelectorWrapper = styled(DistrictSelectorWrapper)`
  justify-content: left;
  gap: 12px;
`
const YearWrapper = styled(TopButton)`
  width: fit-content;
  margin: 17px 0 6px;
`

/**
 * Dashboard for new election map, created in 2023.11.20
 */
export const MobileDashboardNew = () => {
  const [currentElection, setCurrentElection] = useState(ELECTION_TYPE[0])
  const [currentElectionSubType, setCurrentElectionSubType] = useState(
    ELECTION_TYPE[3]?.subtypes[0]
  )

  const [isCompareMode, setIsCompareMode] = useState(false)
  const electionTypeYears = currentElection.years
  const defaultYears = currentElection.years[currentElection.years.length - 1]
  const [selectedYears, setSelectedYears] = useState([defaultYears])

  const [shouldOpenYearComparisonMenuBar, setShouldOpenYearComparisonMenuBar] =
    useState(false)

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
  const handleSetCurrentElection = (option) => {
    setCurrentElection(option)

    const currentYears = option.years[option.years.length - 1]
    setSelectedYears([currentYears])
    //initialize when election change
    setCurrentDistrictType('nation')
    setCurrentCountyCode(null)
    setCurrentTownCode(null)
    setCurrentVillageCode(null)
    setCurrentOpenSelector(null)
  }
  const handleSetCurrentElectionSubType = (option) => {
    setCurrentElectionSubType(option)
    //initialize when election change
    setCurrentDistrictType('nation')
    setCurrentCountyCode(null)
    setCurrentTownCode(null)
    setCurrentVillageCode(null)
    setCurrentOpenSelector(null)
  }
  const handleCloseCompareMode = () => {
    setIsCompareMode(false)
    setSelectedYears((pre) => [pre[0]])
  }
  const topButtonJsx = isCompareMode ? (
    <TopButton onClick={handleCloseCompareMode}>離開</TopButton>
  ) : (
    <>
      {electionTypeYears.map((year) => (
        <TopButton
          isSelected={selectedYears.map((year) => year.key).includes(year.key)}
          onClick={() => setSelectedYears([year])}
          key={year.key}
        >
          {year.key}
        </TopButton>
      ))}
      <TopButton onClick={() => setShouldOpenYearComparisonMenuBar(true)}>
        比較
      </TopButton>
    </>
  )
  return (
    <>
      {shouldOpenYearComparisonMenuBar && (
        <YearComparisonMenuBar
          setShouldOpenYearComparisonMenuBar={
            setShouldOpenYearComparisonMenuBar
          }
          setIsCompareMode={setIsCompareMode}
          years={electionTypeYears}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
      )}
      <Wrapper isCompareMode={isCompareMode}>
        <TopButtonsWrapper>{topButtonJsx}</TopButtonsWrapper>
        <SelectorWrapper>
          <ElectionSelectorWrapper>
            <ElectionSelector
              options={ELECTION_TYPE}
              selectorType="electionType"
              currentElection={currentElection}
              setCurrentElection={handleSetCurrentElection}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              shouldDisable={isCompareMode}
            />
            {currentElection?.subtypes && (
              <ElectionSelector
                selectorType="electionSubType"
                options={currentElection?.subtypes}
                currentElection={currentElectionSubType}
                setCurrentElection={handleSetCurrentElectionSubType}
                currentOpenSelector={currentOpenSelector}
                handleOpenSelector={setCurrentOpenSelector}
                shouldDisable={isCompareMode}
              />
            )}
          </ElectionSelectorWrapper>
          <DistrictSelectorWrapper>
            <Selector
              selectorType="districtNationAndCounty"
              options={nationAndAllCounty}
              districtCode={currentCountyCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="全國"
            ></Selector>

            <Selector
              selectorType="districtTown"
              options={allTown}
              districtCode={currentTownCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="-"
            ></Selector>

            <Selector
              selectorType="districtVillage"
              options={allVillage}
              districtCode={currentVillageCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="-"
            ></Selector>
          </DistrictSelectorWrapper>
          {currentDistrictType !== 'referendum' &&
            selectedYears.map((year) => (
              <Fragment key={year.key}>
                {isCompareMode && (
                  <YearWrapper as="div">{year.key}</YearWrapper>
                )}
                <InfoBox></InfoBox>
              </Fragment>
            ))}
        </SelectorWrapper>
        <div>electionTypeYears: {JSON.stringify(electionTypeYears)}</div>
        <div>selectedYears: {JSON.stringify(selectedYears)}</div>
        <div>currentElectionType: {currentElection.electionType}</div>
        <div>
          currentElectionSubType: {JSON.stringify(currentElectionSubType)}
        </div>
        <div>currentDistrictType: {currentDistrictType}</div>
        <div>currentDistrictCode: {currentDistrictCode}</div>
        <div>currentCountyCode: {currentCountyCode}</div>
        <div>currentTownCode: {currentTownCode}</div>
        <div>currentVillageCode: {currentVillageCode}</div>
      </Wrapper>
    </>
  )
}
