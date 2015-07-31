module('Pattern Matching');

/*
	The idea for pattern matching is that you can pass
	a pattern to the observable and it will
	validate the content on that pattern.

	Remember regex's only work for strings!
*/

test('Pattern matching does simple pattern validation', 3, function() {
	// Create a validated observable for word chars + spaces and no digits 
	var name = ko.validate.observable('bob', /^[A-Za-z ]+$/);
	name('10');
	strictEqual(name(), 'bob', 'Name should not be able to change to 10');
	name('i love code');
	strictEqual(name(), 'i love code', 'Sentence should pass pattern validation')
	name(555);
	strictEqual(name(), 'i love code', 'Non strings should not validate');
});

/*
	The idea for function validation is that you pass in
	a filter, if it returns null, the value will not 
	change, otherwise it sets the valud equal to 
	the value returned.
*/
module('Function validation');
test('Non empty validation function works', 2, function() {
	var neverEmpty = ko.validate.observable('foo', function(val) {
		return val ? true : false;
	});
	neverEmpty('bar');
	strictEqual(neverEmpty(), 'bar', 'Should be able to change value to "bar".');
	neverEmpty('');
	strictEqual(neverEmpty(), 'bar', 'Should stay at "bar" since we passed in empty string');
});

/*
 Flags should be able to be set via options or method,
 and the flag should update when callback triggers
 are made.
 */
module('Flag validation');

test('Setting flag via method', 6, function() {
    var valid = ko.observable(true);
    var anySetValue = ko.validate.observable('foo', function(val) {
        return val ? true : false;
    }).flag(valid);
    anySetValue('bar');
    strictEqual(anySetValue(), 'bar', 'Should stay "bar"');
    strictEqual(valid(), true, 'Valid flag was set to true (or remained true)');
    anySetValue('');
    strictEqual(valid(), false, 'Valid flag should now be false');
    strictEqual(anySetValue(), 'bar', 'Validated observable should still be "bar"');
    anySetValue('baz');
    strictEqual(anySetValue(), 'baz', 'Should become "baz"');
    strictEqual(valid(), true, 'Valid flag was set to true now that valid input was given');
});

test('Setting flag via options', 6, function() {
    var valid = ko.observable(true);
    var anySetValue = ko.validate.observable('foo', {
        validate: function(val) {
            return val ? true : false;
        },
        flag: valid
    });
    anySetValue('bar');
    strictEqual(anySetValue(), 'bar', 'Should stay "bar"');
    strictEqual(valid(), true, 'Valid flag was set to true (or remained true)');
    anySetValue('');
    strictEqual(valid(), false, 'Valid flag should now be false');
    strictEqual(anySetValue(), 'bar', 'Validated observable should still be "bar"');
    anySetValue('baz');
    strictEqual(anySetValue(), 'baz', 'Should become "baz"');
    strictEqual(valid(), true, 'Valid flag was set to true now that valid input was given');
});

test('Flags should be set before firing handlers', 16, function() {
    var valid = ko.observable(true);
    var anySetValue = ko.validate.observable('foo', function(val) {
        return val ? true : false;
    })
        .flag(valid)
        .success(function() {
          strictEqual(valid(), true, 'Valid flag was set to true before success callback');
        })
        .fail(function() {
            strictEqual(valid(), false, 'Valid flag was set to false before fail callback');
        })
        .always(function(value) {
            equal(!!valid(), !!value, 'Valid flag was set before always callback');
        });
    anySetValue('');
    strictEqual(valid(), false, 'Valid flag should now be false');
    strictEqual(anySetValue(), 'foo', 'Validated observable should still be "foo"');
    anySetValue('bar');
    strictEqual(anySetValue(), 'bar', 'Should stay "bar"');
    strictEqual(valid(), true, 'Valid flag was set to true');
    anySetValue('');
    strictEqual(valid(), false, 'Valid flag should now be false');
    strictEqual(anySetValue(), 'bar', 'Validated observable should still be "bar"');
    anySetValue('baz');
    strictEqual(anySetValue(), 'baz', 'Should become "baz"');
    strictEqual(valid(), true, 'Valid flag was set to true now that valid input was given');
});

/*
	Object validation is the ability to
	pass in an object with defined methods
	for validation and event callbacks

	You can also add event callbacks with method
	chaining which is equivalent to passing them
	in as a member of the object

*/
module('Object validation');

test('Object validation setup works with pattern', 3, function() {
	var wordCharsOnly = ko.validate.observable('foo', {
		pattern: /^\w+$/
	});
	strictEqual(wordCharsOnly(), 'foo', 'Should be initial value');
	wordCharsOnly('####');
	strictEqual(wordCharsOnly(), 'foo', 'Should not accept non word chars');
	wordCharsOnly('hi_there');
	strictEqual(wordCharsOnly(), 'hi_there', 'Should accept word characters');
});

