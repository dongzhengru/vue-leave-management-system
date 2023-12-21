<template>
  <div class="app-container">
    <div style="box-sizing: border-box;">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = true">新增学院</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 761px">
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 761px">
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="分院名称"
          width="160">
        </el-table-column>
        <el-table-column
          prop="headerName"
          label="院长姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="headerNo"
          label="院长工号"
          width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteUnit(scope.row.id)"
              type="danger"
              size="small">
              删除分院
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增分院" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="form">
        <el-form-item label="分院名称" label-width="80px">
          <el-input v-model="form.unitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="院长工号" label-width="80px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUnit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {getAllUnit} from "@/api/SystemMana";

export default {
  name: "UnitMana",
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        unitName: '',
        username: ''
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.tableData = []
      getAllUnit().then(response => {
        this.tableData = response.data
      })
    },
    addUnit() {
      this.dialogFormVisible = false
    },
    deleteUnit(id) {
      this.$confirm('是否确认删除此分院?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setTimeout(() => {
          this.initData()
        }, 500)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  },
}
</script>

<style scoped>

</style>
