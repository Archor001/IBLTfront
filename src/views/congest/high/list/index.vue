<template>
  <div class="dashboard-editor-container">
    <div>
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
            :current-page.sync="currentPage"
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
import { getHighFlowList } from '@/api/table'
import SrcipOption from './components/SrcipOption'
import SrcportOption from './components/SrcportOption'
import DstipOption from './components/DstipOption'
import DstportOption from './components/DstportOption'

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
      // 分页
      flowlist: [],
      listLoading: true,
      stripe: true,
      tableData: [],
      currentPage: 1,
      pagesize: 15,
      total: 0,
      // 搜索框
      searchLoading: false,
      srcip: '',
      srcport: null,
      dstip: '',
      dstport: null
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
      getHighFlowList().then(response => {
        // console.log(response)
        this.flowlist = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(err => {
        console.log('high : ', err)
      })
    },
    handleSearch() {
      // 创建请求对象
      var param = {
        srcip: this.srcip,
        srcport: this.srcport,
        dstip: this.dstip,
        dstport: this.dstport
      }
      // console.log(param)
      this.searchLoading = true
      getHighFlowList(param).then(response => {
        this.flowlist = response.data.items
        this.total = response.data.total
        this.searchLoading = false
        // console.log(response)
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
