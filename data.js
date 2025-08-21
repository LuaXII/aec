const xpTable = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 10 },
    { level: 3, xpRequired: 21 },
    { level: 4, xpRequired: 33 },
    { level: 5, xpRequired: 46 },
    { level: 6, xpRequired: 61 },
    { level: 7, xpRequired: 77 },
    { level: 8, xpRequired: 95 },
    { level: 9, xpRequired: 115 },
    { level: 10, xpRequired: 137 },
    { level: 11, xpRequired: 161 },
    { level: 12, xpRequired: 187 },
    { level: 13, xpRequired: 216 },
    { level: 14, xpRequired: 248 },
    { level: 15, xpRequired: 283 },
    { level: 16, xpRequired: 321 },
    { level: 17, xpRequired: 363 },
    { level: 18, xpRequired: 409 },
    { level: 19, xpRequired: 460 },
    { level: 20, xpRequired: 516 },
    { level: 21, xpRequired: 578 },
    { level: 22, xpRequired: 646 },
    { level: 23, xpRequired: 721 },
    { level: 24, xpRequired: 803 },
    { level: 25, xpRequired: 893 },
    { level: 26, xpRequired: 992 },
    { level: 27, xpRequired: 1101 },
    { level: 28, xpRequired: 1221 },
    { level: 29, xpRequired: 1353 },
    { level: 30, xpRequired: 1498 },
    { level: 31, xpRequired: 1658 },
    { level: 32, xpRequired: 1834 },
    { level: 33, xpRequired: 2027 },
    { level: 34, xpRequired: 2240 },
    { level: 35, xpRequired: 2474 },
    { level: 36, xpRequired: 2731 },
    { level: 37, xpRequired: 3014 },
    { level: 38, xpRequired: 3325 },
    { level: 39, xpRequired: 3668 },
    { level: 40, xpRequired: 4045 },
    { level: 41, xpRequired: 4460 },
    { level: 42, xpRequired: 4916 },
    { level: 43, xpRequired: 5418 },
    { level: 44, xpRequired: 5970 },
    { level: 45, xpRequired: 6577 },
    { level: 46, xpRequired: 7245 },
    { level: 47, xpRequired: 7980 },
    { level: 48, xpRequired: 8788 },
    { level: 49, xpRequired: 9677 },
    { level: 50, xpRequired: 10655 },
    { level: 51, xpRequired: 11731 },
    { level: 52, xpRequired: 12914 },
    { level: 53, xpRequired: 14215 },
    { level: 54, xpRequired: 15647 },
    { level: 55, xpRequired: 17222 },
    { level: 56, xpRequired: 18954 },
    { level: 57, xpRequired: 20859 },
    { level: 58, xpRequired: 22955 },
    { level: 59, xpRequired: 25261 },
    { level: 60, xpRequired: 27797 },
    { level: 61, xpRequired: 30587 },
    { level: 62, xpRequired: 33656 },
    { level: 63, xpRequired: 37032 },
    { level: 64, xpRequired: 40745 },
    { level: 65, xpRequired: 44830 },
    { level: 66, xpRequired: 49323 },
    { level: 67, xpRequired: 54265 },
    { level: 68, xpRequired: 59702 },
    { level: 69, xpRequired: 65682 },
    { level: 70, xpRequired: 72260 },
    { level: 71, xpRequired: 79496 },
    { level: 72, xpRequired: 87456 },
    { level: 73, xpRequired: 96212 },
    { level: 74, xpRequired: 105843 },
    { level: 75, xpRequired: 116437 },
    { level: 76, xpRequired: 128091 },
    { level: 77, xpRequired: 140910 },
    { level: 78, xpRequired: 155011 },
    { level: 79, xpRequired: 170522 },
    { level: 80, xpRequired: 187584 },
    { level: 81, xpRequired: 206352 },
    { level: 82, xpRequired: 226997 },
    { level: 83, xpRequired: 249707 },
    { level: 84, xpRequired: 274688 },
    { level: 85, xpRequired: 302167 },
    { level: 86, xpRequired: 332394 },
    { level: 87, xpRequired: 365643 },
    { level: 88, xpRequired: 402217 },
    { level: 89, xpRequired: 442449 },
    { level: 90, xpRequired: 486704 },
    { level: 91, xpRequired: 535384 },
    { level: 92, xpRequired: 588932 },
    { level: 93, xpRequired: 647835 },
    { level: 94, xpRequired: 712629 },
    { level: 95, xpRequired: 783902 },
    { level: 96, xpRequired: 862302 },
    { level: 97, xpRequired: 948542 },
    { level: 98, xpRequired: 1043406 },
    { level: 99, xpRequired: 1147757 },
    { level: 100, xpRequired: 1262543 },
    { level: 101, xpRequired: 1388807 },
    { level: 102, xpRequired: 1527698 },
    { level: 103, xpRequired: 1680478 },
    { level: 104, xpRequired: 1848536 },
    { level: 105, xpRequired: 2033400 },
    { level: 106, xpRequired: 2236750 },
    { level: 107, xpRequired: 2460435 },
    { level: 108, xpRequired: 2706489 },
    { level: 109, xpRequired: 2977148 },
    { level: 110, xpRequired: 3274873 },
    { level: 111, xpRequired: 3602370 },
    { level: 112, xpRequired: 3962617 },
    { level: 113, xpRequired: 4358889 },
    { level: 114, xpRequired: 4794788 },
    { level: 115, xpRequired: 5274277 },
    { level: 116, xpRequired: 5801715 },
    { level: 117, xpRequired: 6381897 },
    { level: 118, xpRequired: 7020097 },
    { level: 119, xpRequired: 7722117 },
    { level: 120, xpRequired: 8494339 },
    { level: 121, xpRequired: 9343783 },
    { level: 122, xpRequired: 10278171 },
    { level: 123, xpRequired: 11305998 },
    { level: 124, xpRequired: 12436608 },
    { level: 125, xpRequired: 13680279 },
    { level: 126, xpRequired: 15048317 },
    { level: 127, xpRequired: 16553159 },
    { level: 128, xpRequired: 18208485 },
    { level: 129, xpRequired: 20029344 },
    { level: 130, xpRequired: 22032288 },
    { level: 131, xpRequired: 24235527 },
    { level: 132, xpRequired: 26659090 },
    { level: 133, xpRequired: 29325009 },
    { level: 134, xpRequired: 32257520 },
    { level: 135, xpRequired: 35483282 },
    { level: 136, xpRequired: 39031620 },
    { level: 137, xpRequired: 42934792 },
    { level: 138, xpRequired: 47228281 },
    { level: 139, xpRequired: 51951119 },
    { level: 140, xpRequired: 57146241 },
    { level: 141, xpRequired: 62860875 },
    { level: 142, xpRequired: 69146973 },
    { level: 143, xpRequired: 76061680 },
    { level: 144, xpRequired: 83667858 },
    { level: 145, xpRequired: 92034654 },
    { level: 146, xpRequired: 101238129 },
    { level: 147, xpRequired: 111361952 },
    { level: 148, xpRequired: 122498157 },
    { level: 149, xpRequired: 134747983 },
    { level: 150, xpRequired: 148222791 },
    { level: 151, xpRequired: 163045080 },
    { level: 152, xpRequired: 179349598 },
    { level: 153, xpRequired: 197284568 },
    { level: 154, xpRequired: 217013035 },
    { level: 155, xpRequired: 238714349 },
    { level: 156, xpRequired: 262585794 },
    { level: 157, xpRequired: 288844383 },
    { level: 158, xpRequired: 317728831 },
    { level: 159, xpRequired: 349501724 },
    { level: 160, xpRequired: 384451906 },
    { level: 161, xpRequired: 422897107 },
    { level: 162, xpRequired: 465186828 },
    { level: 163, xpRequired: 511705521 },
    { level: 164, xpRequired: 562876083 },
    { level: 165, xpRequired: 619163701 },
    { level: 166, xpRequired: 681080081 },
    { level: 167, xpRequired: 749188099 },
    { level: 168, xpRequired: 824106919 },
    { level: 169, xpRequired: 906517621 },
    { level: 170, xpRequired: 997169393 },
    { level: 171, xpRequired: 1096886342 },
    { level: 172, xpRequired: 1206574986 },
    { level: 173, xpRequired: 1327232495 },
    { level: 174, xpRequired: 1459955755 },
    { level: 175, xpRequired: 1605951341 },
    { level: 176, xpRequired: 1766546485 },
    { level: 177, xpRequired: 1943201144 },
    { level: 178, xpRequired: 2137521268 },
    { level: 179, xpRequired: 2351273405 },
    { level: 180, xpRequired: 2586400756 },
    { level: 181, xpRequired: 2845040842 },
    { level: 182, xpRequired: 3129544936 },
    { level: 183, xpRequired: 3442499440 },
    { level: 184, xpRequired: 3786749394 },
    { level: 185, xpRequired: 4165424343 },
    { level: 186, xpRequired: 4581966787 },
    { level: 187, xpRequired: 5040163476 },
    { level: 188, xpRequired: 5544179834 },
    { level: 189, xpRequired: 6098597827 },
    { level: 190, xpRequired: 6708457620 },
    { level: 191, xpRequired: 7379303392 },
    { level: 192, xpRequired: 8117233741 },
    { level: 193, xpRequired: 8928957125 },
    { level: 194, xpRequired: 9821852848 },
    { level: 195, xpRequired: 10804038143 },
    { level: 196, xpRequired: 11884441967 },
    { level: 197, xpRequired: 13072886174 },
    { level: 198, xpRequired: 14380174801 },
    { level: 199, xpRequired: 15818192291 },
    { level: 200, xpRequired: 17400011530 },
    { level: 201, xpRequired: 19140012693 },
    { level: 202, xpRequired: 21054013972 },
    { level: 203, xpRequired: 23159415379 },
    { level: 204, xpRequired: 25475356927 },
    { level: 205, xpRequired: 28022892630 },
    { level: 206, xpRequired: 30825181903 },
    { level: 207, xpRequired: 33907700103 },
    { level: 208, xpRequired: 37298470123 },
    { level: 209, xpRequired: 41028317145 },
    { level: 210, xpRequired: 45131148870 },
    { level: 211, xpRequired: 49644263767 },
    { level: 212, xpRequired: 54608690154 },
    { level: 213, xpRequired: 60069559179 },
    { level: 214, xpRequired: 66076515107 },
    { level: 215, xpRequired: 72684166628 },
    { level: 216, xpRequired: 79952583301 },
    { level: 217, xpRequired: 87947841641 },
    { level: 218, xpRequired: 96742625815 },
    { level: 219, xpRequired: 106416888407 },
    { level: 220, xpRequired: 117058577258 },
    { level: 221, xpRequired: 128764434994 },
    { level: 222, xpRequired: 141640878503 },
    { level: 223, xpRequired: 155804966363 },
    { level: 224, xpRequired: 171385463009 },
    { level: 225, xpRequired: 188524009320 },
    { level: 226, xpRequired: 207376410262 },
    { level: 227, xpRequired: 228114051298 },
    { level: 228, xpRequired: 250925456438 },
    { level: 229, xpRequired: 276018002092 },
    { level: 230, xpRequired: 303619802311 }
];

