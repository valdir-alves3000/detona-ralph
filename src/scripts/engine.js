const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    menuLives: document.querySelector(".menu-lives"),
    gameOverModal: document.querySelector("#gameOverModal"),
    restart: document.querySelector("#restart"),
    finalScore: document.querySelector("#finalScore"),
  },

  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    lives: 5,
  },
  actions: {
    countDownTimerId: setInterval(countDown, 1000),
    timerId: setInterval(randomSquare, 1000),
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    gameOver();
  }
}

function resetGame() {
  state.values.currentTime = 60;
  state.values.lives = 5;
  state.values.result = 0;
  state.view.score.textContent = 0;
}

function gameOver() {
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  playSound("game-over.mp3");
  state.view.gameOverModal.classList.add("visible");
  state.view.finalScore.textContent = state.values.result;
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}`);
  audio.volume = audioName === "game-over.mp3" ? 1 : 0.2;

  audio.addEventListener("loadeddata", () => {
    audio.play();
  });
}

function randomSquare() {
  state.view.squares.forEach((square) => square.classList.remove("enemy"));

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result += 10;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit.m4a");

        return;
      }

      playSound("negative-beeps.mp3");
      const lives = state.view.menuLives.children;

      if (state.values.lives > 0) {
        const lastLive = lives[lives.length - 1];
        lastLive.remove();
        state.values.lives--;
      }

      if (state.values.lives <= 0) {
        gameOver();
      }
    });
  });
}

function createLive() {
  return `<img src="./src/images/player.png" alt="foto do jogador" height="60px" />`;
}

function setupLives() {
  state.view.menuLives.innerHTML = "";
  for (let i = 0; i < state.values.lives; i++)
    state.view.menuLives.innerHTML += createLive();
}

function initialize() {
  setupLives();
  addListenerHitBox();
}

function hanleRestart() {
  resetGame();
  state.view.gameOverModal.classList.remove("visible");
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  state.actions.timerId = setInterval(randomSquare, 1000);
  setupLives();
}

state.view.restart.addEventListener("click", hanleRestart);

initialize();
