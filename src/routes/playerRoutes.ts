import {Router } from 'express'
import * as playerController from '../controller/playerController.js'
const playerRouter = Router()
import { loadPlayer, deletePlayer } from '../saveGame.js'
import {playerServicesInstance} from '../service/playerServices.js'

playerRouter.post('/create', playerController.createPlayer)

playerRouter.get("/", (req, res) => {
  const saved = loadPlayer();

  if (!saved) {
    return res.json(null); // <-- IMPORTANT
  }

  return res.json(playerServicesInstance.getPlayer());
});

playerRouter.post('/gainStat', playerController.gainStat)

playerRouter.post('/loseStat', playerController.loseStat)

playerRouter.get('/delete', deletePlayer)


export default playerRouter