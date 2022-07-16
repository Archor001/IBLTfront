import request from '@/utils/request'

// 中拥塞流信息统计及搜索
export function getMediumFlowList(params) {
  return request({
    url: '/IBLT/congest/medium',
    method: 'post',
    data: params
  })
}

// 高拥塞流信息统计及搜索
export function getHighFlowList(params) {
  return request({
    url: '/IBLT/congest/high/',
    method: 'post',
    data: params
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

// BurstMonitor数据包总数
export function getbmPackets(params) {
  return request({
    url: '/IBLT/congest/bm_sum',
    method: 'post',
    data: params
  })
}

// 实时性
export function getDeltaTime(params) {
  return request({
    url: '/IBLT/congest/deltatime',
    method: 'post',
    data: params
  })
}
