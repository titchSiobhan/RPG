import { playerServicesInstance } from '../service/playerServices.ts';
import type { Request, Response } from 'express';

function rest(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();
    player.energy += 15;
    res.json(player);
}

export { rest };