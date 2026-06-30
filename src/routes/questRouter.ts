import * as questController from '../controller/questController.js'
import * as eventController from '../controller/eventController.js'

import { Router } from 'express'
const questRouter = Router()

questRouter.post('/rest', questController.rest)

questRouter.post('/quest', questController.getRandomQuest)

questRouter.post('/outcome', questController.getRandomQuestOutcomeAccept)

questRouter.post('/decline', questController.declineQuest)

questRouter.post('/event', eventController.getRandomEvent)


export default questRouter