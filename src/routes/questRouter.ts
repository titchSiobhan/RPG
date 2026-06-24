import * as questController from '../controller/questController.js'
import { Router } from 'express'
const questRouter = Router()

questRouter.post('/rest', questController.rest)

questRouter.post('/quest', questController.getRandomQuest)

questRouter.post('/outcome', questController.getRandomQuestOutcomeAccept)

questRouter.post('/decline', questController.declineQuest)


export default questRouter