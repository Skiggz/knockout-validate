##knockout-validate

#####Knockout adapter that validates observable values.

Make sure to check out [Knockout's Home Page](http://knockoutjs.com/index.html)!

----

###Installation / Include 

* I have currently implemented and tested this with version 3.0.0 of knockout.js
* I am not 100% sure how well it works with previous/future versions.
* I will continue to test and update this with more version support info.

```html
<!-- Include knockout first (ko) -->
<script type="text/javascript" src="knockout-3.0.0.js"></script>
<!-- Then include knockout-validate -->
<script type="text/javascript" src="knockout-validate.js"></script> 
```
----

###Usage

* Validated observables are used just like normal observables. 
* There are many ways to set up validated observables.

#####Here are examples of how to create a validated observable

* Passing in a regex pattern for string values.
```javascript
var name = ko.validate.observable("First Name", /^\w+$/);
```

* Passing in a function to validate any value.
```javascript
var name = ko.validate.observable("First Name", function(value) {
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
var validator = {
	success: function(value) {
		myViewModel.isValid(true);
	},
	fail: function(value) {
		myViewModel.isValid(false);
	},
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
var name = ko.validate.observable("First Name", validator);
```

* Purely with method chaining
```javascript
var name = ko.validate.observable("First Name")
	.success(function(value) {
		myViewModel.isValid(true);
	})
	.fail(function(value) {
		myViewModel.isValid(false);
	})
	.always(function(value) {
		myViewModel.attempts(myViewModel.attempts() + 1);
	})
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
		

----

###Tests

* Tests are written and ran with QUnit separately in browser.
* Navigate your browser to `file:///{path to the codez}/knockout-validate/test/knockout-validate-test.html` to run.

Make sure to check out [QUnit's Home Page](https://qunitjs.com/)!