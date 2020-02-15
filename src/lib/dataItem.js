import DataFld from "./dataField";


class DataItem {
    constructor(options) {

        this._pvt_key = options.key || null;

        this._pvt_order = options.order || null;
        this._pvt_fields = [];

        for (const key in options.values) {
            this._pvt_fields.push(key);
            let fld = new DataFld(key, options.values[key]);
            this[key] = fld;
        }
    }
    get pvt_key() { return this._pvt_key; }
    get pvt_order() { return this._pvt_order; }

    // get values() { return this._values; }
    // set values(val) {
    //     this._values = val;

    //     let orgV = {};
    //     for (const fld in this._values) {
    //         orgV[fld] = this._values[fld];
    //     }
    //     this._orgValue = orgV;
    //     this._dirty = {};
    // }


    // _raiseEvent(type, msg) {
    //     // EX: this._raiseEvent('change', { itemKey: 3, item: this._values })
    //     this.dispatchEvent(new CustomEvent(type, { 
    //         bubbles: true, 
    //         detail: msg
    //     }))
    // }

    rowDirty(){
        let dirty = false;
        this._pvt_fields.forEach(fKey => {
            if (this[fKey].isDirty) dirty= true;
        });
        return dirty;
    }
    passFilter(filter) {
        let res = true;
        for(var prop in filter) {
            if (this[prop].passFilter(filter[prop]) === false) res = false;
        }
        return res;
    }

    resetValue() {
        this._pvt_fields.forEach(fKey => {
            this[fKey].resetValue();
        });
    }
    commitChanges() {
        this._pvt_fields.forEach(fKey => {
            this[fKey].commitChange();
        });
    }
    checkDif() {
        let dirt = false;
        this._pvt_fields.forEach(fKey => {
            if (this[fKey].checkDirty(filter).isDirty) dirt = true;
        });
        return dirt;
    }
	update(values) {
        let self = this;
		for(var prop in values){
            if (self[prop].canUpdate) self[prop] = values[prop];
		}
	};

}

export default DataItem;