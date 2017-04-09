var onLoad = function(){
	gl = initWebGL(document.getElementById("gl-canvas"));

	window.addEventListener("resize", onResize);

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

	if(!gl){
		return;
	}

	initShaders();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
};

var onResize = function(){
	var canvas = document.getElementById("gl-canvas");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
};

var pressedKeys = {};
var onKeyDown = function(event){
	pressedKeys[event.keyCode] = true;

	if(event.keyCode == 76){ // L
		lightingEnabled = !lightingEnabled;
	}
	if(event.keyCode == 66){ // B
		blendingEnabled = !blendingEnabled;
	}
};

var onKeyUp = function(event){
	pressedKeys[event.keyCode] = false;
};
