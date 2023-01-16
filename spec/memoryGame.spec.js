const { JSDOM } = require("jsdom");
const fs = require("fs");
const index = fs.readFileSync("index.html", "utf-8");
const { window } = new JSDOM(index);
const { document } = window;
global.document = document;
global.window = window;

const { createGrid, startTimer } = require("../src/script");
const main = document.querySelector(".game");
let timer = document.querySelector(".timer");
let card1 = "";

beforeEach((done) => {
  createGrid();
  card1 = main.querySelectorAll("div")[0].querySelectorAll(".front")[0];
  done();
});

describe("createGrid", () => {
  it("should create the grid for the game and populate the grid according to the default number of columns and rows", () => {
    expect(main.childElementCount).toBe(4);
  });
});

describe("flipCard", () => {
  it("must call flipCard and add the 'active' class to a card when the card is clicked", () => {
    card1.click();
    expect(card1.parentNode.classList.toString()).toBe("card active");
  });
});

describe("timer", () => {
  it("must change the innerHTML of the timer div when startTimer gets called", () => {
    startTimer();
    expect(timer.innerHTML).not.toBe("");
  });
});
