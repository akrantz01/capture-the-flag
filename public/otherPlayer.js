function OtherPlayer(x, y, z, alpha, id, team, playerModel) {
    this.mesh = /*BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5, diameterY: 4}, scene)*/
                playerModel.createInstance("i" + id);
    //var material = new BABYLON.StandardMaterial("PMaterial", scene);
    //material.diffuseColor = new BABYLON.Color3(1, 1, 0);
    //if (team === 2) material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    //this.mesh.material = material;
    this.mesh.position = new BABYLON.Vector3(x, y, z);
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI-0.4+alpha, BABYLON.Space.WORLD);
    this.alpha = alpha;
    this.id = id;
    this.team = team;
}