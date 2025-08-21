class AnimeEternalApp {
    constructor() {
        this.currentTab = 'home';
        this.currentDPS = 0;
        this.selectedRaidRange = null;
        this.configCollapsed = true;
        this.rankUpTimer = null;
        this.levelProgressTimer = null;
        this.notificationTimers = new Map();
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

    startSmartTimer(type, targetTime, targetData) {
        this.clearSmartTimer(type);
        
        if (targetTime <= 0) return;

        const timer = setInterval(() => {
            targetTime--;
            
            const displayElement = document.getElementById(`${type}-countdown`);
            if (displayElement) {
                const timeElement = displayElement.querySelector('.time-remaining');
                if (timeElement) {
                    timeElement.textContent = formatDuration(targetTime);
                }
            }

            if (targetTime <= 0) {
                this.clearSmartTimer(type);
                this.handleTimerCompletion(type, targetData);
            }
        }, 1000);

        this.notificationTimers.set(type, timer);
    }

    clearSmartTimer(type) {
        if (this.notificationTimers.has(type)) {
            clearInterval(this.notificationTimers.get(type));
            this.notificationTimers.delete(type);
        }
    }

    handleTimerCompletion(type, targetData) {
        let title, message;
        
        switch (type) {
            case 'rank-up':
                title = targetData.isMaxRank ? 'Energy Goal Reached!' : 'Rank Up Ready!';
                message = targetData.isMaxRank 
                    ? `You've reached your energy goal of ${formatNumber(targetData.targetEnergy)}!`
                    : `You can now rank up from ${targetData.currentRank} to ${targetData.nextRank}!`;
                break;
            case 'level-progress':
                title = 'Level Target Reached!';
                message = `Congratulations! You've reached level ${targetData.targetLevel}!`;
                break;
            default:
                title = 'Timer Complete!';
                message = 'Your timer has finished.';
        }

        this.showNotification(title, message, 'success', 10000);
        
        this.playNotificationSound();
        
        this.showBrowserNotification(title, message);
    }

    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }

    showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/image.png',
                badge: '/image.png'
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('Notifications Enabled', 'You will now receive alerts when timers complete!', 'success');
                }
            });
        }
    }

    async takeScreenshot(tabName) {
        try {
            const element = this.getScreenshotElement(tabName);
            if (!element) {
                this.showNotification('Screenshot Error', 'Could not find content to capture', 'error');
                return;
            }

            if (typeof html2canvas !== 'undefined') {
                this.showNotification('Generating Screenshot', 'Please wait...', 'info', 2000);
                
                const canvas = await html2canvas(element, {
                    backgroundColor: '#1a0a2e',
                    scale: 2,
                    logging: false,
                    useCORS: true
                });
                
                this.showScreenshotModal(canvas, tabName);
            } else {
                this.showShareModal(tabName);
            }
        } catch (error) {
            console.error('Screenshot error:', error);
            this.showNotification('Screenshot Failed', 'Unable to generate screenshot. Try sharing URL instead.', 'error');
            this.showShareModal(tabName);
        }
    }

    getScreenshotElement(tabName) {
        const selectors = {
            'time-to-kill': '.results-section',
            'loot-calculator': '.unified-layout',
            'level-progression': '.results-section',
            'rank-up': '.results-section'
        };
        
        const selector = selectors[tabName];
        return selector ? document.querySelector(selector) : null;
    }

    showScreenshotModal(canvas, tabName) {
        const modal = document.getElementById('screenshot-modal');
        const modalCanvas = document.getElementById('screenshot-canvas');
        
        if (!modal || !modalCanvas) return;
        
        modalCanvas.width = canvas.width;
        modalCanvas.height = canvas.height;
        const ctx = modalCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);
        
        this.currentScreenshot = {
            canvas: canvas,
            tabName: tabName
        };
        
        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    showShareModal(tabName) {
        const shareUrl = this.generateShareUrl(tabName);
        
        this.showNotification('Share URL Generated', 
            `<div style="margin-top: 0.5rem;">
                <input type="text" value="${shareUrl}" readonly style="width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid #6a0dad; border-radius: 5px; color: white;">
                <button onclick="navigator.clipboard.writeText('${shareUrl}'); this.textContent='Copied!'" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #6a0dad; border: none; border-radius: 5px; color: white; cursor: pointer;">Copy URL</button>
            </div>`, 
            'info', 10000);
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
        const dps = document.getElementById('quick-dps-input')?.value;
        const dpsSuffix = document.getElementById('quick-dps-suffix')?.value;
        const hours = document.getElementById('quick-farm-hours')?.value;
        const farmType = document.querySelector('input[name="farm-type"]:checked')?.value;
        const world = document.getElementById('farm-world-select')?.value;
        const mob = document.getElementById('mob-select')?.value;
        
        if (dps) params.set('dps', dps);
        if (dpsSuffix && dpsSuffix !== '1') params.set('dps_suffix', dpsSuffix);
        if (hours && hours !== '1') params.set('hours', hours);
        if (farmType && farmType !== '3') params.set('farm_type', farmType);
        if (world) params.set('world', world);
        if (mob) params.set('mob', mob);
        
        this.addEquipmentParams(params);
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
        
        if (rank) params.set('rank', rank);
        if (energy) params.set('energy', energy);
        if (energySuffix && energySuffix !== '1') params.set('energy_suffix', energySuffix);
        if (epc) params.set('epc', epc);
        if (epcSuffix && epcSuffix !== '1') params.set('epc_suffix', epcSuffix);
        if (clickingMethod && clickingMethod !== 'slow') params.set('clicking', clickingMethod);
    }

    addEquipmentParams(params) {
        const equipment = {};
        
        if (document.getElementById('vip-gamepass')?.checked) equipment.vip = '1';
        if (document.getElementById('premium-benefits')?.checked) equipment.premium = '1';
        if (document.getElementById('double-coins-gamepass')?.checked) equipment.double_coins = '1';
        if (document.getElementById('double-exp-gamepass')?.checked) equipment.double_exp = '1';
        if (document.getElementById('double-souls-gamepass')?.checked) equipment.double_souls = '1';
        
        const ring = document.getElementById('ring-select')?.value;
        const necklace = document.getElementById('necklace-select')?.value;
        const earrings = document.getElementById('earrings-select')?.value;
        
        if (ring && ring !== '0') equipment.ring = ring;
        if (necklace && necklace !== '0') equipment.necklace = necklace;
        if (earrings && earrings !== '0') equipment.earrings = earrings;
        
        if (Object.keys(equipment).length > 0) {
            params.set('equipment', JSON.stringify(equipment));
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
        const farmType = params.get('farm_type');
        const world = params.get('world');
        const mob = params.get('mob');
        const equipment = params.get('equipment');
        
        if (dps) document.getElementById('quick-dps-input').value = dps;
        if (dpsSuffix) document.getElementById('quick-dps-suffix').value = dpsSuffix;
        if (hours) document.getElementById('quick-farm-hours').value = hours;
        if (farmType) {
            const farmRadio = document.querySelector(`input[name="farm-type"][value="${farmType}"]`);
            if (farmRadio) farmRadio.checked = true;
        }
        if (world) document.getElementById('farm-world-select').value = world;
        if (mob) document.getElementById('mob-select').value = mob;
        
        if (equipment) {
            try {
                const equipmentData = JSON.parse(equipment);
                this.loadEquipmentFromData(equipmentData);
            } catch (e) {
                console.log('Invalid equipment data in URL');
            }
        }
        
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
        
        if (rank) document.getElementById('current-rank').value = rank;
        if (energy) document.getElementById('current-energy').value = energy;
        if (energySuffix) document.getElementById('current-energy-suffix').value = energySuffix;
        if (epc) document.getElementById('energy-per-click').value = epc;
        if (epcSuffix) document.getElementById('energy-per-click-suffix').value = epcSuffix;
        if (clicking) {
            const clickingRadio = document.querySelector(`input[name="clicking-method"][value="${clicking}"]`);
            if (clickingRadio) clickingRadio.checked = true;
        }
        
        if (rank && epc) this.calculateRankUpTime();
    }

    loadEquipmentFromData(data) {
        if (data.vip) document.getElementById('vip-gamepass').checked = true;
        if (data.premium) document.getElementById('premium-benefits').checked = true;
        if (data.double_coins) document.getElementById('double-coins-gamepass').checked = true;
        if (data.double_exp) document.getElementById('double-exp-gamepass').checked = true;
        if (data.double_souls) document.getElementById('double-souls-gamepass').checked = true;
        
        if (data.ring) document.getElementById('ring-select').value = data.ring;
        if (data.necklace) document.getElementById('necklace-select').value = data.necklace;
        if (data.earrings) document.getElementById('earrings-select').value = data.earrings;
    }

    closeScreenshotModal() {
        const modal = document.getElementById('screenshot-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    async downloadScreenshot() {
        if (!this.currentScreenshot) return;
        
        try {
            const link = document.createElement('a');
            link.download = `anime-eternal-${this.currentScreenshot.tabName}-${Date.now()}.png`;
            link.href = this.currentScreenshot.canvas.toDataURL();
            link.click();
            
            this.showNotification('Download Started', 'Screenshot is being downloaded!', 'success');
            this.closeScreenshotModal();
        } catch (error) {
            this.showNotification('Download Failed', 'Unable to download screenshot', 'error');
        }
    }

    async copyScreenshotToClipboard() {
        if (!this.currentScreenshot) return;
        
        try {
            this.currentScreenshot.canvas.toBlob(async (blob) => {
                if (navigator.clipboard && window.ClipboardItem) {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    this.showNotification('Copied to Clipboard', 'Screenshot copied! Paste it in Discord or any app.', 'success');
                    this.closeScreenshotModal();
                } else {
                    this.showNotification('Copy Failed', 'Clipboard access not available. Try downloading instead.', 'error');
                }
            });
        } catch (error) {
            this.showNotification('Copy Failed', 'Unable to copy to clipboard', 'error');
        }
    }

    copyShareUrl() {
        const url = this.generateShareUrl();
        
        try {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('URL Copied', 'Share URL copied to clipboard!', 'success');
                this.closeScreenshotModal();
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
            this.closeScreenshotModal();
        } catch (error) {
            this.showNotification('Copy Failed', 'Unable to copy URL', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    startRankUpTimer(results) {
        if (this.rankUpTimer) {
            clearInterval(this.rankUpTimer);
        }

        if (!results.valid || results.totalTimeSeconds <= 0) {
            return;
        }

        this.startSmartTimer('rank-up', results.totalTimeSeconds, {
            currentRank: results.currentRank,
            nextRank: results.nextRank,
            isMaxRank: results.isMaxRank,
            targetEnergy: results.targetEnergy
        });
        
        let remainingSeconds = results.totalTimeSeconds;
        const countdownElement = document.getElementById('rank-countdown');
        
        this.rankUpTimer = setInterval(() => {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                clearInterval(this.rankUpTimer);
                if (countdownElement) {
                    const completionText = results.isMaxRank ? 'Energy Goal Complete!' : 'Rank Up Complete!';
                    countdownElement.innerHTML = `<div class="time-remaining complete">${completionText}</div>`;
                }
                return;
            }

            if (countdownElement) {
                const timeElement = countdownElement.querySelector('.time-remaining');
                if (timeElement) {
                    timeElement.textContent = formatDuration(remainingSeconds);
                }
            }
        }, 1000);
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

    getItemBonusText(item) {
        const bonuses = [];
        if (item.coinsMultiplier > 0) bonuses.push(`+${(item.coinsMultiplier * 100).toFixed(0)}% coins`);
        if (item.expMultiplier > 0) bonuses.push(`+${(item.expMultiplier * 100).toFixed(0)}% exp`);
        if (item.souls > 0) bonuses.push(`+${(item.souls * 100).toFixed(0)}% souls`);
        return bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
    }
    
    getMaskBonusText(item) {
        const bonuses = [];
        if (item.baseCoins > 0) bonuses.push(`+${(item.baseCoins * 100).toFixed(1)}% coins`);
        if (item.expPercentage > 0) bonuses.push(`+${item.expPercentage}% exp`);
        return bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
    }

    getLootCalculatorConfig() {
        const dpsInput = document.getElementById('quick-dps-input');
        const dpsSuffix = document.getElementById('quick-dps-suffix');
        const mobSelect = document.getElementById('mob-select');
        const farmHours = document.getElementById('quick-farm-hours');

        if (!dpsInput?.value || parseFloat(dpsInput.value) <= 0) {
            return { valid: false, error: 'Please enter a valid DPS value.' };
        }

        if (!farmHours?.value || parseFloat(farmHours.value) <= 0) {
            return { valid: false, error: 'Please enter valid farming hours.' };
        }

        const userDPS = parseFloat(dpsInput.value) * parseFloat(dpsSuffix.value);
        const multipliers = this.getAllMultipliers();
        const farmType = document.querySelector('input[name="farm-type"]:checked')?.value || '3';

        return {
            valid: true,
            userDPS,
            selectedMob: mobSelect?.value || null,
            farmingHours: parseFloat(farmHours.value),
            ...multipliers,
            farmType
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
                    <div class="stat-value" style="color: #ff6666; font-size: 0.9rem;">${results.reason}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Kill Time</div>
                    <div class="stat-value">${formatTime(results.timePerKill)}</div>
                </div>
            `;
            return;
        }

        const { mobData, totals, perHour, killsPerHour, multipliers, farmingHours } = results;

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

    getAllMultipliers() {
        let expMultiplier = 1;
        let coinMultiplier = 1;
        let soulsMultiplier = 1;
        let baseCoinsBonus = 0;

        if (document.getElementById('vip-gamepass')?.checked) expMultiplier *= 1.05;
        if (document.getElementById('premium-benefits')?.checked) coinMultiplier *= 1.10;
        if (document.getElementById('double-coins-gamepass')?.checked) coinMultiplier *= 2;
        if (document.getElementById('double-exp-gamepass')?.checked) expMultiplier *= 2;
        if (document.getElementById('double-souls-gamepass')?.checked) soulsMultiplier *= 2;
        
        const ringMultiplier = parseFloat(document.getElementById('ring-select')?.value || 0);
        const necklaceMultiplier = parseFloat(document.getElementById('necklace-select')?.value || 0);
        const earringsMultiplier = parseFloat(document.getElementById('earrings-select')?.value || 0);
        coinMultiplier *= (1 + ringMultiplier + necklaceMultiplier + earringsMultiplier);

        const parseJsonValue = (elementId) => {
            const value = document.getElementById(elementId)?.value;
            if (value && value !== '0') {
                try { return JSON.parse(value); } catch (e) { console.error(`Error parsing JSON for ${elementId}:`, e); }
            }
            return null;
        };
        
        const aura = parseJsonValue('aura-select');
        if(aura) {
            coinMultiplier *= (1 + aura.coins);
            expMultiplier *= (1 + aura.exp);
            soulsMultiplier *= (1 + aura.souls);
        }

        baseCoinsBonus += parseFloat(document.getElementById('hat-select')?.value || 0);
        baseCoinsBonus += parseFloat(document.getElementById('scarf-select')?.value || 0);

        const mask = parseJsonValue('mask-select');
        if(mask) {
            coinMultiplier *= (1 + mask.coins);
            expMultiplier *= (1 + mask.exp / 100);
        }
        
        const cloak = parseJsonValue('cloak-select');
        if(cloak) expMultiplier *= (1 + cloak.exp / 100);

        const fruitMultiplier = parseFloat(document.getElementById('fruit-select')?.value || 0);
        if (fruitMultiplier > 0) coinMultiplier *= (1 + fruitMultiplier);

        const eyes = parseJsonValue('eyes-select');
        if(eyes) {
            coinMultiplier *= (1 + eyes.coins);
            expMultiplier *= (1 + eyes.exp);
        }

        const virtue = parseJsonValue('virtue-select');
        if(virtue) {
            coinMultiplier *= (1 + virtue.coins);
            expMultiplier *= (1 + virtue.exp);
        }

        const demonLordLevel = parseInt(document.getElementById('demon-lord-level')?.value || 0);
        if (demonLordLevel > 0) coinMultiplier *= (1 + (demonLordLevel * 0.01));

        return { expMultiplier, coinMultiplier, soulsMultiplier, baseCoinsBonus };
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
        
        const expMultiplier = this.getLevelExpMultipliers();
        const farmType = document.querySelector('input[name="level-farm-type"]:checked')?.value || '3';
        
        const expPotionActive = document.getElementById('level-exp-potion')?.checked || false;
        let expPotionDuration = 0;
        
        if (expPotionActive) {
            const days = parseInt(document.getElementById('level-potion-days')?.value) || 0;
            const hours = parseInt(document.getElementById('level-potion-hours')?.value) || 0;
            const minutes = parseInt(document.getElementById('level-potion-minutes')?.value) || 0;
            expPotionDuration = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
        }

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
            expMultiplier,
            farmType,
            expPotionActive,
            expPotionDuration
        };
    }

    getLevelExpMultipliers() {
        let expMultiplier = 1;
        
        if (document.getElementById('level-double-exp-gamepass')?.checked) expMultiplier *= 2;
        if (document.getElementById('level-vip-gamepass')?.checked) expMultiplier *= 1.05;
        
        const parseJsonValue = (elementId) => {
            const value = document.getElementById(elementId)?.value;
            if (value && value !== '0') {
                try { return JSON.parse(value); } catch (e) { return null; }
            }
            return null;
        };
        
        const mask = parseJsonValue('level-mask-select');
        if(mask) expMultiplier *= (1 + mask.exp / 100);
        
        const cloak = parseJsonValue('level-cloak-select');
        if(cloak) expMultiplier *= (1 + cloak.exp / 100);

        const aura = parseJsonValue('level-aura-select');
        if(aura) expMultiplier *= (1 + aura.exp);

        const eyes = parseJsonValue('level-eyes-select');
        if(eyes) expMultiplier *= (1 + eyes.exp);

        const virtue = parseJsonValue('level-virtue-select');
        if(virtue) expMultiplier *= (1 + virtue.exp);
        
        return expMultiplier;
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
        
        if (results.valid && results.hoursNeeded > 0) {
            const timeInSeconds = results.hoursNeeded * 3600;
            this.startSmartTimer('level-progress', timeInSeconds, {
                targetLevel: config.targetLevel
            });
        }
    }

    displayLevelResults(results) {
        const container = document.getElementById('level-progress-results');
        
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

        let expPotionInfo = '';
        if (results.expPotionActive && results.expPotionBenefit > 0) {
            expPotionInfo = `
                <div class="stat-item">
                    <div class="stat-label">EXP Potion Benefit</div>
                    <div class="stat-value xp">${formatNumber(results.expPotionBenefit)}</div>
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
            <div class="countdown-timer" id="level-countdown" style="display: ${results.hoursNeeded > 0 ? 'block' : 'none'};">
                <div class="time-remaining">${results.timeFormatted}</div>
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
                ${expPotionInfo}
            </div>
        `;
    }

    displayLevelError(error) {
        const container = document.getElementById('level-progress-results');
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
        const potionType = document.getElementById('potion-type')?.value || 'none';
        
        let potionDuration = 0;
        if (potionType !== 'none') {
            const days = parseInt(document.getElementById('potion-days')?.value) || 0;
            const hours = parseInt(document.getElementById('potion-hours')?.value) || 0;
            const minutes = parseInt(document.getElementById('potion-minutes')?.value) || 0;
            potionDuration = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
        }

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
            potionType,
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
        
        switch (clickingMethod) {
            case 'slow':
                clicksPerSecond = 3.5;
                break;
            case 'fast':
                clicksPerSecond = parseFloat(document.getElementById('clicker-speed')?.value) || 5.0;
                break;
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
        this.startRankUpTimer(results);
    }

    displayRankResults(results) {
        const container = document.getElementById('rank-progress-results');
        
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
            <div class="countdown-timer" id="rank-countdown">
                <div class="time-remaining">${results.timeFormatted}</div>
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
            </div>
        `;
    }

    displayRankError(error) {
        const container = document.getElementById('rank-progress-results');
        container.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Error</div>
                <div class="stat-value" style="color: #ff6666;">${error}</div>
            </div>
        `;
    }

    updateTargetLevelOptions() {
        const prestige = parseInt(document.getElementById('level-prestige-select')?.value) || 0;
        const currentLevel = parseInt(document.getElementById('level-current-level')?.value) || 1;
        
        this.calculateLevelProgress();
    }

    updateNextRankDisplay() {
        const currentRank = parseInt(document.getElementById('current-rank')?.value);
        const nextRankDisplay = document.getElementById('next-rank-display');
        const targetEnergyContainer = document.getElementById('target-energy-container');
        
        if (!currentRank) return;

        const rankInfo = getRankData(currentRank);
        
        if (currentRank === 75) {
            if (nextRankDisplay) {
                nextRankDisplay.textContent = 'Maximum Rank - Set Energy Goal';
                nextRankDisplay.style.display = 'block';
            }
            if (targetEnergyContainer) {
                targetEnergyContainer.style.display = 'block';
            }
        } else if (rankInfo && rankInfo.nextRank) {
            if (nextRankDisplay) {
                nextRankDisplay.textContent = `Next Rank: ${rankInfo.nextRank}`;
                nextRankDisplay.style.display = 'block';
            }
            if (targetEnergyContainer) {
                targetEnergyContainer.style.display = 'none';
            }
        } else {
            if (nextRankDisplay) {
                nextRankDisplay.style.display = 'none';
            }
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

    toggleExpPotionDuration() {
        const expPotionActive = document.getElementById('level-exp-potion')?.checked;
        const expPotionDurationInputs = document.getElementById('level-exp-potion-duration');
        
        if (!expPotionDurationInputs) return;
        
        if (expPotionActive) {
            expPotionDurationInputs.style.display = 'block';
        } else {
            expPotionDurationInputs.style.display = 'none';
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
                    <div class="optimal-mob">${data.name}</div>
                    <div class="optimal-stats">
                        <div class="optimal-stat"><strong>World:</strong> ${data.world}</div>
                        <div class="optimal-stat"><strong>Rank:</strong> ${data.rank}</div>
                        <div class="optimal-stat"><strong>Kill Time:</strong> ${formatTime(data.effectiveTimeToKill)}</div>
                        <div class="optimal-stat"><strong>${type}/Hour:</strong> ${formatNumber(data[`${type.toLowerCase()}PerHour`])}</div>
                        <div class="optimal-stat"><strong>Kills/Hour:</strong> ${Math.round(data.killsPerHour)}</div>
                    </div>`;
            } else {
                container.innerHTML = '<div class="no-results"><p>No farmable mobs found</p></div>';
            }
        };

        renderOptimalCard(xpContainer, optimalXP, 'XP');
        renderOptimalCard(coinContainer, optimalCoin, 'Coins');
    }

    clearOptimalResults() {
        const xpContainer = document.getElementById('optimal-xp-farm');
        const coinContainer = document.getElementById('optimal-coin-farm');
        if (xpContainer) xpContainer.innerHTML = '<div class="no-results"><p>Enter DPS to see optimal XP farm</p></div>';
        if (coinContainer) coinContainer.innerHTML = '<div class="no-results"><p>Enter DPS to see optimal coin farm</p></div>';
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById(tabName)?.classList.add('active');
        document.querySelector(`.nav-link[data-tab="${tabName}"]`)?.classList.add('active');
        this.currentTab = tabName;
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

    updateMobSelect() {
        const worldSelect = document.getElementById('farm-world-select');
        const mobSelect = document.getElementById('mob-select');
        
        if (!worldSelect || !mobSelect || typeof calculator === 'undefined') return;

        const selectedWorld = worldSelect.value;
        const mobs = calculator.getMobsByWorld(selectedWorld);

        mobSelect.innerHTML = '<option value="">Auto-select optimal</option>';
        mobs.forEach(mob => {
            const option = document.createElement('option');
            option.value = mob.name;
            option.textContent = `${mob.name} (${mob.rank}) - ${formatNumber(mob.hp)} HP`;
            mobSelect.appendChild(option);
        });
        
        this.runCalculations();
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
            document.getElementById('quick-dps-suffix'),
            document.getElementById('level-dps-suffix'),
            document.getElementById('current-energy-suffix'),
            document.getElementById('target-energy-suffix'),
            document.getElementById('energy-per-click-suffix')
        ];
        suffixSelects.forEach(select => {
            if (!select) return;
            select.innerHTML = '<option value="1">No Suffix</option>';
            numberSuffixes.forEach(item => {
                select.innerHTML += `<option value="${item.value}">${item.suffix}</option>`;
            });
        });

        const worldSelects = [
            document.getElementById('world-select'), 
            document.getElementById('farm-world-select'),
            document.getElementById('level-world-select')
        ];
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

        const prestigeSelects = [
            document.getElementById('prestige-select'),
            document.getElementById('level-prestige-select')
        ];
        prestigeSelects.forEach(select => {
            if (!select) return;
            Object.keys(prestigeConfig).forEach(prestige => {
                const option = document.createElement('option');
                option.value = prestige;
                option.textContent = `Prestige ${prestige} (Cap: ${prestigeConfig[prestige].levelCap}, +${((prestigeConfig[prestige].expMultiplier - 1) * 100).toFixed(0)}% XP)`;
                select.appendChild(option);
            });
        });

        const potionTypeSelect = document.getElementById('potion-type');
        if (potionTypeSelect) {
            Object.values(energyPotions).forEach(potion => {
                const option = document.createElement('option');
                option.value = Object.keys(energyPotions).find(key => energyPotions[key] === potion);
                option.textContent = potion.name;
                potionTypeSelect.appendChild(option);
            });
        }

        const populateSelect = (elementId, items, valueField, nameField, bonusTextCallback) => {
            const select = document.getElementById(elementId);
            if (!select || !items) return;
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = typeof valueField === 'function' ? valueField(item) : item[valueField];
                option.textContent = item[nameField] + (bonusTextCallback ? bonusTextCallback(item) : '');
                select.appendChild(option);
            });
        };
        
        populateSelect('ring-select', gameItems.jewelry.rings, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}%)` : '');
        populateSelect('necklace-select', gameItems.jewelry.necklaces, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}%)` : '');
        populateSelect('earrings-select', gameItems.jewelry.earrings, 'multiplier', 'name', item => item.multiplier > 0 ? ` (+${(item.multiplier * 100).toFixed(0)}%)` : '');
        populateSelect('aura-select', gameItems.auras, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier, souls: item.souls }), 'name', this.getItemBonusText);
        populateSelect('hat-select', gameItems.equipment.hats, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins} base coins)` : '');
        populateSelect('scarf-select', gameItems.equipment.scarfs, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins} base coins)` : '');
        populateSelect('mask-select', gameItems.equipment.masks, item => JSON.stringify({ coins: item.baseCoins, exp: item.expPercentage }), 'name', this.getMaskBonusText);
        populateSelect('cloak-select', gameItems.equipment.cloaks, item => JSON.stringify({ exp: item.expPercentage }), 'name', item => item.expPercentage > 0 ? ` (+${item.expPercentage}% exp)` : '');
        populateSelect('fruit-select', gameItems.powers.demonFruits, 'baseCoins', 'name', item => item.baseCoins > 0 ? ` (+${item.baseCoins}x coins)` : '');
        populateSelect('eyes-select', gameItems.powers.powerEyes, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier }), 'name', this.getItemBonusText);
        populateSelect('virtue-select', gameItems.powers.virtues, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier }), 'name', this.getItemBonusText);

        populateSelect('level-aura-select', gameItems.auras, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier, souls: item.souls }), 'name', this.getItemBonusText);
        populateSelect('level-mask-select', gameItems.equipment.masks, item => JSON.stringify({ coins: item.baseCoins, exp: item.expPercentage }), 'name', this.getMaskBonusText);
        populateSelect('level-cloak-select', gameItems.equipment.cloaks, item => JSON.stringify({ exp: item.expPercentage }), 'name', item => item.expPercentage > 0 ? ` (+${item.expPercentage}% exp)` : '');
        populateSelect('level-eyes-select', gameItems.powers.powerEyes, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier }), 'name', this.getItemBonusText);
        populateSelect('level-virtue-select', gameItems.powers.virtues, item => JSON.stringify({ coins: item.coinsMultiplier, exp: item.expMultiplier }), 'name', this.getItemBonusText);
    }

    init() {
        this.setupEventListeners();
        this.populateDropdowns();
        this.showTab('home');
        this.syncDPSInputs();
        this.updateMobSelect();
        this.updateLevelMobSelect();
        this.updateClickerSpeedDisplay();
        
        if (window.location.search) {
            this.loadFromUrl();
        }
        
        this.requestNotificationPermission();
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
        
        const quickDPSInputs = ['quick-dps-input', 'quick-dps-suffix', 'quick-farm-hours', 'mob-select'];
        quickDPSInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.runCalculations());
            document.getElementById(id)?.addEventListener('change', () => this.runCalculations());
        });

        document.querySelectorAll('.config-panel input, .config-panel select').forEach(el => {
            el.addEventListener('change', () => this.runCalculations());
        });

        document.querySelectorAll('input[name="farm-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.runCalculations());
        });

        const levelInputs = [
            'level-current-level', 'level-target-level', 'level-current-xp', 'level-prestige-select', 
            'level-mob-select', 'level-dps-input', 'level-dps-suffix', 'level-exp-potion',
            'level-potion-days', 'level-potion-hours', 'level-potion-minutes',
            'level-double-exp-gamepass', 'level-vip-gamepass', 'level-aura-select', 
            'level-mask-select', 'level-cloak-select', 'level-eyes-select', 'level-virtue-select'
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

        document.getElementById('level-current-level')?.addEventListener('change', () => {
            this.updateTargetLevelOptions();
            this.calculateLevelProgress();
        });

        document.getElementById('level-prestige-select')?.addEventListener('change', () => {
            this.updateTargetLevelOptions();
            this.calculateLevelProgress();
        });

        document.getElementById('level-exp-potion')?.addEventListener('change', () => {
            this.toggleExpPotionDuration();
            this.calculateLevelProgress();
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

        document.getElementById('toggle-config')?.addEventListener('click', () => this.toggleConfig());
        document.getElementById('select-all-gamepasses')?.addEventListener('click', () => this.selectAllGamepasses());
        document.getElementById('farm-world-select')?.addEventListener('change', () => this.updateMobSelect());
        document.getElementById('level-world-select')?.addEventListener('change', () => this.updateLevelMobSelect());
        document.getElementById('world-select')?.addEventListener('change', () => this.onWorldSelectionChange());
        
        document.querySelector('.mobile-menu')?.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.toggle('active');
        });
    }

    syncDPSInputs() {
        const dpsInput = document.getElementById('dps-input');
        const dpsSuffix = document.getElementById('dps-suffix');
        const quickDpsInput = document.getElementById('quick-dps-input');
        const quickDpsSuffix = document.getElementById('quick-dps-suffix');
        const levelDpsInput = document.getElementById('level-dps-input');
        const levelDpsSuffix = document.getElementById('level-dps-suffix');

        const sync = (source, targets) => {
            targets.forEach(target => {
                if (target && target !== source) target.value = source.value;
            });
        };

        [dpsInput, quickDpsInput, levelDpsInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    sync(input, [dpsInput, quickDpsInput, levelDpsInput]);
                    this.onDPSChange();
                    this.runCalculations();
                    this.calculateLevelProgress();
                });
            }
        });

        [dpsSuffix, quickDpsSuffix, levelDpsSuffix].forEach(suffix => {
            if (suffix) {
                suffix.addEventListener('change', () => {
                    sync(suffix, [dpsSuffix, quickDpsSuffix, levelDpsSuffix]);
                    this.onDPSChange();
                    this.runCalculations();
                    this.calculateLevelProgress();
                });
            }
        });
    }

    toggleConfig() {
        const configPanel = document.getElementById('config-panel');
        const toggleBtn = document.getElementById('toggle-config');
        if (configPanel && toggleBtn) {
            this.configCollapsed = !this.configCollapsed;
            configPanel.classList.toggle('collapsed', this.configCollapsed);
            toggleBtn.innerHTML = this.configCollapsed ? '<i class="fas fa-cog"></i> Equipment & Bonuses' : '<i class="fas fa-times"></i> Hide Config';
        }
    }

    selectAllGamepasses() {
        const gamepasses = ['vip-gamepass', 'premium-benefits', 'double-coins-gamepass', 'double-exp-gamepass', 'double-souls-gamepass'];
        const allSelected = gamepasses.every(id => document.getElementById(id)?.checked);
        gamepasses.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = !allSelected;
        });
        this.runCalculations();
        const btn = document.getElementById('select-all-gamepasses');
        if (btn) btn.innerHTML = allSelected ? '<i class="fas fa-check-double"></i> All Gamepasses' : '<i class="fas fa-times"></i> Clear All';
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
        
        const maxWaves = 1000;
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