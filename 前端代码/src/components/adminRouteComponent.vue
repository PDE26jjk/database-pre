<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
import {genFileId} from 'element-plus'
import {reactive, ref, h} from 'vue'
import {Server} from '../stores/ajax';
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'

import type {UploadFile} from 'element-plus'


const handleAddRouteImageRemove = (file: UploadFile) => {
    addRouteData.image = null
}

let tableData = $ref([

])
const handleAddTeam = (index: number, row: any) => {
    addTeamData = {
        teamname: "",
        routeid: row.rid,
        can_join: true,
        set_out_time: null
    }
    addTeamRouteName = row.name
    addTeamVisiable = true
}
const handleModifyRoute = (index: number, row: any) => {
    modifyRouteData.routename = row.name
    modifyRouteData.cost = Number(row.cost)
    if (row.image_path)
        modifyRouteData.image_url = Server.host + '/file/' + row.image_path
    else modifyRouteData.image_url = ""
    if (upload.value)
        upload.value!.clearFiles()
    modifyRouteData.info = row.info
    modifyRouteData.max_members_number = row.max_members_number
    modifyRouteData.min_members_number = row.min_members_number
    modifyRouteData.rid = Number(row.rid)
    modifyRouteData.duration = Number(row.duration)
    modifyRouteVisiable = true
}

const deleteRoute = async () => {
    await Server.axios.delete('/travel_route/delete_route?rid=' + modifyRouteData.rid,).then((res) => {
        console.log(res.data)
        if (res.data && res.data.code == 0) {
            refresh()
            modifyRouteVisiable = false
            if (upload.value)
                upload.value.clearFiles()
        }
    }).catch(console.log)
}
let addRouteVisiable = $ref(false)
let modifyRouteVisiable = $ref(false)
let addTeamVisiable = $ref(false)
let addRouteData = reactive({
    routename: "",
    cost: 0,
    min_members_number: 5,
    max_members_number: 0,
    image: null,
    info: "",
    duration: 1,
})
let addTeamData = $ref({
    teamname: "",
    routeid: null,
    can_join: true,
    set_out_time: null,
})
let addTeamRouteName = $ref("")
let modifyRouteData = reactive({
    rid: 0,
    routename: "",
    cost: 0,
    image_url: "",
    image: null,
    info: "",
    max_members_number: 0,
    min_members_number: 5,
    duration: 1,
})
const upload = ref<UploadInstance>()

const ruleFormRef = $ref<FormInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
    const file = uploadFile.raw
    if (addRouteVisiable)
        addRouteData.image = file as any
    else if (modifyRouteVisiable)
        modifyRouteData.image = file as any
}
const refresh = async () => {
    await Server.get('/travel_route/get_routes_with_income').then(res => {
        if (res.data && res.data.code == 0) {
            tableData = res.data.return
        }
    })
}
refresh()
const submitAddTeam = async (formEl: FormInstance | undefined) => {

    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        console.log(addTeamData)
        if (valid) {
            await Server.post('/team/create_team', addTeamData, true).then((res) => {
                console.log(res.data)
            }).catch(console.log)
        } else {
            console.log('error submit!', fields)
        }
    })
    console.log(addRouteData.image)

}
const submitAddRoute = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            await Server.axios.post('/travel_route/add_route', addRouteData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            ).then((res) => {
                Server.showMessage(res)
                if (res.data && res.data.code == 0) {
                    addRouteVisiable = false
                    refresh()
                }
            }).catch(err => console.log)

        } else {
            console.log('error submit!', fields)
        }
    })
    console.log(addRouteData.image)

}
const submitModifyRoute = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log(modifyRouteData)
            await Server.axios.post('/travel_route/modify_route', modifyRouteData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            ).then((res) => {
                Server.showMessage(res)
                if (res.data && res.data.code == 0) {
                    refresh()
                    modifyRouteVisiable = false
                    if (upload.value)
                        upload.value.clearFiles()
                }
            }).catch(err => console.log)

        } else {
            console.log('error submit!', fields)
        }
    })

}
const addTeamRules = reactive<FormRules>({
    teamname: [
        {required: true, message: '请输入团队名', trigger: 'blur'},
        {min: 4, max: 15, message: '长度在4到15', trigger: 'blur'},
    ],
})
const addRouteRules = reactive<FormRules>({
    routename: [
        {required: true, message: '请输入路线名', trigger: 'blur'},
        {min: 2, max: 15, message: '长度在4到15', trigger: 'blur'},
    ],
    cost: [
        {required: true, message: '请输入费用', trigger: 'blur'},
        {type: 'number', message: '必须是数字', trigger: 'blur'},
    ],
    info: [
        {required: true, message: '请输入简介', trigger: 'blur'},
        {min: 2, max: 200, message: '长度在2到200', trigger: 'blur'},
    ],
    min_members_number: [
        {required: true, message: '请输入成团人数', trigger: 'blur'},
        {type: 'number', message: '必须是数字', trigger: 'blur'},
    ],
    max_members_number: [
        {required: true, message: '请输入最大人数', trigger: 'blur'},
        {type: 'number', message: '必须是数字', trigger: 'blur'},
    ],
    duration: [
        {required: true, message: '请输入时长', trigger: 'blur'},
        {type: 'number', message: '必须是数字', trigger: 'blur'},
    ],
})
</script>

