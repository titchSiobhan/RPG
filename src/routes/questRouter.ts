import * as questController from '../controller/questController.js'
import { Router } from 'express'
const questRouter = Router()

questRouter.post('/', questController.rest)


export default questRouter