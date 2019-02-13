function Flag(x, y, z, team) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5, diameterY: 4}, scene);
    var material = new BABYLON.StandardMaterial("PMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 0);
    if (team === 2) material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    this.mesh.material = material;
    this.mesh.position = new BABYLON.Vector3(x, y, z);
    this.team = team;
    this.taken = false;
}

Flag.prototype.updatePosition = function(x, y, z) {
    this.mesh.position = new BABYLON.Vector3(x, y, z);
};