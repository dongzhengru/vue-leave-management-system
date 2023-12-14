<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h2>{{ name }}你好，欢迎使用学生请假管理系统。</h2>
        <h3>{{ unitName }} - {{ major }} - {{ classNo }}</h3>
      </el-header>
      <el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "dashboard",
  computed: {
    ...mapGetters([
      'name',
      'unitName',
      'major',
      'classNo',
      'isTeacher',
    ])
  },
  created() {
    this.openNotify()
  },
  data() {
    return {
    };
  },
  methods: {
    openNotify() {
      this.$notify({
        title: '提示',
        message: '欢迎使用学生请假管理系统',
        position: 'bottom-right',
        duration: 4500
      });
    }
  }
};
</script>

<style scoped>
</style>
