import React from 'react' // eslint-disable-line
import styled from '../../styled-components.js'
import ReportInfo from './report-info.js'
import ShareImage from '@readr-media/react-image'

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
 * @param {Object} props
 * @param {Post[]}  props.postData
 * @param {string} titleClassName
 * @param {string} defaultImage
 * @return {JSX.Element}
 */

export default function RelatedList({
  postData,
  titleClassName,
  defaultImage,
}) {
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
                <ShareImage.default
                  images={post.heroImage?.resized || {}}
                  defaultImage={defaultImage}
                  alt={post.name || post.title}
                  priority={false}
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
