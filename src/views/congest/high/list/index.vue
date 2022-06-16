<template>
  <div class="dashboard-editor-container">
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
