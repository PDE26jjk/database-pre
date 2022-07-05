import 'knex/types/tables'

declare module 'knex/types/tables' {
    interface User {
        uid: number
        is_admin: boolean
        is_guide: boolean
        user_name: string
        name: string
        pwd: string
        tel: string
        identification: string
        avatar: string
        gender: string
    }
    interface Tables {
        users: User
    }
}
