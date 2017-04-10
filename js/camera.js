var Camera = function(pos, yaw, pitch, offset){
	this.pos = pos || vec3.create();

	this.yaw = yaw || 0.0;
	this.pitch = pitch || 0.0;

	this.offset = offset || vec3.create;
};

Camera.prototype.setPosition = function(pos) {
	this.pos = pos;
};

Camera.prototype.setYaw = function(yaw){
	this.yaw = yaw;
};

Camera.prototype.setYaw = function(pitch){
	this.pitch = pitch;
};

Camera.prototype.move = function(dx, dy, dz){
	var movement = vec3.fromValues(dx, dy, dz);
	vec3.add(this.pos, this.movement);
};

Camera.prototype.rotateRight = function(rads){
	this.yaw += rads;
};

Camera.prototype.rotateDown = function(rads){
	this.pitch += rads;
}

Camera.prototype.applyTransformations = function(matrix){
	mat4.rotateX(matrix, matrix, this.pitch);
	mat4.rotateY(matrix, matrix, this.yaw);

	mat4.translate(matrix, matrix, vec3.scale(vec3.create(), vec3.add(vec3.create(), this.pos, this.offset), -1.0));
}