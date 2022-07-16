<template>
  <div class="dashboard-editor-container">

    <!-- 队列深度 & 排队时延
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
    </el-row> -->

    <div>
      <div class="list-label">
        <i class="el-icon-view"></i>
        高拥塞完整流信息统计
      </div>
      <div class="table-lable">
        <SrcipOption v-model="srcip" @keyup.enter.native="handleSearch" />
        <SrcportOption v-model="srcport" @keyup.enter.native="handleSearch" />
        <DstipOption v-model="dstip" @keyup.enter.native="handleSearch" />
        <DstportOption v-model="dstport" @keyup.enter.native="handleSearch" />
        <el-button :loading="searchLoading" style="margin:0 0 20px 20px;" type="primary" @click="handleSearch">
          搜索
        </el-button>
        <el-button :loading="searchLoading" style="margin:0 0 20px 20px;" type="primary" @click="fetchData">
          展示所有
        </el-button>
      </div>
      <div class="table-wrapper">
        <el-table
          v-loading="listLoading"
          :data="flowlist.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :stripe="stripe"
          :current-page.sync="currentPage"
          :row-style="{height:'50px'}"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
          @sort-change="sortChange"
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
          <el-table-column align="center" label="Count" prop="count" sortable='custom'>
          </el-table-column>
          <el-table-column align="center" prop="time" label="Time" sortable='custom'>
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.time }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" style="margin-top:32px">
          <el-row :gutter="24">
            <el-col :span="16">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 15, 20]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="medium" round style="float:right;" @click="jumpToAnalyse($route.query.timeEqu)">分析</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!-- <div class="table-lable">
      <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show1">
        1970-1-1
      </el-button>
      <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show">
        1970-1-1
      </el-button>
      <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show">
        1970-1-1
      </el-button>
      <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show">
        1970-1-1
      </el-button>
      <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show">
        1970-1-1
      </el-button>
      <div v-for="item in items" :key="item.time">
        <el-button style="height:250px;width:19%;margin:0 0.5% 20px;" type="primary" @click="show">
          {{ item.time }}
        </el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getHighFlowList } from '@/api/table'
import SrcipOption from '../../components/SrcipOption'
import SrcportOption from '../../components/SrcportOption'
import DstipOption from '../../components/DstipOption'
import DstportOption from '../../components/DstportOption'

