
interface user_info {
    userName: string,
    password: string,
    regdate: int,
}
interface message_interface {
    code: number,
    message: string,
}
export interface API_GET {
    [index: string]: {input: unknown, output: any}
    '/user_registry': {
        input: {userName:string,password:string},
        output: {
            user:user_info
        }
    }
    '/login': {
        input: {userId: number}
        output: undefined
    }
}
export interface API_POST {
    '/user': {
        input: {userId: number},
        output: {
            userName: string,
            userAge: number
        }
    }
}

