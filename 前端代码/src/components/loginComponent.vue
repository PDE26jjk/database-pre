<script setup lang="ts">

import {Server} from '@/stores/ajax'
import {reactive, ref, h} from 'vue'
import {Lock, Avatar} from '@element-plus/icons-vue'
import type {FormInstance, FormRules} from 'element-plus'
// import 'element-plus/es/components/message/style/css'
// import 'element-plus/es/components/notification/style/css'
// import {ElMessage, ElNotification} from 'element-plus'
import {GetUserState} from '@/stores/userState';
let user = GetUserState()

let loginData = $ref({
    username: "",
    password: ""
})
let rememberPassword = $ref(true)


const formSize = $ref('default')
const ruleFormRef = $ref<FormInstance>()
const registerData = reactive({
    username: "",
    password: "",
})

const rules = reactive<FormRules>({
    username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {min: 2, max: 15, message: '长度在2到15', trigger: 'blur'},
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 6, max: 32, message: '长度在6到32', trigger: 'blur'},
    ],
})
Server.get('/user/has_login').then((res) => {
    let data = res.data
    if (data && data.code == 0) {
        let res = data.return
        user.user_name = res.user_name
        user.uid = res.uid
        user.name = res.name
        user.tel = res.tel
        user.is_admin = res.is_admin
        user.is_guide = res.is_guide
        if (res.avatar)
            user.avatar = res.avatar
        user.gender = res.gender
        console.log(res.avatar)
    }
}).catch(err => {
    console.log(err)
})


const submitLogin = async () => {
    await Server.post('/user/login', loginData, true).then((res) => {
        let data = res.data
        if (data && data.code == 0) {
            let res = data.return
            user.user_name = res.user_name
            user.uid = res.uid
            user.name = res.name
            user.tel = res.tel
            user.is_admin = res.is_admin
            user.is_guide = res.is_guide
            user.avatar = res.avatar
            loginVisiable = false
        }
    }).catch(err => {
        console.log(err)
    })
}

const logout = () => {
    user.uid = 0
    Server.get('/user/logout', {}, true)
}
const submitRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            await Server.post('/user/registry', registerData, true).then(res => {
                console.log(res)
                if (res.data && res.data.code == 0) {
                    registerVisiable = false
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
let loginVisiable = $ref(false)
let registerVisiable = $ref(false)
</script>
<template>
    <el-link v-if="user.uid == 0" @click="loginVisiable = true">登录/注册</el-link>
    <span v-else>
        <el-space alignment="center" :size="15">
            <a href="/space" style="margin-left: 20px;">
                <el-avatar :size="27" :src="Server.fileBaseURL + user.avatar" />
            </a>
            <el-popconfirm title="确定要登出吗?" @confirm="logout">
                <template #reference>
                    <el-link style="margin-top:-7px;min-width: 45px;">登出</el-link>
                </template>
            </el-popconfirm>
        </el-space>
    </span>
    <el-dialog title="登录" v-model="loginVisiable" width="30%" center>
        <div id="login">
            <div id="login__input">
                <el-input v-model="loginData.username" class="w-50 m-2" placeholder="请输入账号" :prefix-icon="Avatar" />
                <el-input v-model="loginData.password" type="password" class="w-50 m-2" placeholder="请输入密码"
                    :prefix-icon="Lock" @keyup.enter="submitLogin" />
            </div>
            <div style="align-self: flex-start;">
                <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            </div>
            <el-button type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
            <el-link type="primary" @click="loginVisiable = false; registerVisiable = true">注册账号</el-link>
        </div>
    </el-dialog>
    <el-dialog title="注册" v-model="registerVisiable" width="30%" center @close="loginVisiable = true;">
        <div id="register">
            <el-form ref="ruleFormRef" :model="registerData" :rules="rules" label-width="120px" label-position="top"
                status-icon>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerData.username" autocomplete="off" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerData.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="submitRegister(ruleFormRef)">注册
                </el-button>
            </el-form>
        </div>
    </el-dialog>

</template>
<style lang="scss" scoped>
#login {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-around;
    height: 200px;

    #login__input {
        width: 100%;
        flex-grow: 0.7;
        display: flex;
        justify-content: space-around;
        flex-flow: column nowrap;
    }
}

#register {
    top: 20vh;

    z-index: 1000;
    flex-flow: column nowrap;
    align-items: center;
    padding: 20px;
}

.message-tips {
    display: flex;
    flex-flow: row nowrap;
    background-color: grey;
    position: fixed;
    z-index: 2000;
}
</style>
