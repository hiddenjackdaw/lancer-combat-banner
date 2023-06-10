var cssDataRoot;

export function setColors(combatant){
	cssDataRoot = document.querySelector(':root');
	let mode = game.settings.get( "LancerCombatBanner", "colorMode" );

	if(mode  === "user"){
		setUserColors(combatant);
	} else if (mode  === "default"){
		setColor(  fetchColor( "defaultColor" ) );
	} else if (mode  === "side"){
		setSideColors(combatant);
	} 

}

function setUserColors(combatant){
	if (combatant?.hasPlayerOwner && combatant?.players[0].active) {
		const ownerColor = combatant?.players[0]["color"];
		setColor( ownerColor );
	} else {
		const firstGm = game.users.find((u) => u.isGM && u.active);
		setColor( firstGm["color"] );
	}
}

function setSideColors(combatant){
	if( combatant?.token?.disposition === 1){
		setColor(  fetchColor( "friendlyColor" ) );
	} else if( combatant?.token?.disposition === 0){
		setColor(  fetchColor( "neutralColor" ) );
	} else if( combatant?.token?.disposition === -1){
		setColor(  fetchColor( "hostileColor" ) );
	} else {
		setColor( fetchColor( "defaultColor" ) );
	}
}
function setColor( color ){
	cssDataRoot.style.setProperty('--ADA_COMBATBANNER_color', color );
	cssDataRoot.style.setProperty('--ADA_COMBATBANNER_colorTransparent', color );
}
function fetchColor( from ){
	let color = game.settings.get( "LancerCombatBanner", from );
	if( color.length === 9){
		color = color.substring(0, 7);
	}		
	return color
}