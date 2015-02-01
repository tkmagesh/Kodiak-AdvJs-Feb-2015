function SalaryCalculatorView(calculator){
	this.init = function(){
		$("#btnCalculate").click(function(){
			calculator.basic = parseInt($("#txtBasic").val());
			calculator.hra = parseInt($("#txtHra").val());
			calculator.da = parseInt($("#txtDa").val());
			calculator.tax = parseInt($("#rangeTax").val());

			calculator.calculate();

			$("#divResult").html(calculator.salary);
		});
		$("#rangeTax").change(function(){
			$("#spanTax").html(this.value + '%');
		});
	}
}