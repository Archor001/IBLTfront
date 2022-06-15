import request from '@/utils/request'

export function getFlowList(params) {
  return request({
    url: '/vue-admin-template/table/flowlist',
    method: 'get',
    params
  })
}

export function getMaxFlowList(params) {
  return request({
    url: '/vue-admin-template/table/maxflowlist',
    method: 'get',
    params
  })
}
