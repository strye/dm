import ElementHlpr from "./lib/elementHlpr.js";
import Collection from "./lib/collection.js";
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
	static Collection(data, key) {
		return new Collection({data: data , key: key})
	}
	static get BaseCollection() { return BaseCollection; }
	static DataSet(dataSchema, data) {
		return new DataSet(dataSchema, data)
	}
	static get EventEmitter() { return EventEmitter; }

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