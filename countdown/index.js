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

// Update every second
updateCountdown();
setTimeout(() => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}, 1000 - new Date().getMilliseconds());
