import request from '@/utils/request'

// 中拥塞流信息统计及搜索
export function getMediumFlowList(params) {
  return request({
    url: '/IBLT/congest/medium',
    method: 'get',
    data: params
  })
}

// 高拥塞流信息统计及搜索
export function getHighFlowList(params) {
  return request({
    url: '/IBLT/congest/high/',
    method: 'get',
    data: params
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

// 高拥塞数据包总数
export function getHighPackets(params) {
  return request({
    url: '/IBLT/congest/high_sum',
    method: 'post',
    data: params
  })
}

// 中拥塞数据包总数
export function getMediumPackets(params) {
  return request({
    url: '/IBLT/congest/medium_sum',
    method: 'post',
    data: params
  })
}
