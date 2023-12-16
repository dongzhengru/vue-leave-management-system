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
            <el-option label="待审批" value="0"></el-option>
            <el-option label="审批中" value="1"></el-option>
            <el-option label="通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        stripe
        border
        height="620px"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%">
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
          width="100">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="家长联系方式"
          width="110">
        </el-table-column>
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
              type="warning">待审批
            </el-tag>
            <el-tag v-else-if="scope.row.status === 1"
              type="primary">审批中
            </el-tag>
            <el-tag v-else-if="scope.row.status === 2"
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
              @click.native.prevent="checkRow(scope.row.id, tableData)"
              type="primary"
              size="small">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="margin-top: 15px;float: right;margin-bottom: 20px">
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
  </div>
</template>

<script>
import {queryLeave} from "@/api/leave";

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
      tableData: []
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
    handleSizeChange(newSize) {
      this.form.pageSize = newSize;
      this.initData(this.form)
    },
    handleCurrentChange(newPage) {
      this.form.page = newPage;
      this.initData(this.form)
    }
  }
}
</script>

<style scoped>

</style>
