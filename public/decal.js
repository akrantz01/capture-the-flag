function Decal(pos, norm, mesh, scene) {
    var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
    decalMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    decalMaterial.zOffset = -2;
    var decalSize = new BABYLON.Vector3(6, 6, 6);
    this.mesh = mesh;
    this.decal = BABYLON.MeshBuilder.CreateDecal("decal", mesh, {
        position: pos,
        normal: norm,
        size: decalSize
    }, scene);
    this.decal.material = decalMaterial;
    this.offset = Vector.sub(fromBabylon(this.mesh.position), fromBabylon(this.decal.position));
}
Decal.prototype.update = function() {
    this.decal.position = (fromBabylon(this.mesh.position).sub(this.offset)).toBabylon();
};