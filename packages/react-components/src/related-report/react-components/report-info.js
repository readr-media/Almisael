import React from 'react' // eslint-disable-line
import styled from '../../styled-components.js'
import dayjs from 'dayjs'

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

const Title = styled.div`
  word-wrap: break-word;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: #000928;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;

  p {
    display: inline;

    &:hover {
      border-bottom: 1.5px solid #000928;
    }
  }

  @media (min-width: 768px) {
    font-size: 18px;
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

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.titleClassName
 * @param {string} props.date
 * @param {number} props.time
 * @return {JSX.Element}
 */

export default function ReportInfo({ title, titleClassName, date, time }) {
  function formatPostDate(datetime) {
    const formatStr = dayjs().isSame(dayjs(datetime), 'year')
      ? 'MM/DD'
      : 'YYYY/MM/DD'
    return dayjs(datetime).format(formatStr)
  }

  function formatReadTime(readingTime = 0) {
    return readingTime
      ? `閱讀時間 ${Number(readingTime)} 分鐘`
      : `閱讀時間 10 分鐘`
  }

  return (
    <div className="report-info">
      {title && (
        <Title className={titleClassName}>
          <p>{title}</p>
        </Title>
      )}
      <Info date={date}>
        {date && <span className="date">{formatPostDate(date)}</span>}
        <span className="time">{formatReadTime(time)}</span>
      </Info>
    </div>
  )
}
