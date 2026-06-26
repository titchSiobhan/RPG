import { playerServicesInstance } from '../service/playerServices.js';
import quests from '../dataJsons/events.json' with { type: 'json' };
import type { Request, Response } from 'express';


function getRandomEvent(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();
    const eventIndex = Math.floor(Math.random() * quests.events.length);
    const event = quests.events[eventIndex];
    if (!event) {
        throw new Error('No events found');
    }
    type NumericStats =
		| 'exp'
		| 'coins'
		| 'health'
		| 'reputation'
		| 'energy'
		| 'luck';

    if (event.reward) {
        for (const reward of event.reward) {
            const stat = Object.keys(reward)[0] as keyof typeof reward;
            const amount = reward[stat] + Math.round((reward[stat] * player.level ** 2) / 50)
            playerServicesInstance.modifyStatGain(stat as NumericStats, amount);
        }
    }
    if (event.punishment) {
        for (const punishment of event.punishment) {
            const stat = Object.keys(punishment)[0] as keyof typeof punishment;
            const amount = punishment[stat] - Math.round((punishment[stat] * player.level ** 2) / 50);
            playerServicesInstance.modifyStatLose(stat as NumericStats, amount);
        }
    }
    return res.json(event);
}

export { getRandomEvent };