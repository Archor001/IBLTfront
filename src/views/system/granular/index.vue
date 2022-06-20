<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="snmp" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getSNMP } from '@/api/table'

// function sortByKey(array, key) {
//   return array.sort(function(a, b) {
//     var x = a[key]
//     var y = b[key]
//     return ((x < y) ? -1 : ((x < y) ? 1 : 0))
//   })
// }

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      bandwithlist: [],
      sorted_bandwithlist: [],
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      total: 30
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    fetchData() {
      this.listLoading = true
      getSNMP().then(response => {
        this.bandwithlist = response.data.items
        this.listLoading = false
        this.initSNMPCharts()
      })
    },
    initSNMPCharts() {
      var myChart = this.$echarts.init(document.getElementById('snmp'))
      const dataset1 = [[1, 101], [2, 114], [3, 132], [4, 108], [5, 105], [6, 111], [7, 109], [8, 102], [9, 114], [10, 120],
        [11, 101], [12, 114], [13, 132], [14, 108], [15, 105], [16, 111], [17, 109], [18, 102], [19, 114], [20, 120],
        [21, 101], [22, 114], [23, 132], [24, 108], [25, 105], [26, 111], [27, 109], [28, 102], [29, 114], [30, 120]]
      // const dataset2 = [[1, 50], [2, 56], [3, 79], [4, 108], [5, 128], [6, 181], [7, 260], [8, 80], [9, 221], [10, 134],
      //   [11, 155], [12, 77], [13, 231], [14, 220], [15, 201], [16, 111], [17, 99], [18, 102], [19, 65], [20, 225],
      //   [21, 132], [22, 114], [23, 132], [24, 67], [25, 250], [26, 78], [27, 90], [28, 95], [29, 114], [30, 120]]
      var option = {
        title: {
          text: 'SNMP秒级粒度'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        // color: {
        //   type: 'linear',
        //   x: 0,
        //   y: 0,
        //   x2: 0,
        //   y2: 1,
        //   colorStops: [{
        //     offset: 0, color: '#ff0b61' // 0% 处的颜色
        //   }, {
        //     offset: 1, color: '#3e8bfa' // 100% 处的颜色
        //   }],
        //   global: false // 缺省为 false
        // },
        legend: {
          data: ['snmp秒级粒度', '10ms粒度']
        },
        xAxis: {
          type: 'value',
          name: 'time(s)',
          min: 0,
          max: 30,
          splitNumber: 6,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          containLable: true
        },
        yAxis: {
          name: 'Mbps',
          show: true,
          min: 0,
          max: 300,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#86878f'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: 'snmp秒级粒度',
            smooth: true,
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            },
            type: 'line',
            // data: this.bandwithlist.map(item => {
            //   return {
            //     value: [item.time, item.bandwith]
            //   }
            // }),
            data: dataset1,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
          // {
          //   name: '10ms粒度',
          //   smooth: true,
          //   lineStyle: {
          //     width: 2
          //   },
          //   areaStyle: {
          //     color: '#f3f8ff'
          //   },
          //   type: 'line',
          //   // data: this.bandwithlist.map(item => {
          //   //   return {
          //   //     value: [item.time, item.bandwith]
          //   //   }
          //   // }),
          //   data: dataset2,
          //   animationDuration: 2800,
          //   animationEasing: 'quadraticOut'
          // }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0px;
    margin-bottom: 32px;
  }

  .table-lable {
    background: #fff;
    padding: 21px 21px 0px;
    font-size: 18px;
    font-weight: bolder;
    color: #474747;
  }

  .table-wrapper {
    padding: 32px;
    background: #fff;
  }

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
