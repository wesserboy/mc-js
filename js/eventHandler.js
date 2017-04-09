var onLoad = function(){
	gl = initWebGL(document.getElementById("gl-canvas"));

	if(!gl){
		return;
	}

	window.addEventListener("resize", onResize);

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

	initShaders();
    initBuffers();
    initTexture();
    initWorld();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    tick();
};

var onResize = function(){
	var canvas = document.getElementById("gl-canvas");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var pressedKeys = {};
var onKeyDown = function(event){
	pressedKeys[event.keyCode] = true;
};

var onKeyUp = function(event){
	pressedKeys[event.keyCode] = false;
};

