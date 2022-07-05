import 'knex/types/tables'

declare module 'knex/types/tables' {
    interface Route {
        rid: number
        name: string
        cost: number
        min_members_number: number
        max_members_number: number
        info: string
        image_path: string
        deleted: boolean
        duration: number
    }
    interface Tables {
        routes: Route
    }
}
