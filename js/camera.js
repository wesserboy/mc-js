var Camera = function(){
	this.x = arguments[0] || 0.0;
	this.y = arguments[1] || 0.0;
	this.z = arguments[2] || 0.0;

	this.yaw = arguments[3] || 0;
	this.pitch = arguments[4] || 0;
};

Camera.prototype.setPosition = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z =z;
};

Camera.prototype.setYaw = function(yaw){
	this.yaw = yaw;
};

Camera.prototype.setYaw = function(pitch){
	this.pitch = pitch;
};

Camera.prototype.move = function(dx, dy, dz){
	this.x += dx;
	this.y += dy;
	this.z += dz;
};

Camera.prototype.rotateRight = function(rads){
	this.yaw += rads;
};

Camera.prototype.rotateDown = function(rads){
	this.pitch += rads;
}

Camera.prototype.applyTransformations = function(matrix){
	mat4.translate(matrix, matrix, [-this.x, -this.y, -this.z]);
	mat4.rotateX(matrix, matrix, this.pitch);
	mat4.rotateY(matrix, matrix, this.yaw);
}