console.log("Hello from Play.js");

class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');

        // -- New Spaceship Asset --
        this.load.image('smallShip', './assets/spaceship2.png');
        
        // -- Parallax Background --
        // this.load.image('starfield', './assets/starfield.png');
        this.load.image('bg1', './assets/Background/bg1.png');
        this.load.image('bg2', './assets/Background/bg2.png');
        this.load.image('bg3', './assets/Background/bg3.png');
        this.load.image('bg4', './assets/Background/bg4.png');
        this.load.image('bg5', './assets/Background/bg5.png');

        // -- Borders --
        this.load.image('borders', './assets/borders.png');

        // load base particle
        this.load.image('particle', './assets/particle.png');

        // load sprite sheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 11});
        
    }

    create() {
        //this.add.text(20, 20, "this is the play scene");
        
        // -- Parallax Background --
        // starfield background
        // this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.bg1 = this.add.tileSprite(0, 0, 640, 480, 'bg1').setOrigin(0, 0);
        this.bg2 = this.add.tileSprite(0, 0, 640, 480, 'bg2').setOrigin(0, 0);
        this.bg3 = this.add.tileSprite(0, 0, 640, 480, 'bg3').setOrigin(0, 0);
        this.bg4 = this.add.tileSprite(0, 0, 640, 480, 'bg4').setOrigin(0, 0);
        this.bg5 = this.add.tileSprite(0, 0, 1940, 480, 'bg5').setOrigin(0, 0);

        // green UI rectangle
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        // --ADD NEW SPACESHIP -- (worth 60 points)
        this.smallShip = new Spaceship(this, game.config.width + borderUISize * 9, borderUISize * 5, 'smallShip', 0, 60).setOrigin(0, 0);
        // set custom speed
        this.smallShip.moveSpeed = 50;

        // white border
        // this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    // this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    // this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
	    // this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // -- Borders --
        this.borders = this.add.tileSprite(0, 0, 640, 480, 'borders').setOrigin(0,0);

        // rocket keybinds
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create( {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 11, first: 0}),
            frameRate: 20
        })

        // initialize score
        this.p1Score = 0;

        // display score counter
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);      

        // -- GAME TIMER --
        // in thanks to help from https://phaser.discourse.group/t/countdown-timer/2471/3
        this.initialTime = game.settings.gameTimer/1000;
        // console.log(this.initialTime);
        
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(game.config.width/2, borderUISize + borderPadding * 2, this.initialTime, timeConfig);

        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: countDown,
            callbackScope: this,
            loop: true
        });

        // -- SPEED BOOST AFTER 30 SECONDS --
        this.speedBoost = this.time.delayedCall(30000, () => {
            console.log("SPEED BOOST STARTED");
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
        });

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            this.sound.play('sfx_select');
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menu");
            this.sound.play('sfx_select');
        }

        // -- Parallax Background --
        // scrolling background
        //this.starfield.tilePositionX -= 0;
        this.bg1.tilePositionX -= 0.1;
        this.bg2.tilePositionX -= 0.4;
        this.bg3.tilePositionX -= 0.7;
        this.bg4.tilePositionX -= 1.3;
        this.bg5.tilePositionX -= 4;

        // update ship movement
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.smallShip.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            //console.log('kaboom ship 03');
            this.p1Rocket.reset();
            //this.ship03.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            // console.log('kaboom ship 02');
            this.p1Rocket.reset();
            // this.ship02.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            // console.log('kaboom ship 01');
            this.p1Rocket.reset();
            // this.ship01.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.smallShip)) {
            this.p1Rocket.reset();
            this.shipExplode(this.smallShip);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB (Axis-Aligned Bounding Boxes) checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            }
            else {
                return false;
            }
    }

    shipExplode(ship) {
        // -- Particle System --
        const particles = this.add.particles('particle');
        particles.createEmitter({
            x: ship.x + 32,
            y: ship.y + 16,
            quantity: 10,
            speedY: { min: -150, max: 150 },
            speedX: { min: -150, max: 150 },
            scale: {start: 2, end: 0.02},
            lifespan: 600,
        })

        // temp hide ship
        ship.alpha = 0;
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // plays the explosion animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // resets ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // removes the explosion sprite
            particles.destroy();
        });

        // adding to score and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}


// timer logic fixed and put in own function 
// in thanks to help from https://phaser.discourse.group/t/countdown-timer/2471/3
function countDown() {
    // timer logic
    if(this.initialTime > 0) {
        this.initialTime -= 1;
    }

    // console.log(this.initialTime);
    let timeConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'center',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 100
    }
    this.timeLeft = this.add.text(game.config.width/2, borderUISize + borderPadding * 2, this.initialTime, timeConfig);
}