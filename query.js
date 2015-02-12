// GLOBAL VARIABLES & ARRAY ------------------------------

var data = require("./output.json")
var length = data["daily_projections"].length
var projectionArray = []
var projectionArrayLength = projectionArray.length
var playerArray = []
var playerArrayLength = playerArray.length
var playerLength = 3000
var omnibus = []
var allPG = []
var allSG = []
var allSF = []
var allPF = []
var allC = []
var pgAllPairs = []
var sgAllPairs = []
var sfAllPairs = []
var pfAllPairs = []
var pgsgQuad = []
var sfpfQuad = []
var eight = []
var lineups = []

// PROJECTION ARRAY --------------------------------------
// POOLS ALL PROJECTION DATA FROM NUMBERFIRE
// INCLUDING: PLAYER ID, SALARY, PROJECTED POINTS
// AND EFFICIENCY RATIO

for (var i = 0; i < length; i++){
	projection = []
	var id = data["daily_projections"][i]['nba_player_id'];
	var salary = data["daily_projections"][i]["fanduel_salary"];
	var points = data["daily_projections"][i]["fanduel_fp"];
	var ratio = data["daily_projections"][i]["fanduel_ratio"];
	projection.push(id, salary, points, ratio);
	projectionArray.push(projection);
}

// // PLAYER ARRAY ------------------------------------------
// // POOLS ALL PLAYER DATA FROM NUMBERFIRE
// // INCLUDING: PLAYER ID, NAME, POSITION

for (var i = 0; i < playerLength; i++){
	if(data["players"][i]!==undefined){
		player = [];
		var id = data["players"][i]['id'];
		var name = data["players"][i]['name'];
		//var team = data["players"][i]['team']
		var position = data["players"][i]['depth_position'];
		player.push(id, name, position);
		playerArray.push(player);
	}
}

// // OMNIBUS ARRAY [COMBINES ALL DATA] ---------------------
// // CONNECTS PROJECTION AND PLAYER DATA VIA PLAYER ID
// // INCLUDING: NAME, POSITION, SALARY, POINTS, RATIO

plaLength = playerArray.length
proLength = projectionArray.length

for (var l = 0; l < proLength; l++){
	for (var k = 0; k < plaLength; k++){
		if(playerArray[l][0] === projectionArray[k][0]){
			var name = playerArray[l][1]
			var position = playerArray[l][2]
			var salary = projectionArray[k][1]
			var points = projectionArray[k][2]
			var ratio = projectionArray[k][3]
			completePlayer = []
			completePlayer.push(name, position, salary, points, ratio)
			if(ratio > 4 && points > 25){
				omnibus.push(completePlayer)
			}
		}
	}
}

// // POSITION FUNCTION --------------------------------------
// // BREAKS DOWN OMNIBUS ARRAY BY POSITION, CREATING POSITIONAL ARRAYS
// // INCLUDING: NAME, POSITION, SALARY, POINTS, RATIO

var omnibusLength = omnibus.length

function positionFunc(pos, array){
	for (var i = 0; i < omnibusLength; i++){
		if(omnibus[i][1] == pos){
			array.push(omnibus[i]);
		}
	}
}

positionFunc('PG', allPG)
positionFunc('SG', allSG)
positionFunc('SF', allSF)
positionFunc('PF', allPF)
positionFunc('C', allC)


// possibleLineups = allPG.length * (allPG.length - 1) * allSG.length * (allSG.length - 1) * allSF.length * (allSF.length - 1) * allPF.length * (allPF.length - 1) * allC.length
// console.log(allPG.length, allSG.length, allSF.length, allPF.length, allC.length, possibleLineups)
// console.log(allPG, allSG, allSF, allPF, allC)

// console.log(allC)

// // POSITION PAIRS -----------------------------------------
// // PAIRS UP PLAYERS AT PARTICULAR POSITION TO ACCOUNT FOR
// // TWO STARTERS AT EACH POSITION OTHER THAN CENTER

function positionPairs(origArray, newArray){
	var length = origArray.length
	for (var j = 0; j < length; j++){
		var i = j + 1;
		for (var i = 0; i < length; i++){
			var pos1name = origArray[j][0]
			var pos2name = origArray[i][0]
			var price = origArray[j][2] + origArray[i][2]
			var points = origArray[j][3] + origArray[i][3]
			var pairArray = []
			pairArray.push(pos1name, pos2name, price, points)
			if(i!=j){
				newArray.push(pairArray)
			}
		}
	}
}

positionPairs(allPG, pgAllPairs)
positionPairs(allSG, sgAllPairs)
positionPairs(allSF, sfAllPairs)
positionPairs(allPF, pfAllPairs)

