<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface Course {
  credits: number
  grade: number | null
  description: string
}

interface GradeOption {
  value: number
  label: string
}

// 常量定义
const GRADE_OPTIONS: GradeOption[] = [
  { value: 4.0, label: 'A' },
  { value: 3.67, label: 'A-' },
  { value: 3.33, label: 'B+' },
  { value: 3.0, label: 'B' },
  { value: 2.67, label: 'B-' },
  { value: 2.33, label: 'C+' },
  { value: 2.0, label: 'C' },
  { value: 1.67, label: 'C-' },
  { value: 1, label: 'D' },
  { value: 0, label: 'F' }
]

const INITIAL_COURSES: Course[] = [
  { credits: 3, grade: null, description: '' },
  { credits: 3, grade: null, description: '' },
  { credits: 3, grade: null, description: '' }
]

// 响应式数据
const form = reactive({
  courses: [...INITIAL_COURSES]
})

const showDescription = ref(false)
const cgpa = ref(0)
const currentCredits = ref(0)
const showResult = ref(false)

// 计算属性
const validCourses = computed(() => form.courses.filter(course => course.grade !== null))

const semesterResults = computed(() => {
  if (validCourses.value.length === 0) return null
  
  const totalCredits = validCourses.value.reduce((sum, course) => sum + course.credits, 0)
  const totalGradePoints = validCourses.value.reduce(
    (sum, course) => sum + (course.credits * (course.grade || 0)), 
    0
  )
  const sgpa = totalGradePoints / totalCredits
  
  return {
    totalCredits,
    sgpa: sgpa.toFixed(2)
  }
})

const cumulativeResults = computed(() => {
  if (!semesterResults.value || currentCredits.value <= 0) return null
  
  const totalCredits = semesterResults.value.totalCredits + currentCredits.value
  const totalGradePoints = (currentCredits.value * cgpa.value) + 
                          (semesterResults.value.totalCredits * parseFloat(semesterResults.value.sgpa))
  
  return {
    totalCredits,
    cgpa: (totalGradePoints / totalCredits).toFixed(2)
  }
})

// 方法
const addCourse = () => {
  form.courses.push({ credits: 3, grade: null, description: '' })
}

const removeCourse = (index: number) => {
  if (form.courses.length > 1) {
    form.courses.splice(index, 1)
  }
}

const resetForm = () => {
  form.courses = [...INITIAL_COURSES]
  showResult.value = false
}

const calculateGPA = () => {
  if (validCourses.value.length === 0) {
    alert('Please select at least one course grade')
    return
  }
  showResult.value = true
}

const validateGPA = (value: number) => {
  if (value < 0 || value > 4) {
    alert('GPA must be between 0 and 4')
    return false
  }
  return true
}
</script>

<template>
  <div class="gpa-calculator">
    <h2>Prior Cumulative GPA (at the beginning of this semester)</h2>
    
    <div class="input-group">
      <span class="input-label">Cumulative GPA:</span>
      <el-input 
        class="input-group-box"
        v-model.number="cgpa" 
        type="number"
        size="small"
        @change="validateGPA"
      />
      
      <span class="input-label">Credits earned:</span>
      <el-input 
        class="input-group-box"
        v-model.number="currentCredits" 
        type="number"
        size="small"
      />
    </div>

    <h2>This Semester (courses taken and/or planned)</h2>
    
    <el-form :model="form" label-position="top">
      <table class="form-table">
        <thead>
          <tr>
            <th class="header-cell">Credits</th>
            <th class="header-cell">Grade</th>
            <th class="header-cell" v-if="showDescription">Description</th>
            <th class="header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(course, index) in form.courses" :key="index" class="course-row">
            <td>
              <el-form-item>
                <el-input-number 
                  v-model="course.credits" 
                  :min="1" 
                  :max="10" 
                  :step="1" 
                  size="small"
                />
              </el-form-item>
            </td>
            <td>
              <el-form-item>
                <el-select 
                  v-model="course.grade" 
                  placeholder="Select grade" 
                  size="small" 
                  clearable
                >
                  <el-option
                    v-for="(option, idx) in GRADE_OPTIONS"
                    :key="idx"
                    :label="`${option.label} (${option.value})`"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </td>
            <td v-if="showDescription">
              <el-form-item>
                <el-input 
                  v-model="course.description" 
                  placeholder="Course name/description"
                />
              </el-form-item>
            </td>
            <td>
              <el-button 
                v-if="form.courses.length > 1"
                @click="removeCourse(index)" 
                type="danger" 
                icon="Delete" 
                circle 
                size="small"
              />
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="form-actions">
        <el-checkbox v-model="showDescription">
          Show course descriptions
        </el-checkbox>
        
        <div class="action-buttons">
          <el-button type="primary" @click="calculateGPA">
            Calculate GPA
          </el-button>
          <el-button @click="resetForm">
            Reset
          </el-button>
          <el-button @click="addCourse">
            Add Course
          </el-button>
        </div>
      </div>
    </el-form>

    <div v-if="showResult" class="results-section">
      <h3>Results</h3>
      <el-divider />
      
      <div class="result-group">
        <h4>This Semester</h4>
        <div class="result-item">
          <span>Total Credits:</span>
          <strong>{{ semesterResults?.totalCredits }}</strong>
        </div>
        <div class="result-item">
          <span>Semester GPA:</span>
          <strong class="highlight">{{ semesterResults?.sgpa }}</strong>
        </div>
      </div>
      
      <el-divider v-if="cumulativeResults" />
      
      <div v-if="cumulativeResults" class="result-group">
        <h4>Cumulative</h4>
        <div class="result-item">
          <span>Total Credits:</span>
          <strong>{{ cumulativeResults.totalCredits }}</strong>
        </div>
        <div class="result-item">
          <span>New Cumulative GPA:</span>
          <strong class="highlight">{{ cumulativeResults.cgpa }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gpa-calculator {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #303133;
  margin: 24px 0 16px;
  font-size: 1.2rem;
}

h3 {
  margin: 20px 0 12px;
  color: #303133;
}

h4 {
  margin: 16px 0 8px;
  color: #606266;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  color: #606266;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.header-cell {
  padding: 8px 12px;
  text-align: left;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.course-row {
  border-bottom: 1px solid #ebeef5;
}

.course-row:last-child {
  border-bottom: none;
}

.course-row td {
  padding: 12px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.results-section {
  margin-top: 32px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.result-group {
  margin: 16px 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding: 8px 0;
  border-bottom: 1px dashed #e4e7ed;
}

.result-item:last-child {
  border-bottom: none;
}

.highlight {
  color: #409eff;
  font-size: 1.2em;
}

.el-divider {
  margin: 16px 0;
}

.input-group .input-group-box {
  width: 70px;
}
</style>