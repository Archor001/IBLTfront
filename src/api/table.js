import request from '@/utils/request'

// 中拥塞流信息
export function getMediumFlowList(params) {
  return request({
    url: '/IBLT/congest/medium',
    method: 'get',
    params
  })
}

// 中拥塞搜索
export function getMediumSearch(params) {
  return request({
    url: '/IBLT/congest/msearch',
    method: 'get',
    params
  })
}

// 高拥塞流信息
export function getHighFlowList(params) {
  return request({
    url: '/IBLT/congest/high',
    method: 'get',
    params
  })
}

// 高拥塞搜索
export function getHighSearch(params) {
  return request({
    url: '/IBLT/congest/hsearch',
    method: 'get',
    params
  })
}

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
