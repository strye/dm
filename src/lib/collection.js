import BaseCollection from './baseCollection.js';

class Collection extends BaseCollection {
    constructor(key = 'id', data = null) {
		super()

		this._myCollection = {};
		this._key = key;

		let self = this;
		this._rowHandler = {
			set: (target, key, val) => {
				let ov = target[key], res = false;
				if (key in target) { target[key] = val; res = true; }
				else { res = target.setItem(key, val); }
				self.emit('update', { type:'change', row: target[self._key], property: key, oldVal: ov, newVal: val })
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
		this.emit('update', { type:'add', row: key })
	}

}

export default Collection;