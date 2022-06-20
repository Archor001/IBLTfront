<template>
  <div class="dashboard-editor-container">
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
import { getMaxFlowList } from '@/api/table'

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
      hash: [],
      maxflowlist: [],
      listLoading: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMaxFlowList().then(response => {
        this.maxflowlist = response.data.items
        this.listLoading = false
        this.initBarCharts()
        this.initGaugeCharts()
      })
    },
    initBarCharts() {
      var myBarChart = this.$echarts.init(document.getElementById('barchart'))
      var option = {
        title: {
          text: 'Top-count流信息'
        },
        // grid: {
        //   height: 300
        // },
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
            return 'hash: ' + data.value + '<br/>srcIP: ' + data.srcIP + '<br/>srcPort: ' + data.srcPort + '<br/>dstIP: ' + data.dstIP + '<br/>dstPort: ' + data.dstPort
          }
        },
        legend: {
          data: ['count']
        },
        xAxis: {
          // 横坐标是每条流的hash值
          data: this.maxflowlist.map(item => {
            return {
              value: item.hash
            }
          }
          ),
          axisTick: {
            show: false
          }
        },
        yAxis: {
          show: true,
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: 'count',
            type: 'bar',
            // 取每条流的计数值作为value 其他属性为提示框服务
            data: this.maxflowlist.map(item => {
              return {
                value: item.count,
                ...item
              }
            }),
            animationDuration: 2800,
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

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
