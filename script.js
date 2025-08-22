class AnimeEternalApp {
    constructor() {
        this.currentTab = 'home';
        this.currentDPS = 0;
        this.selectedRaidRange = null;
        this.configCollapsed = true;
        this.rankUpTimer = null;
        this.levelProgressTimer = null;
        this.notificationTimers = new Map();
        this.userConfig = this.loadUserConfig();
        this.init();
    }

    showNotification(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <div class="notification-header">
                <i class="${icon}"></i>
                <span>${title}</span>
            </div>
            <div class="notification-body">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutNotification 0.5s ease-in forwards';
                setTimeout(() => notification.remove(), 500);
            }
        }, duration);

        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideOutNotification {
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        return notification;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    loadUserConfig() {
        try {
            const saved = localStorage.getItem('animeEternalConfig');
            if (saved) {
                const parsedConfig = JSON.parse(saved);
                return this.mergeWithDefaultConfig(parsedConfig);
            }
        } catch (error) {
            console.warn('Failed to load user config:', error);
        }
        return this.getDefaultConfig();
    }

    mergeWithDefaultConfig(savedConfig) {
        const defaultConfig = this.getDefaultConfig();
        
        const mergedConfig = {
            gamepasses: { ...defaultConfig.gamepasses, ...savedConfig.gamepasses },
            upgrades: { ...defaultConfig.upgrades, ...savedConfig.upgrades },
            achievements: {
                totalCoins: { ...defaultConfig.achievements.totalCoins, ...savedConfig.achievements?.totalCoins },
                dungeons: { ...defaultConfig.achievements.dungeons, ...savedConfig.achievements?.dungeons },
                worlds: { ...defaultConfig.achievements.worlds, ...savedConfig.achievements?.worlds }
            },
            equipment: { ...defaultConfig.equipment, ...savedConfig.equipment }
        };
        
        return mergedConfig;
    }

    saveUserConfig() {
        try {
            localStorage.setItem('animeEternalConfig', JSON.stringify(this.userConfig));
        } catch (error) {
            console.warn('Failed to save user config:', error);
        }
    }

    getDefaultConfig() {
        return {
            gamepasses: {
                vip: false,
                premium: false,
                doubleCoins: false,
                doubleExp: false,
                doubleSouls: false
            },
            upgrades: {
                dungeonExp: 0,
                coinUpgrades: 0,
                upgradeDrops: 0,
                avatarSouls: 0,
                demonLord: 0
            },
            achievements: {
                totalCoins: {
                    i: true, ii: true, iii: true, iv: true, v: true,
                    vi: true, vii: true, viii: true, ix: true, x: true,
                    xi: true, xii: true, xiii: true, xiv: true, xv: true
                },
                dungeons: {
                    easy: false, medium: false, hard: false,
                    insane: false, crazy: false, nightmare: false
                },
                worlds: {
                    earthCity: true, windmillIsland: true, soulSociety: true,
                    cursedSchool: true, slayerVillage: true, soloIsland: true,
                    cloverVillage: true, leafVillage: true, spiritResidence: true,
                    magicHunterCity: true, titanCity: true, villageOfSins: true,
                    kaijuBase: false, tempestCapital: false, virtualCity: false
                }
            },
            equipment: {
                aura: '0',
                ring: '0',
                necklace: '0',
                earrings: '0',
                hat: '0',
                scarf: '0',
                mask: '0',
                cloak: '0',
                fruit: '0',
                eyes: '0',
                virtue: '0'
            }
        };
    }

    updateConfigFromUI() {
        this.userConfig.gamepasses.vip = document.getElementById('config-vip-gamepass')?.checked || false;
        this.userConfig.gamepasses.premium = document.getElementById('config-premium-benefits')?.checked || false;
        this.userConfig.gamepasses.doubleCoins = document.getElementById('config-double-coins-gamepass')?.checked || false;
        this.userConfig.gamepasses.doubleExp = document.getElementById('config-double-exp-gamepass')?.checked || false;
        this.userConfig.gamepasses.doubleSouls = document.getElementById('config-double-souls-gamepass')?.checked || false;

        this.userConfig.upgrades.dungeonExp = parseInt(document.getElementById('config-dungeon-exp-level')?.value) || 0;
        this.userConfig.upgrades.coinUpgrades = parseInt(document.getElementById('config-coin-upgrades-level')?.value) || 0;
        this.userConfig.upgrades.upgradeDrops = parseInt(document.getElementById('config-upgrade-drops-level')?.value) || 0;
        this.userConfig.upgrades.avatarSouls = parseInt(document.getElementById('config-avatar-souls-upgrade-level')?.value) || 0;
        this.userConfig.upgrades.demonLord = parseInt(document.getElementById('config-demon-lord-level')?.value) || 0;

        const totalCoinsAchievements = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
        totalCoinsAchievements.forEach(tier => {
            this.userConfig.achievements.totalCoins[tier] = document.getElementById(`config-total-coins-${tier}`)?.checked || false;
        });

        const dungeonAchievements = ['easy', 'medium', 'hard', 'insane', 'crazy', 'nightmare'];
        dungeonAchievements.forEach(difficulty => {
            this.userConfig.achievements.dungeons[difficulty] = document.getElementById(`config-dungeon-${difficulty}-iv`)?.checked || false;
        });

        const worldAchievements = {
            'earth-city': 'earthCity',
            'windmill-island': 'windmillIsland',
            'soul-society': 'soulSociety',
            'cursed-school': 'cursedSchool',
            'slayer-village': 'slayerVillage',
            'solo-island': 'soloIsland',
            'clover-village': 'cloverVillage',
            'leaf-village': 'leafVillage',
            'spirit-residence': 'spiritResidence',
            'magic-hunter-city': 'magicHunterCity',
            'titan-city': 'titanCity',
            'village-of-sins': 'villageOfSins',
            'kaiju-base': 'kaijuBase',
            'tempest-capital': 'tempestCapital',
            'virtual-city': 'virtualCity'
        };

        Object.entries(worldAchievements).forEach(([elementKey, configKey]) => {
            this.userConfig.achievements.worlds[configKey] = document.getElementById(`config-world-${elementKey}`)?.checked || false;
        });

        this.userConfig.equipment.aura = document.getElementById('config-aura-select')?.value || '0';
        this.userConfig.equipment.ring = document.getElementById('config-ring-select')?.value || '0';
        this.userConfig.equipment.necklace = document.getElementById('config-necklace-select')?.value || '0';
        this.userConfig.equipment.earrings = document.getElementById('config-earrings-select')?.value || '0';
        this.userConfig.equipment.hat = document.getElementById('config-hat-select')?.value || '0';
        this.userConfig.equipment.scarf = document.getElementById('config-scarf-select')?.value || '0';
        this.userConfig.equipment.mask = document.getElementById('config-mask-select')?.value || '0';
        this.userConfig.equipment.cloak = document.getElementById('config-cloak-select')?.value || '0';
        this.userConfig.equipment.fruit = document.getElementById('config-fruit-select')?.value || '0';
        this.userConfig.equipment.eyes = document.getElementById('config-eyes-select')?.value || '0';
        this.userConfig.equipment.virtue = document.getElementById('config-virtue-select')?.value || '0';

        this.saveUserConfig();
        this.updateMultiplierDisplays();
        this.updateLootCalculatorConfig();
        this.updateLevelCalculatorConfig();
    }

    applyConfigToUI() {
        document.getElementById('config-vip-gamepass').checked = this.userConfig.gamepasses.vip;
        document.getElementById('config-premium-benefits').checked = this.userConfig.gamepasses.premium;
        document.getElementById('config-double-coins-gamepass').checked = this.userConfig.gamepasses.doubleCoins;
        document.getElementById('config-double-exp-gamepass').checked = this.userConfig.gamepasses.doubleExp;
        document.getElementById('config-double-souls-gamepass').checked = this.userConfig.gamepasses.doubleSouls;

        document.getElementById('config-dungeon-exp-level').value = this.userConfig.upgrades.dungeonExp;
        document.getElementById('config-coin-upgrades-level').value = this.userConfig.upgrades.coinUpgrades;
        document.getElementById('config-upgrade-drops-level').value = this.userConfig.upgrades.upgradeDrops;
        document.getElementById('config-avatar-souls-upgrade-level').value = this.userConfig.upgrades.avatarSouls;
        document.getElementById('config-demon-lord-level').value = this.userConfig.upgrades.demonLord;

        const totalCoinsAchievements = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
        totalCoinsAchievements.forEach(tier => {
            const element = document.getElementById(`config-total-coins-${tier}`);
            if (element) element.checked = this.userConfig.achievements.totalCoins[tier];
        });

        const dungeonAchievements = ['easy', 'medium', 'hard', 'insane', 'crazy', 'nightmare'];
        dungeonAchievements.forEach(difficulty => {
            const element = document.getElementById(`config-dungeon-${difficulty}-iv`);
            if (element) element.checked = this.userConfig.achievements.dungeons[difficulty];
        });

        const worldAchievements = {
            'earth-city': 'earthCity',
            'windmill-island': 'windmillIsland',
            'soul-society': 'soulSociety',
            'cursed-school': 'cursedSchool',
            'slayer-village': 'slayerVillage',
            'solo-island': 'soloIsland',
            'clover-village': 'cloverVillage',
            'leaf-village': 'leafVillage',
            'spirit-residence': 'spiritResidence',
            'magic-hunter-city': 'magicHunterCity',
            'titan-city': 'titanCity',
            'village-of-sins': 'villageOfSins',
            'kaiju-base': 'kaijuBase',
            'tempest-capital': 'tempestCapital',
            'virtual-city': 'virtualCity'
        };

        Object.entries(worldAchievements).forEach(([elementKey, configKey]) => {
            const element = document.getElementById(`config-world-${elementKey}`);
            if (element) element.checked = this.userConfig.achievements.worlds[configKey];
        });

        document.getElementById('config-aura-select').value = this.userConfig.equipment.aura;
        document.getElementById('config-ring-select').value = this.userConfig.equipment.ring;
        document.getElementById('config-necklace-select').value = this.userConfig.equipment.necklace;
        document.getElementById('config-earrings-select').value = this.userConfig.equipment.earrings;
        document.getElementById('config-hat-select').value = this.userConfig.equipment.hat;
        document.getElementById('config-scarf-select').value = this.userConfig.equipment.scarf;
        document.getElementById('config-mask-select').value = this.userConfig.equipment.mask;
        document.getElementById('config-cloak-select').value = this.userConfig.equipment.cloak;
        document.getElementById('config-fruit-select').value = this.userConfig.equipment.fruit;
        document.getElementById('config-eyes-select').value = this.userConfig.equipment.eyes;
        document.getElementById('config-virtue-select').value = this.userConfig.equipment.virtue;

        this.updateUpgradeBonusDisplays();
        this.updateMultiplierDisplays();
    }

    calculateAllMultipliers() {
        let expMultiplier = 1;
        let coinMultiplier = 1;
        let soulsMultiplier = 1;
        let baseCoinsBonus = 0;
        let tokenMultiplier = 1;

        if (this.userConfig.gamepasses.vip) expMultiplier *= 1.05;
        if (this.userConfig.gamepasses.premium) coinMultiplier *= 1.10;
        if (this.userConfig.gamepasses.doubleCoins) coinMultiplier *= 2;
        if (this.userConfig.gamepasses.doubleExp) expMultiplier *= 2;
        if (this.userConfig.gamepasses.doubleSouls) soulsMultiplier *= 2;

        expMultiplier *= 1 + (this.userConfig.upgrades.dungeonExp * 0.05);
        coinMultiplier *= 1 + (this.userConfig.upgrades.coinUpgrades * 0.05);
        tokenMultiplier *= 1 + (this.userConfig.upgrades.upgradeDrops * 0.05);
        soulsMultiplier *= 1 + (this.userConfig.upgrades.avatarSouls * 0.05);
        coinMultiplier *= 1 + (this.userConfig.upgrades.demonLord * 0.01);

        const totalCoinsBonus = Object.values(this.userConfig.achievements.totalCoins).filter(Boolean).length * 5;
        coinMultiplier *= 1 + (totalCoinsBonus / 100);

        const dungeonBonus = Object.entries(this.userConfig.achievements.dungeons)
            .filter(([key, value]) => value)
            .reduce((total, [key]) => total + (key === 'crazy' ? 10 : 5), 0);
        coinMultiplier *= 1 + (dungeonBonus / 100);

        const worldBonuses = {
            earthCity: 5, windmillIsland: 5, soulSociety: 5, cursedSchool: 5,
            slayerVillage: 5, soloIsland: 5, cloverVillage: 5, leafVillage: 5,
            spiritResidence: 5, magicHunterCity: 5, titanCity: 5, villageOfSins: 5,
            kaijuBase: 4, tempestCapital: 3, virtualCity: 2
        };
        const worldBonus = Object.entries(this.userConfig.achievements.worlds)
            .filter(([key, value]) => value)
            .reduce((total, [key]) => total + (worldBonuses[key] || 0), 0);
        coinMultiplier *= 1 + (worldBonus / 100);

        coinMultiplier *= (1 + parseFloat(this.userConfig.equipment.ring));
        coinMultiplier *= (1 + parseFloat(this.userConfig.equipment.necklace));
        coinMultiplier *= (1 + parseFloat(this.userConfig.equipment.earrings));

        baseCoinsBonus += parseFloat(this.userConfig.equipment.hat);
        baseCoinsBonus += parseFloat(this.userConfig.equipment.scarf);
        baseCoinsBonus += parseFloat(this.userConfig.equipment.fruit);

        if (this.userConfig.equipment.aura !== '0') {
            try {
                const aura = JSON.parse(this.userConfig.equipment.aura);
                coinMultiplier *= (1 + aura.coins);
                expMultiplier *= (1 + aura.exp);
                soulsMultiplier *= (1 + aura.souls);
                tokenMultiplier *= (1 + aura.tokenDrops);
            } catch (e) {
                console.warn('Invalid aura data');
            }
        }

        if (this.userConfig.equipment.mask !== '0') {
            try {
                const mask = JSON.parse(this.userConfig.equipment.mask);
                baseCoinsBonus += mask.coins;
                expMultiplier *= (1 + mask.exp / 100);
            } catch (e) {
                console.warn('Invalid mask data');
            }
        }

        if (this.userConfig.equipment.cloak !== '0') {
            try {
                const cloak = JSON.parse(this.userConfig.equipment.cloak);
                expMultiplier *= (1 + cloak.exp / 100);
            } catch (e) {
                console.warn('Invalid cloak data');
            }
        }

        if (this.userConfig.equipment.eyes !== '0') {
            try {
                const eyes = JSON.parse(this.userConfig.equipment.eyes);
                coinMultiplier *= (1 + eyes.coins);
                if (eyes.exp) expMultiplier *= (1 + eyes.exp);
            } catch (e) {
                console.warn('Invalid eyes data');
            }
        }

        if (this.userConfig.equipment.virtue !== '0') {
            try {
                const virtue = JSON.parse(this.userConfig.equipment.virtue);
                coinMultiplier *= (1 + virtue.coins);
                if (virtue.exp) expMultiplier *= (1 + virtue.exp);
            } catch (e) {
                console.warn('Invalid virtue data');
            }
        }

        return {
            expMultiplier,
            coinMultiplier,
            soulsMultiplier,
            baseCoinsBonus,
            tokenMultiplier
        };
    }

    updateMultiplierDisplays() {
        const multipliers = this.calculateAllMultipliers();
        
        const totalExpElement = document.getElementById('total-exp-multiplier');
        const totalCoinElement = document.getElementById('total-coin-multiplier');
        const totalBaseCoinsElement = document.getElementById('total-base-coins');
        const totalTokenElement = document.getElementById('total-token-multiplier');
        const totalSoulElement = document.getElementById('total-soul-multiplier');

        if (totalExpElement) totalExpElement.textContent = multipliers.expMultiplier.toFixed(2) + 'x';
        if (totalCoinElement) totalCoinElement.textContent = multipliers.coinMultiplier.toFixed(2) + 'x';
        if (totalBaseCoinsElement) totalBaseCoinsElement.textContent = '+' + multipliers.baseCoinsBonus.toFixed(2);
        if (totalTokenElement) totalTokenElement.textContent = multipliers.tokenMultiplier.toFixed(2) + 'x';
        if (totalSoulElement) totalSoulElement.textContent = multipliers.soulsMultiplier.toFixed(2) + 'x';
    }

    updateLootCalculatorConfig() {
        const multipliers = this.calculateAllMultipliers();
        
        const lootExpElement = document.getElementById('loot-exp-multiplier');
        const lootCoinElement = document.getElementById('loot-coin-multiplier');
        const lootBaseCoinsElement = document.getElementById('loot-base-coins');
        const lootTokenElement = document.getElementById('loot-token-multiplier');
        const lootSoulElement = document.getElementById('loot-soul-multiplier');

        if (lootExpElement) lootExpElement.textContent = multipliers.expMultiplier.toFixed(2) + 'x';
        if (lootCoinElement) lootCoinElement.textContent = multipliers.coinMultiplier.toFixed(2) + 'x';
        if (lootBaseCoinsElement) lootBaseCoinsElement.textContent = '+' + multipliers.baseCoinsBonus.toFixed(2);
        if (lootTokenElement) lootTokenElement.textContent = multipliers.tokenMultiplier.toFixed(2) + 'x';
        if (lootSoulElement) lootSoulElement.textContent = multipliers.soulsMultiplier.toFixed(2) + 'x';
    }

    updateLevelCalculatorConfig() {
        const multipliers = this.calculateAllMultipliers();
        
        const levelExpElement = document.getElementById('level-exp-multiplier');
        if (levelExpElement) levelExpElement.textContent = multipliers.expMultiplier.toFixed(2) + 'x';
    }

    updateUpgradeBonusDisplays() {
        const dungeonExpBonus = this.userConfig.upgrades.dungeonExp * 5;
        const coinBonus = this.userConfig.upgrades.coinUpgrades * 5;
        const tokenBonus = this.userConfig.upgrades.upgradeDrops * 5;
        const soulBonus = this.userConfig.upgrades.avatarSouls * 5;
        const demonLordBonus = this.userConfig.upgrades.demonLord * 1;

        const updateBonusText = (elementId, bonus, suffix = '% EXP bonus') => {
            const parentDiv = document.getElementById(elementId)?.closest('.upgrade-item');
            if (parentDiv) {
                const bonusElement = parentDiv.querySelector('.upgrade-bonus');
                if (bonusElement) bonusElement.textContent = `+${bonus}${suffix}`;
            }
        };

        updateBonusText('config-dungeon-exp-level', dungeonExpBonus, '% EXP bonus');
        updateBonusText('config-coin-upgrades-level', coinBonus, '% coin bonus');
        updateBonusText('config-upgrade-drops-level', tokenBonus, '% token bonus');
        updateBonusText('config-avatar-souls-upgrade-level', soulBonus, '% souls bonus');
        updateBonusText('config-demon-lord-level', demonLordBonus, '% coin bonus');
    }

    setMaxAllConfig() {
        this.userConfig.gamepasses = {
            vip: true, premium: true, doubleCoins: true, doubleExp: true, doubleSouls: true
        };
        
        this.userConfig.upgrades = {
            dungeonExp: 10, coinUpgrades: 30, upgradeDrops: 13, avatarSouls: 19, demonLord: 100
        };
        
        Object.keys(this.userConfig.achievements.totalCoins).forEach(key => {
            this.userConfig.achievements.totalCoins[key] = true;
        });
        
        Object.keys(this.userConfig.achievements.dungeons).forEach(key => {
            this.userConfig.achievements.dungeons[key] = true;
        });
        
        Object.keys(this.userConfig.achievements.worlds).forEach(key => {
            this.userConfig.achievements.worlds[key] = true;
        });

        this.userConfig.equipment = {
            aura: JSON.stringify({ coins: 0, exp: 0, souls: 0, tokenDrops: 0.25 }),
            ring: '0.75',
            necklace: '0.75',
            earrings: '0.75',
            hat: '0.500',
            scarf: '1.500',
            mask: JSON.stringify({ coins: 0.250, exp: 5.0 }),
            cloak: JSON.stringify({ exp: 5.0 }),
            fruit: '1.0',
            eyes: JSON.stringify({ coins: 1.0, exp: 0 }),
            virtue: JSON.stringify({ coins: 1.0, exp: 0 })
        };

        this.applyConfigToUI();
        this.saveUserConfig();
        this.showNotification('Max Configuration Applied', 'All bonuses set to maximum values!', 'success');
    }

    setMaxExpConfig() {
        this.userConfig.gamepasses.vip = true;
        this.userConfig.gamepasses.doubleExp = true;
        
        this.userConfig.upgrades.dungeonExp = 10;
        
        this.userConfig.equipment.mask = JSON.stringify({ coins: 0.250, exp: 5.0 });
        this.userConfig.equipment.cloak = JSON.stringify({ exp: 5.0 });
        
        this.applyConfigToUI();
        this.saveUserConfig();
        this.showNotification('Max EXP Configuration Applied', 'EXP bonuses maximized!', 'success');
    }

    setMaxCoinsConfig() {
        this.userConfig.gamepasses.premium = true;
        this.userConfig.gamepasses.doubleCoins = true;
        
        this.userConfig.upgrades.coinUpgrades = 30;
        this.userConfig.upgrades.demonLord = 100;
        
        Object.keys(this.userConfig.achievements.totalCoins).forEach(key => {
            this.userConfig.achievements.totalCoins[key] = true;
        });
        
        Object.keys(this.userConfig.achievements.dungeons).forEach(key => {
            this.userConfig.achievements.dungeons[key] = true;
        });
        
        Object.keys(this.userConfig.achievements.worlds).forEach(key => {
            this.userConfig.achievements.worlds[key] = true;
        });

        this.userConfig.equipment.aura = JSON.stringify({ coins: 0.15, exp: 0, souls: 0 });
        this.userConfig.equipment.ring = '0.75';
        this.userConfig.equipment.necklace = '0.75';
        this.userConfig.equipment.earrings = '0.75';
        this.userConfig.equipment.hat = '0.500';
        this.userConfig.equipment.scarf = '1.500';
        this.userConfig.equipment.mask = JSON.stringify({ coins: 0.250, exp: 5.0 });
        this.userConfig.equipment.fruit = '1.0';
        this.userConfig.equipment.eyes = JSON.stringify({ coins: 1.0, exp: 0 });
        this.userConfig.equipment.virtue = JSON.stringify({ coins: 1.0, exp: 0 });
        
        this.applyConfigToUI();
        this.saveUserConfig();
        this.showNotification('Max Coins Configuration Applied', 'Coin bonuses maximized!', 'success');
    }

    setupConfigEventListeners() {
        document.querySelectorAll('#config input, #config select').forEach(element => {
            element.addEventListener('change', () => {
                this.updateConfigFromUI();
            });
        });

        document.getElementById('save-config')?.addEventListener('click', () => {
            this.updateConfigFromUI();
            this.showNotification('Configuration Saved', 'Your settings have been saved successfully!', 'success');
        });

        document.getElementById('reset-config')?.addEventListener('click', () => {
            this.userConfig = this.getDefaultConfig();
            this.applyConfigToUI();
            this.saveUserConfig();
            this.showNotification('Configuration Reset', 'All settings have been reset to defaults.', 'info');
        });

        document.getElementById('set-max-all')?.addEventListener('click', () => {
            this.setMaxAllConfig();
        });

        document.getElementById('set-max-exp')?.addEventListener('click', () => {
            this.setMaxExpConfig();
        });

        document.getElementById('set-max-coins')?.addEventListener('click', () => {
            this.setMaxCoinsConfig();
        });
    }

    onDPSChange() {
        const dpsInput = document.getElementById('dps-input');
        const dpsSuffix = document.getElementById('dps-suffix');

        if (dpsInput && dpsSuffix) {
            const dpsValue = parseFloat(dpsInput.value);
            const multiplier = parseFloat(dpsSuffix.value);

            if (dpsValue && dpsValue > 0) {
                this.currentDPS = dpsValue * multiplier;
                this.updateTimeToKillResults();
            } else {
                this.clearTimeToKillResults();
            }
        }
    }

    getLootCalculatorConfig() {
        const dpsInput = document.getElementById('farm-dps-input');
        const dpsSuffix = document.getElementById('farm-dps-suffix');
        const mobSelect = document.getElementById('farm-mob-select');
        const farmHours = document.getElementById('farm-hours');
        const farmMinutes = document.getElementById('farm-minutes');

        if (!dpsInput?.value || parseFloat(dpsInput.value) <= 0) {
            return { valid: false, error: 'Please enter a valid DPS value.' };
        }

        const hoursValue = parseFloat(farmHours?.value) || 0;
        const minutesValue = parseFloat(farmMinutes?.value) || 0;
        const totalHours = hoursValue + (minutesValue / 60);

        if (totalHours <= 0) {
            return { valid: false, error: 'Please enter valid farming duration.' };
        }

        const userDPS = parseFloat(dpsInput.value) * parseFloat(dpsSuffix.value);
        const multipliers = this.calculateAllMultipliers();
        const farmType = document.querySelector('input[name="farm-type"]:checked')?.value || '3';

        return {
            valid: true,
            userDPS,
            selectedMob: mobSelect?.value || null,
            farmingHours: totalHours,
            expMultiplier: multipliers.expMultiplier,
            coinMultiplier: multipliers.coinMultiplier,
            soulsMultiplier: multipliers.soulsMultiplier,
            baseCoinsBonus: multipliers.baseCoinsBonus,
            farmType,
            upgradeDropsMultiplier: multipliers.tokenMultiplier,
            avatarSoulsUpgradeMultiplier: multipliers.soulsMultiplier
        };
    }

    displayLootResults(results) {
        const container = document.getElementById('loot-results');
        container.style.display = 'block';

        if (!results.viable) {
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Farming Status</div>
                    <div class="stat-value" style="color: #ff6666;">Not Viable</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Reason</div>
                    <div class="stat-value" style="color: #ff6666; font-size: 0.9rem;">${results.error || 'Unknown error'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Kill Time</div>
                    <div class="stat-value">${formatTime(results.timePerKill)}</div>
                </div>
            `;
            return;
        }

        const { mobData, totals, perHour, killsPerHour, farmingHours } = results;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Farming Target</div>
                    <div class="stat-value">${mobData.name}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">World</div>
                    <div class="stat-value">${mobData.world}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Kill Time</div>
                    <div class="stat-value">${formatTime(results.timePerKill)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Kills/Hour</div>
                    <div class="stat-value">${Math.floor(killsPerHour).toLocaleString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">XP/Hour</div>
                    <div class="stat-value xp">${formatNumber(perHour.exp)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Coins/Hour</div>
                    <div class="stat-value coins">${formatNumber(perHour.coins)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total XP (${farmingHours}h)</div>
                    <div class="stat-value xp">${formatNumber(totals.exp)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total Coins (${farmingHours}h)</div>
                    <div class="stat-value coins">${formatNumber(totals.coins)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Tokens/Hour</div>
                    <div class="stat-value tokens">
                        <div class="range-value">${Math.floor(perHour.tokens.min)} - ${Math.ceil(perHour.tokens.max)}</div>
                        <div class="average-value">Avg: ${Math.round(perHour.tokens.average)}</div>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Souls/Hour</div>
                    <div class="stat-value souls">
                        <div class="range-value">${Math.floor(perHour.souls.min)} - ${Math.ceil(perHour.souls.max)}</div>
                        <div class="average-value">Avg: ${Math.round(perHour.souls.average)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    getLevelProgressConfig() {
        const currentLevel = parseInt(document.getElementById('level-current-level')?.value);
        const targetLevel = parseInt(document.getElementById('level-target-level')?.value);
        const currentXp = parseInt(document.getElementById('level-current-xp')?.value) || 0;
        const prestige = parseInt(document.getElementById('level-prestige-select')?.value) || 0;
        const selectedWorld = document.getElementById('level-world-select')?.value;
        const selectedMob = document.getElementById('level-mob-select')?.value;
        
        const dpsInput = document.getElementById('level-dps-input');
        const dpsSuffix = document.getElementById('level-dps-suffix');
        
        if (!dpsInput?.value || parseFloat(dpsInput.value) <= 0) {
            return { valid: false, error: 'Please enter a valid DPS value.' };
        }

        const userDPS = parseFloat(dpsInput.value) * parseFloat(dpsSuffix?.value || 1);
        
        const multipliers = this.calculateAllMultipliers();
        const farmType = document.querySelector('input[name="level-farm-type"]:checked')?.value || '3';

        if (!currentLevel || !targetLevel) {
            return { valid: false, error: 'Please enter valid current and target levels.' };
        }

        if (currentLevel >= targetLevel) {
            return { valid: false, error: 'Target level must be higher than current level.' };
        }

        return {
            valid: true,
            currentLevel,
            targetLevel,
            currentXp,
            prestige,
            selectedWorld,
            selectedMob,
            userDPS,
            expMultiplier: multipliers.expMultiplier,
            farmType
        };
    }

    calculateLevelProgress() {
        const config = this.getLevelProgressConfig();
        if (!config.valid) {
            this.displayLevelError(config.error);
            return;
        }

        if (typeof calculator === 'undefined') {
            this.displayLevelError('Calculator not loaded.');
            return;
        }

        let results;
        
        if (config.selectedMob) {
            results = calculator.calculateLevelFarmingTime(config);
        } else {
            results = calculator.calculateLevelProgressWithAutoBestMob(config);
        }
        
        this.displayLevelResults(results);
    }

    displayLevelResults(results) {
        const container = document.getElementById('level-results');
        
        if (!results.valid) {
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Error</div>
                    <div class="stat-value" style="color: #ff6666;">${results.error}</div>
                </div>
            `;
            return;
        }

        const progressPercentage = Math.min(100, Math.max(0, results.progressPercentage || 0));
        
        let bestMobInfo = '';
        if (results.bestMob) {
            bestMobInfo = `
                <div class="stats-grid" style="margin-bottom: 2rem;">
                    <div class="stat-item">
                        <div class="stat-label">Best XP Farm</div>
                        <div class="stat-value">${results.bestMob.name}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">World</div>
                        <div class="stat-value">${results.bestMob.world}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Kill Time</div>
                        <div class="stat-value">${formatTime(results.bestMob.timeToKill)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">XP/Hour</div>
                        <div class="stat-value xp">${formatNumber(results.bestMob.xpPerHour)}</div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = `
            ${bestMobInfo}
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">${progressPercentage.toFixed(1)}%</div>
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">XP Needed</div>
                    <div class="stat-value xp">${formatNumber(results.totalXpNeeded)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Time Required</div>
                    <div class="stat-value">${results.timeFormatted}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Effective XP/Hour</div>
                    <div class="stat-value xp">${formatNumber(results.effectiveXpPerHour)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Prestige Multiplier</div>
                    <div class="stat-value">${results.prestigeMultiplier.toFixed(1)}x</div>
                </div>
            </div>
        `;
    }

    displayLevelError(error) {
        const container = document.getElementById('level-results');
        container.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Error</div>
                <div class="stat-value" style="color: #ff6666;">${error}</div>
            </div>
        `;
    }

    getRankUpConfig() {
        const currentRank = parseInt(document.getElementById('current-rank')?.value);
        const energyPerClick = this.getEnergyPerClick();
        const currentEnergy = this.getCurrentEnergy();
        const targetEnergy = this.getTargetEnergy();
        
        let potionDuration = 0;
        const days = parseInt(document.getElementById('potion-days')?.value) || 0;
        const hours = parseInt(document.getElementById('potion-hours')?.value) || 0;
        const minutes = parseInt(document.getElementById('potion-minutes')?.value) || 0;
        potionDuration = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);

        if (!currentRank || currentRank < 1 || currentRank > 75) {
            return { valid: false, error: 'Please enter a valid rank between 1 and 75.' };
        }

        if (!energyPerClick || energyPerClick <= 0) {
            return { valid: false, error: 'Please enter a valid energy per click value.' };
        }

        return {
            valid: true,
            currentRank,
            energyPerClick,
            currentEnergy,
            potionType: 'none',
            potionDuration,
            targetEnergy
        };
    }

    getEnergyPerClick() {
        const epcInput = document.getElementById('energy-per-click');
        const epcSuffix = document.getElementById('energy-per-click-suffix');
        
        if (!epcInput?.value || parseFloat(epcInput.value) <= 0) return 0;
        
        const baseEPC = parseFloat(epcInput.value) * parseFloat(epcSuffix?.value || 1);
        
        const clickingMethod = document.querySelector('input[name="clicking-method"]:checked')?.value || 'slow';
        let clicksPerSecond = 3.5;
        
        if (clickingMethod === 'fast') {
            const speedSlider = document.getElementById('clicker-speed');
            clicksPerSecond = parseFloat(speedSlider?.value || 5.0);
        }
        
        return baseEPC * clicksPerSecond;
    }

    getCurrentEnergy() {
        const energyInput = document.getElementById('current-energy');
        const energySuffix = document.getElementById('current-energy-suffix');
        
        if (!energyInput?.value) return 0;
        
        return parseFloat(energyInput.value) * parseFloat(energySuffix?.value || 1);
    }

    getTargetEnergy() {
        const targetInput = document.getElementById('target-energy');
        const targetSuffix = document.getElementById('target-energy-suffix');
        
        if (!targetInput?.value) return null;
        
        return parseFloat(targetInput.value) * parseFloat(targetSuffix?.value || 1);
    }

    calculateRankUpTime() {
        const config = this.getRankUpConfig();
        if (!config.valid) {
            this.displayRankError(config.error);
            return;
        }

        if (typeof calculator === 'undefined') {
            this.displayRankError('Calculator not loaded.');
            return;
        }

        const results = calculator.calculateRankUpProgress(config);
        this.displayRankResults(results);
    }

    displayRankResults(results) {
        const container = document.getElementById('rank-results');
        
        if (!results.valid) {
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Error</div>
                    <div class="stat-value" style="color: #ff6666;">${results.error}</div>
                </div>
            `;
            return;
        }

        let rankDisplayContent;
        const energyProgress = results.currentEnergy || 0;
        const energyNeeded = results.energyRequired;
        const progressPercentage = energyNeeded > 0 ? Math.min(100, (energyProgress / energyNeeded) * 100) : 0;
        
        if (results.isMaxRank) {
            rankDisplayContent = `
                <div class="rank-display">
                    <div class="current-rank">
                        <span class="rank-label">Current Rank</span>
                        <span class="rank-number">${results.currentRank}</span>
                        <span class="rank-multiplier">MAX RANK</span>
                    </div>
                    <div class="rank-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="next-rank">
                        <span class="rank-label">Energy Goal</span>
                        <span class="rank-number">${formatNumber(results.targetEnergy)}</span>
                        <span class="rank-multiplier">${formatNumber(results.energyMultiplier)}x Energy</span>
                    </div>
                </div>
            `;
        } else {
            rankDisplayContent = `
                <div class="rank-display">
                    <div class="current-rank">
                        <span class="rank-label">Current Rank</span>
                        <span class="rank-number">${results.currentRank}</span>
                        <span class="rank-multiplier">${formatNumber(results.energyMultiplier)}x Energy</span>
                    </div>
                    <div class="rank-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="next-rank">
                        <span class="rank-label">Next Rank</span>
                        <span class="rank-number">${results.nextRank}</span>
                        <span class="rank-multiplier">${formatNumber(results.nextRankMultiplier)}x Energy</span>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            ${rankDisplayContent}
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">${progressPercentage.toFixed(1)}%</div>
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">${results.isMaxRank ? 'Energy Goal' : 'Energy Required'}</div>
                    <div class="stat-value energy">${formatNumber(results.energyRequired)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Current Energy</div>
                    <div class="stat-value energy">${formatNumber(energyProgress)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Energy Per Second</div>
                    <div class="stat-value energy">${formatNumber(results.energyPerClick)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Energy Remaining</div>
                    <div class="stat-value energy">${formatNumber(Math.max(0, energyNeeded - energyProgress))}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Time Required</div>
                    <div class="stat-value">${results.timeFormatted}</div>
                </div>
            </div>
        `;
    }

    displayRankError(error) {
        const container = document.getElementById('rank-results');
        container.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Error</div>
                <div class="stat-value" style="color: #ff6666;">${error}</div>
            </div>
        `;
    }

    updateNextRankDisplay() {
        const currentRank = parseInt(document.getElementById('current-rank')?.value);
        const targetEnergyContainer = document.getElementById('target-energy-container');
        
        if (!currentRank) return;

        if (currentRank === 75) {
            if (targetEnergyContainer) {
                targetEnergyContainer.style.display = 'block';
            }
        } else {
            if (targetEnergyContainer) {
                targetEnergyContainer.style.display = 'none';
            }
        }
    }

    updateClickerSpeedDisplay() {
        const speedSlider = document.getElementById('clicker-speed');
        const speedValue = document.getElementById('speed-value');
        
        if (speedSlider && speedValue) {
            speedValue.textContent = parseFloat(speedSlider.value).toFixed(1);
        }
    }

    toggleClickingMethod() {
        const clickingMethod = document.querySelector('input[name="clicking-method"]:checked')?.value;
        const fastClickerSpeed = document.getElementById('fast-clicker-speed');
        
        if (fastClickerSpeed) {
            if (clickingMethod === 'fast') {
                fastClickerSpeed.style.display = 'block';
            } else {
                fastClickerSpeed.style.display = 'none';
            }
        }
        
        this.calculateRankUpTime();
    }

    togglePotionDuration() {
        const potionType = document.getElementById('potion-type')?.value;
        const potionDurationInputs = document.getElementById('potion-duration-inputs');
        
        if (!potionDurationInputs) return;
        
        if (potionType === 'none') {
            potionDurationInputs.style.display = 'none';
        } else {
            potionDurationInputs.style.display = 'block';
        }
    }

    runCalculations() {
        const config = this.getLootCalculatorConfig();
        if (!config.valid) {
            document.getElementById('loot-results').innerHTML = `<div class="stat-item"><div class="stat-label">Error</div><div class="stat-value" style="color: #ff6666;">${config.error}</div></div>`;
            this.clearOptimalResults();
            return;
        }

        this.updateOptimalFarms(config);

        if (config.selectedMob) {
            if (typeof calculator === 'undefined') {
                document.getElementById('loot-results').innerHTML = '<div class="stat-item"><div class="stat-label">Error</div><div class="stat-value" style="color: #ff6666;">Calculator not loaded.</div></div>';
                return;
            }
            const results = calculator.calculateFarmingEfficiency(config);
            if (!results) {
                document.getElementById('loot-results').innerHTML = '<div class="stat-item"><div class="stat-label">Error</div><div class="stat-value" style="color: #ff6666;">Unable to calculate results.</div></div>';
                return;
            }
            this.displayLootResults(results);
        } else {
            document.getElementById('loot-results').innerHTML = '';
            document.getElementById('loot-results').style.display = 'none';
        }
    }

    displayOptimalFarms(optimalXP, optimalCoin) {
        const xpContainer = document.getElementById('optimal-xp-farm');
        const coinContainer = document.getElementById('optimal-coin-farm');

        const renderOptimalCard = (container, data, type) => {
            if (data) {
                container.innerHTML = `
                    <div class="optimal-header">
                        <i class="fas fa-${type === 'XP' ? 'star' : 'coins'}"></i>
                        <span>Best ${type} Farm</span>
                    </div>
                    <div class="optimal-content">
                        <div class="optimal-mob">${data.name}</div>
                        <div class="optimal-stats">
                            <div class="optimal-stat"><strong>World:</strong> ${data.world}</div>
                            <div class="optimal-stat"><strong>Rank:</strong> ${data.rank}</div>
                            <div class="optimal-stat"><strong>Kill Time:</strong> ${formatTime(data.effectiveTimeToKill)}</div>
                            <div class="optimal-stat"><strong>${type}/Hour:</strong> ${formatNumber(data[`${type.toLowerCase()}PerHour`])}</div>
                            <div class="optimal-stat"><strong>Kills/Hour:</strong> ${Math.round(data.killsPerHour)}</div>
                        </div>
                    </div>`;
            } else {
                container.innerHTML = `
                    <div class="optimal-header">
                        <i class="fas fa-${type === 'XP' ? 'star' : 'coins'}"></i>
                        <span>Best ${type} Farm</span>
                    </div>
                    <div class="optimal-content">
                        <p>No farmable mobs found</p>
                    </div>`;
            }
        };

        renderOptimalCard(xpContainer, optimalXP, 'XP');
        renderOptimalCard(coinContainer, optimalCoin, 'Coins');
    }

    clearOptimalResults() {
        const xpContainer = document.getElementById('optimal-xp-farm');
        const coinContainer = document.getElementById('optimal-coin-farm');
        if (xpContainer) xpContainer.innerHTML = `
            <div class="optimal-header">
                <i class="fas fa-star"></i>
                <span>Best XP Farm</span>
            </div>
            <div class="optimal-content">
                <p>Enter DPS to see optimal XP farm</p>
            </div>`;
        if (coinContainer) coinContainer.innerHTML = `
            <div class="optimal-header">
                <i class="fas fa-coins"></i>
                <span>Best Coin Farm</span>
            </div>
            <div class="optimal-content">
                <p>Enter DPS to see optimal coin farm</p>
            </div>`;
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById(tabName)?.classList.add('active');
        document.querySelector(`.nav-link[data-tab="${tabName}"]`)?.classList.add('active');
        this.currentTab = tabName;
    }

    updateMobSelect() {
        const worldSelect = document.getElementById('farm-world-select');
        const mobSelect = document.getElementById('farm-mob-select');
        
        if (!worldSelect || !mobSelect || typeof calculator === 'undefined') return;

        const selectedWorld = worldSelect.value;
        const mobs = calculator.getMobsByWorld(selectedWorld);

        mobSelect.innerHTML = '<option value="">Auto-select best mob</option>';
        mobs.forEach(mob => {
            const option = document.createElement('option');
            option.value = mob.name;
            option.textContent = `${mob.name} (${mob.rank}) - ${formatNumber(mob.hp)} HP`;
            mobSelect.appendChild(option);
        });
        
        this.runCalculations();
    }

    updateLevelMobSelect() {
        const worldSelect = document.getElementById('level-world-select');
        const mobSelect = document.getElementById('level-mob-select');
        
        if (!worldSelect || !mobSelect || typeof calculator === 'undefined') return;

        const selectedWorld = worldSelect.value;
        
        mobSelect.innerHTML = '<option value="">Auto-select best XP mob</option>';
        
        if (selectedWorld) {
            const mobs = calculator.getMobsByWorld(selectedWorld);
            const farmableMobs = mobs.filter(mob => !mob.world.includes('Raid') && !mob.world.includes('Defense'));
            
            farmableMobs.forEach(mob => {
                const option = document.createElement('option');
                option.value = mob.name;
                option.textContent = `${mob.name} (${mob.rank})`;
                mobSelect.appendChild(option);
            });
        }
        
        this.calculateLevelProgress();
    }

    updateTimeToKillResults() {
        const worldSelect = document.getElementById('world-select');
        const resultsContainer = document.getElementById('ttk-results');

        if (!resultsContainer || !this.currentDPS || this.currentDPS <= 0) return;
        if (typeof calculator === 'undefined') {
            resultsContainer.innerHTML = `<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Calculator not loaded.</p></div>`;
            return;
        }

        const selectedWorld = worldSelect ? worldSelect.value : null;
        let results;

        if (this.selectedRaidRange) {
            results = calculator.getRaidWavesByRange(this.selectedRaidRange.raidType, this.selectedRaidRange.start, this.selectedRaidRange.end)
                .map(mob => {
                    const mobResults = calculator.calculateAllTimeToKill(this.currentDPS, null).find(m => m.name === mob.name);
                    return { ...mob, ...mobResults };
                });
        } else {
            results = calculator.calculateAllTimeToKill(this.currentDPS, selectedWorld);
        }
        this.displayTimeToKillResults(results, resultsContainer);
    }
    
    displayTimeToKillResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><p>No mobs found for the selected criteria</p></div>`;
            return;
        }
        container.innerHTML = results.map(mob => `
            <div class="mob-card ${mob.isRaid ? 'raid-mob' : ''}">
                <div class="mob-info">
                    <h4>${mob.name}</h4>
                    <div class="mob-world">${mob.world}${mob.wave ? ` - Wave ${mob.wave}` : ''}</div>
                </div>
                <div class="mob-rank ${mob.isRaid ? 'raid-rank' : ''}">${mob.rank}</div>
                <div class="mob-hp">${formatNumber(mob.hp)} HP</div>
                <div class="time-to-kill ${mob.timeCategory}">${mob.timeToKillFormatted}</div>
                <div class="effective-time">${mob.effectiveTimeFormatted}</div>
                <div class="dps-needed">${mob.dpsNeededFormatted} DPS needed</div>
            </div>`).join('');
    }

    clearTimeToKillResults() {
        const resultsContainer = document.getElementById('ttk-results');
        if (resultsContainer) resultsContainer.innerHTML = `<div class="no-results"><i class="fas fa-info-circle"></i><p>Enter your DPS to see results</p></div>`;
    }

    updateOptimalFarms(config) {
        if (config.valid && typeof calculator !== 'undefined') {
            const optimalXP = calculator.findOptimalXPFarm(config.userDPS, config.expMultiplier, config.farmType);
            const optimalCoin = calculator.findOptimalCoinFarm(config.userDPS, config.coinMultiplier, config.farmType);
            this.displayOptimalFarms(optimalXP, optimalCoin);
        } else {
            this.clearOptimalResults();
        }
    }
    
    populateDropdowns() {
        const suffixSelects = [
            document.getElementById('dps-suffix'), 
            document.getElementById('farm-dps-suffix'),
            document.getElementById('level-dps-suffix'),
            document.getElementById('current-energy-suffix'),
            document.getElementById('target-energy-suffix'),
            document.getElementById('energy-per-click-suffix')
        ];
        suffixSelects.forEach(select => {
            if (!select) return;
            select.innerHTML = '<option value="1">No Suffix</option>';
            numberSuffixes.forEach((suffix, index) => {
                const value = Math.pow(1000, index + 1);
                select.innerHTML += `<option value="${value}">${suffix}</option>`;
            });
        });

        const worldSelects = [
            document.getElementById('world-select'), 
            document.getElementById('farm-world-select'),
            document.getElementById('level-world-select')
        ];
        if (typeof allGameData !== 'undefined') {
            const uniqueWorlds = [...new Set(allGameData.map(mob => mob.world))];
            worldSelects.forEach(select => {
                if(!select) return;
                const isLevelTab = select.id === 'level-world-select';
                const defaultText = select.id === 'world-select' ? 'All Worlds' : 
                                   isLevelTab ? 'Auto-select best world' : 'All Farmable Worlds';
                select.innerHTML = `<option value="">${defaultText}</option>`;
                uniqueWorlds.forEach(world => {
                    if(!isLevelTab && select.id === 'farm-world-select' && (world.includes('Raid') || world.includes('Defense'))) return;
                    if(isLevelTab && (world.includes('Raid') || world.includes('Defense'))) return;
                    select.innerHTML += `<option value="${world}">${world}</option>`;
                });
            });
        }

        const prestigeSelects = [
            document.getElementById('level-prestige-select')
        ];
        prestigeSelects.forEach(select => {
            if (!select) return;
            select.innerHTML = '';
            Object.keys(prestigeConfig).forEach(prestige => {
                const option = document.createElement('option');
                option.value = prestige;
                option.textContent = `Prestige ${prestige} (Cap: ${prestigeConfig[prestige].levelCap}, +${((prestigeConfig[prestige].expMultiplier - 1) * 100).toFixed(0)}% XP)`;
                select.appendChild(option);
            });
        });

        // Populate rank dropdown
        const currentRankSelect = document.getElementById('current-rank');
        if (currentRankSelect && typeof rankData !== 'undefined') {
            currentRankSelect.innerHTML = '<option value="">Select Rank</option>';
            for (let i = 1; i <= 75; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Rank ${i}`;
                currentRankSelect.appendChild(option);
            }
        }

        const potionTypeSelect = document.getElementById('potion-type');
        if (potionTypeSelect && typeof energyPotions !== 'undefined') {
            potionTypeSelect.innerHTML = '';
            Object.values(energyPotions).forEach(potion => {
                const option = document.createElement('option');
                option.value = Object.keys(energyPotions).find(key => energyPotions[key] === potion);
                option.textContent = potion.name;
                potionTypeSelect.appendChild(option);
            });
        }

        const populateItemSelect = (elementId, items, valueField, nameField, bonusTextCallback) => {
            const select = document.getElementById(elementId);
            if (!select || !items) return;
            select.innerHTML = '<option value="0">None</option>';
            items.forEach(item => {
                if (item.name === 'None') return;
                const option = document.createElement('option');
                option.value = typeof valueField === 'function' ? valueField(item) : item[valueField];
                option.textContent = item[nameField] + (bonusTextCallback ? bonusTextCallback(item) : '');
                select.appendChild(option);
            });
        };

        if (typeof gameItems !== 'undefined') {
            populateItemSelect('config-aura-select', gameItems.auras, item => JSON.stringify({ coins: item.coinsMultiplier || 0, exp: item.expMultiplier || 0, souls: item.souls || 0, tokenDrops: item.tokenDrops || 0 }), 'name', item => {
                const bonuses = [];
                if (item.coinsMultiplier > 0) bonuses.push(`+${(item.coinsMultiplier * 100).toFixed(0)}% coins`);
                if (item.expMultiplier > 0) bonuses.push(`+${(item.expMultiplier * 100).toFixed(0)}% exp`);
                if (item.souls > 0) bonuses.push(`+${(item.souls * 100).toFixed(0)}% souls`);
                if (item.tokenDrops > 0) bonuses.push(`+${(item.tokenDrops * 100).toFixed(0)}% token drops`);
                return bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
            });
            populateItemSelect('config-ring-select', gameItems.jewelry.rings, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}% coins)` : '');
            populateItemSelect('config-necklace-select', gameItems.jewelry.necklaces, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}% coins)` : '');
            populateItemSelect('config-earrings-select', gameItems.jewelry.earrings, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}% coins)` : '');
            populateItemSelect('config-hat-select', gameItems.accessories.hats, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins} base coins)` : '');
            populateItemSelect('config-scarf-select', gameItems.accessories.scarfs, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins} base coins)` : '');
            populateItemSelect('config-mask-select', gameItems.accessories.masks, item => JSON.stringify({ coins: item.baseCoins, exp: item.expPercentage }), 'name', item => {
                const bonuses = [];
                if (item.baseCoins > 0) bonuses.push(`+${item.baseCoins} coins`);
                if (item.expPercentage > 0) bonuses.push(`+${item.expPercentage}% exp`);
                return bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
            });
            populateItemSelect('config-cloak-select', gameItems.accessories.cloaks, item => JSON.stringify({ exp: item.expPercentage }), 'name', item => item.expPercentage > 0 ? ` (+${item.expPercentage}% exp)` : '');
            populateItemSelect('config-fruit-select', gameItems.powers.demonFruits, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins} base coins)` : '');
            populateItemSelect('config-eyes-select', gameItems.powers.powerEyes, item => JSON.stringify({ coins: item.coinsMultiplier, exp: 0 }), 'name', item => item.coinsMultiplier > 0 ? ` (+${(item.coinsMultiplier * 100).toFixed(0)}% coins)` : '');
            populateItemSelect('config-virtue-select', gameItems.powers.virtues, item => JSON.stringify({ coins: item.coinsMultiplier, exp: 0 }), 'name', item => item.coinsMultiplier > 0 ? ` (+${(item.coinsMultiplier * 100).toFixed(0)}% coins)` : '');
        }
    }

    onWorldSelectionChange() {
        const worldSelect = document.getElementById('world-select');
        const raidRanges = document.getElementById('raid-ranges');
        if (worldSelect && raidRanges) {
            const selectedWorld = worldSelect.value;
            if (selectedWorld === 'Leaf Raid' || selectedWorld === 'Titan Defense') {
                raidRanges.style.display = 'block';
                this.setupRaidRanges(selectedWorld);
            } else {
                raidRanges.style.display = 'none';
                this.selectedRaidRange = null;
            }
        }
        this.updateTimeToKillResults();
    }

    setupRaidRanges(raidType) {
        const container = document.getElementById('raid-range-buttons');
        if (!container || typeof calculator === 'undefined') return;
        
        const maxWaves = 2000;
        const ranges = calculator.generateRaidWaveRanges(raidType, maxWaves);
        container.innerHTML = '';
        
        ranges.forEach(range => {
            const button = document.createElement('button');
            button.className = 'btn btn-tertiary raid-range-btn';
            button.textContent = range.label;
            button.addEventListener('click', () => {
                document.querySelectorAll('.raid-range-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.selectedRaidRange = range;
                this.updateTimeToKillResults();
            });
            container.appendChild(button);
        });

        if(container.firstChild){
            container.firstChild.click();
        }
    }

    syncDPSInputs() {
        const dpsInput = document.getElementById('dps-input');
        const dpsSuffix = document.getElementById('dps-suffix');
        const farmDpsInput = document.getElementById('farm-dps-input');
        const farmDpsSuffix = document.getElementById('farm-dps-suffix');
        const levelDpsInput = document.getElementById('level-dps-input');
        const levelDpsSuffix = document.getElementById('level-dps-suffix');

        const sync = (source, targets) => {
            targets.forEach(target => {
                if (target && target !== source) target.value = source.value;
            });
        };

        [dpsInput, farmDpsInput, levelDpsInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    sync(input, [dpsInput, farmDpsInput, levelDpsInput]);
                    this.onDPSChange();
                    this.runCalculations();
                    this.calculateLevelProgress();
                });
            }
        });

        [dpsSuffix, farmDpsSuffix, levelDpsSuffix].forEach(suffix => {
            if (suffix) {
                suffix.addEventListener('change', () => {
                    sync(suffix, [dpsSuffix, farmDpsSuffix, levelDpsSuffix]);
                    this.onDPSChange();
                    this.runCalculations();
                    this.calculateLevelProgress();
                });
            }
        });
    }

    generateShareUrl(tabName = null) {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        if (tabName) {
            params.set('tab', tabName);
        }
        
        const currentTab = tabName || this.currentTab;
        
        switch (currentTab) {
            case 'time-to-kill':
                this.addTimeToKillParams(params);
                break;
            case 'loot-calculator':
                this.addLootCalculatorParams(params);
                break;
            case 'level-progression':
                this.addLevelProgressParams(params);
                break;
            case 'rank-up':
                this.addRankUpParams(params);
                break;
        }
        
        const paramString = params.toString();
        return paramString ? `${baseUrl}?${paramString}` : baseUrl;
    }

    addTimeToKillParams(params) {
        const dps = document.getElementById('dps-input')?.value;
        const dpsSuffix = document.getElementById('dps-suffix')?.value;
        const world = document.getElementById('world-select')?.value;
        
        if (dps) params.set('dps', dps);
        if (dpsSuffix && dpsSuffix !== '1') params.set('dps_suffix', dpsSuffix);
        if (world) params.set('world', world);
    }

    addLootCalculatorParams(params) {
        const dps = document.getElementById('farm-dps-input')?.value;
        const dpsSuffix = document.getElementById('farm-dps-suffix')?.value;
        const hours = document.getElementById('farm-hours')?.value;
        const minutes = document.getElementById('farm-minutes')?.value;
        const farmType = document.querySelector('input[name="farm-type"]:checked')?.value;
        const world = document.getElementById('farm-world-select')?.value;
        const mob = document.getElementById('farm-mob-select')?.value;
        
        if (dps) params.set('dps', dps);
        if (dpsSuffix && dpsSuffix !== '1') params.set('dps_suffix', dpsSuffix);
        if (hours && hours !== '1') params.set('hours', hours);
        if (minutes && minutes !== '0') params.set('minutes', minutes);
        if (farmType && farmType !== '3') params.set('farm_type', farmType);
        if (world) params.set('world', world);
        if (mob) params.set('mob', mob);
    }

    addLevelProgressParams(params) {
        const dps = document.getElementById('level-dps-input')?.value;
        const dpsSuffix = document.getElementById('level-dps-suffix')?.value;
        const currentLevel = document.getElementById('level-current-level')?.value;
        const targetLevel = document.getElementById('level-target-level')?.value;
        const currentXp = document.getElementById('level-current-xp')?.value;
        const prestige = document.getElementById('level-prestige-select')?.value;
        const farmType = document.querySelector('input[name="level-farm-type"]:checked')?.value;
        
        if (dps) params.set('dps', dps);
        if (dpsSuffix && dpsSuffix !== '1') params.set('dps_suffix', dpsSuffix);
        if (currentLevel) params.set('current_level', currentLevel);
        if (targetLevel) params.set('target_level', targetLevel);
        if (currentXp && currentXp !== '0') params.set('current_xp', currentXp);
        if (prestige && prestige !== '0') params.set('prestige', prestige);
        if (farmType && farmType !== '3') params.set('farm_type', farmType);
    }

    addRankUpParams(params) {
        const rank = document.getElementById('current-rank')?.value;
        const energy = document.getElementById('current-energy')?.value;
        const energySuffix = document.getElementById('current-energy-suffix')?.value;
        const epc = document.getElementById('energy-per-click')?.value;
        const epcSuffix = document.getElementById('energy-per-click-suffix')?.value;
        const clickingMethod = document.querySelector('input[name="clicking-method"]:checked')?.value;
        const clickerSpeed = document.getElementById('clicker-speed')?.value;
        
        if (rank) params.set('rank', rank);
        if (energy) params.set('energy', energy);
        if (energySuffix && energySuffix !== '1') params.set('energy_suffix', energySuffix);
        if (epc) params.set('epc', epc);
        if (epcSuffix && epcSuffix !== '1') params.set('epc_suffix', epcSuffix);
        if (clickingMethod && clickingMethod !== 'slow') params.set('clicking', clickingMethod);
        if (clickingMethod === 'fast' && clickerSpeed && clickerSpeed !== '5.0') params.set('clicker_speed', clickerSpeed);
    }

    copyShareUrl() {
        const url = this.generateShareUrl();
        
        try {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('URL Copied', 'Share URL copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(url);
            });
        } catch (error) {
            this.fallbackCopyTextToClipboard(url);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('URL Copied', 'Share URL copied to clipboard!', 'success');
        } catch (error) {
            this.showNotification('Copy Failed', 'Unable to copy URL', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    init() {
        this.setupEventListeners();
        this.populateDropdowns();
        this.showTab('home');
        this.syncDPSInputs();
        this.updateMobSelect();
        this.updateLevelMobSelect();
        this.updateClickerSpeedDisplay();
        this.setupConfigEventListeners();
        
        setTimeout(() => {
            this.applyConfigToUI();
            this.updateMultiplierDisplays();
            this.updateLootCalculatorConfig();
            this.updateLevelCalculatorConfig();
        }, 100);
        
        if (window.location.search) {
            this.loadFromUrl();
        }
    }

    loadFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const tab = urlParams.get('tab');
        if (tab && ['time-to-kill', 'loot-calculator', 'level-progression', 'rank-up'].includes(tab)) {
            this.showTab(tab);
        }
        
        setTimeout(() => {
            this.loadParametersFromUrl(urlParams);
        }, 100);
    }

    loadParametersFromUrl(params) {
        const tab = params.get('tab') || this.currentTab;
        
        switch (tab) {
            case 'time-to-kill':
                this.loadTimeToKillFromUrl(params);
                break;
            case 'loot-calculator':
                this.loadLootCalculatorFromUrl(params);
                break;
            case 'level-progression':
                this.loadLevelProgressFromUrl(params);
                break;
            case 'rank-up':
                this.loadRankUpFromUrl(params);
                break;
        }
    }

    loadTimeToKillFromUrl(params) {
        const dps = params.get('dps');
        const dpsSuffix = params.get('dps_suffix');
        const world = params.get('world');
        
        if (dps) document.getElementById('dps-input').value = dps;
        if (dpsSuffix) document.getElementById('dps-suffix').value = dpsSuffix;
        if (world) document.getElementById('world-select').value = world;
        
        if (dps) this.onDPSChange();
    }

    loadLootCalculatorFromUrl(params) {
        const dps = params.get('dps');
        const dpsSuffix = params.get('dps_suffix');
        const hours = params.get('hours');
        const minutes = params.get('minutes');
        const farmType = params.get('farm_type');
        const world = params.get('world');
        const mob = params.get('mob');
        
        if (dps) document.getElementById('farm-dps-input').value = dps;
        if (dpsSuffix) document.getElementById('farm-dps-suffix').value = dpsSuffix;
        if (hours) document.getElementById('farm-hours').value = hours;
        if (minutes) document.getElementById('farm-minutes').value = minutes;
        if (farmType) {
            const farmRadio = document.querySelector(`input[name="farm-type"][value="${farmType}"]`);
            if (farmRadio) farmRadio.checked = true;
        }
        if (world) document.getElementById('farm-world-select').value = world;
        if (mob) document.getElementById('farm-mob-select').value = mob;
        
        if (dps) this.runCalculations();
    }

    loadLevelProgressFromUrl(params) {
        const dps = params.get('dps');
        const dpsSuffix = params.get('dps_suffix');
        const currentLevel = params.get('current_level');
        const targetLevel = params.get('target_level');
        const currentXp = params.get('current_xp');
        const prestige = params.get('prestige');
        const farmType = params.get('farm_type');
        
        if (dps) document.getElementById('level-dps-input').value = dps;
        if (dpsSuffix) document.getElementById('level-dps-suffix').value = dpsSuffix;
        if (currentLevel) document.getElementById('level-current-level').value = currentLevel;
        if (targetLevel) document.getElementById('level-target-level').value = targetLevel;
        if (currentXp) document.getElementById('level-current-xp').value = currentXp;
        if (prestige) document.getElementById('level-prestige-select').value = prestige;
        if (farmType) {
            const farmRadio = document.querySelector(`input[name="level-farm-type"][value="${farmType}"]`);
            if (farmRadio) farmRadio.checked = true;
        }
        
        if (dps && currentLevel && targetLevel) this.calculateLevelProgress();
    }

    loadRankUpFromUrl(params) {
        const rank = params.get('rank');
        const energy = params.get('energy');
        const energySuffix = params.get('energy_suffix');
        const epc = params.get('epc');
        const epcSuffix = params.get('epc_suffix');
        const clicking = params.get('clicking');
        const clickerSpeed = params.get('clicker_speed');
        
        if (rank) document.getElementById('current-rank').value = rank;
        if (energy) document.getElementById('current-energy').value = energy;
        if (energySuffix) document.getElementById('current-energy-suffix').value = energySuffix;
        if (epc) document.getElementById('energy-per-click').value = epc;
        if (epcSuffix) document.getElementById('energy-per-click-suffix').value = epcSuffix;
        if (clicking) {
            const clickingRadio = document.querySelector(`input[name="clicking-method"][value="${clicking}"]`);
            if (clickingRadio) clickingRadio.checked = true;
        }
        if (clickerSpeed) document.getElementById('clicker-speed').value = clickerSpeed;
        
        if (rank && epc) this.calculateRankUpTime();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link, [data-tab]:not(.nav-link)').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTab(link.getAttribute('data-tab'));
            });
        });

        document.getElementById('dps-input')?.addEventListener('input', () => this.onDPSChange());
        document.getElementById('dps-suffix')?.addEventListener('change', () => this.onDPSChange());
        
        const farmInputs = ['farm-dps-input', 'farm-dps-suffix', 'farm-hours', 'farm-minutes', 'farm-mob-select'];
        farmInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.runCalculations());
            document.getElementById(id)?.addEventListener('change', () => this.runCalculations());
        });

        document.querySelectorAll('input[name="farm-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.runCalculations());
        });

        const levelInputs = [
            'level-current-level', 'level-target-level', 'level-current-xp', 'level-prestige-select', 
            'level-mob-select', 'level-dps-input', 'level-dps-suffix'
        ];
        levelInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculateLevelProgress());
                element.addEventListener('change', () => this.calculateLevelProgress());
            }
        });

        document.querySelectorAll('input[name="level-farm-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.calculateLevelProgress());
        });

        const rankInputs = [
            'current-rank', 'energy-per-click', 'energy-per-click-suffix', 'current-energy', 
            'current-energy-suffix', 'target-energy', 'target-energy-suffix', 'potion-type',
            'potion-days', 'potion-hours', 'potion-minutes', 'clicker-speed'
        ];
        rankInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculateRankUpTime());
                element.addEventListener('change', () => this.calculateRankUpTime());
            }
        });

        document.querySelectorAll('input[name="clicking-method"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleClickingMethod());
        });

        document.getElementById('clicker-speed')?.addEventListener('input', () => {
            this.updateClickerSpeedDisplay();
            this.calculateRankUpTime();
        });

        document.getElementById('current-rank')?.addEventListener('change', () => {
            this.updateNextRankDisplay();
            this.calculateRankUpTime();
        });

        document.getElementById('potion-type')?.addEventListener('change', () => {
            this.togglePotionDuration();
            this.calculateRankUpTime();
        });

        document.getElementById('farm-world-select')?.addEventListener('change', () => this.updateMobSelect());
        document.getElementById('level-world-select')?.addEventListener('change', () => this.updateLevelMobSelect());
        document.getElementById('world-select')?.addEventListener('change', () => this.onWorldSelectionChange());
        
        document.querySelector('.mobile-menu')?.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.toggle('active');
        });
    }

    cleanup() {
        if (this.rankUpTimer) {
            clearInterval(this.rankUpTimer);
        }
        if (this.levelProgressTimer) {
            clearInterval(this.levelProgressTimer);
        }
        this.notificationTimers.forEach(timer => clearInterval(timer));
        this.notificationTimers.clear();
    }
}

function closeScreenshotModal() {
    if (window.app) {
        window.app.closeScreenshotModal();
    }
}

function downloadScreenshot() {
    if (window.app) {
        window.app.downloadScreenshot();
    }
}

function copyScreenshotToClipboard() {
    if (window.app) {
        window.app.copyScreenshotToClipboard();
    }
}

function copyShareUrl() {
    if (window.app) {
        window.app.copyShareUrl();
    }
}

function takeScreenshot(tabName) {
    if (window.app) {
        window.app.takeScreenshot(tabName);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new AnimeEternalApp();
    
    window.addEventListener('beforeunload', () => {
        window.app.cleanup();
    });
});

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

