import Collection from './collection.js';

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

export default QueryCollection;