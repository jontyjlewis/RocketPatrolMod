//  Mod list

// Implement the speed increase that happens after 30 seconds in the original game (5)

// Allow the player to control the Rocket after it's fired (5)

// Implement parallax scrolling (10)

// Replace the UI borders with new artwork (10)

// Display the time remaining (in seconds) on the screen (10)

// Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)

// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)

// Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20)
//     I already did this with my initial RocketPatrol submission, but my TA said it was fine
//     I did end up changing the rocket sprite again

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