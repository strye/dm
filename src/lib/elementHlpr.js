import EventEmitter from "./eventEmitter.js";

class ElementHlpr extends EventEmitter {
	static Target(selector) {
		let trg = document.querySelector(selector);
		let el = new ElementHlpr();
		el.elm = trg

		return el;
	}

    constructor(options) {
		super(options)
		let self = this;
		
		// TODO: self._data = null;
		self._elm = null;
		self._children = [];      


		switch (typeof(options)) {
			case "string":
					self._elm = document.createElement(options);
				break;
			case "object":
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
				break;
			default:
				// Error
				break;
		}

		if (typeof(options) === "string") {
			this._elm = document.createElement(options);
		} else if (typeof(options) === "object") {

		}

	}
	get elm() { return this._elm; }
	set elm(val) { this._elm = val; }
	
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

	// TODO: data(dataSet) { }


}

export default ElementHlpr;