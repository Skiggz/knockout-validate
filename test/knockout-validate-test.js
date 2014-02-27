module("Validation");

test("Should identify that we included knockout and it works", function() {
	var cats = ko.observable(0);
	cats(5);
	strictEqual(cats(), 5, "Cats should be set to 5 via observable");
});