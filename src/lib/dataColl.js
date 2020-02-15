import Collection from "./collection.js";
import DataItem from "./dataItem.js";


class DataCollection extends Collection {
    constructor(options) {
        this._logging = options.logging || { verbose = false, debug = false }

        this._myCollection = {};        
        this._counter = 0;
        
        if (options && options.data && options.keyFld) {
            let keyFld = options.keyFld || 'Id'
            this.load(keyFld, options.data)
        }
    }

    _raiseEvent(type, msg) {
        // EX: this._raiseEvent('change', { itemKey: 3, item: this._values })
        this.dispatchEvent(new CustomEvent(type, { 
            bubbles: true, 
            detail: msg
        }))
    }
    load(keyFld, data) {
        let self = this;
        if(this._logging.debug) console.log(keyFld, data.length)

        data.forEach(row => {
            self.put(row[keyFld], row);
        });
    }
    
    // size() {
	// 	return Object.keys(this._myCollection).length;
	// };

    // hasKey(key) {
    //     //return this._myCollection.hasOwnProperty(key)
    //     return ("undefined" !== typeof(this._myCollection[key]))
    // }

    // get(key) { 
	// 	return this._myCollection[key]; 
	// };
	getValue(key) { 
		return this._myCollection[key].values;
	};


    put(key, value) {
        this._counter++;
        let ord = this._counter, row = new DataItem({
            key: key,
            order: ord,
            values: value
        });
 
        super.put(key, row);
        //this._myCollection[key] = row;
	};
	upsert(key, value) {
        // TODO: FIX - This isn't a collection upsert.
        //this._myCollection[key].upsert(value);
        for(var prop in value){
			this._myCollection[key].values[prop] = value[prop];
		}

	};


	// remove(key) { 
	// 	delete this._myCollection[key]; 
	// };
	// clear() { 
	// 	this._myCollection = {} 
	// };



    iterator(callback, filter, sortFields) {
		let res = this.filteredArray(filter, sortFields);
		res.forEach((item, idx) => {
			callback(item, idx);
		});
    }

    toRawArray() {
		let collection = this._myCollection,
		    res = [];
		for(let prop in collection){
			res.push(collection[prop]);
		}
        return res;
	};

	// toArray(sortFields) {
	// 	let collection = this._myCollection,
	// 	    res = [];
	// 	for(let prop in collection){
	// 		res.push(collection[prop].values);
	// 	}
	// 	if (sortFields) {
    //         res = this._sortArray(res, sortField)
    //     }
    //     return res;
	// };

	filteredArray(filter, sortFields) {
        let collection = this._myCollection,
            res = [];
		for(let prop in collection){
			if (collection[prop].passFilter(filter)) {
				res.push(collection[prop].values);
			}
		}
		if (sortFields) {
            res = this._sortArray(res, sortFields)
            if(this._logging.debug) console.log(res)
        }
        return res;
    };
    
    _sortArray(records, sortCriteria) {
        // let crit = {
        //     field2: 1,
        //     field1: -1
        // }
        if(this._logging.debug) console.log(records.length)
        let res = records.sort(function(a,b) {
            let sortFields = Object.keys(sortCriteria);
            
            let retVal = null;
            sortFields.forEach((fld, idx) => {
                let dir = sortCriteria[fld];
                if (retVal === null) {
                    if (a[fld] < b[fld]) { retVal=(-1 * dir); }
                    if (a[fld] > b[fld]) { retVal=(1 * dir); }    
                }
                if (retVal) return retVal;
                if ((idx+1) >= sortFields.length) retVal= 0;
                return retVal;
            })
            return retVal
        });
        return res

    }




}

export default DataCollection;