import Router from 'koa-router'
import config from '../config/config.dev'
import UserController from '../controller/user.controller'

const router = new Router({prefix: '/user'})

router.get('/get_users', UserController.getUsers)
router.get('/has_login', UserController.hasLogin)
router.get('/logout', UserController.logout)
router.get('/user_exists', UserController.userExists)
router.post('/registry', UserController.registry)
router.post('/change_avatar', UserController.changeAvatar)
router.post('/set_data', UserController.setData)
router.post('/login', UserController.login)
router.post('/change_password', UserController.changePassword)

export default router.routes()
