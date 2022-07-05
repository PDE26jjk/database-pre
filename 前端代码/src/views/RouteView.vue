<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {Search} from '@element-plus/icons-vue'
import type {TabsPaneContext} from 'element-plus'
import {Server} from '@/stores/ajax'
import {GetUserState} from '@/stores/userState';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import {ElMessage, ElNotification} from 'element-plus'
import {
    Warning
} from '@element-plus/icons-vue'

// 格式化时间 {{{
(Date as any).prototype.format = function (fmt: any) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            let oo = o as any
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (oo[k]) : (("00" + oo[k]).substr(("" + oo[k]).length)));
        }
    }
    return fmt;
}
// }}}

let user = GetUserState()
let route = useRoute()
let imageaUrl = $ref("")
let hasInTeam = $ref(false)
let routeData = $ref<any>({})
let teamsCanJoin = $ref([])
Server.get('/travel_route/get_route_by_id?routeid=' + route.params.id).then(res => {
    if (res.data && res.data.code == 0) {
        routeData = res.data.return
        routeData.routescore = Number(routeData.routescore) || 0
        // console.log(routeData)
    }
})
Server.get('/team/get_team_by_route_id?routeid=' + route.params.id).then(res => {
    if (res.data && res.data.code == 0) {
        teamsCanJoin = res.data.return
        console.log(teamsCanJoin)
    }
})
const activities = [
    {
        content: 'Event start',
    },
    {
        content: 'Approved',
        timestamp: '第一天',
    },
    {
        content: 'Success',
        timestamp: '第二天',
    },
]
const seeTeams = () => {

}
let collapseModel = $ref('1')
let seeDetailsVisable = $ref(false)

let seeDetailsData = $ref<any>({})
const seeDetails = (team: any) => {
    seeDetailsData = team
    hasInTeam = false
    if (team.members)
        for (const u of team.members as any) {
            if (user.uid == u.uid) hasInTeam = true
        }
    seeDetailsVisable = true
}

