/**
 * New node file
 */

nodefony.mocha = {};
nodefony.register.call(nodefony.mocha, "libTest", function(){
	
	return {
		
		decToBin: function decbin (number) {
			if (number < 0) {
				number = 0xFFFFFFFF + number + 1;
			}
			return parseInt(number, 10).toString(2);
		},
		
		binToDec: function bindec (binary_string) {
			binary_string = (binary_string + '').replace(/[^01]/gi, '');
			return parseInt(binary_string, 2);
		}
		
	};
	
});
