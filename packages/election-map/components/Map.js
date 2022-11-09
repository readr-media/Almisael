import * as d3 from 'd3'
import { useEffect } from 'react'
import { defaultMapObject } from './MapControl'
import {
  getGradiantPartyColor,
  getGradiantReferendaColor,
  defaultColor,
} from '../consts/colors'

import styled from 'styled-components'

const SVG = styled.svg`
  use {
    pointer-events: none;
  }
`
export const Map = ({
  dimension,
  mapData,
  id,
  mapObject,
  setMapObject,
  setTooltip,
  electionData,
  electionType,
}) => {
  // eslint-disable-next-line no-unused-vars
  const { currentFeature, countyId, townId, villageId, activeId } = mapObject
  const { width, height } = dimension
  const { counties, towns, villages } = mapData
  const projection = d3.geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    counties
  )
  const path = d3.geoPath(projection)

  const displayingTowns = { ...towns }
  displayingTowns.features = displayingTowns.features.filter((feature) => {
    return feature.properties.COUNTYCODE === countyId
  })

  const displayingVillages = { ...villages }
  displayingVillages.features = displayingVillages.features.filter(
    (feature) => {
      return feature.properties.TOWNCODE === townId
    }
  )

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

  const zoom = (duration) => {
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
    zoom(750)
  }, [currentFeature])

  useEffect(() => {
    zoom(0)
  }, [width, height])

  const nonLandClicked = () => {
    setMapObject(defaultMapObject)
  }

  const countyClicked = (feature) => {
    const { COUNTYCODE: countyId, COUNTYNAME: countyName } = feature.properties
    console.log('---')
    console.log(`county:${countyName} clicked`)
    console.log(`countyId = ${countyId}`)
    console.log('path id is:', `#id-${countyId}`)
    console.log('d is:', feature)
    console.log('---')

    console.log('set countyId = ', countyId)
    setMapObject({
      level: 1,
      currentFeature: feature,
      countyId,
      countyName,
      townId: '',
      villageId: '',
      villageId: '',
      villageName: '',
      constituencyId: '',
      constituencyName: '',
      activeId: countyId,
      upperLevelId: 'background',
    })
  }
  const townClicked = (feature) => {
    const {
      COUNTYCODE: countyId,
      COUNTYNAME: countyName,
      TOWNCODE: townId,
      TOWNNAME: townName,
    } = feature.properties

    console.log('---')
    console.log(`county:${countyName} town:${townName} clicked`)
    console.log(`countyId = ${countyId}, townId = ${townId}`)
    console.log('path id is:', `#id-${townId}`)
    console.log('d is:', feature)
    console.log('---')

    setMapObject({
      level: 2,
      currentFeature: feature,
      countyId,
      countyName,
      townId,
      townName,
      villageId: '',
      villageName: '',
      constituencyId: '',
      constituencyName: '',
      activeId: townId,
      upperLevelId: countyId,
    })
  }
  const villageClicked = (feature) => {
    const {
      COUNTYCODE: countyId,
      COUNTYNAME: countyName,
      TOWNCODE: townId,
      TOWNNAME: townName,
      VILLCODE: villageId,
      VILLNAME: villageName,
    } = feature.properties

    console.log('---')
    console.log(
      `county:${countyName} town:${townName} village:${villageName} clicked`
    )
    console.log(
      `countyId = ${countyId}, townId = ${townId}, villageId = ${villageId}`
    )
    console.log('village_clicked:')
    console.log('path id is:', `#id-${villageId}`)
    console.log('d is:', feature)
    console.log('---')

    setMapObject({
      ...mapObject,
      level: 3,
      countyId,
      countyName,
      townId,
      townName,
      villageId,
      villageName,
      constituencyId: '',
      constituencyName: '',
      activeId: villageId,
      upperLevelId: townId,
    })
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
    if (electionType === 'referenda') {
      const { agreeRate, disagreeRate } =
        electionData[0].districts.find(
          (district) => district.county === countyCode
        ) || {}
      if (agreeRate) {
        const agree = agreeRate >= disagreeRate
        const color = getGradiantReferendaColor(
          agree,
          agree ? agreeRate : disagreeRate
        )
        return color
      } else {
        return defaultColor
      }
    }
    if (electionType === 'councilman') {
      return '#555'
    }
    if (!electionData[0]) {
      return defaultColor
    }
    // const countyCandidates = electionData[0].districts.find(
    //   (district) => district.county === countyCode
    // )?.candidates
    const countyCandidates = electionData[0]?.districts[0].candidates
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

    if (electionType === 'referenda') {
      const { agreeRate, disagreeRate } =
        electionData[1][countyCode].districts.find(
          (district) => district.county + district.town === townCode
        ) || {}
      if (agreeRate) {
        const agree = agreeRate >= disagreeRate
        const color = getGradiantReferendaColor(
          agree,
          agree ? agreeRate : disagreeRate
        )
        return color
      } else {
        return defaultColor
      }
    }

    if (electionType === 'councilman') {
      return '#444'
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

    if (!electionData[1]) {
      return defaultColor
    }

    // const townCandidates = electionData[1].districts.find(
    //   (district) => district.county + district.town === townCode
    // )?.candidates
    const townCandidates = electionData[1][countyCode]?.districts[0].candidates

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

  // eslint-disable-next-line no-unused-vars
  const getVillageColor = (villCode) => {
    if (!electionData[2]) {
      return defaultColor
    }

    const townCode = villCode.slice(0, -3)
    if (electionType === 'referenda') {
      const { agreeRate, disagreeRate } =
        electionData[2].districts.find(
          (district) =>
            district.county + district.town + district.vill === villCode
        ) || {}
      if (agreeRate) {
        const agree = agreeRate >= disagreeRate
        const color = getGradiantReferendaColor(
          agree,
          agree ? agreeRate : disagreeRate
        )
        return color
      } else {
        return defaultColor
      }
    }

    if (electionType === 'councilman') {
      return '#333'
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

    // const villageCandidates = electionData[2].districts.find(
    //   (district) => district.county + district.town + district.vill === villCode
    // )?.candidates
    const villageCandidates = electionData[2][townCode]?.districts[0].candidates

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
        fill="white"
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
              // fill="white"
              fill={
                feature['properties']['COUNTYCODE'] === activeId
                  ? undefined
                  : getCountyColor(feature['properties']['COUNTYCODE'])
              }
              stroke={
                feature['properties']['COUNTYCODE'] === activeId
                  ? undefined
                  : 'gray'
              }
              strokeWidth="0.3"
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
          {/* {mapObject.level === 1 && (
            <use href={`#${id}-id-${activeId}`} x="0" />
          )} */}
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
                feature['properties']['TOWNCODE'] === activeId
                  ? 'transparent'
                  : getTownColor(feature['properties']['TOWNCODE'])
              }
              stroke={
                feature['properties']['TOWNCODE'] === activeId
                  ? undefined
                  : 'gray'
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
                feature['properties']['VILLCODE'] === activeId
                  ? undefined
                  : 'gray'
              }
              strokeWidth={
                feature['properties']['VILLCODE'] === activeId ? 0.2 : 0.1
              }
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

          {activeId && (
            // duplicate active map on above
            <use
              href={`#${id}-id-${activeId}`}
              fill="transparent"
              stroke="white"
            />
          )}
        </g>
      </g>
    </SVG>
  )
}
