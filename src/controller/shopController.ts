import items from '../dataJsons/items.json' with { type: 'json' };


import type { Request, Response } from 'express';
import { playerServicesInstance } from '../service/playerServices.js';
import {achievementController} from './achievementsController.js';



function getItems(req: Request, res: Response) {
    res.json(items);
}

function buyItem(req: Request, res : Response) {
    const player = playerServicesInstance.getPlayer();
    const itemId = Number(req.params.id);
    const item = items.items.find((item) => item.id === itemId);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    if (player.coins < item.price) {
        console.log("You don't have enough coins");
        res.json({message: "You don't have enough coins"});
    } else {
        player.coins -= item.price;
        player.inventory.push(item);
    }
    achievementController.check(player, "item", item.name);
    playerServicesInstance.savePlayer();

    res.json({ 
    player,
    message: `${item.name} bought!`
});

}

export { getItems , buyItem };