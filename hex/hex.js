var hex = {};

hex.SECTOR_EMPTY = 0;
hex.SECTOR_CORNER = 1;
hex.SECTOR_PATH = 2;

hex.TOLERANCE = 1e-3;

hex.MODE_DEFAULT = {
	lMin: 10,
	lMax: 10,
	expansion: 16,
	expansionRandomization: true,
	border: 2
};

hex.MODE_DENSE = {
	lMin: 9,
	lMax: 10,
	expansion: 6,
	expansionRandomization: true,
	border: 0
};

// utilities
/*
Point = function(x,y) {
	this.x = x;
	this.y = y;
};
*/

random = function(min, max) { // both inclusive
	return Math.floor(Math.random()*(max+1-min)+min);
};

getRealCoords = function(xIndex, yIndex) {
	var x = xIndex * Math.cos( Math.PI / 6 );
	var y = yIndex;
	if(xIndex % 2 == 1)
		y += 0.5;
	return [x, y];
};

getCorners = function(realCoords) {
	var coords = []; 
	var n = 6;
	var R = 0.5 / Math.cos(Math.PI / n);
	for (var i = 0; i < n; i++) {
		var a = 2 * Math.PI / n * i + Math.PI / n; 
		var x = realCoords[0] - R * Math.sin(a);
		var y = realCoords[1] - R * Math.cos(a);
		coords.push([x,y]);
	}
	return coords;
};

if(!Array.prototype.indexOf)
{
	// Find the index of an element
	Array.prototype.indexOf = function(what)
	{ 
		for(var i=0; i<this.length;i++)
		{
			if(this[i] == what) return i;
		}
		return -1;
	};
}

if(!Array.prototype.equals)
{
	// Find the index of an element
	Array.prototype.equals = function(other)
	{ 
		if(this.length != other.length)
			return false;
		for(var i=0; i<this.length;i++)
		{
			if(this[i] != other[i])
				return false;
		}
		return true;
	};
}

// types

Sector = function(x, y) {
	this.x = x;
	this.y = y;
	this.neighbors = new Array(6); // 0 = top + ccw direction
	
	this.coords = getRealCoords(x,y);
	this.corners = getCorners(this.coords);
	
	this.clear = function() {
		this.territory = null;
		this.type = hex.SECTOR_EMPTY;
		this.previous = null;
		this.direction = null;
		this.tries = 0;
	};
	
	this.clear();
};

