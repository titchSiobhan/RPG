export type Player = {
	name: string;
	level: number;
	health: number;
	maxHealth: number;
	exp: number;
	maxExp: number;
	energy: number;
	maxEnergy: number;
	inventory: any[];
	coins: number;
	maxCoins: number;
	reputation: number;
	maxReputation: number;
	reputationCategory: string;
	luck: number;
	maxLuck: number;
	luckCategory: string;
	strength: number;
	maxStrength: number;
	defense: number;
	maxDefense: number;
};
type NumericStats = {
	[K in keyof Player]: Player[K] extends number ? K : never;
}[keyof Player];

class playerServices {
	private player: Player = {
		name: 'Unknown',
		level: 1,
		health: 100,
		maxHealth: 100,
		exp: 0,
		maxExp: 100,
		energy: 50,
		maxEnergy: 50,
		inventory: [],
		coins: 0,
		maxCoins: 90100,
		reputation: 50,
		maxReputation: 100,
		reputationCategory: 'neutral',
		luck: 50,
		maxLuck: 100,
		luckCategory: 'neutral',
		strength: 30,
		maxStrength: 1000,
		defense: 5,
		maxDefense: 1000,
	};
	getPlayer() {
		return this.player;
	}

	createPlayer(name: string): Player {
		this.player = {
			name,
			level: 1,
			health: 100,
			maxHealth: 100,
			exp: 0,
			maxExp: 100,
			energy: 50,
			maxEnergy: 50,
			inventory: [],
			coins: 0,
			maxCoins: 90100,
			reputation: 50,
			maxReputation: 100,
			reputationCategory: 'neutral',
			luck: 50,
			maxLuck: 100,
			luckCategory: 'neutral',
			strength: 15,
			maxStrength: 1000,
			defense: 15,
			maxDefense: 1000,
		};

		return this.player;
	}
	maxMap = {
		health: 'maxHealth',
		exp: 'maxExp',
		energy: 'maxEnergy',
		reputation: 'maxReputation',
		luck: 'maxLuck',
		coins: 'maxCoins',
	} as const;

	gainExp(amount: number): Player {
		this.player.exp += amount;
		return this.player;
	}

	levelUp(): Player {
		while (this.player.exp >= this.player.maxExp) {
			this.player.level += 1;
			this.player.health += 10;
			this.player.maxHealth += 10;
			this.player.exp -= this.player.maxExp;
			this.player.maxExp += Math.round(this.player.level ** 2 * 1.5);
			this.player.energy += 10;
			this.player.maxEnergy += 10;
			this.player.coins += 10;
		}
		return this.player;
	}

	modifyStatGain(stat: keyof typeof this.maxMap, amount: number): Player {
		if (stat === 'exp') {
			this.gainExp(amount);
			return this.levelUp();
		}
		const maxStat = this.maxMap[stat];
		this.player[stat] += amount;
		if (this.player[stat] > this.player[maxStat]) {
			this.player[stat] = this.player[maxStat];
		}
		const newLuck = this.player.luck;
		this.changingLuckCategory();
		if (newLuck !== this.player.luck) {
			this.changingLuckCategory();
		}

		const newReputation = this.player.reputation;
		this.changingReputationCategory();
		if (newReputation !== this.player.reputation) {
			this.changingReputationCategory();
		}
		return this.player;
	}

	modifyStatLose(stat: NumericStats, amount: number): Player {
		this.player[stat] = Math.max(0, (this.player[stat] as number) - amount);
		const newLuck = this.player.luck;
		this.changingLuckCategory();
		if (newLuck !== this.player.luck) {
			this.changingLuckCategory();
		}

		const newReputation = this.player.reputation;
		this.changingReputationCategory();
		if (newReputation !== this.player.reputation) {
			this.changingReputationCategory();
		}
		return this.player;
	}

	changingLuckCategory(): Player {
		const luck = this.player.luck;
		if (luck <= 20) {
			this.player.luckCategory = 'terrible';
		} else if (luck <= 40) {
			this.player.luckCategory = 'bad';
		} else if (luck <= 60) {
			this.player.luckCategory = 'neutral';
		} else if (luck <= 80) {
			this.player.luckCategory = 'good';
		} else if (luck <= 100) {
			this.player.luckCategory = 'amazing';
		}

		return this.player;
	}

	changingReputationCategory(): Player {
		const reputation = this.player.reputation;
		if (reputation <= 20) {
			this.player.reputationCategory = 'terrible';
		} else if (reputation <= 40) {
			this.player.reputationCategory = 'bad';
		} else if (reputation <= 60) {
			this.player.reputationCategory = 'neutral';
		} else if (reputation <= 80) {
			this.player.reputationCategory = 'good';
		} else if (reputation <= 100) {
			this.player.reputationCategory = 'amazing';
		}

		return this.player;
	}

	loadFromSave(player: Player): Player {
		this.player = {
			...this.player,
			...player,
		};
		return this.player;
	}
}

export const playerServicesInstance = new playerServices();

// playerServicesInstance.createPlayer("Siobhan")
// playerServicesInstance.gainExp(15000

// )
// playerServicesInstance.levelUp()
// playerServicesInstance.modifyStatGain("reputation", 12)
// playerServicesInstance.modifyStatGain("coins", 1)
// console.log(playerServicesInstance.getPlayer());
