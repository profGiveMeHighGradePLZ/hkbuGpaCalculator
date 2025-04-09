<script setup>
import MyHeader from './components/header.vue'
</script>

<template>
    <el-containor>
        <el-header>
            <MyHeader>
            </MyHeader>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
        
    </el-containor>
    
  </template>
  
  <style scoped>
  
  </style>