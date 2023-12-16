<template>
  <div class="leave-application">
    <el-form :model="leaveForm" label-width="120px">
      <!-- 审批编号 -->
      <el-form-item label="审批编号" required>
        <el-input v-model="leaveForm.leaveNo" disabled></el-input>
      </el-form-item>

      <!-- 学院、班级、学号信息 -->
      <el-form-item label="学院" required>
        <el-input v-model="unitName" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级" required>
        <el-input v-model="classNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="学号" required>
        <el-input v-model="username" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名" required>
        <el-input v-model="name" disabled></el-input>
      </el-form-item>

      <!-- 家长联系方式 -->
      <el-form-item label="家长联系方式" required>
        <el-input v-model="leaveForm.parentContact" placeholder="请输入家长联系方式"></el-input>
      </el-form-item>

      <!-- 请假时间段 -->
      <el-form-item label="请假时间段" required>
        <el-date-picker
          v-model="leaveForm.leavePeriod"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <!-- 请假类型 -->
      <el-form-item label="请假类型" required>
        <el-select v-model="leaveForm.leaveType">
          <el-option label="事假" value="事假"></el-option>
          <el-option label="病假" value="病假"></el-option>
          <!-- 其他请假类型选项 -->
        </el-select>
      </el-form-item>

      <!-- 是否影响晚自习 -->
      <el-form-item label="是否影响晚自习" required>
        <el-switch v-model="leaveForm.affectsNightSelfStudy"></el-switch>
      </el-form-item>

      <el-form-item label="上传材料" required>
        <el-upload
          class="upload-demo"
          ref="uploadRef"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :http-request="httpRequest"
          :file-list="fileList"
          :limit="5"
          style="width: 400px" action="">
          <el-button size="mini" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传JPG/PNG文件，且不超过3MB</div>
        </el-upload>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注">
        <el-input v-model="leaveForm.remark" type="textarea"></el-input>
      </el-form-item>

      <!-- 审批人 -->
      <el-form-item label="审批流程">
        <el-steps direction="vertical" :active="activeStep" finish-status="process" align-center>
          <el-step v-for="(step, index) in approvalProcess" :key="index" :title="step.title" :description="step.description"></el-step>
        </el-steps>
        <el-select
          v-model="approvalValue"
          filterable
          remote
          reserve-keyword
          placeholder="请输入审批人"
          :remote-method="getTeacherList"
          style="margin-top: 10px;margin-right: 10px"
          :loading="loading">
          <el-option
            v-for="item in approvalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="addApprover" type="text">+ 添加审批人</el-button>
      </el-form-item>

      <!-- 抄送人 -->
      <el-form-item label="抄送人">
        <el-tag v-for="ccPerson in leaveForm.ccPersons" style="margin-right: 8px" :key="ccPerson.username" closable @close="removeCCPerson(ccPerson)">
          {{ ccPerson.realName }}
        </el-tag>
        <br>
        <el-select
          v-model="ccValue"
          filterable
          remote
          reserve-keyword
          placeholder="请输入抄送人"
          :remote-method="getTeacherList"
          style="margin-top: 10px;margin-right: 10px"
          :loading="loading">
          <el-option
            v-for="item in approvalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="addCC" type="text">+ 添加抄送人</el-button>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitLeaveForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getTeacherList} from "@/api/user";
import {getLeaveNo, newLeave} from "@/api/leave";

export default {
  data() {
    return {
      approvalOptions: [],
      approvalValue: [],
      ccValue: [],
      loading: false,
      states: ["张弘祖", "张海平", "王朔"],
      activeStep: 99,
      showDropdown: true,
      fileList: [],
      leaveForm: {
        leaveNo: '', // 后端获取的审批编号
        parentContact: '', // 家长联系方式
        leavePeriod: [], // 请假时间段
        leaveType: '', // 请假类型
        affectsNightSelfStudy: false, // 是否影响晚自习
        remark: '', // 备注
        ccPersons: [
          { realName: '唐红军', username: '40275' },
          { realName: '郭迪', username: '20221046' }
        ] // 抄送人
      },
      approvalProcess: [
        { title: '张弘祖', description: '辅导员', username: '20221058'},
        { title: '王朔', description: '分院教务办', username: '20221061'},
        { title: '张海平', description: '分院院长', username: '29011'}
      ]
    };
  },
  created() {
    getLeaveNo().then(response => {
      this.leaveForm.leaveNo = response.data.leaveNo
    })
  },
  computed: {
    ...mapGetters([
      'name',
      'username',
      'unitName',
      'major',
      'classNo',
      'isTeacher',
    ])
  },
  methods: {
    getTeacherList(keyword) {
      if (keyword !== '') {
        this.loading = true;
        getTeacherList(keyword).then(response => {
          this.loading = false;
          if (response.code === 200) {
            this.approvalOptions = response.data.map(item => ({
              value: item.realName,
              label: item.realName + ' ' + item.username,
              role: item.role[item.role.length - 1],
              username: item.username
            }));
          }
        })
      } else {
        this.approvalOptions = [];
      }
    },
    addApprover() {
      // 在这里添加新的审批人到审批流程数组
      const newApprover = { title: this.approvalValue,
        description: this.approvalOptions.find(option => option.value === this.approvalValue).role,
        username: this.approvalOptions.find(option => option.value === this.approvalValue).username};
      this.approvalProcess.push(newApprover);
      this.approvalValue = []
    },
    addCC() {
      this.leaveForm.ccPersons.push({
        realName: this.ccValue,
        username: this.approvalOptions.find(option => option.value === this.ccValue).username
      });
      this.ccValue = []
    },
    submitLeaveForm() {
      const formData = new FormData();
      formData.append('leaveNo', this.leaveForm.leaveNo);
      formData.append('phone', this.leaveForm.parentContact);
      formData.append('startTime', this.leaveForm.leavePeriod[0]);
      formData.append('endTime', this.leaveForm.leavePeriod[1]);
      formData.append('leaveType', this.leaveForm.leaveType);
      formData.append('isEvening', this.leaveForm.affectsNightSelfStudy ? 1 : 0);
      this.fileList.forEach((file) => {
        formData.append('files', file.file)
      });
      formData.append('remark', this.leaveForm.remark);
      formData.append('approvalPersons', JSON.stringify(this.approvalProcess.map(item => item.username)));
      formData.append('ccPersons', JSON.stringify(this.leaveForm.ccPersons.map(item => item.username)));

      newLeave(formData).then(response => {
        if (response.code === 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    httpRequest(option) {
      option.name = option.file.name;
      this.fileList.push(option)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传 1 个文件，本次选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforeUpload(file) {
      let fileSize = file.size
      const FIVE_M= 3*1024*1024;
      if(fileSize>FIVE_M){
        this.$message.warning("最大上传3M")
        return false
      }
      return true;
    },
    handleRemove(file) {
      const index = this.$refs.uploadRef.fileList.findIndex(e => e.uid === file.uid);
      this.$refs.uploadRef.fileList.splice(index, 1);
    }
  }
};
</script>

<style>
/* 根据需要添加样式 */
.leave-application {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
