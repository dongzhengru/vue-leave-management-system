<template>
  <div class="app-container" style="width: 500px">
    <el-form :model="passwordForm" ref="passwordForm" :rules="rules" label-width="120px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="passwordForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="confirmPassword">
        <el-input type="password" v-model="passwordForm.confirmPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="changePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {modifyPwd} from "@/api/SystemMana";

export default {
  name: "ModifyPwd",
  data() {
    return {
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 5, max: 15, message: '新密码长度为5到15个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.newPwd) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    changePassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$confirm('是否确认修改密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            modifyPwd(this.passwordForm).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                })
                this.passwordForm = []
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
