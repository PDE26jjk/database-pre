<script setup lang="ts">

import type {TabsPaneContext} from 'element-plus'
import {Server} from '../stores/ajax'
import {GetUserState} from '../stores/userState';

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

let user = GetUserState()


const teamActiveIndex = $ref('1')
let myTeams = $ref([])
const refresh = () =>
    Server.get('/team/get_my_guide_teams').then(res => {
        if (res.data && res.data.code == 0) {
            myTeams = res.data.return
            console.log(myTeams)
        }
    })
refresh()
const changeStatus = async () => {
    // console.log(myTeams)
}

const handleClick = (tab: TabsPaneContext) => {
    changeStatus()
}
let seeDetailsVisable = $ref(false)
const seeDetails = (team: any) => {
    seeDetailsData = team
    seeDetailsVisable = true
}
let seeDetailsData = $ref<any>({})
const handleGo = () => {
    Server.get('/team/set_out?teamid=' + seeDetailsData.tid, {}, true).then(res => {
        if (res.data && res.data.code == 0) {
            seeDetailsVisable = false
            refresh()
        }
    })
}
const handleFinish = () => {
    Server.get('/team/finish?teamid=' + seeDetailsData.tid, {}, true).then(res => {
        if (res.data && res.data.code == 0) {
            seeDetailsVisable = false
            refresh()
        }
    })
}
const filterStatus = (team: any, index: string) => {
    // console.log(team)
    if (team.status == '1' && !team.can_go) return index == '4'
    else return team.status == index
}
</script>

<template>

    <el-tabs v-model="teamActiveIndex" class="demo-tabs" @tab-change="handleClick as any">
        <el-tab-pane label="未收齐费用" name="4"></el-tab-pane>
        <el-tab-pane label="可出游" name="1"></el-tab-pane>
        <el-tab-pane label="正在出游" name="2"></el-tab-pane>
        <el-tab-pane label="历史团队" name="3"></el-tab-pane>
    </el-tabs>
    <el-space wrap :size="10" alignment="start" direction="horizontal">
        <div v-for="item in myTeams as any">
            <el-card class="box-card" v-if="filterStatus(item, teamActiveIndex)">
                <template #header>
                    <div class="card-header">
                        <span>{{ item.name}}</span>
                        <el-button class="button" text @click="seeDetails(item)">详情</el-button>
                    </div>
                </template>
                <div >出发时间： {{ (new Date(item.set_out_time) as any).format("yyyy-MM-dd hh:mm:ss")}}</div>
                <div v-show="item.max_members_number != 0 ">最大成员人数： {{ item.max_members_number}}</div>
                <div>成员人数： {{ item.members_number}}</div>
            </el-card>
        </div>
    </el-space>
    <el-dialog title="团队详情" v-model="seeDetailsVisable" width="30%" center>
        <div id="teamDetails">
            <el-space direction="vertical" alignment="start" :size="30">
                <span>团队名： {{ seeDetailsData.name}}</span>
                <span>路线： {{ seeDetailsData.routename}}</span>
                <span><span v-show="seeDetailsData.status in ['0','1']">当前</span>人数： {{ seeDetailsData.members_number}}</span>
                <span v-if="seeDetailsData.status in ['0','1']">成团人数： {{ seeDetailsData.min_members_number}}</span>
                <span v-if="seeDetailsData.status in ['0','1']">最大人数： {{ seeDetailsData.max_members_number == 0 ? '不限': seeDetailsData.max_members_number }}</span>
                <span v-if="seeDetailsData.status in ['0','1']">可加入： {{ seeDetailsData.can_join ? '是' : '否'}}</span>
                <span>团队成员： <span v-for="user in seeDetailsData.members"> {{ user.user_name}}、</span></span>
            </el-space>
            <el-popconfirm title="确定更改团队状态为出发吗?" @confirm="handleGo">
                <template #reference>
                    <el-button v-if='seeDetailsData.status == "1" && seeDetailsData.can_go' type="primary"
                        style="width: 100%;">{{ '出发'}}
                    </el-button>
                </template>
            </el-popconfirm>
            <el-popconfirm title="确定更改团队状态为已完成吗?" @confirm="handleFinish">
                <template #reference>
                    <el-button v-if='seeDetailsData.status == "2" && seeDetailsData' type="primary"
                        style="width: 100%;">{{ '完成旅游'}}
                    </el-button>
                </template>
            </el-popconfirm>
        </div>
    </el-dialog>
</template>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input-search {
    width: 600px;
}

.box-card {
    width: 250px;
}

span {
    display: inline;
}
</style>
