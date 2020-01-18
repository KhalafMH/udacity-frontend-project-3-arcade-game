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
        this.#x = -BLOCK_WIDTH;
        this.#yBlock = 1 + enemyRow;
    }

    /**
     * @returns {number} - The position from the left end of the canvas in number of blocks starting from 0.
     */
    get xBlock() {
        return Math.floor((this.#x + BLOCK_WIDTH / 2) / BLOCK_WIDTH);
    }

    /**
     * @returns {number} - The position from the top end of the canvas in number of blocks starting from 0.
     */
    get yBlock() {
        return this.#yBlock;
    }

    /**
     * Updates the state of the enemy character on every game tick.
     * @param dt {number} - The time delta since the previous update in seconds.
     */
    update(dt) {
        this.#x += this.#speed * dt;
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
     * @returns {number} - The position from the left end of the canvas in number of blocks starting from 0.
     */
    get xBlock() {
        return this.#xBlock;
    }

    /**
     * @returns {number} - The position from the top end of the canvas in number of blocks starting from 0.
     */
    get yBlock() {
        return this.#yBlock;
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
 * Resets the game after it is won.
 */
function handleGameWon() {
    player.reset();
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
        if (enemy.xBlock === player.xBlock && enemy.yBlock === player.yBlock) {
            handleGameLost();
        }
    }
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
const allEnemies = [new Enemy(1, 50)];
