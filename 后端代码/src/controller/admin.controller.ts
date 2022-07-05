import {User} from 'knex/types/tables';
import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';
import UserController from './user.controller'
export default class AdminController {

    static checkIsAdmin(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = async (ctx: Context, next: Next) => {
            ctx.body = {}
            await AdminController.isAdmin(ctx, null).then(async () => {
                if (ctx.cd !== 0) {
                    await next()
                } else {
                    return await original(ctx, next)
                }
            })
        }

    }
    static async isAdmin(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        await UserController.hasLogin(ctx, null)

        if (ctx.user) {
            if (!ctx.user.is_admin) {
                ctx.cd = 1
                ctx.msg = "不是管理员！！"
            } else {
                ctx.cd = 0
                ctx.msg = "是管理员"
            }
        }
        await next()
    }


}
