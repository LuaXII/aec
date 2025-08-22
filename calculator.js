class AnimeEternalCalculator {
    constructor() {
        this.gameData = allGameData || [];
        this.attackSpeed = ATTACK_SPEED || 6.6;
        this.respawnTime = MOB_RESPAWN_TIME || 2;
        this.calculationCache = new Map();
        this.lastCalculationTime = 0;
        this.maxCacheSize = 1000;
        this.cacheExpiryTime = 5 * 60 * 1000;
        
        if (!this.gameData.length) {
            console.warn('AnimeEternalCalculator: Game data not loaded');
        }
    }

    calculateTimeToKill(userDPS, mobHP, useCache = true) {
        if (typeof userDPS !== 'number' || typeof mobHP !== 'number') {
            console.error('calculateTimeToKill: Invalid input types');
            return Infinity;
        }
        
        if (userDPS <= 0) return Infinity;
        if (mobHP <= 0) return 0;
        
        const cacheKey = `ttk_${userDPS}_${mobHP}`;
        
        if (useCache && this.calculationCache.has(cacheKey)) {
            const cachedResult = this.calculationCache.get(cacheKey);
            if (Date.now() - cachedResult.timestamp < this.cacheExpiryTime) {
                return cachedResult.value;
            } else {
                this.calculationCache.delete(cacheKey);
            }
        }
        
        try {
            const damagePerHit = userDPS / this.attackSpeed;
            const hitsNeeded = Math.ceil(mobHP / damagePerHit);
            const timeToKill = hitsNeeded / this.attackSpeed;
            
            if (useCache) {
                if (this.calculationCache.size >= this.maxCacheSize) {
                    const oldestKey = this.calculationCache.keys().next().value;
                    this.calculationCache.delete(oldestKey);
                }
                
                this.calculationCache.set(cacheKey, {
                    value: timeToKill,
                    timestamp: Date.now()
                });
            }
            
            return timeToKill;
        } catch (error) {
            console.error('Error in calculateTimeToKill:', error);
            return Infinity;
        }
    }

    calculateEffectiveTimeToKill(userDPS, mobHP) {
        try {
            const killTime = this.calculateTimeToKill(userDPS, mobHP);
            return killTime === Infinity ? Infinity : killTime + this.respawnTime;
        } catch (error) {
            console.error('Error in calculateEffectiveTimeToKill:', error);
            return Infinity;
        }
    }

    calculateKillsPerHour(userDPS, mobHP) {
        try {
            const effectiveTime = this.calculateEffectiveTimeToKill(userDPS, mobHP);
            if (effectiveTime === Infinity || effectiveTime <= 0) return 0;
            return 3600 / effectiveTime;
        } catch (error) {
            console.error('Error in calculateKillsPerHour:', error);
            return 0;
        }
    }

    calculateDPSNeededForInstantKill(mobHP) {
        try {
            if (typeof mobHP !== 'number' || mobHP <= 0) return 0;
            return mobHP * this.attackSpeed;
        } catch (error) {
            console.error('Error in calculateDPSNeededForInstantKill:', error);
            return 0;
        }
    }

    calculateHitsToKill(userDPS, mobHP) {
        try {
            if (userDPS <= 0 || mobHP <= 0) return 0;
            
            const damagePerHit = userDPS / this.attackSpeed;
            return Math.ceil(mobHP / damagePerHit);
        } catch (error) {
            console.error('Error in calculateHitsToKill:', error);
            return Infinity;
        }
    }

    getMobsByWorld(worldName) {
        try {
            if (!worldName) return this.gameData;
            return this.gameData.filter(mob => mob && mob.world === worldName);
        } catch (error) {
            console.error('Error in getMobsByWorld:', error);
            return [];
        }
    }

    isDungeon(worldName) {
        try {
            return worldName && (worldName.includes('Dungeon') || worldName.includes('Raid') || worldName.includes('Defense'));
        } catch (error) {
            console.error('Error in isDungeon:', error);
            return false;
        }
    }

    calculateAllTimeToKill(userDPS, selectedWorld = null) {
        try {
            if (typeof userDPS !== 'number' || userDPS <= 0) {
                console.warn('calculateAllTimeToKill: Invalid DPS value');
                return [];
            }

            const mobs = this.getMobsByWorld(selectedWorld);
            if (!mobs.length) {
                console.warn('calculateAllTimeToKill: No mobs found for world:', selectedWorld);
                return [];
            }
            
            return mobs.map(mob => {
                try {
                    if (!mob || typeof mob.hp !== 'number') {
                        console.warn('Invalid mob data:', mob);
                        return null;
                    }

                    const timeToKill = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTimeToKill = this.calculateEffectiveTimeToKill(userDPS, mob.hp);
                    const hitsNeeded = this.calculateHitsToKill(userDPS, mob.hp);
                    const dpsNeededForInstantKill = this.calculateDPSNeededForInstantKill(mob.hp);
                    const killsPerHour = this.calculateKillsPerHour(userDPS, mob.hp);
                    
                    const efficiency = this.analyzeMobEfficiency(userDPS, mob);
                    
                    return {
                        ...mob,
                        timeToKill: timeToKill,
                        effectiveTimeToKill: effectiveTimeToKill,
                        timeToKillFormatted: formatTime(timeToKill),
                        effectiveTimeFormatted: formatTime(effectiveTimeToKill),
                        timeCategory: getTimeCategory(timeToKill),
                        hitsNeeded: hitsNeeded,
                        dpsNeeded: dpsNeededForInstantKill,
                        dpsNeededFormatted: formatNumber(dpsNeededForInstantKill),
                        killsPerHour: killsPerHour,
                        isDungeon: this.isDungeon(mob.world),
                        efficiency: efficiency
                    };
                } catch (error) {
                    console.error('Error processing mob:', mob.name, error);
                    return null;
                }
            }).filter(result => result !== null);
        } catch (error) {
            console.error('Error in calculateAllTimeToKill:', error);
            return [];
        }
    }

    analyzeMobEfficiency(userDPS, mob) {
        try {
            if (!mob || typeof mob.hp !== 'number') {
                return {
                    category: 'impossible',
                    recommendation: 'Invalid mob data',
                    farmable: false
                };
            }

            const timeToKill = this.calculateTimeToKill(userDPS, mob.hp);
            const effectiveTime = timeToKill + this.respawnTime;
            
            let category = 'poor';
            let recommendation = '';
            
            if (timeToKill === Infinity) {
                category = 'impossible';
                recommendation = 'Cannot kill this mob with current DPS';
            } else if (timeToKill <= 0.2) {
                category = 'excellent';
                recommendation = 'Perfect for farming - instant kill';
            } else if (effectiveTime <= 10) {
                category = 'very-good';
                recommendation = 'Great farming efficiency';
            } else if (effectiveTime <= 30) {
                category = 'good';
                recommendation = 'Good farming option';
            } else if (effectiveTime <= 120) {
                category = 'fair';
                recommendation = 'Acceptable for farming';
            } else if (effectiveTime <= 300) {
                category = 'poor';
                recommendation = 'Slow farming - consider stronger mobs if available';
            } else {
                category = 'very-poor';
                recommendation = 'Too slow for efficient farming';
            }
            
            return {
                category: category,
                recommendation: recommendation,
                farmable: effectiveTime <= 300 && timeToKill !== Infinity
            };
        } catch (error) {
            console.error('Error in analyzeMobEfficiency:', error);
            return {
                category: 'impossible',
                recommendation: 'Error analyzing efficiency',
                farmable: false
            };
        }
    }

    findOptimalXPFarm(userDPS, xpMultiplier = 1, farmType = 3) {
        try {
            if (typeof userDPS !== 'number' || userDPS <= 0) {
                console.warn('findOptimalXPFarm: Invalid DPS value');
                return null;
            }
            
            if (typeof xpMultiplier !== 'number' || xpMultiplier <= 0) {
                xpMultiplier = 1;
            }

            const farmableMobs = this.gameData.filter(mob => {
                try {
                    if (!mob || typeof mob.hp !== 'number' || typeof mob.exp !== 'number') {
                        return false;
                    }
                    
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    
                    return effectiveTime <= 300 && 
                           killTime !== Infinity && 
                           !mob.world.includes('Raid') && 
                           !mob.world.includes('Defense');
                } catch (error) {
                    console.warn('Error filtering mob for XP farm:', mob?.name, error);
                    return false;
                }
            });

            if (farmableMobs.length === 0) {
                console.info('No farmable mobs found for DPS:', userDPS);
                return null;
            }

            let bestMob = null;
            let bestXPPerSecond = 0;

            farmableMobs.forEach(mob => {
                try {
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    const farmMultiplier = mob.rank === 'SS' ? 1 : parseInt(farmType) || 3;
                    const xpPerSecond = (mob.exp * xpMultiplier * farmMultiplier) / effectiveTime;
                    
                    if (xpPerSecond > bestXPPerSecond) {
                        bestXPPerSecond = xpPerSecond;
                        bestMob = {
                            ...mob,
                            timeToKill: killTime,
                            effectiveTimeToKill: effectiveTime,
                            xpPerSecond,
                            xpPerHour: xpPerSecond * 3600,
                            killsPerHour: (3600 / effectiveTime) * farmMultiplier,
                            farmMultiplier,
                            efficiency: this.analyzeMobEfficiency(userDPS, mob)
                        };
                    }
                } catch (error) {
                    console.warn('Error calculating XP for mob:', mob.name, error);
                }
            });

            return bestMob;
        } catch (error) {
            console.error('Error in findOptimalXPFarm:', error);
            return null;
        }
    }

    findOptimalCoinFarm(userDPS, coinMultiplier = 1, farmType = 3) {
        try {
            if (typeof userDPS !== 'number' || userDPS <= 0) {
                console.warn('findOptimalCoinFarm: Invalid DPS value');
                return null;
            }
            
            if (typeof coinMultiplier !== 'number' || coinMultiplier <= 0) {
                coinMultiplier = 1;
            }

            const farmableMobs = this.gameData.filter(mob => {
                try {
                    if (!mob || typeof mob.hp !== 'number' || typeof mob.coins !== 'number') {
                        return false;
                    }
                    
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    
                    return effectiveTime <= 300 && 
                           killTime !== Infinity && 
                           !mob.world.includes('Raid') && 
                           !mob.world.includes('Defense');
                } catch (error) {
                    console.warn('Error filtering mob for coin farm:', mob?.name, error);
                    return false;
                }
            });

            if (farmableMobs.length === 0) {
                console.info('No farmable mobs found for DPS:', userDPS);
                return null;
            }

            let bestMob = null;
            let bestCoinsPerSecond = 0;

            farmableMobs.forEach(mob => {
                try {
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    const farmMultiplier = mob.rank === 'SS' ? 1 : parseInt(farmType) || 3;
                    const coinsPerSecond = (mob.coins * coinMultiplier * farmMultiplier) / effectiveTime;
                    
                    if (coinsPerSecond > bestCoinsPerSecond) {
                        bestCoinsPerSecond = coinsPerSecond;
                        bestMob = {
                            ...mob,
                            timeToKill: killTime,
                            effectiveTimeToKill: effectiveTime,
                            coinsPerSecond,
                            coinsPerHour: coinsPerSecond * 3600,
                            killsPerHour: (3600 / effectiveTime) * farmMultiplier,
                            farmMultiplier,
                            efficiency: this.analyzeMobEfficiency(userDPS, mob)
                        };
                    }
                } catch (error) {
                    console.warn('Error calculating coins for mob:', mob.name, error);
                }
            });

            return bestMob;
        } catch (error) {
            console.error('Error in findOptimalCoinFarm:', error);
            return null;
        }
    }

    calculateFarmingEfficiency(config) {
        try {
            if (!config || typeof config !== 'object') {
                return { valid: false, error: "Invalid configuration object" };
            }

            const {
                userDPS,
                selectedMob,
                farmingHours = 1,
                expMultiplier = 1,
                coinMultiplier = 1,
                soulsMultiplier = 1,
                baseCoinsBonus = 0,
                farmType = 3,
                upgradeDropsMultiplier = 1,
                avatarSoulsUpgradeMultiplier = 1
            } = config;

            if (typeof userDPS !== 'number' || userDPS <= 0) {
                return { valid: false, error: "Invalid DPS value" };
            }

            if (!selectedMob || typeof selectedMob !== 'string') {
                return { valid: false, error: "Invalid mob selection" };
            }

            if (typeof farmingHours !== 'number' || farmingHours <= 0) {
                return { valid: false, error: "Invalid farming hours" };
            }

            const mobData = this.gameData.find(mob => mob && mob.name === selectedMob);
            if (!mobData) {
                return { valid: false, error: "Mob not found in database" };
            }

            if (typeof mobData.hp !== 'number' || typeof mobData.exp !== 'number' || typeof mobData.coins !== 'number') {
                return { valid: false, error: "Invalid mob data" };
            }

            const baseTimeToKill = this.calculateTimeToKill(userDPS, mobData.hp);
            const effectiveTimePerKill = baseTimeToKill + this.respawnTime;
            
            if (baseTimeToKill === Infinity) {
                return {
                    valid: false,
                    error: "Cannot kill this mob with current DPS",
                    mobData,
                    timePerKill: baseTimeToKill,
                    viable: false
                };
            }

            if (baseTimeToKill > 3600) {
                return {
                    valid: false,
                    error: "Takes too long to kill - farming not viable",
                    mobData,
                    timePerKill: baseTimeToKill,
                    viable: false
                };
            }

            const mobsPerFarm = mobData.rank === 'SS' ? 1 : Math.max(1, parseInt(farmType) || 3);
            const killsPerHour = (3600 / effectiveTimePerKill) * mobsPerFarm;
            const totalKills = killsPerHour * farmingHours;

            const baseCoinsPerKill = Math.max(0, (mobData.coins || 0) + (baseCoinsBonus || 0));
            const baseExpPerKill = mobData.exp || 0;

            const totalExp = totalKills * baseExpPerKill * Math.max(0, expMultiplier);
            const totalCoins = totalKills * baseCoinsPerKill * Math.max(0, coinMultiplier);

            const tokenDrops = this.calculateTokenDrops(totalKills, upgradeDropsMultiplier);
            const soulDrops = this.calculateAvatarSoulDrops(totalKills, soulsMultiplier, avatarSoulsUpgradeMultiplier);

            const expPerHour = totalExp / farmingHours;
            const coinsPerHour = totalCoins / farmingHours;
            const tokensPerHour = {
                min: tokenDrops.min / farmingHours,
                max: tokenDrops.max / farmingHours,
                average: tokenDrops.average / farmingHours
            };
            const soulsPerHour = {
                min: soulDrops.min / farmingHours,
                max: soulDrops.max / farmingHours,
                average: soulDrops.average / farmingHours
            };

            const efficiency = this.analyzeMobEfficiency(userDPS, mobData);
            const optimization = this.generateOptimizationSuggestions(userDPS, mobData, config);

            return {
                valid: true,
                mobData,
                timePerKill: baseTimeToKill,
                effectiveTimePerKill: effectiveTimePerKill,
                killsPerHour,
                totalKills,
                farmingHours,
                farmType: mobData.rank === 'SS' ? 'Single (SS Rank)' : `${mobsPerFarm} Mob Farm`,
                viable: true,
                efficiency,
                optimization,
                totals: {
                    exp: totalExp,
                    coins: totalCoins,
                    tokens: tokenDrops,
                    souls: soulDrops
                },
                perHour: {
                    exp: expPerHour,
                    coins: coinsPerHour,
                    tokens: tokensPerHour,
                    souls: soulsPerHour
                },
                multipliers: {
                    exp: expMultiplier,
                    coins: coinMultiplier,
                    souls: soulsMultiplier,
                    baseCoins: baseCoinsBonus,
                    upgradeDrops: upgradeDropsMultiplier,
                    avatarSoulsUpgrade: avatarSoulsUpgradeMultiplier
                }
            };
        } catch (error) {
            console.error('Error in calculateFarmingEfficiency:', error);
            return {
                valid: false,
                error: "Calculation error: " + error.message,
                viable: false
            };
        }
    }

    generateOptimizationSuggestions(userDPS, mobData, config) {
        const suggestions = [];
        
        try {
            if (!mobData || typeof userDPS !== 'number' || !config) {
                return suggestions;
            }

            const timeToKill = this.calculateTimeToKill(userDPS, mobData.hp);
            const effectiveTime = timeToKill + this.respawnTime;
            
            const dpsForInstantKill = this.calculateDPSNeededForInstantKill(mobData.hp);
            
            if (dpsForInstantKill > 0 && userDPS > 0) {
                const dpsMultiplierNeeded = dpsForInstantKill / userDPS;
                
                if (dpsMultiplierNeeded <= 2) {
                    suggestions.push({
                        type: 'dps',
                        priority: 'high',
                        message: `You're close to instant-killing this mob! You need ${dpsMultiplierNeeded.toFixed(1)}x more DPS.`
                    });
                } else if (dpsMultiplierNeeded <= 10) {
                    suggestions.push({
                        type: 'dps',
                        priority: 'medium',
                        message: `Consider upgrading your DPS. You need ${dpsMultiplierNeeded.toFixed(1)}x more DPS for instant kills.`
                    });
                }
            }
            
            if (mobData.rank !== 'SS' && config.farmType === '3') {
                const improvement = ((4 - 3) / 3) * 100;
                suggestions.push({
                    type: 'farm',
                    priority: 'medium',
                    message: `Switch to 4-mob farm for ${improvement.toFixed(0)}% more rewards per hour.`
                });
            }
            
            if (effectiveTime > 60) {
                suggestions.push({
                    type: 'efficiency',
                    priority: 'low',
                    message: 'This mob takes a while to kill. Consider farming weaker mobs for better efficiency.'
                });
            }
            
            const betterAlternatives = this.findBetterAlternatives(userDPS, mobData, config);
            if (betterAlternatives.length > 0) {
                suggestions.push({
                    type: 'alternative',
                    priority: 'medium',
                    message: `Consider farming ${betterAlternatives[0].name} for better efficiency.`,
                    alternatives: betterAlternatives
                });
            }
        } catch (error) {
            console.error('Error generating optimization suggestions:', error);
            suggestions.push({
                type: 'error',
                priority: 'low',
                message: 'Unable to generate optimization suggestions'
            });
        }
        
        return suggestions;
    }

    findBetterAlternatives(userDPS, currentMob, config) {
        try {
            if (!currentMob || typeof userDPS !== 'number' || !config) {
                return [];
            }

            const currentEfficiency = this.calculateMobEfficiencyScore(userDPS, currentMob, config);
            
            return this.gameData
                .filter(mob => {
                    try {
                        if (!mob || mob.world.includes('Raid') || mob.world.includes('Defense')) {
                            return false;
                        }
                        
                        const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                        const effectiveTime = killTime + this.respawnTime;
                        return effectiveTime <= 300 && mob.name !== currentMob.name && killTime !== Infinity;
                    } catch (error) {
                        console.warn('Error filtering alternative mob:', mob?.name, error);
                        return false;
                    }
                })
                .map(mob => {
                    try {
                        return {
                            ...mob,
                            efficiencyScore: this.calculateMobEfficiencyScore(userDPS, mob, config)
                        };
                    } catch (error) {
                        console.warn('Error calculating efficiency for mob:', mob?.name, error);
                        return null;
                    }
                })
                .filter(mob => mob !== null && mob.efficiencyScore > currentEfficiency * 1.2)
                .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
                .slice(0, 3);
        } catch (error) {
            console.error('Error finding better alternatives:', error);
            return [];
        }
    }

    calculateMobEfficiencyScore(userDPS, mob, config) {
        try {
            if (!mob || typeof userDPS !== 'number' || !config) {
                return 0;
            }

            const killTime = this.calculateTimeToKill(userDPS, mob.hp);
            const effectiveTime = killTime + this.respawnTime;
            
            if (effectiveTime > 300 || killTime === Infinity) {
                return 0;
            }
            
            const farmMultiplier = mob.rank === 'SS' ? 1 : parseInt(config.farmType || 3);
            const xpPerSecond = (mob.exp * (config.expMultiplier || 1) * farmMultiplier) / effectiveTime;
            const coinsPerSecond = (mob.coins * (config.coinMultiplier || 1) * farmMultiplier) / effectiveTime;
            
            return (xpPerSecond * 0.7) + (coinsPerSecond * 0.3 / 1000);
        } catch (error) {
            console.error('Error calculating mob efficiency score:', error);
            return 0;
        }
    }

    calculateTokenDrops(totalKills, upgradeDropsMultiplier = 1) {
        try {
            if (typeof totalKills !== 'number' || totalKills < 0) {
                console.warn('calculateTokenDrops: Invalid totalKills value');
                return { min: 0, max: 0, average: 0 };
            }

            if (typeof upgradeDropsMultiplier !== 'number' || upgradeDropsMultiplier < 0) {
                upgradeDropsMultiplier = 1;
            }

            if (typeof dropRates === 'undefined' || !dropRates.tokens) {
                console.error('Drop rates data not available for tokens');
                return { min: 0, max: 0, average: 0 };
            }

            const { min = 1, max = 5, average = 3, baseChance = 0.1 } = dropRates.tokens;
            
            if (typeof baseChance !== 'number' || baseChance < 0 || baseChance > 1) {
                console.warn('Invalid base chance for token drops');
                return { min: 0, max: 0, average: 0 };
            }

            const expectedDrops = totalKills * baseChance;
            
            return {
                min: Math.max(0, Math.floor(expectedDrops * min * upgradeDropsMultiplier)),
                max: Math.max(0, Math.ceil(expectedDrops * max * upgradeDropsMultiplier)),
                average: Math.max(0, Math.round(expectedDrops * average * upgradeDropsMultiplier))
            };
        } catch (error) {
            console.error('Error calculating token drops:', error);
            return { min: 0, max: 0, average: 0 };
        }
    }

    calculateAvatarSoulDrops(totalKills, soulsMultiplier = 1, avatarSoulsUpgradeMultiplier = 1) {
        try {
            if (typeof totalKills !== 'number' || totalKills < 0) {
                console.warn('calculateAvatarSoulDrops: Invalid totalKills value');
                return { min: 0, max: 0, average: 0 };
            }

            if (typeof soulsMultiplier !== 'number' || soulsMultiplier < 0) {
                soulsMultiplier = 1;
            }

            if (typeof avatarSoulsUpgradeMultiplier !== 'number' || avatarSoulsUpgradeMultiplier < 0) {
                avatarSoulsUpgradeMultiplier = 1;
            }

            if (typeof dropRates === 'undefined' || !dropRates.avatarSouls) {
                console.error('Drop rates data not available for avatar souls');
                return { min: 0, max: 0, average: 0 };
            }

            const { min = 1, max = 1, average = 1, baseChance = 0.15 } = dropRates.avatarSouls;
            
            if (typeof baseChance !== 'number' || baseChance < 0 || baseChance > 1) {
                console.warn('Invalid base chance for soul drops');
                return { min: 0, max: 0, average: 0 };
            }

            const expectedDrops = totalKills * baseChance * soulsMultiplier * avatarSoulsUpgradeMultiplier;
            
            return {
                min: Math.max(0, Math.floor(expectedDrops * min)),
                max: Math.max(0, Math.ceil(expectedDrops * max)),
                average: Math.max(0, Math.round(expectedDrops * average))
            };
        } catch (error) {
            console.error('Error calculating avatar soul drops:', error);
            return { min: 0, max: 0, average: 0 };
        }
    }

    getMobSuggestions(worldName, searchTerm = '') {
        try {
            const worldMobs = this.getMobsByWorld(worldName);
            
            if (!searchTerm || typeof searchTerm !== 'string') {
                return worldMobs.filter(mob => mob && mob.name);
            }
            
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            if (normalizedSearchTerm.length === 0) {
                return worldMobs.filter(mob => mob && mob.name);
            }
            
            return worldMobs.filter(mob => {
                try {
                    return mob && 
                           mob.name && 
                           typeof mob.name === 'string' &&
                           mob.name.toLowerCase().includes(normalizedSearchTerm);
                } catch (error) {
                    console.warn('Error filtering mob suggestion:', mob?.name, error);
                    return false;
                }
            });
        } catch (error) {
            console.error('Error getting mob suggestions:', error);
            return [];
        }
    }

    generateRaidWaveRanges(raidType, maxWaves) {
        try {
            if (typeof raidType !== 'string' || !raidType.trim()) {
                console.error('generateRaidWaveRanges: Invalid raid type');
                return [];
            }

            if (typeof maxWaves !== 'number' || maxWaves <= 0) {
                console.error('generateRaidWaveRanges: Invalid max waves');
                return [];
            }

            const ranges = [];
            const clampedMaxWaves = Math.min(maxWaves, 10000);
            
            if (clampedMaxWaves <= 100) {
                for (let i = 1; i <= clampedMaxWaves; i += 10) {
                    const end = Math.min(i + 9, clampedMaxWaves);
                    ranges.push({
                        start: i,
                        end: end,
                        label: `Waves ${i}-${end}`,
                        raidType: raidType
                    });
                }
            } else if (clampedMaxWaves <= 500) {
                for (let i = 1; i <= clampedMaxWaves; i += 25) {
                    const end = Math.min(i + 24, clampedMaxWaves);
                    ranges.push({
                        start: i,
                        end: end,
                        label: `Waves ${i}-${end}`,
                        raidType: raidType
                    });
                }
            } else {
                for (let i = 1; i <= clampedMaxWaves; i += 50) {
                    const end = Math.min(i + 49, clampedMaxWaves);
                    ranges.push({
                        start: i,
                        end: end,
                        label: `Waves ${i}-${end}`,
                        raidType: raidType
                    });
                }
            }
            return ranges;
        } catch (error) {
            console.error('Error generating raid wave ranges:', error);
            return [];
        }
    }

    getRaidWavesByRange(raidType, startWave, endWave) {
        try {
            if (typeof raidType !== 'string' || !raidType.trim()) {
                console.error('getRaidWavesByRange: Invalid raid type');
                return [];
            }

            if (typeof startWave !== 'number' || typeof endWave !== 'number') {
                console.error('getRaidWavesByRange: Invalid wave numbers');
                return [];
            }

            if (startWave > endWave || startWave < 1) {
                console.error('getRaidWavesByRange: Invalid wave range');
                return [];
            }

            return this.gameData.filter(mob => {
                try {
                    return mob && 
                           mob.raidType === raidType && 
                           typeof mob.wave === 'number' &&
                           mob.wave >= startWave && 
                           mob.wave <= endWave;
                } catch (error) {
                    console.warn('Error filtering raid wave:', mob?.name, error);
                    return false;
                }
            });
        } catch (error) {
            console.error('Error getting raid waves by range:', error);
            return [];
        }
    }

    calculateLevelFarmingTime(config) {
        try {
            if (!config || typeof config !== 'object') {
                return { valid: false, error: "Invalid configuration object" };
            }

            const {
                currentLevel,
                targetLevel,
                currentXp = 0,
                prestige = 0,
                userDPS,
                selectedMob,
                expMultiplier,
                farmType,
                expPotionActive = false,
                expPotionDuration = 0
            } = config;

            const validation = validateLevelInputs(currentLevel, targetLevel, prestige);
            if (!validation.valid) {
                return validation;
            }

            if (typeof userDPS !== 'number' || userDPS <= 0) {
                return { valid: false, error: "Invalid DPS value" };
            }

            if (!selectedMob || typeof selectedMob !== 'string') {
                return { valid: false, error: "Invalid mob selection" };
            }

            const mobData = this.gameData.find(mob => mob && mob.name === selectedMob);
            if (!mobData) {
                return { valid: false, error: "Invalid mob selected" };
            }

            const farmingEfficiency = this.calculateFarmingEfficiency({
                userDPS,
                selectedMob,
                farmingHours: 1,
                expMultiplier: expMultiplier || 1,
                coinMultiplier: 1,
                soulsMultiplier: 1,
                baseCoinsBonus: 0,
                farmType: farmType || 3
            });

            if (!farmingEfficiency || !farmingEfficiency.valid || !farmingEfficiency.viable) {
                return { valid: false, error: "Farming not viable for selected mob" };
            }

            const levelResult = calculateFarmingTimeForLevel({
                currentLevel,
                targetLevel,
                currentXp,
                xpPerHour: farmingEfficiency.perHour.exp,
                prestige,
                expPotionActive,
                expPotionDuration
            });

            if (levelResult.valid) {
                levelResult.farmingEfficiency = farmingEfficiency;
                levelResult.optimization = farmingEfficiency.optimization;
            }

            return levelResult;
        } catch (error) {
            console.error('Error in calculateLevelFarmingTime:', error);
            return { valid: false, error: "Calculation error: " + error.message };
        }
    }

    calculateRankUpProgress(config) {
        try {
            if (!config || typeof config !== 'object') {
                return { valid: false, error: "Invalid configuration object" };
            }

            const {
                currentRank,
                energyPerClick,
                currentEnergy = 0,
                potionType = 'none',
                potionDuration = 0,
                targetEnergy = null
            } = config;

            if (typeof currentRank !== 'number' || currentRank < 1 || currentRank > 75) {
                return { valid: false, error: "Rank must be between 1 and 75" };
            }

            if (typeof energyPerClick !== 'number' || energyPerClick <= 0) {
                return { valid: false, error: "Energy per click must be greater than 0" };
            }

            if (typeof currentEnergy !== 'number' || currentEnergy < 0) {
                return { valid: false, error: "Current energy must be non-negative" };
            }

            const rankInfo = getRankData(currentRank);
            if (!rankInfo) {
                return { valid: false, error: "Invalid rank data" };
            }

            if (currentRank === 75) {
                if (!targetEnergy || typeof targetEnergy !== 'number' || targetEnergy <= 0) {
                    return { valid: false, error: "Please set a valid target energy goal for max rank" };
                }

                const energyNeeded = Math.max(0, targetEnergy - currentEnergy);

                const totalTimeSeconds = energyNeeded > 0 ? 
                    this.calculateEnergyGainTime(energyNeeded, energyPerClick, potionType, potionDuration) : 0;

                return {
                    valid: true,
                    currentRank,
                    nextRank: null,
                    energyRequired: targetEnergy,
                    currentEnergy,
                    energyRemaining: energyNeeded,
                    energyPerClick,
                    potionInfo: this.getPotionInfo(potionType, potionDuration),
                    totalTimeSeconds,
                    timeFormatted: energyNeeded <= 0 ? "Energy Goal Already Reached!" : formatDuration(totalTimeSeconds),
                    energyMultiplier: rankInfo.energyMultiplier,
                    nextRankMultiplier: rankInfo.energyMultiplier,
                    isMaxRank: true,
                    targetEnergy,
                    progressPercentage: targetEnergy > 0 ? Math.min(100, (currentEnergy / targetEnergy) * 100) : 100,
                    optimization: this.generateRankOptimization(config, energyNeeded)
                };
            }

            if (typeof rankInfo.energyRequired !== 'number' || rankInfo.energyRequired <= 0) {
                return { valid: false, error: "Invalid rank energy requirement" };
            }

            const energyNeeded = Math.max(0, rankInfo.energyRequired - currentEnergy);
            
            const totalTimeSeconds = energyNeeded > 0 ? 
                this.calculateEnergyGainTime(energyNeeded, energyPerClick, potionType, potionDuration) : 0;

            const nextRankData = rankData.find(r => r.currentRank === rankInfo.nextRank);

            return {
                valid: true,
                currentRank,
                nextRank: rankInfo.nextRank,
                energyRequired: rankInfo.energyRequired,
                currentEnergy,
                energyRemaining: energyNeeded,
                energyPerClick,
                potionInfo: this.getPotionInfo(potionType, potionDuration),
                totalTimeSeconds,
                timeFormatted: energyNeeded <= 0 ? "Ready to Rank Up!" : formatDuration(totalTimeSeconds),
                energyMultiplier: rankInfo.energyMultiplier,
                nextRankMultiplier: nextRankData?.energyMultiplier || rankInfo.energyMultiplier,
                isMaxRank: false,
                progressPercentage: rankInfo.energyRequired > 0 ? Math.min(100, (currentEnergy / rankInfo.energyRequired) * 100) : 100,
                optimization: this.generateRankOptimization(config, energyNeeded)
            };
        } catch (error) {
            console.error('Error in calculateRankUpProgress:', error);
            return { valid: false, error: "Calculation error: " + error.message };
        }
    }

    getPotionInfo(potionType, potionDuration) {
        try {
            if (typeof energyPotions === 'undefined') {
                return {
                    type: 'None',
                    multiplier: 1,
                    duration: 0,
                    durationFormatted: formatDuration(0)
                };
            }

            const potion = energyPotions[potionType] || energyPotions.none;
            const duration = Math.max(0, potionDuration || 0);
            
            return {
                type: potion?.name || 'None',
                multiplier: potion?.multiplier || 1,
                duration: duration,
                durationFormatted: formatDuration(duration)
            };
        } catch (error) {
            console.error('Error getting potion info:', error);
            return {
                type: 'None',
                multiplier: 1,
                duration: 0,
                durationFormatted: formatDuration(0)
            };
        }
    }

    calculateEnergyGainTime(energyNeeded, energyPerClick, potionType = 'none', potionDuration = 0) {
        try {
            if (typeof energyNeeded !== 'number' || energyNeeded <= 0) {
                return 0;
            }

            if (typeof energyPerClick !== 'number' || energyPerClick <= 0) {
                console.error('calculateEnergyGainTime: Invalid energy per click');
                return Infinity;
            }

            const potion = (typeof energyPotions !== 'undefined' && energyPotions[potionType]) || 
                          (typeof energyPotions !== 'undefined' && energyPotions.none) || 
                          { multiplier: 1 };

            let totalTimeSeconds = 0;
            let energyGained = 0;
            const safePotionDuration = Math.max(0, potionDuration || 0);

            if (safePotionDuration > 0 && potion.multiplier > 1) {
                const potionEnergyPerSecond = energyPerClick * potion.multiplier;
                const energyDuringPotion = Math.min(energyNeeded, potionEnergyPerSecond * safePotionDuration);
                energyGained += energyDuringPotion;
                
                if (energyGained >= energyNeeded) {
                    totalTimeSeconds = energyNeeded / potionEnergyPerSecond;
                } else {
                    totalTimeSeconds += safePotionDuration;
                }
            }

            if (energyGained < energyNeeded) {
                const remainingEnergy = energyNeeded - energyGained;
                const timeWithoutPotion = remainingEnergy / energyPerClick;
                totalTimeSeconds += timeWithoutPotion;
            }

            return Math.max(0, totalTimeSeconds);
        } catch (error) {
            console.error('Error calculating energy gain time:', error);
            return Infinity;
        }
    }

    generateRankOptimization(config, energyNeeded) {
        const suggestions = [];
        
        try {
            if (!config || typeof config !== 'object' || typeof energyNeeded !== 'number') {
                return suggestions;
            }

            const { potionType, potionDuration, energyPerClick } = config;
            
            if (typeof energyPerClick !== 'number' || energyPerClick <= 0) {
                return suggestions;
            }

            if (potionType === 'none' && energyNeeded > 0) {
                const timeWithoutPotion = energyNeeded / energyPerClick;
                const timeWithSmallPotion = this.calculateEnergyGainTime(energyNeeded, energyPerClick, 'small', 15 * 60);
                const timeWithLargePotion = this.calculateEnergyGainTime(energyNeeded, energyPerClick, 'large', 15 * 60);
                
                const smallPotionSavings = timeWithoutPotion - timeWithSmallPotion;
                const largePotionSavings = timeWithoutPotion - timeWithLargePotion;
                
                if (smallPotionSavings > 300) {
                    suggestions.push({
                        type: 'potion',
                        priority: 'medium',
                        message: `Using a Small Energy Potion would save ${formatDuration(smallPotionSavings)}`
                    });
                }
                
                if (largePotionSavings > 600) {
                    suggestions.push({
                        type: 'potion',
                        priority: 'high',
                        message: `Using an Energy Potion would save ${formatDuration(largePotionSavings)}`
                    });
                }
            }
            
            const baseEPC = config.baseEPC || energyPerClick / 3.5;
            const currentCPS = baseEPC > 0 ? energyPerClick / baseEPC : 3.5;
            
            if (currentCPS < 5.0) {
                suggestions.push({
                    type: 'clicking',
                    priority: 'low',
                    message: 'Consider using a faster clicker or auto-clicker for better efficiency'
                });
            }
        } catch (error) {
            console.error('Error generating rank optimization:', error);
        }
        
        return suggestions;
    }

    findBestXPMobForDPS(userDPS, expMultiplier = 1, worldFilter = null, farmType = 3) {
        try {
            if (typeof userDPS !== 'number' || userDPS <= 0) {
                console.warn('findBestXPMobForDPS: Invalid DPS value');
                return null;
            }

            if (typeof expMultiplier !== 'number' || expMultiplier <= 0) {
                expMultiplier = 1;
            }

            let farmableMobs = this.gameData.filter(mob => {
                try {
                    if (!mob || typeof mob.hp !== 'number' || typeof mob.exp !== 'number') {
                        return false;
                    }
                    
                    if (worldFilter && mob.world !== worldFilter) {
                        return false;
                    }
                    
                    if (mob.world.includes('Raid') || mob.world.includes('Defense')) {
                        return false;
                    }
                    
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    return effectiveTime <= 300 && killTime !== Infinity;
                } catch (error) {
                    console.warn('Error filtering mob for best XP:', mob?.name, error);
                    return false;
                }
            });

            if (farmableMobs.length === 0) {
                console.info('No farmable mobs found for DPS and criteria');
                return null;
            }

            let bestMob = null;
            let bestXPPerSecond = 0;

            farmableMobs.forEach(mob => {
                try {
                    const killTime = this.calculateTimeToKill(userDPS, mob.hp);
                    const effectiveTime = killTime + this.respawnTime;
                    const farmMultiplier = mob.rank === 'SS' ? 1 : Math.max(1, parseInt(farmType) || 3);
                    const xpPerSecond = (mob.exp * expMultiplier * farmMultiplier) / effectiveTime;
                    
                    if (xpPerSecond > bestXPPerSecond) {
                        bestXPPerSecond = xpPerSecond;
                        bestMob = {
                            ...mob,
                            timeToKill: killTime,
                            effectiveTimeToKill: effectiveTime,
                            xpPerSecond,
                            xpPerHour: xpPerSecond * 3600,
                            killsPerHour: (3600 / effectiveTime) * farmMultiplier,
                            farmMultiplier,
                            efficiency: this.analyzeMobEfficiency(userDPS, mob)
                        };
                    }
                } catch (error) {
                    console.warn('Error calculating XP for best mob:', mob?.name, error);
                }
            });

            return bestMob;
        } catch (error) {
            console.error('Error in findBestXPMobForDPS:', error);
            return null;
        }
    }

    calculateLevelProgressWithAutoBestMob(config) {
        try {
            if (!config || typeof config !== 'object') {
                return { valid: false, error: "Invalid configuration object" };
            }

            const {
                currentLevel,
                targetLevel,
                currentXp = 0,
                prestige = 0,
                userDPS,
                expMultiplier,
                farmType,
                expPotionActive = false,
                expPotionDuration = 0,
                selectedWorld = null
            } = config;

            const validation = validateLevelInputs(currentLevel, targetLevel, prestige);
            if (!validation.valid) {
                return validation;
            }

            if (typeof userDPS !== 'number' || userDPS <= 0) {
                return { valid: false, error: "Please enter a valid DPS value" };
            }

            const bestMob = this.findBestXPMobForDPS(userDPS, expMultiplier, selectedWorld, farmType);
            if (!bestMob) {
                return { valid: false, error: "No farmable mobs found for your DPS level" };
            }

            const farmingEfficiency = this.calculateFarmingEfficiency({
                userDPS,
                selectedMob: bestMob.name,
                farmingHours: 1,
                expMultiplier: expMultiplier || 1,
                coinMultiplier: 1,
                soulsMultiplier: 1,
                baseCoinsBonus: 0,
                farmType: farmType || 3
            });

            if (!farmingEfficiency || !farmingEfficiency.valid || !farmingEfficiency.viable) {
                return { valid: false, error: "Farming not viable with current settings" };
            }

            const levelCalcResult = calculateFarmingTimeForLevel({
                currentLevel,
                targetLevel,
                currentXp,
                xpPerHour: farmingEfficiency.perHour.exp,
                prestige,
                expPotionActive,
                expPotionDuration
            });

            if (levelCalcResult.valid) {
                levelCalcResult.bestMob = bestMob;
                levelCalcResult.farmingEfficiency = farmingEfficiency;
                levelCalcResult.optimization = this.generateLevelOptimization(config, bestMob, levelCalcResult);
            }

            return levelCalcResult;
        } catch (error) {
            console.error('Error in calculateLevelProgressWithAutoBestMob:', error);
            return { valid: false, error: "Calculation error: " + error.message };
        }
    }

    generateLevelOptimization(config, bestMob, levelResult) {
        const suggestions = [];
        
        try {
            if (!config || !bestMob || !levelResult) {
                return suggestions;
            }
            
            if (!config.expPotionActive && levelResult.hoursNeeded > 2) {
                const potionSavings = levelResult.hoursNeeded * 0.5;
                suggestions.push({
                    type: 'potion',
                    priority: 'high',
                    message: `Using a 2x EXP Potion could save approximately ${potionSavings.toFixed(1)} hours`
                });
            }
            
            if (bestMob.efficiency && bestMob.efficiency.category !== 'excellent') {
                suggestions.push({
                    type: 'efficiency',
                    priority: 'medium',
                    message: bestMob.efficiency.recommendation
                });
            }
            
            if (bestMob.rank !== 'SS' && config.farmType === '3') {
                const timeImprovement = levelResult.hoursNeeded * 0.25;
                suggestions.push({
                    type: 'farm',
                    priority: 'medium',
                    message: `Switch to 4-mob farm to save approximately ${timeImprovement.toFixed(1)} hours`
                });
            }
            
            const currentPrestige = config.prestige || 0;
            if (typeof prestigeConfig !== 'undefined') {
                const nextPrestigeData = prestigeConfig[currentPrestige + 1];
                if (nextPrestigeData && config.currentLevel >= 150) {
                    const currentPrestigeData = prestigeConfig[currentPrestige] || { expMultiplier: 1 };
                    const improvementPercent = ((nextPrestigeData.expMultiplier - currentPrestigeData.expMultiplier) * 100);
                    suggestions.push({
                        type: 'prestige',
                        priority: 'low',
                        message: `Consider prestiging for ${improvementPercent.toFixed(0)}% more XP`
                    });
                }
            }
        } catch (error) {
            console.error('Error generating level optimization:', error);
        }
        
        return suggestions;
    }

    clearCache() {
        try {
            this.calculationCache.clear();
            console.info('Calculator cache cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    getCacheSize() {
        try {
            return this.calculationCache.size;
        } catch (error) {
            console.error('Error getting cache size:', error);
            return 0;
        }
    }
}

let calculator;
try {
    calculator = new AnimeEternalCalculator();
    console.info('AnimeEternalCalculator initialized successfully');
} catch (error) {
    console.error('Failed to initialize AnimeEternalCalculator:', error);
    calculator = {
        calculateTimeToKill: () => Infinity,
        calculateFarmingEfficiency: () => ({ valid: false, error: 'Calculator not available' }),
        findOptimalXPFarm: () => null,
        findOptimalCoinFarm: () => null,
        error: 'Calculator initialization failed'
    };
}
