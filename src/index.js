import ElementHlpr from "./lib/elementHlpr.js";
import Collection from "./lib/collection.js";
import QueryCollection from "./lib/queryCollection.js";
import BaseCollection from './lib/baseCollection.js';
import DataSet from "./lib/dataSet.js";
import WiredHTMLElement from "./lib/wiredHTMLElement.js";
import EventEmitter from "./lib/eventEmitter.js"

class DM {
	static Target(target) {
        let el = new ElementHlpr();
        if (target instanceof Element || target instanceof Document) {
            el.elm = target;
        } else {
            let trg = document.querySelector(target);
            el.elm = trg;    
        }
		return el;
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

export {DM, EventEmitter, WiredHTMLElement, Collection, QueryCollection, BaseCollection }
