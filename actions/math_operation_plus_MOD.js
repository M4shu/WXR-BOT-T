module.exports = {
	name: "Math Operation Plus",  
	section: "Other Stuff",  

	subtitle: function(data) {
		const info = ["Addition", "Subtraction", "Multiplication", "Division", "Round", "Round to S.F.", "Absolute", "Ceil", "Floor", "Factorial", "Raised by (Exponents)", "Rooted by (Roots)", "Sine", "Cosine", "Tangent", "Arc Sine", "Arc Cosine", "Arc Tangent", "% Of Number", "Increase By %", "Decrease By %", "Value of Pi", "Value of Eulers number"];
		return `${info[data.info]}`;
	},  

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = "Number";
		return ([data.varName, dataType]);
	},  

	fields: ["FirstNumber", "info", "SecondNumber", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
<div id="FirstNum" style="width: 90%;">
	First Number:<br>
	<input id="FirstNumber" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
	Math Operation:
	<select id="info" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Addition</option>
			<option value="1">Subtraction</option>
			<option value="2">Multiplication</option>
			<option value="3">Division</option>
			<option value="4">Round</option>
			<option value="5">Round to S.F.</option>
			<option value="6">Absolute</option>
			<option value="7">Ceil</option>
			<option value="8">Floor</option>
			<option value="9">Factorial</option>
			<option value="10">Raised by (Exponents)</option>
			<option value="11">Rooted by (Roots)</option>
			<option value="12">Sine</option>
			<option value="13">Cosine</option>
			<option value="14">Tangent</option>
			<option value="15">Arc Sine</option>
			<option value="16">Arc Cosine</option>
			<option value="17">Arc Tangent</option>
			<option value="18">% Of Number</option>
			<option value="19">Increase Number By %</option>
			<option value="20">Decrease Number By %</option>
			<option value="21">Value of Pi</option>
			<option value="22">Value of Eulers number</option>
	</select>
</div><br>
<div id="SecondNum" style="width: 90%;">
	Second Number:<br>
	<input id="SecondNumber" class="round" type="text">
</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>
	`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById("SecondNum");
			const dom2 = document.getElementById("FirstNum");

			if (value == 0) {
				dom.style.display = null;
			} else if (value == 1) {
				dom.style.display = null;
			} else if (value == 2) {
				dom.style.display = null;
			} else if (value == 3) {
				dom.style.display = null;
			} else if (value == 5) {
				dom.style.display = null;
			} else if (value == 10) {
				dom.style.display = null;
			} else if (value == 11) {
				dom.style.display = null;
			} else if (value == 18) {
				dom.style.display = null;
			} else if (value == 19) {
				dom.style.display = null;
			} else if (value == 20) {
				dom.style.display = null;
			} else {
				dom.style.display = "none";
			}

			if (value < 21) {
				dom2.style.display = null;

			} else {
				dom2.style.display = "none";
			}

		};
		glob.onChange1(document.getElementById("info"));

	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const FN = parseFloat(this.evalMessage(data.FirstNumber, cache).replace(/,/g, ""));
		const SN = parseFloat(this.evalMessage(data.SecondNumber, cache).replace(/,/g, ""));
		const info = parseInt(data.info);

		let result;
		switch(info) {
			case 0:
				result = FN + SN;
				break;
			case 1:
				result = FN - SN;
				break;
			case 2:
				result = FN * SN;
				break;
			case 3:
				result = FN / SN;
				break;
			case 4:
				result = Math.round(FN);
				break;
			case 5:
				result = FN.toPrecision(SN);
				break;
			case 6:
				result = Math.abs(FN);
				break;
			case 7:
				result = Math.ceil(FN);
				break;
			case 8:
				result = Math.floor(FN);
				break;
			case 9:
				function fact(x) {
					if(x == 0) {
						return 1;
					}
					if(x < 0 ) {
						return undefined;
					}
					for(var i = x; --i; ) {
						x *= i;
					}
					return x;
				}
				result = fact(FN);
				break;
			case 10:
				result = Math.pow(FN, SN);
				break;
			case 11:
				result = Math.pow(FN, 1 / SN);
				break;
			case 12:
				result = Math.sin(FN);
				break;
			case 13:
				result = Math.cos(FN);
				break;
			case 14:
				result = Math.tan(FN);
				break;
			case 15:
				result = Math.asin(FN);
				break;
			case 16:
				result = Math.acos(FN);
				break;
			case 17:
				result = Math.atan(FN);
				break;
			case 18:
				result = (FN * SN) / 100;
				break;
			case 19:
				result = (FN * SN) / 100 + FN;
				break;
			case 20:
				const DN = 100 - SN;
				result = (FN * DN) / 100;
				break;
			case 21:
				result = Math.PI;
				break;
			case 22:
				result = Math.E;
				break;
			default:
				break;
		}

		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
