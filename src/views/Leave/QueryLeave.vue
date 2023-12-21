<template>
  <div class="app-container">
    <div style="box-sizing: border-box;">
      <el-form :inline="true" size="small">
        <el-form-item label="请假类型">
          <el-select v-model="form.leaveType" @change="search" clearable placeholder="请选择请假类型">
            <el-option label="事假" value="事假"></el-option>
            <el-option label="病假" value="病假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="form.status" @change="search" clearable placeholder="请选择审批状态">
            <el-option label="驳回" value="-2"></el-option>
            <el-option label="撤销" value="-1"></el-option>
            <el-option label="审批中" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 1205px;">
      <el-table
        :data="tableData"
        stripe
        border
        height="620px"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 1175px;">
        <el-table-column
          prop="leaveNo"
          label="审批编号"
          width="110">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="二级学院"
          width="120">
        </el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          width="150">
        </el-table-column>
        <el-table-column
          prop="classNo"
          label="班级"
          width="100">
        </el-table-column>
        <el-table-column
          prop="username"
          label="学号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="80">
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="phone"-->
<!--          label="家长联系方式"-->
<!--          width="110">-->
<!--        </el-table-column>-->
        <el-table-column
          prop="leaveType"
          label="请假类型"
          width="80">
        </el-table-column>
        <el-table-column
          label="请假时间段"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.startTime }} - {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审批状态"
          width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === -2"
              type="danger">驳回
            </el-tag>
            <el-tag v-else-if="scope.row.status === -1"
              type="info">撤销
            </el-tag>
            <el-tag v-else-if="scope.row.status === 0"
              type="warning">审批中
            </el-tag>
            <el-tag v-else-if="scope.row.status === 1"
              type="success">通过
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="发起时间"
          width="100">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="checkRow(scope.row.id)"
              type="primary"
              size="small">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="margin-top: 15px;float: left;margin-bottom: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-drawer
      title="请假单详情"
      :visible.sync="drawer1"
      size="35%"
      direction="rtl">
      <div style="margin-left: 20px;margin-right: 20px;margin-bottom: 100px;">
        <el-descriptions title="学生信息" :column="1">
          <el-descriptions-item label="审批编号">{{ detailData.leaveNo }}</el-descriptions-item>
          <el-descriptions-item label="学院">{{ detailData.unitName }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ detailData.major }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ detailData.classNo }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ detailData.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ detailData.realName }}</el-descriptions-item>
          <el-descriptions-item label="家长联系方式">{{ detailData.phone }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="请假详情" :column="1" style="margin-top: 20px;">
          <el-descriptions-item label="请假类型">{{ detailData.leaveType }}</el-descriptions-item>
          <el-descriptions-item label="请假开始时间">{{ detailData.startTime }}</el-descriptions-item>
          <el-descriptions-item label="请假结束时间">{{ detailData.endTime }}</el-descriptions-item>
          <el-descriptions-item label="是否影响晚自习">{{ detailData.isEvening = 1 ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ detailData.remark }}</el-descriptions-item>
          <el-descriptions-item label="发起时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="材料">
            <div v-for="(imageUrl, index) in detailData.url" :key="index">
              <el-image
                style="width: 100px; height: 100px;float: left;margin-left: 8px"
                v-if="imageUrl"
                :src="imageUrl"
                :preview-src-list="detailData.url">
              </el-image>
              <el-tag type="warning" v-if="!detailData.url" style="width: 60px;text-align: center">无材料</el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="审批进度" :column="1" style="margin-top: 20px;">
        </el-descriptions>
        <el-steps direction="vertical" :active="activeStep"  :process-status="processStatus" :space="80" finish-status="success" align-center>
          <el-step v-for="(step, index) in approvalProcess" :key="index" :title="step.title" :description="step.description"></el-step>
        </el-steps>
        <el-button
          @click.native.prevent="checkApprovalDetail()"
          type="primary"
          size="small">
          查看审批详情
        </el-button>
        <el-descriptions title="抄送人" :column="1" style="margin-top: 30px;">
        </el-descriptions>
        <el-tag v-for="ccPerson in ccPersons" :key="ccPerson.username" style="margin-right: 25px;position: relative;display: inline-block;">
          {{ ccPerson.title }}
          <el-badge value="已读" v-if="ccPerson.status === 1" class="item" type="primary" style="position: absolute;top: -10px;right: -15px;"/>
          <el-badge value="未读" v-else class="item" type="danger" style="position: absolute;top: -10px;right: -15px;"/>
        </el-tag>
        <el-drawer
          title="审批详情"
          :append-to-body="true"
          :visible.sync="drawer2">
          <div style="margin-left: 20px;margin-right: 20px;margin-bottom: 100px;">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-card v-for="person in approvalProcess" :key="person.username" class="approval-card" shadow="hover" style="margin-bottom: 10px;border-radius: 15px;border-color: #20a0ff;">
                  <div class="name-position">
                    <span style="font-weight: bold">{{ person.title }}</span>
                    <span style="float: right;font-size: 13px;">{{ person.description }}</span>
                  </div>
                  <div class="status-time" style="margin-top: 5px">
                    <span style="font-size: 13px;">{{ getStatusText(person.status) }}</span>
                    <span style="float: right;font-size: 13px;">{{ person.completeTime != null ? '审批时间：' + person.completeTime : '无审批时间' }}</span>
                  </div>
                  <div class="reason" style="margin-top: 5px">
                    <span style="float: right;font-size: 13px;margin-right: 80px;"></span>
                    <span style="font-size: 13px;">审批意见：{{ person.reason }}</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {queryLeave, queryLeaveDetail} from "@/api/leave";

export default {
  name: "QueryLeave",
  data() {
    return {
      form: {
        page: 1,
        pageSize: 20,
        leaveType: '',
        status: '',
      },
      currentPage: 0,
      total: 0,
      tableData: [],
      detailData: [],
      ccPersons: [],
      drawer1: false,
      drawer2: false,
      activeStep: 0,
      processStatus: 'process',
      approvalProcess: []
    }
  },
  created() {
    this.initData(this.form)
  },
  methods: {
    initData(data) {
      this.tableData = []
      queryLeave(data).then(response => {
        this.total = response.data.total
        this.tableData = response.data.records
      })
    },
    search() {
      this.currentPage = 1
      this.form.page = 1
      this.initData(this.form)
    },
    getStatusText(status) {
      switch (status) {
        case -1:
          return '驳回';
        case 0:
          return '待审批';
        case 1:
          return '已读';
        case 2:
          return '已通过';
      }
    },
    handleSizeChange(newSize) {
      this.form.pageSize = newSize;
      this.initData(this.form)
    },
    handleCurrentChange(newPage) {
      this.form.page = newPage;
      this.initData(this.form)
    },
    checkRow(index) {
      this.processStatus = 'process'
      queryLeaveDetail(index).then(response => {
        if (response.code === 200) {
          this.detailData = response.data
          // 审批人
          this.approvalProcess = response.data.approvalProcess.map(item => {
            let title = item.realName;
            let description = item.roleName.pop();
            let username = item.username;
            let status = item.status
            let completeTime = item.completeTime
            return { title, description, username, status, completeTime };
          });

          // 抄送人
          this.ccPersons = response.data.ccPersons.map(item => {
            let title = item.realName;
            let username = item.username;
            let status = item.status;
            return { title, username, status };
          });

          this.activeStep = parseInt(response.data.nowOrder) - 1
          if (this.detailData.status === 1) {
            this.processStatus = 'success'
          }
          if (this.approvalProcess[parseInt(this.activeStep)].status === -1) {
            this.processStatus = 'error'
          }
          this.drawer1 = true
        }
      })


    },
    checkApprovalDetail(){
      this.drawer2 = true
    }
  }
}
</script>

<style scoped>

</style>
