const DataSet = require('../src/lib/dataSet');

var should = require('chai').should() //actually call the function
, sampleData = [
	{ id: 1, title: 'One', f_2: 'Field Two Row One'},
	{ id: 2, title: 'Two', f_2: 'Field Two Row Two'}
],
dataSchema = {
	keyField: 'id', 
	fields: {
		'id': {name: 'id', type: "int", required: true, canEdit: false},
		'title': {name: 'title', type: "text", required: true, canEdit: true},
		'f_2': {name: 'f_2', type: "text", required: false, canEdit: true}	
	}
},
dataSet = new DataSet(dataSchema, sampleData);


describe('beverages', function() {
	it('should return Two items', () => {
		dataSet.select().result().should.have.lengthOf(2);
	});
});