const rankData = [
    { currentRank: 1, nextRank: 2, energyRequired: 9000, energyMultiplier: 1.0 },
    { currentRank: 2, nextRank: 3, energyRequired: 245000, energyMultiplier: 2.0 },
    { currentRank: 3, nextRank: 4, energyRequired: 1300000, energyMultiplier: 4.0 },
    { currentRank: 4, nextRank: 5, energyRequired: 3700000, energyMultiplier: 8.0 },
    { currentRank: 5, nextRank: 6, energyRequired: 13600000, energyMultiplier: 16.0 },
    { currentRank: 6, nextRank: 7, energyRequired: 150000000, energyMultiplier: 32.0 },
    { currentRank: 7, nextRank: 8, energyRequired: 1100000000, energyMultiplier: 64.0 },
    { currentRank: 8, nextRank: 9, energyRequired: 13000000000, energyMultiplier: 128.0 },
    { currentRank: 9, nextRank: 10, energyRequired: 27000000000, energyMultiplier: 256.0 },
    { currentRank: 10, nextRank: 11, energyRequired: 350000000000, energyMultiplier: 512.0 },
    { currentRank: 11, nextRank: 12, energyRequired: 825000000000, energyMultiplier: 1024.0 },
    { currentRank: 12, nextRank: 13, energyRequired: 1.47e12, energyMultiplier: 2048.0 },
    { currentRank: 13, nextRank: 14, energyRequired: 3.9e12, energyMultiplier: 4096.0 },
    { currentRank: 14, nextRank: 15, energyRequired: 22.5e12, energyMultiplier: 8192.0 },
    { currentRank: 15, nextRank: 16, energyRequired: 211e12, energyMultiplier: 16384.0 },
    { currentRank: 16, nextRank: 17, energyRequired: 2.99e15, energyMultiplier: 32768.0 },
    { currentRank: 17, nextRank: 18, energyRequired: 499e15, energyMultiplier: 65536.0 },
    { currentRank: 18, nextRank: 19, energyRequired: 10e18, energyMultiplier: 131072.0 },
    { currentRank: 19, nextRank: 20, energyRequired: 400e18, energyMultiplier: 262144.0 },
    { currentRank: 20, nextRank: 21, energyRequired: 7.8e21, energyMultiplier: 524288.0 },
    { currentRank: 21, nextRank: 22, energyRequired: 33e21, energyMultiplier: 1048576.0 },
    { currentRank: 22, nextRank: 23, energyRequired: 495e21, energyMultiplier: 2097152.0 },
    { currentRank: 23, nextRank: 24, energyRequired: 1.25e24, energyMultiplier: 4194304.0 },
    { currentRank: 24, nextRank: 25, energyRequired: 14e24, energyMultiplier: 8388608.0 },
    { currentRank: 25, nextRank: 26, energyRequired: 69e24, energyMultiplier: 16777216.0 },
    { currentRank: 26, nextRank: 27, energyRequired: 475e24, energyMultiplier: 33554432.0 },
    { currentRank: 27, nextRank: 28, energyRequired: 7.21e27, energyMultiplier: 67108864.0 },
    { currentRank: 28, nextRank: 29, energyRequired: 39.8e27, energyMultiplier: 134217728.0 },
    { currentRank: 29, nextRank: 30, energyRequired: 284e27, energyMultiplier: 268435456.0 },
    { currentRank: 30, nextRank: 31, energyRequired: 769e27, energyMultiplier: 536870912.0 },
    { currentRank: 31, nextRank: 32, energyRequired: 1.25e30, energyMultiplier: 1073741824.0 },
    { currentRank: 32, nextRank: 33, energyRequired: 5e30, energyMultiplier: 2147483648.0 },
    { currentRank: 33, nextRank: 34, energyRequired: 22.2e30, energyMultiplier: 4294967296.0 },
    { currentRank: 34, nextRank: 35, energyRequired: 500e30, energyMultiplier: 8589934592.0 },
    { currentRank: 35, nextRank: 36, energyRequired: 6.9e33, energyMultiplier: 17179869184.0 },
    { currentRank: 36, nextRank: 37, energyRequired: 9.9e33, energyMultiplier: 34359738368.0 },
    { currentRank: 37, nextRank: 38, energyRequired: 27.8e33, energyMultiplier: 68719476736.0 },
    { currentRank: 38, nextRank: 39, energyRequired: 76.9e33, energyMultiplier: 137438953472.0 },
    { currentRank: 39, nextRank: 40, energyRequired: 100e33, energyMultiplier: 274877906944.0 },
    { currentRank: 40, nextRank: 41, energyRequired: 642e33, energyMultiplier: 549755813888.0 },
    { currentRank: 41, nextRank: 42, energyRequired: 7e36, energyMultiplier: 1099511627776.0 },
    { currentRank: 42, nextRank: 43, energyRequired: 80e36, energyMultiplier: 2199023255552.0 },
    { currentRank: 43, nextRank: 44, energyRequired: 900e36, energyMultiplier: 4398046511104.0 },
    { currentRank: 44, nextRank: 45, energyRequired: 1e39, energyMultiplier: 8796093022208.0 },
    { currentRank: 45, nextRank: 46, energyRequired: 9.99e39, energyMultiplier: 17592186044416.0 },
    { currentRank: 46, nextRank: 47, energyRequired: 85e39, energyMultiplier: 35184372088832.0 },
    { currentRank: 47, nextRank: 48, energyRequired: 498e39, energyMultiplier: 70368744177664.0 },
    { currentRank: 48, nextRank: 49, energyRequired: 5e42, energyMultiplier: 140737488355328.0 },
    { currentRank: 49, nextRank: 50, energyRequired: 64.2e42, energyMultiplier: 281474976710656.0 },
    { currentRank: 50, nextRank: 51, energyRequired: 500e42, energyMultiplier: 562949953421312.0 },
    { currentRank: 51, nextRank: 52, energyRequired: 998e42, energyMultiplier: 1125899906842624.0 },
    { currentRank: 52, nextRank: 53, energyRequired: 4e45, energyMultiplier: 2251799813685248.0 },
    { currentRank: 53, nextRank: 54, energyRequired: 90e45, energyMultiplier: 4503599627370496.0 },
    { currentRank: 54, nextRank: 55, energyRequired: 64.2e45, energyMultiplier: 9007199254740992.0 },
    { currentRank: 55, nextRank: 56, energyRequired: 100e45, energyMultiplier: 18014398509481984.0 },
    { currentRank: 56, nextRank: 57, energyRequired: 998e45, energyMultiplier: 36028797018963968.0 },
    { currentRank: 57, nextRank: 58, energyRequired: 5e48, energyMultiplier: 72057594037927936.0 },
    { currentRank: 58, nextRank: 59, energyRequired: 10e48, energyMultiplier: 144115188075855872.0 },
    { currentRank: 59, nextRank: 60, energyRequired: 68.9e48, energyMultiplier: 288230376151711744.0 },
    { currentRank: 60, nextRank: 61, energyRequired: 541e48, energyMultiplier: 576460752303423488.0 },
    { currentRank: 61, nextRank: 62, energyRequired: 9e51, energyMultiplier: 1152921504606846976.0 },
    { currentRank: 62, nextRank: 63, energyRequired: 200e51, energyMultiplier: 2305843009213693952.0 },
    { currentRank: 63, nextRank: 64, energyRequired: 6.32e54, energyMultiplier: 4611686018427387904.0 },
    { currentRank: 64, nextRank: 65, energyRequired: 91e54, energyMultiplier: 9223372036854775808.0 },
    { currentRank: 65, nextRank: 66, energyRequired: 900e54, energyMultiplier: 18446744073709551616.0 },
    { currentRank: 66, nextRank: 67, energyRequired: 4e57, energyMultiplier: 36893488147419103232.0 },
    { currentRank: 67, nextRank: 68, energyRequired: 10e57, energyMultiplier: 73786976294838206464.0 },
    { currentRank: 68, nextRank: 69, energyRequired: 50e57, energyMultiplier: 147573952589676412928.0 },
    { currentRank: 69, nextRank: 70, energyRequired: 375e57, energyMultiplier: 295147905179352825856.0 },
    { currentRank: 70, nextRank: 71, energyRequired: 1.1e60, energyMultiplier: 590295810358705651712.0 },
    { currentRank: 71, nextRank: 72, energyRequired: 11e60, energyMultiplier: 1180591620717411303424.0 },
    { currentRank: 72, nextRank: 73, energyRequired: 55e60, energyMultiplier: 2361183241434822606848.0 },
    { currentRank: 73, nextRank: 74, energyRequired: 310e60, energyMultiplier: 4722366482869645213696.0 },
    { currentRank: 74, nextRank: 75, energyRequired: 10e63, energyMultiplier: 9444732965739290427392.0 },
    { currentRank: 75, nextRank: null, energyRequired: null, energyMultiplier: 18889465931478580854784.0 }
];

