'use strict';

/**
 * Enemies our player must avoid
 */
class Enemy {
    #sprite; // The URL of the image that will be used to draw the character
    #speed; // The speed of the enemy in pixels per second
    #x; // The position from the left end of the canvas in number of pixels starting from 0
    #yBlock; // The position from the top end of the canvas in number of blocks starting from 0

    /**
     * Creates a Enemy object.
     * @param enemyRow {number} - The row number relative to the first enemy row (concrete row) on which this enemy will appear. Starts from 0.
     * @param speed {number} - The speed of the enemy in pixels per second.
     */
    constructor(enemyRow, speed) {
        this.#sprite = 'images/enemy-bug.png';
        this.#speed = speed;
        this.#x = -BLOCK_WIDTH; // start outside canvas
        this.#yBlock = 1 + enemyRow;
    }

    /**
     * @returns {CollisionArea} - The collision area that is occupied by this character in pixels.
     */
    get collisionArea() {
        const startX = this.#x;
        const endX = this.#x + BLOCK_WIDTH;
        const startY = this.#yBlock * BLOCK_HEIGHT;
        const endY = (this.#yBlock + 1) * BLOCK_HEIGHT - 1;
        return new CollisionArea(startX, endX, startY, endY);
    }

    /**
     * Updates the position of the enemy character on every game tick and deletes it when it goes out of view.
     * @param dt {number} - The time delta since the previous update in seconds.
     */
    update(dt) {
        this.#x += this.#speed * dt;
        if (this.#x > CANVAS_WIDTH) {
            deleteEnemy(this);
        }
    }

    /**
     * Renders the enemy character on the canvas.
     */
    render() {
        ctx.drawImage(Resources.get(this.#sprite), this.#x, this.#yBlock * BLOCK_HEIGHT - (BLOCK_HEIGHT / 2));
    }
}

/**
 * The player character.
 */
class Player {
    #sprite; // The URL of the image that will be used to draw the character
    #xBlock; // The position from the left end of the canvas in number of blocks starting from 0
    #yBlock; // The position from the top end of the canvas in number of blocks starting from 0

    /**
     * Creates a Player object.
     * @param sprite {string} - The URL of the image that will be used to draw the character
     */
    constructor(sprite) {
        this.#sprite = sprite;
        this.#xBlock = 2;
        this.#yBlock = 4;
    }

    /**
     * @returns {CollisionArea} - The collision area that is occupied by this character in pixels.
     */
    get collisionArea() {
        const startX = this.#xBlock * BLOCK_WIDTH + (BLOCK_WIDTH / 4);
        const endX = (this.#xBlock + 1) * BLOCK_WIDTH - (BLOCK_WIDTH / 4);
        const startY = this.#yBlock * BLOCK_HEIGHT;
        const endY = (this.#yBlock + 1) * BLOCK_HEIGHT - 1;
        return new CollisionArea(startX, endX, startY, endY);
    }

    /**
     * Updates the state of the player character on every game tick.
     * @param dt {number} - The time delta since the previous update in seconds.
     */
    update(dt) {
        if (this.#yBlock === 0) {
            handleGameWon();
        }
    }

    /**
     * Renders the player character on the canvas.
     */
    render() {
        ctx.drawImage(Resources.get(this.#sprite), this.#xBlock * BLOCK_WIDTH, this.#yBlock * BLOCK_HEIGHT - (BLOCK_HEIGHT / 2));
    }

    /**
     * Resets the player to the starting position.
     */
    reset() {
        this.#xBlock = 2;
        this.#yBlock = 4;
    }

    /**
     * Updates the character position in response to a keyboard input
     * @param direction {string} - The direction to move the character. Must be one of: 'up', 'down', 'left', 'right'.
     */
    handleInput(direction) {
        if (!direction) return;

        switch (direction) {
            case 'up':
                if (this.#yBlock !== 0) {
                    this.#yBlock--;
                }
                break;
            case 'down':
                if (this.#yBlock !== NUM_ROWS - 1) {
                    this.#yBlock++;
                }
                break;
            case 'left':
                if (this.#xBlock !== 0) {
                    this.#xBlock--;
                }
                break;
            case 'right':
                if (this.#xBlock !== NUM_COLS - 1) {
                    this.#xBlock++;
                }
                break;
            default:
                throw new Error(`Unknown direction passed to handleInput(): ${direction}`)
        }
    }
}

/**
 * Represents an inclusive range of numbers.
 */
class Range {
    #start;
    #end;

    /**
     * Creates a new Range object.
     * @param start {number} - The inclusive start of the range.
     * @param end {number} - The inclusive end of the range.
     */
    constructor(start, end) {
        this.#start = start;
        this.#end = end;
    }

    /**
     * @returns {number} - The inclusive start of the range.
     */
    get start() {
        return this.#start;
    }

    /**
     * @returns {number} - The inclusive end of the range.
     */
    get end() {
        return this.#end;
    }

    /**
     * Checks if this range overlaps with the given range.
     * @param range {number | Range} - The range to check against.
     * @returns {boolean} - True if the given range overlaps with this range, false otherwise.
     */
    overlaps(range) {
        if (typeof range === "number") {
            return this.start <= range && this.end >= range;
        } else if (range instanceof Range) {
            return (this.start <= range.start && this.end >= range.start)
                || (this.start <= range.end && this.end >= range.end);
        }
    }

    /**
     * Checks if the two given ranges are overlapping.
     * @param range1 {Range} - The first range.
     * @param range2 {Range} - The second range.
     * @returns {boolean} - True if the two ranges are overlapping, false otherwise.
     */
    static overlaps(range1, range2) {
        return range1.overlaps(range2);
    }
}

/**
 * A rectangular collision area.
 */
class CollisionArea {
    startX;
    endX;
    startY;
    endY;

    /**
     * Creates a new `CollisionArea`.
     * @param startX {number} - The inclusive starting point on the X axis.
     * @param endX {number} - The inclusive ending point on the X axis.
     * @param startY {number} - The inclusive starting point on the Y axis.
     * @param endY {number} - The inclusive ending point on the Y axis.
     */
    constructor(startX, endX, startY, endY) {
        this.startX = startX;
        this.endX = endX;
        this.startY = startY;
        this.endY = endY;
    }

    /**
     * @returns {number} - The inclusive starting point on the X axis.
     */
    get startX() {
        return this.startX;
    }

    /**
     * @returns {number} - The inclusive ending point on the X axis.
     */
    get endX() {
        return this.endX;
    }

    /**
     * @returns {number} - The inclusive starting point on the Y axis.
     */
    get startY() {
        return this.startY;
    }

    /**
     * @returns {number} - The inclusive ending point on the Y axis.
     */
    get endY() {
        return this.endY;
    }

    /**
     * @returns {Range} - The occupied range on the X axis.
     */
    get xRange() {
        return new Range(this.startX, this.endX);
    }

    /**
     * @returns {Range} - The occupied range on the Y axis.
     */
    get yRange() {
        return new Range(this.startY, this.endY);
    }

    /**
     * Checks if this `CollisionRange` overlaps the argument range.
     * @param collisionArea {CollisionArea}
     */
    collidesWith(collisionArea) {
        return Range.overlaps(this.xRange,collisionArea.xRange)
            && Range.overlaps(this.yRange,collisionArea.yRange);
    }
}

/**
 * Resets the game after it is won.
 */
function handleGameWon() {
    player.reset();
    allEnemies = [];
}

/**
 * Resets the game after it is lost.
 */
function handleGameLost() {
    player.reset();
}

/**
 * Checks if there is a collision present in the current state of the game and resets the game if one is detected.
 */
function checkCollisions() {
    for (const enemy of allEnemies) {
        if (enemy.collisionArea.collidesWith(player.collisionArea)) {
            handleGameLost();
        }
    }
}

/**
 * Spawns a new enemy.
 */
function spawnEnemy() {
    allEnemies.push(new Enemy(Math.floor(Math.random() * 3), 50 + Math.random() * 250));
}

/**
 * Deletes an enemy from the game.
 * @param enemy {Enemy} - The enemy to delete.
 */
function deleteEnemy(enemy) {
    allEnemies.splice(allEnemies.indexOf(enemy), 1);
}

/**
 * Start a loop that spawns enemies at a constant rate.
 * @param spawnRate {number} - The rate at which enemies are spawned in number of enemies per second.
 */
function spawnEnemiesLoop(spawnRate) {
    const spawnTime = 1000 / spawnRate;
    (function loop() {
        spawnEnemy();
        setTimeout(() => {
            loop();
        }, spawnTime)
    }())
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', e => {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

const player = new Player('images/char-boy.png');
let allEnemies = [];
spawnEnemiesLoop(ENEMY_SPAWN_RATE);