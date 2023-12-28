import * as d3 from 'd3'
import { useEffect, useMemo } from 'react'
import {
  getGradiantPartyColor,
  getGradiantReferendumColor,
  defaultColor,
  electionMapColor,
} from '../consts/colors'

import styled from 'styled-components'
import { electionActions } from '../store/election-slice'
import { useAppDispatch, useAppSelector } from '../hook/useRedux'
import * as topojson from 'topojson'
import { mapActions } from '../store/map-slice'
import gtag from '../utils/gtag'

const SVG = styled.svg`
  use {
    pointer-events: none;
  }
`

/**
 *
 * @param {Object} props
 * @param {{width: number, height: number}} props.dimension
 * @param {import('../store/map-slice').GeoJsons} props.geoJsons
 * @param {string} props.id
 * @param {Function} props.setTooltip
 * @param {import('../utils/electionsData').ElectionData} props.electionData
 * @param {boolean} props.mapColor
 * @returns {JSX.Element}
 */
export const Map = ({
  dimension,
  geoJsons,
  id,
  setTooltip,
  electionData,
  mapColor,
}) => {
  const dispatch = useAppDispatch()
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const electionName = useAppSelector(
    (state) => state.election.config.electionName
  )
  const levelControl = useAppSelector((state) => state.election.control.level)
  const year = useAppSelector((state) => state.election.control.year)
  const number = useAppSelector((state) => state.election.control.number)
  const { countyCode, townCode, areaCode, activeCode } = levelControl
  const { width, height } = dimension
  const { nation, counties, towns, villages } = geoJsons
  const rawTopoJson = useAppSelector((state) => state.map.data.rawTopoJson)
  const districtMapping = useAppSelector(
    (state) => state.election.data.districtMapping
  )
  const feature = useAppSelector((state) => state.map.control.feature)
  const areaName = useAppSelector(
    (state) => state.map.ui.districtNames.areaName
  )
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const displayingDistricts = useMemo(() => {
    let displayingTowns, displayingAreas, displayingVillages
    if (electionType === 'legislator' && subtype?.key === 'normal') {
      if (districtMapping.districtWithArea[year.key]) {
        const districtWithAreaMapping =
          districtMapping.districtWithArea[year.key]
        const countyMappingObj = districtWithAreaMapping.sub.find(
          (countyObj) => countyObj.code === countyCode
        )

        if (countyMappingObj) {
          displayingAreas = {
            type: 'FeatureCollection',
            features: [],
          }
          displayingAreas.features = countyMappingObj.sub.map(
            (areaMappingObj) => {
              const areaVillsCode = areaMappingObj.sub.map(
                (villObj) => villObj.code
              )
              const villGeometries =
                rawTopoJson.objects.villages.geometries.filter((geometry) =>
                  areaVillsCode.includes(geometry.properties.VILLCODE)
                )
              const feature = topojson.merge(
                JSON.parse(JSON.stringify(rawTopoJson)),
                JSON.parse(JSON.stringify(villGeometries))
              )
              const someVillProperties = villGeometries[0].properties
              const properties = {
                COUNTYCODE: someVillProperties.COUNTYCODE,
                COUNTYNAME: someVillProperties.COUNTYNAME,
                AREACODE: areaMappingObj.code,
                AREANAME: areaMappingObj.name,
                AREANICKNAME: areaMappingObj.nickName,
              }
              feature.properties = properties
              return feature
            }
          )

          const areaMappingObj = countyMappingObj.sub.find(
            (areaObj) => areaObj.code === areaCode
          )

          if (areaMappingObj) {
            displayingVillages = { ...villages }
            displayingVillages.features = villages.features.filter(
              (feature) => {
                const villCode = feature.properties.VILLCODE
                const areaVillsCode = areaMappingObj.sub.map(
                  (villObj) => villObj.code
                )
                return areaVillsCode.includes(villCode)
              }
            )
          }
        }
      }
    } else {
      displayingTowns = { ...towns }
      displayingTowns.features = displayingTowns.features.filter((feature) => {
        return feature.properties.COUNTYCODE === countyCode
      })

      displayingVillages = { ...villages }
      displayingVillages.features = displayingVillages.features.filter(
        (feature) => {
          return feature.properties.TOWNCODE === townCode
        }
      )
    }
    return { displayingTowns, displayingAreas, displayingVillages }
  }, [
    areaCode,
    countyCode,
    districtMapping.districtWithArea,
    electionType,
    rawTopoJson,
    subtype?.key,
    townCode,
    towns,
    villages,
    year.key,
  ])

  const { displayingTowns, displayingAreas, displayingVillages } =
    displayingDistricts

  const path = useMemo(() => {
    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      counties
    )

    return d3.geoPath(projection)
  }, [counties, height, width])

  useEffect(() => {
    const getXYZ = (feature) => {
      if (feature) {
        const bounds = path.bounds(feature)
        const wScale = (bounds[1][0] - bounds[0][0]) / width
        const hScale = (bounds[1][1] - bounds[0][1]) / height
        const magicNumber = 0.56
        // Restrict the highest scale rate to 25 to prevent extreme condition.
        const z = Math.min(25, magicNumber / Math.max(wScale, hScale))

        const centroid = path.centroid(feature)
        const [x, y] = centroid
        return [x, y, z]
      } else {
        // default xyz
        return [width / 2, height / 2, 1]
      }
    }

    const zoom = (duration, currentFeature) => {
      const xyz = getXYZ(currentFeature)
      const g = d3.select(`#${id}-control`)
      g.transition()
        .duration(duration)
        .attr(
          'transform',
          `translate(${width / 2}, ${height / 2})scale(${xyz[2]})translate(-${
            xyz[0]
          }, -${xyz[1]})`
        )
    }

    zoom(750, feature)
  }, [feature, width, height, path, id])

  const nonLandClicked = () => {
    dispatch(electionActions.resetLevelControl())
    dispatch(mapActions.resetMapFeature())
    dispatch(mapActions.resetMapUpperLevelId())
    dispatch(mapActions.resetUiDistrictNames())
  }

  const countyClicked = (feature) => {
    const { COUNTYCODE: countyCode, COUNTYNAME: countyName } =
      feature.properties
    dispatch(
      electionActions.changeLevelControl({
        level: 1,
        countyCode,
        townCode: '',
        areaCode: '',
        villageCode: '',
        activeCode: countyCode,
      })
    )
    dispatch(mapActions.changeMapFeature(feature))
    dispatch(mapActions.resetMapUpperLevelId())
    dispatch(
      mapActions.changeUiDistrictNames({
        countyName,
        townName: '',
        areaName: '',
        villageName: '',
      })
    )
    gtag.sendGAEvent('Click', {
      project: `地圖點擊: ${electionName}${
        subtype ? ` - ${subtype.name}` : ''
      } / ${year.key} / ${number ? `${number.name} / ` : ''}${countyName}`,
    })
  }
  const townClicked = (feature) => {
    const {
      COUNTYCODE: countyCode,
      COUNTYNAME: countyName,
      TOWNCODE: townCode,
      TOWNNAME: townName,
    } = feature.properties
    dispatch(
      electionActions.changeLevelControl({
        level: 2,
        countyCode,
        townCode,
        areaCode: '',
        villageCode: '',
        activeCode: townCode,
      })
    )
    dispatch(mapActions.changeMapFeature(feature))
    dispatch(mapActions.changeMapUpperLevelId(countyCode))
    dispatch(
      mapActions.changeUiDistrictNames({
        countyName,
        townName,
        areaName: '',
        villageName: '',
      })
    )
    gtag.sendGAEvent('Click', {
      project: `地圖點擊: ${electionName}${
        subtype ? ` - ${subtype.name}` : ''
      } / ${year.key} / ${
        number ? `${number.name} / ` : ''
      }${countyName} / ${townName}`,
    })
  }
  const areaClicked = (feature) => {
    const {
      COUNTYCODE: countyCode,
      COUNTYNAME: countyName,
      AREACODE: areaCode,
      AREANAME: areaName,
    } = feature.properties

    dispatch(
      electionActions.changeLevelControl({
        level: 2,
        countyCode,
        townCode: '',
        areaCode,
        villageCode: '',
        activeCode: areaCode,
      })
    )
    dispatch(mapActions.changeMapFeature(feature))
    dispatch(mapActions.changeMapUpperLevelId(countyCode))
    dispatch(
      mapActions.changeUiDistrictNames({
        countyName,
        townName: '',
        areaName,
        villageName: '',
      })
    )
    gtag.sendGAEvent('Click', {
      project: `地圖點擊: ${electionName}${
        subtype ? ` - ${subtype.name}` : ''
      } / ${year.key} / ${
        number ? `${number.name} / ` : ''
      }${countyName} / ${areaName}`,
    })
  }
  const villageClicked = (feature) => {
    const {
      COUNTYCODE: countyCode,
      COUNTYNAME: countyName,
      TOWNCODE: townCode,
      TOWNNAME: townName,
      VILLCODE: villageCode,
      VILLNAME: villageName,
    } = feature.properties

    if (!areaCode) {
      dispatch(
        electionActions.changeLevelControl({
          level: 3,
          countyCode,
          townCode,
          areaCode: '',
          villageCode,
          activeCode: villageCode,
        })
      )
      dispatch(mapActions.changeMapUpperLevelId(townCode))
      dispatch(
        mapActions.changeUiDistrictNames({
          countyName,
          townName,
          areaName: '',
          villageName,
        })
      )
      gtag.sendGAEvent('Click', {
        project: `地圖點擊: ${electionName}${
          subtype ? ` - ${subtype.name}` : ''
        } / ${year.key} / ${
          number ? `${number.name} / ` : ''
        }${countyName} / ${townName} / ${villageName}`,
      })
    } else {
      dispatch(
        electionActions.changeLevelControl({
          level: 3,
          countyCode,
          townCode: '',
          areaCode,
          villageCode,
          activeCode: villageCode,
        })
      )
      dispatch(mapActions.changeMapUpperLevelId(areaCode))
      dispatch(mapActions.changeMapFeature(feature))
      dispatch(
        mapActions.changeUiDistrictNames({
          countyName,
          townName: '',
          areaName,
          villageName,
        })
      )
      gtag.sendGAEvent('Click', {
        project: `地圖點擊: ${electionName}${
          subtype ? ` - ${subtype.name}` : ''
        } / ${year.key} / ${
          number ? `${number.name} / ` : ''
        }${countyName} / ${areaName} / ${villageName}`,
      })
    }
  }

  const getWinningCandidate = (candidates) => {
    const noWinner = candidates.every(
      (candidate, i, candidates) => candidate.tksRate === candidates[0].tksRate
    )
    if (noWinner) return null
    return candidates.reduce((pre, next) =>
      pre.tksRate > next.tksRate ? pre : next
    )
  }

  /**
   * Every county map will call this function and bring its countyCode to get the color.
   * County maps will show for every level.
   * @param {string} mapCountyCode - the code of a town map
   * @returns {string}
   */
  const getCountyColor = (mapCountyCode) => {
    if (!mapColor || !electionData[0]) {
      return defaultColor
    }

    // By pass when activeCode exists and is not countyCode. (Only country level and  county level matters.)
    if (activeCode && activeCode !== mapCountyCode) {
      return defaultColor
    }

    if (electionType === 'referendum') {
      const { agreeRate, disagreeRate } =
        electionData[0]?.districts?.find(
          (district) => district.county === mapCountyCode
        ) || {}
      if (agreeRate) {
        const agree = agreeRate >= disagreeRate
        const color = getGradiantReferendumColor(
          agree,
          agree ? agreeRate : disagreeRate
        )
        return color
      } else {
        return defaultColor
      }
    }

    const countyCandidates = electionData[0]?.districts?.find(
      (district) => district.county === mapCountyCode
    )?.candidates
    if (countyCandidates) {
      const winningCandidate = getWinningCandidate(countyCandidates)
      if (winningCandidate) {
        const color = getGradiantPartyColor(
          winningCandidate.party,
          winningCandidate.tksRate
        )
        return color
      }
    }
    return defaultColor
  }

  /**
   * Every town map will call this function and bring its townCode to get the color.
   * Town maps will show only when level is greater than 1 (county level, town level, village level).
   * @param {string} mapTownCode - the code of a town map
   * @returns {string}
   */
  const getTownColor = (mapTownCode) => {
    const countyCode = mapTownCode.slice(0, -3)

    if (!mapColor || !electionData[1]) {
      return defaultColor
    }

    // By pass when activeCode is not countyCode. (Only county level matters.)
    if (activeCode && activeCode !== countyCode) {
      return defaultColor
    }

    if (electionType === 'referendum') {
      const { agreeRate, disagreeRate } =
        electionData[1][countyCode]?.districts?.find(
          (district) => district.county + district.town === mapTownCode
        ) || {}
      if (agreeRate) {
        const agree = agreeRate >= disagreeRate
        const color = getGradiantReferendumColor(
          agree,
          agree ? agreeRate : disagreeRate
        )
        return color
      } else {
        return defaultColor
      }
    }

    const townCandidates = electionData[1][countyCode]?.districts?.find(
      (district) => district.county + district.town === mapTownCode
    )?.candidates

    if (townCandidates) {
      const winningCandidate = getWinningCandidate(townCandidates)
      if (winningCandidate) {
        const color = getGradiantPartyColor(
          winningCandidate.party,
          winningCandidate.tksRate
        )
        return color
      }
    }
    return defaultColor
  }

  /**
   * Every area map will call this function and bring its areaCode to get the color.
   * Area maps will show only when level is greater than 1 (county level, area level, village level) and the election type is normal legislator.
   * @param {string} mapAreaCode - the code of a area map
   * @returns {string}
   */
  const getAreaColor = (mapAreaCode) => {
    const countyCode = mapAreaCode.slice(0, -2)
    if (!mapColor || !electionData[1]) {
      return defaultColor
    }

    // By pass when activeCode is not countyCode. (Only county level matters.)
    if (activeCode && activeCode !== countyCode) {
      return defaultColor
    }

    // Only normal legislator will show area map and use this function.
    if (electionType === 'legislator') {
      // Try to find the area candidates from the countyCode map data.
      const areaCandidates = electionData[1][countyCode]?.districts?.find(
        (district) => district.county + district.area === mapAreaCode
      )?.candidates
      if (areaCandidates) {
        const winningCandidate = getWinningCandidate(areaCandidates)
        if (winningCandidate) {
          const color = getGradiantPartyColor(
            winningCandidate.party,
            winningCandidate.tksRate
          )
          return color
        }
      }
    }

    // need to implement logic for specific color
    return defaultColor
  }

  /**
   * Every village map will call this function and bring its villCode to get the color.
   * Village maps will show only when level is greater than 2 (town/area level).
   * @param {string} mapVillCode - the code of a village map
   * @returns {string}
   */
  const getVillageColor = (mapVillCode) => {
    if (!mapColor || !electionData[2]) {
      return defaultColor
    }

    // since only normal legislator will use areaCode to define color and other
    // legislator subtype won't show any color, separate the legislator type if sufficient.
    if (electionType !== 'legislator') {
      const townCode = mapVillCode.slice(0, -3)

      // Bypass the village if is not active in level 3 (single village level).
      if (
        levelControl.level === 3 &&
        activeCode &&
        activeCode !== mapVillCode
      ) {
        return defaultColor
      }

      if (electionType === 'referendum') {
        const { agreeRate, disagreeRate } =
          electionData[2]?.[townCode]?.districts?.find(
            (district) =>
              district.county + district.town + district.vill === mapVillCode
          ) || {}
        if (agreeRate) {
          const agree = agreeRate >= disagreeRate
          const color = getGradiantReferendumColor(
            agree,
            agree ? agreeRate : disagreeRate
          )
          return color
        } else {
          return defaultColor
        }
      }

      const villageCandidates = electionData[2][townCode]?.districts?.find(
        (district) =>
          district.county + district.town + district.vill === mapVillCode
      )?.candidates

      if (villageCandidates) {
        const winningCandidate = getWinningCandidate(villageCandidates)
        if (winningCandidate) {
          const color = getGradiantPartyColor(
            winningCandidate.party,
            winningCandidate.tksRate
          )
          return color
        }
      }
    } else {
      // If the level is 3 (village level), only show the color for the active villCode
      if (
        levelControl.level === 3 &&
        activeCode &&
        activeCode !== mapVillCode
      ) {
        return defaultColor
      }

      // If the level is 2 (area level), try to find village from the current areaCode data.
      const villageCandidates = electionData[2][areaCode]?.districts.find(
        (district) =>
          district.county + district.town + district.vill === mapVillCode
      )?.candidates

      if (villageCandidates) {
        const winningCandidate = getWinningCandidate(villageCandidates)
        if (winningCandidate) {
          const color = getGradiantPartyColor(
            winningCandidate.party,
            winningCandidate.tksRate
          )
          return color
        }
      }
    }
    // Fallback to default color if none of the situation fits.
    return defaultColor
  }

  return (
    <SVG
      preserveAspectRatio="xMidYMid"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect
        className="background"
        id={`${id}-id-background`}
        width={width}
        height={height}
        fill={electionMapColor}
        onClick={nonLandClicked}
      />
      <g id={`${id}-control`}>
        <g id={`${id}-nation`}>
          {nation.features.map((feature) => (
            <path
              key={feature['properties']['NAME']}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['NAME']}`}
              fill={defaultColor}
              stroke="black"
            />
          ))}
        </g>
        <g id={`${id}-counties`}>
          {counties.features.map((feature) => (
            <path
              key={feature.properties.COUNTYCODE}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['COUNTYCODE']}`}
              data-county-code={feature['properties']['COUNTYCODE']}
              fill={
                feature['properties']['COUNTYCODE'] === activeCode
                  ? 'transparent'
                  : getCountyColor(feature['properties']['COUNTYCODE'])
              }
              stroke="black"
              strokeWidth="0.5"
              strokeLinejoin="round"
              onClick={countyClicked.bind(null, feature)}
              onMouseOver={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: true,
                  text: feature['properties']['COUNTYNAME'],
                  title: '',
                }))
              }
              onMouseMove={(e) => {
                setTooltip((tooltip) => ({
                  ...tooltip,
                  coordinate: [e.clientX, e.clientY],
                }))
              }}
              onMouseOut={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: false,
                  text: '',
                }))
              }
            />
          ))}
        </g>
        <g id={`${id}-towns`}>
          {displayingTowns?.features?.map((feature) => (
            <path
              key={feature.properties.TOWNCODE}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['TOWNCODE']}`}
              data-county-code={feature['properties']['COUNTYCODE']}
              data-town-code={(() => {
                const code = feature['properties']['TOWNCODE']
                return code.slice(code.length - 3, code.length)
              })()}
              // fill={!townId && countyId === activeId ? 'lightcoral' : defaultColor}
              fill={
                feature['properties']['TOWNCODE'] === activeCode
                  ? 'transparent'
                  : getTownColor(feature['properties']['TOWNCODE'])
              }
              stroke={
                feature['properties']['TOWNCODE'] === activeCode
                  ? undefined
                  : '#666666'
              }
              strokeWidth="0.3"
              onClick={townClicked.bind(null, feature)}
              onMouseOver={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: true,
                  text: feature['properties']['TOWNNAME'],
                  title: '',
                }))
              }
              onMouseMove={(e) => {
                setTooltip((tooltip) => ({
                  ...tooltip,
                  coordinate: [e.clientX, e.clientY],
                }))
              }}
              onMouseOut={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: false,
                  text: '',
                }))
              }
            />
          ))}
        </g>
        <g id={`${id}-areas`}>
          {displayingAreas?.features?.map((feature) => (
            <path
              key={feature.properties.AREACODE}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['AREACODE']}`}
              data-county-code={feature['properties']['COUNTYCODE']}
              data-area-code={(() => {
                const code = feature['properties']['AREACODE']
                return code.slice(code.length - 2, code.length)
              })()}
              fill={
                feature['properties']['AREACODE'] === activeCode
                  ? 'transparent'
                  : getAreaColor(feature['properties']['AREACODE'])
              }
              stroke={
                feature['properties']['AREACODE'] === activeCode
                  ? undefined
                  : '#666666'
              }
              strokeWidth="0.3"
              onClick={areaClicked.bind(null, feature)}
              onMouseOver={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: true,
                  text: `(${feature['properties']['AREANICKNAME']})`,
                  title: `${feature['properties']['COUNTYNAME']} ${feature['properties']['AREANAME']}`,
                }))
              }
              onMouseMove={(e) => {
                setTooltip((tooltip) => ({
                  ...tooltip,
                  coordinate: [e.clientX, e.clientY],
                }))
              }}
              onMouseOut={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: false,
                  text: '',
                }))
              }
            />
          ))}
        </g>
        <g id={`${id}-villages`}>
          {displayingVillages?.features?.map((feature) => (
            <path
              key={feature.properties.VILLCODE}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['VILLCODE']}`}
              data-county-code={feature['properties']['COUNTYCODE']}
              data-town-code={(() => {
                const code = feature['properties']['TOWNCODE']
                return code.slice(code.length - 3, code.length)
              })()}
              data-village-code={(() => {
                const code = feature['properties']['VILLCODE']
                return code.slice(code.length - 3, code.length)
              })()}
              fill={getVillageColor(feature['properties']['VILLCODE'])}
              stroke={
                feature['properties']['VILLCODE'] === activeCode
                  ? undefined
                  : '#666666'
              }
              strokeWidth="0.1"
              onClick={villageClicked.bind(null, feature)}
              onMouseOver={() => {
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: true,
                  text: feature['properties']['VILLNAME'],
                  title: '',
                }))
              }}
              onMouseMove={(e) => {
                setTooltip((tooltip) => ({
                  ...tooltip,
                  coordinate: [e.clientX, e.clientY],
                }))
              }}
              onMouseOut={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: false,
                  text: '',
                }))
              }
            />
          ))}

          {activeCode && (
            // duplicate active map on above
            <use
              href={`#${id}-id-${activeCode}`}
              fill="transparent"
              stroke="white"
            />
          )}
        </g>
      </g>
    </SVG>
  )
}
