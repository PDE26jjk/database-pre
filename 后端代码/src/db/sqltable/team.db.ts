import 'knex/types/tables'

declare module 'knex/types/tables' {
    interface Team {
        tid: number
        rid: number
        gid: number
        name: string
        members_number: number
        can_join: boolean
        create_time: number
        status: number
        gross_income: number
        deleted: boolean
        set_out_time: Date
    }
    interface Tables {
        teams: Team
    }
}
