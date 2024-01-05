class RouletteBetting {
    constructor() {
        this.bets = [];
        this.houseProfit = 0;
    }

    placeBet(name, numbers, betAmount) {
        numbers = numbers.split(',').map(num => parseInt(num, 10));
        betAmount = parseInt(betAmount, 10);
        this.bets.push({ name, numbers, betAmount });
        this.updateCurrentBetsDisplay();
    }

    placeBetOnColor(name, color, betAmount) {
        const numbers = (color === 'red') ? [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36] :
                       (color === 'black') ? [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35] : [];

        this.placeBet(name, numbers.join(','), betAmount);
    }

    placeBetOnEvenOdd(name, type, betAmount) {
        const numbers = (type === 'even') ? Array.from({ length: 18 }, (_, i) => (i + 1) * 2) :
                       (type === 'odd') ? Array.from({ length: 18 }, (_, i) => (i * 2) + 1) : [];

        this.placeBet(name, numbers.join(','), betAmount);
    }

    placeBetOnDozen(name, dozen, betAmount) {
        const numbers = (dozen === '1st') ? Array.from({ length: 12 }, (_, i) => i + 1) :
                       (dozen === '2nd') ? Array.from({ length: 12 }, (_, i) => (i + 1) + 12) :
                       (dozen === '3rd') ? Array.from({ length: 12 }, (_, i) => (i + 1) + 24) : [];

        this.placeBet(name, numbers.join(','), betAmount);
    }

    calculateWinnings(winningNumber) {
        winningNumber = parseInt(winningNumber, 10);

        // Adjust for the method that returns 37 instead of 0
        if (winningNumber === 37) {
            winningNumber = 0;
        }

        let totalPayout = 0;
        const winners = [];

        this.bets.forEach(bet => {
            const { name, numbers, betAmount } = bet;
            if (numbers.includes(winningNumber)) {
                const payoutRatio = this.getPayoutRatio(numbers.length);
                const winnings = betAmount * payoutRatio + betAmount; // Include original bet
                winners.push({ name, winnings });
                totalPayout += winnings;
            }
        });

        this.houseProfit += (this.totalBetAmount() - totalPayout);
        this.bets = []; // Clear current bets
        this.updateWinningBetsDisplay(winners);
        this.updateHouseProfitDisplay();
        this.updateCurrentBetsDisplay(); // Clear display of current bets
    }

    getPayoutRatio(numNumbers) {
        switch(numNumbers) {
            case 1: return 35;
            case 2: return 17;
            case 3: return 11;
            case 4: return 8;
            default: return 0;
        }
    }

    totalBetAmount() {
        return this.bets.reduce((acc, bet) => acc + bet.betAmount, 0);
    }

    updateCurrentBetsDisplay() {
        const display = document.getElementById('currentBets');
        display.innerHTML = this.bets.map(bet => `${bet.name}: ${bet.numbers.join(', ')} - $${bet.betAmount}`).join('<br>');
    }

    updateWinningBetsDisplay(winners) {
        const display = document.getElementById('winningBets');
        display.innerHTML = winners.map(winner => `${winner.name} wins $${winner.winnings}`).join('<br>');
    }

    updateHouseProfitDisplay() {
        const display = document.getElementById('houseProfit');
        display.textContent = this.houseProfit;
    }
}

const roulette = new RouletteBetting();

function placeBet() {
    const betInputValue = document.getElementById('betInput').value;
    const [name, type, betAmount] = betInputValue.split(' ');

    if (['red', 'black'].includes(type)) {
        roulette.placeBetOnColor(name, type, betAmount);
    } else if (['even', 'odd'].includes(type)) {
        roulette.placeBetOnEvenOdd(name, type, betAmount);
    } else if (['1st', '2nd', '3rd'].includes(type)) {
        roulette.placeBetOnDozen(name, type, betAmount);
    } else {
        roulette.placeBet(name, type, betAmount);
    }

    document.getElementById('betInput').value = ''; // Clear input field
}

function calculateWinnings() {
    const winningNumber = document.getElementById('winInput').value;
    roulette.calculateWinnings(winningNumber);
    document.getElementById('winInput').value = ''; // Clear input field
}

function clearBets() {
    roulette.bets = [];
    roulette.updateCurrentBetsDisplay();
}
