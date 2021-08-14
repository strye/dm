import EventEmitter from "./eventEmitter.js";

class ElementHlpr extends EventEmitter {

    constructor(options) {
		super(options)
		let self = this;
		
		self._data = null;
		self._elm = null;
		self._children = [];      


		switch (typeof(options)) {
			case "string":
					self._elm = document.createElement(options);
				break;
			case "object":
                if (options instanceof Element || options instanceof HTMLDocument) {
                    self._elm = options;
                } else {
                    self._elm = document.createElement(options.name);
                    if (options.attrs) {
                        for (const atr in options.attrs) {
                            self.attr(atr, options.attrs[atr]);
                        }
                    }
                    if (options.styles) {
                        for (const styl in options.styles) {
                            self.style([styl], options.styles[styl]);
                        }
                    }
                }
				break;
			default:
				// Error
				break;
		}

		// if (typeof(options) === "string") {
		// 	this._elm = document.createElement(options);
		// } else if (typeof(options) === "object") {

		// }

	}
	get elm() { return this._elm; }
	set elm(val) { this._elm = val; }
	
	clear() {
		this._elm.innerHTML = "";
		this._elm.innerText = "";
		return this;
	}

	attr(name, value) {
		this._elm.setAttribute(name, value);
		return this;
	}

	class(name, yesno) {
		this._elm.classList.toggle(name, yesno);
		return this;
	}

	style(name, value) {
		this._elm.style[name] = value;
		return this;
	}


	text(val) {
		this._elm.innerText = val;
		return this;
	}

	prop(name, value) {
		this._elm[name] = value;
		return this;
	}

	exec(method) {
		method(this);
		return this;
	}
	listen(eventName, action) {
		this._elm.addEventListener(eventName, action);
		return this;
	}

	append(elmName) {
		let elm = new ElementHlpr(elmName);
		this._children.push(elm);
		this._elm.appendChild(elm.elm)

		// Returns the new helper element
		return elm;
	}
	remove(target) {
		// if target is string getElementById
		if (typeof(options) === "string") {
			let elm2r = this._elm.getElementById(target);
			this._elm.removeChild(elm2r);
		}
		// if target is object
		if (typeof(options) === "object") {
			this._elm.removeChild(target);
		}

		return this;
	}
	byId(target) {
		let elm2r = this._elm.querySelector("#"+target);
		return new ElementHlpr(elm2r);
	}
	parent() {
		let elm2r = this._elm.parent;
		return new ElementHlpr(elm2r);
	}

	data(dataSet) { 
		var handler = {
			get: function(obj, prop) {
				return prop in obj ? obj[prop] : 37;
			}
		};
		this._data = new Proxy(dataSet, handler);

		return this;
	}


}

export default ElementHlpr;