<template>

    <el-button @click="addRouteVisiable = true">添加路线</el-button>
    <el-button @click="refresh">刷新</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="rid" label="id" width="90" sortable />
        <el-table-column prop="name" label="路线" width="110">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">
                        <el-link :href="'/route/' + scope.row.rid">{{ scope.row.name}}</el-link>
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="cost" label="费用" width="110" sortable />
        <el-table-column prop="duration" label="时长（天）" width="120" sortable />
        <el-table-column prop="gross_income" label="总收入" width="110" sortable />
        <!-- <el-table-column prop="create_time" label="添加时间" width="110" sortable /> -->
        <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">

                <el-button @click="handleModifyRoute(scope.$index, scope.row)" link type="primary" size="small">详情/修改
                </el-button>
                <el-button @click="handleAddTeam(scope.$index, scope.row)" link type="primary" size="small"> 添加团队
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加路线弹窗 {{{ -->
    <el-dialog title="添加路线" v-model="addRouteVisiable" width="30%" center>
        <div id="add_route">
            <el-form ref="ruleFormRef" :model="addRouteData" :rules="addRouteRules" label-width="120px"
                label-position="top" status-icon>
                <el-form-item label="路线名" prop="routename">
                    <el-input v-model="addRouteData.routename" autocomplete="off" />
                </el-form-item>

                <el-upload action="#" list-type="picture" :auto-upload="false" :limit="1" ref="upload"
                    :on-remove="handleAddRouteImageRemove" :on-change="handleChange" :on-exceed="handleExceed">
                    图片 <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>

                </el-upload>

                <el-form-item label="费用" prop="cost">
                    <el-input v-model.number="addRouteData.cost" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="成团人数" prop="min_members_number">
                    <el-input v-model.number="addRouteData.min_members_number" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="最大人数(0即不限)" prop="max_members_number">
                    <el-input v-model.number="addRouteData.max_members_number" type="number" autocomplete="off" />
                </el-form-item>

                <el-form-item label="时长（天）" prop="max_members_number">
                    <el-input v-model.number="modifyRouteData.duration" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="简介" prop="info">
                    <el-input v-model="addRouteData.info" type="textarea" autocomplete="off" />
                </el-form-item>
                <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="submitAddRoute(ruleFormRef)">添加
                </el-button>
            </el-form>
        </div>
    </el-dialog>
    <!--  }}} -->

    <!-- 修改路线弹窗 {{{ -->
    <el-dialog title="编辑路线" v-model="modifyRouteVisiable" width="30%" center>
        <template #header="{close, titleId, titleClass}">
            <div class="my-header">
                <div>
                    <el-popconfirm title="确定要删除吗?" @confirm="deleteRoute">
                        <template #reference>
                            <el-button style="position:absolute;left:25px" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>

                </div>
                <h4 :id="titleId" :class="titleClass">编辑路线</h4>
            </div>
        </template>
        <div id="modify_route">
            <el-form ref="ruleFormRef" :model="modifyRouteData" :rules="addRouteRules" label-width="120px"
                label-position="top" status-icon>
                <el-form-item label="路线名" prop="routename">
                    <el-input v-model="modifyRouteData.routename" autocomplete="off" />
                </el-form-item>

                <el-upload action="#" list-type="picture" :auto-upload="false" :limit="1" ref="upload"
                    :on-remove="handleAddRouteImageRemove" :on-change="handleChange" :on-exceed="handleExceed">
                    新图片 <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>

                </el-upload>
                原图片：
                <el-image :src="modifyRouteData.image_url" alt="" />
                <el-form-item label="费用" prop="cost">
                    <el-input v-model.number="modifyRouteData.cost" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="成团人数" prop="min_members_number">
                    <el-input v-model.number="modifyRouteData.min_members_number" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="最大人数(0即不限)" prop="max_members_number">
                    <el-input v-model.number="modifyRouteData.max_members_number" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="时长（天）" prop="max_members_number">
                    <el-input v-model.number="modifyRouteData.duration" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="简介" prop="info">
                    <el-input v-model="modifyRouteData.info" type="textarea" autocomplete="off" />
                </el-form-item>
                <el-button type="primary" style="width: 100%; margin-top: 20px;"
                    @click="submitModifyRoute(ruleFormRef)">修改
                </el-button>
            </el-form>
        </div>
    </el-dialog>
    <!-- }}} -->

    <!-- 添加团队弹窗 {{{ -->
    <el-dialog title="添加团队" v-model="addTeamVisiable" width="30%" center>

        <div id="modify_route">
            <el-form ref="ruleFormRef" :model="addTeamData" :rules="addTeamRules" label-width="120px"
                label-position="top" status-icon>
                <el-form-item :label="'路线: ' + addTeamRouteName">
                </el-form-item>
                <el-form-item label="团队名" prop="teamname">
                    <el-input v-model="addTeamData.teamname" autocomplete="off" />
                </el-form-item>
                <el-form-item label="出发时间" required>
                    <el-form-item prop="set_out_time">
                        <el-date-picker v-model="addTeamData.set_out_time" type="datetime" label="选择出发时间"
                            placeholder="选择出发时间" style="width: 100%" />
                    </el-form-item>
                </el-form-item>
                <el-form-item label="可加入">
                    <el-switch v-model="addTeamData.can_join" />
                </el-form-item>
                <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="submitAddTeam(ruleFormRef)">添加
                </el-button>
            </el-form>
        </div>
    </el-dialog>
    <!-- }}} -->

    <br />
</template>

<style>
</style>
