<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="packetNum" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="bandwithCsm" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="pie_one" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="pie_two" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHighPackets, getMediumPackets, getbmPackets } from '@/api/table'

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
      brPacketNum: null,
      bmPacketNum: null
    }
  },
  mounted() {
    this.initPacketNumCharts()
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
      window.setInterval(() => {
        setTimeout(() => {
          getHighPackets().then(response => {
            this.brPacketNum = response.data[0].items[0].sum_count
            getMediumPackets().then(response => {
              this.brPacketNum += response.data[0].items[0].sum_count
              getbmPackets().then(response => {
                this.bmPacketNum = response.data[0].items[0].sum_count
                this.initPacketNumCharts()
                this.initBandwithCsmCharts()
                this.initPieOneChart()
                this.initPieTwoChart()
              })
            })
          })
        }, 0)
      }, 500)
    },
    initPieOneChart() {
      var myChart = this.$echarts.init(document.getElementById('pie_one'))
      var option = {
        title: {
          text: 'INT镜像数据包开销'
        },
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            var data = param.data
            console.log(param)
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param.color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + 'Consume' + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B;width:100px">' + data.name + '</span>' + ' ' + (data.value) + '<br>'
          }
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
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initPieTwoChart() {
      var myChart = this.$echarts.init(document.getElementById('pie_two'))
      var consumee = this.bmPacketNum * 134 * 100 / (64 * this.brPacketNum)
      var option = {
        title: {
          text: '镜像数据包开销占比'
        },
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            var data = param.data
            console.log(param)
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param.color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + 'Ratio' + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B;width:100px">' + data.name + '</span>' + ' ' + (data.value) + '%' + '<br>'
          }
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
              { value: 100 - parseFloat(consumee).toFixed(2), name: 'unused bandwith', itemStyle: { color: '#5470c6' }},
              { value: parseFloat(consumee).toFixed(2), name: 'BurstMonitor', itemStyle: { color: '#ed7d31' }}
            ],
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initPacketNumCharts() {
      var myChart = this.$echarts.init(document.getElementById('packetNum'))
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
          data: ['number_of_packets'],
          bottom: '3%'
        },
        xAxis: {
          data: ['INT/BurstRadar', 'BurstMonitor'],
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
            data: [this.brPacketNum, this.bmPacketNum],
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initBandwithCsmCharts() {
      var myChart = this.$echarts.init(document.getElementById('bandwithCsm'))
      var option = {
        title: {
          text: '镜像带宽开销对比'
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
                   dotColor + '<span style="color: #20253B">' + params[0].seriesName + '</span>' + ':' + (params[0].data)
          }
        },
        legend: {
          data: ['comsume_of_bandwith'],
          bottom: '3%'
        },
        xAxis: {
          data: ['INT', 'BurstMonitor'],
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
            name: 'comsume_of_bandwith',
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
            data: [100, (80 * this.bmPacketNum / 75 / this.brPacketNum)],
            animationDuration: 280,
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
