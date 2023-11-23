import styled from 'styled-components'
// import { data as mockData } from '../../mock-datas/maps/legislators/normal/county/63000.js'

/**
 * currently use mock data 63000.js
 */

const Wrapper = styled.section`
  .prof-rate {
    font-size: 16px;
    line-height: 23.17px;
    text-align: end;
    color: #666666;
    font-weight: 700;
    padding: 4px;
    border-bottom: 1px solid black;
  }
`
const MOCK_CANDIDATES_INFO = [
  {
    canNo: '1',
    name: '蔡英文',
    party: '貓貓黨',
    tksRate: 57.13,
    candVictor: '*',
  },
  {
    canNo: '2',
    name: '高潞．以用．巴魕剌 Kawlo．Iyun．Pacidal',
    party: '這是一個名稱很長很長很長很長很長很長的黨',
    tksRate: 57.13,
    candVictor: '',
  },
  {
    canNo: '3',
    name: '黃宏成台灣阿成世界偉人財神總統',
    party: '哭哭黨',
    tksRate: 57.13,
    candVictor: '',
  },
  {
    canNo: '4',
    name: '顏色不分藍綠支持性專區顏色田慎節',
    party: '檔檔檔黨',
    tksRate: 57.13,
    candVictor: '',
  },
]
const CandidatesInfoWrapper = styled.ul`
  list-style-type: none;
  margin: 4px auto 0;
  padding: 0;
`
const CandidateInfo = styled.li`
  list-style: none;
  font-size: 15px;
  line-height: 21.72px;
  font-weight: 400;
  padding: 0 0 2px 0;
  border-bottom: 1px dashed #afafaf;

  .name {
    font-weight: 700;
    text-align: left;
  }
  .party-and-tks-rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .tks-rate {
    font-weight: 700;
    margin-left: 4px;
  }
`
export default function InfoBox() {
  return (
    <Wrapper>
      <div className="prof-rate">投票率: 00%</div>
      <CandidatesInfoWrapper>
        {MOCK_CANDIDATES_INFO.map((candidate) => (
          <CandidateInfo key={candidate.canNo}>
            <div className="name">{candidate.name}</div>
            <div className="party-and-tks-rate">
              <span>{candidate.party}</span>
              <span className="tks-rate">{candidate.tksRate}%</span>
            </div>
          </CandidateInfo>
        ))}
      </CandidatesInfoWrapper>
    </Wrapper>
  )
}
