module("Pattern Matching");

/*
	The idea for pattern matching is that you can pass
	a pattern to the observable and it will
	validate the content on that pattern.
*/
test("Should test that pattern matching works", function() {
	var cats = ko.observable(0);
	cats(5);
	strictEqual(cats(), 5, "Cats should be set to 5 via observable");
});

/*
	The idea for function validation is that you pass in
	a filter, if it returns null, the value will not 
	change, otherwise it sets the valud equal to 
	the value returned.
*/
module("Function validation");


/*
	Object validation is the ability to
	pass in an object with defined methods
	for validation and event callbacks

	You can also add event callbacks with method
	chaining which is equivalent to passing them
	in as a member of the object

*/
module("Object validation");

/*
	Test that all of our different ways of
	creating a validated observable
	actually do what we expect.

	// Single pattern matching
	var money = ko.validateObservable(defaultValue, /\$.+/);

	// Function validation
	var money = ko.validateObservable(defaultValue, function(val) {
		if (val) return true;
		return false;
	});

	// Method chaining for event callbacks
	var fn = function(val) { console.log(val); };
	var money = ko.validateObservable(defaultValue, /\$.+/)
		.onSuccess(fn)
		.onFail(fn)
		.onAlways(fn);

	// Object validation, best way to isolate/reuse validation logic
	var validator = {
		success: function() {},
		fail: function() {},
		always: function() {},
		pattern: /.+/,
		validate: function(val) {
			return true;
		}
	};
	var money = ko.validateObservable(defaultValue, validator);

*/
module("Syntax");
