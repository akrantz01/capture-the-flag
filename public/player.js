function Player(x, y, z) {//abstract player
    this.pos = new Vector(x, y, z);
    this.oldPos = this.pos;
    this.vel = new Vector();
    this.move = new Vector();
    //mesh to make easy calculations
    this.meshv = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, diameterY: 4}, scene);/*playerModel*/

    this.meshv.rotate(BABYLON.Axis.Y, Math.PI - 0.4, BABYLON.Space.WORLD);
    var playerMaterial = new BABYLON.StandardMaterial("player", scene);
    playerMaterial.alpha = 0;
    //mesh to calculate physics with
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 4, diameterY: 10}, scene);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 1,
        restitution: 0,
        friction: 0
    }, scene);
    this.mesh.checkCollisions = true;
    this.mesh.material = this.meshv.material = playerMaterial;

    this.oldAlpha = 0;

    //states/properties
    this.speedInc = new Vector(40, 0, 40);
    this.timeHeld = 0;
    this.timeOfGround = 0;
    this.jump = false;
    this.onGround = false;
    this.maxSpeed = 60;
    this.health = 100;
    this.fall = true;
    this.slow = false;
    this.slowWait = 0;
    this.lastVels = [new Vector()];
    this.offset = new Vector();
    this.time = 0;
    this.down = 0;
    //to find ground height
    this.rays = [new BABYLON.Ray(this.mesh.position, new BABYLON.Vector3(0, -1, 0), 400)];
    for (let i = 0; i < 3; i++) {
        this.rays.push(new BABYLON.Ray(this.mesh.position, new BABYLON.Vector3(0, -1, 0), 400));
    }
}

Player.prototype.enemyHit = function () {
    if (this.maxSpeed > 10) {
        this.maxSpeed -= 10;
    }
};

Player.prototype.friendHit = function () {
    if (this.maxSpeed < 160) {
        this.maxSpeed += 10;
    }
};

