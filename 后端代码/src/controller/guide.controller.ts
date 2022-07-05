import {User} from 'knex/types/tables';
import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';
import UserController from './user.controller'
import AdminController from './admin.controller';
export default class GuideController {

    static async getGuideById(guideid: number) {
        let guide = await knex.select('*')
            .from('guides')
            .leftJoin('users', 'users.uid', 'guides.uid')
            .where('guides.uid', guideid).first()
        return guide
    }
    static async getGuides(ctx: Context, next: Next) {
        let {guide_name} = ctx.query
        let users: any[]
        const col = ['users.uid', 'user_name', 'name', 'tel','work_time','avatar']
        if (guide_name) {
            guide_name = "%" + guide_name + "%"
            users = await knex.select(col).from('users').leftJoin('guides','users.uid','guides.uid').where("user_name", "like", guide_name).andWhere("is_guide", true)
        }
        else
            users = await knex.select(col).from('users').leftJoin('guides','users.uid','guides.uid').where("is_guide", true)
        if (users) {
            ctx.cd = 0
            ctx.msg = "搜索导游成功"
            ctx.return = users
        }
        next()
    }

    @AdminController.checkIsAdmin
    static async addGuide(ctx: Context, next: Next) {
        let {userid} = ctx.request.body
        let user = await UserController.getUserById(Number(userid))
        console.log(user);

        if (!user) {
            ctx.cd = 1
            ctx.msg = "userid 不存在！！"
            next()
            return
        }

        await knex('users').where("uid", userid)
            .update({is_guide: true})
            .then(async (num) => {
                if (num > 0) {
                    if (!await knex('guides').select().where({uid: userid}).first())
                        await knex('guides').insert({uid: userid})
                    ctx.cd = 0
                    ctx.msg = "修改成功！"
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "修改失败！"
                }
            })
        next()
    }
    @AdminController.checkIsAdmin
    static async removeGuide(ctx: Context, next: Next) {
        let {userid} = ctx.query
        let user = await UserController.getUserById(Number(userid))
        ctx.return = undefined

        if (!user) {
            ctx.cd = 1
            ctx.msg = "userid 不存在！！"
            next()
            return
        } else if (!user.is_guide) {
            ctx.cd = 1
            ctx.msg = "不是导游！！"
            next()
            return
        }

        await knex('users').where("uid", userid)
            .update({is_guide: false})
            .then((num) => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "修改成功！"
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "修改失败！"
                }
            })
        next()
    }

}
