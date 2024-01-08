import { resetGameToInitialState } from "/game/game.js";

let gameIsRunning = false;
let isAnimatingToGameMode = false;

function updateCountdown() {
    const targetDate = new Date("April 18, 2024 00:00:00").getTime();
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining > 0) {
        const months = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById("countdown-component-month-value").innerText = months.toString().padStart(2, '0');
        document.getElementById("countdown-component-day-value").innerText = days.toString().padStart(2, '0');
        document.getElementById("countdown-component-hour-value").innerText = hours.toString().padStart(2, '0');
        document.getElementById("countdown-component-minute-value").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("countdown-component-second-value").innerText = seconds.toString().padStart(2, '0');
    } else {
        // Countdown is over, do something
        console.log("Time's up!");
    }
}

function setGameMode(mode) {
    if (isAnimatingToGameMode) {
        return;
    }

    isAnimatingToGameMode = true;
    setTimeout(() => {
        isAnimatingToGameMode = false;
    }, 700);

    if (mode) {
        // start game
        gameIsRunning = true;
        resetGameToInitialState();
        setVisualizationMultiplier(0.1);
        document.body.classList.add("game-mode");
        setTimeout(() => {
            document.getElementById("game").classList.add("showing");
        }, 200);
    } else {
        // close game
        gameIsRunning = false;
        setVisualizationMultiplier(1);
        document.getElementById("game").classList.remove("showing");
        setTimeout(() => {
            document.body.classList.remove("game-mode");
        }, 200);
        setTimeout(() => {
            resetGameToInitialState();
        }, 700);
    }
}

document.getElementById('game-toggle').onclick = function () {
    setGameMode(!gameIsRunning);
};

function setVisualizationMultiplier(newMultiplier) {
    //animate visualization multiplier

    let start = multiplier, end = newMultiplier, duration = 1000, steps = 60;
    for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
            let x = i / steps;
            let easing = (1 - Math.cos(Math.PI * x)) / 2;
            multiplier = start + (end - start) * easing;
        }, i * (duration / steps));
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        setGameMode(false);
    }
});

// Update every second
updateCountdown();
setTimeout(() => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}, 1000 - new Date().getMilliseconds());
