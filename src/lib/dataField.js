import EventEmitter from "./eventEmitter.js";

class DataField extends EventEmitter {
    constructor(name, value, options) {
        this._name = name;
        this._value = value || null;

        this._label = options.label || name;

        this._updateable = options.updateable || true;
        this._orgValue = value;
        this._dirty = false;
    }

    get name() { return this._name; }

    get value() { return this._value; }
    set value(val) { this._value = val; this._dirty = (this._value !== this._orgValue); }

    get isDirty() { return this._dirty; }
    get canUpdate() { return this._updateable; }

    get label() { return this._label; }
    set label(val) { this._label = val; }


    resetValue() {
        this._value = this._orgValue;
        this._dirty = false;
        return this;
    }
    commitChange() {
        this._orgValue = this._value;
        this._dirty = false;
        return this;
    }
    checkDirty() {
        this._dirty = (this._value !== this._orgValue);
        return this;
    }

    passFilter(filter) {
        return (this._value === filter)
    }




}
export default DataField;