Player.prototype.input = function (keys) {//move with key presses
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
    /*this.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
    this.mesh.physicsImpostor.executeNativeFunction(function (world, body) {
        body.fixedRotation = true;
        body.updateMassProperties();
    });*/

    //update player height
    //find ground height from average (prevents errors from edges)
    let tempPos = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    tempPos.y = 200;
    let hitInfo = [];
    for (let i = 0; i < 4; i++) {
        tempPos.x += Math.cos(i * Math.PI / 2);
        tempPos.z += Math.sin(i * Math.PI / 2);
        this.rays[i] = (new BABYLON.Ray(tempPos, new BABYLON.Vector3(0, -1, 0), 400));
        hitInfo.push(this.rays[i].intersectsMeshes([ground]))
    }
    let norm = null;
    let maxHeight = -Infinity;
    for (let i = 0; i < hitInfo.length; i++) {
        if (hitInfo[i].length) {
            if (200 - hitInfo[i][0].distance > maxHeight) {
                maxHeight = 200 - hitInfo[i][0].distance;
                norm = hitInfo[i][0].getNormal(false, false);
            }
        }
    }

    //change y position to above map
    if (maxHeight > -Infinity) {
        //let mapHeight = ground.getHeightAtCoordinates(this.pos.x, this.pos.z) + 5;
        this.onGround = this.mesh.position.y < maxHeight + 5.5;
        if (this.onGround) {
            this.mesh.position.y = maxHeight + 5.5;
        }
    }

    //update time variable for player wobble
    this.time += 0.16;
    if (this.time > Math.PI * 2) this.time -= Math.PI * 2;

    //currrent camera angle
    let cang = camera.alpha + Math.PI / 2;

    //player wobble calc.
    this.offset = new Vector(Math.cos(this.time) * Math.cos(cang), Math.sin(2 * this.time), Math.cos(this.time) * Math.sin(cang));
    this.offset.mult(this.timeHeld / 16 * 0.6 * (1 - Math.abs(this.down.y)));
    //update camera position and rotation to follow player
    let tempR = camera.radius;
    let tempalpha = camera.alpha;
    let tempbeta = camera.beta;
    camera.setTarget(this.meshv.position.add(this.offset));
    camera.update();
    camera.radius = tempR;
    camera.alpha = tempalpha;
    camera.beta = tempbeta;

    //rotate player model
    let deltar = this.oldAlpha - camera.alpha;

    this.meshv.rotate(BABYLON.Axis.Y, deltar, BABYLON.Space.WORLD);

    this.oldAlpha = camera.alpha;

    //player speed/directing controls
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

    let avgvel;

    //change speed based on ground incline level and direction relative to ground normal
    if (this.onGround) {
        this.timeOfGround = 0;
        let normal = null;
        try {
            normal = fromBabylon(norm);
        } catch (e) {
            normal = new Vector(0,1,0);
        }

        let incline = normal.y;
        this.down = normal.add(new Vector(0, -1, 0));
        if (incline < 0.65) {
            this.vel.add(new Vector(this.down.x * 20, this.down.y * 20, this.down.z * 20));
            tempy = this.vel.y;
            this.vel.y = 0;
            normal.y = 0;
            if ((normal.x !== 0 || normal.z !== 0)) {
                try {
                    angbet = Vector.angleBetween(normal.mult(-1), this.vel);
                } catch (e) {
                    angbet = 0;
                }
                if (angbet === null || isNaN(angbet)) {
                    angbet = 0;
                }
                avgvel = new Vector();
                for (let i = 0; i < this.lastVels.length; i++) {
                    avgvel.add(this.lastVels[i]);
                }
                if (angbet < Math.PI / 2 || true) {
                    let signs = new Vector();
                    signs.x = Math.sign(this.vel.x);
                    signs.z = Math.sign(this.vel.z);

                    let spd = this.maxSpeed * Math.cos(angbet / 1.3) * 0.9;

                    this.vel.x = signs.x * (Math.abs(this.vel.x) - Math.abs(normal.x) * spd * this.slow);
                    this.vel.z = signs.z * (Math.abs(this.vel.z) - Math.abs(normal.z) * spd * this.slow);

                    if (!this.slow) {
                        this.slow = true;
                        this.timeHeld = 16;
                    }
                    avgvel.add(this.vel);
                    avgvel.mult(1 / (this.lastVels.length + 1));
                    this.vel = avgvel;
                }
            }
            this.vel.y = tempy;
            this.jump = false;
        } else if (incline < 1) {
            this.vel.mult(incline * incline * incline);

            if (this.slow) {
                //this.slow = false;
                this.slowWait++;
            }
            if (this.slowWait > 2) {
                this.slow = false;
                this.slowWait = 0;
            }
        } else {
            if (this.slow) {
                //this.slow = false;
                this.slowWait++;
            }
            if (this.slowWait > 2) {
                this.slow = false;
                this.slowWait = 0;
            }
        }
    }

    //if jumping
    if (this.jump && this.onGround) {
        this.vel.y = 70;
        this.onGround = false;
    }

    //if not on ground: fall
    if (!this.onGround && this.fall) {
        this.timeOfGround++;
        this.vel.y -= Math.atan(this.timeOfGround / 4) * 5;
    } else {
        this.jump = false;
    }

    //correct for weird undiscovered edge cases
    if (isNaN(this.vel.x) || isNaN(this.vel.y) || isNaN(this.vel.z)) {
        this.vel = this.lastVels[this.lastVels.length - 1];
    }

    if (isNaN(this.pos.x) || isNaN(this.pos.y) || isNaN(this.pos.z)) {
        this.pos = this.oldPos;
    }


    //update physics and positions
    this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), this.mesh.getAbsolutePosition());
    this.mesh.physicsImpostor.setLinearVelocity(this.vel.toBabylon());

    this.meshv.position = new BABYLON.Vector3(this.mesh.position.x - 0.0, this.mesh.position.y + 2, this.mesh.position.z - 0.0);
    this.oldPos = this.pos.clone();
    this.lastVels.push(this.vel.clone());
    if (this.lastVels.length > 3) {
        this.lastVels.shift();
    }
};