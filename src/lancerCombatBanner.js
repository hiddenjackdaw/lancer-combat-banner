
import {getMechClass, getCallsign} from "./lancerDataTools.js";

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
		
		
		let callsign = getCallsign(combatant.actor);
		let mechClass = getMechClass(combatant.actor);
		if (callsign == mechClass) {
			mechClass = "";
		}
		
		const firstGm = game.users.find((u) => u.isGM && u.active);
		gmColor = firstGm["color"];
		

		theImage = combatant.actor.img;

		safeDelete(currentImgID);
		safeDelete("yourTurnBanner");


		let currentImgHTML = document.createElement("img");
		currentImgHTML.id = currentImgID;
		currentImgHTML.className = "yourTurnImg";
		currentImgHTML.src = theImage;
		currentImgHTML.classList.add("adding");

		let bannerDiv = document.createElement("div");
		bannerDiv.id = "yourTurnBanner";
		bannerDiv.className = "yourTurnBanner";
		bannerDiv.style.height = 150;
		bannerDiv.innerHTML =`
		<div class="roundCount">
		  ${game.i18n.localize('ADA_COMBATBANNER.Round')} #${combat.round}
		</div>
		<p id="yourTurnText" class="yourTurnText">${callsign}</p>
		<div class="yourTurnSubheading">
		  「${mechClass}」</span>
		</div>
		<div id="yourTurnBannerBackground" class="yourTurnBannerBackground" height="150"></div>`;

		var cssDataRoot = document.querySelector(':root');
		if (combat ? .combatant ? .hasPlayerOwner && combat ? .combatant ? .players[0].active) {
			const ytPlayerColor = combat ? .combatant ? .players[0]["color"];
			cssDataRoot.style.setProperty('--yourTurnPlayerColor', ytPlayerColor);
			cssDataRoot.style.setProperty('--yourTurnPlayerColorTransparent', ytPlayerColor + "80");
		} else {
			cssDataRoot.style.setProperty('--yourTurnPlayerColor', gmColor);
			cssDataRoot.style.setProperty('--yourTurnPlayerColorTransparent', gmColor + "80");
		}

		bannerContainer.append(currentImgHTML)
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
