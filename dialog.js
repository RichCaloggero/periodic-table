{ // module begin
let $ = document.querySelector;

class HtmlDialog extends HTMLElement {
static get is () {return "html-dialog";}
static get observedAttributes () {
return ["title", "message", "return-to"]
} // get observedAttributes


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

this._observer = new MutationObserver(() => {
    });
} // constructor
  
connectedCallback () {
const open = this.hasAttribute("open");
const root = this.attachShadow({mode: "open"});
this.$ = root.querySelector.bind(root);

const div = document.createElement("div");

this._observer.observe(this, {
childList: true,
characterData: true,
subtree: true
});

div.hidden = true;
div.innerHTML = HtmlDialog.template;
root.appendChild(div);

this.$("#dialog-title").textContent = this.getAttribute("title");
this.$("#dialog-message").textContent = this.getAttribute("message");

this.$(".close").addEventListener ("click", () => this._close());
div.addEventListener("keydown", e => {
if (e.key === "Escape" && !e.altKey && !e.ctrlKey && !e.shiftKey) this._close();
});

if (open) this.open();
} // connectedCallback

  disconnectedCallback() {
    this._observer.disconnect();
  } // disconnectedCallback

set title (value) {this.setAttribute("title", value);}
set message (value) {this.setAttribute("message", value);}

  attributeChangedCallback(name, oldValue, newValue) {
console.debug(`changed: ${name} to ${newValue}`);
const value = newValue;
const selector = `#dialog-${name}`;
const propertyName = `#_${name}`;

this[propertyName] = value;
if (this.shadowRoot && this.$(selector)) {
this.$(selector).textContent = value;
} // if
} // attributeChangedCallback

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

} // class HtmlDialog
customElements.define(HtmlDialog.is, HtmlDialog);

function _$ (container) {
return (() => container.querySelector);
} // _$

} // module end
