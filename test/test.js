var should = require('chai').should() //actually call the function
	, beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

describe('beverages', function() {
	it('should include tea', function() {
		beverages.should.have.property('tea').with.lengthOf(3);
	});
});