Territory = function(id, color) {
	this.id = id;
	this.sectors = new Array();
	this.neighbors = new Array();
	this.color = color;
	
	this.outline = null;
	this.inlines = new Array();
	
	this.calculateOutline = function() {		
		for(var s = 0; s < this.sectors.length; s++)
		{
			var startSector = this.sectors[s];
			
			for(var startDir = 0; startDir < 6; startDir++)
			{
				var dir = startDir;
				
				var line = new Array();
				var current = startSector;
				while(current.neighbors[dir] != null && current.neighbors[dir].territory == this)
					current = current.neighbors[dir];
				
				//console.log("pushing corner " + ((dir+5)%6) + " @ " + current.corners[(dir+5)%6][0] + " " + current.corners[(dir+5)%6][1]);
				line.push(current.corners[(dir+5)%6]);
				
				var cancel = false;
				var count = 1000;
				var d;
				var diffX, diffY;
				var otherTerritoryFound = false;
				while(!cancel && count > 0)
				{
					for(d = dir; d < dir+6 && count > 0; d++)
					{
						//console.log((d%6) + " - " + (current.neighbors[d%6] == null || current.neighbors[d%6].territory == null ? "null" : current.neighbors[d%6].id));
						if(current.neighbors[d%6] == null || current.neighbors[d%6].territory != this)
						{
							if(current.neighbors[d%6] != null && current.neighbors[d%6].territory != null)
								otherTerritoryFound = true;
							diffX = Math.abs(line[0][0] - current.corners[d%6][0]);
							diffY = Math.abs(line[0][1] - current.corners[d%6][1]);
							if(diffX < hex.TOLERANCE && diffY < hex.TOLERANCE)
							{
								//console.log("start detected");
								cancel = true;
								break;
							}
							//console.log("pushing corner " + d%6 + " @ " + current.corners[d%6][0] + " " + current.corners[d%6][1]);
							line.push(current.corners[d%6]);
							count--;
						}
						else
						{
							//console.log("break with d=" + (d%6));
							break;
						}
					}
					current = current.neighbors[d%6];
					dir = (d+4)%6;
				}	
				if(count == 0)
					console.log(this.id + " "  + this.color);
				
				
				//console.log("otherTerritoryFound ? " + otherTerritoryFound);
				if(otherTerritoryFound && this.outline == null)
				{
					//console.log(this.id + " outline found");
					this.outline = line;
				}
				else if(!otherTerritoryFound)
				{
					//console.log(this.id + " inline found");
					// check for duplicate inline
					var duplicateFound = false;
					var diffX, diffY;
					for(var i = 0; i < this.inlines.length; i++)
					{
						for(var i2 = 0; i2 < this.inlines[i].length; i2++)
						{
							// look for one point of this line in the other inlines							
							diffX = Math.abs(line[0][0] - this.inlines[i][i2][0]);
							diffY = Math.abs(line[0][1] - this.inlines[i][i2][1]);
							if(diffX < hex.TOLERANCE && diffY < hex.TOLERANCE)
								duplicateFound = true;
						}
						if(duplicateFound)
							break;
					}
					//console.log("inline duplicate");
					if(!duplicateFound)
						this.inlines.push(line);
				}
			}
		}
	};
	
	this.draw = function(element) {
	
		var lines = new Array();
		lines[0] = this.outline;
		for(var i = 0; i < this.inlines.length; i++)
			lines[lines.length] = this.inlines[i];
		drawPath(element, "#FFFFFF", this.color, lines);
		
		/*
		for(var s = 0; s < this.sectors.length; s++)
		{	
			drawCircle(element, this.sectors[s].coords, 0.1, "#FFFFFF");
			
			for(var c = 0; c < this.sectors[s].corners.length; c++)
				drawCircle(element, this.sectors[s].corners[c], 0.1, "#FF0000");
			drawCircle(element, this.sectors[s].corners[0], 0.1, "#00FF00");
			drawCircle(element, this.sectors[s].corners[1], 0.1, "#00FFFF");
		}
		*/
	};
};

// grid type with logic

