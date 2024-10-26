class ClickerGame {
    constructor() {
        this.score = 0;
        this.clickValue = 1;
        this.autoClickValue = 0;
        this.upgrades = [
            { name: "Подвійний клік", baseCost: 100, cost: 100, clickBonus: 1, autoClickBonus: 0, level: 0 },
            { name: "Автоматичний клікер", baseCost: 500, cost: 500, clickBonus: 0, autoClickBonus: 1, level: 0 }
        ];
        this.costMultiplier = 1.15; 
        this.interval = null;
        this.loadGame();
        this.displayUpgrades();
        
        
        document.querySelector('.game').classList.add('visible');
    }

    click() {
        this.updateScore(this.clickValue); 
    }

    buyUpgrade(upgrade) {
        if (this.score >= upgrade.cost && !isNaN(upgrade.cost)) {
            this.score -= upgrade.cost;
            upgrade.level++;
            this.clickValue += upgrade.clickBonus;
            this.autoClickValue += upgrade.autoClickBonus;

            const newCost = Math.floor(upgrade.baseCost * Math.pow(this.costMultiplier, upgrade.level));
            console.log(`Upgrade: ${upgrade.name}, new calculated cost: ${newCost}, previous cost: ${upgrade.cost}`);

            upgrade.cost = newCost;

            if (isNaN(upgrade.cost) || upgrade.cost === undefined) {
                console.error(`Error: Upgrade cost became invalid (NaN/undefined) for ${upgrade.name}`);
                upgrade.cost = upgrade.baseCost;
            }

            this.displayUpgrades();
            this.startAutoClick();
        } else {
            alert("Не вистачає очок для покупки!");
        }
    }

    startAutoClick() {
        if (this.autoClickValue > 0 && !this.interval) {
            this.interval = setInterval(() => {
                this.updateScore(this.autoClickValue);  
            }, 1000);
        }
    }

    updateScore(points) {
        this.score += points; 
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Очки: ${this.score}`;
        
        scoreElement.classList.add('score-bounce', 'score-green'); 
        
        
        setTimeout(() => {
            scoreElement.classList.remove('score-bounce', 'score-green');
        }, 600); 
    }
    

    saveGame() {
        const saveData = {
            score: this.score,
            clickValue: this.clickValue,
            autoClickValue: this.autoClickValue,
            upgrades: this.upgrades
        };
        localStorage.setItem("clickerGameSave", JSON.stringify(saveData));
        alert("Прогрес збережено!");
    }

    loadGame() {
        const savedData = localStorage.getItem("clickerGameSave");
        if (savedData) {
            const { score, clickValue, autoClickValue, upgrades } = JSON.parse(savedData);
            this.score = score;
            this.clickValue = clickValue;
            this.autoClickValue = autoClickValue;
            this.upgrades = upgrades.map((upg, index) => ({
                ...upg,
                baseCost: this.upgrades[index].baseCost, 
                cost: upg.cost || Math.floor(this.upgrades[index].baseCost * Math.pow(this.costMultiplier, upg.level)) 
            }));
            console.log('Loaded upgrades:', this.upgrades); 
            this.startAutoClick();
        }
    }

    displayUpgrades() {
        const upgradeContainer = document.getElementById("upgrades");
        upgradeContainer.innerHTML = '';
        this.upgrades.forEach(upgrade => {
            const upgradeButton = document.createElement("button");
            upgradeButton.innerText = `${upgrade.name} (Ціна: ${upgrade.cost}, Рівень: ${upgrade.level})`;
            upgradeButton.addEventListener("click", () => this.buyUpgrade(upgrade));
            upgradeContainer.appendChild(upgradeButton);
        });
    }
}


const game = new ClickerGame();

document.getElementById("clickButton").addEventListener("click", () => game.click());
document.getElementById("saveButton").addEventListener("click", () => game.saveGame());
document.getElementById("loadButton").addEventListener("click", () => game.loadGame());

let pointsDisplay = document.getElementById('points-display');
let points = 100;


function purchaseItem(cost) {
    if (points >= cost) {
        points -= cost; 
        updatePointsDisplay(); 
    } else {
        alert("Не достатньо пойнтів!");
    }
}


function updatePointsDisplay() {
    pointsDisplay.innerText = `Кількість пойнтів: ${points}`;
}


document.getElementById('buy-button').addEventListener('click', function() {
    purchaseItem(10); 
});
