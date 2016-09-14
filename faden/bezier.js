var Bezier = function(args) {
	
	var type;
	var x0, x1, x2, x3;
	var y0, y1, y2, y3;
	
	if(arguments.length == 1)
		arguments = args;
	
	switch(arguments.length)
	{
		case 8: 
			x3 = arguments[6];
			y3 = arguments[7];
		case 6:
			x2 = arguments[4];
			y2 = arguments[5];
		case 4:
			x1 = arguments[2];
			y1 = arguments[3];
			x0 = arguments[0];
			y0 = arguments[1];
			break;
		default:
			throw new Error("illegal number of args: " + arguments.length);
	}
	
	type = (arguments.length-2) / 2;
	
	this.point = function(t)
	{
		if(t < 0 || t > 1)
			throw new Error("t out of range [0;1]");
		
		var p = [];
		switch(type)
		{
			case 1:
				p[0] = (1-t)*x0 + t*x1;
				p[1] = (1-t)*y0 + t*y1;
				break;
			case 2:
				p[0] = (1-t)*(1-t)*x0 + 2*(1-t)*t*x1 + t*t*x2;
				p[1] = (1-t)*(1-t)*y0 + 2*(1-t)*t*y1 + t*t*y2;
				break;
			case 3:
				p[0] = (1-t)*(1-t)*(1-t)*x0 + 3*(1-t)*(1-t)*t*x1 + 3*(1-t)*t*t*x2 + t*t*t*x3;
				p[1] = (1-t)*(1-t)*(1-t)*y0 + 3*(1-t)*(1-t)*t*y1 + 3*(1-t)*t*t*y2 + t*t*t*y3; 
				break;
			default:			
				p[0] = 0; 
				p[1] = 0;
		}
		return p;
	}
};
