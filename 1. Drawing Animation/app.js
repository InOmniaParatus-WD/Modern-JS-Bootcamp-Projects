const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const circle = document.querySelector("circle");

const perimeter = circle.getAttribute("r") * 2 * Math.PI;
circle.setAttribute("stroke-dasharray", perimeter);

// let currentOffset = 0
let duration;
const timer = new Timer(durationInput, startButton, pauseButton, {
  onStart(totalDurtion) {
    // console.log("Timer started");
    duration = totalDurtion;
  },
  onTick(timeRemaining) {
    // console.log("Timer clicked down");
    // circle.setAttribute("stroke-dashoffset", currentOffset);
    // currentOffset = currentOffset - timeRemaining;

    circle.setAttribute(
      "stroke-dashoffset",
      (perimeter * timeRemaining) / duration - perimeter
    );
  },
  onComplete() {
    console.log("Timer completed");
  },
});
