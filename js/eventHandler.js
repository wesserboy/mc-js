var onLoad = function(){
	gl = initWebGL(document.getElementById("gl-canvas"));

	if(!gl){
		return;
	}

	initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    drawScene();
};

