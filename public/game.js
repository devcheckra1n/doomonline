const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let walls;
let gunSprite;

const MAP_SIZE = 16;
const TILE_SIZE = 64;

function preload() {
    this.load.image('wall', 'assets/wall.png');
    this.load.image('gun', 'assets/gun.png');
}

function create() {
    // Create walls
    walls = this.physics.add.staticGroup();
    const gameMap = generateMap();
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            if (gameMap[y][x] === 1) {
                walls.create(x * TILE_SIZE, y * TILE_SIZE, 'wall').setOrigin(0);
            }
        }
    }

    // Create player
    player = this.physics.add.sprite(TILE_SIZE, TILE_SIZE, 'wall').setTint(0x00ff00);
    player.setCollideWorldBounds(true);

    // Add collision
    this.physics.add.collider(player, walls);

    // Camera follow player
    this.cameras.main.startFollow(player);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();

    // Gun
    gunSprite = this.add.image(400, 550, 'gun').setScrollFactor(0);

    // Set world bounds
    this.physics.world.setBounds(0, 0, MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE);
}

function update() {
    // Player movement
    const speed = 160;
    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
    } else {
        player.setVelocityY(0);
    }

    // Gun bobbing
    const bobAmount = 5;
    const bobSpeed = 0.1;
    if (player.body.velocity.length() > 0) {
        gunSprite.y = 550 + Math.sin(this.time.now * bobSpeed) * bobAmount;
    } else {
        gunSprite.y = 550;
    }
}

function generateMap() {
    const gameMap = Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(1));
    
    // Create empty space
    for (let y = 1; y < MAP_SIZE - 1; y++) {
        for (let x = 1; x < MAP_SIZE - 1; x++) {
            gameMap[y][x] = 0;
        }
    }
    
    // Add random walls
    for (let i = 0; i < MAP_SIZE * 2; i++) {
        const x = Math.floor(Math.random() * (MAP_SIZE - 2)) + 1;
        const y = Math.floor(Math.random() * (MAP_SIZE - 2)) + 1;
        gameMap[y][x] = 1;
    }
    
    return gameMap;
}