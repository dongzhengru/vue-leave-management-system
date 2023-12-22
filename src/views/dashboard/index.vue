<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h2>{{ name }}你好，欢迎使用学生请假管理系统。</h2>
        <a v-if="isTeacher === 1">当前待审批 <a style="color: #20a0ff">{{ unFinished }}</a> 条。</a>
      </el-header>
      <el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {countUnFinished} from "@/api/approval";

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
    countUnFinished().then(response => {
      this.unFinished = response.data.unFinished
      if (this.isTeacher === 1) {
        this.message += '，您有' + this.unFinished + '个待审批任务。'
      }
    })
    setTimeout(() => {
      this.openNotify()
    }, 500)
  },
  data() {
    return {
      unFinished: '',
      message: '欢迎使用学生请假管理系统'
    };
  },
  methods: {
    openNotify() {
      this.$notify({
        title: '提示',
        message: this.message,
        position: 'bottom-right',
        duration: 4500
      });
    }
  }
};
</script>

<style scoped>
</style>