test('Object validation setup works with pattern and function', 4, function() {
	var wordsLongerThan5 = ko.validate.observable('foobar', {
		pattern: /^[\w ]+$/,
		validate: function(value) {
			// String should be 5 characters long at minimum
			return typeof value === 'string' && value && value.length > 5;
		}
	});
	strictEqual(wordsLongerThan5(), 'foobar', 'Should be initial value');
	wordsLongerThan5('foo');
	strictEqual(wordsLongerThan5(), 'foobar', 'Word "foo" is too short');
	wordsLongerThan5('####');
	strictEqual(wordsLongerThan5(), 'foobar', 'Should not accept non word chars');
	wordsLongerThan5('the bird is the word');
	strictEqual(wordsLongerThan5(), 'the bird is the word', 'Should accept a string longer than 5 characters in length');
});

module('Callback logic');

test('Callbacks firing appropriately', 12, function() {
	var success = 0;
	var fail = 0;
	var always = 0;
	var callbackTest = ko.validate.observable('foobar', {
		validate: function(value) {
			return value !== null;
		},
		success: function(value) {
			success += 1;
		},
		fail: function(value) {
			fail += 1;
		},
		always: function(value) {
			always += 1;
		}
	});
	callbackTest('foo');
	strictEqual(success, 1, "Should have made one success callback");
	strictEqual(always, 1, "Should have made one always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest('bar');
	strictEqual(success, 2, "Should have made another success callback");
	strictEqual(always, 2, "Should have made another always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest(null);
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 3, "Should have made another always callback");
	strictEqual(fail, 1, "Should have made a fail callback");
	callbackTest(null);
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 4, "Should have made another always callback");
	strictEqual(fail, 2, "Should have made another fail callback");
});

test('Callbacks firing appropriately after being setup with chaining', 12, function() {
	var success = 0;
	var fail = 0;
	var always = 0;
	var callbackTest = ko.validate.observable('foobar')
		.validate(function(value) {
			return value !== null;
		})
		.success(function(value) {
			success += 1;
		})
		.fail(function(value) {
			fail += 1;
		})
		.always(function(value) {
			always += 1;
		});
	callbackTest('foo');
	strictEqual(success, 1, "Should have made one success callback");
	strictEqual(always, 1, "Should have made one always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest('bar');
	strictEqual(success, 2, "Should have made another success callback");
	strictEqual(always, 2, "Should have made another always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest(null);
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 3, "Should have made another always callback");
	strictEqual(fail, 1, "Should have made a fail callback");
	callbackTest(null);
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 4, "Should have made another always callback");
	strictEqual(fail, 2, "Should have made another fail callback");
});

test('Callbacks firing appropriately with pattern matching', 12, function() {
	var success = 0;
	var fail = 0;
	var always = 0;
	var callbackTest = ko.validate.observable('foobar')
		.pattern(/^[a-z]+$/)
		.success(function(value) {
			success += 1;
		})
		.fail(function(value) {
			fail += 1;
		})
		.always(function(value) {
			always += 1;
		});
	callbackTest('foo');
	strictEqual(success, 1, "Should have made one success callback");
	strictEqual(always, 1, "Should have made one always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest('bar');
	strictEqual(success, 2, "Should have made another success callback");
	strictEqual(always, 2, "Should have made another always callback");
	strictEqual(fail, 0, "Should not have made one fail callback");
	callbackTest('555');
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 3, "Should have made another always callback");
	strictEqual(fail, 1, "Should have made a fail callback");
	callbackTest(null);
	strictEqual(success, 2, "Should not have made another success callback");
	strictEqual(always, 4, "Should have made another always callback");
	strictEqual(fail, 2, "Should have made another fail callback");
});

module('General');

test('Normal observables have isValidateable property', function() {
	// This property ensures that we do not call validation (which fires callbacks)
	var observable = ko.observable('foo');
	var validated = ko.validate.observable('foo');
	strictEqual(observable.hasOwnProperty('isValidateable'), false, 'Normal observable should not have isValidateable property');
	strictEqual(validated.hasOwnProperty('isValidateable'), true, 'Validatable observable should have isValidateable property');
});

module('Pollution');

test('Test that we are not overriding the global observable comparison function (doh)', function() {
	var observable = ko.observable('foo');
	var validated = ko.validate.observable('foo');
	notStrictEqual(observable['equalityComparer'], validated['equalityComparer'], 'We should not override the global ko equalityComparer fn');
});

module('Dispose');

test('Test that dispose calls are made when observable is dispose manually', 2, function() {
	var disposable = ko.computed(function() {
        ok(true, 'called');
    });
    var validated = ko.validate.observable('foo',  /^[a-z]+$/)
        .flag(disposable);
	ok(validated.dispose, 'validated observable has dispose method');
    validated.dispose();
});
