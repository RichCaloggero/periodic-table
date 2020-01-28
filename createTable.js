// Public domain periodic table data from https://github.com/Bowserinator/Periodic-Table-JSON

function createTable (data) {
const table = document.createElement("table");
const head = createHead(document.createElement("thead"));
const body = createBody(document.createElement("tbody"));
table.appendChild(head);
table.appendChild(body);
return table;

function createBody (body) {
let rowCount=0, colCount=0;
let row = null, col = null, lastCol = null;

data.elements.forEach((element, index) => {
if (element.ypos > rowCount) {
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

col.innerHTML = `<div class="number">${element.number}</div>
<div class="name-and-symbol">
<span class="name">${element.name}</span> <span class="symbol">(${element.symbol})</span>
</div>
<div class="mass">${element.atomic_mass}</div>
`;

row.appendChild(col);
}); // forEach element

return body;
} // createBody

function createHead (head) {
return head;
} // createHead

} // createTable