Grid = function(w, h, mode) {

	this.width = w;
	this.height = h;
	
	this.sectors = new Array(w);
	this.territories = new Array();
	
	this.expansion = hex.SECTOR_PATH;
	
	this.init = function() {	
		// create all sectors
		for(var x = 0; x < w; x++)
		{
			this.sectors[x] = new Array(h);
			for(var y = 0; y < h; y++)
			{
				// create sector
				this.sectors[x][y] = new Sector(x,y);
				// link sector
				if(y > 0)
				{
					this.sectors[x][y].neighbors[0] = this.sectors[x][y-1]; // top neighbor
					this.sectors[x][y-1].neighbors[3] = this.sectors[x][y]; // reverse link
				}	
				if(x % 2 == 1) // uneven columns
				{
					this.sectors[x][y].neighbors[1] = this.sectors[x-1][y]; // left top neighbor
					this.sectors[x-1][y].neighbors[4] = this.sectors[x][y]; // reverse link
					
					if(y < h-1) // not for last row
					{
						this.sectors[x][y].neighbors[2] = this.sectors[x-1][y+1]; // left bottom neighbor
						this.sectors[x-1][y+1].neighbors[5] = this.sectors[x][y]; // reverse link
					}
				}
				else if(x > 0)
				{
					if(y > 0)
					{
						this.sectors[x][y].neighbors[1] = this.sectors[x-1][y-1]; // left top neighbor
						this.sectors[x-1][y-1].neighbors[4] = this.sectors[x][y]; // reverse link
					}
					
					this.sectors[x][y].neighbors[2] = this.sectors[x-1][y]; // left bottom neighbor
					this.sectors[x-1][y].neighbors[5] = this.sectors[x][y]; // reverse link
				}
			}
		}
	};
	
	this.clear = function() {
		for(var x = 0; x < w; x++)
		{
			for(var y = 0; y < h; y++)
			{
				this.sectors[x][y].clear();
			}
		}
	};
	
	this.debug = function(element /*your args*/) {
		var newHTML = new Array();
		for(var y = 0; y < h; y++)
		{
			for(var x = 0; x < w; x++)
			{
				newHTML.push("<span style='");
				if(this.sectors[x][y].territory != null)
					newHTML.push("color: " + this.sectors[x][y].territory.color + "; ");
				if(x % 2 == 1)
					newHTML.push("position: relative; top: 0.5em; ");
				
				newHTML.push("'>");
				newHTML.push(this.sectors[x][y].type.toString(36));
				newHTML.push("</span>");
			}
			// TODO debug
			newHTML.push("<br>");
		}
		element.innerHTML = newHTML.join("");
	};
	
	this.draw = function(element) {
		var frag = document.createDocumentFragment();
		
		for(var t = 0; t < this.territories.length; t++)
		{
			this.territories[t].draw(frag);
		}
		
		element.appendChild(frag);
	};
	
	this.createTerritory = function(sector) {
		// for debug
		var color;
		switch(this.territories.length % 7)
		{
			case 0: color = "#FF0000"; break;
			case 1: color = "#00FF00"; break;
			case 2: color = "#0000FF"; break;
			case 3: color = "#FFFF00"; break;
			case 4: color = "#FF00FF"; break;
			case 5: color = "#00FFFF"; break;
			case 6: color = "#FF8000"; break;
			case 7: color = "#00FF80"; break;
			case 8: color = "#8000FF"; break;
			case 9: color = "#FF0080"; break;
			case 10: color = "#80FF00"; break;
			case 11: color = "#0080FF"; break;
			case 13: color = "#FF8080"; break;
			case 14: color = "#80FF80"; break;
			case 15: color = "#8080FF"; break;
			case 16: color = "#FFFF80"; break;
			case 17: color = "#FF80FF"; break;
			case 18: color = "#80FFFF"; break;
			case 19: color = "#800000"; break;
			case 20: color = "#008000"; break;
			case 21: color = "#000080"; break;
			case 22: color = "#808000"; break;
			case 23: color = "#800080"; break;
			case 24: color = "#008080"; break;
			case 25: color = "#808000"; break;
			case 26: color = "#008080"; break;
			case 27: color = "#800080"; break;
			case 28: color = "#808080"; break;
		}
		
		t = new Territory(this.territories.length, color);
		t.sectors[0] = sector;
		sector.territory = t;
							
		this.territories[this.territories.length] = t;
	};
	
	this.expandTerritories = function() {		
		var added = true;
		while(added)
		{
			added = false;
			for(var ti = 0; ti < this.territories.length; ti++)
			{
				var t = this.territories[ti];
				// store length, since array will grow during for-loop
				// and we don't want initially to add all neighbors of neighbors and so on...
				var l = t.sectors.length; 
				// add the neighbors of current territory sectors to the territory
				// (if not belonging to another territory)
				for(var si = 0; si < l; si++)
				{
					var s = t.sectors[si];
					for(var ni = 0; ni < s.neighbors.length; ni++)
					{
						// the potential new sector for the territory
						var n = s.neighbors[ni];
						if(n != null && n.type != hex.SECTOR_EMPTY && n.territory == null && t.sectors.indexOf(n) == -1)
						{
							// add that sector
							t.sectors[t.sectors.length] = n;
							n.territory = t;
							
							// scan the new sectors neighbors for territories
							// in order to link neighbored territories
							for(var n2 = 0; n2 < n.neighbors.length; n2++)
							{
								if(n.neighbors[n2] != null)
								{
									var t2 = n.neighbors[n2].territory;
									if(t2 != null && t2 != t && t.neighbors.indexOf(t2) == -1)
									{
										t.neighbors[t.neighbors.length] = t2;
										t2.neighbors[t2.neighbors.length] = t;
									}
								}
							}
							
							added = true;
						}
					}
				}
			}
		}
		
		//this.territories[0].sectors[0].neighbors[0].territory = null;
		
		for(var t = 0; t < this.territories.length; t++)
		{
			this.territories[t].calculateOutline();
		}
	};
	
	this.populate = function(mode) {
		// create the path	
		var current = this.sectors[Math.round((w-1)/2)][Math.round((h-1)/2)];
		//var current = this.sectors[random(0,w-1)][random(0,h-1)];
		current.type = hex.SECTOR_CORNER;
		this.createTerritory(current);
		
		var next;
		var dir;
		var len;
		var corners = 1;
		var maxCorners = (w*h / 1000) *40 - 10;
		
		while(corners < maxCorners)
		{
			while(current != null && current.tries >= 6) // we have tried all directions
			{
				current = current.previous; // let's make a new branch from the previous node
			}
			if(current == null)
			{
				// we have been going all back to the start (and have not found a possible alternative branch)
				break;
			}
						
			// get the direction
			dir = current.direction; // get the last direction tried from the current sector
			if(dir == null) // we have not tried any direction
				dir = random(0,5); // choose a random dir
			else
				dir = (dir+1)%6; // take next direction (ccw)
			current.tries++; // we now have one try more
				
			// get the length
			len = random(mode.lMin, mode.lMax);
			
			var l;
							
			while(len >= mode.lMin)
			{
				//console.log(current.x + "|" + current.y + " -> " + dir + " x " + len);
				
				l = 0;
				// scan path for intersections and out of area
				next = current;
				for(; l < len; l++) 
				{
					next = next.neighbors[dir]; // go to the neighbor in that direction
					if(next == null) // out of area
						break;
					if(next.x < mode.border || next.x >= w-mode.border)	// out of area with border
						break;
					if(next.y < mode.border || next.y >= h-mode.border)	// out of area with border
						break;
					if(next.type != hex.SECTOR_EMPTY) // sector already occupied (not empty)
						break;
				}
				
				if(l < len) // scan not passed
				{
					len--; // reduce length and try again
					continue;
				}
					
				//console.log("scan passed!");
				break;
			}
			
			if(len < mode.lMin) // we underrun the shortest step size
				continue; // with same corner (and new direction)
			
			// apply path
			next = current;
			for(; l > 0; l--)
			{
				next = next.neighbors[dir];
				next.type = hex.SECTOR_PATH;
			}
			
			// make the last point a corner
			next.type = hex.SECTOR_CORNER;
			next.previous = current;
			
			// continue with the new corner
			current = next;
			this.createTerritory(current);
			corners++;
		}
	}
	
	this.expand = function(mode) {
		while(this.expansion < mode.expansion)
		{
			this.expansion++;
			for(var x = 0; x < w; x++)
			{
				for(var y = 0; y < h; y++)
				{
					if(this.sectors[x][y].type != hex.SECTOR_EMPTY)
						continue;
					for(var n = 0; n < 6; n++)
					{
						if(this.sectors[x][y].neighbors[n] != null && this.sectors[x][y].neighbors[n].type != hex.SECTOR_EMPTY && this.sectors[x][y].neighbors[n].type < this.expansion)
							//&& (this.sectors[x][y].neighbors[n].type > this.expansion-2 || this.sectors[x][y].neighbors[n].type < 3))
						{
							if(!mode.expansionRandomization || random(0,this.expansion+1) > this.expansion)
								this.sectors[x][y].type = this.expansion;
						}
					}
				}
			}
		}
	};
	
	if(mode == null)
		mode = hex.MODE_MAP;
		
	this.init();
	this.populate(mode);
	this.expand(mode);
	this.expandTerritories();
};