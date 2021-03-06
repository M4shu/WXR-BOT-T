module.exports = {
	name: "Edit Channel",  
	section: "Channel Control",  

	subtitle: function(data) {
		const names = ["Same Channel", "Mentioned Channel", "Default Channel", "Temp Variable", "Server Variable", "Global Variable"];
		const opt = ["Name", "Topic", "Position", "Bitrate", "User Limit", "Category ID", "Rate Limit Per User"];
		return `${names[parseInt(data.storage)]} - ${opt[parseInt(data.toChange)]}`;
	},  

	fields: ["storage", "varName", "channelType", "toChange", "newState"],  

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Channel:<br>
			<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Channel Type:<br>
			<select id="channelType" class="round">
				<option value="0" selected>Text Channel</option>
				<option value="1">Voice Channel</option>
			</select>
		</div><br><br><br>
	</div>
	<div>
		<div style="float: left; width: 35%;">
			Change:<br>
			<select id="toChange" class="round">
				<option value="0" selected>Name</option>
				<option value="1">Topic</option>
				<option value="2">Position</option>
				<option value="3">Bitrate</option>
				<option value="4">User Limit</option>
				<option value="5">Category ID</option>
				<option value="6">Rate Limit Per User</option>
			</select>
		</div><br><br><br>
	<div>
		<div style="float: left; width: 80%;">
			Change to:<br>
			<input id="newState" class="round" type="text"><br>
		</div>
	</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.channelChange(document.getElementById("storage"), "varNameContainer");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const channelType = parseInt(data.channelType);
		const newState = this.evalMessage(data.newState, cache);
		const toChange = parseInt(data.toChange, cache);

		let channel;
		switch(channelType) {
			case 0:
				channel = this.getChannel(storage, varName, cache);
				break;
			case 1:
				channel = this.getVoiceChannel(storage, varName, cache);
				break;
			default:
				channel = this.getChannel(storage, varName, cache);
				break;
		}

		if(toChange === 1) {
			channel.edit({ topic: newState });
		} else if(toChange === 0) {
			channel.edit({ name: newState });
		} else if(toChange === 2) {
			channel.edit({ position: newState });
		} else if(toChange === 3) {
			channel.edit({ bitrate: parseInt(newState) });
		} else if(toChange === 4) {
			channel.edit({ userLimit: parseInt(newState) });
		} else if(toChange === 5) {
			channel.setParent(newState);
		} else if(toChange === 6) {
			if(newState >= 0 && newState <= 120) {

				new Promise((resolve, _reject) => {
					this.getWrexMods().require("snekfetch").patch("https://discordapp.com/api/channels/" + channel.id)
						.set("Authorization", `Bot ${this.getDBM().Files.data.settings.token}`)
						.send({ rate_limit_per_user: newState })
						.catch();

				}).catch(console.error);

			} else {
				console.log("Edit Channel ERROR: The value must be between 0 and 120");
			}
		} else {
			console.log("Please update your edit_channel_MOD.js in your projects action folder!");
		}
		this.callNextAction(cache);
	},  

	mod: function(DBM) {
		DBM.Actions["Edit channel"] = DBM.Actions["Edit Channel"];
	}

}; 
