function Projectile(pos, vel, team) {
    this.pos = (pos instanceof BABYLON.Vector3) ? fromBabylon(pos) : pos;
    this.vel = (vel instanceof BABYLON.Vector3) ? fromBabylon(vel) : vel;
    this.team = team;
    this.created = false;
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
    this.ray = new BABYLON.Ray(this.pos.toBabylon(), this.vel.toBabylon(), this.vel.mag());
    /*this.rayHelper = new BABYLON.RayHelper(this.ray);

    var localMeshDirection = new BABYLON.Vector3(0, 0, -1);
    var localMeshOrigin = new BABYLON.Vector3(0, 0, 0);
    var length = 12;

    this.rayHelper.attachToMesh(this.mesh, localMeshDirection, localMeshOrigin, length);
    this.rayHelper.show(scene);*/
}

Projectile.prototype.update = function (ground, scene, players, oPlayers, decalList) {
    /*if (this.mesh.physicsImpostor.isDisposed) {
        return false;
    }*/
    this.pos = fromBabylon(this.mesh.position);
    this.vel.y -= 0.1;
    //this.mesh.physicsImpostor.applyForce(new BABYLON.Vector3(0, 100, 0), this.mesh.getAbsolutePosition());
    if (ground) {

        let mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);

        if (this.pos.y < mapHeight) {
            if (Math.abs(mapHeight - this.pos.y) > Math.abs(this.vel.y)) {
                this.pos.sub(this.vel.div(1.5));
                mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);
            }
            //this.pos = fromBabylon(this.mesh.position);
            this.pos.y = mapHeight + 1;
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
        let meshes = [];
        for (var i = 0; i < Object.keys(players).length; i++) {
            players[Object.keys(players)[i]].mesh.tempID = Object.keys(oPlayers)[i];
            meshes.push(players[Object.keys(players)[i]].mesh);
        }
        var hitInfo = this.ray.intersectsMeshes(meshes);
        if (hitInfo.length) {
            hitInfo = hitInfo[0];
            decalList.push(new Decal(hitInfo.pickedPoint, hitInfo.getNormal(true, true), hitInfo.pickedMesh, scene));
            this.mesh.dispose();
            return hitInfo;
        }
        /*for (var i = 0; i < players.length; i++) {
            let pos = players[i].mesh.position;
            if (Math.pow(this.pos.x - pos.x, 2) + Math.pow(this.pos.z - pos.z, 2) < 25 && Math.abs(this.pos.y - pos.y - 3) < 10) {
                console.log(true);
                this.pos.sub(this.vel.div(1.5));
                decalList.push(new Decal(this.pos, (Vector.sub(fromBabylon(this.pos), fromBabylon(players[i].mesh.position)).normalize()).toBabylon(), players[i].mesh, scene));

                this.mesh.dispose();
                return i + 1;
            }
        }*/
    }

    this.mesh.position = (this.pos.add(this.vel)).toBabylon();
    //console.log(this.ray)
    this.ray.origin = this.mesh.position;
    this.ray.direction = this.vel.toBabylon();
    if (!this.created) {
        this.created = true;
        return -2;
    }
    return 0;
};