const prestigeConfig = {
    0: { levelCap: 200, expMultiplier: 1.0 },
    1: { levelCap: 210, expMultiplier: 1.1 },
    2: { levelCap: 220, expMultiplier: 1.2 },
    3: { levelCap: 230, expMultiplier: 1.3 }
};

const energyPotions = {
    none: { name: "None", multiplier: 1.0, duration: 0 },
    small: { name: "Small Energy Potion (+50%)", multiplier: 1.5, duration: 15 * 60 },
    large: { name: "Energy Potion (+100%)", multiplier: 2.0, duration: 15 * 60 }
};

const expPotions = {
    none: { name: "None", multiplier: 1.0, duration: 0 },
    double: { name: "2x EXP Potion", multiplier: 2.0, duration: 15 * 60 }
};

const gameData = [
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
];

function generateLeafRaidData() {
    const leafRaidData = [];
    const baseHP = 3.69e36;
    const baseCoins = 5050000;
    const baseExp = 500;
    
    for (let room = 1; room <= 1000; room++) {
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

const allGameData = [...gameData, ...generateLeafRaidData(), ...generateTitanDefenseData()];

const ATTACK_SPEED = 5.0;
const MOB_RESPAWN_TIME = 2;

const gameItems = {
    auras: [
        { name: "None", coinsMultiplier: 0 },
        { name: "Flaming Aura", coinsMultiplier: 0.15 },
    ],
    jewelry: {
        rings: [
            { name: "None", multiplier: 0 },
            { name: "Bronze Coin Ring", multiplier: 0.10 },
            { name: "Silver Coin Ring", multiplier: 0.25 },
            { name: "Gold Coin Ring", multiplier: 0.50 },
            { name: "Rose Gold Coin Ring", multiplier: 0.75 }
        ],
        necklaces: [
            { name: "None", multiplier: 0 },
            { name: "Bronze Coin Necklace", multiplier: 0.10 },
            { name: "Silver Coin Necklace", multiplier: 0.25 },
            { name: "Gold Coin Necklace", multiplier: 0.50 },
            { name: "Rose Gold Coin Necklace", multiplier: 0.75 }
        ],
        earrings: [
            { name: "None", multiplier: 0 },
            { name: "Bronze Coin Earrings", multiplier: 0.10 },
            { name: "Silver Coin Earrings", multiplier: 0.25 },
            { name: "Gold Coin Earrings", multiplier: 0.50 },
            { name: "Rose Gold Coin Earrings", multiplier: 0.75 }
        ]
    },
    equipment: {
        hats: [
            { name: "None", baseCoins: 0 },
            { name: "4 Star Hat 1", baseCoins: 0.100 },
            { name: "4 Star Hat 2", baseCoins: 0.150 },
            { name: "4 Star Hat 3", baseCoins: 0.200 },
            { name: "4 Star Hat 4", baseCoins: 0.250 },
            { name: "4 Star Hat 5", baseCoins: 0.300 },
            { name: "4 Star Hat 6", baseCoins: 0.350 },
            { name: "4 Star Hat 7", baseCoins: 0.500 }
        ],
        scarfs: [
            { name: "None", baseCoins: 0 },
            { name: "Red Scarf 1", baseCoins: 0.300 },
            { name: "Red Scarf 2", baseCoins: 0.450 },
            { name: "Red Scarf 3", baseCoins: 0.600 },
            { name: "Red Scarf 4", baseCoins: 0.750 },
            { name: "Red Scarf 5", baseCoins: 0.900 },
            { name: "Red Scarf 6", baseCoins: 1.200 },
            { name: "Red Scarf 7", baseCoins: 1.500 }
        ],
        masks: [
            { name: "None", baseCoins: 0, expPercentage: 0 },
            { name: "Slime Mask 1", baseCoins: 0.050, expPercentage: 1.0 },
            { name: "Slime Mask 2", baseCoins: 0.075, expPercentage: 1.5 },
            { name: "Slime Mask 3", baseCoins: 0.100, expPercentage: 2.0 },
            { name: "Slime Mask 4", baseCoins: 0.125, expPercentage: 2.5 },
            { name: "Slime Mask 5", baseCoins: 0.150, expPercentage: 3.0 },
            { name: "Slime Mask 6", baseCoins: 0.175, expPercentage: 3.5 },
            { name: "Slime Mask 7", baseCoins: 0.250, expPercentage: 5.0 }
        ],
        cloaks: [
            { name: "None", expPercentage: 0 },
            { name: "Armless Cloak", expPercentage: 10.0 }
        ]
    },
    powers: {
        demonFruits: [
            { name: "None", baseCoins: 0 },
            { name: "Money Fruit", baseCoins: 1.0 }
        ],
        powerEyes: [
            { name: "None", coinsMultiplier: 0 },
            { name: "Cyclone Eye", coinsMultiplier: 0.5 },
            { name: "Atomic Insight Eye", coinsMultiplier: 1.0 },
            { name: "Eye Of Six Paths", coinsMultiplier: 1.0 }
        ],
        virtues: [
            { name: "None", coinsMultiplier: 0 },
            { name: "Truth", coinsMultiplier: 1.0 },
            { name: "Love", coinsMultiplier: 1.0 }
        ]
    }
};

const dropRates = {
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
};

const numberSuffixes = [
    { value: 1e3, suffix: "K" },
    { value: 1e6, suffix: "M" },
    { value: 1e9, suffix: "B" },
    { value: 1e12, suffix: "T" },
    { value: 1e15, suffix: "qd" },
    { value: 1e18, suffix: "Qn" },
    { value: 1e21, suffix: "sx" },
    { value: 1e24, suffix: "Sp" },
    { value: 1e27, suffix: "O" },
    { value: 1e30, suffix: "N" },
    { value: 1e33, suffix: "de" },
    { value: 1e36, suffix: "Ud" },
    { value: 1e39, suffix: "DD" },
    { value: 1e42, suffix: "tdD" },
    { value: 1e45, suffix: "qdD" },
    { value: 1e48, suffix: "QnD" },
    { value: 1e51, suffix: "sxD" },
    { value: 1e54, suffix: "SpD" },
    { value: 1e57, suffix: "OcD" },
    { value: 1e60, suffix: "NvD" },
    { value: 1e63, suffix: "Vgn" },
    { value: 1e66, suffix: "UVg" },
    { value: 1e69, suffix: "DVg" },
    { value: 1e72, suffix: "TVg" },
    { value: 1e75, suffix: "qtV" },
    { value: 1e78, suffix: "QnV" },
    { value: 1e81, suffix: "SeV" },
    { value: 1e84, suffix: "SPG" },
    { value: 1e87, suffix: "OcG" },
    { value: 1e90, suffix: "NoG" },
    { value: 1e93, suffix: "DcG" },
    { value: 1e96, suffix: "TdG" },
    { value: 1e99, suffix: "QdG" },
    { value: 1e102, suffix: "QnG" },
    { value: 1e105, suffix: "SxG" },
    { value: 1e108, suffix: "SpG" },
    { value: 1e111, suffix: "OtG" },
    { value: 1e114, suffix: "NoA" },
    { value: 1e117, suffix: "DcA" },
    { value: 1e120, suffix: "TdA" },
    { value: 1e123, suffix: "QdA" },
    { value: 1e126, suffix: "QnA" },
    { value: 1e129, suffix: "SxA" },
    { value: 1e132, suffix: "SpA" },
    { value: 1e135, suffix: "OtA" },
    { value: 1e138, suffix: "NoS" },
    { value: 1e141, suffix: "DcS" },
    { value: 1e144, suffix: "TdS" },
    { value: 1e147, suffix: "QdS" },
    { value: 1e150, suffix: "QnS" },
    { value: 1e153, suffix: "SxS" },
    { value: 1e156, suffix: "SpS" },
    { value: 1e159, suffix: "OtS" },
    { value: 1e162, suffix: "NoP" },
    { value: 1e165, suffix: "DcP" },
    { value: 1e168, suffix: "TdP" },
    { value: 1e171, suffix: "QdP" },
    { value: 1e174, suffix: "QnP" },
    { value: 1e177, suffix: "SxP" },
    { value: 1e180, suffix: "SpP" },
    { value: 1e183, suffix: "OtP" },
    { value: 1e186, suffix: "NoE" },
    { value: 1e189, suffix: "DcE" },
    { value: 1e192, suffix: "TdE" },
    { value: 1e195, suffix: "QdE" },
    { value: 1e198, suffix: "QnE" },
    { value: 1e201, suffix: "SxE" },
    { value: 1e204, suffix: "SpE" },
    { value: 1e207, suffix: "OtE" },
    { value: 1e210, suffix: "NoZ" },
    { value: 1e213, suffix: "DcZ" },
    { value: 1e216, suffix: "TdZ" },
    { value: 1e219, suffix: "QdZ" },
    { value: 1e222, suffix: "QnZ" },
    { value: 1e225, suffix: "SxZ" },
    { value: 1e228, suffix: "SpZ" },
    { value: 1e231, suffix: "OtZ" },
    { value: 1e234, suffix: "NoY" },
    { value: 1e237, suffix: "DcY" },
    { value: 1e240, suffix: "TdY" },
    { value: 1e243, suffix: "QdY" },
    { value: 1e246, suffix: "QnY" },
    { value: 1e249, suffix: "SxY" },
    { value: 1e252, suffix: "SpY" },
    { value: 1e255, suffix: "OtY" },
    { value: 1e258, suffix: "NoX" },
    { value: 1e261, suffix: "DcX" },
    { value: 1e264, suffix: "TdX" },
    { value: 1e267, suffix: "QdX" },
    { value: 1e270, suffix: "QnX" },
    { value: 1e273, suffix: "SxX" },
    { value: 1e276, suffix: "SpX" },
    { value: 1e279, suffix: "OtX" },
    { value: 1e282, suffix: "NoW" },
    { value: 1e285, suffix: "DcW" },
    { value: 1e288, suffix: "TdW" },
    { value: 1e291, suffix: "QdW" },
    { value: 1e294, suffix: "QnW" },
    { value: 1e297, suffix: "SxW" },
    { value: 1e300, suffix: "SpW" },
    { value: 1e303, suffix: "OtW" },
    { value: 1e306, suffix: "NoV" },
    { value: 1e309, suffix: "DcV" },
    { value: 1e312, suffix: "TdV" },
    { value: 1e315, suffix: "QdV" },
    { value: 1e318, suffix: "QnV" },
    { value: 1e321, suffix: "SxV" },
    { value: 1e324, suffix: "SpV" },
    { value: 1e327, suffix: "OtV" },
    { value: 1e330, suffix: "NoU" },
    { value: 1e333, suffix: "DcU" },
    { value: 1e336, suffix: "TdU" },
    { value: 1e339, suffix: "QdU" },
    { value: 1e342, suffix: "QnU" },
    { value: 1e345, suffix: "SxU" },
    { value: 1e348, suffix: "SpU" },
    { value: 1e351, suffix: "OtU" },
    { value: 1e354, suffix: "NoT" },
    { value: 1e357, suffix: "DcT" },
    { value: 1e360, suffix: "TdT" },
    { value: 1e363, suffix: "QdT" },
    { value: 1e366, suffix: "QnT" },
    { value: 1e369, suffix: "SxT" },
    { value: 1e372, suffix: "SpT" },
    { value: 1e375, suffix: "OtT" },
    { value: 1e378, suffix: "NoR" },
    { value: 1e381, suffix: "DcR" },
    { value: 1e384, suffix: "TdR" },
    { value: 1e387, suffix: "QdR" },
    { value: 1e390, suffix: "QnR" },
    { value: 1e393, suffix: "SxR" },
    { value: 1e396, suffix: "SpR" },
    { value: 1e399, suffix: "OtR" },
    { value: 1e402, suffix: "NoQ" },
    { value: 1e405, suffix: "DcQ" },
    { value: 1e408, suffix: "TdQ" },
    { value: 1e411, suffix: "QdQ" },
    { value: 1e414, suffix: "QnQ" },
    { value: 1e417, suffix: "SxQ" },
    { value: 1e420, suffix: "SpQ" },
    { value: 1e423, suffix: "OtQ" }
];

function formatNumber(num) {
    if (num === 0 || !isFinite(num)) return "0";
    
    const absNum = Math.abs(num);
    const isNegative = num < 0;
    
    if (absNum < 1000) {
        return (isNegative ? "-" : "") + Math.round(absNum).toLocaleString();
    }
    
    const sortedSuffixes = [...numberSuffixes].sort((a, b) => b.value - a.value);
    
    for (const item of sortedSuffixes) {
        if (absNum >= item.value) {
            const divided = absNum / item.value;
            
            let formatted;
            if (divided >= 100) {
                formatted = Math.round(divided).toString();
            } else if (divided >= 10) {
                const rounded = Math.round(divided * 10) / 10;
                formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
            } else {
                const rounded = Math.round(divided * 100) / 100;
                formatted = rounded % 1 === 0 ? rounded.toString() : 
                           (rounded * 10) % 1 === 0 ? rounded.toFixed(1) : rounded.toFixed(2);
            }
            
            return (isNegative ? "-" : "") + formatted + item.suffix;
        }
    }
    
    return (isNegative ? "-" : "") + absNum.toPrecision(3);
}

function formatTime(seconds) {
    if (seconds < (1 / ATTACK_SPEED)) return "Instant Kill";
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
    if (seconds < (1 / ATTACK_SPEED)) return 'instant';
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

function calculateRankUpTime(config) {
    const {
        currentRank,
        energyPerClick,
        currentEnergy = 0,
        potionType = 'none',
        potionDuration = 0,
        targetEnergy = null
    } = config;

    if (currentRank < 1 || currentRank > 75) {
        return { valid: false, error: "Rank must be between 1 and 75" };
    }

    if (energyPerClick <= 0) {
        return { valid: false, error: "Energy per click must be greater than 0" };
    }

    const rankInfo = getRankData(currentRank);
    if (!rankInfo) {
        return { valid: false, error: "Invalid rank data" };
    }

    if (currentRank === 75) {
        if (!targetEnergy || targetEnergy <= 0) {
            return { valid: false, error: "Please set a target energy goal for max rank" };
        }

        const energyNeeded = Math.max(0, targetEnergy - currentEnergy);

        if (energyNeeded <= 0) {
            return {
                valid: true,
                currentRank,
                nextRank: null,
                energyRequired: targetEnergy,
                currentEnergy,
                energyRemaining: 0,
                energyPerClick,
                potionInfo: {
                    type: energyPotions[potionType]?.name || 'None',
                    multiplier: energyPotions[potionType]?.multiplier || 1,
                    duration: potionDuration,
                    durationFormatted: formatDuration(potionDuration)
                },
                totalTimeSeconds: 0,
                timeFormatted: "Energy Goal Already Reached!",
                energyMultiplier: rankInfo.energyMultiplier,
                nextRankMultiplier: rankInfo.energyMultiplier,
                isMaxRank: true,
                targetEnergy,
                progressPercentage: 100
            };
        }

        const totalTimeSeconds = calculateEnergyGainTime(energyNeeded, energyPerClick, potionType, potionDuration);

        return {
            valid: true,
            currentRank,
            nextRank: null,
            energyRequired: targetEnergy,
            currentEnergy,
            energyRemaining: energyNeeded,
            energyPerClick,
            potionInfo: {
                type: energyPotions[potionType]?.name || 'None',
                multiplier: energyPotions[potionType]?.multiplier || 1,
                duration: potionDuration,
                durationFormatted: formatDuration(potionDuration)
            },
            totalTimeSeconds,
            timeFormatted: formatDuration(totalTimeSeconds),
            energyMultiplier: rankInfo.energyMultiplier,
            nextRankMultiplier: rankInfo.energyMultiplier,
            isMaxRank: true,
            targetEnergy,
            progressPercentage: targetEnergy > 0 ? (currentEnergy / targetEnergy) * 100 : 0
        };
    }

    if (!rankInfo.energyRequired) {
        return { valid: false, error: "Invalid rank data" };
    }

    const energyNeeded = Math.max(0, rankInfo.energyRequired - currentEnergy);

    if (energyNeeded <= 0) {
        return {
            valid: true,
            currentRank,
            nextRank: rankInfo.nextRank,
            energyRequired: rankInfo.energyRequired,
            currentEnergy,
            energyRemaining: 0,
            energyPerClick,
            potionInfo: {
                type: energyPotions[potionType]?.name || 'None',
                multiplier: energyPotions[potionType]?.multiplier || 1,
                duration: potionDuration,
                durationFormatted: formatDuration(potionDuration)
            },
            totalTimeSeconds: 0,
            timeFormatted: "Ready to Rank Up!",
            energyMultiplier: rankInfo.energyMultiplier,
            nextRankMultiplier: rankData.find(r => r.currentRank === rankInfo.nextRank)?.energyMultiplier || rankInfo.energyMultiplier,
            isMaxRank: false,
            progressPercentage: 100
        };
    }

    const totalTimeSeconds = calculateEnergyGainTime(energyNeeded, energyPerClick, potionType, potionDuration);

    return {
        valid: true,
        currentRank,
        nextRank: rankInfo.nextRank,
        energyRequired: rankInfo.energyRequired,
        currentEnergy,
        energyRemaining: energyNeeded,
        energyPerClick,
        potionInfo: {
            type: energyPotions[potionType]?.name || 'None',
            multiplier: energyPotions[potionType]?.multiplier || 1,
            duration: potionDuration,
            durationFormatted: formatDuration(potionDuration)
        },
        totalTimeSeconds,
        timeFormatted: formatDuration(totalTimeSeconds),
        energyMultiplier: rankInfo.energyMultiplier,
        nextRankMultiplier: rankData.find(r => r.currentRank === rankInfo.nextRank)?.energyMultiplier || rankInfo.energyMultiplier,
        isMaxRank: false,
        progressPercentage: rankInfo.energyRequired > 0 ? (currentEnergy / rankInfo.energyRequired) * 100 : 0
    };
}

function calculateEnergyGainTime(energyNeeded, energyPerClick, potionType = 'none', potionDuration = 0) {
    const potion = energyPotions[potionType] || energyPotions.none;
    let totalTimeSeconds = 0;
    let energyGained = 0;

    if (potionDuration > 0 && potion.multiplier > 1) {
        const potionEnergyPerSecond = energyPerClick * potion.multiplier;
        const energyDuringPotion = Math.min(energyNeeded, potionEnergyPerSecond * potionDuration);
        energyGained += energyDuringPotion;
        
        if (energyGained >= energyNeeded) {
            totalTimeSeconds = energyNeeded / potionEnergyPerSecond;
        } else {
            totalTimeSeconds += potionDuration;
        }
    }

    if (energyGained < energyNeeded) {
        const remainingEnergy = energyNeeded - energyGained;
        const timeWithoutPotion = remainingEnergy / energyPerClick;
        totalTimeSeconds += timeWithoutPotion;
    }

    return totalTimeSeconds;
}

function calculateEnergyGainOverTime(epc, duration, potionType = 'none', potionDuration = 0) {
    const potion = energyPotions[potionType] || energyPotions.none;
    let totalEnergy = 0;

    if (potionDuration > 0 && potion.multiplier > 1) {
        const effectiveDuration = Math.min(duration, potionDuration);
        totalEnergy += epc * potion.multiplier * effectiveDuration;
        duration -= effectiveDuration;
    }

    if (duration > 0) {
        totalEnergy += epc * duration;
    }

    return totalEnergy;
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