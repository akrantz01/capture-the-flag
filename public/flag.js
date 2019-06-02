function Flag(x, y, z, team) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5, diameterY: 4}, scene);
    var material = new BABYLON.StandardMaterial("PMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(231/255, 76/255, 60/255);
    if (team === 2) material.diffuseColor = new BABYLON.Color3(31/255, 118/255, 234/255);
    //let a = rgb("#1f76ea");
    this.mesh.material = material;
    this.mesh.position = new BABYLON.Vector3(x, y, z);
    this.pmesh = null;
    this.team = team;
    this.hold = false;
    this.count = 0;
    this.id = 0;
    this.moved = false;
}

Flag.prototype.taken = function (team, pmesh, id) {
    this.pmesh = pmesh;
    this.moved = true;
    this.hold = true;
    this.id = id;
};

Flag.prototype.update = function() {
    if (this.pmesh !== null) {
        this.mesh.position = new BABYLON.Vector3(this.pmesh.position.x, this.pmesh.position.y + 7, this.pmesh.position.z);
        if (this.mesh.position.y > 10000) {
            this.mesh.position.y -= 100000;
        }
    }
};

Flag.prototype.updatePosition = function (x, y, z) {
    this.mesh.position = new BABYLON.Vector3(x, y, z);
};