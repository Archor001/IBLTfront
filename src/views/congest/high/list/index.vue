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

    <!-- <div>
      <div class="table-lable">
        <label>流信息统计</label>
      </div>
      <div class="table-lable">
        <SrcipOption v-model="srcip"/>
        <SrcportOption v-model="srcport"/>
        <DstipOption v-model="dstip"/>
        <DstportOption v-model="dstport"/>
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
    </div> -->
  <el-row :gutter="12">
    <el-col :span="12" v-for="item in flowlist" :key="item.time" style="margin-top:20px;height:315px">
      <el-card style="card" shadow="hover">
        <div slot="header">
          <i class="el-icon-time" />
          <span>{{ item.time }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click.native="showPage(item.time)">点击查看完整流信息</el-button>
        </div>
        <!-- <div v-for="o in 10" :key="o">
          {{ '列表内容 ' + o }}
        </div> -->
          <el-table
            :data="item.items.slice(0,5)"
            :stripe="stripe"
            :row-style="{height:'10px'}"
            size="mini"
            highlight-current-row
          >
            <el-table-column align="center" label="ID" width="50%">
              <template slot-scope="scope">
                {{ scope.$index }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="SrcIP" prop="srcIP">
            </el-table-column>
            <el-table-column align="center" label="SrcPort" prop="srcPort" width="80%">
            </el-table-column>
            <el-table-column align="center" label="DstIP" prop="dstIP">
            </el-table-column>
            <el-table-column align="center" label="DstPort" prop="dstPort" width="80%">
            </el-table-column>
            <el-table-column align="center" label="Count" prop="count" width="80%">
            </el-table-column>
            <el-table-column align="center" prop="time" label="Time" width="220%">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span>{{ scope.row.time }}</span>
              </template>
            </el-table-column>
          </el-table>

      </el-card>
    </el-col>
  </el-row>

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
      // 中拥塞流信息
      flowlist: [],
      // 处理分页
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      total: 30,
      // 搜索框
      searchLoading: false,
      srcip: '',
      srcport: null,
      dstip: '',
      dstport: null
    }
  },
  mounted() {
    // this.initQdepthCharts()
    // this.initTimedeltaCharts()
    this.fetchData()
  },
  methods: {
    showPage(time) {
      console.log(time)
      this.$router.push({ name: 'HPage', query: { timeEqu: time }})
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
      getHighFlowList().then(response => {
        this.flowlist = response.data
        this.flowlist.sort((a, b) => { return a.time < b.time })
        this.total = response.data.total
        this.listLoading = false
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
