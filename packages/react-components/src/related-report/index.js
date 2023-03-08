import React from 'react' // eslint-disable-line
import styled from 'styled-components'
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
    background: ${
      /**
       *  @param {Object} props
       *  @param {string} props.highlightColor
       */ (props) => props.highlightColor
    };
    z-index: -1;
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
 * @typedef {import('../typedef').Post} Post
 *
 * @param {Object}  props
 * @param {Post[]}  props.relatedData
 * @param {number}  [props.ariaLevel]
 * @param {string}  [props.title='最新報導']
 * @param {string}  [props.titleClassName='related-report-title']
 * @param {string}  [props.captionClassName='related-report-caption']
 * @param {string}  [props.highlightColor='#ffffff']
 * @param {string}  [props.defaultImage='']
 * @return {JSX.Element}
 */

export default function RelatedReport({
  relatedData = [],
  ariaLevel,
  title = '最新報導',
  titleClassName = 'readr-report-title',
  captionClassName = 'readr-report-caption',
  highlightColor = '#ffffff',
  defaultImage = '',
}) {
  const checkCaptionValid = (data) => {
    return data.every(
      (obj) => obj.hasOwnProperty('caption') && obj['caption'] !== ''
    )
  }
  const checkDataValid = (data) => {
    try {
      if (!Array.isArray(data)) {
        return false
      } else if (!checkCaptionValid(data)) {
        console.log(
          `Error: Not all objects in 'relatedData' have the key 'caption'`
        )
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
      {checkDataValid(relatedData) && (
        <Container>
          <TitleBlock
            className={titleClassName}
            highlightColor={highlightColor}
          >
            <div role="heading" aria-level={ariaLevel}>
              {title}
            </div>
          </TitleBlock>

          <ul className="readr-report-wrapper">
            <RelatedList
              relatedData={relatedData}
              captionClassName={captionClassName}
              defaultImage={defaultImage}
            />
          </ul>
        </Container>
      )}
    </>
  )
}
