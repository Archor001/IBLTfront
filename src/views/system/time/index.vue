<template>
  <div class="dashboard-editor-container">
    <div class="list-label">
      <i class="el-icon-view"></i>
      实时性对比页面
    </div>
    <el-row :gutter="32">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="grpc" style="height: 600px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div id="mirror" style="height: 600px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDeltaTime } from '@/api/table'

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
      grpcList: [],
      mirrorList: []
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
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          getDeltaTime({ transport: 'grpc' }).then(response => {
            this.grpcList = response.data
            if (this.grpcList.length !== 0) {
              this.grpcList = response.data[0].items
              this.grpcList.reverse()
              for (var i = 0; i < this.grpcList.length; i++) {
                this.grpcList[i]['id'] = i + 1
              }
              this.initGrpcChart()
            }
            getDeltaTime({ transport: 'mirror' }).then(response => {
              this.mirrorList = response.data
              if (this.mirrorList.length !== 0) {
                this.mirrorList = response.data[0].items
                this.mirrorList.reverse()
                for (var i = 0; i < this.mirrorList.length; i++) {
                  this.mirrorList[i]['id'] = i + 1
                }
                this.initMirrorChart()
              }
            })
          })
        }, 0)
      }, 1000)
    },
    initGrpcChart() {
      var myChart = this.$echarts.init(document.getElementById('grpc'))
      var option = {
        title: {
          text: 'GRPC传输时延统计'
        },
        grid: {
          top: '15%'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow'
          },
          padding: [5, 10],
          formatter: (params) => {
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + 'id: ' + params[0].axisValue + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'time: ' + '</span>' + (params[0].data.time) + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'deltatime: ' + '</span>' + (params[0].data.dtime) + 'us'
          }
        },
        legend: {
          data: ['delta_time'],
          bottom: '3%'
        },
        xAxis: {
          name: 'id',
          nameGap: 25,
          nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 15
          },
          data: this.grpcList.map(item => {
            return {
              value: item.id
            }
          }
          ),
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: 'deltatime / us',
          nameGap: 25,
          nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 15
          },
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
            name: 'delta_time',
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
            data: this.grpcList.map(item => {
              return {
                value: item.dtime,
                ...item
              }
            }),
            animationDuration: 280,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myChart.setOption(option)
    },
    initMirrorChart() {
      var myChart = this.$echarts.init(document.getElementById('mirror'))
      var option = {
        title: {
          text: 'IBLT传输时延统计'
        },
        grid: {
          top: '15%'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow'
          },
          padding: [5, 10],
          formatter: (params) => {
            console.log(params)
            var dotColor = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>'
            return '<span style="font-size:14px;font-weight: 600;color: #20253B">' + 'id: ' + params[0].axisValue + '</span>' + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'time: ' + '</span>' + (params[0].data.time) + '<br>' +
                   dotColor + '<span style="color: #20253B">' + 'deltatime: ' + '</span>' + (params[0].data.dtime) + 'us'
          }
        },
        legend: {
          data: ['delta_time'],
          bottom: '3%'
        },
        xAxis: {
          name: 'id',
          nameGap: 25,
          nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 15
          },
          data: this.mirrorList.map(item => {
            return {
              value: item.id
            }
          }
          ),
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: 'deltatime / us',
          nameGap: 25,
          nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 15
          },
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
            name: 'delta_time',
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
            data: this.mirrorList.map(item => {
              return {
                value: item.dtime,
                ...item
              }
            }),
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
    this.grpcList = null
    this.mirrorList = null
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
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
