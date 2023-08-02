import * as blessed from 'blessed';

interface Point {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

let debug = false;

if (process.argv.includes('--debug')) {
  debug = true;
}

console.clear();

const screen = blessed.screen();
const gameWidth = 50;
const gameHeight = 25;
const gameAreaTopOffset = 5;
const gameArea = blessed.box({
  top: gameAreaTopOffset,
  left: 'center',
  width: gameWidth,
  height: gameHeight,
  border: {
    type: 'line',
    fg: 1,
  },
});
screen.append(gameArea);

const centerPoint: Point = {
  x: Math.floor(gameWidth / 2),
  y: Math.floor(gameHeight / 2),
};
const snake: Point[] = [centerPoint];
let direction: Direction = 'right';
let star: blessed.Widgets.BoxElement | null = null;
let starPosition: Point | null = null;
let score = 0;

screen.key(['escape', 'q', 'C-c'], function () {
  gameOver();
});

setInterval(() => update(), 80);

screen.on('keypress', (_, key: { name: string }) => {
  switch (key.name) {
    case 'up':
    case 'w':
      if (direction === 'down') break;
      direction = 'up';
      break;
    case 'down':
    case 's':
      if (direction === 'up') break;
      direction = 'down';
      break;
    case 'left':
    case 'a':
      if (direction === 'right') break;
      direction = 'left';
      break;
    case 'right':
    case 'd':
      if (direction === 'left') break;
      direction = 'right';
      break;
  }
});

screen.render();

function moveSnakeHead(head: Point, direction: Direction): Point {
  const newHead = Object.assign({}, head);
  switch (direction) {
    case 'up':
      newHead.y--;
      break;
    case 'down':
      newHead.y++;
      break;
    case 'left':
      newHead.x--;
      break;
    case 'right':
      newHead.x++;
      break;
  }
  return newHead;
}

function updateSnakeBody(head: Point, ateStar: boolean) {
  snake.unshift(head);
  if (ateStar) {
    // If ate
    const newHead = moveSnakeHead(head, direction);
    snake.unshift(newHead);
  }
  removeTailSegment();
}

function removeTailSegment() {
  const tail = snake.pop();
  if (tail) {
    gameArea.children.forEach((child, i) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (child.position.top === tail.y && child.position.left === tail.x) {
        gameArea.remove(gameArea.children[i]);
      }
    });
  }
}

const scoreText = blessed.box({
  top: gameAreaTopOffset - 2,
  left: 'center',
  width: gameWidth,
  height: 1,
  align: 'center',
  content: '',
  style: { fg: 'white' },
});
screen.append(scoreText);

let debugDisplays: blessed.Widgets.BoxElement[] | null = null;
if (debug) {
  debugDisplays = setupDebugDisplay();
}

function update() {
  let head = snake[0];
  head = moveSnakeHead(head, direction);

  let ateStar = false;
  if (starPosition) {
    ateStar = head.x === starPosition.x && head.y === starPosition.y;
  }

  if (isOutOfBounds(head.x, head.y) || hitSelf(head)) {
    gameOver();
  }

  updateSnakeBody(head, ateStar);

  if (ateStar) {
    score++;
    if (star) {
      screen.remove(star);
      star = null;
      starPosition = null;
    }
  }

  snake.forEach((segment, i) => {
    const character = i === 0 ? '@' : 'o';
    const color = i === 0 ? 'green' : 'blue';
    const box = blessed.box({
      top: segment.y,
      left: segment.x,
      width: 1,
      height: 1,
      content: character,
      style: { fg: color },
    });
    gameArea.append(box);
  });

  scoreText.setContent(`Score: ${score}`);

  if (!star) {
    starPosition = randomPoint();
    star = blessed.box({
      top: starPosition.y,
      left: starPosition.x,
      width: 1,
      height: 1,
      content: '*',
      style: { fg: 'yellow' },
    });
    gameArea.append(star);
  }

  if (debug && debugDisplays) {
    updateDebugDisplay(debugDisplays);
  }

  screen.render();
}

function randomPoint(): Point {
  return {
    x: Math.floor(Math.random() * (gameWidth - 2)),
    y: Math.floor(Math.random() * (gameHeight - 2)),
  };
}

function isOutOfBounds(x: number, y: number): boolean {
  return x < 0 || x > gameWidth - 2 || y < 0 || y > gameHeight - 2;
}

function hitSelf(head: Point): boolean {
  return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
}

function setupDebugDisplay(): blessed.Widgets.BoxElement[] {
  const snakePos = blessed.box({ top: 0, left: 0, height: 1, width: 20 });
  const dirPos = blessed.box({ top: 1, left: 0, height: 1, width: 20 });
  const isOutOfBoundsPos = blessed.box({ top: 2, left: 0, height: 1, width: 20 });
  screen.append(snakePos);
  screen.append(dirPos);
  screen.append(isOutOfBoundsPos);
  return [snakePos, dirPos, isOutOfBoundsPos];
}

function updateDebugDisplay(displays: blessed.Widgets.BoxElement[]) {
  displays[0].setContent(`Snake: ${snake[0].x} ${snake[0].y}`);
  displays[1].setContent(`Dir: ${direction}`);
  displays[2].setContent(
    `Out of bounds: ${isOutOfBounds(snake[0].x, snake[0].y) ? 'true' : 'false'}`
  );
}

function gameOver() {
  screen.destroy();
  console.log(`Game Over! Score: ${score}`);
  process.exit(0);
}
