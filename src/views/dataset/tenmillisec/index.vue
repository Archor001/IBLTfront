<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :span="6" v-for="item in List" :key="item.id" style="margin-top:20px">
        <el-image
          :src="require('../../../assets/bandwith/pt' + (item.id) + ' link speed per ' + item.gap[2] + item.suffix)"
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
      List: [
        { id: 1, suffix: ' 字节554535994 时间345.002842.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 2, suffix: ' 字节531349147 时间337.374799.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 3, suffix: ' 字节682421076 时间223.316077.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 4, suffix: ' 字节535727416 时间297.366470.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 5, suffix: ' 字节603307872 时间200.184874.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 6, suffix: ' 字节697120284 时间231.903687.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 7, suffix: ' 字节649739964 时间231.212615.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 8, suffix: ' 字节500299540 时间233.286941.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 9, suffix: ' 字节580480828 时间213.076636.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 10, suffix: ' 字节524411457 时间354.897899.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 11, suffix: ' 字节516857456 时间286.061537.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 12, suffix: ' 字节578909443 时间221.024085.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 13, suffix: ' 字节487717605 时间234.479969.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 14, suffix: ' 字节621338344 时间182.753621.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 15, suffix: ' 字节837857329 时间50.595307.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 16, suffix: ' 字节835250494 时间50.533158.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 17, suffix: ' 字节841195687 时间59.043928.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 18, suffix: ' 字节788973981 时间55.976280.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 19, suffix: ' 字节778596360 时间52.994056.svg', gap: ['1s', '10ms', '100ms'] },
        { id: 20, suffix: ' 字节785901254 时间53.536960.svg', gap: ['1s', '10ms', '100ms'] }
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
    padding: 21px 21px 0px;
    font-size: 18px;
    font-weight: bolder;
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
