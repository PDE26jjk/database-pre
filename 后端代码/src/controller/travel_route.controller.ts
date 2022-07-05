import {Route, User} from 'knex/types/tables';
import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';
import AdminController from './admin.controller';
export default class TravelRouteController {

    @AdminController.checkIsAdmin
    static async addTravelRoute(ctx: Context, next: Next) {
        let {routename, cost, info, duration, max_members_number, min_members_number} = ctx.request.body
        if (!(routename && info)) {
            ctx.cd = 1
            ctx.msg = "信息不全！！"
        }
        cost = Number(cost) || 0
        // console.log(ctx.request.files);
        let image_path = null
        if (ctx.request.files && ctx.request.files.image) {
            image_path = (ctx.request.files.image as any).newFilename as string
        }

        await knex('routes')
            .insert([{name: routename, cost, info, image_path, duration, max_members_number, min_members_number}]).then((rids) => {
                console.log(rids);
                if (rids.length > 0) {
                    ctx.cd = 0
                    ctx.msg = "路线添加成功"
                    ctx.return = rids[0]
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "路线添加失败"
                }
            })
        await next()
    }
    @AdminController.checkIsAdmin
    static async modifyRoute(ctx: Context, next: Next) {
        let {rid, routename, cost, info, max_members_number, min_members_number,duration} = ctx.request.body
        if (!(rid)) {
            ctx.cd = 1
            ctx.msg = "信息不全！！"
        }
        let image_path = null
        if (ctx.request.files && ctx.request.files.image) {
            image_path = (ctx.request.files.image as any).newFilename as string
        }

        let route: Route
        console.log(rid);

        route = await knex('routes').select('*').where('rid', rid).first()

        if (!route) {
            ctx.cd = 1
            ctx.msg = "没有路线！！"
            next()
            return
        }
        route.name = routename || route.name
        route.cost = Number(cost) || route.cost
        route.info = info || route.info
        route.image_path = image_path || route.image_path
        route.max_members_number = max_members_number || route.max_members_number
        route.min_members_number = min_members_number || route.min_members_number
        route.duration = duration || route.duration

        await knex('routes').where('rid', rid)
            .update(route).then((num) => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "路线修改成功"
                    ctx.return = route
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "路线修改失败"
                }
            })
        await next()
    }

    @AdminController.checkIsAdmin
    static async deleteRoute(ctx: Context, next: Next) {
        let {rid} = ctx.query
        if (!rid) {
            ctx.cd = 1
            ctx.msg = "信息不全！！"
            next()
            return
        }

        await knex('routes').where('rid', rid)
            .update({deleted: true}).then((num) => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "路线删除成功"
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "路线删除失败"
                }
            })
        next()
    }

    static async getTravelRoutesRank(ctx: Context, next: Next) {
        await knex.select('routes.*', knex.raw('avg(score) as routescore'))
            .from('routes').leftOuterJoin('teams', 'routes.rid', 'teams.rid')
            .leftOuterJoin('user_team', 'user_team.tid', 'teams.tid')
            .where('teams.status', '3').andWhere('user_team.score', '<>', '0')
            .groupBy('routes.rid').orderBy("routescore", "desc").then(res => {
                if (res.length) {
                    ctx.cd = 0
                    ctx.msg = "查询排行榜成功"
                    ctx.return = res
                }
                else {
                    ctx.cd = 1
                    ctx.msg = "查询排行榜失败！！"
                }
            })
        next()
    }


    static async getTravelRoutesScoreById(routeid: number) {
        return await knex.select('routes.rid', knex.raw('avg(score) as routescore'))
            .from('routes').leftOuterJoin('teams', 'routes.rid', 'teams.rid')
            .leftOuterJoin('user_team', 'user_team.tid', 'teams.tid')
            .where('routes.rid', routeid).andWhere('teams.status', '3').andWhere('user_team.score', '<>', '0')
            .andWhere('routes.deleted', false)
            .groupBy('routes.rid').first()
    }
    static async _getTravelRouteById(ctx: Context, next: Next) {
        let {routeid} = ctx.query
        let route = await TravelRouteController.getTravelRouteById(Number(routeid))

        if (route && route.rid) {
            let scoreData = await TravelRouteController.getTravelRoutesScoreById(Number(routeid))
            if (scoreData)
                route.routescore = scoreData.routescore
            ctx.cd = 0
            ctx.msg = "获取路线成功"
            ctx.return = route
        } else {
            ctx.cd = 1
            ctx.msg = "获取路线失败！！"
        }
        next()
    }
    static async getTravelRouteById(routeid: number) {
        let route: Route | any
        let col = ['routes.*',
            knex.raw('count(status = 2 OR NULL) as "traveling_count"'),
            knex.raw('count(status = 3 OR NULL) as "finish_count"')]
        route = await knex.select(col).from('routes').leftOuterJoin('teams', 'routes.rid', 'teams.rid')
            .where('routes.rid', routeid)
            .andWhere('routes.deleted', false).first()
        return route
    }
    static async getTravelRoute(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {routename} = ctx.query
        let routes: Route[]
        if (routename) {
            routename = `%${routename}%`
            routes = await knex('routes').select('*').where('name', 'like', routename).andWhere('deleted', false)
        }
        else {
            routes = await knex('routes').select('*').where('deleted', false)
        }
        if (routes) {
            ctx.cd = 0
            ctx.msg = "搜索路线成功"
            ctx.return = routes
        }
        next()
    }

    @AdminController.checkIsAdmin
    static async getTravelRouteWithIncome(ctx: Context, next: Next) {
        await knex.select('routes.*', knex.raw('sum(gross_income) as gross_income'))
            .from('routes').leftOuterJoin('teams', 'routes.rid', 'teams.rid')
            .where('routes.deleted', false).orWhere('teams.deleted', false)
            .groupBy('routes.rid').then(res => {
                if (res.length > 0) {
                    for (const route of res) {
                        route.gross_income = Number(route.gross_income)
                        route.cost = Number(route.cost)
                    }
                    ctx.cd = 0
                    ctx.msg = "获取路线成功"
                    ctx.return = res
                } else {
                    ctx.cd = 1
                    ctx.msg = "获取路线失败！！"
                }
            })
        next()
    }

}
