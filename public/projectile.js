function Projectile(pos, vel, team, dup, type) {//abstract projectile creation
    this.pos = (pos instanceof BABYLON.Vector3) ? fromBabylon(pos) : pos;
    this.vel = (vel instanceof BABYLON.Vector3) ? fromBabylon(vel) : vel;
    this.team = team;
    this.created = true;
    this.type = type;
    this.dup = dup;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("proj" + Math.random(), {diameter: type}, scene);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    var material = new BABYLON.StandardMaterial("material", scene);

    material.diffuseColor = new BABYLON.Color3(231/255, 76/255, 60/255);//change color based on team
    if (team === 2) material.diffuseColor = new BABYLON.Color3(31/255, 118/255, 234/255);
    this.mesh.material = material;
    this.ray = new BABYLON.Ray(this.pos.toBabylon(), this.vel.toBabylon(), this.vel.mag());//prevent phasing
}

Projectile.prototype.update = function (ground, scene, players, oPlayers, decalList) {
    this.pos = fromBabylon(this.mesh.position);
    this.vel.y -= 0.1;//update position
    if (this.dup) {//if not a duplicate
        if (players) {//check ray to see if intersecting with player mesh
            let meshes = [];
            for (var i = 0; i < Object.keys(players).length; i++) {
                players[Object.keys(players)[i]].bounding.tempID = Object.keys(players)[i];
                players[Object.keys(players)[i]].bounding.subtempmesh = players[Object.keys(players)[i]].mesh;
                players[Object.keys(players)[i]].bounding.tempID2 = 0;
                meshes.push(players[Object.keys(players)[i]].bounding)
                //let c = players[Object.keys(players)[i]].mesharray;
                /*for (let k = 0; k < c.length; c++) {
                    c[k].tempID = Object.keys(players)[i];
                    c[k].tempID2 = k;
                    meshes.push(c[k]);
                }*/
                //meshes.push(players[Object.keys(players)[i]].bounding);
            }
            var hitInfo = this.ray.intersectsMeshes(meshes);
            if (hitInfo.length) {//if hit
                hitInfo = hitInfo[0];
                console.log(hitInfo);
                //decalList.push(new Decal(hitInfo.pickedPoint, hitInfo.getNormal(true, true), hitInfo.pickedMesh.subtempmesh, this.team, scene));
                decalList.push(new Decal(hitInfo.pickedPoint, hitInfo.getNormal(true, true), players[hitInfo.pickedMesh.tempID].mesharray[0], this.team, scene));
                this.mesh.dispose();
                return hitInfo;
            }
        }
        if (ground) {//check intersection with ground
            this.ray = new BABYLON.Ray(this.pos.toBabylon(), this.vel.toBabylon(), this.vel.mag());
            var hitInfo = this.ray.intersectsMeshes([ground]);
            if (hitInfo.length) {//if hit
                hitInfo = hitInfo[0];
                this.pos.x = hitInfo.pickedPoint.x;
                this.pos.z = hitInfo.pickedPoint.z;
                let mapHeight = hitInfo.pickedPoint.y;

                if (Math.abs(mapHeight - this.pos.y) > Math.abs(this.vel.y)) {
                    this.pos.sub(this.vel.div(1.5));
                    mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z);
                }
                this.pos.y = mapHeight + 1;

                //create decal on ground
                var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
                if (this.team === 1)
                    decalMaterial.diffuseTexture = new BABYLON.Texture("redsplat.png", scene);
                else
                    decalMaterial.diffuseTexture = new BABYLON.Texture("bluesplat.png", scene);
                decalMaterial.diffuseTexture.hasAlpha = true;
                decalMaterial.zOffset = -2;
                var decalSize = new BABYLON.Vector3(10, 10, 10);
                var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {
                    position: this.pos,
                    normal: ground.getNormalAtCoordinates(this.pos.x, this.pos.z),
                    size: decalSize
                }, scene);
                decal.material = decalMaterial;
                groundDecalList.push(decal);
                this.mesh.dispose();
                return -1;
            }
        }
    }
    //finish updating position after check and return based on current state (first pass or created)
    this.mesh.position = (this.pos.add(this.vel)).toBabylon();
    this.ray.origin = this.mesh.position;
    this.ray.direction = this.vel.toBabylon();
    if (this.created && this.dup) {
        this.created = false;
        return -2;
    }
    return 0;
};