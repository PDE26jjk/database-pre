import {Team, User} from 'knex/types/tables';
import knex from '../db/sql'
import {Context, MetheodType, Next} from 'TYPE';
import UserController from './user.controller'
import TravelRouteController from './travel_route.controller';
import AdminController from './admin.controller';
import GuideController from './guide.controller';
export default class TeamController {
    static async insertTeam(rid: number, name: string, can_join: boolean, set_out_time: Date) {
        if (!await TravelRouteController.getTravelRouteById(rid)) return null
        let team = await knex('teams').insert({
            rid, name,
            can_join,
            set_out_time
        })
        return team[0]
    }

    @AdminController.checkIsAdmin
    static async getTeams(ctx: Context, next: Next) {
        let teams = await knex.select("teams.*", "routes.name as routename")
            .from("teams").leftJoin("routes", "teams.rid", "routes.rid").where("teams.deleted", 0)
        if (!teams) {
            ctx.cd = 1
            ctx.msg = "没有团队！！"
            next()
            return
        }
        ctx.cd = 0
        ctx.msg = "查找成功！！"
        ctx.return = teams
        next()
    }
    @UserController.checkLogin
    static async getMyGuideTeams(ctx: Context, next: Next) {
        if (!ctx.user.is_guide) {
            ctx.cd = 1
            ctx.msg = "不是导游！！"
            next()
            return
        }
        let teams = await knex.select()
            .from("teams").where({gid: ctx.user.uid}) as any
        if (!teams) {
            ctx.cd = 1
            ctx.msg = "没有导游的团队！！"
            next()
            return
        }
        for (let i = 0; i < teams.length; i++) {
            teams[i] = await TeamController.getTeamById(teams[i].tid)
            let can_go = false
            if (teams[i].status == 1) {
                can_go = true
                for (let member of teams[i].members) {
                    if (!member.has_pay) {
                        can_go = false
                        break
                    }
                }
            }
            // 缴费完了可以出行
            teams[i].can_go = can_go
        }
        ctx.cd = 0
        ctx.msg = "查找成功！！"
        ctx.return = teams
        next()
    }
    @UserController.checkLogin
    static async getMyTeams(ctx: Context, next: Next) {
        let teams = await knex.select()
            .from("user_team").leftJoin("teams", "teams.tid", "user_team.tid")
            .where({uid: ctx.user.uid}) as any
        if (!teams) {
            ctx.cd = 1
            ctx.msg = "没有团队！！"
            next()
            return
        }
        for (let i = 0; i < teams.length; i++) {
            let {has_pay, score} = teams[i]
            teams[i] = await TeamController.getTeamById(teams[i].tid)
            teams[i].has_pay = has_pay
            teams[i].my_score = score
        }
        ctx.cd = 0
        ctx.msg = "查找成功！！"
        ctx.return = teams
        next()
    }
    @UserController.checkLogin
    static async modifyTeam(ctx: Context, next: Next) {
        let {teamid, teamname, can_join, gid, set_out_time} = ctx.request.body
        let team = await knex('teams').select().where({tid: teamid}).first()
        if (!team) {
            ctx.cd = 1
            ctx.msg = "没有团队！！"
            next()
            return
        }
        if (can_join != null) {
            if (can_join == 'false') can_join = false
            team.can_join = Boolean(can_join)
        }
        if (teamname)
            team.name = teamname
        if (gid)
            team.gid = gid
        if (set_out_time)
            team.set_out_time = new Date(set_out_time)
        await knex('teams').update(team).where({tid: team.tid}).then(num => {
            if (num > 0) {
                ctx.cd = 0
                ctx.msg = "修改成功"
            }
            else {
                ctx.cd = 1
                ctx.msg = "修改失败"
            }
        })
        next()
    }
    @UserController.checkLogin
    static async createTeam(ctx: Context, next: Next) {
        let {teamname, routeid, can_join, set_out_time} = ctx.request.body
        console.log(set_out_time);
        let date = new Date(set_out_time)
        console.log(date);

        let teamid = await TeamController.insertTeam(Number(routeid), teamname, Boolean(can_join), date)
        if (!teamid) {
            ctx.cd = 1
            ctx.msg = "创建失败,无此路线！！"
            next()
            return
        }
        (ctx.query as any).teamid = teamid
        ctx.cd = 0
        ctx.msg = "创建成功！！"
        ctx.return = {teamid}
        next()
    }
    @AdminController.checkIsAdmin
    static async removeTeam(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        console.log("dfasdf");
        let {teamid} = ctx.query
        await knex('teams').where('tid', teamid).update({deleted: true}).then(num => {
            if (num > 0) {
                ctx.cd = 0
                ctx.msg = "删除成功"
            }
            else {
                ctx.cd = 1
                ctx.msg = "删除失败"
            }
        })
        next()
    }
    static async getTeamsByRouteId(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {routeid} = ctx.query
        let teams = await knex('teams').select().where('rid', routeid).andWhere('deleted',false) as any
        if (teams.length) {
            let route = await TravelRouteController.getTravelRouteById(Number(routeid))
            for (let i = 0; i < teams.length; i++) {
                teams[i] = await TeamController.getTeamById(Number(teams[i].tid))
                if (teams[i].status == 0 && teams[i].members_number >= route.min_members_number) {
                    await knex('teams').where('tid', teams[i].tid).update({status: 1})
                }
            }
            ctx.cd = 0
            ctx.msg = "搜索团队成功"
            ctx.return = teams
        } else {
            ctx.cd = 1
            ctx.msg = "没有团队！！"
        }
        next()
        return teams
    }

