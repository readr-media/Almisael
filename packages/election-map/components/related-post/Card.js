import dayjs from 'dayjs'
import React from 'react'
import styled from 'styled-components'

/**
 * @typedef {Object} ResizedImage
 * @property {string} w800
 * @property {string} w1600
 * @property {string} w2400
 * @property {string} original
 *
 * @typedef {Object} HeroImage
 * @property {ResizedImage} resized
 *
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} slug
 * @property {HeroImage} heroImage
 * @property {string} title
 * @property {string} publishedDate
 */

export const CardWrapper = styled.div`
  width: 288px;
  height: 298px;

  background-color: #ffffff;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.06), 0px 4px 12px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  @media (min-width: 768px) {
    width: 344px;
    height: 298px;
  }
  @media (min-width: 1200px) {
    width: 240px;
    height: 293px;
  }

  img {
    border-radius: 6px 6px 0 0;
    width: 288px;
    @media (min-width: 768px) {
      width: 344px;
    }
    @media (min-width: 1200px) {
      width: 240px;
    }
  }
`

export const ImgWrapper = styled.div`
  position: relative;
  height: 192px;
  border-radius: 6px 6px 0 0;
  overflow: hidden;

  @media (min-width: 1200px) {
    width: 240px;
    height: 160px;
  }
`

export const Link = styled.a`
  text-decoration: none;
  color: gray;
  :link {
    color: gray;
  }
  :hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 2rem rgb(0 0 0 / 15%);
    transition: all 0.3s ease-in-out;
  }
  :active {
    transform: translateY(0px);
    box-shadow: 0 1rem 2rem rgb(0 0 0 / 15%);
    transition: all 0.3s ease-in-out;
  }
`

export const TextWrapper = styled.div`
  width: 100%;
  height: 106px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  padding: 10px 14px;
  @media (min-width: 1200px) {
    height: 133px;
  }

  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: rgba(0, 9, 40, 0.87);
    font-size: 16px;
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
  .date {
    color: rgba(0, 9, 40, 0.5);
    font-size: 12px;
    @media (min-width: 1200px) {
      font-size: 14px;
    }
  }
`

export const TitleWrapper = styled.div`
  width: 100%;
  height: 70px;
  overflow: hidden;
  > p {
    line-height: 1.5;
  }

  @media (min-width: 1200px) {
    height: 90px;
  }

  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: rgba(0, 9, 40, 0.87);
    font-size: 16px;
    overflow: hidden;
    @media (min-width: 1200px) {
      font-size: 16px;
      -webkit-line-clamp: 3;
    }
  }
`

export const Card = React.forwardRef(
  /**
   *
   * @param {Object} props
   * @param {Post} props.item
   * @param {Function} props.onClick
   * @returns {JSX.Element}
   */
  function Card({ item, onClick }, ref) {
    return (
      <Link
        href={`https://www.mirrormedia.mg/story/${item?.slug}`}
        target="_blank"
        rel="noreferrer"
        ref={ref}
        key={item?.id}
        onClick={() => onClick()}
      >
        <CardWrapper key={item?.id}>
          <ImgWrapper>
            <img
              src={`${item?.heroImage?.resized?.w800}`}
              alt={`${item?.title}`}
            />
          </ImgWrapper>
          <TextWrapper>
            <TitleWrapper>
              <p className="title">{item?.title}</p>
            </TitleWrapper>
            <p className="date">
              {dayjs(item?.publishedDate).format('YYYY/MM/DD HH:mm')}
            </p>
          </TextWrapper>
        </CardWrapper>
      </Link>
    )
  }
)
