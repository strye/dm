
class WiredHTMLElement extends HTMLElement {
	constructor() {
		super();
		this._events = {};
	}
	emit(eventName, data) {
		const event = this._events[eventName];
		if( event ) {
			event.forEach(fn => {
				fn.call(null, data);
			});
		}
	}
	
	subscribe(eventName, fn) {
		if(!this._events[eventName]) {
			this._events[eventName] = [];
		}
	  
		this._events[eventName].push(fn);
		return () => {
			this._events[eventName] = this._events[eventName].filter(eventFn => fn !== eventFn);
		}
	}

	raiseEvent(eventName, data = {}) {
		let event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: data
		});
		return this.dispatchEvent(event);
	}



	render() {}

	connectedCallback() {
		this.render()
	}

	setAtProp(attrName, val) {
		if (val) { this.setAttribute(attrName, val); }
		else { this.removeAttribute(attrName); }
		this.render()
	}

}  // END WiredHTMLElement

export default WiredHTMLElement;