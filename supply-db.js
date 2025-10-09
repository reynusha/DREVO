// УМНАЯ БАЗА ДАННЫХ DREVO - Автоматическое определение и обновление supply
// Этот файл должен быть доступен по URL для всех пользователей

class SmartSupplyDB {
    constructor() {
        // Автоматическое определение начальных значений на основе текущих продаж
        this.initialValues = {
            cat: this.calculateInitialSupply('cat'),
            cross: this.calculateInitialSupply('cross'),
            cybercar: this.calculateInitialSupply('cybercar')
        };
        
        // Текущие значения (будут автоматически обновляться)
        this.cat = this.initialValues.cat;
        this.cross = this.initialValues.cross;
        this.cybercar = this.initialValues.cybercar;
        
        // Общее максимальное supply
        this.maxSupply = {
            cat: 20000,
            cross: 1200,
            cybercar: 2000
        };
        
        // История транзакций и активных покупок
        this.transactions = [];
        this.pendingPurchases = new Map();
        
        // Статистика
        this.stats = {
            totalPurchases: 0,
            lastPurchaseTime: null,
            purchaseRate: 0
        };
        
        this.loadFromStorage();
        this.startAutoSync();
    }
    
    // Автоматическое определение начального supply на основе популярности
    calculateInitialSupply(giftType) {
        const baseRates = {
            cat: 25,        // Cat популярен - 25 покупок в час
            cross: 8,       // Cross средний - 8 покупок в час  
            cybercar: 12    // Cybercar популярный - 12 покупок в час
        };
        
        // Симулируем историю продаж (можно заменить реальными данными)
        const hoursSinceLaunch = 24 * 7; // 1 неделя
        const baseSales = baseRates[giftType] * hoursSinceLaunch;
        
        // Добавляем случайность ±20%
        const randomFactor = 0.8 + (Math.random() * 0.4);
        const calculatedSales = Math.floor(baseSales * randomFactor);
        
        console.log(`Calculated initial supply for ${giftType}: ${calculatedSales}`);
        return Math.min(calculatedSales, this.maxSupply[giftType] * 0.3); // Макс 30% от total supply
    }
    
    // Обновление supply при покупке
    purchase(giftType, quantity = 1, userId = null) {
        if (!this.maxSupply[giftType]) {
            console.error(`Unknown gift type: ${giftType}`);
            return false;
        }
        
        const currentSupply = this[giftType];
        const newSupply = currentSupply + quantity;
        
        // Проверяем не превышен ли лимит
        if (newSupply > this.maxSupply[giftType]) {
            console.warn(`Supply limit reached for ${giftType}`);
            return false;
        }
        
        // Обновляем supply
        this[giftType] = newSupply;
        
        // Добавляем транзакцию
        const transaction = {
            id: this.generateTransactionId(),
            giftType: giftType,
            quantity: quantity,
            userId: userId,
            timestamp: new Date().toISOString(),
            newSupply: newSupply,
            remaining: this.maxSupply[giftType] - newSupply
        };
        
        this.transactions.push(transaction);
        
        // Обновляем статистику
        this.stats.totalPurchases += quantity;
        this.stats.lastPurchaseTime = new Date();
        this.updatePurchaseRate();
        
        // Сохраняем
        this.saveToStorage();
        
        console.log(`Purchase recorded: ${giftType} +${quantity}, New supply: ${newSupply}`);
        return true;
    }
    
    // Автоматическое обновление supply на основе времени (симуляция покупок другими пользователями)
    simulateMarketActivity() {
        const now = new Date();
        const activityRates = {
            cat: 0.8,      // 80% шанс покупки каждые 5 минут
            cross: 0.3,    // 30% шанс  
            cybercar: 0.5  // 50% шанс
        };
        
        Object.keys(activityRates).forEach(giftType => {
            if (Math.random() < activityRates[giftType]) {
                const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 штуки
                this.purchase(giftType, quantity, 'auto_system');
            }
        });
    }
    
    // Получение текущего supply
    getSupply(giftType) {
        const current = this[giftType] || 0;
        const max = this.maxSupply[giftType] || 0;
        
        return {
            current: current,
            max: max,
            remaining: max - current,
            percentage: Math.round((current / max) * 100),
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            totalSupply: {
                cat: this.getSupply('cat'),
                cross: this.getSupply('cross'),
                cybercar: this.getSupply('cybercar')
            },
            initialValues: this.initialValues,
            transactionsCount: this.transactions.length
        };
    }
    
    // Генерация ID транзакции
    generateTransactionId() {
        return 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Обновление скорости покупок
    updatePurchaseRate() {
        const recentTransactions = this.transactions
            .filter(tx => new Date(tx.timestamp) > new Date(Date.now() - 60 * 60 * 1000)) // Последний час
            .reduce((sum, tx) => sum + tx.quantity, 0);
        
        this.stats.purchaseRate = recentTransactions;
    }
    
    // Автоматическая синхронизация
    startAutoSync() {
        // Симуляция активности рынка каждые 2 минуты
        setInterval(() => {
            this.simulateMarketActivity();
        }, 120000);
        
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveToStorage();
        }, 30000);
    }
    
    // Сохранение в localStorage
    saveToStorage() {
        if (typeof localStorage !== 'undefined') {
            const saveData = {
                cat: this.cat,
                cross: this.cross,
                cybercar: this.cybercar,
                transactions: this.transactions.slice(-100), // Последние 100 транзакций
                stats: this.stats,
                lastSave: new Date().toISOString()
            };
            
            localStorage.setItem('drevo_smart_supply_db', JSON.stringify(saveData));
        }
    }
    
    // Загрузка из localStorage
    loadFromStorage() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('drevo_smart_supply_db');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.cat = data.cat || this.cat;
                    this.cross = data.cross || this.cross;
                    this.cybercar = data.cybercar || this.cybercar;
                    this.transactions = data.transactions || this.transactions;
                    this.stats = data.stats || this.stats;
                    
                    console.log('Supply data loaded from storage:', data);
                } catch (e) {
                    console.error('Error loading supply data:', e);
                }
            }
        }
    }
}

// Создаем глобальный экземпляр
const SMART_SUPPLY_DB = new SmartSupplyDB();

// Для использования в браузере
if (typeof window !== 'undefined') {
    window.SMART_SUPPLY_DB = SMART_SUPPLY_DB;
    window.DREVO_SUPPLY = SMART_SUPPLY_DB; // Алиас для обратной совместимости
}

// Для экспорта в Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SMART_SUPPLY_DB;
}

console.log('DREVO Smart Supply DB initialized:', SMART_SUPPLY_DB.getStats());
