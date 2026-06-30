import {Router } from 'express'
import * as playerController from '../controller/playerController.js'
import * as achievementController from '../controller/achievementsController.js'
const playerRouter = Router()

import {playerServicesInstance} from '../service/playerServices.js'

playerRouter.post('/create', playerController.createPlayer)

playerRouter.get("/", playerController.getPlayer);

playerRouter.post('/gainStat', playerController.gainStat)

playerRouter.post('/loseStat', playerController.loseStat)

playerRouter.post('/equipItem/:id', playerController.equipItem)

playerRouter.post('/unEquipItem/:id', playerController.unEquipItem)

playerRouter.get('/achievements', achievementController.getAchievements)


export default playerRouter