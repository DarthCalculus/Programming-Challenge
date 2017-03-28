/*
$("p").on('click', function(e){
	$(this).hide();
});
*/
var cells = [];
var numCells = 9;
var pointer;

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
	var print = (...a) => { $('#output').prepend('<br>' + a.join('')); }
	var runtime = 0;
	var stack = [];
	var inComment = false;
	var numPrinted = 0;
	var printIfOutputIgnored = () => { if (numPrinted > 100) {
		print(numPrinted, " lines of output not shown"); }}
	for (var loc = 0; loc <input.length; loc++) {
		runtime++;
		if (runtime > 10000000) {
			printIfOutputIgnored();
			print("Runtime Limit Exceeded (", runtime, " steps)");
			return;
		}
		var c = input.charAt(loc);
		if (inComment) {
			if (c == '\n') {
				inComment = false;
			}
			continue;
		}
		switch (c) {
			case '#':
				inComment = true;
				break;
			case '.':
				numPrinted++;
				if (numPrinted <= 100) {
					print("Output (cell ", pointer, "): ", cells[pointer]);
				}
				break;
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
					printIfOutputIgnored();
					print("Missing a \"[\"");
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
	printIfOutputIgnored();
	print("You created <b>", cells[pointer],
		  "</b> using a total of <b>", length(input), "</b> characters!");

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
		$('#output').html('');
	});

	$("#execute").click( function() {
		resetCells();
		processCode($("#code").val());
		displayCells();
	});

	code.addEventListener('input', (ev) => {
		$('#chars').html(code.value.length);
	});
});
