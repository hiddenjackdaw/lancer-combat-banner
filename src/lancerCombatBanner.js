
import {
	adaSettings
}
from "./settings.js";
export let adaCombatBanner = new AdaCombatBanner();
adaCombatBanner.init();

function AdaCombatBanner() {

	pause = true;
	let gmColor;
	let myTimer;
	let theImage;
	let bannerContainer; 
	
	init() {
		Hooks.on("ready", () => {
			const firstGm = game.users.find((u) => u.isGM && u.active);
			gmColor = firstGm["color"];
			Hooks.on("updateCombat", (combat, update, options, userId) => {
				TurnSubscriber._onUpdateCombat(combat, update, options, userId);
			});
			//game.yourturnHUD = new YourTurnHUD();
		});
	}

	function _onUpdateCombat(combat, update, options, userId) {

		if (!combat.started) {
			return;
		}
		if (!typeof update["turn"] === "number" || !combat?.combatant) {
			return;
		}

		console.log(update);

		image = combat ? .combatant.actor.img;

		var ytName = combat ? .combatant.name;
		var ytText = "";
		var ytImgClass = new Array();
		ytImgClass.push("adding");

		if (game.modules.get('combat-utility-belt') ? .active) {
			if (game.cub.hideNames.shouldReplaceName(combat ? .combatant ? .actor)) {
				ytName = game.cub.hideNames.getReplacementName(combat ? .combatant ? .actor)
			}
		}

		if (combat ? .combatant ? .isOwner && !game.user.isGM && combat ? .combatant ? .players[0] ? .active) {
			ytText = `${game.i18n.localize('YOUR-TURN.YourTurn')}, ${ytName}!`;
		} else if (combat ? .combatant ? .hidden && !game.user.isGM) {
			ytText = `${game.i18n.localize('YOUR-TURN.SomethingHappens')}`
				ytImgClass.push("silhoutte");
		} else {
			ytText = `${ytName}'s ${game.i18n.localize('YOUR-TURN.Turn')}!`;
		}

		let nextCombatant = getNextCombatant(combat);
		let expectedNext = combat ? .nextCombatant;

		var container = document.getElementById("yourTurnContainer");
		if (container == null) {
			let containerDiv = document.createElement("div");
			let uiTOP = document.getElementById("ui-top");
			containerDiv.id = "yourTurnContainer";

			uiTOP.appendChild(containerDiv);

			console.log("Appended Container");
			console.log(uiTOP.childNodes);

			container = document.getElementById("yourTurnContainer");
		}

		checkAndDelete(currentImgID);
		checkAndDelete("yourTurnBanner");

		var nextImg = document.getElementById(nextImgID);

		if (nextImg != null) {
			if (combat ? .combatant != expectedNext) {
				nextImg.remove();
				currentImgID = null;
			} else {
				currentImgID = nextImgID;
			}
		}

		imgCount = imgCount + 1;
		nextImgID = `yourTurnImg${imgCount}`;

		let imgHTML = document.createElement("img");
		imgHTML.id = nextImgID;
		imgHTML.className = "yourTurnImg";
		imgHTML.src = expectedNext ? .actor.img;

		if (currentImgID == null) {
			currentImgID = `yourTurnImg${imgCount - 1}`;

			let currentImgHTML = document.createElement("img");
			currentImgHTML.id = currentImgID;
			currentImgHTML.className = "yourTurnImg";
			currentImgHTML.src = image;

			container.append(currentImgHTML)
			console.log(imgHTML);
		}

		let bannerDiv = document.createElement("div");
		bannerDiv.id = "yourTurnBanner";
		bannerDiv.className = "yourTurnBanner";
		bannerDiv.style.height = 150;
		bannerDiv.innerHTML = `<p id="yourTurnText" class="yourTurnText">${ytText}</p><div class="yourTurnSubheading">${game.i18n.localize('YOUR-TURN.Round')} #${combat.round} ${game.i18n.localize('YOUR-TURN.Turn')} #${combat.turn}</div>${getNextTurnHtml(nextCombatant)}<div id="yourTurnBannerBackground" class="yourTurnBannerBackground" height="150"></div>`;

		var r = document.querySelector(':root');
		if (combat ? .combatant ? .hasPlayerOwner && combat ? .combatant ? .players[0].active) {
			const ytPlayerColor = combat ? .combatant ? .players[0]["color"];
			r.style.setProperty('--yourTurnPlayerColor', ytPlayerColor);
			r.style.setProperty('--yourTurnPlayerColorTransparent', ytPlayerColor + "80");
		} else {
			r.style.setProperty('--yourTurnPlayerColor', gmColor);
			r.style.setProperty('--yourTurnPlayerColorTransparent', gmColor + "80");
		}

		let currentImgHTML = document.getElementById(currentImgID);
		while (ytImgClass.length > 0) {
			currentImgHTML.classList.add(ytImgClass.pop());
		}

		container.append(imgHTML);
		container.append(bannerDiv);

		clearInterval(this ? .myTimer);
		myTimer = setInterval(() => {
			if (!pause) {
				unloadImage();
			}
		}, 5000);
	}

	function loadNextImage(combat) {
		//Put next turns image in a hidden side banner
		let nextTurn = combat.turn + 1;

		let hiddenImgHTML = `<div id="yourTurnPreload"><img id="yourTurnPreloadImg" src=${combat?.turns[(combat.turn + 1) % combat.turns.length].actor.img} loading="eager" width="800" height="800" ></img><div>`

			if ($("body").find(`div[id="yourTurnPreload"]`).length > 0) {
				$("body").find(`div[id="yourTurnPreload"]`).remove();
			}

			$("body").append(hiddenImgHTML);
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

	function getNextCombatant(combat) {
		let j = 1;
		let combatant = combat ? .turns[(combat.turn + j) % combat.turns.length];
		while (combatant.hidden && (j < combat.turns.length) && !game.user.isGM) {
			j++;
			combatant = combat ? .turns[(combat.turn + j) % combat.turns.length];
		}

		return combatant;
	}

	function getNextTurnHtml(combatant) {
		let displayNext = true;

		let name = combatant.name;
		let imgClass = "yourTurnImg yourTurnSubheading";

		if (game.modules.get('combat-utility-belt') ? .active) {
			if (game.cub.hideNames.shouldReplaceName(combatant ? .actor)) {
				name = game.cub.hideNames.getReplacementName(combatant ? .actor)
					imgClass = imgClass + " silhoutte";
			}
		}

		//displayNext = (j != combat.turns.length);

		if (displayNext) {
			let rv = `<div class="yourTurnSubheading last">${game.i18n.localize('YOUR-TURN.NextUp')}:  <img class="${imgClass}" src="${combatant.actor.img}"></img>${name}</div>`;
			console.log(rv);
			return rv;
		} else {
			return null;
		}

	}

	function checkAndDelete(elementID) {

		var prevImg = document.getElementById(elementID);
		if (prevImg != null) {
			prevImg.remove();
		}
	}

}
