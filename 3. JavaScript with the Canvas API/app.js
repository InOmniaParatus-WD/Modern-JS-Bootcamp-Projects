//-----------------
// BOILERPLATE CODE
//-----------------
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter; //Objects called from the Matter.js engine

// const cells = 6;
const cellsHorizontal = 8; //Number of columns
const cellsVertical = 6; //Number of rows

const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create(); //creates a new engine

const { world } = engine; // get access to a world object that was created with the new engine
engine.world.gravity.y = 0; //Disables gravity for the ball
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
}); //render the new object (show the content on the screen), using a 'canvas' html tag
//Showing everything on the screen
Render.run(render);
Runner.run(Runner.create(), engine);
//---- END OF BOILERPLATE -----

// Walls (the rectangles bordering of the world, to make sure the objects don't fall out of the world)
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
  }),
];
World.add(world, walls);

// --------------------
// Maze Generation
// --------------------

//Function to generate the randomness inside the maze grid
const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter); //get a random index inside of the array
    counter--;
    //Swap the elements of the array to randomize the order
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

//Grid creation
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));
//Vertical lines of the grid cells
const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));
//Horizontal lines of the grid cells
const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

//Iterates through the maze cells
const iterateThroughCells = (row, column) => {
  //if I have visited the cell at [row, column] then return
  if (grid[row][column]) return;

  //Mark this cell as visited => update to true inside the array
  grid[row][column] = true;

  //Assemble randomly-ordered list of neighbours
  const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  //For each neighbour...
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;

    //See if the neighbour is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    )
      continue;

    //If we have visited that cell, continue to the neighbour
    if (grid[nextRow][nextColumn]) continue;

    //Remove a horizontal/vertical wall form cell
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    //Visit that next cell
    iterateThroughCells(nextRow, nextColumn);
  }
};
iterateThroughCells(startRow, startColumn);

//creating horizontal walls
horizontals.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIdx * unitLengthX + unitLengthX / 2,
      rowIdx * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "lightseagreen"
        },
      }
    );
    World.add(world, wall);
  });
});

//creating vertical walls
verticals.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIdx * unitLengthX + unitLengthX,
      rowIdx * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "lightseagreen"
        },
      }
    );
    World.add(world, wall);
  });
});

//Goal / Finish line
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: "darkgreen",
    },
  }
);
World.add(world, goal);

//Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
});
World.add(world, ball);

document.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;

  if (e.code === "ArrowUp" || e.code === "KeyW") {
    Body.setVelocity(ball, { x, y: y - 5 });
  } else if (e.code === "ArrowDown" || e.code === "KeyS") {
    Body.setVelocity(ball, { x, y: y + 5 });
  } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
    Body.setVelocity(ball, { x: x - 5, y });
  } else if (e.code === "ArrowRight" || e.code === "KeyD") {
    Body.setVelocity(ball, { x: x + 5, y });
  }
});

//Win Condition (when the user gets the ball to the goal square)
Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").innerText = "You Win!"
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
