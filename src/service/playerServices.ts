import fs from "fs";

   export type Player = {
    name: string,
    level: number,
    health: number,
    maxHealth: number,
    exp: number,
    maxExp: number,
    energy: number,
    maxEnergy: number,
    inventory: any[],
   equip: {
    weapon: any | null,
    shield: any | null,
    armor: any | null
},
    coins: number,
    maxCoins: number,
    reputation: number,
    maxReputation: number,
    reputationCategory: string,
    luck: number,
    maxLuck: number,
    luckCategory: string,
    strength: number,
    baseStrength: number,
    maxStrength: number,
    defense: number,
    baseDefense: number,
    maxDefense: number,
    lifeTimeCoins: number,
    timesDefeated: number,
    timesWon: number,
    questsCompleted: number,
    eventsCompleted: number,
    achievements: number[]
  };
type NumericStats = {
  [K in keyof Player]: Player[K] extends number ? K : never
}[keyof Player];

  
class playerServices {
  private player: Player = {
    name: '',
    level: 1,
    health: 100,
    maxHealth: 100,
    exp: 0,
    maxExp: 100,
    energy: 50,
    maxEnergy: 50,
    inventory: [],
   equip: {
    weapon: null,
    shield: null,
    armor: null
},
    coins: 0,
    maxCoins: 90100,
    reputation: 50,
    maxReputation: 100,
    reputationCategory: "neutral",
    luck: 50,
    maxLuck: 100,
    luckCategory: "neutral",
    strength: 15,
    baseStrength: 15,
    maxStrength: 1000,
    defense: 15,
    baseDefense: 15,
    maxDefense: 1000,
    lifeTimeCoins: 0,
    timesDefeated: 0,
    timesWon: 0,
    questsCompleted: 0,
    eventsCompleted: 0,
    achievements: []
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
      equip: {
    weapon: null,
    shield: null,
    armor: null
},
      coins: 0,
      maxCoins: 200000,
      reputation: 50,
      maxReputation: 100,
      reputationCategory: "neutral",
      luck: 50,
      maxLuck: 100,
      luckCategory: "neutral",
      strength: 15,
      maxStrength: 1000,
      defense: 15,
      baseStrength: 15,
      baseDefense: 15,
      maxDefense: 1000,
      lifeTimeCoins: 0,
      timesDefeated: 0,
      timesWon: 0,
      questsCompleted: 0,
      eventsCompleted: 0,
      achievements: []
    };
   
    this.savePlayer();
  return this.player;
  }
   getPlayer() {
    return this.player;
  }


  maxMap = {
    health: 'maxHealth',
    exp: 'maxExp',
    energy: 'maxEnergy',
    reputation: 'maxReputation',
    luck: 'maxLuck',
    coins: 'maxCoins',
  } as const

 loadPlayer() {
  if (fs.existsSync("player.json")) {
    this.player = JSON.parse(fs.readFileSync("player.json", "utf-8"));
  }
}
constructor() {
    this.loadPlayer();
  }

  gainExp(amount: number): Player {
    this.player.exp += amount;
  
    this.savePlayer();
  return this.player;
  }
    savePlayer() {
  fs.writeFileSync("player.json", JSON.stringify(this.player, null, 2));
}


   levelUp(): Player {
    while (this.player.exp >= this.player.maxExp) {
      this.player.level += 1;
      this.player.health += 10;
      this.player.maxHealth += 10;
      this.player.exp -= this.player.maxExp;
      this.player.maxExp += Math.round((this.player.level ** 2) *1.5);
      this.player.energy += 10;
      this.player.maxEnergy += 10;
      this.player.coins += 10;
      this.player.defense += 5;
      this.player.strength += 5;
      this.player.baseDefense += 5;
      this.player.baseStrength += 5;
      
    }
     this.savePlayer();
  return this.player;
  }


  modifyStatGain(stat: keyof typeof this.maxMap, amount: number): Player {
    if (stat === 'coins') {
      this.player.lifeTimeCoins += amount;
    }
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
    this.savePlayer();
  return this.player;
  }

  modifyStatLose(stat:  NumericStats, amount: number): Player {
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
     this.savePlayer();
  return this.player;
  }

  changingLuckCategory(): Player {
    const luck = this.player.luck;
    if (luck <= 20) {
      this.player.luckCategory = "terrible";
    } else if (luck <= 40) {
       this.player.luckCategory = "bad";
    } else if (luck <= 60) {
       this.player.luckCategory = "neutral";
    } else if (luck <= 80) {
      this.player.luckCategory = "good";
    } else if (luck <= 100) {
       this.player.luckCategory = "amazing";
    }
   
    return this.player;
  }

  changingReputationCategory(): Player {
    const reputation = this.player.reputation;
    if (reputation <= 20) {
      this.player.reputationCategory = "terrible";
    } else if (reputation <= 40) {
       this.player.reputationCategory = "bad";
    } else if (reputation <= 60) {
       this.player.reputationCategory = "neutral";
    } else if (reputation <= 80) {
      this.player.reputationCategory = "good";
    } else if (reputation <= 100) {
       this.player.reputationCategory = "amazing";
    }
   
    return this.player;
  }

  itemBuff(stat: 'strength' | 'defense', amount: number) {
    if (stat === 'strength') {
      this.player.strength += amount;
    } else if (stat === 'defense') {
      this.player.defense += amount;
    }
     this.savePlayer();
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
