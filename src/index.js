import ElementHlpr from "./lib/elementHlpr.js";
import Collection from "./lib/collection.js";
import QueryCollection from "./lib/queryCollection.js";
import ManagedCollection from './lib/managedCollection.js';
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
}
// const domutil = {
// 	select(selector) {},
// 	selectAll(selector) {},
// 	append(elementName) {},
// 	remove(selector) {},
// 	data(data) {},
// 	attr() {},
// 	style() {},
// 	element() {},
// }

export {DM, EventEmitter, WiredHTMLElement, Collection, ManagedCollection, QueryCollection }
