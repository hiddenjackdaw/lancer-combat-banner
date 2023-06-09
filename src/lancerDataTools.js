
export function getMechClass(actor) {
	// console.log("\n\n=======>\n\n");
	// console.log(actor);
	if (actor.type == "npc") {
		return actor.items.filter(e => {
			return e.type == "npc_template"
		})
		.map(e => {
			return e.name
		})
		.join(" ") + " " + actor.items.find(e => {
			return e.type == "npc_class"
		}).name;
		return actor.items.find(e => {
			return e.type == "npc_class"
		}).name
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