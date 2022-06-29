<template>
  <div style="display:inline-block;">
    <label class="font-label" style="padding-left:12px;">SrcPort: </label>
    <el-input v-model="srcport" placeholder="Please enter src port" style="width:200px;" prefix-icon="el-icon-document" />
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
    srcport: {
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
