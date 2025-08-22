class ScreenshotManager {
    constructor() {
        this.currentScreenshot = null;
        this.canvas = null;
        this.init();
    }

    init() {
        this.loadHtml2Canvas();
        this.setupEventListeners();
    }

    loadHtml2Canvas() {
        if (typeof html2canvas !== 'undefined') {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
            console.log('html2canvas loaded successfully');
        };
        script.onerror = () => {
            console.warn('Failed to load html2canvas from CDN');
        };
        document.head.appendChild(script);
    }

    setupEventListeners() {
        document.getElementById('screenshot-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'screenshot-modal') {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }

    async takeScreenshot(tabName) {
        try {
            const element = this.getScreenshotElement(tabName);
            if (!element) {
                this.showError('Could not find content to capture');
                return;
            }

            if (typeof html2canvas === 'undefined') {
                this.showShareUrlFallback(tabName);
                return;
            }

            this.showLoadingNotification();
            
            const canvas = await html2canvas(element, {
                backgroundColor: '#1a1a2e',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: false,
                foreignObjectRendering: false,
                imageTimeout: 0,
                removeContainer: true
            });
            
            this.showScreenshotModal(canvas, tabName);
            this.hideLoadingNotification();
            
        } catch (error) {
            console.error('Screenshot error:', error);
            this.hideLoadingNotification();
            this.showShareUrlFallback(tabName);
        }
    }

    getScreenshotElement(tabName) {
        const selectors = {
            'time-to-kill': '.results-panel',
            'loot-calculator': '.calculator-layout',
            'level-progression': '.results-panel', 
            'rank-up': '.results-panel',
            'config': '.multiplier-display'
        };
        
        const selector = selectors[tabName];
        const element = selector ? document.querySelector(selector) : null;
        
        if (!element) {
            return document.querySelector(`#${tabName}`);
        }
        
        return element;
    }

    showScreenshotModal(canvas, tabName) {
        const modal = document.getElementById('screenshot-modal');
        const modalCanvas = document.getElementById('screenshot-canvas');
        
        if (!modal || !modalCanvas) {
            this.showError('Screenshot modal not found');
            return;
        }
        
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
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    showShareUrlFallback(tabName) {
        const shareUrl = this.generateShareUrl(tabName);
        
        this.showNotification('Share URL Generated', 
            `<div style="margin-top: 0.5rem;">
                <input type="text" value="${shareUrl}" readonly style="width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid #6a0dad; border-radius: 5px; color: white; font-size: 12px;">
                <button onclick="window.screenshotManager.copyUrlFromNotification('${shareUrl}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #6a0dad; border: none; border-radius: 5px; color: white; cursor: pointer; width: 100%;">Copy URL</button>
            </div>`, 
            'info', 15000);
    }

    generateShareUrl(tabName = null) {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        if (tabName) {
            params.set('tab', tabName);
        }
        
        const app = window.app;
        if (!app) {
            return baseUrl;
        }
        
        const currentTab = tabName || app.currentTab;
        
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

    async downloadScreenshot() {
        if (!this.currentScreenshot) {
            this.showError('No screenshot available');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.download = `anime-eternal-${this.currentScreenshot.tabName}-${Date.now()}.png`;
            link.href = this.currentScreenshot.canvas.toDataURL('image/png');
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('Screenshot Downloaded', 'Image saved successfully!');
            this.closeModal();
            
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download screenshot');
        }
    }

    async copyScreenshotToClipboard() {
        if (!this.currentScreenshot) {
            this.showError('No screenshot available');
            return;
        }
        
        try {
            if (!navigator.clipboard || !window.ClipboardItem) {
                this.showError('Clipboard not supported in this browser');
                return;
            }
            
            this.currentScreenshot.canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    
                    this.showSuccess('Copied to Clipboard', 'Screenshot copied! Paste it anywhere.');
                    this.closeModal();
                    
                } catch (error) {
                    console.error('Clipboard write error:', error);
                    this.showError('Failed to copy to clipboard');
                }
            }, 'image/png');
            
        } catch (error) {
            console.error('Clipboard error:', error);
            this.showError('Clipboard operation failed');
        }
    }

    copyShareUrl() {
        const url = this.generateShareUrl(this.currentScreenshot?.tabName);
        
        try {
            navigator.clipboard.writeText(url).then(() => {
                this.showSuccess('URL Copied', 'Share URL copied to clipboard!');
                this.closeModal();
            }).catch(() => {
                this.fallbackCopyTextToClipboard(url);
            });
        } catch (error) {
            this.fallbackCopyTextToClipboard(url);
        }
    }

    copyUrlFromNotification(url) {
        try {
            navigator.clipboard.writeText(url).then(() => {
                this.showSuccess('URL Copied', 'Share URL copied to clipboard!');
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
            this.showSuccess('URL Copied', 'Share URL copied to clipboard!');
            this.closeModal();
        } catch (error) {
            this.showError('Failed to copy URL');
        }
        
        document.body.removeChild(textArea);
    }

    closeModal() {
        const modal = document.getElementById('screenshot-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.remove('active');
                modal.style.display = 'none';
                this.currentScreenshot = null;
            }, 300);
        }
    }

    isModalOpen() {
        const modal = document.getElementById('screenshot-modal');
        return modal && modal.classList.contains('active');
    }

    showLoadingNotification() {
        this.loadingNotification = this.showNotification(
            'Generating Screenshot', 
            'Please wait while we capture the image...', 
            'info', 
            10000
        );
    }

    hideLoadingNotification() {
        if (this.loadingNotification && this.loadingNotification.parentElement) {
            this.loadingNotification.remove();
        }
    }

    showNotification(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return null;

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

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutNotification 0.5s ease-in forwards';
                    setTimeout(() => notification.remove(), 500);
                }
            }, duration);
        }

        return notification;
    }

    showSuccess(title, message) {
        this.showNotification(title, message, 'success', 3000);
    }

    showError(message) {
        this.showNotification('Error', message, 'error', 5000);
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
}

function closeScreenshotModal() {
    if (window.screenshotManager) {
        window.screenshotManager.closeModal();
    }
}

function downloadScreenshot() {
    if (window.screenshotManager) {
        window.screenshotManager.downloadScreenshot();
    }
}

function copyScreenshotToClipboard() {
    if (window.screenshotManager) {
        window.screenshotManager.copyScreenshotToClipboard();
    }
}

function copyShareUrl() {
    if (window.screenshotManager) {
        window.screenshotManager.copyShareUrl();
    }
}

function takeScreenshot(tabName) {
    if (window.screenshotManager) {
        window.screenshotManager.takeScreenshot(tabName);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.screenshotManager = new ScreenshotManager();
    console.log('Screenshot manager initialized');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScreenshotManager;
}