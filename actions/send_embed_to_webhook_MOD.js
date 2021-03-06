module.exports = {
	name: "Send Embed to Webhook",  
	section: "Webhook Control",  

	subtitle: function(data) {
		return `${data.varName2}`;
	},  

	depends_on_mods: [
		{ name:"WrexMods", path:"aaa_wrexmods_dependencies_MOD.js" }
	],  

	fields: ["storage", "varName", "storage2", "varName2"],  

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Webhook:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="storage2" class="round" onchange="glob.refreshVariableList(this, 'varNameContainer2')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList"><br>
</div>
`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("storage"));
		glob.refreshVariableList(document.getElementById("storage2"), "varNameContainer2");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		var WrexMods = this.getWrexMods();
		const webhook = WrexMods.getWebhook(storage, varName, cache);

		const storage2 = parseInt(data.storage2);
		const varName2 = this.evalMessage(data.varName2, cache);
		const embed2 = this.getVariable(storage2, varName2, cache);

		if(!embed2) {
			this.callNextAction(cache);
			return;
		}

		if(!webhook) {
			this.callNextAction(cache);
			return;
		}

		webhook.send(embed2);
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
