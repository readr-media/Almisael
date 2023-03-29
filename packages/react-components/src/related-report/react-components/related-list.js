import React from 'react' // eslint-disable-line
import styled from '../../styled-components.js'
import ReportInfo from './report-info.js'
import SharedImage from '@readr-media/react-image'

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

const ImgBlock = styled.picture`
  display: block;
  align-self: flex-start;
  min-width: calc(27.27% - 4.3632px);
  width: calc(27.27% - 4.3632px);
  aspect-ratio: 1 / 1;
  margin: 0 16px 0 0;
  overflow: hidden;

  img {
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

/**
 * @typedef {import('../index').Post} Post
 *
 * @param {Object}      props
 * @param {Post[]}      props.postData
 * @param {string}      props.titleClassName
 * @param {string}      props.defaultImage
 * @param {import('@readr-media/react-image/dist/react-components').Rwd}         [props.rwd]
 * @param {import('@readr-media/react-image/dist/react-components').Breakpoint}  [props.breakpoint]
 * @return {JSX.Element}
 */

export default function RelatedList({
  postData,
  titleClassName,
  defaultImage,
  rwd,
  breakpoint,
}) {
  //breakpoint applicable to READr 3.0
  const READr_DEFAULT_BREAKPOINT = {
    mobile: '320px',
    tablet: '768px',
    laptop: '1200px',
    desktop: '1440px',
  }

  return (
    <>
      {postData.map((post, index) => {
        return (
          <RelatedItem
            key={post.id ? post.id : index}
            className="report-list"
            postAmount={postData.length}
          >
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              <ImgBlock>
                <SharedImage.default
                  images={post.images || {}}
                  defaultImage={defaultImage}
                  alt={post.name}
                  priority={false}
                  rwd={rwd}
                  breakpoint={breakpoint || READr_DEFAULT_BREAKPOINT}
                />
              </ImgBlock>
              <ReportInfo
                title={post.name}
                titleClassName={titleClassName}
                date={post.publishTime}
                time={post.readingTime}
              />
            </a>
          </RelatedItem>
        )
      })}
    </>
  )
}
