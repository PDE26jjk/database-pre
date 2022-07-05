import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';
import path from 'path'
import fs from 'fs'
import config from '../config/config.dev'
import send from 'koa-send'
let {UPLOAD_PATH} = config

export default class FileController {
    static async getFile(ctx: Context, next: Next) {
        let filename = ctx.params.filename
        const filepath = path.join(UPLOAD_PATH, filename);
        if(!fs.existsSync(filepath)){
            ctx.cd = 1
            ctx.msg = "文件不存在！！"
        }else{
            // console.log(filepath);
            ctx.cd = 0
            ctx.attachment(filepath)
            await send(ctx,filename,{root:UPLOAD_PATH})
        }
        next()
    }
}
