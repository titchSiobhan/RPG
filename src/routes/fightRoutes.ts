import { Router } from 'express'
import * as fightController from '../controller/fightController.js'
const fightRouter = Router()

fightRouter.get('/', fightController.createEnemy)

fightRouter.post('/start', fightController.startFight)

fightRouter.post('/attack', fightController.attackEnemy)

fightRouter.post('/enemyAttack', fightController.enemyAttacks)

export default fightRouter