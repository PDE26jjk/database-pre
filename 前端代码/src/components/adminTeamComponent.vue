<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
import {genFileId} from 'element-plus'
import {reactive, ref, h, computed} from 'vue'
import {Server} from '../stores/ajax';
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {ElTable} from 'element-plus'

import type {UploadFile} from 'element-plus'

// 格式化时间 {{{
(Date as any).prototype.format = function(fmt:any){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };

  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
        
  for(let k in o){
    if(new RegExp("("+ k +")").test(fmt)){
    let oo = o as any
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (oo[k]) : (("00"+ oo[k]).substr((""+ oo[k]).length)));  
    }       
  }
  return fmt;
}
// }}}

let modifyTeamData = $ref({
    teamid: null,
    teamname: "",
    status: "0",
    max_members_number: 5,
    can_join: true,
    set_out_time: null,
    gid: null,
})
let routeName = $ref("")
let tableData = $ref([

])
const tableRef = ref<InstanceType<typeof ElTable>>()
const modifyTeamRules = reactive<FormRules>({
    teamname: [
        {required: true, message: '请输入团队名', trigger: 'blur'},
        {min: 3, max: 15, message: '长度在3到15', trigger: 'blur'},
    ],
})
const handleModifyTeam = (index: number, row: any) => {
    modifyTeamData.teamid = row.tid
    modifyTeamData.can_join = Boolean(row.can_join)
    modifyTeamData.teamname = row.name
    modifyTeamData.status = row.status
    routeName = row.routename
    modifyTeamData.max_members_number = row.max_members_number
    modifyTeamData.gid = row.gid
    modifyTeamData.set_out_time = row.set_out_time
    modifyTeamVisiable = true
}

const deleteTeam = async () => {
    await Server.axios.delete('/team/delete_team?teamid=' + modifyTeamData.teamid).then((res) => {
        console.log(res)
        if (res.data && res.data.code == 0) {
            refresh()
            modifyTeamVisiable = false
            if (upload.value)
                upload.value.clearFiles()
        }
    }).catch(err => console.log)
}
let modifyTeamVisiable = $ref(false)

let addTeamRouteName = $ref("")
const upload = ref<UploadInstance>()

const ruleFormRef = $ref<FormInstance>()

const filterTag = (value: string, row: any) => {
    if (row.status == '1' && !row.gid) return value == '4' || value == '1'
    return row.status == value
}
const refresh = async () => {
    await Server.get('/team/get_teams').then(res => {
        if (res.data && res.data.code == 0) {
            tableData = res.data.return
        }
    })
}
const statusToTag = {
    "0": 'info',
    "1": 'warning',
    "2": 'danger',
    "3": 'success',
}
const teamStatusToText = (index: any) => {
    const allStatus = {
        "0": '未成团',
        "1": '未出游',
        "2": '已出游',
        "3": '已返回',
    }
    if (index in Object.keys(allStatus))
        return (allStatus as any)[index]
    else
        return "未定义"
}
refresh()
const search = $ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search ||
            (data as any).routename.toLowerCase().includes(search.toLowerCase())
    )
)

const submitModifyTeam = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log(modifyTeamData)
            await Server.axios.post('/team/modify_team', modifyTeamData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            ).then((res) => {
                Server.showMessage(res)
                if (res.data && res.data.code == 0) {
                    refresh()
                    modifyTeamVisiable = false
                }
            }).catch(err => console.log)

        } else {
            console.log('error submit!', fields)
        }
    })

}
</script>

<template>
    <div style="display: flex;justify-content: space-between;max-width: 700px;margin-bottom: 5px;">
        <el-button @click="refresh">刷新</el-button>
        <el-input style="width: 200px;" v-model="search" size="small" placeholder="按路线名搜索" />
    </div>
    <el-table :data="filterTableData" style="width: 100%">
        <el-table-column fixed prop="tid" label="id" width="100" sortable />
        <el-table-column prop="name" label="团队名" width="120" />
        <el-table-column prop="routename" label="路线" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">
                        <el-link :href="'/route/' + scope.row.rid">{{ scope.row.routename}}</el-link>
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="set_out_time" label="出发时间" width="120" sortable>
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">
                        {{ (new Date(scope.row.set_out_time) as any).format("yyyy-MM-dd hh:mm:ss")}}
                    </span>
                </div>
            </template>
        </el-table-column>

        <!-- <el-table-column prop="create_time" label="添加时间" width="120" sortable /> -->
        <el-table-column prop="status" label="状态" width="100" :filters="[
            {text: '未成团', value: '0'},
            {text: '未出游', value: '1'},
            {text: '已出游', value: '2'},
            {text: '已返回', value: '3'},
            {text: '未派遣导游', value: '4'},
        ]" :filter-method="filterTag" filter-placement="bottom-end">
            <template #default="scope">
                <el-tag :type="(statusToTag as any)[scope.row.status]" disable-transitions>{{
                        teamStatusToText(scope.row.status)
                }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
                <el-button @click="handleModifyTeam(scope.$index, scope.row)" link type="primary" size="small">详情/修改
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 修改团队弹窗 {{{ -->
    <el-dialog title="编辑团队" v-model="modifyTeamVisiable" width="30%" center>
        <template #header="{close, titleId, titleClass}">
            <div class="my-header">
                <div>
                    <el-popconfirm title="确定要删除吗?" @confirm="deleteTeam">
                        <template #reference>
                            <el-button style="position:absolute;left:25px" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>

                </div>
                <h4 :id="titleId" :class="titleClass">编辑团队</h4>
            </div>
        </template>
        <div id="modify_route">
            <el-form ref="ruleFormRef" :model="modifyTeamData" :rules="modifyTeamRules" label-width="120px"
                label-position="top" status-icon>
                <el-form-item :label="'路线: ' + routeName">
                </el-form-item>
                <el-form-item label="团队名" prop="teamname">
                    <el-input v-model="modifyTeamData.teamname" autocomplete="off" />
                </el-form-item>
                <el-form-item label="导游id" prop="gid">
                    <el-input v-model="modifyTeamData.gid" autocomplete="off"
                        :disabled="modifyTeamData.status != '1'" />
                </el-form-item>
                <el-form-item label="出发时间" required>
                    <el-form-item prop="set_out_time">
                        <el-date-picker v-model="modifyTeamData.set_out_time" type="datetime" label="选择出发时间"
                            placeholder="选择出发时间" style="width: 100%" />
                    </el-form-item>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-input v-model="modifyTeamData.status" type="number" autocomplete="off" />
                </el-form-item>
                <el-form-item label="可加入">
                    <el-switch v-model.boolean="modifyTeamData.can_join" />
                </el-form-item>
                <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="submitModifyTeam(ruleFormRef)">
                    修改
                </el-button>
            </el-form>
        </div>
    </el-dialog>
    <!-- }}} -->
</template>

<style>
</style>
