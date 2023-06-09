import {buildSettings} from "./lcbSettings.js";
import {getMechClass, getCallsign} from "./lcbTools.js";

export let adaCombatBanner = new LancerCombatBanner();
adaCombatBanner.init();

function LancerCombatBanner() {

	let debugPause = false;
	let gmColor;
	let turnBannerTimer;
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
			buildSettings();
			
		});
	}

	function onUpdateCombat(combat, update, options, userId) {
		if (!combat.started) {
			return;
		}
		if (!typeof update["turn"] === "number" || !combat?.combatant) {
			if (typeof update["round"] === "number" && !combat?.combatant) {
				newRound(update["round"]);
			}
			return;
		}
		if (typeof update["turn"] === "number" && combat?.combatant) {
			newTurn(combat, combat.combatant);
		}
	}
	
	function newRound(roundNumber) {
		console.log("new round");
		if (game.settings.get("LancerCombatBanner", "announceRound")) {
			let chatData = {
				speaker: {
					alias: game.i18n.localize('ADA_COMBATBANNER.NextRound')
				},
				type: CONST.CHAT_MESSAGE_TYPES.OOC,
				content: `${game.i18n.localize('ADA_COMBATBANNER.StartOfRound')}: ${roundNumber} `
			};
			ChatMessage.create(chatData)
		}
		
		safeDelete("newRoundBanner");
		safeDelete("yourTurnImageId");
		safeDelete("yourTurnBanner");		
		
		let bannerDiv = document.createElement("div");
		bannerDiv.id = "newRoundBanner";
		bannerDiv.className = "newRoundBanner";
		bannerDiv.style.height = 150;
		bannerDiv.innerHTML = `
		<div class="newRoundTitle">
		  ${game.i18n.localize('ADA_COMBATBANNER.StartOfRound')} #${roundNumber}
		</div></div>`;

		bannerContainer.append(bannerDiv);
		
		setTimeout(() => {
			if (!adaCombatBanner.pause) {	
				let element = document.getElementById("newRoundBanner");
				if(element){
					element.classList.add("removing");
				}
			}
		}, 5000);
	}
	
	function newTurn(combat, combatant) {
		
		let callsign = getCallsign(combatant.actor);
		let mechClass = getMechClass(combatant.actor);
		if (callsign == mechClass) {
			mechClass = "";
		}
		
		if (game.settings.get("LancerCombatBanner", "announceTurn")) {
			let chatData = {
				speaker: {
					alias: game.i18n.localize('ADA_COMBATBANNER.NextTurn')
				},
				type: CONST.CHAT_MESSAGE_TYPES.OOC,
				content: `${game.i18n.localize('ADA_COMBATBANNER.Activate')} ${callsign}`
			};
			ChatMessage.create(chatData);
		}
		
		safeDelete("newRoundBanner");
		safeDelete("yourTurnImageId");
		safeDelete("yourTurnBanner");		

		theImage = combatant.actor.img;

		let currentImgHTML = document.createElement("img");
		currentImgHTML.id = "yourTurnImageId";
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
		if (combatant?.hasPlayerOwner && combatant?.players[0].active) {
			const ytPlayerColor = combatant?.players[0]["color"];
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', ytPlayerColor);
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', ytPlayerColor + "30");
		} else {
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', gmColor);
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', gmColor + "30");
		}
		if( game.settings.get( "LancerCombatBanner", "forceDefaultColor"  ) && /^#([0-9A-F]{3}){1,2}$/i.test( game.settings.get( "LancerCombatBanner", "defaultColor"  ) ) ){
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "defaultColor"  ));
			cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "defaultColor"  ) + "30");
			
		}
		
		bannerContainer.append(currentImgHTML)
		bannerContainer.append(bannerDiv);

		clearInterval(this?.turnBannerTimer);
		turnBannerTimer = setInterval(() => {
			if (!debugPause) {
				unloadImage();
			}
		}, 5000);
	}



	function unloadImage() {
		clearInterval(turnBannerTimer);
		var element = document.getElementById("yourTurnBannerBackground");
		if(element){
			element.classList.add("removing");
		}

		element = document.getElementById("yourTurnBanner");
		if(element){
			element.classList.add("removing");
		}

		element = document.getElementById("yourTurnImageId");
		if(element){
			element.classList.add("removing");
		}
	}

	function safeDelete(elementID) {
		var targetElement = document.getElementById(elementID);
		if (targetElement != null) {
			targetElement.remove();
		}
	}

}
