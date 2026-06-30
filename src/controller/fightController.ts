import enemyNames from '../dataJsons/enemyNames.json' with { type: 'json' };
import enemies from '../dataJsons/enemyTypes.json' with { type: 'json' };
import { playerServicesInstance } from '../service/playerServices.js';

import type { Request, Response } from 'express';
import { achievementController } from './achievementsController.js';



let currentEnemy: any = null;

function random<T>(array: T[]): T {
    const item = array[Math.floor(Math.random() * array.length)];
    if (item === undefined) {
        throw new Error('Array must not be empty');
    }
    return item;
}
type Enemy = {
    name: string;
    type: any;
    health: number;
    maxHealth: number;
    strength: number;
    defense: number;
};
function createEnemy(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();
    const enemyName = random(enemyNames.enemyNames);
    const enemy: any = random(enemies.enemies);
    const health = Math.floor(player.maxHealth * (Math.random() * 0.95 + 0.55));

    const strength = Math.floor(player.baseStrength * (Math.random() * 0.85 + 0.55));
    const defense = Math.floor(player.baseDefense * (Math.random() * 0.85 + 0.55));
    const enemyObject: Enemy = {
        name: enemyName,
        type: enemy,
        health: health,
        maxHealth: health,
        strength: strength,
        defense: defense,
    };
    
    return enemyObject;
}

function startFight(req: Request, res: Response) {
     const player = playerServicesInstance.getPlayer();
    currentEnemy = createEnemy(req, res);

    const enemyCheck = currentEnemy.name + ' the ' + currentEnemy.type.species 
    achievementController.check(player, 'fight', enemyCheck);
    res.json({currentEnemy, player});
}

function attackEnemy(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();

    const reward = Math.floor((player.luck * player.level / 10) * (Math.random() * 0.95 + 0.55));
    const rewardExp = Math.floor((player.luck * player.level / 3.5) * (Math.random() * 0.95 + 0.55));
    const defenseBuffer = Math.round(Math.floor((currentEnemy.defense / 1.75) * Math.random() ));
    currentEnemy.health = Math.round(Math.max(0, currentEnemy.health - (player.strength - defenseBuffer / 5.70)));
    if (currentEnemy.health === 0) {
        playerServicesInstance.modifyStatGain('coins', reward);
        playerServicesInstance.modifyStatGain('exp', rewardExp);
        player.timesWon += 1;
      
        achievementController.check(player, 'stats', player.timesWon);
        achievementController.check(player, "coins", player.coins);
    }
    
    res.json({ enemy: currentEnemy,  player: player});
}

function enemyAttacks(req: Request, res: Response) {
    
    const player = playerServicesInstance.getPlayer();
     const defenseBuffer = Math.floor((player.defense / 100) * Math.random() );
    player.health = Math.round(Math.max(0, player.health - (currentEnemy.strength - defenseBuffer)));

    if (player.health === 0) {
        player.health = 1;
        currentEnemy = null;
       player.timesDefeated += 1;
        
        achievementController.check(player, 'stats', player.timesDefeated);
        achievementController.check(player, "coins", player.coins);
        return res.json({player});
    }

    res.json({ enemy: currentEnemy,  player: player});
    
}

export { createEnemy, attackEnemy, startFight, enemyAttacks };
