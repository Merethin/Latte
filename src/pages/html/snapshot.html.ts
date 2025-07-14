export const snapshotPageHTML = `
<h1>Latte: Eyebeast Snapshot Page</h1>
<i>View the current snapshot imported from Eyebeast.</i>
<h4 id="lt-label-region"></h4>

<fieldset>
<legend>Saved Flag</legend>
<p style="display: none; color: orange;" id="lt-label-noflag">No flag at the time of snapshot.</p>
<img id="lt-image-flag" style="max-width:40%;"></img>
</fieldset>

<fieldset>
<legend>Saved Banner</legend>
<p style="display: none; color: orange;" id="lt-label-default-banner">This is a default banner.</p>
<img id="lt-image-banner" style="max-width:60%;"></img>
</fieldset>

<fieldset>
<legend>Saved WFE</legend>
<pre id="lt-content-wfe"></pre>
</fieldset>

<fieldset>
<legend>Saved Tags</legend>
<p id="lt-content-tags"></p>
</fieldset>

<fieldset>
<legend>Saved Regional Officers</legend>
<table class="shiny wide mcollapse"><tbody id="lt-content-ros">
<tr><th>Nation</th><th>Office Name</th><th>Authority</th></tr>
</tbody></table>
</fieldset>`