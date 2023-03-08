import React, { useState } from 'react' // eslint-disable-line
import styled from 'styled-components'
import DefaultImage from './image/default-image.js'
import ReportInfo from './report-info.js'

const RelatedItem = styled.li`
  list-style: none;
  width: 100%;
  margin: 0 0 16px;
  cursor: pointer;

  > a {
    text-decoration: none;
    color: #000928;
    display: flex;
  }

  @media (min-width: 576px) {
    margin: 0 0 32px;
    width: calc(50% - 12px);

    > a {
      display: block;
    }
  }
  @media (min-width: 960px) {
    margin: 0 0 60px;
  }

  @media (min-width: 1200px) {
    width: calc(25% - 18px);
  }
`

const ImgBlock = styled.figure`
  display: block;
  align-self: flex-start;
  min-width: calc(27.27% - 4.3632px);
  width: calc(27.27% - 4.3632px);
  aspect-ratio: 1 / 1;
  margin: 0 16px 0 0;
  overflow: hidden;
  background: #f4ebfe;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (min-width: 576px) {
    width: 100%;
    aspect-ratio: 1.9 / 1;
    display: block;
    min-width: none;
    margin: 0 0 12px;
  }
`

function ReportImage({ imgSrc, postAmount, alt }) {
  const [errored, setErrored] = useState(false)
  return (
    <ImgBlock amount={postAmount}>
      {imgSrc && !errored ? (
        <img src={imgSrc} onError={() => setErrored(true)} alt={alt} />
      ) : (
        <DefaultImage />
      )}
    </ImgBlock>
  )
}

export default function RelatedList({
  relatedData,
  captionClassName,
  defaultImage,
}) {
  return (
    <>
      {relatedData.map((item, index) => {
        return (
          <RelatedItem
            key={item.id ? item.id : index}
            className="readr-report-list"
            postAmount={relatedData.length}
          >
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ReportImage
                postAmount={relatedData.length}
                imgSrc={item.imageUrl ? item.imageUrl : defaultImage}
                alt={item.alt}
              />
              <ReportInfo
                caption={item.caption}
                captionClassName={captionClassName}
                date={item.date}
                time={item.time}
              />
            </a>
          </RelatedItem>
        )
      })}
    </>
  )
}
