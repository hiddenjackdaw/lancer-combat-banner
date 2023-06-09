
export function setColors(combatant){
	
	let gmColor;
	const firstGm = game.users.find((u) => u.isGM && u.active);
	gmColor = firstGm["color"];
			
	var cssDataRoot = document.querySelector(':root');
	
	if (combatant?.hasPlayerOwner && combatant?.players[0].active) {
		const ownerColor = combatant?.players[0]["color"];
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', ownerColor);
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', ownerColor + "30");
	} else {
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', gmColor);
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', gmColor + "30");
	}
	if( game.settings.get( "LancerCombatBanner", "forceDefaultColor"  ) && /^#([0-9A-F]{3}){1,2}$/i.test( game.settings.get( "LancerCombatBanner", "defaultColor"  ) ) ){
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', game.settings.get( "LancerCombatBanner", "defaultColor"  ));
		cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', game.settings.get( "LancerCombatBanner", "defaultColor"  ) + "30");
		
	}
}