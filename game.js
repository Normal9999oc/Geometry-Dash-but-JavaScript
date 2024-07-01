```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let obstacles;
let score = 0;
let scoreText;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('obstacle', 'assets/obstacle.png');
}

function create() {
    this.add.image(400, 300, 'background');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);
    
    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1000,
        callback: addObstacle,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(obstacles, platforms);
    this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
    
    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#fff',
    });
}

function update() {
    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    Phaser.Actions.IncX(obstacles.getChildren(), -4);
    obstacles.children.iterate(function (obstacle) {
        if (obstacle.x < -obstacle.width) {
            score += 1;
            scoreText.setText('Score: ' + score);
            obstacle.destroy();
        }
    });
}

function addObstacle() {
    const obstacle = obstacles.create(800, Phaser.Math.Between(100, 400), 'obstacle');
    obstacle.setVelocityX(-200);
    obstacle.setCollideWorldBounds(true);
    obstacle.setImmovable(true);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    alert('Game Over! Your score was: ' + score);
    this.scene.restart();
    score = 0;
}
```
