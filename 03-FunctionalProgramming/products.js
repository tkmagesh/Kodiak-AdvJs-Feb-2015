var products = [
	{id : 6, name : "Pen", cost : 50, units : 70, category : 1},
	{id : 9, name : "Hen", cost : 60, units : 50, category : 2},
	{id : 3, name : "Ten", cost : 40, units : 90, category : 3},
	{id : 5, name : "Den", cost : 70, units : 40, category : 3},
	{id : 2, name : "Len", cost : 80, units : 20, category : 1},
	{id : 4, name : "Zen", cost : 30, units : 60, category : 2}
]
function displayGroup(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}

displayGroup("Default Products List", function(){
	console.table(products);
});

displayGroup("Sorting", function(){
	displayGroup("Default [products by id]", function(){
		function sort(){
			for(var i=0;i<products.length-1;i++)
				for(var j=i+1;j<products.length;j++){
					var left = products[i],
						right = products[j];
					if (left.id > right.id){
						products[i] = products[j];
						products[j] = left;
					}
				}
		}
		sort();
		console.table(products);	
	});
	displayGroup("Any List [by any attribute]", function(){
		function sort(list, attrName){
			for(var i=0;i<list.length-1;i++)
				for(var j=i+1;j<list.length;j++){
					var left = list[i],
						right = list[j];
					if (left[attrName] > right[attrName]){
						list[i] = list[j];
						list[j] = left;
					}
				}
		}
		displayGroup("By cost", function(){
			sort(products, "cost");
			console.table(products);
		});
		displayGroup("By units", function(){
			sort(products, "units");
			console.table(products);
		});
		displayGroup("By value", function(){
			function sort(list, comparerFn){
				for(var i=0;i<list.length-1;i++)
					for(var j=i+1;j<list.length;j++){
						var left = list[i],
							right = list[j];
						if (comparerFn(left, right) > 0){
							list[i] = list[j];
							list[j] = left;
						}
					}
			}
			var productComparerByValue = function(left,right){
				var leftValue = left.cost * left.units,
					rightValue = right.cost * right.units;
				if (leftValue < rightValue) return -1;
				if (leftValue > rightValue) return 1;
				return 0;
			}
			sort(products, productComparerByValue);
			console.table(products);
		})
			
	})
	
});

displayGroup("Filter", function(){
	function filter(list, predicate){
		var result = [];
		for(var i=0;i<list.length;i++)
			if (predicate(list[i]))
				result.push(list[i]);
		return result;
	}
	displayGroup("Costly products [cost > 50]", function(){
		var costlyProductPredicate = function(product) { return product.cost > 50 ;};
		var allCostlyProducts = filter(products,costlyProductPredicate);
		console.table(allCostlyProducts);
	});
	var inversePredicate = function(predicateFn){
		return function(){
			return !predicateFn.apply(this,arguments);
		}
	}
	displayGroup("Affordable products [cost <= 50]", function(){
		var costlyProductPredicate = function(product) { return product.cost > 50 ;};
		//var affordableProductPredicate = function(product) { return product.cost <= 50 ;};
		var affordableProductPredicate = inversePredicate(costlyProductPredicate);
		var allAffordableProducts = filter(products,affordableProductPredicate);
		console.table(allAffordableProducts);
	});
});

displayGroup("All", function(){
	function all(list, predicate){
		for(var i=0;i<list.length;i++)
			if (!predicate(list[i])) return false;
		return true;
	}
	var costlyProductPredicate = function(product) { return product.cost > 50 ;};
	console.log("Are all the products costly products?", all(products,costlyProductPredicate));
});

displayGroup("Any", function(){
	function any(list, predicate){
		for(var i=0;i<list.length;i++)
			if (predicate(list[i])) return true;
		return false;
	}
	var costlyProductPredicate = function(product) { return product.cost > 50 ;};
	console.log("Is there atleast only costly product?", any(products,costlyProductPredicate));
});

displayGroup("GroupBy", function(){
	function groupBy(list, keySelectorFn){
		var result = {};
		for(var i=0;i<list.length;i++){
			var item = list[i],
				key = keySelectorFn(item);
			/*if (typeof result[key] === "undefined")
				result[key] = [];*/
			result[key] = result[key] || [];
			result[key].push(item);
		}
		return result;
	};

	displayGroup("Products by categories", function(){
		var  categoryKeySelector = function(product){return product.category};
		var productsByCategory = groupBy(products, categoryKeySelector);
		for(var key in productsByCategory){
			displayGroup("Key -" + key, function(){
				console.table(productsByCategory[key]);
			});
		}
	})
	displayGroup("Products by cost", function(){
		var  costKeySelector = function(product){return product.cost <= 50 ? "affordable" : "costly"};
		var productsByCost = groupBy(products, costKeySelector);
		for(var key in productsByCost){
			displayGroup("Key -" + key, function(){
				console.table(productsByCost[key]);
			});
		}
	})
});

function memoize(fn, keySelectorFn){
	var cache = {};
	return function(){
		var key = keySelectorFn.apply(this, arguments);
		if (typeof cache[key] === "undefined")
			cache[key] = fn.apply(this, arguments);
		return cache[key];
	}
}

function after(fn, count){
	var times = 0;
	return function(){
		++times;
		if (times > count)
			fn.apply(this,arguments);
	}
}