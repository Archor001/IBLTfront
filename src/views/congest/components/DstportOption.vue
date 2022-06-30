<template>
  <div style="display:inline-block;">
    <label class="font-label" style="padding-left:12px;">DstPort: </label>
    <el-input v-model="dstport" placeholder="Please enter des port" style="width:200px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    dstport: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>
  .font-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 6px;
  }
</style>
