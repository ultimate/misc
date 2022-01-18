/*******************
 * 102_noWayOut.js *
 * by AGoliath     *
 *******************
 *
 *  Who builds a wall in a room anyway?
 *
 */

function startLevel(map) {
    map.displayChapter('Challenge 2\nTear down this wall!');

    map.placePlayer(7, 5);

    var buildWall = function() {
        for (var i= 0; i <= map.getHeight(); i++)  map.placeObject(map.getWidth()-10, i, 'block');
    }

	  map.placeObject(8,5,'teleporter');
    map.placeObject(map.getWidth()-7, map.getHeight()-6, 'teleporter');
    
    var teleporters = map.getDynamicObjects();
    teleporters[0].setTarget(teleporters[1]);
    teleporters[1].setTarget(teleporters[0]);

        buildWall();
        map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');
}

function onExit(map) {
           return true;
}


function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