export default {
  components: { SrcipOption, SrcportOption, DstipOption, DstportOption },
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
      // 中拥塞流信息
      flowlist: [],
      // 处理分页
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      total: 0,
      // 搜索框
      searchLoading: false,
      srcip: '',
      srcport: null,
      dstip: '',
      dstport: null,

      timeEqu: null
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
      // this.initQdepthCharts()
      // this.initTimedeltaCharts()
      this.timeEqu = this.$route.query.timeEqu
      // console.log(this.timeEqu)
      this.fetchData()
    },
    jumpToAnalyse(time) {
      // console.log(time)
      this.$router.push({ name: 'HAnalyse', query: { timeEqu: time }})
    },
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    fetchData() {
      // window.setInterval(() => {
      //   setTimeout(() => {
      //     this.listLoading = true
      //     getHighFlowList().then(response => {
      //       this.flowlist = response.data.items
      //       this.total = response.data.total
      //       this.listLoading = false
      //     })
      //   },0)
      // },10)
      this.listLoading = true
      getHighFlowList({ timeequ: this.timeEqu }).then(response => {
        if (response.data.length !== 0) {
          this.flowlist = response.data[0].items
          this.total = response.data[0].total
        } else {
          this.flowlist = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    handleSearch() {
      // 创建请求对象
      var param = {
        srcip: this.srcip,
        srcport: this.srcport,
        dstip: this.dstip,
        dstport: this.dstport,
        timeequ: this.timeEqu
      }
      // console.log(param)
      this.searchLoading = true
      getHighFlowList(param).then(response => {
        if (response.data.length !== 0) {
          this.flowlist = response.data[0].items
          this.total = response.data[0].total
        } else {
          this.flowlist = []
          this.total = 0
        }
        this.searchLoading = false
        // console.log(response)
      })
    },
    // initQdepthCharts() {
    //   var myChart = this.$echarts.init(document.getElementById('qdepth'))
    //   var option = {
    //     title: {
    //       text: '队列深度'
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       show: true,
    //       axisPointer: {
    //         type: 'cross'
    //       },
    //       padding: [5, 10]
    //     },
    //     color: {
    //       type: 'linear',
    //       x: 0,
    //       y: 0,
    //       x2: 0,
    //       y2: 1,
    //       colorStops: [{
    //         offset: 0, color: '#ff0b61' // 0% 处的颜色
    //       }, {
    //         offset: 1, color: '#3e8bfa' // 100% 处的颜色
    //       }],
    //       global: false // 缺省为 false
    //     },
    //     legend: {
    //       data: ['深度']
    //     },
    //     xAxis: {
    //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //       // boundaryGap: false
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     grid: {
    //       containLable: true
    //     },
    //     yAxis: {
    //       show: true,
    //       axisLine: {
    //         show: true,
    //         lineStyle: {
    //           color: '#86878f'
    //         }
    //       },
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     series: [
    //       {
    //         name: '深度',
    //         smooth: true,
    //         lineStyle: {
    //           width: 2
    //         },
    //         areaStyle: {
    //           color: '#f3f8ff'
    //         },
    //         type: 'line',
    //         data: [4336, 6854, 10, 2311, 2167, 8190, 8517],
    //         animationDuration: 2800,
    //         animationEasing: 'quadraticOut'
    //       }
    //     ]
    //   }
    //   myChart.setOption(option)
    //   // this.chart = myChart

    //   // setTimeout(()=>{
    //   //   myChart.setOption({
    //   //     series: [
    //   //       {
    //   //         data: [3500, 5200, 4500, 6500, 200, 3000]
    //   //       }
    //   //     ]
    //   //   })
    //   // }, 1000)
    // },
    // initTimedeltaCharts() {
    //   var myChart = this.$echarts.init(document.getElementById('timedelta'))
    //   var option = {
    //     title: {
    //       text: '排队时延'
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       show: true,
    //       axisPointer: {
    //         type: 'cross'
    //       },
    //       padding: [5, 10]
    //     },
    //     color: {
    //       type: 'linear',
    //       x: 0,
    //       y: 0,
    //       x2: 0,
    //       y2: 1,
    //       colorStops: [{
    //         offset: 0, color: '#ff0b61' // 0% 处的颜色
    //       }, {
    //         offset: 1, color: '#3e8bfa' // 100% 处的颜色
    //       }],
    //       global: false // 缺省为 false
    //     },
    //     legend: {
    //       data: ['时延']
    //     },
    //     xAxis: {
    //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     yAxis: {
    //       show: true,
    //       axisLine: {
    //         show: true,
    //         lineStyle: {
    //           color: '#86878f'
    //         }
    //       },
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     series: [
    //       {
    //         name: '时延',
    //         smooth: true,
    //         lineStyle: {
    //           width: 2
    //         },
    //         areaStyle: {
    //           color: '#f3f8ff'
    //         },
    //         type: 'line',
    //         data: [6096, 4708, 4034, 2380, 3759, 8439, 8052],
    //         animationDuration: 2800,
    //         animationEasing: 'quadraticOut'
    //       }
    //     ]
    //   }
    //   myChart.setOption(option)
    // },
    sortChange(column) {
      this.currentPage = 1 // 排序后返回第一页
      if (column.order === 'descending') {
        this.flowlist.sort((a, b) => b[column.prop] - a[column.prop])
      } else if (column.order === 'ascending') {
        this.flowlist.sort((a, b) => a[column.prop] - b[column.prop])
      }
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

  .font-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 6px;
  }

  .list-label {
    background: #fff;
    padding: 16px;
    font-size: 20px;
    font-weight: bold;
    color: #474747;
    text-align: center;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
