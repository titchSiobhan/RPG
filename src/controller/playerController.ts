import type { Request, Response } from 'express';
import { playerServicesInstance } from '../service/playerServices.js';
import type { Player } from '../service/playerServices.js';

type CreatePlayerRequest = {
    name: string
}

function createSafePlayer(player: Player) {
	const {
		energy, maxEnergy,
		...safe
	} = player;
	return safe
}
function createPlayer(req: Request, res: Response) {
	const body = req.body as CreatePlayerRequest;
	const player = playerServicesInstance.createPlayer(body.name);
	res.json(player);
}

function getPlayer(req: Request, res: Response) {
	const player = playerServicesInstance.getPlayer();
	res.json(player);
}
type Stat = 'health' | 'energy' | 'exp' | 'coins' | 'reputation' | 'luck';

type StatChange = {
	stat: Stat;
	amount: number;
};
type GainStatRequest =
	| {
			type: 'single';
			stat: Stat;
			amount: number;
	  }
	| {
			type: 'multiple';
			changes: {
				stat: Stat;
				amount: number;
			}[];
	  };

function gainStat(req: Request, res: Response) {
	const player = playerServicesInstance.getPlayer();
	const body = req.body as GainStatRequest;
	if (body.type === 'single') {
		playerServicesInstance.modifyStatGain(body.stat, body.amount);
	} else {
		for (const change of body.changes) {
			playerServicesInstance.modifyStatGain(change.stat, change.amount);
		}
	}
	res.json(player);
}

function loseStat(req: Request, res: Response) {
	const { amount, stat, changes } = req.body;
	const player = playerServicesInstance.getPlayer();
	const body = req.body;
	if (body.type === 'single') {
		playerServicesInstance.modifyStatLose(body.stat, body.amount);
	} else {
		for (const change of body.changes) {
			playerServicesInstance.modifyStatLose(change.stat, change.amount);
		}
	}
	res.json(player);
}

export { createPlayer, getPlayer, gainStat, loseStat, createSafePlayer };
