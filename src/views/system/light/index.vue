<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col>
        <div class="chart-wrapper">
          <div id="bandwith" style="height: 600px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="bar_one" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="bar_two" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHighPackets, getMediumPackets } from '@/api/table'

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
      flowlist: [],
      listLoading: true,
      packetNum: null
    }
  },
  mounted() {
    this.initBandwithCharts()
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
      getMediumPackets().then(response => {
        this.packetNum = response.data.items[0].sum_count
        getHighPackets().then(response => {
          this.packetNum += response.data.items[0].sum_count
          this.listLoading = false
          this.initBandwithCharts()
          this.initBarOneChart()
          this.initBarTwoChart()
        })
      })
    },
    initBarOneChart() {
      var myChart = this.$echarts.init(document.getElementById('bar_one'))
      var option = {
        title: {
          text: '镜像带宽开销'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          bottom: '10%'
        },
        grid: {
          containLable: true
        },
        series: [
          {
            center: ['50%', '45%'],
            name: 'consume',
            type: 'pie',
            radius: '50%',
            itemStyle: {
              color: '#5470c6'
            },
            data: [
              { value: 100, name: 'INT' }
            ],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initBarTwoChart() {
      var myChart = this.$echarts.init(document.getElementById('bar_two'))
      console.log(this.packetNum)
      var option = {
        title: {
          text: '镜像带宽开销占比'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{c}%'
        },
        legend: {
          orient: 'horizontal',
          bottom: '10%'
        },
        series: [
          {
            center: ['50%', '45%'],
            name: 'ratio',
            type: 'pie',
            radius: '50%',
            label: {
              formatter: '{b}:{c}%'
            },
            data: [
              // 1024*134/64/count
              { value: 1024 * 134 * 100 / (64 * this.packetNum), name: 'Burst Monitor', itemStyle: { color: '#ed7d31' }},
              { value: 100 - 1024 * 134 * 100 / (64 * this.packetNum), name: 'Background', itemStyle: { color: '#5470c6' }}
            ],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initBandwithCharts() {
      var myChart = this.$echarts.init(document.getElementById('bandwith'))
      var option = {
        title: {
          text: '镜像数据包个数对比'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow'
          },
          padding: [5, 10],
          formatter: (params) => {
            // console.log(param)
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + params[0].axisValue + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B">' + params[0].seriesName + '</span>' + '：' + (params[0].data)
          }
        },
        legend: {
          data: ['number_of_packets']
        },
        xAxis: {
          data: ['INT', 'Burst Monitor'],
          // boundaryGap: false
          axisTick: {
            show: false
          }
        },
        grid: {
          containLable: true
        },
        yAxis: {
          show: true,
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
            name: 'number_of_packets',
            type: 'bar',
            barGap: '10%',
            barMaxWidth: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            },
            itemStyle: {
              color: '#5470c6'
            },
            data: [this.packetNum, 1024],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
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
    padding: 16px 32px 32px;
    background: #fff;
  }

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
