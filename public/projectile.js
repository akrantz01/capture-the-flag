function Projectile(pos, vel, type) {
    this.pos = pos;
    this.vel = vel;
    this.type = type;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("proj" + Math.random(), {diameter: 1}, scene);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    /*this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 1,
        restitution: 0
    }, scene);*/
    //this.mesh.physicsImpostor.setLinearVelocity(this.vel.toBabylon());

    /*this.mesh.physicsImpostor.onCollideEvent = function (self, other) {
        var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
        decalMaterial.zOffset = -2;
        var decalSize = new BABYLON.Vector3(10, 10, 10);
        var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {position: self.object.position, normal: self.object.vel, size: decalSize}, scene);
        decal.material = decalMaterial;
        setTimeout(() => {
            self.object.dispose();
        }, 1);
        console.log("disposed");
    };*/
}

Projectile.prototype.update = function (ground, scene, players, decalList) {
    /*if (this.mesh.physicsImpostor.isDisposed) {
        return false;
    }*/
    this.pos = fromBabylon(this.mesh.position);
    this.vel.y -= 0.1;
    //this.mesh.physicsImpostor.applyForce(new BABYLON.Vector3(0, 100, 0), this.mesh.getAbsolutePosition());
    if (ground) {

        let mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);

        if (this.pos.y < mapHeight) {
            if (Math.abs(mapHeight-this.pos.y) > Math.abs(this.vel.y)) {
                this.pos.sub(this.vel.div(1.5));
                mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);
            }
            //this.pos = fromBabylon(this.mesh.position);
            this.pos.y = mapHeight+1;
            var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
            decalMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
            decalMaterial.zOffset = -2;
            var decalSize = new BABYLON.Vector3(10, 10, 10);
            var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {
                position: this.pos,
                normal: ground.getNormalAtCoordinates(this.pos.x, this.pos.z),
                size: decalSize
            }, scene);
            decal.material = decalMaterial;
            this.mesh.dispose();
            return -1;
        }
    }
    if (players) {
        for (var i = 0; i < players.length; i++) {
            let pos = players[i].mesh.position;
            if (Math.pow(this.pos.x - pos.x, 2) + Math.pow(this.pos.z - pos.z, 2) < 9 && Math.abs(this.pos.y - pos.y - 3) < 4) {
                decalList.push(new Decal(pos, (Vector.sub(fromBabylon(players[dec.id].mesh.position), fromBabylon(pos)).normalize()).toBabylon(), players[dec.id].mesh, scene));

                this.mesh.dispose();
                return i + 1;
            }
        }
    }

    this.mesh.position = (this.pos.add(this.vel)).toBabylon();
    return 0;
};