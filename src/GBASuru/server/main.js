// main.js
import { GameBoyAdvance } from "gbajs";

const canvas = document.getElementById("canvas");
const button = document.getElementById("startBtn");

let gba = null;

button.onclick = async () => {
  if (!gba) {
    gba = new GameBoyAdvance();
    gba.setCanvas(canvas);
    gba.logLevel = gba.LOG_ERROR;

    const romBuffer = await fetch("/minnish.gba").then((res) =>
      res.arrayBuffer()
    );

    gba.loadRomFromFile(new Uint8Array(romBuffer));
    gba.runStable();
  }
};
