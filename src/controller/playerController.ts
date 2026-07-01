import type { Request, Response } from 'express';
import { playerServicesInstance } from '../service/playerServices.js';
import items from '../dataJsons/items.json' with { type: 'json' };
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
	playerServicesInstance.savePlayer();

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
	playerServicesInstance.savePlayer();

	res.json(player);
}

function equipItem (req: Request, res: Response) {
	const itemId = Number(req.params.id);
	const  item = items.items.find((item) => item.id === itemId);
	const player = playerServicesInstance.getPlayer();

	  if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
	  // Check inventory
    const hasItem = player.inventory.some(inv => inv.id === itemId);
    if (!hasItem) {
        return res.status(400).json({ error: "You do not own this item" });
    }

    // Check level requirement
    if (player.level < item.level) {
        return res.status(400).json({ error: "Your level is too low to equip this item" });
    }

	if (item.type === 'consumable') {
		if(item.effect.health){
			playerServicesInstance.modifyStatGain('health', item.effect.health);
			player.inventory = player.inventory.filter(inv => inv.id !== item.id);
			playerServicesInstance.savePlayer();

			return res.json({message: `Used ${item.name}`, player});
		}
		if (item.effect.luck) {
			playerServicesInstance.modifyStatGain('luck', item.effect.luck);
			player.inventory = player.inventory.filter(inv => inv.id !== item.id);
			playerServicesInstance.savePlayer();

			return res.json({message: `Used ${item.name}`, player});
		}
		
	}
	const slot = item.type as 'weapon' | 'armor' | 'shield'
	// removed old
	const oldItem = player.equip[slot];
	if (oldItem) {
		if (oldItem.effect.strength) {
			player.strength -= oldItem.effect.strength
		}
		if (oldItem.effect.defense) {
			player.defense -= oldItem.effect.defense
		}

		player.equip[slot] = item
		if (item.effect.strength) {
			player.strength += item.effect.strength
		}
		if (item.effect.defense) {
			player.defense += item.effect.defense
		}
		playerServicesInstance.savePlayer();

		return res.json({message: `Equipped ${item.name}`, player});
	}
	
	
	// if there was no previous item in the slot, set it
	player.equip[slot] = item
	if (item.effect.strength) {
		player.strength += item.effect.strength
	}
	if (item.effect.defense) {
		player.defense += item.effect.defense
	}
	
	
	playerServicesInstance.savePlayer();

	res.json(player);

}

function unEquipItem(req: Request, res: Response) {
		const itemId = Number(req.params.id);
	const  item = items.items.find((item) => item.id === itemId);
	const player = playerServicesInstance.getPlayer();
	  if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
	const slot = item.type as 'weapon' | 'armor' | 'shield'
	const oldItem = player.equip[slot];
	if (oldItem) {
		if (oldItem.effect.strength) {
			player.strength -= oldItem.effect.strength
		}
		if (oldItem.effect.defense) {
			player.defense -= oldItem.effect.defense
		}

		player.equip[slot] = null
		playerServicesInstance.savePlayer();

		return res.json({message: `Unequipped ${item.name}`, player});
	}
	
}

export { createPlayer, getPlayer, gainStat, loseStat, createSafePlayer, equipItem, unEquipItem };
