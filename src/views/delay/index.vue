<template>
  <div class="dashboard-editor-container">
    <!-- <el-carousel height="600px">
      <el-carousel-item v-for="item in queueList" :key="item.id">
        <el-image :src="require('../../assets/delay/pt'+(item.id)+' queue sim.svg')"></el-image>
      </el-carousel-item>
    </el-carousel> -->
    <el-row :gutter="12">
      <el-col :span="8" v-for="item in queueList" :key="item.id" style="margin-top:20px">
        <el-image
          :src="require('../../assets/delay/pt'+(item.id)+' queue sim.svg')"
          :fit="fit"></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>

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
      queueList: [
        { id: 1, title: 'pt1 queue sim' },
        { id: 4, title: 'pt4 queue sim' },
        { id: 5, title: 'pt5 queue sim' },
        { id: 6, title: 'pt6 queue sim' },
        { id: 7, title: 'pt7 queue sim' }
      ]
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
    padding: 10px 21px 0px;
    font-size: 16px;
    font-weight: lighter;
    color: #474747;
  }

  .table-wrapper {
    padding: 16px 32px 32px;
    background: #fff;
  }

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