// console.log(pgAllPairs, sgAllPairs, sfAllPairs, pfAllPairs)

// // POSITION QUADS ------------------------------------------
// // QUADS UP PLAYERS AT TWO POSITIONS.
// // FILTERING IS CONTROLLED BY FINAL IF STATEMENT, WHERE QUAD
// // ARE PUSHED TO ARRAY IF IT MEETS STANDARDS DEFINED.

function positionQuads(pairArray1, pairArray2, newArray){
	var length1 = pairArray1.length
	var length2 = pairArray2.length
	for (var j = 0; j < length1; j++){
		var i = j + 1;
		for (var i; i< length2; i++){
			var pos1name = pairArray1[j][0]
			var pos2name = pairArray1[j][1]
			var pos3name = pairArray2[i][0]
			var pos4name = pairArray2[i][1]
			var price = pairArray1[j][2] + pairArray2[i][2]
			var points = pairArray1[j][3] + pairArray2[i][3]
			posQuad = []
			posQuad.push(pos1name, pos2name, pos3name, pos4name, price, points);
			if(i!=j){
				newArray.push(posQuad);		
			}
		}
	}
}

positionQuads(pgAllPairs, sgAllPairs, pgsgQuad)
positionQuads(sfAllPairs, pfAllPairs, sfpfQuad)


console.log(allPG.length, allSG.length, allSF.length, allPF.length, allC.length)
console.log(pgAllPairs.length, sgAllPairs.length, sfAllPairs.length, pfAllPairs.length)
console.log(pgsgQuad.length, sfpfQuad.length)

// console.log(pgsgQuad.length, sfpfQuad.length)

// // POSITION EIGHTS -----------------------------------------
// // GENERATES TEAMS OF EIGHT. INCLUDING ALL PLAYERS OTHER THAN
// // CENTER.

var length1 = pgsgQuad.length;
var length2 = sfpfQuad.length;

for (var j = 0; j < length1; j++){
	var i = j + 1;
	for (var i = 0; i < length2; i++){
		var pos1name = pgsgQuad[j][0]
		var pos2name = pgsgQuad[j][1]
		var pos3name = pgsgQuad[j][2]
		var pos4name = pgsgQuad[j][3]
		var pos5name = sfpfQuad[i][0]
		var pos6name = sfpfQuad[i][1]
		var pos7name = sfpfQuad[i][2]
		var pos8name = sfpfQuad[i][3]
		for (var h = 0; h < allC.length; h++){
			var pos9name = allC[h][0]
			var price = pgsgQuad[j][4] + sfpfQuad[i][4] + allC[h][2]
			var points = pgsgQuad[j][5] + sfpfQuad[i][5] + allC[h][3]
			posEight = []
			posEight.push(pos1name, pos2name, pos3name, pos4name, pos5name, pos6name, pos7name, pos8name, pos9name, price, points)
			if(points > 270 && price <= 60000){
				eight.push(posEight)
			}
		}
	}
}

// // STARTING 9 ---------------------------------------------
// // GENERATES ARRAY OF STARTING LINEUPS IN CONSIDERATION
// // LINEUPS ARE PUSHED TO ARRAY IF PRICE IS LESS
// // THAN $60K





// var length1 = eight.length
// var length2 = allC.length

// for (var j = 0; j < length1; j++){
// 	var i = j + 1
// 	for (var i; i < length2; i++){
// 		var pos1name = eight[i][0]
// 		var pos2name = eight[i][1]
// 		var pos3name = eight[i][2]
// 		var pos4name = eight[i][3]
// 		var pos5name = eight[i][4]
// 		var pos6name = eight[i][5]
// 		var pos7name = eight[i][6]
// 		var pos8name = eight[i][7]
// 		var pos9name = allC[j][0]
// 		var price = eight[i][8] + allC[j][2]
// 		var points = eight[i][9] + allC[j][3]
// 		start9 = []
// 		start9.push(pos1name, pos2name, pos3name, pos4name, pos5name, pos6name, pos7name, pos8name, pos9name, price, points)
// 		// if(i!=j){
// 		lineups.push(start9)
// 			// if(price <= 60000){
// 			// 	lineups.push(start9)
// 			// }
// 		// }
// 	}	
// }

// // SORT ---------------------------------------------------
// // SORTS ALL QUALIFYING STARTING LINEUPS IN ORDER OF HIGHEST
// // TO LOWEST PROJECTED POINTS.

var sortedOut = eight
sortedOut.sort(function(a,b){
	return b[10] - a[10]
})

// console.log(sortedOut.length)
// console.log(sortedOut)

console.log(eight.length)
console.log(lineups.length)
console.log(sortedOut)


