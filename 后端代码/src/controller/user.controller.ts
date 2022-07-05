import {User} from 'knex/types/tables';
import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';

export default class UserController {
    static checkLogin(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = async (ctx: Context, next: Next) => {
            await UserController.hasLogin(ctx, null).then(() => {
                if (ctx.cd !== 0) {
                    next()
                } else {
                    return original(ctx, next)
                }
            })
        }
    }
    @UserController.checkLogin
    static async changePassword(ctx: Context, next: Next) {
        let {password, newpassword} = ctx.request.body
        if (ctx.user.pwd === password) {
            if (password === newpassword) {
                ctx.cd = 1
                ctx.msg = "密码重复！！"
            }
            else {
                await knex('users').where({uid: ctx.user.uid}).update({
                    pwd: newpassword
                }).then((num) => {
                    if (num > 0) {
                        ctx.session.user.pwd = newpassword
                    }
                })
                ctx.cd = 0
                ctx.msg = "修改成功"
            }
        } else {
            ctx.cd = 1
            ctx.msg = "密码错误！！"

        }

        next()
    }

    static async login(ctx: Context, next: Next) {
        await UserController.userExists(ctx, null)
        if (!ctx.user) {
            next()
            return
        }

        let {password} = ctx.request.body

        if (ctx.user.pwd === password) {
            ctx.session.user = ctx.user
            ctx.session.pwdInputTime = 0
            ctx.cd = 0
            ctx.msg = "登录成功"
        }
        else {
            ctx.session.user = undefined
            ctx.session.pwdInputTime = ctx.session.pwdInputTime || 0
            ctx.session.pwdInputTime++
            ctx.cd = 1
            ctx.msg = "密码错误！！" + "尝试次数 " + ctx.session.pwdInputTime
        }

        next()
    }
    static async hasLogin(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        if (ctx.session.user) {
            ctx.cd = 0
            ctx.msg = "已登录"
            ctx.user = ctx.session.user
            ctx.return = JSON.parse(JSON.stringify(ctx.session.user))
            ctx.return.pwd = undefined
        } else {
            ctx.cd = 1
            ctx.msg = "未登录"
        }
        next()
    }
    @UserController.checkLogin
    static async changeAvatar(ctx: Context, next: Next) {
        let image_path = null
        if (ctx.request.files && ctx.request.files.image) {
            image_path = (ctx.request.files.image as any).newFilename as string
        }
        if (!image_path) {
            ctx.cd = 1
            ctx.msg = "文件错误！！"
            next()
            return
        }
        await knex('users').where({uid: ctx.user.uid}).update({avatar: image_path}).then(num => {
            if (num > 0) {
                ctx.cd = 0
                ctx.msg = "更新头像成功"
                ctx.user.avatar = image_path
            } else {
                ctx.cd = 1
                ctx.msg = "更新头像失败！！"
            }
        })

        next()
    }
    @UserController.checkLogin
    static async logout(ctx: Context, next: Next) {
        if (ctx.cd === 0) {
            ctx.session.user = undefined
            ctx.msg = "登出成功"
        }
        next()
    }

    @UserController.checkLogin
    static async setData(ctx: Context, next: Next) {
        let {name, tel, identification, gender} = ctx.request.body
        let user = ctx.user
        if (name) user.name = name
        if (tel) user.tel = tel
        if (identification) user.identification = identification
        if (gender) user.gender = gender

        await knex('users').update(user).where({uid: user.uid}).then(num => {
            if (num > 0) {
                ctx.cd = 0
                ctx.msg = "更新用户数据成功"
                ctx.session.user = {...ctx.session.user, ...user}

            } else {
                ctx.cd = 1
                ctx.msg = "更新用户数据失败！！"
            }
        })
        next()
    }
    static async userExists(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let username = ctx.query.username || ctx.request.body.username
        if (username == null) {
            next()
            return
        }
        let user: User
        await knex('users')
            .select('*')
            .where('user_name', username)
            .first()
            .then((u) => {
                user = u
                // console.log(user);
            })
        if (user) {
            ctx.cd = 0
            ctx.msg = "用户名存在"

            ctx.user = JSON.parse(JSON.stringify(user))
            ctx.return = user
            ctx.return.pwd = undefined
        } else {
            ctx.cd = 1
            ctx.msg = "用户名不存在"

        }

        next()
    }
    // 创建用户
    static async registry(ctx: Context, next: Next) {
        let {username, password} = ctx.request.body
        console.log("???");

        await UserController.userExists(ctx, null)
        let user: User = (ctx as any).user
        if (user) {
            ctx.cd = 1
            ctx.msg = "用户名已存在！"
            next()
        }
        await knex('users')
            .insert([{user_name: username, pwd: password}])
            .then((num) => {
                if (num.length > 0) {
                    ctx.cd = 0
                    ctx.msg = "注册成功！"
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "注册失败！"
                }
            })
        next()
        // if(user){
        //     return {

        //     }
        // }

    }
    static async getUserById(userId: number) {
        if (!userId) return null
        let user: User

        await knex('users').select().where('uid', userId).first().then(u => {
            user = u
        })
        return user
    }
    static async getUsers(ctx: Context, next: Next) {
        let users: any[]
        let {user_name} = ctx.query
        console.log(user_name);

        let col = ['uid', 'user_name', 'name','avatar']
        if (user_name) {
            user_name = `%${user_name}%`
            users = await knex('users').select(col).where('user_name', 'like', user_name)
        } else {
            users = await knex('users').select(col)
        }
        console.log(users);

        ctx.cd = 0
        ctx.msg = "搜索用户成功"
        ctx.return = users

        next()
    }
}
