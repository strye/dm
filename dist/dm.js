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
	static Target(selector) {
		let trg = document.querySelector(selector);
		let el = new ElementHlpr();
		el.elm = trg;

		return el;
	}

    constructor(options) {
		super(options);
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

	// TODO: data(dataSet) { }


}

class Collection extends EventEmitter {
    constructor(options) {
        super(options);

		this._myCollection = {};
		this._key = options.key || "id";
		if (options && options.key && options.data) {
			let self = this;
			options.data.forEach(itm => {
				let keyVal = itm[self._key];
				self._myCollection[keyVal] = itm;
			});
		}
    }
	get size() { return Object.keys(this._myCollection).length; }
    //size() { return Object.keys(this._myCollection).length; };

	hasKey(key) {
        //return this._myCollection.hasOwnProperty(key)
        return ("undefined" !== typeof(this._myCollection[key]))
    }

	put(key, value) { 
		this._myCollection[key] = value; 
	}

	get(key) { 
		return this._myCollection[key]; 
	}

	remove(key) { 
		delete this._myCollection[key]; 
	}

	upsert(key, value) {
		for(var prop in value){
			this._myCollection[key][prop] = value[prop];
		}
	}

	clear() { 
		this._myCollection = {}; 
	}

	iterator(callback, sort, filter) {
		var collection = this._myCollection;
		var res = [];
		for(var prop in collection){
			var record = collection[prop];
			if (filter) {
				if (record[filter.field] === filter.criteria) res.push(record);
			} else {
				res.push(record);
			}
		}
		if (sort) {
			res.sort(function(a,b) {
				if (a[sort] < b[sort]) return -1;
				if (a[sort] > b[sort]) return 1;
				return 0;
			});
		}
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

class DM {
	static Target(selector) {
		let trg = document.querySelector(selector);
		let el = new ElementHlpr();
		el.elm = trg;

		return el;
	}
	static Collection(data, key) {
		return new Collection({data: data , key: key})
	}

}

export default DM;
