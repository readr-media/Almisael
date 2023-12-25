import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hook/useRedux'
import { getReferendumNumbers } from '../../utils/election'
import useClickOutside from '../../hook/useClickOutside'
import { electionActions } from '../../store/election-slice'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const SelectedButton = styled.button`
  padding: 2.5px 7.5px;
  width: fit-content;
  z-index: 0;
  border-radius: 8px;
  border: 1px solid;
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
  background-color: #fff;
  margin-left: auto;
  span {
    color: #000;

    max-height: 28.4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
const ModalWrapper = styled.div`
  position: fixed;
  z-index: 999;
  display: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldShowModal
     */
    ({ shouldShowModal }) => (shouldShowModal ? 'flex' : 'none')
  };

  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #292929cc;
`
const Modal = styled.ul`
  display: block;
  background-color: #fff;
  padding: 8px 10px;
  width: 68.2vw;
  height: 50vh;
  border-radius: 8px;
  min-width: 256px;
  min-height: 369px;
  overflow-y: scroll;
  overflow-x: auto;
  list-style-type: none;
`
const ReferendumItem = styled.li`
  list-style: none;
  color: ${
    /**
     *
     * @param {Object} props
     * @param {boolean} props.isSelected
     * @returns
     */
    ({ isSelected }) => (isSelected ? '#dd6f57' : '#7e7e7e')
  };
  margin-bottom: 20px;
  .name {
    font-size: 14px;
    line-height: 20.27px;
    text-align: center;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .detail {
    font-weight: 350;
    font-size: 14px;
    line-height: 21px;
    text-align: left;
  }
`
export default function ReferendumSelector() {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const modalRef = useRef(null)

  const selectedReferendumItemRef = useRef(null)
  const dispatch = useAppDispatch()
  useClickOutside(modalRef, () => {
    setShouldShowModal(false)
  })
  const electionConfig = useAppSelector((state) => state.election.config)

  const orderDetails = getReferendumNumbers(electionConfig)

  const handleSelectedButtonOnClick = () => {
    setShouldShowModal((pre) => !pre)
  }

  const referendumNumber = useAppSelector(
    (state) => state.election.control.number
  )
  /**
   *
   * @param {import('../../consts/electionsConfig').ReferendumNumber} detail
   */
  const handleSelectReferendum = (detail) => {
    setShouldShowModal(false)
    if (detail.key === referendumNumber.key) {
      return
    }
    dispatch(electionActions.changeNumber(detail))
  }
  useEffect(() => {
    const selectedReferendumItem = selectedReferendumItemRef?.current
    if (shouldShowModal && selectedReferendumItem) {
      selectedReferendumItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  })
  // While the sidebar is open, disable body scroll.
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) {
      return
    }
    if (shouldShowModal) {
      disableBodyScroll(modal)
      return () => enableBodyScroll(modal)
    } else {
      return undefined
    }
  }, [shouldShowModal])
  return (
    <>
      <SelectedButton onClick={handleSelectedButtonOnClick}>
        <span>
          {referendumNumber.year} {referendumNumber.name}
        </span>
      </SelectedButton>
      <ModalWrapper shouldShowModal={shouldShowModal}>
        <Modal ref={modalRef}>
          {orderDetails.map((detail) => {
            return (
              <ReferendumItem
                onClick={() => handleSelectReferendum(detail)}
                ref={
                  detail.key === referendumNumber.key
                    ? selectedReferendumItemRef
                    : null
                }
                isSelected={detail.key === referendumNumber.key}
                key={detail.key}
              >
                <div className="name">
                  {detail.year} {detail.name}
                </div>
                <div className="detail">{detail.detail}</div>
              </ReferendumItem>
            )
          })}
        </Modal>
      </ModalWrapper>
    </>
  )
}
