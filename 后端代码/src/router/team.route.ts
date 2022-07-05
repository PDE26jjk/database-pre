import Router from 'koa-router'
import config from '../config/config.dev'
import TeamController from '../controller/team.controller' 

const router = new Router({prefix: '/team'})

router.post('/create_team',TeamController.createTeam)
router.post('/modify_team',TeamController.modifyTeam)
router.get('/get_teams',TeamController.getTeams)
router.delete('/delete_team',TeamController.removeTeam)
router.get('/get_team_by_route_id',TeamController.getTeamsByRouteId)
router.get('/get_my_teams',TeamController.getMyTeams)
router.get('/get_my_guide_teams',TeamController.getMyGuideTeams)
router.get('/join_team',TeamController.joinTeam)
router.get('/pay',TeamController.payTeam)
router.get('/leave_team',TeamController.leaveTeam)
router.get('/set_out',TeamController.setOut)
router.get('/finish',TeamController.finish)
router.get('/set_guide',TeamController.setGuide)
router.get('/set_score',TeamController.setScore)
router.get('/set_status',TeamController.setStatus)

export default router.routes()
