import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { formattedDate } from './utils'

const DotStyle = `
    content: "";
    position: absolute;
    top: calc( 50% - 2px);
    left: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(0,9,40,.2);
`

const Caption = styled.div`
  word-wrap: break-word;
  text-align: left;
  display: inline;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.03em;
  color: #000928;

  &:hover {
    border-bottom: 1.5px solid #000928;
  }

  @media (min-width: 768px) {
    font-size: 18px;
    line-height: 27px;
  }
`

const Info = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 9, 40, 0.66);
  margin: 4px 0 0;

  .date {
    margin-right: 3px;
  }

  .time {
    position: relative;
    padding: ${(props) => (props.date ? '0 0 0 14px;' : '0px')};

    &:before {
      ${(props) => (props.date ? DotStyle : '')}
    }
  }

  @media (min-width: 576px) {
    margin: 8px 0 0;
  }
`

export default function ReportInfo({ caption, captionClassName, date, time }) {
  return (
    <div className="readr-report-info">
      {caption && <Caption className={captionClassName}>{caption}</Caption>}
      <Info date={date}>
        {date && <span className="date">{formattedDate(date)}</span>}
        {time && (
          <span className="time">閱讀時間&thinsp;{time}&thinsp;分鐘</span>
        )}
      </Info>
    </div>
  )
}
