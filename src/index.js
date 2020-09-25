import ElementHlpr from "./lib/elementHlpr.js";
import Collection from "./lib/collection.js";

class DM {
	static Target(selector) {
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