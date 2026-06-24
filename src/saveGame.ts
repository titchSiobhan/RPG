import fs from "fs";
import type { Player } from "./service/playerServices.js";
import path from "path";
import { fileURLToPath } from "url";




export function savePlayer(player: Player) {
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

     const saveDir = path.join(__dirname, "..", "saves");
    const savePath = path.join(saveDir, "player.json");

    // Create folder if missing
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }
   fs.writeFileSync(savePath, JSON.stringify(player, null, 2));

}


export function loadPlayer(): Player | null {
    if (!fs.existsSync("./saves/player.json")) return null;
   const data = fs.readFileSync("./saves/player.json", "utf-8");
   return JSON.parse(data);
}