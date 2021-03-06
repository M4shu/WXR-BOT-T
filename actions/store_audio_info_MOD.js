module.exports = {
	name: "Store Audio Info",  
	section: "Audio Control",  

	fields: ["server", "info", "storage", "varName", "varName2"],  

	html: function(isEvent, data) {
		return `
        <style>
        table.scroll {
            width: 525px; /* 140px * 5 column + 16px scrollbar width */
            border-spacing: 0;
            border: 2px solid white;
        }

        table.scroll tbody,
        table.scroll thead tr { display: block; }

        table.scroll tbody {
            height: 100px;
            overflow-y: auto;
            overflow-x: hidden;
        }

        table.scroll tbody td,
        table.scroll thead th {
            width: 176px;
        }

        table.scroll thead th:last-child {
            width: 180px; /* 140px + 16px scrollbar width */
        }

        thead tr th {
            height: 30px;
            line-height: 30px;
            /*text-align: left;*/
        }

        tbody { border-top: 2px solid white; }

        </style>
        <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">

    <div>
        <div style="float: left; width: 35%;">
            Source Server:<br>
            <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer2')">
                ${data.servers[isEvent ? 1 : 0]}
            </select>
        </div>
        <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName2" class="round" type="text" list="variableList"><br>
        </div>
    </div><br><br><br>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
        <select id="info" class="round">
          /* Options are added in the init function */
		</select>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
	<style>
	/* START OF EMBED CSS */
div.embed { /* <div class="embed"></div> */
    position: relative;
}
    embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
        background-color: #eee;
        width: 4px;
        border-radius: 3px 0 0 3px;
        border: 0;
        height: 100%;
        margin-left: 4px;
        position: absolute;
    }
    div.embedinfo { /* <div class="embedinfo"></div> */
        background: rgba(46,48,54,.45) fixed;
        border: 1px solid hsla(0,0%,80%,.3);
        padding: 10px;
        margin:0 4px 0 7px;
        border-radius: 0 3px 3px 0;
    }
        span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
            color: rgb(255, 255, 255);
        }
        span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
            color: rgb(128, 128, 128);
        }
        span { /* Only making the text look, nice! */
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }
        span.wrexlink {
            color: #99b3ff;
            text-decoration:underline;
            cursor:pointer;
        }
        span.wrexlink:hover {
            color:#4676b9;
        }
	</style>`;
	},  

	// this is the list of items used in the subtitle, init, types, and the html
	itemList:  [
		{ name: "Volume (1-100)", type: "Number" },  
		{ name: "Is Playing", type: "Boolean" },  
		{ name: "Start Time (Seconds)", type: "Seconds" },  
		{ name: "Queue URL List", type: "List" },  
		{ name: "Next Song URL In Queue", type: "Url" },  
		{ name: "Queue Length", type: "Number" },  
		{ name: "Bitrate", type: "Number" },  
		{ name: "Passes", type: "Number" },  
		{ name: "Current Seek Position (Seconds)", type: "Seconds" },  
		{ name: "Current Song URL", type: "Url" },  
		{ name: "Requester of Next Song URL", type: "User" },  
		{ name: "Requester of Current Song URL", type: "User" },  
		{ name: "Title of Next Song URL", type: "Title String" },  
		{ name: "Title of Current Song URL", type: "Title String" },  
		{ name: "Duration of Current Song URL", type: "Duration" },  
		{ name: "Current Song Thumbnail URL", type: "Url" }
	],  

	// itemlist is set from above
	subtitle: function(data) {
		this.itemList = require("./store_audio_info_MOD.js").itemList;
		const servers = ["Current Server", "Temp Variable", "Server Variable", "Global Variable"];
		return `${servers[parseInt(data.server)]} - ${this.itemList[parseInt(data.info)].name}`;
	},  

	// itemlist is set from above
	variableStorage: function(data, varType) {
		this.itemList = require("./store_audio_info_MOD.js").itemList;
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const dataType = this.itemList[parseInt(data.info)].type || "Unknown Type";
		return ([data.varName, dataType]);
	},  

	// itemlist is set from above
	init: function() {
		try {
			const { glob, document } = this;

			//
			const wrexlinks = document.getElementsByClassName("wrexlink");
			for(let x = 0; x < wrexlinks.length; x++) {
				const wrexlink = wrexlinks[x], url = wrexlink.getAttribute("data-url");
				if(url){
					wrexlink.setAttribute("title", url);
					wrexlink.addEventListener("click", function(e){
						e.stopImmediatePropagation();
						console.log("Launching URL: [" + url + "] in your default browser.");
						require("child_process").execSync("start " + url);
					});
				}
			}

			this.itemList = require("./store_audio_info_MOD.js").itemList;
			const select = document.getElementById("info");
			if(select.length == 0){
				for(let i = 0; i < this.itemList.length; i++){
					const item = this.itemList[i];

					let option = document.createElement( "option" );
					if(i==0) option.className = "selected";
					option.value = i;
					option.text = item.name;

					select.add( option );
				}
			}

			glob.variableChange(document.getElementById("storage"), "varNameContainer");
			glob.serverChange(document.getElementById("server"), "varNameContainer2");
		} catch (error) {
			alert("Store Audio Info Init Error:\n\n" + error);
		}
	},  


	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = parseInt(data.server);
		const varName2 = this.evalMessage(data.varName2, cache);
		const TimeFormat = this.getWrexMods().require("hh-mm-ss");
		const info = parseInt(data.info);

		const audio = this.getDBM().Audio;

		const targetServer = this.getServer(server, varName2, cache);
		if(!targetServer) {
			this.callNextAction(cache);
			return;
		}

		if(!audio) {
			this.callNextAction(cache);
			return;
		}

		let result;
		switch(info) {
			case 0:
				result = audio.volumes[targetServer.id] && parseInt(audio.volumes[targetServer.id]) * 100 || 50; // volume
				break;
			case 1:
				result = audio.dispatchers[targetServer.id] && audio.dispatchers[targetServer.id] ? true : false; // is playing
				break;
			case 2:
				result = audio.dispatchers[targetServer.id] && audio.dispatchers[targetServer.id].player.streamingData.startTime || 0; // when the music first started playing
				break;
			case 3:
				result = audio.queue[targetServer.id] && audio.queue[targetServer.id].map(el => el[2]); // the queue list
				break;
			case 4:
				result = audio.queue[targetServer.id] && audio.queue[targetServer.id].map(el => el[2])[0]; // next item in queue
				break;
			case 5:
				result = audio.queue[targetServer.id] && audio.queue[targetServer.id].length;  // queue length
				break;
			case 6:
				result = audio.dispatchers[targetServer.id] && audio.dispatchers[targetServer.id].player.opusEncoder.bitrate || 0; // bitrate
				break;
			case 7:
				result = audio.dispatchers[targetServer.id] && audio.dispatchers[targetServer.id].streamOptions.passes || 0; // the encoder passes
				break;
			case 8:
				result = audio.dispatchers[targetServer.id] && audio.dispatchers[targetServer.id].streamingData.timestamp || 0; // seek position
				break;
			case 9:
				result = audio.playingnow[targetServer.id][2]; //Current song url
				break;
			case 10:
				result = audio.queue[targetServer.id] && audio.queue[targetServer.id].map(el => el[1])[0].requester; //Requested person of next song in queue
				break;
			case 11:
				result = audio.playingnow[targetServer.id] && audio.playingnow[targetServer.id][1].requester; // Requested person of current song
				break;
			case 12:
				result = audio.queue[targetServer.id] && audio.queue[targetServer.id].map(el => el[1])[0].title; // Title of next song in queue
				break;
			case 13:
				result = audio.playingnow[targetServer.id] && audio.playingnow[targetServer.id][1].title; // Title of current song
				break;
			case 14:
				result = TimeFormat.fromS(audio.playingnow[targetServer.id] && audio.playingnow[targetServer.id][1].duration); //Current song duration
				break;
			case 15:
				result = audio.playingnow[targetServer.id] && audio.playingnow[targetServer.id][1].thumbnail; // Current Song Thumbnail URL
				break;
			default:
				break;
		}
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
