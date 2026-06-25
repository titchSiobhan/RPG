import fs from "fs";
import type { Player } from "./service/playerServices.js";
import path from "path";
import { fileURLToPath } from "url";
import {playerServicesInstance} from "./service/playerServices.js";

export function savePlayer(player: Player) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const saveDir = path.join(__dirname,  "saves");
  const savePath = path.join(saveDir, "player.json");

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  fs.writeFileSync(savePath, JSON.stringify(player, null, 2));
}

export function loadPlayer(): Player | null {
    
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const savePath = path.join(__dirname, "saves", "player.json");
console.log("Looking for save at:", savePath);
console.log("Exists:", fs.existsSync(savePath));

  if (!fs.existsSync(savePath)) return null;

  const data = fs.readFileSync(savePath, "utf-8");
  return JSON.parse(data);
}


export function deletePlayer(): null {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const savePath = path.join(__dirname, "saves", "player.json");

  if (fs.existsSync(savePath)) {
    fs.unlinkSync(savePath);
  }


  return null;
}

