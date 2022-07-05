import Router from 'koa-router'
import config from '../config/config.dev'
import FileController from '../controller/file.controller'

const router = new Router({prefix: '/file'})

router.get('/:filename', FileController.getFile)

export default router.routes()
