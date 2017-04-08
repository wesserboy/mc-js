var gl;

var initWebGL = function(canvas){
	var myGL = null;
	myGL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if(!myGL){
		console.log("Failed to load WEB_GL");
        return null;
	}

	// set canvas to be fullscreen
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	myGL.viewportWidth = canvas.width;
    myGL.viewportHeight = canvas.height;

	return myGL;
}


var getShader = function(gl, id){
	var shaderScript = document.getElementById(id); // Get the shader script form the document
    if (!shaderScript) {
        return null;
    }

    // loop over all child-nodes of the script node. If it is a textnode (nodeType == 3), add the content to the str. As a result the str variable will contain the shader script from the node. 
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    // create the correct shader depending on the specified type
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    // compile the shader with str being the source code
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    // if the compilation fails, log the error
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    // if all goes well, return the shader
    return shader;
};


var shaderProgram;

var initShaders = function(){
	var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexTextureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
};


var dirtTexture;
var initTexture = function(){
    dirtTexture = gl.createTexture();
    dirtTexture.image = new Image();
    dirtTexture.image.onload = function(){ // We add the handler before the src to make sure that the handler is attached before the event fires.
        handleLoadedTexture(dirtTexture);
    };
    dirtTexture.image.crossOrigin = '';
    dirtTexture.image.src = "http://localhost:8000/assets/dirt.png";
};

var handleLoadedTexture = function(texture){
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // These two lines tell gl how to scale when the drawing is larger/smaller than the src image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
};


var mvMatrix = mat4.create(); // model view matrix
var mvMatrixStack = [];
var pMatrix = mat4.create(); // projection matrix

var mvPushMatrix = function(){
	var copy = mat4.clone(mvMatrix);
	mvMatrixStack.push(copy);
};

var mvPopMatrix = function(){
	if(mvMatrixStack.length > 0){
		mvMatrix = mvMatrixStack.pop();
	}else{
		console.error("Failed to pop matrix, the stack was empty!");
	}
};

var setMatrixUniforms = function(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
};


var cubeVertexPosBuffer;
var cubeVertexNormalBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;

var initBuffers = function(){
    cubeVertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPosBuffer);

    vertices = [
        // front
    	-1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // back
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,

        // top
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // bottom
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // right
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,

        // left
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0, 
        -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPosBuffer.numItems = 24;
    cubeVertexPosBuffer.itemSize = 3;


    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);

    // The normal for a particular vertex is equal to the normal of the face it belongs to.
    var vertexNormals = [
        // front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        // right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // left
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.numItems = 24;
    cubeVertexNormalBuffer.itemSize = 3;


    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);

    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,

      // Bottom face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Right face
      1.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,
      0.0, 1.0,

      // Left face
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.numItems = 24;
    cubeVertexTextureCoordBuffer.itemSize = 2;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
};

var xRot = 0;
var xSpeed = 0;

var yRot = 0;
var ySpeed = 0;

var zCoord = -5;

var lightingEnabled = false;

var ambientR = 1.0;
var ambientG = 1.0;
var ambientB = 1.0;

var lightDirection = [0.0, 0.0, -1.0];

var directionalR = 1.0;
var directionalG = 1.0;
var directionalB = 1.0;

var blendingEnabled = false;

var drawScene = function(){
	// pass gl the size of the canvas we're going to draw onto.
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	// clear the color buffer and the depth buffer. A bitwise or is used to combine these into 1 argument.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// setup the perspective. By default this is orthographic, this call sets it up with a frustrum with: fov = 45deg, aspect-ratio = height/width, zNear = 0.1 and zFar = 100.
	mat4.perspective(pMatrix, 45/180*Math.PI, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	// This function call sets the model view matrix to the identity matrix. (It basically sets up a matrix at the origin from where we can start applying transformations)
	mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [0, 0, zCoord]);

    mvPushMatrix();
    mat4.rotate(mvMatrix, mvMatrix, xRot, [1, 0, 0]);
    mat4.rotate(mvMatrix, mvMatrix, yRot, [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexTextureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if(blendingEnabled){
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
    }else{
        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    }

    gl.uniform1i(shaderProgram.useLightingUniform, lightingEnabled);
    if(lightingEnabled){
        gl.uniform3f(shaderProgram.ambientColorUniform, ambientR, ambientG, ambientB);

        var adjustedLD = vec3.create();
        vec3.normalize(adjustedLD, lightDirection);
        vec3.scale(adjustedLD, adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

        gl.uniform3f(shaderProgram.directionalColorUniform, directionalR, directionalG, directionalB);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dirtTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();
};

var handleKeys = function(){
    if(pressedKeys[187]){ // +_key
        zCoord += 0.05;
    }
    if(pressedKeys[189]){ //-_key
        zCoord -= 0.05;
    }

    if(pressedKeys[38]){ //arrow up
        xSpeed -= 1/180*Math.PI;
    }
    if(pressedKeys[40]){ //arrow down
        xSpeed += 1/180*Math.PI;
    }

    if(pressedKeys[37]){ // arrow left
        ySpeed -= 1/180*Math.PI;
    }

    if(pressedKeys[39]){ // arrow right
        ySpeed += 1/180*Math.PI;
    }
};

var lastTime = 0;
var animate = function(){
	var now = Date.now();

	if(lastTime != 0){
		var elapsed = (now - lastTime) / 1000; // time elapsed in seconds

		xRot += xSpeed * Math.PI * elapsed;
        yRot += ySpeed * Math.PI * elapsed;
	}

	lastTime = now;
};

var tick = function(){
	window.requestAnimFrame(tick); // requestAnimFrame is a browser-independent function provided by google's webgl-utils
    handleKeys();
	drawScene();
	animate();
};

