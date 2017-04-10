var EntityPlayer = function(world, pos){
	Entity.call(this, world, pos);

	this.eyeHeight = 1.8;
	this.setupCamera();

	this.mass = 70;
};

EntityPlayer.prototype = Object.create(Entity.prototype);
EntityPlayer.prototype.constructor = EntityPlayer;