import enemyNames from '../dataJsons/enemyNames.json' with { type: 'json' };
import enemies from '../dataJsons/enemyTypes.json' with { type: 'json' };
import { playerServicesInstance } from '../service/playerServices.ts';

import type { Request, Response } from 'express';

console.log(enemyNames, enemies);

let currentEnemy: any = null;
playerServicesInstance.createPlayer('Siobhan');
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
    const health = Math.floor(player.health * (Math.random() * 0.95 + 0.55));

    const strength = Math.floor(player.strength * (Math.random() * 0.95 + 0.55));
    const defense = Math.floor(player.defense * (Math.random() * 0.95 + 0.55));
    const enemyObject: Enemy = {
        name: enemyName,
        type: enemy,
        health: health,
        maxHealth: health,
        strength: strength,
        defense: defense,
    };
    res.json(enemyObject);
    return enemyObject;
}

function startFight(req: Request, res: Response) {
     const player = playerServicesInstance.getPlayer();
    if (player.health <= 1 ) {
        return res.json({ error: 'Heal your wounds first' });
    }   
    if (player.energy === 0 ){
        return res.json({ error: 'You need to rest' });
    }
    player.energy -= 5;
    currentEnemy = createEnemy(req, res);
    res.json(currentEnemy);
}

function attackEnemy(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();

    const reward = Math.floor((player.luck * player.level / 10) * (Math.random() * 0.95 + 0.55));
    const rewardExp = Math.floor((player.luck * player.level / 3.5) * (Math.random() * 0.95 + 0.55));
    const defenseBuffer = Math.round(Math.floor((currentEnemy.defense / 1.75) * Math.random() ));
    currentEnemy.health = Math.round(Math.max(0, currentEnemy.health - (player.strength - defenseBuffer / 100)));
    if (currentEnemy.health === 0) {
        playerServicesInstance.modifyStatGain('coins', reward);
        playerServicesInstance.modifyStatGain('exp', rewardExp);
    }
    res.json({ defense: defenseBuffer, attack: player.strength, enemy: currentEnemy, isDead: currentEnemy.health === 0 });
}

function enemyAttacks(req: Request, res: Response) {
    
    const player = playerServicesInstance.getPlayer();
     const defenseBuffer = Math.floor((player.defense / 1.75) * Math.random() );
    player.health = Math.round(Math.max(0, player.health - (currentEnemy.strength - defenseBuffer)));

    if (player.health === 0) {
        player.health = 1;
        currentEnemy = null;
    }
    res.json({ player: player});
}

export { createEnemy, attackEnemy, startFight, enemyAttacks };
