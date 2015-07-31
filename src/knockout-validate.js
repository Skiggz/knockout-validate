/***** Knockout Validate (https://github.com/Skiggz/knockout-validate)
**** Skylar Lowery (https://github.com/Skiggz)
*** A Knockout plugin/adapter (http://knockoutjs.com/)
** License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

ko.validate = {};
ko.validate.originalEqualityComparer = ko.observable().equalityComparer;

ko.validate.Validator = function(validationSpec) {
	var v = this;
	this.success = null;
	this.fail = null;
	this.always = null;
	this.pattern = null;
	this.validate = null;
    this.flag = null;

	// Callback logic for post validation
	this.doValidationCallbacks = function(valid, value) {
        if (v.flag && ko.isObservable(v.flag)) {
            v.flag(valid);
        } else {
            v.flag = valid;
        }
		if (valid && v.success && typeof v.success === 'function') {
			v.success(value);
		}
		if (!valid && v.fail && typeof v.fail === 'function') {
			v.fail(value);
		}
		if (v.always && typeof v.always === 'function') {
			v.always(value);
		}
	};
	/*
		If a pattern is present for string value
		observables, we first make sure that it
		passes the pattern. Then we call the
		validation function if it exists
	*/
	this.logicalValidate = function(value) {
		var valid = (function(){
			if (v.pattern && typeof value === 'string' && !value.match(v.pattern)) {
				/* 
				   If the valud is a string and it does not match the pattern
				   specified, regarldess of a validation function, return false
				*/
				return false;
			}
			// If you set a pattern, it expects that you expect strings
			if (v.pattern && typeof value !== 'string') return false;
			if (v.validate && typeof v.validate === 'function') {
				return !!v.validate(value);
			}
			return true;
		})();
		v.doValidationCallbacks(valid, value);
		return valid;
	};
	// Update spec by what is given
	this.updateSpec = function(spec) {
		/*
			If it's a RegExp, set the pattern
			value of the validator
		*/
		if (spec instanceof RegExp) {
		 	v.pattern = spec;
		} else if (typeof spec === 'function') {
			/*
				If it's a function, set the 
				validate method of the validator
			*/
			v.validate = spec;
		} else if (typeof spec === 'object') {
			/*
				If it's an object, go through each
				expected possible member of the object
				and setup the validator object

				For example, we expect a success method
				to optionally be set in the object, so
				if it is, use it as the validator's
				success method.
			*/
			if (spec.hasOwnProperty('success') &&
				typeof spec.success === 'function') {
				v.success = spec.success;
			}
			if (spec.hasOwnProperty('fail') &&
				typeof spec.fail === 'function') {
				v.fail = spec.fail;
			}
			if (spec.hasOwnProperty('always') &&
				typeof spec.always === 'function') {
				v.always = spec.always;
			}
			if (spec.hasOwnProperty('pattern') &&
				spec.pattern instanceof RegExp) {
				v.pattern = spec.pattern;
			}
			if (spec.hasOwnProperty('validate') &&
				typeof spec.validate === 'function') {
				v.validate = spec.validate;
			}
			if (spec.hasOwnProperty('flag') &&
                typeof spec.flag !== 'undefined') {
				v.flag = spec.flag;
			}
		}
	};
	if (validationSpec) {
		this.updateSpec(validationSpec);
	}
};

ko.validate.observable = function(defaultValue, validationSpec) {
	// init validator
	var validator = new ko.validate.Validator(validationSpec);
    var _ob = ko.observable(defaultValue);
	/*
		Override equality comparer at this point
		to add validation logic
	*/
    _ob['equalityComparer'] = function(originalValue, newValue) {
		var koEquality = ko.validate.originalEqualityComparer(originalValue, newValue);
		if (!this.hasOwnProperty('isValidateable')) {
			return koEquality;
		}
		/*
			The default workflow of knockout first checks to see
			if the value has changed all. If it has not changed,
			we don't need to worry about doing any validation.
		*/
		if (koEquality) {
			return true;
		}
		/*
			Since the value has changed, or wants to change,
			see if it passes validation. 
		*/
		var valid = validator.logicalValidate(newValue);
		/*
			Remember, we return NOT valid to indicate
			a change or not (this is equialityCompare
			that knockout uses)

			If the value is invalid, we want knockout
			to think that nothing happened, and let 
			validation callback logic handle it.
		*/
		return !valid;
	};

	_ob.isValidateable = true;
	/*
		In case you prefer method chaining to
		setup validator

		Set success callback that gets 
		fired for every successful validation
	*/
	_ob.success = function(fn) {
		validator.updateSpec({success: fn});
		return _ob;
	};
	/* 
		Set failure callback that gets 
		fired for every failed validation
	*/
	_ob.fail = function(fn) {
		validator.updateSpec({fail: fn});
		return _ob;
	};
	/* 
		Set always callback that gets 
		fired for every validation
	*/
	_ob.always = function(fn) {
		validator.updateSpec({always: fn});
		return _ob;
	};
	/* 
		Set pattern that is used
		for string validation
	*/
	_ob.pattern = function(regex) {
		validator.updateSpec({pattern: regex});
		return _ob;
	};
	/* 
		Set validation function that
		filters all values
	*/
	_ob.validate = function(fn) {
		validator.updateSpec({validate: fn});
		return _ob;
	};
	/*
		Set validation flag to be updated
		after each validation
		ex trigger result:
		    flag(validationResult);
        or
            flag = validationResult;
	*/
	_ob.flag = function(observableOrVariable) {
		validator.updateSpec({flag: observableOrVariable});
		return _ob;
	};

	return _ob;
};