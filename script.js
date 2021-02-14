var _HEIGHT = 600,//screen.height,
    _WIDTH = 800; //screen.width;

var config = {
    type: Phaser.AUTO,
    width: _WIDTH,
    height: _HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 700
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('backgrd', 'assets/snow.jpg');
    this.load.image('backgrd2', 'assets/weback.png');
    this.load.image('love', 'assets/sticklove.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('engel', 'assets/layer1.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.spritesheet('elif', 'assets/elif.png', {
        frameWidth: 75,
        frameHeight: 120
    });
    this.load.spritesheet('burak', 'assets/burak.png', {
        frameWidth: 75,
        frameHeight: 120
    });
    this.load.image('button', 'assets/button.png');
}
var platforms;
var tilesprite;
var player;
var player2;
var cursors;
var engel;
var button;
var gameOver = false;
var audio;


function create() {
    tileSprite = this.add.tileSprite(_WIDTH / 2, _HEIGHT / 2, _WIDTH, _HEIGHT, 'backgrd');
    platforms = this.physics.add.staticGroup();
    platforms.create(_WIDTH / 2, 600, 'ground').setScale(13).refreshBody();
    button = this.add.sprite(_WIDTH / 2, _HEIGHT / 2, 'button').setInteractive();
    button.visible = !gameOver;
    player = this.physics.add.sprite(300, 300, 'elif');
    player2 = this.physics.add.sprite(600, 300, 'burak');


    this.anims.create({
        key: 'righte',
        frames: this.anims.generateFrameNumbers('elif', {
            start: 0,
            end: 5
        }),
        frameRate: 25,
        repeat: -1
    });
    this.anims.create({
        key: 'rightb',
        frames: this.anims.generateFrameNumbers('burak', {
            start: 0,
            end: 5
        }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpe',
        frames: this.anims.generateFrameNumbers('elif', {
            start: 6,
            end: 6
        }),
        frameRate: 20,
    });
    this.anims.create({
        key: 'jumpb',
        frames: this.anims.generateFrameNumbers('burak', {
            start: 6,
            end: 6
        }),
        frameRate: 20,
    });

    cursors = this.input.keyboard.createCursorKeys();
    engel = this.physics.add.group();
    // engel.children.clear();
    engel.create(_WIDTH + 22, 350, 'engel').setScale(0.08);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(platforms, engel);
    this.physics.add.collider(player, engel, hitBomb, null, this);
    this.physics.add.collider(player, player2, hitwe, null, this);
    this.physics.add.collider(player2, engel);



    button.on('pointerdown', function (event) {
        tileStatu = true;
        button.visible = false;
        audio = new Audio('./sounds/Avlak.mp3');
        audio.play();
        audio.loop = true;
        audio.volume = 0;

        var vol = setInterval(function () {
            if (audio.volume === 0.7) {
                clearInterval(vol);
            } else {
                audio.volume += 0.1;
            }
        }, 300);


        if (gameOver) {
            this.scene.restart();
        }

    }, this);
}

var tileStatu = false;

function update() {
    if (tileStatu) {
        tileSprite.tilePositionX += 2;
        engel.setVelocityX(-200);
        if (player.body.touching.down) {
            player.anims.play('righte', true);
        }
        if (player2.body.touching.down) {
            player2.anims.play('rightb', true);
        }

        if (cursors.space.isDown && player.body.touching.down) {
            player.setVelocityY(-450);
            player.anims.play('jumpe');
            playSound("jump");
        }
        var oEng = engel.getChildren()[engel.getLength() - 1];
        var oM = parseInt(oEng.x) - player2.x;
        if (90 < oM && oM < 100 && player2.body.touching.down && oEng.body.allowGravity) {
            player2.setVelocityY(-400);
            player2.anims.play('jumpb');
        }

        if (parseInt(engel.getChildren()[engel.getLength() - 1].x) < 500) {
            var eng;
            if (getRand()) {
                eng = engel.create(_WIDTH + 22, 230, 'bird').setScale(0.5);
                eng.body.allowGravity = false;
            } else {
                eng = engel.create(_WIDTH + 22, 350, 'engel').setScale(0.08);
            }
            player2.setVelocityX(-5);
        }
    }
}

function getRand() {
    let e = Math.floor(Math.random() * 100);
    if (e % 3 === 0) {
        return true;
    }
    return false;
}

function hitBomb() {
    this.physics.pause();
    audio.loop = false;
    audio.pause();
    player.anims.play('jumpe');
    player2.anims.play('jumpb');
    playSound("dead");
    tileStatu = false;
    button.visible = true;
    gameOver = true;
}

function hitwe() {
    tileSprite = this.add.tileSprite(_WIDTH / 2, _HEIGHT / 2, _WIDTH, _HEIGHT, 'backgrd2');
    // platforms.create(_HEIGHT / 2, 520, 'ground').setScale(5).refreshBody();
    this.physics.add.sprite(_WIDTH / 2, _HEIGHT / 2 + 60, 'love');
    this.physics.pause();
    audio.loop = false;
    audio.pause();
    player.anims.play('jumpe');
    player2.anims.play('jumpb');

    tileStatu = false;
    button.visible = false;
    gameOver = true;
    var audio2 = new Audio('./sounds/mfo.mp3');
    audio2.play();
    // audio2.loop = true;
    audio2.volume = 0;
    var vol2 = setInterval(function () {
        if (audio2.volume === 0.7) {
            clearInterval(vol2);
        } else {
            audio2.volume += 0.1;
        }
    }, 300);
}