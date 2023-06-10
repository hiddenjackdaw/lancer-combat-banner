/*Currently a mess with dumb fail-through chekcing of the V9 and V10 datamodels. Would be a lot better with actual checking of the foundry versio and separated functions for each. Also, need more V9 testing.*/

export function getMechClass(actor) {
	if( game.data.release.generation != 10){
		console.error("This version of LancerCombatBanner is only for V10");
		return "///";
	}
	if (actor.type == "npc") {
		let npcClass =  actor.items.find(e => {return e.type == "npc_class"})?.name || "npc";
		let npcTemplates = actor.items.filter(e => {return e.type == "npc_template"})
			.map(e => {return e.name})
			.join(" ");
		return npcTemplates + " " + npcClass;
	} else if (actor.type == "mech") {
		return actor.name;
	} else if (actor.type == "pilot") {
		return actor.name;
	}
	return "///";
}

export function getCallsign(actor) {
	if (actor.type == "pilot") {
		if (actor.system?.callsign) {
			return actor.system.callsign;
		}
		if (actor.data.data.callsign) {
			return actor.data.data.callsign;
		}
		if (actor.name) {
			return actor.name;
		}
		if (actor.data.data.name) {
			return actor.data.data.name;
		}
	}
	if (actor.type == "mech") {
		let pilot = game.actors.get(actor.system?.pilot?.id);
		if (pilot && pilot.system.callsign) {
			return pilot.system.callsign;
		} else if (pilot) {
			return pilot.name;
		} else {
			pilot = game.actors.get(actor.data.data.pilot?.id);
			if (pilot && pilot.data.data.callsign) {
				return pilot.data.data.callsign;
			} else if (pilot && pilot.data.data.name) {
				return pilot.data.data.name;
			}
		}
	}
	if (actor.name) {
		return actor.name;
	}
	if (actor.data.name) {
		return actor.data.name;
	}
	return "///";
}