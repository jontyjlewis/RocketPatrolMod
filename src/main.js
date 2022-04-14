console.log("Hello from main.js");

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let game = new Phaser.Game(config);

// reserving keybinds
let keyF, keyR, keyLEFT, keyRIGHT;