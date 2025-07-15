export const tagPageHTML = `
<h1>Latte: Tag</h1>

<fieldset>
<legend>Region List</legend>
<div class="frdata">
<p>Enter the regions you want to tag here, in the format: [REGION_LINK] hit by [NATION_LINK]</p>
<p>Example: https://www.nationstates.net/region=testregion hit by https://www.nationstates.net/nation=testnation</p>
<p>Only regions hit by your switchers will be counted.</p>
</div>
</br>
<textarea id="lt-input-regions" rows="10" cols="30"></textarea></br>
<button id="lt-btn-update" class="button icon approve primary">Add Regions</button>
</fieldset>

<fieldset>
<legend>Current Nation</legend>
<p id="lt-status-nation">None</p>
<p id="lt-status-count">Regions Tagged: 0/0</p>
</fieldset>

<fieldset>
<legend>Status</legend>
<div class="frdata">
<p>Press your "Tag/Detag Key" repeatedly or the button below to tag the selected regions.</p>
</div>
<p id="lt-status-tag">Status: Waiting to start</p>
<button id="lt-btn-tag" type="submit" class="button primary">Login to First Nation</button>
</fieldset>`;