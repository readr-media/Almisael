import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReferendumSelect } from './ReferendumSelect'
import ReactGA from 'react-ga'
import { electionActions } from '../store/election-slice'
import { getReferendumNumbers } from '../utils/election'
import { useAppDispatch, useAppSelector } from '../hook/useRedux'
import { mapActions } from '../store/map-slice'

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin: 17px 0 0 12px;
`

const ActionButton = styled.button`
  display: inline-block;
  margin: 20px 0 0 12px;
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
  ${({ cancel }) => cancel && 'background-color: #e0e0e0;'}
`

export const ReferendumControl = () => {
  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const number = useAppSelector((state) => state.election.control.number)
  const electionConfig = useAppSelector((state) => state.election.config)
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
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `比較取消：公投 / 桌機`,
                })
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
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `比較確定：公投 / 桌機`,
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
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `比較：公投 / 桌機`,
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
