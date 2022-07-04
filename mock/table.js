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

const granulardata = Mock.mock({
  'items|30': [{
    time: '@integer(0,30)',
    bandwith: '@integer(100,150)'
  }]
})

module.exports = [
  {
    url: '/IBLT/congest/medium',
    type: 'get',
    response: config => {
      const items = flowdata.items
      return {
        code: 20000,
        data: [
          {
            total: items.length,
            tstamp: 1,
            items: items
          },
          {
            total: items.length,
            tstamp: 2,
            items: items
          }
        ]
      }
    }
  },
  {
    url: '/IBLT/congest/high',
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
    url: '/IBLT/compare/granular',
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
