// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * The player character.
 */
class Player {
    #sprite; // The URL of the image that will be used to draw the character
    #x; // The position from the left end of the canvas in number of blocks starting from 0
    #y; // The position from the top end of the canvas in number of blocks starting from 0

    /**
     * Creates a Player object.
     * @param sprite {string} - The URL of the image that will be used to draw the character
     */
    constructor(sprite) {
        this.#sprite = sprite;
        this.#x = 2;
        this.#y = 4;
    }

    /**
     * Updates the state of the player character on every game tick.
     * @param dt {number} - The time delta since the previous update.
     */
    update(dt) {
        if (this.#y === 0) {
            handleGameWon();
        }
    }

    /**
     * Renders the player character on the canvas.
     */
    render() {
        ctx.drawImage(Resources.get(this.#sprite), this.#x * BLOCK_WIDTH, this.#y * BLOCK_HEIGHT - (BLOCK_HEIGHT / 2));
    }

    /**
     * Resets the player to the starting position.
     */
    reset() {
        this.#x = 2;
        this.#y = 4;
    }

    /**
     * Updates the character position in response to a keyboard input
     * @param direction {string} - The direction to move the character. Must be one of: 'up', 'down', 'left', 'right'.
     */
    handleInput(direction) {
        if (!direction) return;

        switch (direction) {
            case 'up':
                if (this.#y !== 0) {
                    this.#y--;
                }
                break;
            case 'down':
                if (this.#y !== NUM_ROWS - 1) {
                    this.#y++;
                }
                break;
            case 'left':
                if (this.#x !== 0) {
                    this.#x--;
                }
                break;
            case 'right':
                if (this.#x !== NUM_COLS - 1) {
                    this.#x++;
                }
                break;
            default:
                throw new Error(`Unknown direction passed to handleInput(): ${direction}`)
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [];
const player = new Player('images/char-boy.png');

/**
 * Resets the game after it is won.
 */
function handleGameWon() {
    player.reset();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
