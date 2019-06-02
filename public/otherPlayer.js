function OtherPlayer(x, y, z, alpha, id, name, team, playerModel, scene) {
    this.mesh = playerModel.createInstance("i" + id);

    this.healthBarMaterial = new BABYLON.StandardMaterial("hb1mat", scene);
    this.healthBarMaterial.diffuseColor = BABYLON.Color3.Green();
    this.healthBarMaterial.emissiveColor = BABYLON.Color3.Green();
    this.healthBarMaterial.backFaceCulling = false;

    let healthBarContainerMaterial = new BABYLON.StandardMaterial("hb2mat", scene);
    healthBarContainerMaterial.alpha = 0;
    healthBarContainerMaterial.backFaceCulling = false;

    let healthBarContainer = BABYLON.MeshBuilder.CreatePlane("hb2", { width: 20, height: 2, subdivisions: 4 }, scene);
    this.healthBar = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 1, diameterBottom: 1, height: 20, tessellation: 10}, scene);
    let quaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 1), -Math.PI / 2);
    this.healthBar.rotationQuaternion = quaternion;

    healthBarContainer.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    this.healthBar.position = new BABYLON.Vector3(0, 0, -.01);
    healthBarContainer.position = new BABYLON.Vector3(2, 15, -0.5);

    this.healthBar.parent = healthBarContainer;
    healthBarContainer.parent = this.mesh;

    this.healthBar.material = this.healthBarMaterial;
    healthBarContainer.material = healthBarContainerMaterial;

    this.mesh.position = new BABYLON.Vector3(x, y, z);
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI-0.4+alpha, BABYLON.Space.WORLD);
    this.alpha = alpha;
    this.mesh.deltar = 0;
    this.id = id;
    this.team = team;
    this.hasFlag = false;
    this.health = 100;
}

//https://www.babylonjs-playground.com/#3HQSB#4

OtherPlayer.prototype.move = function() {
    //console.log(this.health)
    this.healthBar.scaling.y = this.health / 100;
    this.healthBar.position.x =  (1 - (this.health / 100)) * -1;

    this.healthBarMaterial.diffuseColor = BABYLON.Color3.Green();
    this.healthBarMaterial.emissiveColor = BABYLON.Color3.Green();

    if (this.healthBar.scaling.y <= .5) {
        this.healthBarMaterial.diffuseColor = BABYLON.Color3.Yellow();
        this.healthBarMaterial.emissiveColor = BABYLON.Color3.Yellow();
    }
    if (this.healthBar.scaling.y <= .3) {
        this.healthBarMaterial.diffuseColor = BABYLON.Color3.Red();
        this.healthBarMaterial.emissiveColor = BABYLON.Color3.Red();
    }
};