var cssDataRoot;

export function setColors(combatant){
	cssDataRoot = document.querySelector(':root');
	let mode = game.settings.get( "LancerCombatBanner", "colorMode" );

	
	if(mode  === "user"){
		setUserColors(combatant);
	} else if (mode  === "default"){
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "defaultColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "defaultColor"  ) + "30");
	} else if (mode  === "side"){
		setSideColors(combatant);
	} 

}

function setUserColors(combatant){
	if (combatant?.hasPlayerOwner && combatant?.players[0].active) {
		const ownerColor = combatant?.players[0]["color"];
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', ownerColor);
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', ownerColor + "30");
	} else {
		const firstGm = game.users.find((u) => u.isGM && u.active);
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', firstGm["color"]);
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', firstGm["color"] + "30");
	}
}

function setSideColors(combatant){
	if( combatant?.token?.disposition === 1){
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "friendlyColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "friendlyColor"  ) + "30");
	} else if( combatant?.token?.disposition === 0){
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "neutralColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "neutralColor"  ) + "30");
	} else if( combatant?.token?.disposition === -1){
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "hostileColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "hostileColor"  ) + "30");
	} else {
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "defaultColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "defaultColor"  ) + "30");
	}
	
	// friendly == 2
	
}