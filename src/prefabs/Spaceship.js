// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // adds to the existing scene
        this.points = pointValue;   // stores the pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // ship speed
        this.flipped = false;
    }

    update() {
        // checking for unique ship logic
        if(this.points >= 60){
            this.flipped = false;
        }
        // have spaceship move across the screen right to left
        if(this.flipped == false) {
            this.x -= this.moveSpeed;

            // wrap ship around once off screen
            if(this.x <= 0 - this.width) {
            this.x = game.config.width;
            }
        }
        else {
            // moves left to right
            this.x += this.moveSpeed;

            // wrap ship around once off screen at a delay
            if(this.x >= game.config.width) {
                this.x = 0 - game.config.width * 3;
            }
        }
    }

    reset() {
        this.x = game.config.width;
    }
}