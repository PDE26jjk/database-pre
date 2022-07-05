<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
import {genFileId} from 'element-plus'
import {reactive, ref, h} from 'vue'
import {Server} from '../stores/ajax';
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'

import type {UploadFile} from 'element-plus'

let tableData = $ref([

])

let addGuideVisiable = $ref(false)
let addGuideData = $ref({
    userid: null
})


const ruleFormRef = $ref<FormInstance>()
const refresh = async () => {
    await Server.get('/guide/get_guides').then(res => {
        if (res.data && res.data.code == 0) {
            tableData = res.data.return
        }
    })
}
const deleteGuide = async (row: any) => {
    await Server.axios.delete('/guide/remove_guide?userid=' + row.uid)
    refresh()
}
refresh()

const submitAddGuide = async (formEl: FormInstance | undefined) => {
    await Server.axios.post('/guide/add_guide', addGuideData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    ).then((res) => {
        console.log(res.data)
        Server.showMessage(res)
        addGuideVisiable = false
        addGuideData.userid = null
        refresh()
    }).catch(err => console.log)
}


</script>

<template>

    <el-button @click="addGuideVisiable = true">添加导游</el-button>
    <el-button @click="refresh">刷新</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="uid" label="id" width="110" sortable />
        <el-table-column prop="user_name" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="work_time" label="工作时长（年）" width="130" />
        <el-table-column prop="tel" label="电话" width="120"/>
        <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">

                <el-popconfirm title="确定要删除吗?" @confirm="deleteGuide(scope.row)">
                    <template #reference>
                        <el-button link type="primary" size="small">删除
                        </el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>

    <!-- 添加导游弹窗 {{{ -->
    <el-dialog title="添加导游" v-model="addGuideVisiable" width="30%" center>
        <div id="add_guide" style="min-width=400px">
            <el-form ref="ruleFormRef" :model="addGuideData" label-width="120px"
                label-position="top" status-icon>
                <el-form-item label="id">
                    <el-input v-model="addGuideData.userid" autocomplete="off" />
                </el-form-item>

                <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="submitAddGuide(ruleFormRef)">添加
                </el-button>
            </el-form>
        </div>
    </el-dialog>
    <!--  }}} -->


    <br />
</template>

<style>
</style>
