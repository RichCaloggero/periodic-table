// Public domain periodic table data from https://github.com/Bowserinator/Periodic-Table-JSON

function createPeriodicTable (data, arrowNavigation = false) {
const elements = data.elements;
const table = document.createElement("table");
const head = createHead(document.createElement("thead"));
const body = createBody(document.createElement("tbody"));
const periodicTable = document.createElement("div");

table.appendChild(head);
table.appendChild(body);
periodicTable.appendChild(table);

if (arrowNavigation) {
table.setAttribute("role", "grid");
table.addEventListener("keydown", _arrowNavigation);
table.addEventListener("focusin", trackFocus);
setTimeout (() => table.querySelector("td").focus(), 0);
} // if

table.addEventListener("click", e => {
const cell = e.target.closest("td");
const link = cell.querySelector("a");
const atomicNumber = Number(cell.id);
const element = elements.find(element => element.number === atomicNumber);
modal = createModal(getElementInfo(element), arrowNavigation? cell : link);
console.log("modal: ", modal);

periodicTable.appendChild(modal);

modal.querySelector(".close").focus();
});
return periodicTable;

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
if (arrowNavigation) col.tabIndex = -1;
col.setAttribute("colspan", String(element.xpos - colCount));
col.classList.add("empty");
colCount = element.xpos;
row.appendChild(col);
col = document.createElement("td");
} // if

let html = `<div class="number">${element.number}</div>
<div class="name-and-symbol">
<span class="name">${element.name}</span> <span class="symbol">(${element.symbol})</span>
</div>
<div class="mass">${element.atomic_mass}</div>
`;

if (arrowNavigation) {
col.tabIndex = -1;
col.innerHTML = html;
} else {
col.innerHTML = `<a href="#">${html}</a>`;
} // if

col.id = String(element.number);
col.setAttribute("data-group", String(element.xpos));
col.setAttribute("data-period", String(element.period));
row.appendChild(col);
}); // forEach element

return body;
} // createBody

function createHead (head) {
return head;
} // createHead

function createModal (body, focusOnClose) {
let modal = document.querySelector("#elementInfo");
if (modal) {
modal.querySelector(".body").innerHTML = "";
modal.querySelector(".body").removeEventListener("click", handleClose);
} else {
modal = document.createElement("div");
modal.id = "elementInfo";
modal.style.position = "relative";
modal.innerHTML = `
<div role="dialog" aria-labelledby="element-info-title" style="position:absolute; left:0; top:0; z-index:100;">
<header>
<h2 id="element-info-title">Element Information</h2>
<button class="close">Close</button>
</header>
<div class="body">
</div>
</div>
`;
} // if

modal.querySelector(".body").appendChild(body);
modal.querySelector(".close").addEventListener("click", handleClose);
return modal;

function handleClose (e) {
focusOnClose.focus();
modal.remove();
} // handleClose
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
source
`.split(",").map(key => key.trim())
.map(key => {
const value = data[key];
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
<h2>Properties</h2>
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
const cell = e.target;
const row = cell.parentElement;
const rows = row.parentElement;
const index = Array.from(row.children).indexOf(cell);
const rowIndex = Array.from(rows.children).indexOf(row);


switch (key) {
case "Enter": cell.dispatchEvent(new CustomEvent("click", {bubbles: true})); break;
case "ArrowLeft":  moveLeft(); break;
case "ArrowRight":  moveRight(); break;
case "ArrowUp":  moveUp(); break;
case "ArrowDown":  moveDown(); break;
default: return true;
} // switch
return false;

// navigation

function moveLeft () {
if (index > 0) row.children[index-1].focus();
} // moveLeft

function moveRight () {
if (index < row.children.length-1) row.children[index+1].focus();
} // moveRight

function moveUp () {
if (rowIndex > 0) {
const row = rows.children[rowIndex-1];
const newCell = Array.from(row.children).find(c => Number(c.getAttribute("data-group")) === Number(cell.getAttribute("data-group")));
newCell? newCell.focus() : row.children[0].focus();
} // if
} // moveUp

function moveDown () {
if (rowIndex < rows.children.length-1) {
const row = rows.children[rowIndex+1];
const newCell = Array.from(row.children).find(c => Number(c.getAttribute("data-group")) === Number(cell.getAttribute("data-group")));
newCell? newCell.focus() : row.children[0].focus();
} // if
} // moveDown
} // _arrowNavigation

function trackFocus (e) {
const cell = e.target;
table.querySelectorAll("td").forEach(c => c.tabIndex = -1);
cell.tabIndex = 0;
} // trackFocus

} // createTable


