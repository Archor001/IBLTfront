<template>
  <div class="dashboard-editor-container">
    <div class="list-label">
      <i class="el-icon-view"></i>
      <span v-if=" this.$route.query.timeEqu "> {{ this.$route.query.timeEqu }} 流信息统计</span>
      <span v-else> 最新时间戳流信息统计 </span>
    </div>
    <el-row :gutter="32">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="barchart" style="height: 600px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="piechart" style="height: 400px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHighFlowList } from '@/api/table'

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
      timeEqu: null,
      limit: 20,
      maxflowlist: [],
      timer: null
    }
  },
  mounted() {
    this.initialData()
  },
  watch: {
    $route(to, from) {
      this.initialData()
    }
  },
  methods: {
    initialData() {
      this.timeEqu = this.$route.query.timeEqu
      this.fetchData()
    },
    fetchData() {
      // 显示最新流
      if (this.timeEqu === null) {
        this.timer = window.setInterval(() => {
          setTimeout(() => {
            getHighFlowList().then(response => {
              this.timeEqu = response.data[response.data.length - 1].time
              console.log(response)
              var param = {
                limit: this.limit,
                count: '1',
                timeequ: this.timeEqu
              }
              getHighFlowList(param).then(response => {
                this.maxflowlist = response.data[0].items
                this.initBarCharts()
                this.initGaugeCharts()
              })
            })
          }, 0)
        }, 1000)
      } else {
        this.timer = window.setInterval(() => {
          setTimeout(() => {
            var param = {
              limit: this.limit,
              count: '1',
              timeequ: this.timeEqu
            }
            getHighFlowList(param).then(response => {
              this.maxflowlist = response.data[0].items
              this.initBarCharts()
              this.initGaugeCharts()
            })
          }, 0)
        }, 1000)
      }
    },
    initBarCharts() {
      var myBarChart = this.$echarts.init(document.getElementById('barchart'))
      var option = {
        title: {
          text: 'Top-count流信息'
        },
        grid: {
          top: '15%',
          right: '12.5%'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow'
          },
          padding: [5, 10],
          // 提示框显示除了XY轴之外的流信息 如流IP流端口
          formatter: (param) => {
            var data = param[0].data
            // console.log(param)
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param[0].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + 'Rank: ' + param[0].axisValue + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'srcIP: ' + '</span>' + (data.srcIP) + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'srcPort: ' + '</span>' + (data.srcPort) + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'dstIP: ' + '</span>' + (data.dstIP) + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'dstPort: ' + '</span>' + (data.dstPort) + '<br>'
          }
        },
        legend: {
          data: ['count']
        },
        xAxis: {
          // 横坐标是rank
          name: 'rank',
          nameGap: 25,
          nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 15
          },
          data: this.maxflowlist.map(item => {
            return {
              value: item.ID
            }
          }
          ),
          axisTick: {
            show: false
          }
        },
        yAxis: {
          splitNumber: 6,
          name: '流大小',
          nameGap: 25,
          nameTextStyle: {
            fontSize: 15,
            fontStyle: 'italic',
            fontWeight: 'bold'
          },
          show: true,
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: 'count',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            // 取每条流的计数值作为value 其他属性为提示框服务
            data: this.maxflowlist.map(item => {
              return {
                value: item.count,
                ...item
              }
            }),
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myBarChart.setOption(option)
    },
    initGaugeCharts() {
      var myPieChart = this.$echarts.init(document.getElementById('piechart'))
      // 取第一条流作为预警信息
      var eva = this.maxflowlist[0].count / 100
      var option = {
        title: { text: '流量预警' },
        series: {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 8,
          axisLine: {
            // show: true,
            lineStyle: {
              width: 6,
              color: [
                [0.125, '#72ff04'],
                [0.25, '#a3ff18'],
                [0.375, '#d8ff29'],
                [0.5, '#ecf02d'],
                [0.625, '#f0dd29'],
                [0.75, '#f6bd25'],
                [0.875, '#fb731d'],
                [1, '#fe3714']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '15%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          title: {
            offsetCenter: [0, '-15%'],
            fontSize: 30
          },
          name: '最大流占阈值比',
          center: ['50%', '85%'],
          radius: '150%',
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: '{value}%',
            color: 'auto'
          },
          data: [{
            value: eva,
            name: '最大流占阈值比'
          }]
        }
      }
      myPieChart.setOption(option)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    this.timeEqu = null
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

  .list-label {
    background: #fff;
    padding: 16px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 32px;
    color: #474747;
    text-align: center;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
