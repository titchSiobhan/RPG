import achievements from '../dataJsons/achievements.json' with { type: 'json' };
import type { Request, Response } from 'express';
import type { Player } from '../service/playerServices.js';
type AchievementType = 'fight' | 'event' | 'quest' | 'coins' | 'item' | 'stats';
type PlayerNumberStat = 
    "lifeTimeCoins" |
    "timesDefeated" |
    "timesWon" |
    "questsCompleted" |
    "eventsCompleted";


function getAchievements(req: Request, res: Response) {
	res.json(achievements);
}

class AchievementController {
	check(player: Player, type: AchievementType, value: string | number) {
		for (const a of achievements.achievements) {
			// Already unlocked?
			if (player.achievements.includes(a.id)) continue;

			// Type mismatch?
			if (a.type !== type) continue;

			// Fight achievement
			if (type === 'fight' && a.target === value) {
				this.unlock(player, a.id);
			}

			// Event achievement
			if (type === 'event' && a.target === value) {
				this.unlock(player, a.id);
			}

			// Quest achievement
			if (type === 'quest' && a.target === value) {
				this.unlock(player, a.id);
			}

			// Coins (current or total)
			if (type === 'coins' && value >= a.target) {
				this.unlock(player, a.id);
			}

			// Item achievement
			if (type === 'item' && a.target === value) {
				this.unlock(player, a.id);
			}
			if (type === "stats" && typeof a.target === "string") {
    const [stat, amount] = a.target.split(":") as [PlayerNumberStat, string];

    if (player[stat] >= Number(amount)) {
        this.unlock(player, a.id);
    }
}


		}
	}

	unlock(player: Player, id: number) {
		player.achievements.push(id);
	}


}

export const achievementController = new AchievementController();

export { getAchievements };
