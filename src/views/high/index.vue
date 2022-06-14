<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="flowlist.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :stripe="stripe"
      :current-page.sync="currentPage"
      element-loading-text="Loading"
      border
      fit
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
      <el-table-column align="center" label="Count" prop="count">
      </el-table-column>
      <el-table-column align="center" prop="time" label="Time">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

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
      flowlist: null,
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 15,
      total: 30
    }
  },
  created() {
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
      getList().then(response => {
        this.flowlist = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
