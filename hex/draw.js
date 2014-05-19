
// DRAWING
function drawCircle(svg, coords,radius,fillcolor) {

	var shape = document.createElementNS('http://www.w3.org/2000/svg','circle');

	shape.setAttributeNS(null, "cx", coords[0]);
	shape.setAttributeNS(null, "cy", coords[1]);

	shape.setAttributeNS(null, "r", radius);
	shape.setAttributeNS(null, "fill", fillcolor);

	svg.appendChild(shape);
	
	return shape;

};


function drawText(svg, x, y, text, fill) {

	var textelement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	textelement.setAttribute("x", x);
	textelement.setAttribute("y", y);

	textelement.setAttribute("style","font-family:android,arial,sans;font-size:20px;fill:" + fill + ";");

	textelement.textContent = text;

	svg.appendChild(textelement);
	
	return textelement;
};

function drawPath(svg, border, fill, coords) { // [ [ x0, y0 ], [ x1, y1], ... ]

	var shape = document.createElementNS('http://www.w3.org/2000/svg','path');

	var d = '';

	for (var j = 0; j < coords.length; j++) {
		var subPath = coords[j];
		if(subPath == null)
			continue;
		d += ' M ';				  
		for (var i = 0; i < subPath.length; i++) {
			d += ' '+subPath[i][0] + ',' + subPath[i][1];
		};				  
		d += ' z ';
	};

	shape.setAttributeNS( null, "d", d );
	if(border)
	{
		shape.setAttributeNS( null, "stroke", border);
		shape.setAttributeNS( null, "stroke-width", 0.1);
	}
	if(fill)
		shape.setAttributeNS( null, "fill", fill);

	svg.appendChild(shape);
	
	return shape;
};


		
function calculatePolygon( cx, cy, n, R, rotation ) { // n - sides of polygon, R - outer Radius

	var coords = []; 

	var sideLength = 2 * R * Math.sin( Math.PI / n );
	var innerRadius = R * Math.cos( Math.PI / n );

	for (var i = 0; i < n; i++) {

		var a = ( ( ( Math.PI * 2 ) / n ) * i ) + rotation; 

		var x = cx + R * Math.cos(a);
		var y = cy + R * Math.sin(a);

		coords.push([x,y]);
	};
	
	return { coords : coords, sideLength: sideLength, innerRadius: innerRadius };	
};