class EventEmitter {
	constructor() {
		this.events = {};
	}
	
	emit(eventName, data) {
		const event = this.events[eventName];
		if( event ) {
			event.forEach(fn => {
				fn.call(null, data);
			});
		}
	}
	
	subscribe(eventName, fn) {
		if(!this.events[eventName]) {
			this.events[eventName] = [];
		}
	  
		this.events[eventName].push(fn);
		return () => {
			this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
		}
	}
}

class ElementHlpr extends EventEmitter {

    constructor(options) {
		super(options);
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
		this._elm.appendChild(elm.elm);

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

class Collection extends EventEmitter {
    constructor() {
		super();
		this._myCollection = {};
    }
	get size() { return Object.keys(this._myCollection).length; }

	hasKey(key) {
        return ("undefined" !== typeof(this._myCollection[key]))
    }

	put(key, value) { 
		this._myCollection[key] = value;
		this.emit('update', { type:'add', rowId: key });
	}

	get(key) { return this._myCollection[key]; }

	clone(key) { 
		let row = this._myCollection[key],
		clone = {};
		for(var fld in row){
			clone[fld] = row[fld];
		}
		return clone;
	}

	remove(key) { 
		delete this._myCollection[key]; 
		this.emit('update', { type:'remove', rowId: key });
	}

	upsert(key, value) {
		for(var prop in value){
			this._myCollection[key][prop] = value[prop];
		}
	}

	clear() { 
		this._myCollection = {};
		this.emit('update', { type:'clear' });
	}

	forEach(callback){
		let collection = this._myCollection;
		let idx = 0;
		for(var prop in collection){
			callback(collection[prop], idx);
			idx++;
		}
	}
	iterator(callback, sort, filter) {
		let res = [];
		if (filter) res = this.filteredArray(filter.field, filter.criteria, sort);
		else res = this.toArray(sort);

		res.forEach((item, idx) => {
			callback(item, idx);
		});
	}

	toArray(sortField) {
		var collection = this._myCollection;
		var res = [];
		for(var prop in collection){
			res.push(collection[prop]);
		}
		if (sortField) {
			return res.sort(function(a,b) {
				if (a[sortField] < b[sortField]) return -1;
				if (a[sortField] > b[sortField]) return 1;
				return 0;
			});
		} else {
			return res;
		}
	}

	filteredArray(criteria, value, sortField) {
		var collection = this._myCollection;
		var res = [];
		for(var prop in collection){
			if (collection[prop][criteria] === value) {
				res.push(collection[prop]);
			}
		}
		if (sortField) {
			return res.sort(function(a,b) {
				if (a[sortField] < b[sortField]) return -1;
				if (a[sortField] > b[sortField]) return 1;
				return 0;
			});
		} else {
			return res;
		}
	}


}

class QueryCollection extends Collection {
    // constructor() {
	// 	super()
    // }

	queryArray(filter, sortField) {
		let collection = this._myCollection,
		res = [];
		for (const key in collection) {
			if (this._passFilter(collection[key], filter)) {
				res.push(collection[key]);
			}
		}
		if (sortField) {
			return res.sort(function(a,b) {
				if (a[sortField] < b[sortField]) return -1;
				if (a[sortField] > b[sortField]) return 1;
				return 0;
			});
		} else {
			return res;
		}
	}

	_passFilter(row, filter) {
        let res = true;
        for(var prop in filter) {
            if (row[prop].value !== filter[prop]) res = false;
        }
        return res;
    }





}

class ManagedCollection extends Collection {
    constructor(key = 'id', data = null) {
		super();

		this._myCollection = {};
		this._key = key;

		let self = this;
		this._rowHandler = {
			set: (target, key, val) => {
				let ov = target[key], res = false;
				if (key in target) { target[key] = val; res = true; }
				else { res = target.setItem(key, val); }
				self.emit('update', { type:'change', row: target[self._key], property: key, oldVal: ov, newVal: val });
				return res;
			},
		};

		if (data && data.length > 0) {
			data.forEach(itm => {
				let keyVal = itm[self._key];
				self._myCollection[keyVal] = new Proxy(itm, self._rowHandler);
			});
		}
    }

	put(key, value) { 
		this._myCollection[key] = new Proxy(value, this._rowHandler); 
		this.emit('update', { type:'add', row: key });
	}

}

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



	render() {}

	connectedCallback() {
		this.render();
	}

	setAtProp(attrName, val) {
		if (val) { this.setAttribute(attrName, val); }
		else { this.removeAttribute(attrName); }
		this.render();
	}

}  // END WiredHTMLElement

class DM {
	static Target(target) {
        let el = new ElementHlpr();
        if (target instanceof Element || target instanceof Document) {
            el.elm = target;
        } else {
            let trg = document.querySelector(target);
            el.elm = trg;    
        }
		return el;
	}
}

export { Collection, DM, EventEmitter, ManagedCollection, QueryCollection, WiredHTMLElement };
