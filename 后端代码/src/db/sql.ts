import config from '../config/config.dev'
let {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_DATEBASE} = config
import Knex from 'knex'
// import * as tables from './sqltable'

const knex = Knex({
    client: 'mysql2',
    connection: {
        host: MYSQL_HOST,
        port: Number(MYSQL_PORT),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATEBASE
    },
    debug: true
})
import {User,Guide,Tables} from 'knex/types/tables'

export default knex

