import {defineStore} from 'pinia'

export const GetUserState = defineStore({
    id: 'user',
    state: () => ({
        "uid": 0,
        "is_admin": 0,
        "is_guide": 0,
        "user_name": "",
        "name": null,
        "tel": null,
        "identification": null,
        avatar:'3ea6beec64369c2642b92c6726f1epng.png',
        gender:"未知",
    }),
    actions: {
    }
})
