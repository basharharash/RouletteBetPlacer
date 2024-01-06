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
                parsedNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
                break;
            case 'black':
                parsedNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
                break;
            case 'even':
                parsedNumbers = Array.from({ length: 18 }, (_, i) => (i + 1) * 2);
                break;
            case 'odd':
                parsedNumbers = Array.from({ length: 18 }, (_, i) => (i * 2) + 1);
                break;
            case '1st':
                parsedNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
                break;
            case '2nd':
                parsedNumbers = Array.from({ length: 12 }, (_, i) => (i + 1) + 12);
                break;
            case '3rd':
                parsedNumbers = Array.from({ length: 12 }, (_, i) => (i + 1) + 24);
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
            if (numbers.includes(winningNumber)) {
                const payoutRatio = this.getPayoutRatio(numbers.length, numbers[0]); // Pass bet type
                const winnings = betAmount * payoutRatio; // Adjust for the new payout ratios
                winners.push({ name, winnings });
                totalPayout += winnings;
            }
        });
        this.houseProfit += (totalPayout - this.totalBetAmount());
        this.bets = []; // Clear current bets
        this.updateWinningBetsDisplay(winners);
        this.updateHouseProfitDisplay();
        this.updateCurrentBetsDisplay(); // Clear display of current bets
    }

    getPayoutRatio(numNumbers, betType) {
        // Adjust payout ratios for red, black, even, odd, 1st, 2nd, and 3rd
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
                return 0;
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

    if (['red', 'black', 'even', 'odd', '1st', '2nd', '3rd'].includes(type)) {
        roulette.placeBet(name, type, betAmount);
    } else {
        roulette.placeBet(name, type, betAmount);
