/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
hslToRgb = function(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

color2String = function(color, population) {
	return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + (255 - (population + spread.COLOR_POP_OFFSET))/255 + ")";
};

random = function(min, max) { // both inclusive
	return Math.floor(Math.random()*(max+1-min)+min);
};

var spread = {};

spread.PARAM_DEFAULT = {
	neutralMinPop: 0,
	neutralMaxPop: 50,
};

spread.COLOR_POP_OFFSET = 155;

spread.COLOR_NEUTRAL = {
	r: 255,
	g: 255,
	b: 255,
};

World = function(w, h, parameters) {

	this.width = w;
	this.height = h;
	this.cells = null;
	
	this.init = function(parameters) {	
		this.cells = new Array(this.width);
		for(var x = 0; x < this.width; x++)
		{
			this.cells[x] = new Array(this.height);
			for(var y = 0; y < this.height; y++)
			{
				this.cells[x][y] = {
					player: null,
					population: random(parameters.neutralMinPop, parameters.neutralMaxPop)
				};
			}
		}
	};
	
	this.debug = function(element /*your args*/) {
		var newHTML = new Array();
		for(var x = 0; x < this.width; x++)
		{
			for(var y = 0; y < this.height; y++)
			{
				newHTML.push("<span style='");
				if(this.cells[x][y].player != null)
					newHTML.push("color: " + color2String(player.color, this.cells[x][y].population) + "; ");
				else					
					newHTML.push("color: " + color2String(spread.COLOR_NEUTRAL, this.cells[x][y].population) + "; ");				
				newHTML.push("'>");
				var s = this.cells[x][y].population.toString(16);
				if(s.length < 2)
					newHTML.push("0");				
				newHTML.push(s);
				newHTML.push("</span> ");
			}
			// TODO debug
			newHTML.push("<br>");
		}
		element.innerHTML = newHTML.join("");
	};
	
	this.draw = function(element, scale) {	

		var ctx = element.getContext("2d");		
		ctx.clearRect(0, 0, this.width*scale, this.height*scale);
		
		for(var x = 0; x < this.width; x++)
		{
			for(var y = 0; y < this.height; y++)
			{		
				if(this.cells[x][y].player != null)
					ctx.fillStyle = color2String(this.cells[x][y].player.color, this.cells[x][y].population);
				else		
					ctx.fillStyle = color2String(spread.COLOR_NEUTRAL, this.cells[x][y].population);
				ctx.fillRect(x*scale, y*scale, scale, scale);
			}
		}
	};	
	
	this.addPlayer = function(player) {
	};
	
	this.tick = function() {
	};

	this.init(parameters);	
};
