import Router from 'koa-router'
import config from '../config/config.dev'
import AdminController from '../controller/admin.controller'

const router = new Router({prefix: '/admin'})

router.get('/is_admin', AdminController.isAdmin)
export default router.routes()
