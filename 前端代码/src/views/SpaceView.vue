<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {Search} from '@element-plus/icons-vue'
import spaceTeamComponent from '@/components/spaceTeamComponent.vue'
import spaceGuideComponent from '@/components/spaceGuideComponent.vue'
import type {TabsPaneContext} from 'element-plus'
import {Server} from '@/stores/ajax'
import {GetUserState} from '@/stores/userState';
import {
    Menu as IconMenu,
    Location,
    Setting, Plus
} from '@element-plus/icons-vue'
import {reactive, ref, h, watch} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import type {UploadProps, UploadUserFile, UploadRawFile} from 'element-plus'

let user = GetUserState()

const fileList = $ref<UploadUserFile[]>([
    {
        name: 'avatar.jpeg',
        url: Server.fileBaseURL + user.avatar,
    }])
let menuIndex = $ref("4")

const onMenuSelect = (key: string, keyPath: string[]) => {
    menuIndex = key
}
let userData = $ref({
    gender: user.gender,
    name: user.name,
    tel: user.tel,
    identification: user.identification
})
let avatarFile = $ref<UploadRawFile>()
let avatarHasChange = $ref(false)
const handleExceed: UploadProps['onExceed'] = (files) => {
    const file = files[0] as UploadRawFile
    // console.log(file)
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function (e) {
        fileList[0].url = this.result as string
    }
    avatarFile = file
    avatarHasChange = true
}
let passwordData = $ref({
    password: "",
    newpassword: ""
})
watch(user, () => {
    userData = {
        name: user.name,
        tel: user.tel,
        identification: user.identification,
        gender:user.gender
    }
    fileList[0].url = Server.fileBaseURL + user.avatar
})
console.log(userData)
const rules = reactive<FormRules>({
    name: [
        // {required: true, message: '请输入姓名', trigger: 'blur'},
        {min: 2, max: 15, message: '长度在2到15', trigger: 'blur'},
    ],
    tel: [
        // {required: true, message: '请输入电话', trigger: 'blur'},
        {min: 11, max: 11, message: '长度在11位', trigger: 'blur'},
    ],
    identification: [
        // {required: true, message: '请输入身份证号', trigger: 'blur'},
        {min: 18, max: 18, message: '长度在18位', trigger: 'blur'},
    ],
})

const ruleFormRef = $ref<FormInstance>()
const submitUpdateUserData = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            await Server.post('/user/set_data', userData, true).then(res => {
                if (res.data && res.data.code == 0) {
                    user.name = userData.name
                    user.tel = userData.tel
                    user.identification = userData.identification
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
// console.log(user.avatar)
const submitChangeAvatar = async () => {
    if (avatarHasChange)
        await Server.axios.post('/user/change_avatar', {image: avatarFile}, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        ).then((res) => {
            Server.showMessage(res)
        }).catch(console.log)

    avatarHasChange = false

}
const submitChangePassword = async () => {
    await Server.post('/user/change_password', passwordData, true).then(res => {
        if (res.data && res.data.code == 0) {
            passwordData.password = ""
            passwordData.newpassword = ""
        }
    })
}


const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        return false
    }
    return true
}
</script>

<template>
    <el-container>
        <el-aside width="200px">
            <el-menu default-active="4" class="el-menu-vertical-demo" @select="onMenuSelect">
                <el-menu-item index="1">
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>所有团队</span>

                </el-menu-item>
                <!-- <el-menu-item index="2"> -->
                <!--     <el-icon> -->
                <!--         <icon-menu /> -->
                <!--     </el-icon> -->
                <!--     <span>待处理消息</span> -->
                <!-- </el-menu-item> -->
                <el-menu-item index="3" v-if="user.is_guide">
                    <el-icon>
                        <icon-menu />
                    </el-icon>
                    <span>导游面板</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <span>资料设置</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-main>
                <div v-if="menuIndex == '1'">
                    <spaceTeamComponent />
                </div>
                <div v-else-if="menuIndex == '3'">
                    <spaceGuideComponent />
                </div>
                <div v-else-if="menuIndex == '4' && user.uid" style="max-width: 550px;">
                    <div style="display: flex; flex-flow: column nowrap;">
                        <el-space direction="vertical" :size="10">
                            <el-upload class="avatar-uploader" :auto-upload="false" :limit="1"
                                v-model:file-list="fileList" :on-exceed="handleExceed">
                                <span class="el-upload-list__item-actions">
                                    更换头像
                                </span>
                                <template #file="{file}">
                                    <div style="margin-top: -31px;">
                                        <el-image shape="square" style="width: 120px;height: 120px;" :size="50"
                                            :src="file.url" fit="cover" />
                                    </div>
                                </template>
                            </el-upload>
                            <el-button :disabled="!avatarHasChange" style="margin: 0 auto;" type="primary"
                                @click="submitChangeAvatar">保存头像
                            </el-button>
                        </el-space>
                    </div>
                    <el-form ref="ruleFormRef" :model="userData" :rules="rules" label-width="120px" status-icon>
                        <el-form-item label="id">
                            <span>{{ user.uid}}</span>
                        </el-form-item>
                        <el-form-item label="用户名">
                            <span>{{ user.user_name}}</span>
                        </el-form-item>
                        <el-form-item label="身份">
                            {{ !user.is_guide && !user.is_admin ? "一般用户" : ""}}
                            <span v-if="user.is_guide" style="margin-right: 5px;vertical-align: middle;">导游</span>
                            <span v-if="user.is_admin" style="margin-right: 5px;vertical-align: middle;">管理员 </span>
                            <el-link v-if="user.is_admin" href="/admin" :underline='false'>进入管理员面板</el-link>
                        </el-form-item>
                        <el-form-item label="性别" prop="resource">
                            <el-radio-group v-model="userData.gender">
                                <el-radio label="男" />
                                <el-radio label="女" />
                                <el-radio label="未知" />
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="修改密码">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-input v-model="passwordData.password" type="password" placeholder="原密码"
                                        autocomplete="off" />
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model="passwordData.newpassword" type="password" placeholder="新密码"
                                        autocomplete="off" />
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="primary" @click="submitChangePassword()">修 改
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="userData.name" type="text" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="电话" prop="tel">
                            <el-input v-model="userData.tel" type="text" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="身份证号" prop="identification">
                            <el-input v-model="userData.identification" type="text" autocomplete="off" />
                        </el-form-item>
                        <div style="display: flex;">
                            <el-button type="primary" style="width: 60%;margin: 0 auto; margin-top: 20px;"
                                @click="submitUpdateUserData(ruleFormRef)">保 存
                            </el-button>
                        </div>
                    </el-form>

                </div>

            </el-main>
        </el-container>
    </el-container>


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

.avatar-uploader {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* transition: var(--el-transition-duration-fast); */
}

.el-upload-list__item-actions {
    position: absolute;
    top: 0;
    line-height: 120px;
    left: 0;
    z-index: 10;
    text-align: center;
    width: 120px;
    color: #0000;
}

@keyframes fadenum {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.el-upload-list__item-actions:hover {
    color: #fff;
    font-weight: 600;
    background-color: #0003;
    animation: fadenum 0.3s 1;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}
</style>
