const Mock = require('mockjs')

const flowdata = Mock.mock({
  'items|30': [{
    id: '@id',
    srcIP: '@ip()',
    srcPort: '@integer(100,60000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,60000)',
    count: '@integer(0,1000)',
    time: '@datetime'
  }]
})

const maxflowdata = Mock.mock({
  'items|20': [{
    id: '@id',
    srcIP: '@ip()',
    srcPort: '@integer(100,60000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,60000)',
    count: '@integer(0,10000)',
    time: '@datetime',
    hash: '@integer(0,65535)'
  }]
})

const granulardata = Mock.mock({
  'items|100': [{
    time: '@integer(0,60)',
    bandwith: '@integer(100,150)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/flowlist',
    type: 'get',
    response: config => {
      const items = flowdata.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/table/maxflowlist',
    type: 'get',
    response: config => {
      const items = maxflowdata.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/table/granular',
    type: 'get',
    response: config => {
      const items = granulardata.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]