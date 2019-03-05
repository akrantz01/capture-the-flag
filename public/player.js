function Player(x, y, z, playerModel) {
    this.pos = new Vector(x, y, z);
    this.oldPos = this.pos;
    this.vel = new Vector();
    this.move = new Vector();
    this.meshv = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, diameterY: 4}, scene);/*playerModel*/

    this.meshv.rotate(BABYLON.Axis.Y, Math.PI - 0.4, BABYLON.Space.WORLD);
    var playerMaterial = new BABYLON.StandardMaterial("player", scene);
    playerMaterial.alpha = 0;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, diameterY: 4}, scene);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 1,
        restitution: 0,
        friction: 0
    }, scene);
    this.mesh.material = this.meshv.material = playerMaterial;

    this.oldAlpha = 0;

    this.speedInc = new Vector(40, 0, 40);
    this.timeHeld = 0;
    this.timeOfGround = 0;
    this.jump = false;
    this.onGround = false;
    this.maxSpeed = 80;
    this.health = 100;
}

Player.prototype.enemyHit = function () {
    if (this.maxSpeed > 20) {
        this.maxSpeed -= 10;
    }
};

Player.prototype.friendHit = function () {
    if (this.maxSpeed < 160) {
        this.maxSpeed += 10;
    }
};

Player.prototype.input = function (keys) {
    if (keys[LEFT] || keys[RIGHT] || keys[UP] || keys[DOWN]) {
        this.timeHeld += 0.5;
        if (this.timeHeld > 16) {
            this.timeHeld = 16;
        }
    } else {
        this.timeHeld -= 2;
        if (this.timeHeld < 0) {
            this.timeHeld = 0;
        }
    }
    if (keys[LEFT]) {
        this.move.x = -1;
    }
    if (keys[RIGHT]) {
        this.move.x = 1;
    }
    if (!keys[LEFT] && !keys[RIGHT]) {
        this.move.x /= 2;
    }
    if (keys[UP]) {
        this.move.z = 1;
    }
    if (keys[DOWN]) {
        this.move.z = -1;
    }
    if (!keys[UP] && !keys[DOWN]) {
        this.move.z /= 2;
    }
    if (!keys[SPACE]) {
        this.jump = false;
    }
    if (keys[SPACE] && !this.jump) {
        this.jump = true;
    }
};

Player.prototype.update = function (ground) {
    this.pos = fromBabylon(this.mesh.position);
    //prevent player vertical rotation
    this.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
    this.mesh.physicsImpostor.executeNativeFunction(function (world, body) {
        body.fixedRotation = true;
        body.updateMassProperties();
    });

    //update camera position and rotation to follow player
    let tempR = camera.radius;
    let tempalpha = camera.alpha;
    let tempbeta = camera.beta;
    camera.setTarget(this.meshv.position);
    camera.update();
    camera.setPosition(fromBabylon(camera.position).add(this.oldPos.clone().sub(this.pos)).toBabylon());
    camera.radius = tempR;
    camera.alpha = tempalpha;
    camera.beta = tempbeta;

    //rotate player model
    let deltar = this.oldAlpha - camera.alpha;

    this.meshv.rotate(BABYLON.Axis.Y, deltar, BABYLON.Space.WORLD);

    this.oldAlpha = camera.alpha;

    //update player height
    let mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z) + 5;
    this.onGround = this.mesh.position.y < mapHeight;
    if (this.onGround) {
        this.mesh.position.y = mapHeight;
    }

    //player controls
    this.speedInc = new Vector(Math.pow(this.timeHeld, 0.25) * 40, 0, 0);
    this.speedInc.z = this.speedInc.x;
    let forwards = new Vector(Math.sin(-tempalpha) * this.speedInc.x, 0, Math.cos(-tempalpha) * this.speedInc.x);
    forwards.mult(this.move.x);
    let left = new Vector(Math.sin(-tempalpha - Math.PI / 2) * this.speedInc.z, 0, Math.cos(-tempalpha - Math.PI / 2) * this.speedInc.z);
    left.mult(this.move.z);
    let down = this.vel.y;
    this.vel = (forwards.add(left));
    this.vel.limit(this.maxSpeed);
    this.vel.y = down;

    if (this.onGround) {
        this.timeOfGround = 0;
        let normal = fromBabylon(ground.getNormalAtCoordinates(this.pos.x, this.pos.z));
        let incline = normal.y;
        let down = normal.add(new Vector(0, -1, 0));
        if (incline < 0.65) {
            /*this.vel.y /= 8;
            this.timeHeld /= 2;
            this.vel.div(2);
            this.vel.add(new Vector(down.x * 20, down.y * 160, down.z * 20));
            this.vel.div(5);
            this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, -100, 0), this.mesh.getAbsolutePosition());
            this.jump = false;*/
            this.vel.add(new Vector(down.x * 20, down.y * 20, down.z * 20));
            tempy = this.vel.y;
            this.vel.y = 0;
            normal.y = 0;
            if (normal.x !== 0 || normal.z !== 0) {
                angbet = Vector.angleBetween(normal, this.vel);
                console.log(Math.cos(angbet))
                this.vel.mult((Math.cos(angbet) + 1) ** 2);
            }
            this.jump = false;
        } else if (incline < 1) {
            this.vel.mult(incline * incline * incline);
        }
    }
    if (this.jump && this.onGround) {
        this.vel.y = 70;
        this.onGround = false;
    }

    if (!this.onGround) {
        this.timeOfGround++;
        this.vel.y -= Math.atan(this.timeOfGround / 4) * 5;
    } else {
        this.jump = false;
    }
    this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), this.mesh.getAbsolutePosition());
    this.mesh.physicsImpostor.setLinearVelocity(this.vel.toBabylon());

    this.meshv.position = new BABYLON.Vector3(this.mesh.position.x - 0.0, this.mesh.position.y + 2, this.mesh.position.z - 0.0);

    this.oldPos = this.pos.clone();
};