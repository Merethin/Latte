export const settingsPageHTML = `
<h1>Latte: Settings</h1>

<h2><i class="icon-cog-alt"></i> General Settings</h2>
<div class="divindent">
<fieldset>
<legend>User Agent (Main Nation)</legend>
<div class="frdata">
<p>Needed to identify yourself to NationStates when making requests.</p>
</div></br>
<input type="text" id="lt-input-useragent" placeholder="Enter Main Nation..."></input>
<button id="lt-btn-useragent" class="button icon approve primary">Set User Agent</button>
<p id="lt-label-useragent">Current User Agent: none</p>
</fieldset>
<fieldset>
<legend>Status Bubble</legend>
<div class="frdata">
<p>Fixed-position box to see what commands are currently being executed.</p>
</div></br>
<label>
<input type="checkbox" id="lt-input-statusbubble"></input>
Show Status Bubble when idle (no commands)
</label>
</br></br>
<button id="lt-btn-statusbubble" type="submit" class="button icon approve primary">
Update Status Bubble Settings
</button>
</fieldset>
<fieldset>
<legend>RO Name</legend>
<div class="frdata"><p>When appointing yourself as an officer, the office name to use.</p></div></br>
<input type="text" id="lt-input-roname" placeholder="Enter RO name..."></input>
<button id="lt-btn-roname" class="button icon approve primary">Set RO Name</button>
<p id="lt-label-roname">Current RO Name: none</p>
</fieldset>
<fieldset id="lt-content-keybinds">
<legend>Keybinds</legend>
<div class="frdata"><p>Reload the page for the keybind changes to take effect.</p></div>
</fieldset>
</div>

<h2><i class="icon-cog-alt"></i> Prepping Settings</h2>
<div class="divindent">
<fieldset>
<legend>Jump Point</legend>
<div class="frdata"><p>The region to move switchers to when prepping.</p></div></br>
<input type="text" name="lt-input-jumppoint" placeholder="Enter Jump Point..."></input>
<button id="lt-btn-jumppoint" class="button icon approve primary">Set Jump Point</button>
<p id="lt-label-jumppoint">Current Jump Point: none</p>
</fieldset>
<fieldset id="lt-content-password">
<legend>Switcher Password</legend>
<div class="frdata"><p>You should have the same password set for all switchers.</p></div></br>
<input type="password" id="lt-input-password" placeholder="Enter Password..."></input>
<button id="lt-btn-password" class="button icon approve primary">Set Password</button>
</fieldset>
<fieldset>
<legend>Switcher List</legend>
<div class="frdata"><p>A list of all your switcher puppets.</p></div></br>
<textarea name="lt-input-switchers" rows="15" cols="40"></textarea></br>
<button id="lt-btn-switchers" class="button icon approve primary">Update Switcher List</button>
<button id="lt-toggle-switchers" class="button">Show Switcher List</button>
<div id="lt-content-switchers" style="display: none;">
</div>
</fieldset>
</div>

<h2><i class="icon-cog-alt"></i> Tagging Settings</h2>
<div class="divindent">
<fieldset>
<legend>World Factbook Entry</legend>
<div class="frdata"><p>The WFE to tag regions with.</p></div></br>
<textarea id="lt-input-wfe" rows="15" cols="40"></textarea></br>
<button id="lt-btn-wfe" class="button icon approve primary">Set World Factbook Entry</button>
<button id="lt-toggle-wfe" class="button">Show World Factbook Entry</button>
<pre id="lt-content-wfe" style="display: none;">
</pre>
</fieldset>
<fieldset>
<legend>Embassy List</legend>
<div class="frdata"><p>The regions to request embassies with. One region per line.</p></div></br>
<textarea id="lt-input-embassy" rows="10" cols="30"></textarea></br>
<button id="lt-btn-embassy" class="button icon approve primary">Set Embassies</button>
<p id="lt-label-embassy">Current Embassies: none</p>
</fieldset>
<fieldset>
<legend>Tags to Add</legend>
<div class="frdata"><p>The tags to add if not present. One tag per line.</p></div></br>
<textarea id="lt-input-tagadd" rows="10" cols="30"></textarea></br>
<button id="lt-btn-tagadd" class="button icon approve primary">Update Tags</button>
<p id="lt-label-tagadd">Current Tags to Add: none</p>
</fieldset>
<fieldset>
<legend>Tags to Remove</legend>
<div class="frdata"><p>The tags to remove if present. One tag per line.</p></div></br>
<textarea id="lt-input-tagremove" rows="10" cols="30"></textarea></br>
<button id="lt-btn-tagremove" class="button icon approve primary">Update Tags</button>
<p id="lt-label-tagremove">Current Tags to Remove: none</p>
</fieldset>
<fieldset>
<legend>Banner Image</legend>
<div class="frdata"><p>The image to set as the region's banner.</p></div></br>
<input type="file" id="lt-input-banner"></input></br>
<img id="lt-content-banner" style="max-width:60%;"></img>
</fieldset>
<fieldset>
<legend>Flag Image</legend>
<div class="frdata"><p>The image to set as the region's flag.</p></div></br>
<input type="file" id="lt-input-flag"></input></br>
<img id="lt-content-flag" style="max-width:40%;"></img>
</fieldset>
</div>`