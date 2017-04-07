var gl;

var initWebGL = function(canvas){
	var myGL = null;
	myGL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if(!myGL){
		console.log("Failed to load WEB_GL");
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

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
};


var mvMatrix = mat4.create(); // model view matrix
var pMatrix = mat4.create(); // projection matrix

var setMatrixUniforms = function(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
};


var triangleVertexPosBuffer;
var triangleVertexColorBuffer;
var squareVertexPosBuffer;
var squareVertexColorBuffer;

var initBuffers = function(){
	triangleVertexPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPosBuffer);

	var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPosBuffer.numItems = 3;
    triangleVertexPosBuffer.itemSize = 3;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

    var colors = [
    	1.0, 0.0, 0.0, 1.0,
    	0.0, 1.0, 0.0, 1.0,
    	0.0, 0.0, 1.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.numItems = 3;
    triangleVertexColorBuffer.itemSize = 4;


    squareVertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPosBuffer);

    vertices = [
    	1.0, 1.0, 0.0,
    	-1.0, 1.0, 0.0,
    	1.0, -1.0, 0.0,
    	-1.0, -1.0, 0.0,

    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPosBuffer.numItems = 4;
    squareVertexPosBuffer.itemSize = 3;

    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);

    // we're gonna use the same color for every vertex of the square. As a result we can use a loop to generate the array.
    colors = [];
    for(var i = 0; i < squareVertexPosBuffer.numItems; i++){
    	colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.numItems = squareVertexPosBuffer.numItems;
    squareVertexColorBuffer.itemSize = 4;
};


var drawScene = function(){
	// pass gl the size of the canvas we're going to draw onto.
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	// clear the color buffer and the depth buffer. A bitwise or is used to combine these into 1 argument.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// setup the perspective. By default this is orthographic, this call sets it up with a frustrum with: fov = 45deg, aspect-ratio = height/width, zNear = 0.1 and zFar = 100.
	mat4.perspective(pMatrix, 45/180*Math.PI, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	// This function call sets the model view matrix to the identity matrix. (It basically sets up a matrix at the origin from where we can start applying transformations)
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]); //translates the drawing point 1.5 units to the left and 7 units into the screen (neg Z)

	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPosBuffer.numItems);


    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]); // We moved to (-1.5, 0, -7) earlier, so now we are at (1.5, 0, -7)

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPosBuffer.numItems);
};

