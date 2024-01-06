class RouletteBetting {
    constructor() {
        this.bets = [];
        this.houseProfit = 0;
    }

    placeBet(name, numbers, betAmount) {
        let parsedNumbers;

        // Handle special cases for red, black, even, odd, 1st 12, 2nd 12, and 3rd 12
        switch (numbers) {
            case 'red':
                parsedNumbers = ['red'];
                break;
            case 'black':
                parsedNumbers = ['black'];
                break;
            case 'even':
                parsedNumbers = ['even'];
                break;
            case 'odd':
                parsedNumbers = ['odd'];
                break;
            case '1st':
                parsedNumbers = ['1st'];
                break;
            case '2nd':
                parsedNumbers = ['2nd'];
                break;
            case '3rd':
                parsedNumbers = ['3rd'];
                break;
            default:
                // If it's not a special case, try parsing as a comma-separated list of numbers
                parsedNumbers = numbers.split(',').map(num => parseInt(num, 10));
        }

        betAmount = parseInt(betAmount, 10);
        this.bets.push({ name, numbers: parsedNumbers, betAmount });
        this.updateCurrentBetsDisplay();
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
            if (numbers.includes('red') && winningNumber % 2 === 1) {
                // Red bet wins on odd numbers
                const payoutRatio = this.getPayoutRatio(numbers.length, 'red');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('black') && winningNumber % 2 === 0) {
                // Black bet wins on even numbers
                const payoutRatio = this.getPayoutRatio(numbers.length, 'black');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('even') && winningNumber % 2 === 0) {
                // Even bet wins on even numbers
                const payoutRatio = this.getPayoutRatio(numbers.length, 'even');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('odd') && winningNumber % 2 === 1) {
                // Odd bet wins on odd numbers
                const payoutRatio = this.getPayoutRatio(numbers.length, 'odd');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('1st') && winningNumber >= 1 && winningNumber <= 12) {
                // 1st 12 bet wins on numbers 1-12
                const payoutRatio = this.getPayoutRatio(numbers.length, '1st');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('2nd') && winningNumber >= 13 && winningNumber <= 24) {
                // 2nd 12 bet wins on numbers 13-24
                const payoutRatio = this.getPayoutRatio(numbers.length, '2nd');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes('3rd') && winningNumber >= 25 && winningNumber <= 36) {
                // 3rd 12 bet wins on numbers 25-36
                const payoutRatio = this.getPayoutRatio(numbers.length, '3rd');
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            } else if (numbers.includes(winningNumber)) {
                // Regular number bet wins
                const payoutRatio = this.getPayoutRatio(numbers.length);
                const winnings = betAmount * payoutRatio;
                winners.push({ name, winnings });
                totalPayout += winnings;
            }
        });

        this.houseProfit += (totalPayout - this.totalBetAmount());
        this.bets = [];
        this.updateWinningBetsDisplay(winners);
        this.updateHouseProfitDisplay();
        this.updateCurrentBetsDisplay();
    }

    getPayoutRatio(numNumbers, betType) {
        switch (betType) {
            case 'red':
            case 'black':
            case 'even':
            case 'odd':
                return 2;
            case '1st':
            case '2nd':
            case '3rd':
                return 3;
            default:
                return 35 / numNumbers;
        }
    }

    totalBetAmount() {
        return this.bets.reduce((acc, bet) => acc + bet.betAmount, 0);
    }

    updateCurrentBetsDisplay() {
        const display = document.getElementById('currentBets');
        display.innerHTML = this.bets.map(bet => {
            if (['red', 'black', 'even', 'odd', '1st', '2nd', '3rd'].includes(bet.numbers[0])) {
                return `${bet.name}: ${bet.numbers[0]} - $${bet.betAmount}`;
            } else {
                return `${bet.name}: ${bet.numbers.join(', ')} - $${bet.betAmount}`;
            }
        }).join('<br>');
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

    if (['red', 'black', 'even', 'odd', '1st', '2nd', '3rd'].includes(type)) {
        roulette.placeBet(name, type, betAmount);
    } else {
        roulette.placeBet(name, type, betAmount);
    }
    document.getElementById('betInput').value = '';
}

function calculateWinnings() {
    const winningNumber = document.getElementById('winInput').value;
    roulette.calculateWinnings(winningNumber);
    document.getElementById('winInput').value = '';
}

function clearBets() {
    roulette.bets = [];
    roulette.updateCurrentBetsDisplay();
}
