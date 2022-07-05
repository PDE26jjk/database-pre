import Koa from 'koa'
import KoaBody from 'koa-body'
import cors from 'koa2-cors'

import Router from 'koa-router'
import adminRoutes from './router/admin.route'
import guideRoutes from './router/guide.route'
import teamRoutes from './router/team.route'
import travelRouteRoutes from './router/travel_route.route'
import userRoutes from './router/user.route'
import fileRoutes from './router/file.route'

import session from 'koa-generic-session'
import redisStore from 'koa-redis'

import {Context, Next} from 'TYPE'
import config from './config/config.dev'

const app = new Koa()

// https://npm.io/package/koa2-cors
app.use(cors({
    origin: function (ctx) {
        return 'http://192.168.3.104:3000';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST','OPTIONS','DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.keys = ["weif*)#8;^0jkl2bv=+ej"]
app.use(session({
    // 配置 cookie
    cookie: {
        path: "/", // cookie 所在的目录
        httpOnly: true, // js脚本将无法读取到 cookie 信息
        maxAge: 24 * 60 * 60 * 1000, // cookie 过期时间
    },
    // 配置 redis
    store: redisStore({
        all: "127.0.0.1:6379",
    } as any) as any,
})
);

let {UPLOAD_PATH} = config
app.use(KoaBody({
    multipart: true,
    formidable:{
        // 上传存放的路劲
        uploadDir: UPLOAD_PATH,
        // 保持后缀名\
        keepExtensions: true,
        // 文件大小
        maxFileSize: 200 * 1024 * 1024,
        onFileBegin: (name, file) => {
            // 获取后缀, 如: .js  .txt
            // const reg = /\.[A-Za-z]+$/g
            
            // const ext = file.originalFilename.match(reg)[0]
            //修改上传文件名
            // file.newFilename = Date.now() + ext;
        },
    }
}))

const router = new Router()

app.use(router.routes())
app.use(userRoutes)
app.use(adminRoutes)
app.use(travelRouteRoutes)
app.use(guideRoutes)
app.use(teamRoutes)
app.use(fileRoutes)


app.use(async (ctx: Context, next: Next) => {
    ctx.body = ctx.body || {}
    ctx.body.code = ctx.cd
    if (ctx.msg)
        ctx.body.message = ctx.msg
    if (ctx.return)
        ctx.body.return = ctx.return
    // console.log(ctx.body);
    await next()
})
let {APP_PORT} = config
app.listen(APP_PORT, () => {
    console.log(`http://localhost:${APP_PORT}`);
})

