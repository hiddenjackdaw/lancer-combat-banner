
export function buildSettings(){
	game.settings.register("AdaCombatBanner", "announceTurn", {
		name: "ADA_COMBATBANNER.Settings.announceTurn.Name",
		hint: "ADA_COMBATBANNER.Settings.announceTurn.Hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});
	game.settings.register("AdaCombatBanner", "announceRound", {
		name: "ADA_COMBATBANNER.Settings.announceRound.Name",
		hint: "ADA_COMBATBANNER.Settings.announceRound.Hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});

}