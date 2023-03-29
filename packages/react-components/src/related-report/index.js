import React from 'react' // eslint-disable-line
import styled from '../styled-components.js'
import RelatedList from './react-components/related-list.js'

const Container = styled.section`
  width: 100%;
  font-family: 'source-han-sans-traditional', sans-serif;
  > ul {
    padding: 0;
    width: calc(100% - 40px);
    margin: 0 auto 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  @media (min-width: 576px) {
    > ul {
      justify-content: space-between;
    }
  }

  @media (min-width: 768px) {
    > ul {
      max-width: 672px;
      margin: 0 auto 16px;
    }
  }
  @media (min-width: 1200px) {
    > ul {
      max-width: 1096px;
      margin: 0 auto;
      gap: 24px;
      justify-content: flex-start;
    }
  }
`

const TitleBlock = styled.div`
  width: calc(100% - 40px);
  font-size: 24px;
  font-weight: 700;
  line-height: 1em;
  letter-spacing: 0.05rem;
  color: #000928;
  margin: 0 auto 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 3px solid #000928;
  padding: 0 0 12px;

  > div {
    position: relative;
    z-index: 100;
  }

  > div:before {
    content: '';
    position: absolute;
    bottom: 28%;
    height: 42%;
    left: 0;
    right: 0;
    z-index: -1;
    background: ${
      /**
       *  @param {Object} props
       *  @param {string} props.highlightColor
       */ (props) => props.highlightColor
    };
  }

  @media (min-width: 768px) {
    margin: 0 auto 40px;
    max-width: 672px;
  }

  @media (min-width: 1200px) {
    max-width: 1096px;
  }
`
/**
 *  @typedef  {Object}             ResizedImages
 *  @property {string}             [original]
 *  @property {string}             [w480]
 *  @property {string}             [w800]
 *  @property {string}             [w1200]
 *  @property {string}             [w1600]
 *  @property {string}             [w2400]
 */
/**
 *  @typedef  {Object}              Post
 *  @property {number|string}       id
 *  @property {string}              [name]
 *  @property {string}              [title]
 *  @property {number}              [readingTime]
 *  @property {string}              [publishTime]
 *  @property {ResizedImages|null}  [images]
 *  @property {string}              [link]
 */
/**
 * @param {Object}      props
 * @param {Post[]}      props.postData
 * @param {number}      [props.ariaLevel]
 * @param {string}      [props.header='最新報導']
 * @param {string}      [props.headerClassName='report-header']
 * @param {string}      [props.titleClassName='report-title']
 * @param {string}      [props.highlightColor='#ffffff']
 * @param {string}      [props.defaultImage='']
 * @param {import('@readr-media/react-image/dist/react-components').Rwd}         [props.rwd]
 * @param {import('@readr-media/react-image/dist/react-components').Breakpoint}  [props.breakpoint]
 * @return {JSX.Element}
 */

export default function RelatedReport({
  postData,
  ariaLevel,
  header = '最新報導',
  headerClassName = 'report-header',
  titleClassName = 'report-title',
  highlightColor = '#ffffff',
  defaultImage = '',
  rwd,
  breakpoint,
}) {
  const checkDataValid = (data) => {
    try {
      //check `postData` is an array
      if (!Array.isArray(data)) {
        return false
      } else {
        return true
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }

  return (
    <>
      {checkDataValid(postData) && (
        <Container>
          <TitleBlock
            className={headerClassName}
            highlightColor={highlightColor}
          >
            <div role="heading" aria-level={ariaLevel}>
              {header}
            </div>
          </TitleBlock>

          <ul className="report-wrapper">
            <RelatedList
              postData={postData}
              titleClassName={titleClassName}
              defaultImage={defaultImage}
              rwd={rwd}
              breakpoint={breakpoint}
            />
          </ul>
        </Container>
      )}
    </>
  )
}
