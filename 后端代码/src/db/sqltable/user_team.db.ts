import 'knex/types/tables'

declare module 'knex/types/tables' {
    interface UserTeam {
        uid : number
        tid : number
        has_pay : boolean
        score: number
    }
    interface Tables {
        user_team: UserTeam
    }
}
