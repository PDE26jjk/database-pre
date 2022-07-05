
declare module 'TYPE' {
    import Koa from 'koa'
    import Router from 'koa-router'
    import {User} from 'knex/types/tables'
    interface Context extends Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any> {
        msg: string
        cd: number
        user: User
        return: any
    }
    type Next = Koa.Next
    type MetheodType = TypedPropertyDescriptor<(ctx: Context, next: Next) => Promise<void>>
}

