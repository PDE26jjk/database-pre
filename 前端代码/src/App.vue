<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {Server} from '@/stores/ajax'
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import login from '@/components/loginComponent.vue'
import {Search} from '@element-plus/icons-vue'
import {useRouter, useRoute} from 'vue-router'
let input = $ref('')
const router = useRouter()
const toSearch = () => {
    router.push('/search/' + input)
}
document.title = "或者去旅游怎么样"
</script>

<template>
    <header>
        <div style="width:150px;margin-left: 120px;float:left;position: absolute;z-index:10;">
            <el-link href="/home" :underline='false' type="info">logo</el-link>
        </div>
        <el-row class="row-bg" justify="end" :gutter='6'>
            <el-col :span="6">
                <div class="mt-4">
                    <el-input v-model="input" class="w-50 m-2" size='small' placeholder="搜索" @keyup.enter="toSearch"
                        :prefix-icon="Search">
                    </el-input>
                </div>
            </el-col>
            <el-col style="min-width=100px;" :span="4">
                <div>
                    <login />
                </div>
            </el-col>
        </el-row>
        <!-- <div class="wrapper"> -->
        <!--     <nav> -->
        <!--         <RouterLink to="/">Home</RouterLink> -->
        <!--         <RouterLink to="/some/3">some</RouterLink> -->
        <!--     </nav> -->
        <!-- </div> -->
    </header>
    <div class="content">
        <RouterView />
    </div>
    <el-backtop :right="30" :bottom="40" />
    <footer>
        <!-- <copyright>
            备案声明
        </copyright> -->
    </footer>
</template>

<style lang="scss">
footer {
    bottom: 0;
    display: block;
    margin: 20px;
    /* position: absolute; */
}

*,
#app {
    padding: 0;
    margin: 0;
}

.content {
    padding: 20px 100px;
    min-width: 450px;
}

#app>header {
    min-width: 450px;
    padding-top: 10px;
    width: 100%;
    height: 35px;
    background-color: lighten($color: #000000, $amount: 90)
}

h2,
h1,
h3,
h4 {
    color: lighten($color: #000000, $amount: 20);
}

</style>
