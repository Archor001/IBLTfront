<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="bandwith" style="height: 290px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="timedelay" style="height: 290px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getFlowList } from '@/api/table'

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
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      total: 30
    }
  },
  mounted() {
    this.initBandwithCharts()
    this.initTimedelayCharts()
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
      getFlowList().then(response => {
        this.flowlist = response.data.items
        this.listLoading = false
      })
    },
    initBandwithCharts() {
      var myChart = this.$echarts.init(document.getElementById('bandwith'))
      var option = {
        title: {
          text: '镜像带宽开销对比图'
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
            var dotColor1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>'
            var dotColor2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + params[0].axisValue + '</span>' + '<br>' +
                   dotColor1 + '<span style="color: #20253B">' + params[0].seriesName + '</span>' + '：' + (params[0].data) + '%' + '<br>' +
                   dotColor2 + '<span style="color: #20253B">' + params[1].seriesName + '</span>' + '：' + (params[1].data) + '%'
          }
        },
        legend: {
          data: ['INT/BurstRadar', 'IBLT']
        },
        xAxis: {
          data: ['最差情况', '平均情况'],
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
            name: 'INT/BurstRadar',
            type: 'bar',
            barGap: '10%',
            barMaxWidth: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            itemStyle: {
              color: '#0e1b3d'
            },
            data: [100, 100],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: 'IBLT',
            type: 'bar',
            barGap: '10%',
            barMaxWidth: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            itemStyle: {
              color: '#6a93c4'
            },
            data: [73.21, 16.38],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
      // this.chart = myChart

      // setTimeout(()=>{
      //   myChart.setOption({
      //     series: [
      //       {
      //         data: [3500, 5200, 4500, 6500, 200, 3000]
      //       }
      //     ]
      //   })
      // }, 1000)
    },
    initTimedelayCharts() {
      var myChart = this.$echarts.init(document.getElementById('timedelay'))
      var option = {
        title: {
          text: 'IBLT信息获取时延对比图'
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
            var dotColor1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>'
            var dotColor2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + params[0].axisValue + '</span>' + '<br>' +
                   dotColor1 + '<span style="color: #20253B">' + params[0].seriesName + '</span>' + '：' + (params[0].data) + '%' + '<br>' +
                   dotColor2 + '<span style="color: #20253B">' + params[1].seriesName + '</span>' + '：' + (params[1].data) + '%'
          }
        },
        legend: {
          data: ['grpc', 'IBLT']
        },
        xAxis: {
          data: ['中拥塞', '高拥塞'],
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
            name: 'grpc',
            type: 'bar',
            barGap: '10%',
            barMaxWidth: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            itemStyle: {
              color: '#0e1b3d'
            },
            data: [100, 100],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: 'IBLT',
            type: 'bar',
            barGap: '10%',
            barMaxWidth: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            itemStyle: {
              color: '#6a93c4'
            },
            data: [2.5, 0.5],
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
