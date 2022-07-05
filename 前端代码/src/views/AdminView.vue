<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
import {genFileId} from 'element-plus'
import {reactive, ref, h} from 'vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import {Server} from '@/stores/ajax';
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'

import type {UploadFile} from 'element-plus'
import adminRouteComponent from '@/components/adminRouteComponent.vue'
import adminGuideComponent from '@/components/adminGuideComponent.vue'
import adminTeamComponent from '@/components/adminTeamComponent.vue'
import {GetUserState} from '@/stores/userState';
let user = GetUserState()
if (!user.is_guide) {

}
let menuIndex = $ref("1")
const onMenuSelect = (key: string, keyPath: string[]) => {
    menuIndex = key
}
</script>

<template>
    <el-container v-if="user.is_admin">
        <el-aside width="200px">
            <el-menu default-active="1" class="el-menu-vertical-demo" @select="onMenuSelect">
                <el-menu-item index="1">
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>路线管理</span>

                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon>
                        <icon-menu />
                    </el-icon>
                    <span>团队管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>导游管理</span>
                </el-menu-item>
            </el-menu>

        </el-aside>
        <el-container>
            <!-- <el-header height="20px">Header</el-header> -->
            <el-main>
                <adminRouteComponent v-if="menuIndex == '1'" />
                <adminTeamComponent v-else-if="menuIndex == '2'" />
                <adminGuideComponent v-else-if="menuIndex == '3'" />
            </el-main>
        </el-container>
    </el-container>
    <div v-else>
        <el-result icon="error" title="您不是管理员！！！">
            <template #extra>
                <el-link href="/home">
                    <el-button type="primary">返回主页</el-button>
                </el-link>
            </template>
        </el-result>
    </div>

    <br />
</template>

<style>
</style>
