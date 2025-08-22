(function() {
    'use strict';
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
    });
    
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160) {
            if (!devtools.open) {
                devtools.open = true;
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;color:#fff;background:#000;">Access Denied</div>';
            }
        }
    }, 500);
    
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    setInterval(function() {
        console.clear();
    }, 1000);
})();

const xpRequiredForLevel = Object.freeze([
    0, 0, 10, 21, 33, 46, 61, 77, 95, 115, 137, 161, 187, 216, 248, 283, 321, 363, 409, 460, 516, 
    578, 646, 721, 803, 893, 992, 1101, 1221, 1353, 1498, 1658, 1834, 2027, 2240, 2474, 2731, 3014, 
    3325, 3668, 4045, 4460, 4916, 5418, 5970, 6577, 7245, 7980, 8788, 9677, 10655, 11731, 12914, 
    14215, 15647, 17222, 18954, 20859, 22955, 25261, 27797, 30587, 33656, 37032, 40745, 44830, 49323, 
    54265, 59702, 65682, 72260, 79496, 87456, 96212, 105843, 116437, 128091, 140910, 155011, 170522, 
    187584, 206352, 226997, 249707, 274688, 302167, 332394, 365643, 402217, 442449, 486704, 535384, 
    588932, 647835, 712629, 783902, 862302, 948542, 1043406, 1147757, 1262543, 1388807, 1527698, 
    1680478, 1848536, 2033400, 2236750, 2460435, 2706489, 2977148, 3274873, 3602370, 3962617, 4358889, 
    4794788, 5274277, 5801715, 6381897, 7020097, 7722117, 8494339, 9343783, 10278171, 11305998, 
    12436608, 13680279, 15048317, 16553159, 18208485, 20029344, 22032288, 24235527, 26659090, 29325009, 
    32257520, 35483282, 39031620, 42934792, 47228281, 51951119, 57146241, 62860875, 69146973, 76061680, 
    83667858, 92034654, 101238129, 111361952, 122498157, 134747983, 148222791, 163045080, 179349598, 
    197284568, 217013035, 238714349, 262585794, 288844383, 317728831, 349501724, 384451906, 422897107, 
    465186828, 511705521, 562876083, 619163701, 681080081, 749188099, 824106919, 906517621, 997169393, 
    1096886342, 1206574986, 1327232495, 1459955755, 1605951341, 1766546485, 1943201144, 2137521268, 
    2351273405, 2586400756, 2845040842, 3129544936, 3442499440, 3786749394, 4165424343, 4581966787, 
    5040163476, 5544179834, 6098597827, 6708457620, 7379303392, 8117233741, 8928957125, 9821852848, 
    10804038143, 11884441967, 13072886174, 14380174801, 15818192291, 17400011530, 19140012693, 
    21054013972, 23159415379, 25475356927, 28022892630, 30825181903, 33907700103, 37298470123, 
    41028317145, 45131148870, 49644263767, 54608690154, 60069559179, 66076515107, 72684166628, 
    79952583301, 87947841641, 96742625815, 106416888407, 117058577258, 128764434994, 141640878503, 
    155804966363, 171385463009, 188524009320, 207376410262, 228114051298, 250925456438, 276018002092, 
    303619802311
]);

const energyRequiredForRank = Object.freeze([
    null, 9000, 245000, 1300000, 3700000, 13600000, 150000000, 1100000000, 13000000000, 27000000000, 
    350000000000, 825000000000, 1.47e12, 3.9e12, 22.5e12, 211e12, 2.99e15, 499e15, 10e18, 400e18, 
    7.8e21, 33e21, 495e21, 1.25e24, 14e24, 69e24, 475e24, 7.21e27, 39.8e27, 284e27, 769e27, 1.25e30, 
    5e30, 22.2e30, 500e30, 6.9e33, 9.9e33, 27.8e33, 76.9e33, 100e33, 642e33, 7e36, 80e36, 900e36, 
    1e39, 9.99e39, 85e39, 498e39, 5e42, 64.2e42, 500e42, 998e42, 4e45, 90e45, 64.2e45, 100e45, 
    998e45, 5e48, 10e48, 68.9e48, 541e48, 9e51, 200e51, 6.32e54, 91e54, 900e54, 4e57, 10e57, 50e57, 
    375e57, 1.1e60, 11e60, 55e60, 310e60, 10e63
]);

const numberSuffixes = Object.freeze([
    "K", "M", "B", "T", "qd", "Qn", "sx", "Sp", "O", "N", "de", "Ud", "DD", "tdD", 
    "qdD", "QnD", "sxD", "SpD", "OcD", "NvD", "Vgn", "UVg", "DVg", "TVg", "qtV", 
    "QnV", "SeV", "SPG", "OcG", "NoG", "DcG", "TdG", "QdG", "QnG", "SxG", "SpG", 
    "OtG", "NoA", "DcA", "TdA", "QdA", "QnA", "SxA", "SpA", "OtA", "NoS", "DcS", 
    "TdS", "QdS", "QnS", "SxS", "SpS", "OtS", "NoP", "DcP", "TdP", "QdP", "QnP", 
    "SxP", "SpP", "OtP", "NoE", "DcE", "TdE", "QdE", "QnE", "SxE", "SpE", "OtE", 
    "NoZ", "DcZ", "TdZ", "QdZ", "QnZ", "SxZ", "SpZ", "OtZ", "NoY", "DcY", "TdY", 
    "QdY", "QnY", "SxY", "SpY", "OtY", "NoX", "DcX", "TdX", "QdX", "QnX", "SxX", 
    "SpX", "OtX", "NoW", "DcW", "TdW", "QdW", "QnW", "SxW", "SpW", "OtW", "NoV", 
    "DcV", "TdV", "QdV", "QnV", "SxV", "SpV", "OtV", "NoU", "DcU", "TdU", "QdU", 
    "QnU", "SxU", "SpU", "OtU", "NoT", "DcT", "TdT", "QdT", "QnT", "SxT", "SpT", 
    "OtT", "NoR", "DcR", "TdR", "QdR", "QnR", "SxR", "SpR", "OtR", "NoQ", "DcQ", 
    "TdQ", "QdQ", "QnQ", "SxQ", "SpQ", "OtQ"
]);

