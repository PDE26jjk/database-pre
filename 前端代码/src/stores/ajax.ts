import axios from 'axios'
import type {AxiosResponse} from 'axios'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import {ElMessage, ElNotification} from 'element-plus'
axios.defaults.withCredentials = true
export class Server {
    static host = 'http://192.168.3.104:3001'
    static fileBaseURL = Server.host + '/file/'
    static axios = axios.create({baseURL: Server.host})

    static async get(url: string, config?: any,showMsg:boolean = false):Promise<AxiosResponse<any, any>> {
        return new Promise(function (resolve, reject):any{
            axios.get(Server.host + url, config).then(res=>{
                if(showMsg) Server.showMessage(res)
                resolve(res)
            }).catch(reject)
        })
    }
    static async post(url: string, config?: any,showMsg:boolean = false):Promise<AxiosResponse<any, any>> {
        return new Promise(function (resolve, reject):any{
            
            axios.post(Server.host + url, config).then(res=>{
                if(showMsg) Server.showMessage(res)
                resolve(res)
            }).catch(reject)
        })
    }
    static async showMessage(res: any) {
        if (res.data) {
            let data = res.data
            ElMessage({
                message: data.message,
                type: data.code != 0 ? 'warning' : 'success',
            })
        }
    }
}


