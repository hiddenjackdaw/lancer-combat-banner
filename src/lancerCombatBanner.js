
export let adaCombatBanner = new AdaCombatBanner();
adaCombatBanner.init();

function AdaCombatBanner() {

	pause = true;
	let gmColor;
	let myTimer;
	let theImage;
	let bannerContainer; 
	
	this.init = function() {
		Hooks.on("ready", () => {
			const firstGm = game.users.find((u) => u.isGM && u.active);
			gmColor = firstGm["color"];
			
			Hooks.on("updateCombat", (combat, update, options, userId) => {
				onUpdateCombat(combat, update, options, userId);
			});
			
			bannerContainer = document.getElementById("yourTurnContainer");
			if (bannerContainer == null) {
				let bannerContainerDiv = document.createElement("div");
				let uiTOP = document.getElementById("ui-top");
				bannerContainerDiv.id = "yourTurnContainer";
				uiTOP.appendChild(bannerContainerDiv);
				bannerContainer = document.getElementById("yourTurnContainer");
			}
			
		});
	}

	function onUpdateCombat(combat, update, options, userId) {

		if (!combat.started) {
			return;
		}
		if (!typeof update["turn"] === "number" || !combat?.combatant) {
			if (typeof update["round"] === "number" && !combat?.combatant) {
				//newRound(update["round"]);
			}
			return;
		}

		if (typeof update["turn"] === "number" && combat?.combatant) {
			newTurn(combat, combat.combatant);
		}
	}
	

	function newTurn(combat, combatant) {
		const firstGm = game.users.find((u) => u.isGM && u.active);
		gmColor = firstGm["color"];
		
		console.log(update);

		theImage = combatant.actor.img;

		var ytName = combat ? .combatant.name;
		var ytText = "";
		var ytImgClass = new Array();
		ytImgClass.push("adding");
		
		ytText = `${ytName}'s ${game.i18n.localize('YOUR-TURN.Turn')}!`;

		let nextCombatant = getNextCombatant(combat);
		let expectedNext = combat ? .nextCombatant;



		safeDelete(currentImgID);
		safeDelete("yourTurnBanner");

		var nextImg = document.getElementById(nextImgID);

		if (nextImg != null) {
			if (combat ? .combatant != expectedNext) {
				nextImg.remove();
				currentImgID = null;
			} else {
				currentImgID = nextImgID;
			}
		}


		let currentImgHTML = document.createElement("img");
		currentImgHTML.id = currentImgID;
		currentImgHTML.className = "yourTurnImg";
		currentImgHTML.src = theImage;

		bannerContainer.append(currentImgHTML)
		console.log(imgHTML);

		let bannerDiv = document.createElement("div");
		bannerDiv.id = "yourTurnBanner";
		bannerDiv.className = "yourTurnBanner";
		bannerDiv.style.height = 150;
		bannerDiv.innerHTML = `<p id="yourTurnText" class="yourTurnText">${ytText}</p><div class="yourTurnSubheading">${game.i18n.localize('YOUR-TURN.Round')} #${combat.round} ${game.i18n.localize('YOUR-TURN.Turn')} #${combat.turn}</div>${getNextTurnHtml(nextCombatant)}<div id="yourTurnBannerBackground" class="yourTurnBannerBackground" height="150"></div>`;

		var cssDataRoot = document.querySelector(':root');
		if (combat ? .combatant ? .hasPlayerOwner && combat ? .combatant ? .players[0].active) {
			const ytPlayerColor = combat ? .combatant ? .players[0]["color"];
			cssDataRoot.style.setProperty('--yourTurnPlayerColor', ytPlayerColor);
			cssDataRoot.style.setProperty('--yourTurnPlayerColorTransparent', ytPlayerColor + "80");
		} else {
			cssDataRoot.style.setProperty('--yourTurnPlayerColor', gmColor);
			cssDataRoot.style.setProperty('--yourTurnPlayerColorTransparent', gmColor + "80");
		}

		let currentImgHTML = document.getElementById(currentImgID);
		while (ytImgClass.length > 0) {
			currentImgHTML.classList.add(ytImgClass.pop());
		}

		container.append(currentImgHTML);
		bannerContainer.append(bannerDiv);

		clearInterval(this ? .myTimer);
		myTimer = setInterval(() => {
			if (!pause) {
				unloadImage();
			}
		}, 5000);
	}



	function unloadImage() {
		clearInterval(myTimer);
		var element = document.getElementById("yourTurnBannerBackground");
		element.classList.add("removing");

		element = document.getElementById("yourTurnBanner");
		element.classList.add("removing");

		element = document.getElementById(currentImgID);
		element.classList.add("removing");
	}

	function safeDelete(elementID) {

		var targetElement = document.getElementById(elementID);
		if (targetElement != null) {
			targetElement.remove();
		}
	}

}
