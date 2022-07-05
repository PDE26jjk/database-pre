import Router from 'koa-router'
import config from '../config/config.dev'
import GuideController from '../controller/guide.controller'

const router = new Router({prefix: '/guide'})

router.get('/get_guides', GuideController.getGuides)
router.post('/add_guide', GuideController.addGuide)
router.delete('/remove_guide', GuideController.removeGuide)

export default router.routes()
