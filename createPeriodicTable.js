// Public domain periodic table data from https://github.com/Bowserinator/Periodic-Table-JSON

function displayTable (dataURL, arrowKeyNavigation, statusMessage, container) {
if (!container) {
container = document.createElement("div");
document.body.append(container);
} // if

let table;
fetch (dataURL)
.then(response => {
if (response.ok) return response.json();
else throw new Error(response.error);
}).then (data => {
if (container.children[0]) {
container.children[0].remove();
} // if

table = createPeriodicTable(data, arrowKeyNavigation);
container.appendChild(table);
table.id = "periodicTable";
statusMessage("Ready.");
}).catch(error => alert(`${error.message}\n${error.stack}\n`));

function createPeriodicTable (data, arrowNavigation = false) {
const elements = data.elements;
const table = document.createElement("table");
const head = createHead(document.createElement("thead"));
const body = createBody(document.createElement("tbody"));
const periodicTable = document.createElement("div");
let keyboardHelpModal;

periodicTable.classList.add("periodicTable");
table.appendChild(head);
table.appendChild(body);
periodicTable.appendChild(table);

if (arrowNavigation) {
periodicTable.setAttribute("role", "application");
table.addEventListener("keydown", _arrowNavigation);
table.addEventListener("focusin", trackFocus);
setTimeout (() => table.querySelector("td a").focus(), 0);
} // if

table.addEventListener("click", e => displayElementInfo (e.target.closest("td"), elements));
return periodicTable;

function displayElementInfo (cell, elements) {
const link = cell.querySelector("a");
const atomicNumber = Number(cell.dataset.number);
const element = elements.find(element => element.number === atomicNumber);
const modal = createModal("Element Info", getElementInfo(element), periodicTable, "elementInfo",
() => {modal.hidden = true; link.focus();},
".summary");
return periodicTable;
} // displayElementInfo


function createBody (body) {
let rowCount=0, colCount=0;
let row = null, col = null, lastCol = null;

elements.forEach((element, index) => {
if (element.period > rowCount) {
colCount = 0;
col = null;
lastCell = null;
if (row) body.appendChild(row);
rowCount += 1;
row = document.createElement("tr");
} // if

if (element.xpos > colCount) {
colCount += 1;
col = document.createElement("td");
} // if


if (element.xpos > colCount) {
// we need to skip columns
if (arrowNavigation) {
col.innerHTML = `<a tabindex="-1" href="#"></a>`;
} // if
col.setAttribute("colspan", String(element.xpos - colCount));
col.classList.add("empty");
colCount = element.xpos;
row.appendChild(col);
col = document.createElement("td");
} // if

col.innerHTML =
`<a href="#">
<div class="number">${element.number}</div>
<div class="name-and-symbol">
<span class="name">${element.name}</span> <span class="symbol">(${element.symbol})</span>
</div>
<div class="mass">${element.atomic_mass}</div>
</a>`;

if (arrowNavigation) {
col.querySelector("a").tabIndex = -1;
} // if

col.dataset.number = element.number;
col.dataset.group = element.xpos;
col.dataset.period = element.period;
col.className = element.category;
row.appendChild(col);
}); // forEach element

return body;
} // createBody

function createHead (head) {
return head;
} // createHead

function createModal (title, body, container, _id, _close, _messageSelector) {
console.debug("createModal: ", title, body, container, _id, _close);
let modal = document.querySelector(`#${_id}`);
if (modal) {
console.debug("-- reusing ", modal);
modal.querySelector(".body").innerHTML = "";
} else {
modal = document.createElement("div");
if (_id) modal.id = _id;
modal.style.position = "relative";
modal.setAttribute("role", "document");
modal.innerHTML = `
<div role="dialog" aria-labelledby="${modal.id}-title" style="position:absolute; left:0; top:0; z-index:100;">
<header>
<h2 id="${modal.id}-title">${title}</h2>
<button class="close">Close</button>
</header>
<div class="body">
</div>
</div>
`;
//console.debug("modal: created modal:", modal.hidden);
if (container) container.appendChild(modal);
modal.querySelector(".close").addEventListener("keydown", e => {if (e.key === "Escape") e.target.click();});
} // if

const _body = modal.querySelector(".body");
const closeButton = modal.querySelector(".close");

if (body) {
_body.innerHTML = "";
_body.appendChild(body);
if (_messageSelector) {
_body.querySelector(_messageSelector).id = `${modal.id}-message`;
modal.firstElementChild.setAttribute("aria-describedby", `${modal.id}-message`);
} // if

modal.hidden = false;
} // if

if (_close instanceof Function) {
if (modal._close) modal.removeEventListener("click", modal._close);
modal._close = _close;
closeButton.addEventListener("click", _close);
} // if

closeButton.focus();
return modal;
} // createModal

function getElementInfo (data) {
const body = `
category,
appearance,
            atomic_mass,
boil,
melt,
density,
            molar_heat,
discovered_by,
named_by,
source,
spectral_img,
shells,
electron_configuration,
electron_affinity,
electronegativity_pauling,
ionization_energies
`.split(",").map(key => key.trim())
.map(key => {
let value = data[key];

if (value) {
if (key === "source" || key === "spectral_img") {
value = `<a href="${value}">${value}</a>`;
} // if

if (key === "shells" || key === "electron_energies") {
value = value.join(", ");
} // if

} else {
value = ""; // remove null
} // if

if (key === "boil" || key === "melt") key += "ing point";
key = key.replace("_", " ");
return `<tr class="property">
<th class="name">${key}</th><td class="value">${value}</td>
</tr>`;
}).join("\n");

const info = document.createElement("div");
info.innerHTML = `
<div class="summary">
<h2>Summary</h2>
<p>${data.summary}</p>
</div>

<div class="properties">
<h3>Properties</h3>
<table>
<tr><th>Property</th><th>value</th></tr>
${body}
</table>
</div>
`; // html

return info;
            } // getElementInfo

function _arrowNavigation (e) {
if (e.altKey || e.shiftKey || e.ctrlKey) return true;
const key = e.key;
const cell = e.target.closest("td");
const row = cell.parentElement;
const rows = row.parentElement;
const index = Array.from(row.children).indexOf(cell);
const rowIndex = Array.from(rows.children).indexOf(row);
console.debug("key: ", key, cell);

switch (key) {
case "h": case "F1": showKeyboardHelp(cell); break;

case "Home": moveRowStart(); break;
case "End": moveRowEnd(); break;

case "PageUp": moveGroupStart(); break;
case "PageDown": moveGroupEnd(); break;

case "ArrowLeft":  moveLeft(); break;
case "ArrowRight":  moveRight(); break;
case "ArrowUp":  moveUp(); break;
case "ArrowDown":  moveDown(); break;
default: return true;
} // switch
return false;

// navigation

function showKeyboardHelp (cell) {
keyboardHelpModal = createModal ("Keyboard Help", getKeyboardCommands(), periodicTable, "keyboardHelp",
() => {keyboardHelpModal.hidden = true; cell.firstElementChild.focus();}
);
} // showKeyboardHelp


function moveRowStart () {row.children[0].firstElementChild.focus();}
function moveRowEnd () {row.children[row.children.length-1].firstElementChild.focus();}

function moveGroupStart () {
for (let row of Array.from(rows.children)) {
const newCell = findCellWithGroup(row, Number(cell.dataset.group));
if (newCell) {
newCell.firstElementChild.focus();
return;
} // if
} // for
} // moveGroupStart

function moveGroupEnd () {
const row = rows.children[rows.children.length-1];
const newCell = findCellWithGroup(row, Number(cell.dataset.group));
(newCell? newCell : row[0]).firstElementChild.focus();
} // moveGroupEnd

function moveLeft () {
if (index > 0) row.children[index-1].firstElementChild.focus();
} // moveLeft

function moveRight () {
if (index < row.children.length-1) row.children[index+1].firstElementChild.focus();
} // moveRight

function moveUp () {
if (rowIndex > 0) {
const row = rows.children[rowIndex-1];
const newCell = findCellWithGroup(row, Number(cell.dataset.group));
(newCell? newCell : row.children[0]).firstElementChild.focus();
} // if
} // moveUp

function moveDown () {
if (rowIndex < rows.children.length-1) {
const row = rows.children[rowIndex+1];
const newCell = findCellWithGroup(row, Number(cell.dataset.group));
(newCell? newCell : row.children[0]).firstElementChild.focus();
} // if
} // moveDown

function findCellWithGroup (row, group) {return Array.from(row.children).find(c => Number(c.dataset.group) === group);}
} // _arrowNavigation



function trackFocus (e) {
const link = e.target;
table.querySelectorAll("td a").forEach(link => link.tabIndex = -1);
link.tabIndex = 0;
} // trackFocus

function getKeyboardCommands () {
const table = document.createElement("table");
table.innerHTML = `
<tr><th>Key</th><th>Action</th></tr>
<tr><th>right arrow</th><td>right 1 cell</td></tr>
<tr><th>left arrow</th><td>left 1 cell</td></tr>
<tr><th>up arrow</th><td>up 1 cell (beginning of row if no cell above)</td></tr>
<tr><th>down arrow</th><td>down 1 cell</td></tr>
<tr><th>home</th><td>first cell in row</td></tr>
<tr><th>end</th><td>last cell in row</td></tr>
<tr><th>page up</th><td>first cell in column</td></tr>
<tr><th>page down</th><td>last cell in column</td></tr>
<tr><th>enter</th><td>display information about currently focused element</td></tr>
<tr><th>F1 or "h"</th><td>display this help dialog</td></tr>
<tr><th>escape</th><td>close dialog window</td></tr>
`;

return table;
} // getKeyboardCommands


} // createTable

} // displayTable