    static async getTeamById(teamid: number) {
        let team = await knex.select("teams.*", 'routes.cost as cost', 'routes.name as routename', 'routes.min_members_number', 'routes.max_members_number')
            .from('teams')
            .leftJoin("routes", "teams.rid", "routes.rid")
            .where('tid', teamid).andWhere("teams.deleted", false)
            .first() as any
        if (!team) return null
        let members = await knex('user_team').leftJoin('users', 'user_team.uid', 'users.uid').select().where('tid', teamid)
        let gross_income = 0
        let cost = Number(team.cost)
        if (members.length) {
            team.members = members
            for (const m of members) {
                if (m.has_pay)
                    gross_income += cost
            }
        }
        team.members_number = members.length
        await knex('teams').where('tid', teamid).update({members_number: team.members_number, gross_income})
        return team
    }

    @AdminController.checkIsAdmin
    static async setGuide(ctx: Context, next: Next) {
        let {gid, tid} = ctx.query
        const guide = await GuideController.getGuideById(Number(gid));
        const team = await TeamController.getTeamById(Number(tid));
        if (guide && team) {
            await knex('teams').update({gid: Number(gid)}).where({tid: Number(tid)}).then(async num => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "设置成功"
                    ctx.return = await TeamController.getTeamById(Number(tid))
                } else {
                    ctx.cd = 1
                    ctx.msg = "设置失败"
                }
            })
        } else {
            ctx.cd = 1
            ctx.msg = "信息错误！！"
        }
        next()
    }
    @UserController.checkLogin
    static async setScore(ctx: Context, next: Next) {
        let {teamid, score} = ctx.query
        let scoreNum = Number(score)
        if (!scoreNum) {
            ctx.cd = 1
            ctx.msg = "参数错误！！"
            next()
            return
        } else {
            if (scoreNum < 1) scoreNum = 1
            else if (scoreNum > 5) scoreNum = 5
        }

        await knex('user_team').where({uid: ctx.user.uid, tid: Number(teamid)}).update({score: scoreNum})
            .then(num => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "评分成功"
                } else {
                    ctx.cd = 1
                    ctx.msg = "没加入团队！！"
                }
            })
        next()
        return
    }

    @UserController.checkLogin
    static async finish(ctx: Context, next: Next) {
        let {teamid} = ctx.query

        let team = await TeamController.getTeamById(Number(teamid))

        if (team.status != 2) {
            ctx.cd = 1
            ctx.msg = "未满足完成条件！！"
            next()
            return
        }
        ctx.query.status = '3'
        ctx.query.guideSettingStatus = '1'
        await TeamController.setStatus(ctx, next)
    }

    @UserController.checkLogin
    static async setOut(ctx: Context, next: Next) {
        let {teamid} = ctx.query

        let team = await TeamController.getTeamById(Number(teamid))
        let can_go = false
        if (team.status == 1) {
            can_go = true
            for (let member of team.members) {
                if (!member.has_pay) {
                    can_go = false
                    break
                }
            }
        }
        if (!can_go) {
            ctx.cd = 1
            ctx.msg = "未满足出游条件！！"
            next()
            return
        }
        ctx.query.status = '2'
        ctx.query.guideSettingStatus = '1'
        await TeamController.setStatus(ctx, next)
    }

    @UserController.checkLogin
    static async setStatus(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {teamid, status} = ctx.query
        let team = null as any
        if (ctx.user.is_admin) {
            team = await knex('teams').where({tid: Number(teamid)}).first()
        }
        else if (ctx.user.is_guide && ctx.query.guideSettingStatus) {
            team = await knex('teams').where({tid: Number(teamid), gid: ctx.user.uid}).first()
        }
        if (!team) {
            ctx.cd = 0
            ctx.msg = "无权限！！"
            next()
            return
        }
        else {
            await knex('teams').where({tid: Number(teamid)}).update({status: Number(status)}).then(num => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "设置成功"
                } else {
                    ctx.cd = 1
                    ctx.msg = "设置失败！！"
                }
            })
        }
        next()
    }
    @UserController.checkLogin
    static async payTeam(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {teamid} = ctx.query
        await knex('user_team').where({uid: ctx.user.uid, tid: Number(teamid), has_pay: false})
            .update({has_pay: true}).then(num => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "缴费成功"
                } else {
                    ctx.cd = 1
                    ctx.msg = "缴费失败！！"
                }
            })

        next()
        return
    }
    @UserController.checkLogin
    static async leaveTeam(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {teamid} = ctx.query
        let team = await TeamController.getTeamById(Number(teamid))
        if (!team) {
            ctx.cd = 1
            ctx.msg = "无此团队！！"
            next()
            return
        }
        await knex('user_team').where({uid: ctx.user.uid, tid: team.tid})
            .del().then(num => {
                if (num > 0) {
                    ctx.cd = 0
                    ctx.msg = "退出成功"
                } else {
                    ctx.cd = 1
                    ctx.msg = "退出失败！！"
                }
            })
        next()
        return
    }
    @UserController.checkLogin
    static async joinTeam(ctx: Context, next: Next) {
        next = next || (() => {}) as any
        let {teamid} = ctx.query
        let team = await TeamController.getTeamById(Number(teamid))
        if (!team) {
            ctx.cd = 1
            ctx.msg = "无此团队！！"
            next()
            return
        }
        let route = await TravelRouteController.getTravelRouteById(Number(team.rid))
        if (route.max_members_number != 0 && team.members_number > route.max_members_number) {
            ctx.cd = 1
            ctx.msg = "团队人数已满！！"
            next()
            return
        }
        await knex('user_team').insert({uid: ctx.user.uid, tid: team.tid})
            .onConflict(['uid', 'tid']).ignore().then(num => {
                if (num.length > 0) {
                    ctx.cd = 0
                    ctx.msg = "加入成功"
                } else {
                    ctx.cd = 1
                    ctx.msg = "加入失败！！"
                }
            })
        next()
        return
    }
}
