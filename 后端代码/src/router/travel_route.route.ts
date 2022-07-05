import Router from 'koa-router'
import TravelRouteController from '../controller/travel_route.controller'

const router = new Router({prefix: '/travel_route'})

router.post('/add_route', TravelRouteController.addTravelRoute)
router.post('/modify_route', TravelRouteController.modifyRoute)
router.get('/get_routes', TravelRouteController.getTravelRoute)
router.get('/get_routes_with_income', TravelRouteController.getTravelRouteWithIncome)
router.get('/get_rank', TravelRouteController.getTravelRoutesRank)
router.get('/get_route_by_id', TravelRouteController._getTravelRouteById)
router.delete('/delete_route', TravelRouteController.deleteRoute)

export default router.routes()
