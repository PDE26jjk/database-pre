<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {Search} from '@element-plus/icons-vue'
import type {TabsPaneContext} from 'element-plus'
import {Server} from '@/stores/ajax'
let input = $ref(useRoute().params.input as string)
let lastInput = $ref('')
const activeName = $ref('route')

let searchResult = $ref([])
const getSearch = async () => {
    if (lastInput == '') return
    // history.pushState({}, '', '/search/' + lastInput)
    console.log(lastInput)
    switch (activeName) {
        case 'route':
            await Server.get('/travel_route/get_routes?routename=' + lastInput).then(res => {
                if (res.data && res.data.code == 0) {
                    searchResult = res.data.return
                }
            })
            break
        case 'guide':
            await Server.get('/guide/get_guides?guide_name=' + lastInput).then(res => {
                if (res.data && res.data.code == 0) {
                    searchResult = res.data.return
                }
            })
            break
        case 'user':
            await Server.get('/user/get_users?user_name=' + lastInput).then(res => {
                if (res.data && res.data.code == 0) {
                    searchResult = res.data.return
                }
            })
            break
    }
    // console.log(searchResult)
}

const submitSearch = async () => {
    lastInput = input
    getSearch()
}
if (input) {
    submitSearch()
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
    getSearch()
}
</script>

<template>
    <div class="mt-4">
        <el-input v-model="input" placeholder="Please input" class="input-search" @keyup.enter="submitSearch">

            <template #append>
                <el-button :icon="Search" @click="submitSearch" />
            </template>
        </el-input>
    </div>

    <div>
        <h3 style="margin: 20px 0;"> 搜索结果 </h3>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
            <el-tab-pane label="路线" name="route"></el-tab-pane>
            <el-tab-pane label="导游" name="guide"></el-tab-pane>
            <el-tab-pane label="用户" name="user"></el-tab-pane>
        </el-tabs>

        <!-- 路线搜索结果项 {{{ -->
        <div v-if="activeName == 'route'">
            <div v-for="item in searchResult as any">
                <el-row :gutter="10">
                    <el-col :span="1" style="min-width:150px; margin-right:30px">
                        <a :href="'../route/' + item.rid">
                            <img style="width:150px; height: 130px;object-fit: contain;" :src="Server.fileBaseURL + item.image_path" />
                        </a>
                    </el-col>
                    <el-col :span="16">

                        <div>
                            <el-link :href="'../route/' + item.rid">{{ item.name}}</el-link>
                        </div>
                        <div>
                            {{ item.info}}
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
            </div>
        </div>
        <!-- }}} -->
        <!-- 导游搜索结果项 {{{ -->
        <div v-else-if="activeName == 'guide'" style="display: flex; flex-flow: row wrap;">
            <el-space wrap :size="30">
                <div v-for="item in searchResult as any">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span>{{ item.user_name}}</span>
                                <!-- <el-button class="button" text>详情</el-button> -->
                            </div>
                        </template>
                        <div style="width: 100%;display: inline-flex;justify-content: center;margin: -10px 0 20px;">
                            <img style="border-radius: 50%;width: 100px;height: 100px;object-fit: cover;"
                                :src="Server.fileBaseURL + item.avatar" />
                        </div>
                        <div>id ： {{ item.uid}}</div>
                        <div>电话： {{ item.tel}}</div>
                        <div>姓名： {{ item.name}}</div>
                        <div>工作时长： {{ Number(item.work_time)}} 年</div>
                    </el-card>
                </div>
            </el-space>
        </div>
        <!-- }}} -->

        <!-- 用户搜索结果项 {{{ -->
        <div v-else-if="activeName == 'user'" style="display: flex; flex-flow: row wrap;">
            <el-space wrap :size="30">
                <div v-for="item in searchResult as any">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span>{{ item.user_name}}</span>
                                <!-- <el-button class="button" text>详情</el-button> -->
                            </div>
                        </template>
                        <!-- <div>电话： {{ item.tel}}</div> -->
                        <div style="width: 100%;display: inline-flex;justify-content: center;margin: -10px 0 20px;">
                            <img style="border-radius: 50%;width: 100px;height: 100px;object-fit: cover;"
                                :src="Server.fileBaseURL + item.avatar" />
                        </div>
                        <div>id ： {{ item.uid}}</div>
                        <div>姓名： {{ item.name}}</div>
                    </el-card>
                </div>
            </el-space>
        </div>
        <!-- }}} -->

    </div>
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
