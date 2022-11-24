import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MobileReferendumControl } from './MobileReferendumControl'
import { MobileYearSelect } from './MobileYearSelect'
import { MobileElectionSelect } from './MobileElectionSelect'
import { MobilePanel } from './MobilePanel'
import { electionMapColor } from '../consts/colors'
import { ElectionRadio } from './ElectionRadio'
import ReactGA from 'react-ga'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  * {
    pointer-events: auto;
  }
`

const ActionButton = styled.button`
  height: 28px;
  padding: 3px 7px;
  line-height: 20px;
  border: 1px solid #000;
  border-radius: 8px;
  z-index: 1;

  ${({ type }) => {
    switch (type) {
      case 'normal':
        return `background: ${electionMapColor};`
      case 'election':
        return `
          background: #000;
          color: #fff;
        `
      case 'active':
        return `background: #fff;`
      case 'compare':
        return `background: #fff;`
      case 'uncompare':
        return `background: #ffc7bb;`

      default:
        break
    }
  }}
`
const TopButtons = styled.div`
  position: absolute;
  top: 12px;
  left: 62px;
  right: 16px;
  display: flex;
  align-items: center;
  z-index: 1;
  justify-content: space-between;
  ${ActionButton}:first-of-type {
    margin-right: 8px;
  }
`

const BottomButtons = styled.div`
  position: relative;
  padding: 0 7px 8px 16px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 1;
  * {
    pointer-events: auto;
  }
  ${ActionButton} {
    margin-left: 4px;
  }
`

const PanelButtons = styled.div``

const MoreHint = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #8d8d8d;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
`

export const MobilePanels = ({
  seatData,
  election,
  yearInfo,
  mapObject,
  infoboxData,
  compareInfoboxData,
  compareInfo,
  subtypeInfo,
  numberInfo,
  showTutorial,
  onElectionChange,
}) => {
  const [showElectionSelect, setShowElectoinSelect] = useState(false)
  const [showYearSelect, setShowYearSelect] = useState(false)
  const [showReferendumSelect, setShowReferendumSelect] = useState(false)
  const [compare, setCompare] = useState(false)
  const [showInfobox, setShowInfobox] = useState(true)

  const submitCompareEnd = useCallback(() => {
    compareInfo.onCompareInfoChange({ compareMode: false })
  }, [compareInfo])

  useEffect(() => {
    if (!seatData) {
      setShowInfobox(true)
    }
  }, [seatData])

  return (
    <Wrapper>
      {!showTutorial && !compareInfo.compareMode && (
        <MoreHint>往下滑看最新選情</MoreHint>
      )}
      <MobilePanel
        showInfobox={showInfobox}
        seatData={seatData}
        infoboxData={infoboxData}
        election={election}
        yearInfo={yearInfo}
        compareInfo={compareInfo}
        subtypeInfo={subtypeInfo}
        mapObject={mapObject}
        numberInfo={numberInfo}
        compareInfoboxData={compareInfoboxData}
      />
      <TopButtons>
        {!compareInfo.compareMode ? (
          <>
            <div>
              {subtypeInfo && <ElectionRadio subtypeInfo={subtypeInfo} />}
            </div>
            <div>
              <ActionButton
                type="compare"
                onClick={() => {
                  if (!numberInfo?.number) {
                    setShowYearSelect(true)
                  } else {
                    setShowReferendumSelect(true)
                  }
                }}
              >
                {numberInfo?.number
                  ? numberInfo.number.year + numberInfo.number.name
                  : yearInfo.year.key}
              </ActionButton>
              <ActionButton
                type="compare"
                onClick={() => {
                  setCompare(true)
                  if (!numberInfo?.number) {
                    setShowYearSelect(true)
                    ReactGA.event({
                      category: 'Projects',
                      action: 'Click',
                      label: `比較：年份 / 手機平板`,
                    })
                  } else {
                    setShowReferendumSelect(true)
                    ReactGA.event({
                      category: 'Projects',
                      action: 'Click',
                      label: `比較：公投 / 手機平板`,
                    })
                  }
                }}
              >
                比較
              </ActionButton>
            </div>
          </>
        ) : (
          <>
            <div>
              {subtypeInfo && <ElectionRadio subtypeInfo={subtypeInfo} />}
            </div>
            <div>
              <ActionButton
                type="uncompare"
                onClick={() => {
                  submitCompareEnd()
                }}
              >
                離開
              </ActionButton>
            </div>
          </>
        )}
      </TopButtons>
      {!compareInfo.compareMode && (
        <BottomButtons>
          <ActionButton
            type="election"
            onClick={() => {
              setShowElectoinSelect(true)
              ReactGA.event({
                category: 'Projects',
                action: 'Click',
                label: `席次分佈：手機平板`,
              })
            }}
          >
            看其他選舉
          </ActionButton>
          <PanelButtons>
            <ActionButton
              type={showInfobox ? 'active' : 'normal'}
              onClick={() => {
                if (!showInfobox) {
                  setShowInfobox(true)
                  ReactGA.event({
                    category: 'Projects',
                    action: 'Click',
                    label: `得票分佈：手機平板`,
                  })
                }
              }}
            >
              得票分佈
            </ActionButton>
            {seatData && (
              <ActionButton
                type={showInfobox ? 'normal' : 'active'}
                onClick={() => {
                  if (showInfobox) {
                    setShowInfobox(false)
                    ReactGA.event({
                      category: 'Projects',
                      action: 'Click',
                      label: `席次分佈：手機平板`,
                    })
                  }
                }}
              >
                席次分佈
              </ActionButton>
            )}
          </PanelButtons>
        </BottomButtons>
      )}
      {showElectionSelect && (
        <MobileElectionSelect
          electionType={election.electionType}
          hideElectionSelect={() => setShowElectoinSelect(false)}
          onElectionChange={onElectionChange}
        />
      )}
      {showYearSelect && (
        <MobileYearSelect
          compare={compare}
          hideYearSelect={() => {
            setShowYearSelect(false)
            setCompare(false)
          }}
          yearInfo={yearInfo}
          compareInfo={compareInfo}
        />
      )}
      {showReferendumSelect && (
        <MobileReferendumControl
          compare={compare}
          numberInfo={numberInfo}
          compareInfo={compareInfo}
          hideReferendumSelect={() => {
            setShowReferendumSelect(false)
            setCompare(false)
          }}
        />
      )}
    </Wrapper>
  )
}
