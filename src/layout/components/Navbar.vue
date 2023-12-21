<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
<!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <img :src="'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-content">
      <p class="right-custom-info">
        <el-badge v-if="isTeacher === 1" :value="unFinished" class="item" style="margin-right: 15px">
          <el-button icon="el-icon-bell" type="primary" size="mini" @click="toApproval">待审批</el-button>
        </el-badge>
        当前登录：{{ name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {countUnFinished} from "@/api/approval";

export default {
  data() {
    return {
      unFinished: ''
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  created() {
    countUnFinished().then(response => {
      if (response.data.unFinished > 0) {
        this.unFinished = response.data.unFinished
      }
    })
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'isTeacher'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    toApproval() {
      this.$router.push(`/workspace/approval`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.right-content {
  font-size: 14px;
  font-weight: 500;
  float: right;
  margin-right: 20px;
  line-height: 20px;
}
.right-custom-info {
  font-weight: 300;
  white-space: pre;
}

</style>
