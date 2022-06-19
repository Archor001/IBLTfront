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
  'items|30': [{
    time: '@integer(0,30)',
    bandwith: '@integer(100,150)'
  }]
})

const mediumsearch = Mock.mock({
  'items|10': [{
    id: '@id',
    srcIP: '10.12.176.44',
    srcPort: '@integer(100,600)',
    dstIP: '@ip()',
    dstPort: '@integer(100,600)',
    count: '@integer(0,1000)',
    time: '@datetime'
  }]
})

const highsearch = Mock.mock({
  'items|10': [{
    id: '@id',
    srcIP: '@ip()',
    srcPort: '@integer(100,600)',
    dstIP: '10.12.176.44',
    dstPort: '@integer(100,600)',
    count: '@integer(0,1000)',
    time: '@datetime'
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
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/IBLT/congest/msearch',
    type: 'get',
    response: config => {
      const items = mediumsearch.items
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
    url: '/IBLT/congest/hsearch',
    type: 'get',
    response: config => {
      const items = highsearch.items
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
    url: '/IBLT/congest/maxhigh',
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