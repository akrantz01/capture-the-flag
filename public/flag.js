function Flag(x, y, z, team) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
    this.mesh.isVisible = false;

    var sc = 4;
    this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5*sc}, scene);
    this.sphere.scaling = new BABYLON.Vector3(1/sc, 1/sc, 1/sc);
    var fsphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 5*sc}, scene);
    fsphere.isVisible = false;
    fsphere.scaling = new BABYLON.Vector3(1/sc, 1/sc, 1/sc);

    /*var mat = new BABYLON.StandardMaterial("mat", scene);
    // mat.backFaceCulling = false;
    // mat.alpha = 0.7;
    mat.diffuseColor = new BABYLON.Color3(0.4, 0.5, 0.7);
    mat.bumpTexture = new BABYLON.Texture("grained_uv.png", scene);
    mat.bumpTexture.uScale = 4;
    mat.bumpTexture.vScale = 4;*/
    /*mat.reflectionTexture = new BABYLON.Texture("spheremap.jpg", scene);
    mat.reflectionTexture.level = 0.6;
    mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;*/
    var material = new BABYLON.StandardMaterial("kosh5", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.reflectionTexture = new BABYLON.Texture("spheremap.jpg", scene);
    material.reflectionTexture.level = 0.5;
    material.specularPower = 64;
    material.emissiveColor = new BABYLON.Color3(231/255, 76/255, 60/255);
    if (team === 2) material.emissiveColor = new BABYLON.Color3(31/255, 118/255, 234/255);

    // Fresnel
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.4;
    material.emissiveFresnelParameters.power = 2;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.White();


    this.sphere.material = material;

    this.v = this.sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    this.fv = fsphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    this.mesh.material = material;
    this.mesh.position = this.sphere.position = new BABYLON.Vector3(x, y, z);
    this.pmesh = null;

    this.team = team;
    this.hold = false;
    this.count = 0;
    this.id = 0;
    this.moved = false;
    this.t = 0;
}

Flag.prototype.taken = function (team, pmesh, id) {
    this.pmesh = pmesh;
    this.moved = true;
    this.hold = true;
    this.id = id;
};

Flag.prototype.update = function() {
    for (var i = 0; i < this.sphere.getTotalVertices(); i++) {
        let fx = this.fv[i * 3 + 0]; let fy = this.fv[i * 3 + 1]; let fz = this.fv[i * 3 + 2];

        this.v[i * 3 + 0] = fx + 0.33 * Math.sin(this.t * 2.15 + fy) + Math.cos(this.t * 1.45 + fz) + 1.5;
        this.v[i * 3 + 1] = fy + 0.36 * Math.cos(this.t * 1.15 + fz) + Math.sin(this.t * 1.45 + fx) + 1.5;
        this.v[i * 3 + 2] = fz + 0.39 * Math.sin(this.t * 1.15 + fx) + Math.cos(this.t * 1.45 + fy) + 1.5;
    }
    this.sphere.setVerticesData(BABYLON.VertexBuffer.PositionKind, this.v);

    this.t += 0.1;
    if (this.pmesh !== null) {
        this.mesh.position = new BABYLON.Vector3(this.pmesh.position.x, this.pmesh.position.y + 7, this.pmesh.position.z);
        if (this.mesh.position.y > 10000) {
            this.mesh.position.y -= 100000;
        }
    }
    this.sphere.position = this.mesh.position;
};

Flag.prototype.updatePosition = function (x, y, z) {
    this.sphere.position = this.mesh.position = new BABYLON.Vector3(x, y, z);
};