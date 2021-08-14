import EventEmitter from "./eventEmitter.js";

class BaseCollection extends EventEmitter {
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
		this.emit('update', { type:'add', rowId: key })
	}

	get(key) { return this._myCollection[key]; }

	remove(key) { 
		delete this._myCollection[key]; 
		this.emit('update', { type:'remove', rowId: key })
	}

	upsert(key, value) {
		for(var prop in value){
			this._myCollection[key][prop] = value[prop];
		}
	}

	clear() { 
		this._myCollection = {}
		this.emit('update', { type:'clear' })
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

export default BaseCollection;