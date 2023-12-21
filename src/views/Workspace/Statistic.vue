<template>
  <div class="app-container">
    <el-card shadow="hover" v-if="isTeacher === 0" class="card">
      <div slot="header"><p style="font-weight: bold;">我发起的</p></div>
      <div class="statistic-item">
        <el-card shadow="never" class="sub-card">
          <span class="title">发起单量：</span>
          <span class="value large">{{ statistic.total }}</span>
        </el-card>

        <el-card shadow="never" class="sub-card">
          <span class="title">未完成单量：</span>
          <span class="value large">{{ statistic.unFinished }}</span>
        </el-card>

        <el-card shadow="never" class="sub-card">
          <span class="title">流程平均耗时：</span>
          <span class="value large">{{ statistic.avgTime }}</span>
          <span class="value" style="font-size: 16px;"> 小时</span>
        </el-card>
      </div>
    </el-card>
    <el-card shadow="hover" v-if="isTeacher === 1" class="card">
      <div slot="header"><p style="font-weight: bold;">我审批的</p></div>
      <div class="statistic-item">
        <el-card shadow="never" class="sub-card">
          <span class="title">审批单量：</span>
          <span class="value large">{{ statistic.total }}</span>
        </el-card>

        <el-card shadow="never" class="sub-card">
          <span class="title">待处理单量：</span>
          <span class="value large">{{ statistic.unFinished }}</span>
        </el-card>

        <el-card shadow="never" class="sub-card">
          <span class="title">审批平均耗时：</span>
          <span class="value large">{{ statistic.avgTime }}</span>
          <span class="value" style="font-size: 16px;"> 小时</span>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {statistic} from "@/api/approval";

export default {
  name: "Statistic",
  data() {
    return {
      statistic: {},
    };
  },
  computed: {
    ...mapGetters([
      'isTeacher'
    ])
  },
  created() {
    statistic().then(response => {
      this.statistic = response.data
      this.statistic.avgTime = response.data.avgTime.toFixed(3)
    })
  }
};
</script>

<style scoped>
*{
  padding: 0;
  margin: 0;
}
.app-container {
  display: flex;
  padding: 20px;
}

.card {
  width: 702px;
  border-radius: 15px;
}

.sub-card {
  border-radius: 15px;
  width: 200px;
  margin-left: 10px;
  margin-right: 10px;
  box-sizing: border-box;
}

.statistic-item {
  display: flex;
  flex-wrap: wrap;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.value {
  font-weight: bold;
  font-size: 24px;
  color: #1890ff;
}
</style>
