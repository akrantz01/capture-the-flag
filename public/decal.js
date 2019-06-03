function Decal(pos, norm, mesh, team, scene) {
    var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
    if (team === 1)
        decalMaterial.diffuseTexture = new BABYLON.Texture("redsplat.png", scene);
    else
        decalMaterial.diffuseTexture = new BABYLON.Texture("bluesplat.png", scene);
    decalMaterial.diffuseTexture.hasAlpha = true;
    decalMaterial.zOffset = -4;
    var decalSize = new BABYLON.Vector3(6, 6, 6);
    this.mesh = mesh;

    this.decal = BABYLON.MeshBuilder.CreateDecal("decal", mesh, {
        position: pos,
        normal: norm,
        size: decalSize
    }, scene);
    this.decal.material = decalMaterial;
    this.offset = Vector.sub(fromBabylon(this.mesh.mastermesh.position), fromBabylon(this.decal.position));
    this.offset = this.offset.mult(-1);
    this.decal.position = new BABYLON.Vector3(0, 0, 0);
    this.pivot = new BABYLON.TransformNode("root");
    this.pivot.position = mesh.mastermesh.position;
    this.decal.parent = this.pivot;
    this.decal.position = this.offset;
    this.time = new Date().getTime();
}
Decal.prototype.update = function() {
    this.pivot.position = (fromBabylon(this.mesh.mastermesh.position)).toBabylon();
    this.pivot.rotate(BABYLON.Axis.Y, this.mesh.mastermesh.deltar, BABYLON.Space.LOCAL);
    //this.decal.position = (fromBabylon(this.mesh.position).sub(this.offset)).toBabylon();*/
    if (this.mesh._isDisposed ||  new Date().getTime() - this.time > 60000) {
        this.decal.dispose();
        return true;
    }
    return false;
};