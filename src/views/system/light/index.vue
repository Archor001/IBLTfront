<template>
  <div class="dashboard-editor-container">
    <div class="list-label">
      <i class="el-icon-view"></i>
      轻量级对比页面
    </div>
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
          <div id="pie" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper" style="padding-bottom: 16px;">
          <el-card style="card">
            <div slot="header" class="card-header">
              镜像数据包个数对比日志
            </div>
            <el-table
              :data="packetNumLog"
              :row-style="{height:'10px'}"
              style="font-size: 16px;"
              size="mini"
              height="286"
            >
              <el-table-column align="center" label="time" prop="time">
              </el-table-column>
              <el-table-column align="center" label="INT/BurstRadar" prop="int">
              </el-table-column>
              <el-table-column align="center" label="BurstMonitor" prop="bm">
              </el-table-column>
            </el-table>
          </el-card>
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
      bmPacketNum: null,
      timer: null,
      packetNumLog: [],
      timeArray: []
    }
  },
  mounted() {
    this.initPacketNumChart()
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
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          getHighPackets().then(response => {
            this.brPacketNum = response.data[0].items[0].sum_count
            getMediumPackets().then(response => {
              this.brPacketNum += response.data[0].items[0].sum_count
              this.brPacketNum = Math.round(this.brPacketNum / 0.0251682639824418)
              getbmPackets().then(response => {
                this.bmPacketNum = response.data[0].items[0].sum_count
                this.initPacketNumChart()
                this.initBandwithCsmChart()
                this.initPieChart()
                var logEntry = {
                  time: response.data[0].time,
                  int: this.brPacketNum,
                  bm: this.bmPacketNum
                }
                // 判断此时间戳的数据包个数对比信息是否已存在
                if (this.timeArray.indexOf(logEntry.time) === -1) {
                  this.timeArray.unshift(logEntry.time)
                  this.packetNumLog.unshift(logEntry)
                }
              })
            })
          })
        }, 0)
      }, 1000)
    },
    initPacketNumChart() {
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
    initBandwithCsmChart() {
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
            data: [100, (100 * 80 * this.bmPacketNum / 75 / this.brPacketNum).toFixed(2)],
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initPieChart() {
      var myChart = this.$echarts.init(document.getElementById('pie'))
      var consumee = this.bmPacketNum * 100 / this.brPacketNum
      var option = {
        title: {
          text: '镜像数据包个数占比'
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
              { value: 100 - parseFloat(consumee).toFixed(2), name: 'INT/BurstRadar', itemStyle: { color: '#5470c6' }},
              { value: parseFloat(consumee).toFixed(2), name: 'BurstMonitor', itemStyle: { color: '#ed7d31' }}
            ],
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    this.packetNumLog = null
    this.timeArray = null
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

  .list-label {
    background: #fff;
    padding: 16px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 32px;
    color: #474747;
    text-align: center;
  }

  .card-header {
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #474747;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
