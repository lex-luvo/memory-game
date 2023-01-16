const main = document.querySelector(".game");
const message = makeElement(
  "div",
  document.body,
  "Please select the grid size for the game, and click 'Start' to play",
  "message"
);

const timer = document.querySelector(".timer");
const flipCountDiv = document.querySelector(".flip-count");
let interval;
let seconds = 0;
let started = false;
let flipCount = 0;
const grid = { x: 2, y: 2 };
const colors = ["green", "yellow", "orange", "teal", "red", "pink"];

const game = {
  score: 0,
  game: [],
  flipped: [],
  pause: false,
};

document.getElementById("grid-layout").addEventListener("input", handleSelect);
document.getElementById("start").addEventListener("click", createGrid);

function handleSelect(event) {
  grid.x = event.target.value.split(",")[0];
  grid.y = event.target.value.split(",")[1];
}

function startTimer() {
  seconds++;
  timer.innerHTML = seconds;
}

function createGrid() {
  seconds = 0;
  flipCount = 0;
  game.score = 0;
  started = false;
  timer.innerHTML = seconds;
  flipCountDiv.innerHTML = flipCount;

  clearInterval(interval);

  message.textContent = "";
  main.innerHTML = "";
  for (let i = 0; i < grid.x * grid.y; i++) {
    const card = makeElement("div", main, " ", "card");
    card.onclick = flipCard;
  }
  main.style.setProperty(`grid-template-columns`, `repeat(${grid.y},1fr)`);
  getGridItems();
}

function toggleFlip(parent, activeCard) {
  const backElement = parent.querySelector(".back");
  const frontElement = parent.querySelector(".front");
  if (activeCard) {
    backElement.style.display = "none";
    frontElement.style.display = "block";
  } else {
    backElement.style.display = "block";
    frontElement.style.display = "none";
  }
}

function endGame(seconds, flipCount) {
  message.textContent = "Game Over";
  timer.innerHTML = "";
  flipCountDiv.innerHTML = "";
  setTimeout(() => {
    alert(
      `Congratulations. You got all the cards in ${seconds} seconds, with ${flipCount} card flips. click 'OK' to play again.`
    );
    window.location.reload();
  }, 20);
}

function checkForMatch() {
  game.pause = true;
  let match = null;
  let found = false;

  game.flipped.forEach((card) => {
    if (card.id == match) {
      found = true;
    } else {
      match = card.id;
    }
  });

  if (!found) {
    setTimeout(unflipCards, 200);
  } else {
    game.score++;
    game.flipped.forEach((card) => {
      card.found = true;
    });
    game.pause = false;
    game.flipped.length = 0;
    if (game.score >= (grid.x * grid.y) / 2) {
      endGame(seconds, flipCount);
    }
  }
}

function unflipCards() {
  game.flipped.forEach((card) => {
    toggleFlip(card, false);
    card.classList.remove("active");
  });
  game.pause = false;
  game.flipped.length = 0;
}

function flipCard(e) {
  while (started === false) {
    interval = setInterval(startTimer, 1000);
    started = true;
  }

  const parent = e.target.parentNode;
  const isCardActive = parent.classList.contains("active");
  if (!game.pause && !isCardActive) {
    if (parent.found) {
      return;
    } else {
      flipCount++;
      flipCountDiv.innerHTML = flipCount;
      parent.classList.add("active");
      if (game.flipped.length >= 2) {
        toggleFlip(parent, false);
      } else {
        toggleFlip(parent, true);
      }
      game.flipped.push(parent);
      if (game.flipped.length >= 2) {
        checkForMatch();
      }
    }
  } else {
    message.textContent = "Card locked";
    setTimeout(() => {
      message.textContent = "";
    }, 400);
  }
}

function getGridItems() {
  const gameItems = (grid.x * grid.y) / 2;
  const selectedColors = [];

  colors.sort(() => {
    return Math.random() - 0.5;
  });

  for (let i = 0; i < gameItems; i++) {
    selectedColors.push(colors[i]);
  }

  game.game = selectedColors.concat(selectedColors);
  game.game.sort(() => {
    return Math.random() - 0.5;
  });

  populateBoxes();
}

function populateBoxes() {
  const cards = main.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.id = game.game[index];
    card.found = false;
    const front = makeElement("div", card, game.game[index], "front");
    front.style.backgroundColor = game.game[index];
    front.style.display = "none";
    const back = makeElement("div", card, index + 1, "back");
    back.style.display = "block";
  });
}

function makeElement(elementType, parent, html, className) {
  const element = document.createElement(elementType);
  element.classList.add(className);
  element.innerHTML = html;
  return parent.appendChild(element);
}

module.exports = {
  createGrid,
  startTimer,
};
