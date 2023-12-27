import styled from 'styled-components'

const Tooltip = styled.div`
  pointer-events: none;
  position: fixed;
  font-size: 14px;
  max-width: 280px;
  padding: 4px 12px;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 6px;
  font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei',
    -apple-system, sans-serif;
  font-weight: 500;
  line-height: 20px;
  display: ${
    /**
     * @param {Object} props
     * @param {boolean} props.show
     * @param {Array<number>} props.coordinate
     * @param {boolean} props.showTitle
     */
    ({ show }) => (show ? 'block' : 'none')
  };
  ${({ coordinate }) =>
    coordinate.length
      ? `
        top: ${coordinate[1] + 20}px;
        left: ${coordinate[0]}px;
        transform: translateX(-50%);
      `
      : `
        display: none;
      `};
  ${({ showTitle }) => showTitle && `padding: 8px`}
`

const TooltipTitle = styled.div`
  font-weight: 900;
  margin-bottom: 20px;
`

export const MapTooltip = ({ tooltip }) => {
  if (!tooltip.text) {
    return <></>
  }
  return (
    <Tooltip
      show={tooltip.show}
      coordinate={tooltip.coordinate}
      showTitle={!!tooltip.title}
    >
      {tooltip.title && <TooltipTitle>{tooltip.title}</TooltipTitle>}
      {tooltip.text}
    </Tooltip>
  )
}
