import EventEmitter from "./eventEmitter.js";
/*
sample schema {
    'id': {name: 'id', type: "int", required: false, canEdit: false},
    'TI': {name: 'TI', type: "text", required: true, canEdit: true}
}
*/
class DataRow extends EventEmitter {
    constructor(schema, values = {}) {
		super();
		// Need to rebuild the schema to break reference?
		this._fieldSchema = schema;
		this._fieldValues = {};
		
        for (const fld in this._fieldSchema) {
			let field = {};
            field.value = values[fld] || null;
			field.originalValue = field.value;
			this._fieldValues[fld] = field;
        }
    }
    get schema() { return this._fieldSchema; }
    set schema(val) { this._fieldSchema = val; }
    get fields() { return this._fieldValues; }
    get values() {
        let res = {};
        for (const key in this._fieldSchema) {
            res[key] = this._fieldValues[key].value;
        }
        return res;     
    }

    updateRow(values, reset = false) {
        for (const fld in values) {
            this._fieldValues[fld].value = values[fld];
            if (reset) this._fieldValues[fld].originalValue = values[fld];
        }
    }
    updateField(field, value, reset = false) {
        this._fieldValues[field].value = value;
        if (reset) this._fieldValues[fld].originalValue = value;
	};
    resetRow() {
        for (const fld in this._fieldValues) {
            this._fieldValues[fld].value === this._fieldValues[fld].originalValue;
        }
    }
    resetField(field) {
        this._fieldValues[field].value === this._fieldValues[field].originalValue;
    }

    rowDirty(){
        let self = this, dirty = false;
        for (const fld in self._fieldValues) {
            let field = self._fieldValues[fld]
            if (field.value !== field.originalValue) dirty = true;
        }
        return dirty;
    }
    fieldDirty(field){
        return (this._fieldValues[field].value !== this._fieldValues[field].originalValue);
    }

	getField(name) { return this._fieldValues[name].value}
    select(fields) {
        if (Array.isArray(fields)) {
            let res = {};
            fields.forEach(fld => {
                res[fld] = this._fieldValues[fld].value;            
            });
            return res;     
        } else {return this.values;}
    }

    passFilter(filter) {
        let res = true;
        for(var prop in filter) {
            if (this._fieldValues[prop].value !== filter[prop]) res = false;
        }
        return res;
    }
}

export default DataRow;