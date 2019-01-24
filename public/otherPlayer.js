function OtherPlayer(x, y, z, id, playerModel) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5, diameterY: 4}, scene)
                /*playerModel.createInstance("i" + i)*/;
    this.mesh.position = new BABYLON.Vector3(x, y, z);
    this.vel = new Vector();
    this.acc = new Vector();
    this.pos = new Vector(x, y, z);
    this.id = id;
}

OtherPlayer.prototype.update = function (v) {
    this.mesh.position = v.toBabylon();
    console.log(v);
};
OtherPlayer.prototype.applyForce = function(v) {
    this.acc.add(v);
};
/*OtherPlayer.prototype.incr = function (v) {
    let desired = Vector.sub(v, this.pos);
    if (desired.magSq() !== 0) {
        desired.normalize();

        desired.mult(Vector.distsq(this.pos, v)/5);

        let steer = Vector.sub(desired, this.vel);

        this.applyForce(steer);
    }

    this.vel.add(this.acc);
    this.vel.limit(113);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.update(this.pos);
};*/