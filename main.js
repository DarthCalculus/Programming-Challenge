/*
$("p").on('click', function(e){
	$(this).hide();
});
*/
var cells = [];
var numCells = 9;
var pointer;
var stack = [];
var runtime = 0;

function resetCells() {
	pointer = Math.floor(numCells/2);
	for(i = 0; i<numCells; i++) {
		cells[i] = 0;
	}
}
function displayCells() {
	for(i = 0; i<numCells; i++) {
		$("#cell"+i).text(cells[i]);
		$("td").removeClass("selected");
		$("#cell"+pointer).addClass("selected");
	}
}

function length(input) {
	var res = 0;
	for (i = 0; i < input.length; i++) {
		if (input.charAt(i) == '+' ||
			input.charAt(i) == '-' ||
			input.charAt(i) == '<' ||
			input.charAt(i) == '>' ||
			input.charAt(i) == '[' ||
			input.charAt(i) == ']' )

			res++;
	}
	return res;
}

function processCode(input) {
	runtime = 0;
	for (var loc = 0; loc <input.length; loc++) {
		runtime++;
		if (runtime > 1000000000) {
			$("table").after("<br>Runtime Limit Exceeded ("
				+ length(input) + " characters)");
			return;
		}
		switch(input.charAt(loc)) {
			case '+':
				cells[pointer]++;
				break;
			case '-':
				if (cells[pointer] > 0) cells[pointer]--;
				break;
			case '>':
				if (pointer < cells.length-1) pointer++;
				break;
			case '<':
				if (pointer > 0) pointer--;
				break;
			case '[':
				stack.push(loc);
				break;
			case ']':
				if (stack.length == 0) {
					$("table").after("<br>Missing a \"[\"");
					return;
				}
				var prev = stack[stack.length - 1];
				if (cells[pointer] > 0) {
					loc = prev;
				}
				else stack.pop();

				break;
		}
	}
	$("table").after("<br>You created <b>" + cells[pointer] 
		+ "</b> using a total of <b>" + length(input) + "</b> characters!");

}

$(document).ready(function(){
	for(i = 0; i<numCells; i++) {
		var html = $("<td></td>");
		html.attr("id","cell"+i)
		
		$("#row").append(html);
	}
	resetCells();
	displayCells();
	$("#clear").click(function() {
		resetCells();
		displayCells();
	});

	$("#execute").click( function() {
		resetCells();
		processCode($("#code").val());
		displayCells();
	});

});