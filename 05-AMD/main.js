require(['SalaryCalculator','SalaryCalculatorView','jquery']
				, function(SalaryCalculator, SalaryCalculatorView, $){
	$(function(){
		var calculator = new SalaryCalculator();
		var view= new SalaryCalculatorView(calculator);
		view.init();
	});
});