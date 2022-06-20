import request from '@/utils/request'

// 中拥塞流信息统计及搜索
export function getMediumFlowList(params) {
  return request({
    url: '/IBLT/congest/medium',
    method: 'post',
    params
  })
}

// export function getMediumSearch(params) {
//   return request({
//     url: '/IBLT/congest/msearch',
//     method: 'get',
//     params
//   })
// }

// 高拥塞流信息统计及搜索
export function getHighFlowList(params) {
  return request({
    url: '/IBLT/congest/high/',
    method: 'post',
    data: params
  })
}

// export function getHighSearch(params) {
//   return request({
//     url: '/IBLT/congest/hsearch',
//     method: 'get',
//     params
//   })
// }

// 高拥塞数据分析
export function getMaxFlowList(params) {
  return request({
    url: '/IBLT/congest/maxhigh',
    method: 'get',
    params
  })
}

// 细粒度SNMP
export function getSNMP(params) {
  return request({
    url: '/IBLT/compare/granular',
    method: 'get',
    params
  })
}
