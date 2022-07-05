import 'knex/types/tables'

declare module 'knex/types/tables' {
    interface Guide {
        uid: number
        work_name: string
    }
    interface Tables {
        guides: Guide
    }
}
