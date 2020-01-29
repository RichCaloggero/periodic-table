// Public domain periodic table data from https://github.com/Bowserinator/Periodic-Table-JSON

function createTable (data) {
const elements = data.elements;
const table = document.createElement("table");
const head = createHead(document.createElement("thead"));
const body = createBody(document.createElement("tbody"));
table.appendChild(head);
table.appendChild(body);

table.addEventListener("click", e => {
const cell = e.target.closest("td");
const link = cell.querySelector("a");
const atomicNumber = Number(cell.id);
const element = elements.find(element => element.number === atomicNumber);
const elementInfo = createModal(getElementInfo(element), link);
document.body.appendChild(elementInfo);

elementInfo.querySelector(".close").focus();
});
return table;

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
col.setAttribute("colspan", String(element.xpos - colCount));
colCount = element.xpos;
row.appendChild(col);
col = document.createElement("td");
} // if

col.innerHTML = `<a href="#">
<div class="number">${element.number}</div>
<div class="name-and-symbol">
<span class="name">${element.name}</span> <span class="symbol">(${element.symbol})</span>
</div>
<div class="mass">${element.atomic_mass}</div>
</a>`;

col.id = String(element.number);
row.appendChild(col);
}); // forEach element

return body;
} // createBody

function createHead (head) {
return head;
} // createHead

function createModal (body, focusOnClose) {
const modal = document.createElement("div");
modal.id = "element-info";
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

modal.querySelector(".body").appendChild(body);
modal.querySelector(".close").addEventListener("click", () => {
focusOnClose.focus();
document.body.removeChild(modal);
}); // close

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

} // createTable


