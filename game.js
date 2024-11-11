class ClickerGame {
    constructor() {
        this.score = 0;
        this.clickValue = 1;
        this.autoClickValue = 0;
        this.autoclickerSpeed = 1400;
        this.upgrades = [
            { name: "Подвійний клік", baseCost: 100, cost: 100, clickBonus: 1, autoClickBonus: 0, level: 0 },
            { name: "Автоматичний клікер", baseCost: 500, cost: 500, clickBonus: 0, autoClickBonus: 1, level: 0 },
            { name: "Прокачка швидкості", baseCost: 200, cost: 200, clickBonus: 0, autoClickBonus: 0, speedBonus: 0.9, level: 0 }
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
        if (this.score >= upgrade.cost) {
            this.score -= upgrade.cost;
            upgrade.level++;
            
            // Збільшуємо бонуси експоненційно на кожному рівні
            this.clickValue += upgrade.clickBonus * Math.pow(1.1, upgrade.level);
            this.autoClickValue += upgrade.autoClickBonus * Math.pow(1.1, upgrade.level);
            
            // Вартість наступного рівня може збільшуватись за експоненційною формулою
            upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(this.costMultiplier, upgrade.level));
    
            if (upgrade.speedBonus) {
                this.autoclickerSpeed *= upgrade.speedBonus;
                this.startAutoClick();
            }
    
            this.displayUpgrades();
        } else {
            alert("Не вистачає очок для покупки!");
        }
    }

    startAutoClick() {
        if (this.autoClickValue > 0) {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.updateScore(this.autoClickValue);
            }, this.autoclickerSpeed);
        }
    }

    updateScore(points) {
        this.score += points;
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Очки: ${Math.round(this.score)}`; // Додаємо округлення
    
        // Додаємо клас для обох анімацій: підсвічування та bounce
        scoreElement.classList.add("highlight");
    
        // Видаляємо клас після завершення анімацій
        scoreElement.addEventListener('animationend', () => {
            scoreElement.classList.remove("highlight");
        }, { once: true });
    }
    

    saveGame() {
        const saveData = {
            score: this.score,
            clickValue: this.clickValue,
            autoClickValue: this.autoClickValue,
            autoclickerSpeed: this.autoclickerSpeed,
            upgrades: this.upgrades
        };
        localStorage.setItem("clickerGameSave", JSON.stringify(saveData));
        alert("Прогрес збережено!");
    }

    loadGame() {
        const savedData = localStorage.getItem("clickerGameSave");
        if (savedData) {
            const { score, clickValue, autoClickValue, autoclickerSpeed, upgrades } = JSON.parse(savedData);
            this.score = score;
            this.clickValue = clickValue;
            this.autoClickValue = autoClickValue;
            this.autoclickerSpeed = autoclickerSpeed;
            this.upgrades = upgrades.map((upg, index) => ({
                ...upg,
                baseCost: this.upgrades[index].baseCost,
                cost: upg.cost || Math.floor(this.upgrades[index].baseCost * Math.pow(this.costMultiplier, upg.level))
            }));
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
