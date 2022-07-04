const { Random } = require('mockjs')
const Mock = require('mockjs')

const flowdata1 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,60000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,60000)',
    count: '@integer(0,1000)',
    time: '@datetime'
  }]
})
Random.increment(-30)
const flowdata2 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,30000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,30000)',
    count: '@integer(0,2000)',
    time: '@datetime'
  }]
})
Random.increment(-30)
const flowdata3 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,30000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,30000)',
    count: '@integer(0,2000)',
    time: '@datetime'
  }]
})
Random.increment(-30)
const flowdata4 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,60000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,60000)',
    count: '@integer(0,1000)',
    time: '@datetime'
  }]
})
Random.increment(-30)
const flowdata5 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,30000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,30000)',
    count: '@integer(0,2000)',
    time: '@datetime'
  }]
})
Random.increment(-30)
const flowdata6 = Mock.mock({
  'items|30': [{
    id: '@increment',
    srcIP: '@ip()',
    srcPort: '@integer(100,30000)',
    dstIP: '@ip()',
    dstPort: '@integer(100,30000)',
    count: '@integer(0,2000)',
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
      const items1 = flowdata1.items
      const items2 = flowdata2.items
      const items3 = flowdata3.items
      return {
        code: 20000,
        data: [
          {
            total: items1.length,
            tstamp: 0,
            items: items1
          },
          {
            total: items2.length,
            tstamp: 1,
            items: items2
          },
          {
            total: items3.length,
            tstamp: 2,
            items: items3
          }
        ]
      }
    }
  },
  {
    url: '/IBLT/congest/high',
    type: 'get',
    response: config => {
      const items4 = flowdata4.items
      const items5 = flowdata5.items
      const items6 = flowdata6.items
      return {
        code: 20000,
        data: [
          {
            total: items4.length,
            tstamp: 0,
            items: items4
          },
          {
            total: items5.length,
            tstamp: 1,
            items: items5
          },
          {
            total: items6.length,
            tstamp: 2,
            items: items6
          }
        ]
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