const handelJoinTeam = () => {
    Server.get('/team/join_team?teamid=' + seeDetailsData.tid).then(res => {
        Server.showMessage(res)
        if (res.data && res.data.code == 0) {
            let data = res.data
            hasInTeam = data.code == 0
            seeDetailsVisable = false
        }
    })
}
const teamCanJoin = (team: any): boolean => {
    if (!team.can_join) return false
    if (team.status == 0) return true
    else if (team.status == 1) {
        if (team.max_members_number == 0) return true
        if (team.max_members_number > team.members_number)
            return false
    }
    return false
}
</script>
<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="13" style="min-width:520px">
                <el-image style="width:600px; height: 400px" fit="cover"
                    :src="Server.fileBaseURL + routeData.image_path" />
            </el-col>
            <el-col :span="7">
                <h2>{{ routeData.name}}</h2>
                <el-divider style="margin-top: 10px;margin-bottom: 10px;" />

                <el-form label-width="120px" label-position='left'>
                    <el-form-item label="用户评分">
                        <div style="min-width: 300px; display: flex; height: 20px;">
                            <el-rate v-model="routeData.routescore" disabled text-color="#ff9900" /> <span
                                style="line-height: 20px;">{{ routeData.routescore}} 分</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="价格">
                        <span>￥{{ routeData.cost}}
                        </span>
                    </el-form-item>
                    <el-form-item label="时长">
                        {{ routeData.duration}} 天
                    </el-form-item>
                    <el-form-item label="成团人数">
                        {{ routeData.min_members_number}}
                    </el-form-item>
                    <el-form-item label="最大人数">
                        {{ routeData.max_members_number == 0 ? '不限' : routeData.max_members_number}}
                    </el-form-item>
                    <el-form-item label="历史团队数">
                        {{ routeData.finish_count}}
                    </el-form-item>
                    <el-form-item label="正在出游团队数">
                        {{ routeData.traveling_count}}
                    </el-form-item>
                </el-form>
                <!-- <el-button>我要建团</el-button> -->
            </el-col>
        </el-row>
        <el-collapse v-model="collapseModel">
            <el-collapse-item title="" name="1">
                <template #title>
                    <h2> 路线说明</h2>
                </template>
                <p>{{ routeData.info}}</p>
                <!-- <el-timeline>
                    <el-timeline-item v-for="(activity, index) in activities" :key="index"
                        :timestamp="activity.timestamp">
                        {{ activity.content}}
                    </el-timeline-item>
                </el-timeline> -->
            </el-collapse-item>
        </el-collapse>
        <div>
            <h2 style="display: inline-flex;margin-right: 5px;">可参团</h2>
            <el-popover placement="top-start" title="参团说明" :width="200" trigger="hover">
                <template #reference>
                    <el-icon>
                        <Warning style="height: 1.5em;width: 1em;" />
                    </el-icon>
                </template>
                <template #default>
                    <p> 本旅社提供的参团预订服务须在线上完成缴费，并在团队出游前半小时内到达本社门店。
                        <br />在预订后，导游将会联系并通知您相关事宜，请在个人空间-资料设置中设置您的电话号码。超时未到，未按时缴费的后果，将由您来承担。
                    </p>
                </template>
            </el-popover>

            <el-divider style="margin: 5px 0;" />
            <div class="routes">
                <div>
                    <span v-for="item in teamsCanJoin as any" style="width:200px; height: 130px">
                        <span style="width: 200px;display: inline-flex; margin-right: 10px;" v-if="teamCanJoin(item)">
                            <el-card class="box-card">
                                <template #header>
                                    <div class="card-header">
                                        <span
                                            style="vertical-align: middle;display:inline-block;width:100px;text-overflow: ellipsis;">{{
                                                    item.name
                                            }}</span>
                                        <el-button class="b1" text @click="seeDetails(item)">详情</el-button>
                                    </div>
                                </template>
                                <div style="margin-bottom: 10px;">成员人数： {{ item.members_number}}</div>
                                <div style="margin-bottom: 10px;">出发时间： {{ (new Date(item.set_out_time) as
                                        any).format("yyyy-MM-dd hh:mm:ss")
                                }}</div>

                                <div style="display: inline-block;" v-for="u in item.members">
                                    <el-avatar :size="25" style="margin-right: 5px;"
                                        :src="Server.fileBaseURL + u.avatar" />
                                </div>
                            </el-card>
                        </span>
                        <!-- <el-image src="#" style="width:150px; height: 100px" /> -->
                    </span>
                    <!-- <el-link @click="seeTeams">查看全部</el-link> -->
                </div>
            </div>
        </div>
        <el-dialog title="团队详情" v-model="seeDetailsVisable" width="30%" center>
            <div id="login">
                <el-space direction="vertical" alignment="start" :size="30">
                    <span>团队名： {{ seeDetailsData.name}}</span>
                    <span>出发时间：
                        {{ (new Date(seeDetailsData.set_out_time) as any).format("yyyy-MM-dd hh:mm:ss")}}</span>
                    <span>当前人数： {{ seeDetailsData.members_number}}</span>
                    <span>最大人数： {{ seeDetailsData.max_members_number}}</span>
                    <span>可加入： {{ seeDetailsData.can_join ? '是' : '否'}}</span>
                    <span v-if="seeDetailsData.members_number">已有用户： <span v-for="user in seeDetailsData.members"> {{
                            user.user_name
                    }}、</span></span>
                </el-space>
                <el-button :disabled='!seeDetailsData.can_join || hasInTeam' type="primary" style="width: 100%;"
                    @click="handelJoinTeam">{{ hasInTeam ? '已在团队中' : '加入团队'}}</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<style>
.b1 {
    float: right;
}

.box-card {
    width: 200px;
}
</style>
