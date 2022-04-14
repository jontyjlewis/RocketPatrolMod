// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // adds to the existing scene
        this.points = pointValue;   // stores the pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // ship speed
    }

    update() {
        // have spaceship move across the screen right to left
        this.x -= this.moveSpeed;

        // wrap ship around once off screen
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}