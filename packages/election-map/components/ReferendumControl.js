import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReferendumSelect } from './ReferendumSelect'
import { electionActions } from '../store/election-slice'
import { getReferendumNumbers } from '../utils/election'
import { useAppDispatch, useAppSelector } from '../hook/useRedux'
import { mapActions } from '../store/map-slice'
import gtag from '../utils/gtag'

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin-top: 20px;
`

const ActionButton = styled.button`
  display: inline-block;
  margin-top: 20px;
  border: 1px solid #000;
  background-color: ${
    /**
     * @param {Object} props
     * @param {boolean} [props.compare]
     * @param {string} [props.cancel]
     */
    ({ compare }) => (compare ? '#e0e0e0' : '#ffc7bb')
  };
  color: #000;
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  font-weight: 500;
  width: 80px;
  height: 32px;
  &:nth-of-type(2) {
    margin-left: 12px;
  }
  ${({ cancel }) => cancel && 'background-color: #e0e0e0;'}
`

export const ReferendumControl = () => {
  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const number = useAppSelector((state) => state.election.control.number)
  const electionConfig = useAppSelector((state) => state.election.config)
  const device = useAppSelector((state) => state.ui.device)
  const electionName = useAppSelector(
    (state) => state.election.config.electionName
  )
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const numbers = getReferendumNumbers(electionConfig)
  const [compare, setCompare] = useState(false)
  const dispatch = useAppDispatch()

  const [compareCandidates, setCompareCandidates] = useState([
    number,
    numbers?.length > 1 ? numbers.filter((n) => n.key !== number.key)[0] : null,
  ])
  const compareNumber = compareCandidates[1]

  const submitCompareCandidates = useCallback(() => {
    const [number, compareNumber] = compareCandidates
    dispatch(electionActions.changeNumber(number))
    dispatch(
      electionActions.startCompare({
        compareYearKey: compareNumber.year,
        compareNumber: compareNumber,
      })
    )
  }, [compareCandidates, dispatch])

  const submitCompareEnd = () => {
    dispatch(electionActions.stopCompare())
    dispatch(mapActions.resetMapFeature())
  }

  useEffect(() => {
    // submit again if compareCandidates changes
    if (compareMode) {
      submitCompareCandidates()
    }
  }, [compareCandidates, compareMode, submitCompareCandidates])

  return (
    <>
      {compare ? (
        <>
          <StyledReferendumSelect
            selectedNumber={compareCandidates[0]}
            numbers={numbers}
            onNumberChange={(number) => {
              setCompareCandidates(([, cand2]) => {
                if (number === cand2) {
                  return [
                    number,
                    numbers.filter((n) => n.key !== number.key)[0],
                  ]
                } else {
                  return [number, cand2]
                }
              })
            }}
          />
          <StyledReferendumSelect
            selectedNumber={compareCandidates[1]}
            numbers={numbers}
            onNumberChange={(number) => {
              setCompareCandidates(([cand1]) => {
                if (number === cand1) {
                  return [
                    numbers.filter((n) => n.key !== number.key)[0],
                    number,
                  ]
                } else {
                  return [cand1, number]
                }
              })
            }}
          />
          {!compareMode && (
            <ActionButton
              cancel="true"
              onClick={() => {
                setCompare(false)
                setCompareCandidates([
                  number,
                  numbers?.length > 1
                    ? numbers.filter((n) => n.key !== number.key)[0]
                    : null,
                ])
              }}
            >
              取消
            </ActionButton>
          )}
          <ActionButton
            onClick={() => {
              if (compareMode) {
                submitCompareEnd()
                setCompare(false)
                setCompareCandidates([
                  number,
                  numbers?.length > 1
                    ? numbers.filter((n) => n.key !== number.key)[0]
                    : null,
                ])
                document.body.scrollTop = 0 // For Safari
                document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
              } else {
                submitCompareCandidates()
                const [number, compareNumber] = compareCandidates
                gtag.sendGAEvent('Click', {
                  project: `比較確定：${electionName}${
                    subtype ? ` - ${subtype.name}` : ''
                  } / ${number.year + number.name} - ${
                    compareNumber.year + compareNumber.name
                  } / ${device}`,
                })
              }
            }}
          >
            {compareMode ? '返回' : '確定'}
          </ActionButton>
        </>
      ) : (
        <>
          <StyledReferendumSelect
            selectedNumber={number}
            numbers={numbers}
            onNumberChange={(number) => {
              dispatch(electionActions.changeNumber(number))
            }}
          />
          {compareNumber && (
            <ActionButton
              onClick={() => {
                setCompare(true)
                gtag.sendGAEvent('Click', {
                  project: `比較 / ${device}`,
                })
              }}
              compare={compare}
            >
              比較
            </ActionButton>
          )}
        </>
      )}
    </>
  )
}
