import {Router } from 'express'
import * as playerController from '../controller/playerController.js'
const playerRouter = Router()

playerRouter.post('/create', playerController.createPlayer)

playerRouter.get('/', playerController.getPlayer)

playerRouter.post('/gainStat', playerController.gainStat)

playerRouter.post('/loseStat', playerController.loseStat)



export default playerRouter