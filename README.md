# Console Snake Game

This is a simple snake game that runs in the console. It is written in TypeScript and uses the Blessed library for rendering.

![Termi-Snake Gameplay](./assets/termi-snake.gif)


### Installation

First, clone the repository:

```bash
git clone https://github.com/delvoid/snake-game.git
cd snake-game
```


Then install the dependencies:

```bash
pnpm install
```

### Running the game

To run the game, simply run the following command:

```bash
pnpm start
```

### Gameplay 

The goal of the game is to eat as many stars as possible without hitting the edge of the screen or yourself. The snake moves continuously, and you control the direction of its movement.

Use the WASD or arrow keys to control the direction of the snake:

- W or Up Arrow: Move Up
- A or Left Arrow: Move Left
- S or Down Arrow: Move Down
- D or Right Arrow: Move Right


Your score increases by one each time you eat a star. The game ends when you hit the edge of the screen or when the snake hits itself. The final score is displayed at the end of the game.

### Debug Mode

You can run the game in debug mode by passing the --debug command line argument:

```bash
pnpm start --debug
```

In debug mode, the game displays additional information about the current state of the game, including the position of the snake's head, the current direction of movement, and whether the snake is out of bounds.
