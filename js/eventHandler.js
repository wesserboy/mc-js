var onLoad = function(){
	gl = initWebGL(document.getElementById("gl-canvas"));

	if(!gl){
		return;
	}

	window.addEventListener("resize", onResize);

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

	gl.canvas.addEventListener("click", onClick);
	document.addEventListener("pointerlockchange", onPointerLockChange);

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

var hasPointer = false;
var onClick = function(event){
	var canvas = event.srcElement
	if(!hasPointer){
		canvas.requestPointerLock ? canvas.requestPointerLock() : (canvas.webkitRequestPointerLock ? canvas.webkitRequestPointerLock() : (canvas.mozRequestPointerLock ? canvas.requestPointerLock() : console.error("Pointer lock api is not supported in this browser.")));
	}
};

var onPointerLockChange = function(){
	if(document.pointerLockElement === gl.canvas){
		hasPointer = true;
		document.addEventListener("mousemove", onMouseMove);
	}else{
		hasPointer = false;
		document.removeEventListener("mousemove", onMouseMove);
	}
};

var onMouseMove = function(event){
	if(hasPointer){
		var movX = event.movementX;
		var movY = event.movementY;

		camera.rotateRight(movX * 0.01);
		camera.rotateDown(movY * 0.01);
	}
};