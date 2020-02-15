import Collection from "./collection.js";
import DataCollection from "./dataColl.js";
//import DataComms from "./data-comms.js";
import EventEmitter from "./eventEmitter.js";

class DataManager extends EventEmitter {
    constructor(options) {
        super();
        this.ready = false;


        this._logging = options.logging || { verbose = false, debug = false }

        this._topic = options.topic || '';

        this._data= new DataCollection();
        this._keyField= options.keyField || 'id';
        this._editMode= true;

        this._rowFields= new Collection();
        if (options.fields) {
            options.fields.forEach(fld => {
                this._rowFields.put(fld.name, fld)
            });
        }

        this._updateQ= new Collection();

        this._comms = new DataComms({topic: this._topic})
        this._comms.socketSetup()
        this.setupListeners()


    }
    get count() {return this._data.size();}
    get data() { return this._data.toRawArray(); }
    get array() { return this._data.toArray(); }

    get rowFields() { return this._rowFields.toArray(); }

    get keyField() { return this._keyField; }

    get updateQ() { return this._updateQ.toArray(); }


    refresh(filter){
        this._comms.sendRefreshEvent(filter);
    }

    getItem(id){
        return this._data.getValue(id);
    }
    getManagedItem(id) {
        return this._data.get(id);
    }
    getFieldSpec(fldName) { return this._rowFields.get(fldName); }


    editEvent(id, fld, newV, oldV){
        let evt = {
            id: id, 
            field: fld, 
            newValue: newV, 
            oldValue: oldV
        }
        if (this._logging.verbose) console.log(evt);
        this.processItemEvent(evt)

        this._comms.sendEditEvent(evt)
    }

    commitUpdates() {
        let self = this;

        self._updateQ.iterator((qItem, idx) => {
            let match = true;
            self._rowFields.iterator((fld, idx) => {
                if (qItem.original[fld.name] != qItem.update[fld.name]) { match = false }
            });
            if (match) {
                // Remove from q and clean dirty flag
                let key = `row_${qItem[self._keyField]}`;
                self._updateQ.remove(key)
                // remove dirty flags  self._data.get(id)?
            } else {
                self._comms.sendUpdateEvent(qItem)
            }
        })
    }


    processItemEvent(evt) {
        if (this._logging.verbose) console.log(evt);
        //processItemEvent({id: id, field: fld, newValue: newV, oldValue: oldV})
        let item = this._data.get(evt.id);

        // Prep updated record
        let udPacket = {}
        this._rowFields.iterator((fld, idx) => {
            udPacket[fld.name] = item[fld.name]
        });

        udPacket[evt.field] = evt.newValue;
        let dirty = true;

        // Check Queue
        let key = `row_${evt.id}`,
            qItem = this._updateQ.get(key);

        if (qItem) {
            let match = true;
            this._rowFields.iterator((fld, idx) => {
                if (qItem.original[fld.name] != udPacket[fld.name]) { match = false }
            });
            if (match) {
                dirty = false;
                this._updateQ.remove(key)
            } else {
                qItem.update = udPacket;
            }
        } else {
            let orgD = {}
            this._rowFields.iterator((fld, idx) => {
                orgD[fld.name] = item[fld.name]
            });

            qItem = {original: orgD, update: udPacket }
            this._updateQ.put(key, qItem)
        }


        // Update list
        item.updateField(evt.field, evt.newValue);

        this.emit('change',{})
        this.emit('item.change',{itemId: evt.id})

    }

    updateRow(item) {
        let row = this._data.get(item[this._keyField]);
        row.update(item);
    }
    refreshRow(item) {
        this._data.put(item[this._keyField],item);
        // let row = this._data.get(item[this._keyField]);
        // row.update();
    }
    resetRow(item) {
        let row = this._data.get(item[this._keyField]);
        row.resetValue();
    }

    deleteItem(id) {
        if (this._logging.debug) console.log("delete", id)
    }

    addItem(item) {
        if (this._logging.debug) console.log("add", item)
        this._data.put(item[this._keyField], item)
    }
    saveNewItem(item){
        this._comms.sendAddEvent(item)
    }

    hasPendingChanges() {
        if (this._logging.debug) console.log(this._updateQ.size)
        return (this._updateQ.size > 0);
    }





    setupListeners() {
        let self = this;

        self._comms.on('list',list =>{
            if(this._logging.verbose) console.log("list event", list.length)
            self._data = new DataCollection({ keyFld: self._keyField, data: list});
            self.emit('refresh',{})
        })
        self._comms.on('item', item => {
            self.updateRow(item)
            self.emit('change',{})
            self.emit('item.change',{itemId: item[self._keyField]})
        });
        self._comms.on('item.updated', item => {
            if(this._logging.verbose) console.log("item.updated", e.detail.item)
            self.refreshRow(item)
            self.emit('change',{})
            self.emit('item.change', { itemId: item[self._keyField] })
        });
        self._comms.on('item.reset', item => {
            self.resetRow(item)
            self.emit('change',{})
            self.emit('item.reset', { itemId: item[self._keyField] })
        });
        self._comms.on('item.edit', evt => {
            if(this._logging.verbose) console.log("item.edit event cap", evt)
            self.processItemEvent(evt);
            self.emit('change',{})
            self.emit('item.change', { itemId: evt.id })
        });

        self._comms.on('item.add', item => {
            if(this._logging.verbose) console.log("item.add", item)
            self._data.push(item);
            self.emit('change',{})
            self.emit('item.add', { itemId: item[this._keyField] })
        });
        self._comms.on('item.delete', msg => {
            if(this._logging.verbose) console.log("item.delete", msg)
                //this._data.remove(msg.itemId);

            self.emit('change',{})
            self.emit('item.delete', msg)
        });


        //_comms.socketSetup();
        this.ready = true;
    }

}

export default DataManager;