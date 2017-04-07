var onLoad = function(){
	gl = initWebGL(document.getElementById("gl-canvas"));

	window.addEventListener("resize", onResize);

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

