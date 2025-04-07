<template>
  <el-header class="header-container">
      <el-menu 
        mode="horizontal"
        class="nav-menu"
      >
        <el-menu-item class="title">Cumulative GPA Calculator (HKBU)</el-menu-item>
        <el-menu-item  @click="$router.push('/')">SGPA</el-menu-item>
        <el-menu-item  @click="$router.push('/cgpa')">CGPA</el-menu-item>
      </el-menu>
    </el-header>
</template>

<script setup>

</script>

<style>
    .header-container {
    display: flex;
    align-items: center;
    height: 60px;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-right: 40px;
    color: var(--el-color-primary);
    padding: 0 20px;
  }
  
  .nav-menu {
    flex: 1;
    border-bottom: none;
  }
  
  .el-menu--horizontal {
    border-bottom: none;
  }
</style>