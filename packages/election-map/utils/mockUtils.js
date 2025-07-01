import { mapRecallToLegislator as mapRecallToLegislatorCore } from './dataSourceMapping'

// TODO: 當 API 更新後移除此映射函數
// 此檔案保持向後相容性，實際邏輯已移至 dataSourceMapping.js
const mapRecallToLegislator = mapRecallToLegislatorCore

export { mapRecallToLegislator }
