export const prepPageHTML = `
<h1>Latte: Prep</h1>

<fieldset>
<legend>Switcher List</legend>
<div class="frdata">
<p>Log in to the switcher puppet you want to start at by clicking a link here.</p>
</div>
</br>
<button id="lt-toggle-switchers" class="button">Show Switcher List</button>
<div id="lt-content-switchers" style="display: none;">
</div>
</fieldset>

<fieldset>
<legend>Current Nation</legend>
<p id="lt-status-nation">None</p>
<p id="lt-status-count">Switchers Prepped: 0/0</p>
</fieldset>

<fieldset>
<legend>Status</legend>
<div class="frdata">
<p>Press your "Prep Key" repeatedly or the button below to prepare your switchers.</p>
</div>
<p id="lt-status-prep">Status: Waiting to start</p>
<button id="lt-btn-prep" type="submit" class="button primary">Load Nation & Start</button>
</fieldset>`;