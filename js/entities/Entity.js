var Entity = function(world, thePos){
	this.world = world;
	this.pos = thePos || vec3.create();

	this.vel = vec3.create();
	this.acc = vec3.create();
	this.resultant = vec3.create();

	this.yawBody = 0;
	this.yawHead = 0;
	this.pitchHead = 0;

	this.eyeHeight = 0;
};

// Called from the tick method, approx. 60x per second.
Entity.prototype.update = function(){
	if(this.mass){ // for explanation of the calculation see http://buildnewgames.com/gamephysics/#calculating-velocity-and-position
		this.lastAcc = this.acc;

		var temp = vec3.scale(vec3.create(), this.lastAcc, 0.5 * Math.pow(1/60, 2));
		vec3.scaleAndAdd(this.pos, this.pos, this.vel, 1/60);
		vec3.add(this.pos, this.pos, temp);

		vec3.scale(this.acc, this.resultant, 1/this.mass);

		var avgAcc = vec3.scale(vec3.create(), vec3.add(vec3.create(), this.lastAcc, this.acc), 0.5);
		vec3.scaleAndAdd(this.vel, this.vel, avgAcc, 1/60);
	}
};

Entity.prototype.applyForce = function(force){
	if(this.mass){ //things that don't have mass don't move.
		vec3.add(this.resultant, this.resultant, force);
	}
}

Entity.prototype.setupCamera = function(){
	// Because we use the same object for the camera's position and the entities position we don't have to update them separately.
	this.camera = new Camera(this.pos, this.yawBody + this.yawHead, this.pitchHead, vec3.fromValues(0.0, this.eyeHeight, 0.0));
};

Entity.prototype.setEntityRotation = function(yaw){
	this.yawBody = yaw;
	if(this.camera){
		this.camera.yaw = this.yawBody + this.yawHead;
	}
};

Entity.prototype.setHeadRotation = function(yaw, pitch){
	this.yawHead = yaw;
	this.pitchHead = pitch;

	if(this.camera){
		this.camera.yaw = this.yawBody + this.yawHead;
		this.camera.pitch = this.pitchHead;
	}
};

Entity.prototype.getFacing = function(){
	return vec2.transformMat2d(vec2.create(), vec2.fromValues(0.0, -1.0), mat2d.fromRotation(mat2d.create(), this.yawBody + this.yawHead));
};