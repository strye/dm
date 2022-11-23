import ElementHlpr from "./lib/elementHlpr.js";
import Collection from "./lib/collection.js";
import QueryCollection from "./lib/queryCollection.js";
import BaseCollection from './lib/baseCollection.js';
import DataSet from "./lib/dataSet.js";
import EventEmitter from "./lib/eventEmitter.js"

class DM {
	static Target(target) {
        let el = new ElementHlpr();
        if (target instanceof Element || target instanceof HTMLDocument) {
            el.elm = target;
        } else {
            let trg = document.querySelector(target);
            el.elm = trg;    
        }
		return el;
	}
	static get EventEmitter() { return EventEmitter; }
	static get Collection() { return Collection; }
	static get QueryCollection() { return QueryCollection; }
	static get BaseCollection() { return BaseCollection; }
	static get DataSet() { return DataSet;
	}
	static NewCollection() { 
		return new Collection(key, data)
	}
	static NewDataSet(dataSchema, data) {
		return new DataSet(dataSchema, data)
	}

}
const domutil = {
	select(selector) {},
	selectAll(selector) {},
	append(elementName) {},
	remove(selector) {},
	data(data) {},
	attr() {},
	style() {},
	element() {},
	element() {},
	element() {},
}

export default DM;