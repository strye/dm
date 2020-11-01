import DataRow from "./dataRow.js";
import DataQuery from "./dataQuery.js";

class DataSet {
    constructor(schema, data) {
        this._schema = schema;
        this._mySet = {};       
        
        if (data) {
            data.forEach(row => {
				let key = row[this._schema.keyField];
				this.put(key, row);
			},this);
		}
    }
    get keyField() { return this._schema.keyField }
    get schema() { return this._schema }
    get size() { return Object.keys(this._mySet).length }

    hasRow(key) { return ("undefined" !== typeof(this._mySet[key])) }
    
    // Create
    put(key, values) {
        this._mySet[key] = new DataRow(this._schema.fields, values);
    };

    // Read
    select(fields) {
        let query = new DataQuery(this._mySet);
        return query.select(fields);
    }
    getRow(key) { return (this.hasRow(key) ? this._mySet[key].values : {}) }
    getRowWithSchema(key) { return (this.hasRow(key) ? this._mySet[key] : {}) }

    // Update
    update(rows, upsert = true) {
        rows.forEach(row => {
            let key = row[this._schema.keyField];
            this.updateRow(key,row,upsert)
        }, this);
    }
    updateRow(key, value, upsert = false) {
        if (this.hasKey(key)) {
            this._mySet[key].updateRow(value);
        } else if (upsert) {
            this.put(key,value)
        }
    }

    // Delete
	delete(key) { delete this._mySet[key]; };
	clear() { this._mySet = {} };

}

export default DataSet;