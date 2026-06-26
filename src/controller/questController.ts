import { playerServicesInstance } from '../service/playerServices.js';
import quests from '../dataJsons/quest.json' with { type: 'json' };
import type { Request, Response } from 'express';


function rest(req: Request, res: Response) {
	const player = playerServicesInstance.getPlayer();
try {
    const randomLuck = Math.floor(Math.random() * 100);
	player.health = Math.min(player.health + 15, player.maxHealth);
	player.energy = Math.min(player.energy + 15, player.maxEnergy);
    player.luck = randomLuck;
    playerServicesInstance.changingLuckCategory();
    
    const luckMessages: Record<string, string> = {
            terrible: "You feel really unlucky today.",
            bad: "Don't feel too lucky today.",
            neutral: "You don't feel very lucky today.",
            good: "You feel lucky today.",
            amazing: "You feel super lucky today."
        };
		const message = luckMessages[player.luckCategory];
		
	res.json({player, message});
}
catch (error) {
	console.log(error);
	res.status(500).json({ error: 'Internal server error'});
}
}

function getRandomQuest(req: Request, res: Response) {
	const questIndex = Math.floor(Math.random() * quests.quests.length);
	const quest = quests.quests[questIndex];
	if (!quest) {
		throw new Error('No quests found');
	}
	
	return res.json(quest);
}

function getRandomQuestOutcomeAccept(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();
const {questId} = req.body;

const quest = quests.quests.find(q => q["questID"] === questId)

	if (!quest) {
		throw new Error('No quests found');
	}

	
	type LuckCategory = 'terrible' | 'bad' | 'neutral' | 'good' | 'amazing';

	const luck = player.luckCategory as LuckCategory;
	player.energy -= 5;
	const tier = quest.outcomes[luck];

	if (!tier) {
		throw new Error(`No outcomes found for luck category: ${luck}`);
	}

	const total = tier.reduce((sum: number, o: any) => sum + o.chance, 0);
	let roll = Math.random() * total;
	type NumericStats =
		| 'exp'
		| 'coins'
		| 'health'
		| 'reputation'
		| 'energy'
		| 'luck';

	for (const outcome of tier) {
		roll -= outcome.chance;
		if (roll <= 0) {
			if (outcome.reward) {
				for (const reward of outcome.reward) {
					const stat = Object.keys(reward)[0] as keyof typeof reward;
					const amount =
						reward[stat] + Math.round((reward[stat] * player.level ** 2) / 50);

					playerServicesInstance.modifyStatGain(stat as NumericStats, amount);
				}
			}
			if (outcome.punishment) {
				for (const punishment of outcome.punishment) {
					const stat = Object.keys(punishment)[0] as keyof typeof punishment;
					const amount =
						punishment[stat] +
						Math.round((punishment[stat] * player.level ** 2) / 50);

					playerServicesInstance.modifyStatLose(stat as NumericStats, amount);
				}
			}
		
				return res.json({	outcome, player });
		}
	}
}

function declineQuest(req: Request, res: Response) {
	const player = playerServicesInstance.getPlayer();
	const {questId }= req.body;

	const quest = quests.quests.find(q => q.questID === questId);
	if (!quest) {
		throw new Error('No quests found');
	}

	
	const punishment =  quest.punishment;

	if (!punishment) {
		return res.json({ quest, punishmentApplied: null });
	}

	
	if (Array.isArray(punishment)) {
		for (const p of punishment) {
			for (const statKey of Object.keys(p)) {
				const amount = p[statKey];
				playerServicesInstance.modifyStatLose(statKey as any, amount);
			}
		}
	} else {
		for (const statKey of Object.keys(punishment)) {
			const amount = (punishment as any)[statKey];
			playerServicesInstance.modifyStatLose(statKey as any, amount);
		}
	}

	return res.json({ quest, punishmentApplied: punishment, player });

}





// console.log(startQuest);
// console.log(quest);
// console.log(playerServicesInstance.getPlayer());

export { rest, getRandomQuest, getRandomQuestOutcomeAccept, declineQuest };
