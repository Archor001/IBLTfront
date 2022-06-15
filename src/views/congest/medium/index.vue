<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="qdepth" style="height: 290px; width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div id="timedelta" style="height: 290px; width: 100%;"></div>
        </div>
      </el-col>
    </el-row>

    <div>
      <div class="table-lable">
        <label>流信息统计</label>
      </div>
      <div class="table-wrapper">
        <el-table
          v-loading="listLoading"
          :data="flowlist.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :stripe="stripe"
          :current-page.sync="currentPage"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
        >
          <el-table-column align="center" label="ID">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Source_IP" prop="srcIP">
          </el-table-column>
          <el-table-column align="center" label="Source_Port" prop="srcPort">
          </el-table-column>
          <el-table-column align="center" label="Destination_IP" prop="dstIP">
          </el-table-column>
          <el-table-column align="center" label="Destination_Port" prop="dstPort">
          </el-table-column>
          <el-table-column align="center" label="Count" prop="count" sortable>
          </el-table-column>
          <el-table-column align="center" prop="time" label="Time" sortable>
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.time }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" style="margin-top:32px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 15, 20]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

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
    this.initQdepthCharts()
    this.initTimedeltaCharts()
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
    initQdepthCharts() {
      var myChart = this.$echarts.init(document.getElementById('qdepth'))
      var option = {
        title: {
          text: '队列深度'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#ff0b61' // 0% 处的颜色
          }, {
            offset: 1, color: '#3e8bfa' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        legend: {
          data: ['深度']
        },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            name: '深度',
            smooth: true,
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            },
            type: 'line',
            data: [4336, 6854, 10, 2311, 2167, 8190, 8517],
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
    initTimedeltaCharts() {
      var myChart = this.$echarts.init(document.getElementById('timedelta'))
      var option = {
        title: {
          text: '排队时延'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#ff0b61' // 0% 处的颜色
          }, {
            offset: 1, color: '#3e8bfa' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        legend: {
          data: ['时延']
        },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            show: false
          }
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
            name: '时延',
            smooth: true,
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            },
            type: 'line',
            data: [6096, 4708, 4034, 2380, 3759, 8439, 8052],
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
