/******************
 *  threeKeys.js  *
 * by paulcdejean *
 ******************
 * Here's the first non trivial level I was able to think of.
 * You can beat this without overwriting functions or any other
 * funny business so try and stay honest!
 */

function startLevel(map) {
    map.placePlayer(7, 5);

    // The basic level layout.
    for (y = 0; y <= map.getHeight(); y++) {
        map.placeObject(16, y, 'block');
        map.placeObject(32, y, 'block');
    }

    for (x = 17; x <= 31; x++) {
    	map.placeObject(x, 7, 'block');
	map.placeObject(x, 17, 'block');
    }

    map.placeObject(24, 3, 'redKey');
    map.placeObject(24, 12, 'greenKey');
    map.placeObject(24, 21, 'blueKey');

    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');

    // You might find this useful.
    map.placeObject(8, 6, 'phone');    
    
    map.placeObject(10, 6, 'teleporter');
    map.placeObject(24, 1, 'teleporter');
    
    var teleporters = map.getDynamicObjects();
    teleporters[0].setTarget(teleporters[1]);
    teleporters[1].setTarget(teleporters[0]);
    
    map.defineObject('bullet', {
        'type': 'dynamic',
        'symbol': '>',
        'color': 'green',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('right');
        }
    });    
    var count = 0;
    shoot = function()
    {
    	switch(count)
        {
        	case 0: map.placeObject(22, 1, 'bullet');
            break;
            
            case 1: map.placeObject(24, 10, 'teleporter');    
            var teleporters = map.getDynamicObjects();
            teleporters[0].setTarget(teleporters[1]);
            teleporters[1].setTarget(teleporters[0]);
            break;
            
            case 2: map.placeObject(22, 10, 'bullet');
            break;
            
            case 3: map.placeObject(24, 19, 'teleporter');  
            var teleporters = map.getDynamicObjects();
            teleporters[0].setTarget(teleporters[1]);
            teleporters[1].setTarget(teleporters[0]);
            break;
            
            case 4: map.placeObject(22, 19, 'bullet');
            break;
            
            case 5: map.placeObject(45, 10, 'teleporter');  
            var teleporters = map.getDynamicObjects();
            teleporters[0].setTarget(teleporters[1]);
            teleporters[1].setTarget(teleporters[0]);
            break;   
        }
        count++;
    };
    
    map.getPlayer().setPhoneCallback(shoot);
}

function validateLevel(map) {
    // No creating exits!
    map.validateExactlyXManyObjects(1, 'exit');

    // No cheating please!
    map.validateExactlyXManyObjects(0, 'theAlgorithm');

    // You need to pick up the keys, not create them.
    map.validateAtMostXObjects(1, 'redKey');
    map.validateAtMostXObjects(1, 'greenKey');
    map.validateAtMostXObjects(1, 'blueKey');

    // This is the puzzle :)
    map.validateAtMostXDynamicObjects(3);
}


function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')
        || !map.getPlayer().hasItem('greenKey')
        || !map.getPlayer().hasItem('blueKey')) {
        map.writeStatus("Collect all 3 keys before exiting!");
        return false;
    } else {
        return true;
    }
}
