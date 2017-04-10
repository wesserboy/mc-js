var World = function(){
	this.player = new EntityPlayer(this, vec3.fromValues(0.5, 1.0, 0.5));

	this.blocks = [];

	this.blocks.push(this.getEntryForCoords(0, 0));
    this.blocks.push(this.getEntryForCoords(0, -2));
    this.blocks.push(this.getEntryForCoords(0, -4));
};

World.prototype.tick = function(){
	window.requestAnimFrame(this.tick.bind(this)); // requestAnimFrame is a browser-independent function provided by google's webgl-utils
    this.handleKeys();

    this.player.update();

	drawScene();
};

World.prototype.getEntryForCoords = function(x, z){ // No y yet for testing purposes.
    // convert x and z to 16-bit signed integers.
    var sign = 0b10000000000000000000000000000000; // filters the sign off of a 32-bit signed integer.
    var mask = 0b00000000000000000111111111111111; // filters the right-most 15 bits of a 32-bit signed integer.

    var xSign = x & sign;
    xSign >>>= 16;
    x = Math.abs(x);
    x &= mask;
    x |= xSign;

    var zSign = z & sign;
    zSign >>>= 16;
    z = Math.abs(z);
    z &= mask;
    z |= zSign;

    return result = (x << 16) | z;
};

World.prototype.getCoordsFromEntry = function(entry){
    var x = (entry << 1) >>> 17; // get x's value without the sign
    x = ((entry >>> 31) & 1) ? -x : x;

    var z = (entry << 17) >>> 17; // get z's value without the sign
    z = ((entry >>> 15) & 1) ? -z : z;

    return vec3.fromValues(x, 0.0, z);
};

World.prototype.handleKeys = function(){
	var facing = vec2.scale(vec2.create(), this.player.getFacing(), 300);
	var facingPerpendicular = vec2.transformMat2d(vec2.create(), facing, mat2d.fromRotation(mat2d.create(), Math.PI / 2));
    if(pressedKeys[38]){ // up arrow
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(facing[0], 0.0, facing[1]));
    }
    if(pressedKeys[40]){ // down arrow
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(-facing[0], 0.0, -facing[1]));
    }
    if(pressedKeys[37]){ // left arrow
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(-facingPerpendicular[0], 0.0, -facingPerpendicular[1]));
    }
    if(pressedKeys[39]){ // right arrow
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(facingPerpendicular[0], 0.0, facingPerpendicular[1]));
    }
    if(pressedKeys[32]){ // spacebar
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(0.0, 350.0, 0.0));
    }
    if(pressedKeys[16]){ // shift
        vec3.add(this.player.acc, this.player.acc, vec3.fromValues(0.0, -350.0, 0.0));
    }
};