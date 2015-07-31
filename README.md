##knockout-validate

#####Knockout adapter that validates observable values.

Make sure to check out [Knockout's Home Page](http://knockoutjs.com/index.html)!

After you check out the docs, see the [Demo!](http://skiggz.github.io/knockout-validate/)

----

###Installation / Include 

* Currently knockout versions 3.0.0 and 3.3.0 have been tested for support
* The latest version is intended for 3.3.0 if you choose to install via bower.

#####Installing with bower
```
bower install knockout-validate
```

#####Installing manually
```html
<!-- Include knockout first (ko) -->
<script type="text/javascript" src="knockout-3.3.0.js"></script>
<!-- Then include knockout-validate -->
<script type="text/javascript" src="knockout-validate.js"></script> 
```
----

###Setup

#####Old School

* If you have knockout set as a global reference (`ko`) then just include knockout-validate.js

```
kov ? console.log('Ready for action') : ' console.log('KO Validate not found :(');
```

#####AMD (require.js)

* You can include the knockout-validate module in one of two ways
  1. You can set a path via require.js config for knockout named `knockout` and you're done
  2. If you find step 1 annoying, you can set a global variable `KNOCKOUT_VALIDATE_REQUIRE` to the name of your knockout module. Feel free to delete it once ko-validate module is created.

```javascript
KNOCKOUT_VALIDATE_REQUIRE = '/path/name/for/knockoutjs';
require(['path/to/knockout-validate'], function(ko) { 
    // notice the direct usage -- the module is passed in as whatever you name it
    var foo = ko.observable('hi', /^[a-z]+$/);
});

```

######Want support for another mechanism of include? Create a PR or post a feature request on github.

----


###Usage

* Validated observables are used just like normal observables. 
* There are many ways to set up validated observables.
* If you use global namespace, knockout-validate creates the `kov` object

#####Here are examples of how to create a validated observable

* Passing in a regex pattern for string values.
```javascript
var name = kov.observable("First Name", /^\w+$/);
```

* Passing in a function to validate any value.
```javascript
var name = kov.observable("First Name", function(value) {
	/* 
		This validation method will check to see that
		any value passed in is not null and not
		undefined before it is set
	*/
	return value !== null && value !== undefined;
});
```
* Passing in a validation object.
* All of the keys in the validator object are optional!
```javascript
var myValidCheckingObservable = ko.observable(false);
var validator = {
	success: function(value) {
		myViewModel.isValid(true);
	},
	fail: function(value) {
		myViewModel.isValid(false);
	},
	flag: myValidCheckingObservable,
	always: function(value) {
		myViewModel.attempts(myViewModel.attempts() + 1);
	},
	/*
		This example would validate a string
		if it consists of only 1 or more word characters
	*/
	pattern: /^\w+$/,
	/*
		This example would only allow values
		that are not null and not undefined
		to be set
	*/
	validate: function(value) {
		return value !== null && value !== undefined;
	}
};
var name = kov.observable("First Name", validator);
```

* Purely with method chaining
```javascript
var myValidCheckingObservable = ko.observable(false);
var name = kov.observable("First Name")
	.success(function(value) {
		myViewModel.isValid(true);
	})
	.fail(function(value) {
		myViewModel.isValid(false);
	})
	.always(function(value) {
		myViewModel.attempts(myViewModel.attempts() + 1);
	})
	.flag(myValidCheckingObservable)
	.pattern(/^\w+$/)
	.validate(function(value) {
		return value !== null && value !== undefined;
	});
```

----

###Details

#####This explains all the methods described in usage

* ALL the values are optional. Not setting any of them is equivalent to using a normal observable.

* **success** A method to be called on successful validation
>	Any kind of logic to happen after a valid change
>	For form validation, this could be useful to
>	change another observable that references
>	a valid CSS class in a css data binding

* **fail** A method to be called on failed validation
>	Any kind of logic to happen after an invalid change
>	Like success, you could update CSS or observables
>	etc...

* **always** A method to be called on every validation (if value has changed!)
>	This method (if set) is called on every observable
>	change that is a *different* value. So calling
>	myObservable(5) will not call always(5) if 
>	myObservable() === 5
>
>	If this is a password field you might use
>	this to increment login attempts for example. 

* **validate** The validation method itself
> 	The validation method should return true if valid
>	and false if not valid. Regardless, this method
>	returns the boolean representation of what
>	you return, so if it is not a boolean
> 	keep this in mind as it is different
>	for different browsers

* **pattern** A pattern to match and require the value to be a string
>	Same as setting the pattern in the function
>	call, but instead using a method chain.
>
>	If a pattern is set, it assumes you expect
>	a string to be set. SO, any non string value
>	will FAIL validation. Keep this in mind.
>
>	Also note that if a pattern and a validation
>	function is set, both will be used, starting
>	with the pattern. This is purely so that
>	you can utilize the pattern matching in
>	the pattern setting, instead of combining
>	it in your validation. You can still put
>	all the logic in your validation function 
>	if you want, but make sure the pattern
>	option is not set.
		
* **flag** Optionally set a flag for the observable to update
> 	It is common to want to update a UI or other observables
>   when your validated observable state changes. With
>   the flag setting, you can choose to bind a flag
>   to the validation callbacks (success and fail)
>   so that your flag will represent what the last
>   attempted value change was. 
>   
>   Keep in mind, this will not represent the state
>   of the observable, the observable will always
>   stay in a valid state.
>   
>   Also note that these flags are updated before
>   any of the handlers are triggered, so you can
>   check other observables validity in your
>   handlers.
>   
>   A great example usage is form fills. Check out
>   the demo page, see how the flag setting is
>   used and how it automagically updates the UI
>   via other bindings to the flag passed to
>   the validated observable.

----

###Tests

* Tests are written and ran with QUnit separately in browser.
* Navigate your browser to `file:///{path to the codez}/knockout-validate/test/knockout-validate-test.html` to run.

Make sure to check out [QUnit's Home Page](https://qunitjs.com/)!