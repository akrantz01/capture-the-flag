function OtherPlayer(x, y, z, alpha, id, name, team, playerModel, otherModel, scene) {
    this.mesh = new BABYLON.Mesh("playerMesh"+id, scene);;
    let c = playerModel.getChildren();
    this.mesharray = [];
    for (let i = 0; i < c.length; i++) {
        let tempmod = c[i].createInstance(i+""+id);
        tempmod.scaling = new BABYLON.Vector3(13, -13, 13);
        if (team === 2) {
            if (i === 2 || i === 3 || i === 4)
                continue;
            tempmod.position.z -= 1.3;
            tempmod.position.x -= 2.8;
            tempmod.position.y -= 0.5;
            if (i === 1) {
                tempmod.scaling = new BABYLON.Vector3(13.6, -13.5, 13.6);
                tempmod.position.y -= 0.22;
            }
            tempmod.rotate(BABYLON.Axis.Y, -1-Math.PI/2-0.15, BABYLON.Space.WORLD);
            tempmod.mastermesh = this.mesh;
        }
        else {
            tempmod.position.z += 4;//+ left
            tempmod.position.x += 1.7;//+ to me
            tempmod.position.y += -0.5;
            tempmod.rotate(BABYLON.Axis.Y, -1+Math.PI-0.2, BABYLON.Space.WORLD);
            tempmod.mastermesh = this.mesh;
        }
        this.mesharray.push(tempmod);
        this.mesh.addChild(tempmod);
    }
    if (team === 2) {
        this.mesharray = [];
        let c = otherModel.getChildren();
        for (let i = 0; i < c.length; i++) {
            let tempmod = c[i].createInstance(i+""+id);
            tempmod.scaling = new BABYLON.Vector3(13, -13, 13);
            tempmod.position.z += 4.3;//+ left
            tempmod.position.x += 2.1;//+ to me
            tempmod.position.y += -0.5;
            tempmod.rotate(BABYLON.Axis.Y, -1+Math.PI-0.2, BABYLON.Space.WORLD);
            //tempmod.isVisible = false;
            this.mesharray.push(tempmod);
            this.mesh.addChild(tempmod);
            tempmod.mastermesh = this.mesh;
        }
    }

    let height = 10;
    this.bounding = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 3, diameterBottom: 6, height: height, tessellation: 10}, scene);
    this.bounding.position.y += height/2;
    this.bounding.isVisible = false;
    //this.mesh.addChild(this.bounding);

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

    let outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
    outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);

    let outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
    outputplane.material.diffuseTexture = outputplaneTexture;
    outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    outputplane.material.backFaceCulling = false;


    outputplaneTexture.drawText(name, null, 140, "bold 50px verdana", "white");

    outputplaneTexture.hasAlpha = true;

    healthBarContainer.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    this.healthBar.position = new BABYLON.Vector3(0, 0, -.01);
    healthBarContainer.position = new BABYLON.Vector3(0, 12, 0);
    outputplane.position = new BABYLON.Vector3(0, -4, -.01);

    this.healthBar.parent = healthBarContainer;
    outputplane.parent = healthBarContainer;
    healthBarContainer.scaling = new BABYLON.Vector3(1/3, 1/3, 1/3);
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