import {Router } from 'express'
import * as playerController from '../controller/playerController.js'
const playerRouter = Router()

import {playerServicesInstance} from '../service/playerServices.js'

playerRouter.post('/create', playerController.createPlayer)

playerRouter.get("/", playerController.getPlayer);

playerRouter.post('/gainStat', playerController.gainStat)

playerRouter.post('/loseStat', playerController.loseStat)




export default playerRouter