class ClickerGame {
    constructor() {
        this.score = 0;         
        this.clickValue = 1;      
        this.autoClickValue = 0; 
        this.upgrades = [
            { name: "Подвійний клік", cost: 100, clickBonus: 1, autoClickBonus: 0, level: 0 },
            { name: "Автоматичний клікер", cost: 500, clickBonus: 0, autoClickBonus: 1, level: 0 }
        ];      
        this.interval = null;    
        this.loadGame();         
        this.displayUpgrades();  
    }

   
    click() {
        this.score += this.clickValue;
        this.updateUI();
    }

   
    buyUpgrade(upgrade) {
        if (this.score >= upgrade.cost) {
            this.score -= upgrade.cost;
            upgrade.level++;
            this.clickValue += upgrade.clickBonus;
            this.autoClickValue += upgrade.autoClickBonus;
            this.updateUI();
            this.displayUpgrades(); 
            this.startAutoClick(); 
        }
    }

    
    startAutoClick() {
        if (this.autoClickValue > 0 && !this.interval) {
            this.interval = setInterval(() => {
                this.score += this.autoClickValue;
                this.updateUI();
            }, 1000); 
        }
    }

    
    updateUI() {
        document.getElementById("score").innerText = `Очки: ${this.score}`;
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
            this.upgrades = upgrades;
            this.updateUI();
            this.startAutoClick(); 
        }
    }

   
    displayUpgrades() {
        const upgradeContainer = document.getElementById("upgrades");
        upgradeContainer.innerHTML = ''; 
        this.upgrades.forEach((upgrade, index) => {
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
