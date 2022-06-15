<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="barchart" style="height: 290px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="piechart" style="height: 290px; width: 100%;"></div>
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
      count: [],
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
        this.initBarCharts(this.maxflowlist)
        this.initPieCharts(this.maxflowlist)
      })
    },
    initBarCharts() {
      this.hash = this.maxflowlist.map(item => {
        return item.hash
      })
      this.count = this.maxflowlist.map(item => {
        return item.count
      })
      // console.log(this.hash)
      var myBarChart = this.$echarts.init(document.getElementById('barchart'))
      var option = {
        title: {
          text: 'Top-count流信息'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        legend: {
          data: ['count']
        },
        xAxis: {
          data: this.hash,
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
            data: this.count,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myBarChart.setOption(option)
    },
    initPieCharts(arr) {
      var myPieChart = this.$echarts.init(document.getElementById('piechart'))
      var eva = this.maxflowlist[0].count/100
      var option = {
        title: {
          text: '流量预警'
        },
        series: {
          name: '最大流占阈值比',
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '80%',
          min: 0,
          max: 100,
          splitNumber: 5,
          axisLine: {
            show: true,
            LineStylee: {
              width: 5,
              color: [
                [0.1, 'red'],
                [0.2, 'green']
              ]
            }
          },
          detail: {
            formatter: '{value}%'
          },
          data: [{
            value: eva,
            name: 'Percent'
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
