{ // module begin
class HtmlDialog extends HTMLElement {
static get is () {return "html-dialog";}

static get template () {
return `<div class="dialog" style="position:relative;" role="document">
<div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-message">
<header>
<h2 id="dialog-title"></h2>
<button class="close">Close</button>
</header>

<div class="body">
<p id="dialog-message"></p>
<slot></slot>
</div><!-- .body -->
</div><!-- dialog role -->
</div><!-- dialog wrapper -->
`;
} // get template

constructor () {
super ();
} // constructor

connectedCallback () {
const open = this.hasAttribute("open");
const root = this.attachShadow({mode: "open"});
const div = document.createElement("div");
div.hidden = true;
div.innerHTML = HtmlDialog.template;
div.querySelector("#dialog-title").textContent = this.getAttribute("title");
div.querySelector("#dialog-message").textContent = this.getAttribute("message");
root.appendChild(div);

div.querySelector(".close").addEventListener ("click", () => this._close());
div.addEventListener("keydown", e => {
if (e.key === "Escape" && !e.altKey && !e.ctrlKey && !e.shiftKey) this._close();
});

if (open) this.open();
} // connectedCallback

open (message) {
const container = this.shadowRoot.firstElementChild;
container.hidden = false;
if (message) container.querySelector("#dialog-message").textContent = message;
container.querySelector(".close").focus();
this.setAttribute("open", "");
} // open

_close () {
console.debug("_close: ", this);
this.shadowRoot.firstElementChild.hidden = true;
if (this.close instanceof Function) this.close();
if (this.hasAttribute("return-focus")) document.querySelector(this.getAttribute("return-focus")).focus();
this.removeAttribute("open");
} // _close

triggerMessage () {
const message = this.shadowRoot.querySelector("slot");
message.innerHTML = message.innerHTML;
alert(message.innerHTML);
} // triggerMessage
} // class HtmlDialog
customElements.define(HtmlDialog.is, HtmlDialog);
} // module end
