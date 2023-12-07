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

const SVG = styled.svg`
  use {
    pointer-events: none;
  }
`
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
  const levelControl = useAppSelector((state) => state.election.control.level)
  const year = useAppSelector((state) => state.election.control.year)
  const { countyCode, townCode, areaCode, activeCode } = levelControl
  const { width, height } = dimension
  const { counties, towns, villages } = geoJsons
  const rawTopoJson = useAppSelector((state) => state.map.data.rawTopoJson)
  const districtMapping = useAppSelector(
    (state) => state.election.data.districtMapping
  )
  const feature = useAppSelector((state) => state.map.control.feature)
  const areaName = useAppSelector(
    (state) => state.map.ui.districtNames.areaName
  )

  const displayingDistricts = useMemo(() => {
    let displayingTowns, displayingAreas, displayingVillages
    if (electionType === 'legislator') {
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
                AREANICKNAME: areaMappingObj.nickname,
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
    townCode,
    towns,
    villages,
    year.key,
  ])

  const { displayingTowns, displayingAreas, displayingVillages } =
    displayingDistricts

  const projection = d3.geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    counties
  )
  const path = d3.geoPath(projection)

  const getXYZ = (feature) => {
    if (feature) {
      const bounds = path.bounds(feature)
      const wScale = (bounds[1][0] - bounds[0][0]) / width
      const hScale = (bounds[1][1] - bounds[0][1]) / height
      const z = 0.56 / Math.max(wScale, hScale)

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

    g.selectAll([`#${id}-#counties`, `#${id}-towns`, `#${id}-villages`])
      .style('stroke', 'black')
      // .style('stroke-linejoin', 'round')
      // .style('stroke-linecap', 'round')
      .style('stroke-width', '0px')
      .transition()
      .delay(750)
      .duration(0)
      .style('stroke-width', `${0.3 / xyz[2]}px`)
      .selectAll('.villages')
      .attr('d', path.pointRadius(20.0 / xyz[2]))
  }

  useEffect(() => {
    zoom(750, feature)
  }, [feature, width, height])

  // useEffect(() => {
  //   zoom(0)
  //   console.log('zoom here')
  // }, [width, height])

  const nonLandClicked = () => {
    dispatch(electionActions.resetLevelControl())
    dispatch(mapActions.resetMapFeature())
    dispatch(mapActions.resetMapUpperLevelId())
    dispatch(mapActions.resetUiDistrictNames)
  }

  const countyClicked = (feature) => {
    const { COUNTYCODE: countyCode, COUNTYNAME: countyName } =
      feature.properties
    // console.log('---')
    // console.log(`county:${countyName} clicked`)
    // console.log(`countyId = ${countyId}`)
    // console.log('path id is:', `#id-${countyId}`)
    // console.log('d is:', feature)
    // console.log('---')
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
  }
  const townClicked = (feature) => {
    const {
      COUNTYCODE: countyCode,
      COUNTYNAME: countyName,
      TOWNCODE: townCode,
      TOWNNAME: townName,
    } = feature.properties

    // console.log('---')
    // console.log(`county:${countyName} town:${townName} clicked`)
    // console.log(`countyId = ${countyId}, townId = ${townId}`)
    // console.log('path id is:', `#id-${townId}`)
    // console.log('d is:', feature)
    // console.log('---')
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

    // console.log('---')
    // console.log(
    //   `county:${countyName} town:${townName} village:${villageName} clicked`
    // )
    // console.log(
    //   `countyId = ${countyId}, townId = ${townId}, villageId = ${villageId}`
    // )
    // console.log('village_clicked:')
    // console.log('path id is:', `#id-${villageId}`)
    // console.log('d is:', feature)
    // console.log('---')

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
      dispatch(
        mapActions.changeUiDistrictNames({
          countyName,
          townName: '',
          areaName,
          villageName,
        })
      )
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

  // eslint-disable-next-line no-unused-vars
  const getCountyColor = (countyCode) => {
    if (!mapColor || !electionData[0]) {
      return defaultColor
    }

    if (activeCode && activeCode !== countyCode) {
      return defaultColor
    }

    if (electionType === 'referendum') {
      const { agreeRate, disagreeRate } =
        electionData[0]?.districts?.find(
          (district) => district.county === countyCode
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
      (district) => district.county === countyCode
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

  // eslint-disable-next-line no-unused-vars
  const getTownColor = (townCode) => {
    const countyCode = townCode.slice(0, -3)

    if (!mapColor || !electionData[1]) {
      return defaultColor
    }

    if (activeCode && activeCode !== countyCode) {
      return defaultColor
    }

    if (electionType === 'referendum') {
      const { agreeRate, disagreeRate } =
        electionData[1][countyCode]?.districts?.find(
          (district) => district.county + district.town === townCode
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

    if (electionType === 'legislator') {
      // const constituencyCandidates = electionData[1].districts.find(
      //   (district) => district.county + district.area + '0' === townCode
      // )?.candidates
      const constituencyCandidates = electionData[1].districts[0].candidates

      if (constituencyCandidates) {
        const winningCandidate = getWinningCandidate(constituencyCandidates)
        if (winningCandidate) {
          const color = getGradiantPartyColor(
            winningCandidate.party,
            winningCandidate.tksRate
          )
          return color
        }
      }
    }

    const townCandidates = electionData[1][countyCode]?.districts?.find(
      (district) => district.county + district.town === townCode
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

  const getAreaColor = (areaCode) => {
    const countyCode = areaCode.slice(0, -2)
    if (!mapColor || !electionData[1]) {
      return defaultColor
    }

    if (activeCode && activeCode !== countyCode) {
      return defaultColor
    }

    // need to implement logic for specific color
    return defaultColor
  }

  // eslint-disable-next-line no-unused-vars
  const getVillageColor = (villCode) => {
    const townCode = villCode.slice(0, -3)
    if (!mapColor || !electionData[2]) {
      return defaultColor
    }

    if (activeCode && activeCode !== townCode && activeCode !== villCode) {
      return defaultColor
    }

    if (electionType === 'referendum') {
      const { agreeRate, disagreeRate } =
        electionData[2][townCode]?.districts?.find(
          (district) =>
            district.county + district.town + district.vill === villCode
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

    if (electionType === 'legislator') {
      // const villageCandidates = electionData[2].districts.find(
      //   (district) =>
      //   district.county + district.area + '0' + district.vill === villCode
      //   )?.candidates
      const villageCandidates = electionData[2].districts[0].candidates

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

    const villageCandidates = electionData[2][townCode]?.districts?.find(
      (district) => district.county + district.town + district.vill === villCode
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
        <g id={`${id}-counties`}>
          {counties.features.map((feature) => (
            <path
              key={feature.properties.COUNTYCODE}
              d={path(feature)}
              id={`${id}-id-${feature['properties']['COUNTYCODE']}`}
              data-county-code={feature['properties']['COUNTYCODE']}
              fill={
                feature['properties']['COUNTYCODE'] === activeCode
                  ? undefined
                  : getCountyColor(feature['properties']['COUNTYCODE'])
              }
              stroke={
                feature['properties']['COUNTYCODE'] === activeCode
                  ? undefined
                  : 'black'
              }
              strokeWidth="0.5"
              strokeLinejoin="round"
              onClick={countyClicked.bind(null, feature)}
              onMouseOver={() =>
                setTooltip((tooltip) => ({
                  ...tooltip,
                  show: true,
                  text: feature['properties']['COUNTYNAME'],
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
                  text: feature['properties']['AREANAME'],
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
              // fill={
              //   !villageId
              //     ? townId === activeId
              //       ? 'lightcoral'
              //       : defaultColor
              //     : feature['properties']['VILLCODE'] === activeId
              //     ? 'lightcoral'
              //     : defaultColor
              // }
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
