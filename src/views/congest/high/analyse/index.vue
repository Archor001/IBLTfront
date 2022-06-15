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
    <div>
      <div class="table-lable">
        <label>流信息统计</label>
      </div>
      <div class="table-wrapper">
        <el-table
          v-loading="listLoading"
          :data="maxflowlist.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :stripe="stripe"
          :current-page.sync="currentPage"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
        >
          <el-table-column align="center" label="hash" prop="hash">
          </el-table-column>
          <el-table-column align="center" label="Count" prop="count" sortable>
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
      maxflowlist: [],
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 15,
      total: 30
    }
  },
  mounted() {
    this.initBarCharts()
    // this.initPieCharts()
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMaxFlowList().then(response => {
        this.maxflowlist = response.data.items
        this.listLoading = false
      })
    },
    initBarCharts() {
      var myBarChart = this.$echarts.init(document.getElementById('barchart'))
      console.log(this.maxflowlist)
      console.log('123')
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
          data: this.maxflowlist.hash,
          axisTick: {
            show: false
          }
        },
        yAxis: {},
        series: [
          {
            name: 'count',
            type: 'bar',
            data: [4336, 6854, 10, 2311, 2167, 8190, 8517],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      myBarChart.setOption(option)
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
