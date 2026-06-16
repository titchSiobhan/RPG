
import type{ Request, Response } from "express";
import {playerServicesInstance} from "../service/playerServices.js"


function createPlayer(req: Request, res: Response) {
    const name = req.body.name;
    const player = playerServicesInstance.createPlayer(name);
    res.json(player);
}

function getPlayer(req: Request, res: Response) {
    const player = playerServicesInstance.getPlayer();
    res.json(player);
}

function gainStat(req: Request, res: Response) {
   const { amount, stat, changes } = req.body;
const player = playerServicesInstance.getPlayer();
const validStats = Object.keys(playerServicesInstance.maxMap) as (keyof typeof playerServicesInstance.maxMap)[];

if (Array.isArray(changes)) {
    for (const change of changes) {
        if (typeof change.amount !== 'number') {
            return res.status(400).json('Amount must be a number');
        }
        if (!validStats.includes(change.stat)) {
            return res.status(400).json('Invalid stat');
        }
        playerServicesInstance.modifyStatGain(change.stat, change.amount);
    }
    res.json(player);
} else {
    if (typeof amount !== 'number') {
        return res.status(400).json('Amount must be a number');
    }
    if (!validStats.includes(stat)) {
        return res.status(400).json('Invalid stat');
    }
    playerServicesInstance.modifyStatGain(stat, amount);
    res.json(player);
}
   

}
function loseStat(req: Request, res: Response) {
   const { amount, stat, changes } = req.body;
const player = playerServicesInstance.getPlayer();
const validStats = Object.keys(playerServicesInstance.maxMap) as (keyof typeof playerServicesInstance.maxMap)[];

if (Array.isArray(changes)) {
    for (const change of changes) {
        if (typeof change.amount !== 'number') {
            return res.status(400).json('Amount must be a number');
        }
        if (!validStats.includes(change.stat)) {
            return res.status(400).json('Invalid stat');
        }
        playerServicesInstance.modifyStatLose(change.stat, change.amount);
    }
    res.json(player);
} else {
    if (typeof amount !== 'number') {
        return res.status(400).json('Amount must be a number');
    }
    if (!validStats.includes(stat)) {
        return res.status(400).json('Invalid stat');
    }
    playerServicesInstance.modifyStatLose(stat, amount);
    res.json(player);
}
   

}



export {createPlayer, getPlayer, gainStat, loseStat}
