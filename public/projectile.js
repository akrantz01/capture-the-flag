function Projectile(pos, vel, team, type) {
    this.pos = (pos instanceof BABYLON.Vector3) ? fromBabylon(pos) : pos;
    this.vel = (vel instanceof BABYLON.Vector3) ? fromBabylon(vel) : vel;
    this.team = team;
    this.created = true;
    this.type = type;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("proj" + Math.random(), {diameter: 1}, scene);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.ray = new BABYLON.Ray(this.pos.toBabylon(), this.vel.toBabylon(), this.vel.mag());
}

Projectile.prototype.update = function (ground, scene, players, oPlayers, decalList) {
    this.pos = fromBabylon(this.mesh.position);
    this.vel.y -= 0.1;
    if (this.type) {
        if (ground) {

            let mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);

            if (this.pos.y < mapHeight) {
                if (Math.abs(mapHeight - this.pos.y) > Math.abs(this.vel.y)) {
                    this.pos.sub(this.vel.div(1.5));
                    mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);
                }
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
        }
    }

    this.mesh.position = (this.pos.add(this.vel)).toBabylon();
    this.ray.origin = this.mesh.position;
    this.ray.direction = this.vel.toBabylon();
    if (this.created && this.type) {
        this.created = false;
        return -2;
    }
    return 0;
};