/**
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
    if (num === 0 || !isFinite(num)) return "0";
    
    const absNum = Math.abs(num);
    const isNegative = num < 0;
    
    if (absNum < 1000) {
        return (isNegative ? "-" : "") + Math.round(absNum).toLocaleString();
    }
    
    const suffixIndex = Math.floor(Math.log10(absNum) / 3) - 1;
    
    if (suffixIndex < 0 || suffixIndex >= numberSuffixes.length) {
        return (isNegative ? "-" : "") + absNum.toExponential(2);
    }
    
    const divisor = Math.pow(1000, suffixIndex + 1);
    const displayNum = absNum / divisor;
    
    const suffix = numberSuffixes[suffixIndex];
    
    let formatted;
    if (displayNum >= 100) {
        formatted = Math.round(displayNum).toString();
    } else if (displayNum >= 10) {
        const rounded = Math.round(displayNum * 10) / 10;
        formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    } else {
        const rounded = Math.round(displayNum * 100) / 100;
        formatted = rounded % 1 === 0 ? rounded.toString() : 
                   (rounded * 10) % 1 === 0 ? rounded.toFixed(1) : rounded.toFixed(2);
    }
    
    return (isNegative ? "-" : "") + formatted + suffix;
}

function getXpForLevel(level) {
    if (level > 0 && level < xpRequiredForLevel.length) {
        return xpRequiredForLevel[level];
    }
    return null;
}

function getMaxLevel() {
    return xpRequiredForLevel.length - 1;
}

function getEnergyForRank(currentRank) {
    if (currentRank > 0 && currentRank < energyRequiredForRank.length) {
        return energyRequiredForRank[currentRank];
    }
    return null;
}

function getMaxRank() {
    return energyRequiredForRank.length - 1;
}

function getMultiplierForRank(currentRank) {
    if (currentRank < 1) return 0;
    return Math.pow(2, currentRank - 1);
}

const xpTable = Object.freeze(
    xpRequiredForLevel.slice(1).map((xpRequired, index) => ({
        level: index + 1,
        xpRequired: xpRequired
    }))
);

const rankData = Object.freeze(
    energyRequiredForRank.slice(1).map((energyRequired, index) => {
        const currentRank = index + 1;
        const maxRank = getMaxRank();
        return {
            currentRank: currentRank,
            nextRank: currentRank < maxRank ? currentRank + 1 : null,
            energyRequired: energyRequired,
            energyMultiplier: getMultiplierForRank(currentRank)
        };
    })
);

const prestigeConfig = Object.freeze({
    0: { levelCap: 200, expMultiplier: 1.0 },
    1: { levelCap: 210, expMultiplier: 1.1 },
    2: { levelCap: 220, expMultiplier: 1.2 },
    3: { levelCap: 230, expMultiplier: 1.3 }
});

const energyPotions = Object.freeze({
    none: { name: "None", multiplier: 1.0, duration: 0 },
    small: { name: "Small Energy Potion (+50%)", multiplier: 1.5, duration: 15 * 60 },
    large: { name: "Energy Potion (+100%)", multiplier: 2.0, duration: 15 * 60 }
});

const expPotions = Object.freeze({
    none: { name: "None", multiplier: 1.0, duration: 0 },
    active: { name: "Exp Potion (2x XP for 15min)", multiplier: 2.0, duration: 15 * 60 }
});

const coinPotions = Object.freeze({
    none: { name: "None", multiplier: 1.0, duration: 0 },
    small: { name: "Small Coins Potion (+50% Coins for 15min)", multiplier: 1.5, duration: 15 * 60 },
    regular: { name: "Coins Potion (+100% Coins for 15min)", multiplier: 2.0, duration: 15 * 60 }
});

const dropPotions = Object.freeze({
    none: { name: "None", multiplier: 1.0, duration: 0 },
    active: { name: "Drop Potion (2x Token Drops for 15min)", multiplier: 2.0, duration: 15 * 60 }
});

const soulPotions = Object.freeze({
    none: { name: "None", multiplier: 1.0, duration: 0 },
    active: { name: "Soul Potion (2x Avatar Souls for 15min)", multiplier: 2.0, duration: 15 * 60 }
});

const gameUpgrades = Object.freeze({
    dungeonExpUpgrades: {
        name: "Dungeon EXP Upgrades",
        maxLevel: 10,
        bonusPerLevel: 5,
        maxBonus: 50,
        description: "Increases EXP gain"
    },
    coinUpgrades: {
        name: "Coin Upgrades",
        maxLevel: 30,
        bonusPerLevel: 5,
        maxBonus: 150,
        description: "Increases coin gain"
    },
    upgradeDrops: {
        name: "Upgrade Drops",
        maxLevel: 13,
        bonusPerLevel: 0.05,
        maxBonus: 0.65,
        description: "Increases the drop amount of tokens"
    },
    avatarSoulsUpgrade: {
        name: "Avatar Souls Upgrade",
        maxLevel: 19,
        bonusPerLevel: 0.05,
        maxBonus: 0.95,
        description: "Increases the amount of avatar souls"
    },
    demonLordLevel: {
        name: "Demon Lord Level",
        maxLevel: 100,
        bonusPerLevel: 0.01,
        maxBonus: 1.0,
        description: "Each level increases coin gain by 1% (multiplier)"
    }
});

const gameAchievements = Object.freeze({
    totalCoinsAchievements: {
        name: "Total Coins Achievements",
        tiers: [
            { tier: "I", bonus: 5, description: "Total Coins Tier I - +5% coin gain" },
            { tier: "II", bonus: 5, description: "Total Coins Tier II - +5% coin gain" },
            { tier: "III", bonus: 5, description: "Total Coins Tier III - +5% coin gain" },
            { tier: "IV", bonus: 5, description: "Total Coins Tier IV - +5% coin gain" },
            { tier: "V", bonus: 5, description: "Total Coins Tier V - +5% coin gain" },
            { tier: "VI", bonus: 5, description: "Total Coins Tier VI - +5% coin gain" },
            { tier: "VII", bonus: 5, description: "Total Coins Tier VII - +5% coin gain" },
            { tier: "VIII", bonus: 5, description: "Total Coins Tier VIII - +5% coin gain" },
            { tier: "IX", bonus: 5, description: "Total Coins Tier IX - +5% coin gain" },
            { tier: "X", bonus: 5, description: "Total Coins Tier X - +5% coin gain" },
            { tier: "XI", bonus: 5, description: "Total Coins Tier XI - +5% coin gain" },
            { tier: "XII", bonus: 5, description: "Total Coins Tier XII - +5% coin gain" },
            { tier: "XIII", bonus: 5, description: "Total Coins Tier XIII - +5% coin gain" },
            { tier: "XIV", bonus: 5, description: "Total Coins Tier XIV - +5% coin gain" },
            { tier: "XV", bonus: 5, description: "Total Coins Tier XV - +5% coin gain" }
        ],
        stackable: true,
        description: "Achievements for total coins collected - each tier is independent"
    },
    dungeonAchievements: {
        name: "Dungeon Achievements",
        tiers: [
            { name: "Dungeon Easy IV", bonus: 5, description: "Complete Dungeon Easy IV - +5% coin gain" },
            { name: "Dungeon Medium IV", bonus: 5, description: "Complete Dungeon Medium IV - +5% coin gain" },
            { name: "Dungeon Hard IV", bonus: 5, description: "Complete Dungeon Hard IV - +5% coin gain" },
            { name: "Dungeon Insane IV", bonus: 5, description: "Complete Dungeon Insane IV - +5% coin gain" },
            { name: "Dungeon Crazy IV", bonus: 10, description: "Complete Dungeon Crazy IV - +10% coin gain" },
            { name: "Dungeon Nightmare IV", bonus: 5, description: "Complete Dungeon Nightmare IV - +5% coin gain" }
        ],
        maxBonus: 35,
        description: "Achievements for completing dungeons"
    },
    worldQuestAchievements: {
        name: "World Quest Achievements",
        quests: [
            { world: "Earth City", bonus: 5, description: "Complete Earth City quests - +5% coin gain" },
            { world: "Windmill Island", bonus: 5, description: "Complete Windmill Island quests - +5% coin gain" },
            { world: "Soul Society", bonus: 5, description: "Complete Soul Society quests - +5% coin gain" },
            { world: "Cursed School", bonus: 5, description: "Complete Cursed School quests - +5% coin gain" },
            { world: "Slayer Village", bonus: 5, description: "Complete Slayer Village quests - +5% coin gain" },
            { world: "Solo Island", bonus: 5, description: "Complete Solo Island quests - +5% coin gain" },
            { world: "Clover Village", bonus: 5, description: "Complete Clover Village quests - +5% coin gain" },
            { world: "Leaf Village", bonus: 5, description: "Complete Leaf Village quests - +5% coin gain" },
            { world: "Spirit Residence", bonus: 5, description: "Complete Spirit Residence quests - +5% coin gain" },
            { world: "Magic Hunter City", bonus: 5, description: "Complete Magic Hunter City quests - +5% coin gain" },
            { world: "Titan City", bonus: 5, description: "Complete Titan City quests - +5% coin gain" },
            { world: "Village of Sins", bonus: 5, description: "Complete Village of Sins quests - +5% coin gain" },
            { world: "Kaiju Base", bonus: 4, description: "Complete Kaiju Base quests - +4% coin gain" },
            { world: "Tempest Capital", bonus: 3, description: "Complete Tempest Capital quests - +3% coin gain" },
            { world: "Virtual City", bonus: 2, description: "Complete Virtual City quests - +2% coin gain" }
        ],
        stackable: true,
        description: "Achievements for completing world quests - each world is independent"
    }
});

const gameItems = Object.freeze({
    auras: [
        { 
            name: "None", 
            coinsMultiplier: 0, 
            expMultiplier: 0, 
            souls: 0,
            tokenDrops: 0,
            description: "No aura equipped"
        },
        { 
            name: "Flaming Aura", 
            coinsMultiplier: 0.15,
            description: "Increases coin gain by 0.15x multiplier"
        },
        { 
            name: "Fire King Aura", 
            tokenDrops: 0.25,
            description: "Increases token drop amount by 25%"
        }
    ],
    jewelry: {
        rings: [
            { name: "None", multiplier: 0, description: "No ring equipped" },
            { name: "Bronze Coin Ring", multiplier: 0.10, description: "Increases coin gain by 0.10x multiplier" },
            { name: "Silver Coin Ring", multiplier: 0.25, description: "Increases coin gain by 0.25x multiplier" },
            { name: "Gold Coin Ring", multiplier: 0.50, description: "Increases coin gain by 0.50x multiplier" },
            { name: "Rose Gold Coin Ring", multiplier: 0.75, description: "Increases coin gain by 0.75x multiplier" }
        ],
        necklaces: [
            { name: "None", multiplier: 0, description: "No necklace equipped" },
            { name: "Bronze Coin Necklace", multiplier: 0.10, description: "Increases coin gain by 0.10x multiplier" },
            { name: "Silver Coin Necklace", multiplier: 0.25, description: "Increases coin gain by 0.25x multiplier" },
            { name: "Gold Coin Necklace", multiplier: 0.50, description: "Increases coin gain by 0.50x multiplier" },
            { name: "Rose Gold Coin Necklace", multiplier: 0.75, description: "Increases coin gain by 0.75x multiplier" }
        ],
        earrings: [
            { name: "None", multiplier: 0, description: "No earrings equipped" },
            { name: "Bronze Coin Earrings", multiplier: 0.10, description: "Increases coin gain by 0.10x multiplier" },
            { name: "Silver Coin Earrings", multiplier: 0.25, description: "Increases coin gain by 0.25x multiplier" },
            { name: "Gold Coin Earrings", multiplier: 0.50, description: "Increases coin gain by 0.50x multiplier" },
            { name: "Rose Gold Coin Earrings", multiplier: 0.75, description: "Increases coin gain by 0.75x multiplier" }
        ]
    },
    accessories: {
        hats: [
            { name: "None", baseCoins: 0, description: "No hat equipped" },
            { name: "4 Star Hat 1", baseCoins: 0.100, description: "Adds 0.1 base coins per kill" },
            { name: "4 Star Hat 2", baseCoins: 0.150, description: "Adds 0.15 base coins per kill" },
            { name: "4 Star Hat 3", baseCoins: 0.200, description: "Adds 0.2 base coins per kill" },
            { name: "4 Star Hat 4", baseCoins: 0.250, description: "Adds 0.25 base coins per kill" },
            { name: "4 Star Hat 5", baseCoins: 0.300, description: "Adds 0.3 base coins per kill" },
            { name: "4 Star Hat 6", baseCoins: 0.350, description: "Adds 0.35 base coins per kill" },
            { name: "4 Star Hat 7", baseCoins: 0.500, description: "Adds 0.5 base coins per kill" }
        ],
        scarfs: [
            { name: "None", baseCoins: 0, description: "No scarf equipped" },
            { name: "Red Scarf 1", baseCoins: 0.300, description: "Adds 0.3 base coins per kill" },
            { name: "Red Scarf 2", baseCoins: 0.450, description: "Adds 0.45 base coins per kill" },
            { name: "Red Scarf 3", baseCoins: 0.600, description: "Adds 0.6 base coins per kill" },
            { name: "Red Scarf 4", baseCoins: 0.750, description: "Adds 0.75 base coins per kill" },
            { name: "Red Scarf 5", baseCoins: 0.900, description: "Adds 0.9 base coins per kill" },
            { name: "Red Scarf 6", baseCoins: 1.200, description: "Adds 1.2 base coins per kill" },
            { name: "Red Scarf 7", baseCoins: 1.500, description: "Adds 1.5 base coins per kill" }
        ],
        masks: [
            { name: "None", baseCoins: 0, expPercentage: 0, description: "No mask equipped" },
            { name: "Slime Mask 1", baseCoins: 0.050, expPercentage: 1.0, description: "Adds 0.05 base coins + 1% exp boost" },
            { name: "Slime Mask 2", baseCoins: 0.075, expPercentage: 1.5, description: "Adds 0.075 base coins + 1.5% exp boost" },
            { name: "Slime Mask 3", baseCoins: 0.100, expPercentage: 2.0, description: "Adds 0.1 base coins + 2% exp boost" },
            { name: "Slime Mask 4", baseCoins: 0.125, expPercentage: 2.5, description: "Adds 0.125 base coins + 2.5% exp boost" },
            { name: "Slime Mask 5", baseCoins: 0.150, expPercentage: 3.0, description: "Adds 0.15 base coins + 3% exp boost" },
            { name: "Slime Mask 6", baseCoins: 0.175, expPercentage: 3.5, description: "Adds 0.175 base coins + 3.5% exp boost" },
            { name: "Slime Mask 7", baseCoins: 0.250, expPercentage: 5.0, description: "Adds 0.25 base coins + 5% exp boost" }
        ],
        cloaks: [
            { name: "None", expPercentage: 0, description: "No cloak equipped" },
            { name: "Armless Cloak 1", expPercentage: 1.0, description: "Increases exp gain by 1%" },
            { name: "Armless Cloak 2", expPercentage: 1.5, description: "Increases exp gain by 1.5%" },
            { name: "Armless Cloak 3", expPercentage: 2.0, description: "Increases exp gain by 2%" },
            { name: "Armless Cloak 4", expPercentage: 2.5, description: "Increases exp gain by 2.5%" },
            { name: "Armless Cloak 5", expPercentage: 3.0, description: "Increases exp gain by 3%" },
            { name: "Armless Cloak 6", expPercentage: 3.5, description: "Increases exp gain by 3.5%" },
            { name: "Armless Cloak 7", expPercentage: 5.0, description: "Increases exp gain by 5%" }
        ]
    },
    powers: {
        demonFruits: [
            { name: "None", baseCoins: 0, description: "No demon fruit power" },
            { name: "Money Fruit", baseCoins: 1.0, description: "Adds 1 base coin per kill" }
        ],
        powerEyes: [
            { name: "None", coinsMultiplier: 0, description: "No power eyes" },
            { name: "Cyclone Eye", coinsMultiplier: 0.5, description: "Increases coin gain by 0.5x multiplier" },
            { name: "Atomic Insight Eye", coinsMultiplier: 1.0, description: "Increases coin gain by 1.0x multiplier" },
            { name: "Eye Of Six Paths", coinsMultiplier: 1.0, description: "Increases coin gain by 1.0x multiplier" }
        ],
        virtues: [
            { name: "None", coinsMultiplier: 0, expMultiplier: 0, description: "No virtue power" },
            { name: "Truth", coinsMultiplier: 1.0, description: "Increases coin gain by 1.0x multiplier" },
            { name: "Love", coinsMultiplier: 1.0, description: "Increases coin gain by 1.0x multiplier" }
        ]
    }
});

const gameData = Object.freeze([
    { name: "Kriluni", hp: 5000, world: "Earth City", rank: "E", coins: 50, exp: 1 },
    { name: "Ymicha", hp: 230000, world: "Earth City", rank: "D", coins: 100, exp: 2 },
    { name: "Tian Shan", hp: 5000000, world: "Earth City", rank: "C", coins: 150, exp: 3 },
    { name: "Kohan", hp: 30000000, world: "Earth City", rank: "B", coins: 200, exp: 4 },
    { name: "Picco", hp: 100000000, world: "Earth City", rank: "A", coins: 250, exp: 5 },
    { name: "Koku", hp: 240000000, world: "Earth City", rank: "S", coins: 300, exp: 6 },
    { name: "Kid Kohan", hp: 2.5e15, world: "Earth City", rank: "SS", coins: 700, exp: 15 },
    
    { name: "Nomi", hp: 4.5e9, world: "Windmill Island", rank: "E", coins: 500, exp: 4 },
    { name: "Usup", hp: 7e10, world: "Windmill Island", rank: "D", coins: 1000, exp: 5 },
    { name: "Robins", hp: 2.5e11, world: "Windmill Island", rank: "C", coins: 1500, exp: 6 },
    { name: "Senji", hp: 1.2e12, world: "Windmill Island", rank: "B", coins: 2000, exp: 8 },
    { name: "Zaro", hp: 5e13, world: "Windmill Island", rank: "A", coins: 2500, exp: 10 },
    { name: "Loffy", hp: 1.2e14, world: "Windmill Island", rank: "S", coins: 3000, exp: 12 },
    { name: "Shanks", hp: 5e21, world: "Windmill Island", rank: "SS", coins: 7000, exp: 30 },
    
    { name: "Hime", hp: 1.5e14, world: "Soul Society", rank: "E", coins: 5000, exp: 8 },
    { name: "Ichige", hp: 2.5e15, world: "Soul Society", rank: "D", coins: 10000, exp: 10 },
    { name: "Uryua", hp: 5.5e16, world: "Soul Society", rank: "C", coins: 15000, exp: 12 },
    { name: "Rakiu", hp: 1.6e17, world: "Soul Society", rank: "B", coins: 20000, exp: 16 },
    { name: "Yoichi", hp: 8.5e17, world: "Soul Society", rank: "A", coins: 25000, exp: 20 },
    { name: "Kahara", hp: 1e18, world: "Soul Society", rank: "S", coins: 30000, exp: 24 },
    { name: "Eizen", hp: 2.5e24, world: "Soul Society", rank: "SS", coins: 70000, exp: 60 },
    
    { name: "Itodo", hp: 1.5e18, world: "Cursed School", rank: "E", coins: 50000, exp: 16 },
    { name: "Nebara", hp: 5e19, world: "Cursed School", rank: "D", coins: 100000, exp: 20 },
    { name: "Magum", hp: 1.1e20, world: "Cursed School", rank: "C", coins: 150000, exp: 24 },
    { name: "Meki", hp: 4.75e20, world: "Cursed School", rank: "B", coins: 200000, exp: 32 },
    { name: "Tage", hp: 9.69e21, world: "Cursed School", rank: "A", coins: 250000, exp: 40 },
    { name: "Gajo", hp: 5e22, world: "Cursed School", rank: "S", coins: 300000, exp: 48 },
    { name: "Sakuni", hp: 1.2e26, world: "Cursed School", rank: "SS", coins: 700000, exp: 120 },
    
    { name: "Nazuki", hp: 1e23, world: "Slayer Village", rank: "E", coins: 500000, exp: 32 },
    { name: "Tenjar", hp: 5e23, world: "Slayer Village", rank: "D", coins: 1000000, exp: 40 },
    { name: "Zentsu", hp: 2.5e24, world: "Slayer Village", rank: "C", coins: 1500000, exp: 48 },
    { name: "Insake", hp: 1.25e25, world: "Slayer Village", rank: "B", coins: 2000000, exp: 64 },
    { name: "Tamoka", hp: 6.26e25, world: "Slayer Village", rank: "A", coins: 2500000, exp: 80 },
    { name: "Shinabe", hp: 3.12e26, world: "Slayer Village", rank: "S", coins: 3000000, exp: 96 },
    { name: "Rangoki", hp: 3.12e34, world: "Slayer Village", rank: "SS", coins: 7000000, exp: 240 },
    
    { name: "Weak Sung", hp: 6.25e26, world: "Solo Island", rank: "E", coins: 5000000, exp: 64 },
    { name: "Green Goblin", hp: 3.12e27, world: "Solo Island", rank: "D", coins: 10000000, exp: 80 },
    { name: "White Tiger", hp: 1.56e28, world: "Solo Island", rank: "C", coins: 15000000, exp: 96 },
    { name: "Cha", hp: 7.81e28, world: "Solo Island", rank: "B", coins: 20000000, exp: 128 },
    { name: "Choi", hp: 3.91e29, world: "Solo Island", rank: "A", coins: 25000000, exp: 160 },
    { name: "Solo Sung", hp: 1.95e30, world: "Solo Island", rank: "S", coins: 30000000, exp: 192 },
    { name: "Statue of God", hp: 1.95e38, world: "Solo Island", rank: "SS", coins: 70000000, exp: 480 },
    
    { name: "Noalle", hp: 7.8e30, world: "Clover Village", rank: "E", coins: 50000000, exp: 128 },
    { name: "Megna", hp: 8e31, world: "Clover Village", rank: "D", coins: 100000000, exp: 160 },
    { name: "Finrel", hp: 8.43e32, world: "Clover Village", rank: "C", coins: 150000000, exp: 192 },
    { name: "Aste", hp: 9.08e33, world: "Clover Village", rank: "B", coins: 200000000, exp: 256 },
    { name: "Yune", hp: 9.57e34, world: "Clover Village", rank: "A", coins: 250000000, exp: 320 },
    { name: "Yemi", hp: 1.01e36, world: "Clover Village", rank: "S", coins: 300000000, exp: 384 },
    { name: "Novi Chroni", hp: 1.01e44, world: "Clover Village", rank: "SS", coins: 700000000, exp: 960 },
    
    { name: "Sekuri", hp: 2.69e35, world: "Leaf Village", rank: "E", coins: 500000000, exp: 256 },
    { name: "Kid Norto", hp: 2.29e36, world: "Leaf Village", rank: "D", coins: 1000000000, exp: 320 },
    { name: "Kid Seske", hp: 2.41e37, world: "Leaf Village", rank: "C", coins: 1500000000, exp: 384 },
    { name: "Kakashki", hp: 2.54e38, world: "Leaf Village", rank: "B", coins: 2000000000, exp: 512 },
    { name: "Jiria", hp: 2.68e39, world: "Leaf Village", rank: "A", coins: 2500000000, exp: 640 },
    { name: "Tsuni", hp: 2.82e40, world: "Leaf Village", rank: "S", coins: 3000000000, exp: 768 },
    { name: "Itechi", hp: 2.82e48, world: "Leaf Village", rank: "SS", coins: 7000000000, exp: 1920 },
    { name: "Madera", hp: 5.64e48, world: "Leaf Village", rank: "SS", coins: 7000000000, exp: 2880 },
    
    { name: "Ken", hp: 5e40, world: "Spirit Residence", rank: "E", coins: 5000000000, exp: 640 },
    { name: "Aira", hp: 4e41, world: "Spirit Residence", rank: "D", coins: 10000000000, exp: 768 },
    { name: "Jiji", hp: 4.22e42, world: "Spirit Residence", rank: "C", coins: 15000000000, exp: 1024 },
    { name: "Momo", hp: 4.44e43, world: "Spirit Residence", rank: "B", coins: 20000000000, exp: 1280 },
    { name: "Alien", hp: 4.68e44, world: "Spirit Residence", rank: "A", coins: 25000000000, exp: 1536 },
    { name: "Saiko", hp: 4.94e45, world: "Spirit Residence", rank: "S", coins: 30000000000, exp: 3840 },
    { name: "Ken Turbo", hp: 4.94e53, world: "Spirit Residence", rank: "SS", coins: 70000000000, exp: 5760 },
    
    { name: "Lero", hp: 3e46, world: "Magic Hunter City", rank: "E", coins: 50000000000, exp: 1280 },
    { name: "Gone", hp: 2.4e47, world: "Magic Hunter City", rank: "D", coins: 100000000000, exp: 1536 },
    { name: "Karapik", hp: 2.53e48, world: "Magic Hunter City", rank: "C", coins: 150000000000, exp: 2048 },
    { name: "Killas", hp: 2.67e49, world: "Magic Hunter City", rank: "B", coins: 200000000000, exp: 2560 },
    { name: "Hisoker", hp: 2.81e50, world: "Magic Hunter City", rank: "A", coins: 250000000000, exp: 3072 },
    { name: "Illumio", hp: 2.96e51, world: "Magic Hunter City", rank: "S", coins: 300000000000, exp: 7680 },
    { name: "Killas Godspeed", hp: 2.96e59, world: "Magic Hunter City", rank: "SS", coins: 700000000000, exp: 11520 },
    
    { name: "Armin", hp: 5e51, world: "Titan City", rank: "E", coins: 500000000000, exp: 2560 },
    { name: "Annie", hp: 4e52, world: "Titan City", rank: "D", coins: 1e12, exp: 3072 },
    { name: "Mikala", hp: 4.22e53, world: "Titan City", rank: "C", coins: 1.5e12, exp: 4096 },
    { name: "Rainar", hp: 4.44e54, world: "Titan City", rank: "B", coins: 2e12, exp: 5120 },
    { name: "Ervin", hp: 4.68e55, world: "Titan City", rank: "A", coins: 2.5e12, exp: 6144 },
    { name: "Lavi", hp: 4.94e56, world: "Titan City", rank: "S", coins: 3e12, exp: 15360 },
    { name: "Eran", hp: 4.94e64, world: "Titan City", rank: "SS", coins: 7e12, exp: 23040 },
    
    { name: "Diyana", hp: 9.9e56, world: "Village of Sins", rank: "E", coins: 5e12, exp: 5120 },
    { name: "Kyng", hp: 7.92e57, world: "Village of Sins", rank: "D", coins: 1e13, exp: 6144 },
    { name: "Gowen", hp: 8.35e58, world: "Village of Sins", rank: "C", coins: 1.5e13, exp: 8192 },
    { name: "Merlu", hp: 8.8e59, world: "Village of Sins", rank: "B", coins: 2e13, exp: 10240 },
    { name: "Bane", hp: 9.27e60, world: "Village of Sins", rank: "A", coins: 2.5e13, exp: 12288 },
    { name: "Melyon", hp: 9.77e61, world: "Village of Sins", rank: "S", coins: 3e13, exp: 30720 },
    { name: "Esanor", hp: 9.77e69, world: "Village of Sins", rank: "SS", coins: 7e13, exp: 46080 },
    
    { name: "Kefka", hp: 5e62, world: "Kaiju Base", rank: "E", coins: 5e13, exp: 10240 },
    { name: "Rano", hp: 4.5e63, world: "Kaiju Base", rank: "D", coins: 1e14, exp: 12288 },
    { name: "Ihero", hp: 4.74e64, world: "Kaiju Base", rank: "C", coins: 1.5e14, exp: 16384 },
    { name: "Kikoi", hp: 5e65, world: "Kaiju Base", rank: "B", coins: 2e14, exp: 20480 },
    { name: "Sosiro", hp: 5.27e66, world: "Kaiju Base", rank: "A", coins: 2.5e14, exp: 24576 },
    { name: "Meena", hp: 5.55e67, world: "Kaiju Base", rank: "S", coins: 3e14, exp: 61440 },
    { name: "Number 8", hp: 5.55e75, world: "Kaiju Base", rank: "SS", coins: 7e14, exp: 92160 },
    
    { name: "Gobito", hp: 2.73e68, world: "Tempest Capital", rank: "E", coins: 5e14, exp: 20480 },
    { name: "Gabido", hp: 2.73e69, world: "Tempest Capital", rank: "D", coins: 1e15, exp: 24576 },
    { name: "Sakai", hp: 4.1e70, world: "Tempest Capital", rank: "C", coins: 1.5e15, exp: 32768 },
    { name: "Hakamaru", hp: 4.32e71, world: "Tempest Capital", rank: "B", coins: 2e15, exp: 40960 },
    { name: "Benitaro", hp: 4.55e72, world: "Tempest Capital", rank: "A", coins: 2.5e15, exp: 49152 },
    { name: "Rimaru", hp: 4.79e73, world: "Tempest Capital", rank: "S", coins: 3e15, exp: 122880 },
    { name: "Valzora", hp: 4.79e81, world: "Tempest Capital", rank: "SS", coins: 7e15, exp: 184320 },
    
    { name: "Lisbeta", hp: 9.58e73, world: "Virtual City", rank: "E", coins: 5e15, exp: 40960 },
    { name: "Silica", hp: 7.66e74, world: "Virtual City", rank: "D", coins: 1e16, exp: 49152 },
    { name: "Klain", hp: 8.08e75, world: "Virtual City", rank: "C", coins: 1.5e16, exp: 65536 },
    { name: "Yai", hp: 8.71e76, world: "Virtual City", rank: "B", coins: 2e16, exp: 81920 },
    { name: "Asana", hp: 9.18e77, world: "Virtual City", rank: "A", coins: 2.5e16, exp: 98304 },
    { name: "Beater", hp: 9.67e78, world: "Virtual City", rank: "S", coins: 3e16, exp: 245760 },
    { name: "The Paladin", hp: 9.67e86, world: "Virtual City", rank: "SS", coins: 7e16, exp: 368640 }
]);

function generateLeafRaidData() {
    const leafRaidData = [];
    const baseHP = 3.69e36;
    const baseCoins = 5050000;
    const baseExp = 500;
    
    for (let room = 1; room <= 2000; room++) {
        const hp = baseHP * Math.pow(1.1, room - 1);
        leafRaidData.push({
            name: `Leaf Raid Room ${room}`,
            hp: hp,
            world: "Leaf Raid",
            rank: "RAID",
            coins: baseCoins,
            exp: baseExp,
            isRaid: true,
            raidType: "Leaf Raid",
            wave: room
        });
    }
    return leafRaidData;
}

function generateTitanDefenseData() {
    const titanDefenseData = [];
    const baseHP = 9e51;
    const baseCoins = 50050000;
    const baseExp = 3500;
    
    for (let wave = 1; wave <= 1000; wave++) {
        const hp = baseHP * Math.pow(1.1, wave - 1);
        titanDefenseData.push({
            name: `Titan Defense Wave ${wave}`,
            hp: hp,
            world: "Titan Defense",
            rank: "DEFENSE",
            coins: baseCoins,
            exp: baseExp,
            isRaid: true,
            raidType: "Titan Defense",
            wave: wave
        });
    }
    return titanDefenseData;
}

function formatTime(seconds) {
    if (seconds <= 0.2) return "Instant Kill";
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)}d`;
    return `${(seconds / 31536000).toFixed(1)}y`;
}

function formatDuration(totalSeconds) {
    if (totalSeconds <= 0) return "0 seconds";
    
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
}

function getTimeCategory(seconds) {
    if (seconds <= 0.2) return 'instant';
    if (seconds < 30) return 'fast';
    if (seconds < 300) return 'medium';
    return 'slow';
}

function getXpForLevel(level) {
    const levelData = xpTable.find(entry => entry.level === level);
    return levelData ? levelData.xpRequired : 0;
}

function getXpNeededForNextLevel(currentLevel) {
    const nextLevel = currentLevel + 1;
    const nextLevelData = xpTable.find(entry => entry.level === nextLevel);
    
    if (!nextLevelData) return 0;
    
    return nextLevelData.xpRequired;
}

function getXpNeededForLevel(currentLevel, targetLevel) {
    if (currentLevel >= targetLevel) return 0;
    
    let totalXpNeeded = 0;
    
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
        const levelData = xpTable.find(entry => entry.level === level);
        
        if (levelData) {
            totalXpNeeded += levelData.xpRequired;
        }
    }
    
    return totalXpNeeded;
}

function calculateLevelProgress(currentLevel, currentXp, targetLevel) {
    if (currentLevel >= targetLevel) {
        return {
            totalXpNeeded: 0,
            xpProgress: 0,
            xpRemaining: 0,
            progressPercentage: 100
        };
    }
    
    const currentLevelXpNeeded = getXpNeededForNextLevel(currentLevel);
    
    let totalXpNeeded = currentLevelXpNeeded - currentXp;
    
    for (let level = currentLevel + 1; level < targetLevel; level++) {
        totalXpNeeded += getXpNeededForNextLevel(level);
    }
    
    const xpProgress = currentXp;
    const progressPercentage = currentLevelXpNeeded > 0 ? (xpProgress / currentLevelXpNeeded) * 100 : 0;
    
    return {
        totalXpNeeded,
        xpProgress,
        xpRemaining: totalXpNeeded,
        progressPercentage
    };
}

function calculateFarmingTimeForLevel(config) {
    const {
        currentLevel,
        targetLevel,
        currentXp,
        xpPerHour,
        prestige = 0,
        expPotionActive = false,
        expPotionDuration = 0
    } = config;

    const prestigeData = prestigeConfig[prestige];
    if (!prestigeData) {
        return { valid: false, error: "Invalid prestige level" };
    }

    if (targetLevel > prestigeData.levelCap) {
        return { 
            valid: false, 
            error: `Level ${targetLevel} exceeds prestige ${prestige} cap of ${prestigeData.levelCap}` 
        };
    }

    if (currentLevel >= targetLevel) {
        return { 
            valid: false, 
            error: "Target level must be higher than current level" 
        };
    }

    if (xpPerHour <= 0) {
        return { 
            valid: false, 
            error: "XP per hour must be greater than 0" 
        };
    }

    const levelProgress = calculateLevelProgress(currentLevel, currentXp, targetLevel);
    const totalXpNeeded = levelProgress.totalXpNeeded;

    if (totalXpNeeded <= 0) {
        return {
            valid: true,
            totalXpNeeded: 0,
            hoursNeeded: 0,
            timeFormatted: "Already at target level",
            progressPercentage: 100,
            expPotionBenefit: 0
        };
    }

    const baseXpPerHour = xpPerHour * prestigeData.expMultiplier;
    let totalHours = 0;
    let xpRemaining = totalXpNeeded;
    let expPotionBenefit = 0;

    if (expPotionActive && expPotionDuration > 0) {
        const potionHours = expPotionDuration / 3600;
        const boostedXpPerHour = baseXpPerHour * 2;
        const xpGainedWithPotion = Math.min(xpRemaining, boostedXpPerHour * potionHours);
        
        expPotionBenefit = xpGainedWithPotion - (baseXpPerHour * Math.min(potionHours, xpRemaining / baseXpPerHour));
        
        if (xpGainedWithPotion >= xpRemaining) {
            totalHours = xpRemaining / boostedXpPerHour;
            xpRemaining = 0;
        } else {
            totalHours += potionHours;
            xpRemaining -= xpGainedWithPotion;
        }
    }

    if (xpRemaining > 0) {
        totalHours += xpRemaining / baseXpPerHour;
    }

    const secondsNeeded = totalHours * 3600;

    const currentLevelXpNeeded = getXpNeededForNextLevel(currentLevel);
    const overallProgress = currentLevelXpNeeded > 0 ? (currentXp / currentLevelXpNeeded) * 100 : 0;

    return {
        valid: true,
        totalXpNeeded,
        hoursNeeded: totalHours,
        timeFormatted: formatDuration(secondsNeeded),
        progressPercentage: overallProgress,
        prestigeMultiplier: prestigeData.expMultiplier,
        effectiveXpPerHour: baseXpPerHour,
        expPotionBenefit,
        expPotionActive,
        expPotionDuration: expPotionDuration
    };
}

function getRankData(currentRank) {
    return rankData.find(rank => rank.currentRank === currentRank);
}

function getAvailableLevels(prestige) {
    const prestigeData = prestigeConfig[prestige];
    if (!prestigeData) return [];
    
    return Array.from({ length: prestigeData.levelCap }, (_, i) => i + 1);
}

function validateLevelInputs(currentLevel, targetLevel, prestige) {
    const prestigeData = prestigeConfig[prestige];
    if (!prestigeData) {
        return { valid: false, error: "Invalid prestige level" };
    }

    if (currentLevel < 1 || currentLevel > prestigeData.levelCap) {
        return { valid: false, error: `Current level must be between 1 and ${prestigeData.levelCap}` };
    }

    if (targetLevel < 1 || targetLevel > prestigeData.levelCap) {
        return { valid: false, error: `Target level must be between 1 and ${prestigeData.levelCap}` };
    }

    if (targetLevel <= currentLevel) {
        return { valid: false, error: "Target level must be higher than current level" };
    }

    return { valid: true };
}

function calculateProgressPercentage(current, total) {
    if (total === 0) return 100;
    return Math.min(100, Math.max(0, (current / total) * 100));
}

const allGameData = Object.freeze([...gameData, ...generateLeafRaidData(), ...generateTitanDefenseData()]);

const ATTACK_SPEED = 5.0;
const MOB_RESPAWN_TIME = 2;

const dropRates = Object.freeze({
    tokens: {
        min: 1,
        max: 5,
        average: 3,
        baseChance: 0.1
    },
    avatarSouls: {
        min: 1,
        max: 1,
        average: 1,
        baseChance: 0.15
    }
});


