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
  }
]