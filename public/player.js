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
    this.fall = true;
    this.slow = false;
    this.slowWait = 0;
    this.oldVel = this.vel.clone();
    this.lastVels = [];
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

    let avgvel;

    if (this.onGround) {
        this.timeOfGround = 0;
        let normal = fromBabylon(ground.getNormalAtCoordinates(this.pos.x, this.pos.z));
        let incline = normal.y;
        let down = normal.add(new Vector(0, -1, 0));
        if (incline < 0.65) {
            this.vel.add(new Vector(down.x * 20, down.y * 20, down.z * 20));
            tempy = this.vel.y;
            this.vel.y = 0;
            normal.y = 0;
            if (normal.x !== 0 || normal.z !== 0) {
                angbet = Vector.angleBetween(normal.mult(-1), this.vel);
                let multi = 0;
                console.log(angbet);
                if (angbet === null) {
                    angbet = 0;
                }
                avgvel = new Vector();
                for (let i = 0; i < this.lastVels.length; i++) {
                    avgvel.add(this.lastVels[i]);
                }
                if (angbet < Math.PI / 2 || true) {

                    /*if (this.slow < 1) {
                        this.slow += 0.05;
                        this.vel.mult(0.8);
                    }*/
                    multi = 0.04;
                    //angbet = Math.abs(Math.atan(normal.z/normal.x));
                    //console.log(angbet)
                    //this.vel.x *= Math.abs(Math.sin(angbet));
                    //this.vel.z *= Math.abs(Math.sin(angbet));
                    let signs = new Vector();
                    signs.x = Math.sign(this.vel.x);
                    signs.z = Math.sign(this.vel.z);

                    let spd = this.maxSpeed * Math.cos(angbet / 1.3) * 0.9;

                    this.vel.x = signs.x * (Math.abs(this.vel.x) - Math.abs(normal.x) * spd * this.slow);
                    this.vel.z = signs.z * (Math.abs(this.vel.z) - Math.abs(normal.z) * spd * this.slow);

                    if (!this.slow) {
                        this.slow = true;
                        this.timeHeld = 16;
                        //this.mesh.position = (this.oldPos).toBabylon();
                        //this.vel.sub(this.oldVel.mult(0.5));
                    }
                    avgvel.add(this.vel);
                    avgvel.mult(1/(this.lastVels.length+1));
                    this.vel = avgvel;
                } else {
                    multi -= 0.05;
                    /*if (this.slow > 0) {
                        this.vel.mult (1-this.slow/2);
                        this.slow -= 0.1;
                    }
                    if (this.slow < 0) {
                        this.slow = 0;
                    }*/
                }
                console.log(this.slow)
                //this.vel.mult(multi);
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
            /*if (this.slow > 0) {
                this.vel.mult (1-this.slow/2);
                this.slow -= 0.1;
            }
            if (this.slow < 0) {
                this.slow = 0;
            }*/
        } else {
            if (this.slow) {
                //this.slow = false;
                this.slowWait++;
            }
            if (this.slowWait > 2) {
                this.slow = false;
                this.slowWait = 0;
            }
            /*if (this.slow > 0) {
                this.vel.mult (1-this.slow/2);
                this.slow -= 0.1;
            }
            if (this.slow < 0) {
                this.slow = 0;
            }*/
        }
    }
    if (this.jump && this.onGround) {
        this.vel.y = 70;
        this.onGround = false;
    }

    if (!this.onGround && this.fall) {
        this.timeOfGround++;
        this.vel.y -= Math.atan(this.timeOfGround / 4) * 5;
    } else {
        this.jump = false;
    }

    if (this.vel === null || this.vel.x === null || this.vel.y === null || this.vel.z === null) {
        this.vel = this.lastVels[this.lastVels.length-1];
    }

    if (this.pos === null || this.pos.x === null || this.pos.y === null || this.pos.z === null) {
        this.pos = this.oldPos;
    }

    this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), this.mesh.getAbsolutePosition());
    this.mesh.physicsImpostor.setLinearVelocity(this.vel.toBabylon());

    this.meshv.position = new BABYLON.Vector3(this.mesh.position.x - 0.0, this.mesh.position.y + 2, this.mesh.position.z - 0.0);

    this.oldPos = this.pos.clone();
    this.oldVel = this.vel.clone();
    this.lastVels.push(this.vel.clone());
    if (this.lastVels.length > 3) {
        this.lastVels.shift();
    }
};