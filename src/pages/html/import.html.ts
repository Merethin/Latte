export const importPageHTML = `
<h1>Latte: Import WA Applications</h1>
<p>If you have a Latte plugin installed with applications loaded, they should show up here for you to import.</p>
<div class="divindent" id="import-body">
<h4 id="lt-label-count">0 Applications to Load</h4>
<div class="widebox">
<table class="shiny wide embassies mcollapse">
<tbody id="lt-content-quiver">
<tr><th class="bigleft">Nation</th><th>Application ID</th><th>From Plugin</th><th>Import</th></tr>
</tbody>
</table>
</div>
</br>
<button id="lt-btn-import" type="submit" class="button icon approve primary" disabled>
    Load into Quiver
</button>
<button id="lt-btn-clear" type="submit" class="button icon remove danger" disabled>
    Clear Plugin Applications
</button>
</div>
`;