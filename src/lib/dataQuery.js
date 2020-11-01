class DataQuery {
    constructor(setCollection) {
        this._setColl = setCollection;
        this._selectFlds = false;
        this._setArray = []
        this._resultKeys = {};
    }

    select(fields) {
        for (const key in this._setColl) {
            this._resultKeys[key] = true;
        }
        if (fields) this._selectFlds = fields;
        return this;
    }
    filter(criteria) {
        this._resultKeys = {};
		for(let key in this._setColl){
			if (this._setColl[key].passFilter(criteria)) {
				this._resultKeys[key] = true;
			}
		}
    }
    toArray() {
        this._setArray = [];
        for(const key in this._resultKeys){
			this._setArray.push(this._setColl[key].select(this._selectFlds));
		}
        return this;
    }
    sort(criteria) {
        // let crit = { field2: 1, field1: -1 }
        this._setArray.sort(function(a,b) {
            let sortFields = Object.keys(criteria);
            
            let retVal = null;
            sortFields.forEach((fld, idx) => {
                let dir = criteria[fld];
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
        return this;
    }
    limit(count) {
        let tmpAry = []
        let max = (count < this._setArray.length) ? this._setArray.length : count;
        for (let index = 0; index < max; index++) {
            tmpAry.push(this._setArray[index]);
        }
        this._setArray = [];
        this._setArray = tmpAry;
    }
    result() {
		if (this._setArray.length <= 0 && Object.keys(this._resultKeys).length > 0) this.toArray();
        return this._setArray;
    }
    iterator(callback) {
		this._setArray.forEach((item, idx) => {
			callback(item, idx);
		});
    }
}

export default DataQuery;