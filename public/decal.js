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
    this.offset = this.offset.mult(-1);
    this.decal.position = new BABYLON.Vector3(0, 0, 0);
    this.pivot = new BABYLON.TransformNode("root");
    this.pivot.position = this.mesh.position;
    this.decal.parent = this.pivot;
    this.decal.position = this.offset;
}
Decal.prototype.update = function() {
    this.pivot.position = (fromBabylon(this.mesh.position)).toBabylon();
    this.pivot.rotate(BABYLON.Axis.Y, this.mesh.deltar, BABYLON.Space.WORLD);
    //this.decal.position = (fromBabylon(this.mesh.position).sub(this.offset)).toBabylon();
    if (this.mesh._isDisposed) {
        this.decal.dispose();
        return true;
    }
    return false;
};