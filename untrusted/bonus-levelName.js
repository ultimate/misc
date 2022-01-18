/*******************
 * <level name>.js *
 *    by mdejean   *
 *******************
 */

function startLevel(map) {
    map.defineObject('door', {
      'symbol': '-', 'color': '#0f0',
      'impassable': function(player) {
        if (player.getColor() == this.color) {
          player.setColor('red');
          return false;
        }
        return true;
      }
    });
    map.createFromGrid(
       ['+++++++++++++++',
        '+        +    +',
        '+          ++ +',
        '+      @  ++x +',
        '+         ++x++',
        '+         ++E++',
        '+++++++++++++++'],
    {
        '@': 'player',
        'E': 'exit',
        '+': 'block',
        'x': 'door',
    }, 17, 6);
  
	map.overrideKey('left', function() {
    	map.getPlayer().setColor('#0f0');
        map.getPlayer().move('left');
    });

}

function validateLevel(map) {
    map.validateExactlyXManyObjects(0, 'phone');
    map.validateExactlyXManyObjects(0, 'theAlgorithm');
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateNoTimers();
    map.validateAtMostXDynamicObjects(0);
}
