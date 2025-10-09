// БАЗА ДАННЫХ DREVO - РЕАЛЬНЫЙ АВТОМАТИЧЕСКИЙ ПОДСЧЕТ СОПЛАЯ
class SupplyDB {
    constructor() {
        // РЕАЛЬНЫЕ ДАННЫЕ - сколько подарков куплено ВСЕМИ пользователями
        this.purchased = {
            cat: 0,
            cross: 0,
            cybercar: 0
        };
        
        // Максимальное количество
        this.maxSupply = {
            cat: 20000,
            cross: 1200,
            cybercar: 2000
        };
        
        this.loadFromStorage();
    }
    
    // АВТОМАТИЧЕСКИЙ ПОДСЧЕТ - сколько осталось
    getRemaining(giftType) {
        const purchased = this.purchased[giftType] || 0;
        const max = this.maxSupply[giftType] || 0;
        return max - purchased;
    }
    
    // АВТОМАТИЧЕСКИЙ ПОДСЧЕТ - сколько куплено
    getPurchased(giftType) {
        return this.purchased[giftType] || 0;
    }
    
    // РЕАЛЬНОЕ ОБНОВЛЕНИЕ при покупке
    addPurchase(giftType) {
        if (this.getRemaining(giftType) > 0) {
            this.purchased[giftType]++;
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    // Сохранение
    saveToStorage() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('drevo_real_supply', JSON.stringify({
                purchased: this.purchased,
                lastUpdate: new Date().toISOString()
            }));
        }
    }
    
    // Загрузка
    loadFromStorage() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('drevo_real_supply');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.purchased = data.purchased || this.purchased;
                } catch (e) {
                    console.error('Error loading supply data:', e);
                }
            }
        }
    }
}

// Создаем глобальный экземпляр
const REAL_SUPPLY_DB = new SupplyDB();

// Для использования в браузере
if (typeof window !== 'undefined') {
    window.REAL_SUPPLY_DB = REAL_SUPPLY_DB;
}

// Для экспорта в Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = REAL_SUPPLY_DB;
}

console.log('DREVO REAL Supply DB initialized');
