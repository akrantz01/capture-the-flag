verifyToken().then(status => {
    if (status) runGame();
    else window.location.href = `${window.location.protocol}//${window.location.host}/login.html`;
}).catch(() => {
    window.location.href = `${window.location.protocol}//${window.location.host}/login.html`;
});


var scene, camera;


function runGame() {
    //list of pressed keys
    var keys = [];

    // Key codes
    // The commented numbers are for arrow keys
    var LEFT = 65; // 37;
    var UP = 87; // 38;
    var RIGHT = 68; // 39;
    var DOWN = 83; // 40;
    var SPACE = 32;

    //map coords
    var map = [];

    //list of porjectiles
    var proj = [];

    //players
    var player;
    var otherPlayers = {};

    var decalList = [];

    var playerModel;

    var spawns = [{x: 437.7, y: 226, z: -362.6}, {x: -343.63, y: 132, z: 293.73}];

    var createScene = function () {
        var gravityVector = new BABYLON.Vector3(0, -100, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);

        //lights
        var light = new BABYLON.DirectionalLight("DirLight", new BABYLON.Vector3(-0.1, -1, 0.2), scene);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.position = new BABYLON.Vector3(300, 0, 100);
        light.shadowEnabled = true;

        var light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), scene);
        light3.diffuse = new BABYLON.Color3(0.7, 0.7, 0.9);
        light3.specular = new BABYLON.Color3(0, 0, 0);
        light3.intensity = 0.8;

        //create ground
        let width = 1000;
        let height = 1000;

        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "map2.png", width, height, 80, 0, 255/2, scene, false);
        //ground.position.set(500, 0, 500);
        /*BABYLON.Mesh.CreateGround("ground", width, height, 80, scene, true);

        ground.position.set(0, -30, 0);

        var positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        let dx = width / map.length;
        let index = 0;
        for (var y = 0; y < 80; y++) {
            for (var x = 0; x < 80; x++) {
                positions[index + 1] = map[y][positions[index] / dx + 40];
                index += 3;
            }
        }

        ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        ground.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_NONE;*/

        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("grid.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 160*2;
        groundMaterial.diffuseTexture.vScale = 160*2;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;

        //create player
        player = new Player(spawns[1].x, spawns[1].y, spawns[1].z, playerModel);

        //update player

        let delay = 0;
        scene.executeWhenReady(scene.registerBeforeRender(function () {
            if (ground) {
                delay++;
            }
            if (delay > 100) {
                if (keys[LEFT] || keys[RIGHT] || keys[UP] || keys[DOWN]) {
                    player.timeHeld += 0.5;
                    if (player.timeHeld > 16) {
                        player.timeHeld = 16;
                    }
                } else {
                    player.timeHeld -= 2;
                    if (player.timeHeld < 0) {
                        player.timeHeld = 0;
                    }
                }
                if (keys[LEFT]) {
                    player.move.x = -1;
                }
                if (keys[RIGHT]) {
                    player.move.x = 1;
                }
                if (!keys[LEFT] && !keys[RIGHT]) {
                    player.move.x /= 2;
                }
                if (keys[UP]) {
                    player.move.z = 1;
                }
                if (keys[DOWN]) {
                    player.move.z = -1;
                }
                if (!keys[UP] && !keys[DOWN]) {
                    player.move.z /= 2;
                }
                if (!keys[SPACE]) {
                    player.jump = false;
                }
                if (keys[SPACE] && !player.jump) {
                    player.jump = true;
                }
                player.update(ground);

                let players = multiplayer.getPlayers();
                for (var i = 0; i < proj.length; i++) {
                    let id = proj[i].update(ground, scene, otherPlayers, players, decalList);
                    if (id === -2) {
                        multiplayer.broadcast("-2", proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, proj[i].vel.x, proj[i].vel.y, proj[i].vel.z);
                    } else if (id !== 0 && id !== -1) {
                        multiplayer.broadcast(id.pickedMesh.tempID, id.pickedPoint.x, id.pickedPoint.y, id.pickedPoint.z, 0, 0, 0);
                        proj.splice(i, 1);
                    } else if (id === -1) {
                        multiplayer.broadcast("-1", proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, 0, 0, 0);
                        proj.splice(i, 1);
                    }
                }
                let broadDecals = multiplayer.getBroadcasts();
                if (Object.keys(broadDecals).length > 0) {
                    for (let dec2 in broadDecals) {
                        let dec = broadDecals[dec2];
                        let pos = new BABYLON.Vector3(dec.Coordinates.X, dec.Coordinates.Y, dec.Coordinates.Z);
                        console.log(dec);
                        if (dec.ID === "-2") {
                            console.log(dec);
                            let tvel = new BABYLON.Vector3(dec.Vel.X, dec.Vel.Y, dec.Vel.Z);
                            proj.push(new Projectile(pos, tvel, 1));
                        } else if (dec.ID !== "-1" && dec.ID !== 0 && dec.ID !== '') {
                            console.log(otherPlayers[dec.ID]);
                            decalList.push(new Decal(pos, (Vector.sub(fromBabylon(otherPlayers[dec.ID].mesh.position), fromBabylon(pos)).normalize()).toBabylon(), otherPlayers[dec.ID].mesh, scene));
                            console.log(decalList)
                        } else if (dec.ID !== 0 && dec.ID !== '') {
                            var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
                            decalMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
                            decalMaterial.zOffset = -2;
                            var decalSize = new BABYLON.Vector3(10, 10, 10);
                            var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {
                                position: pos,
                                normal: ground.getNormalAtCoordinates(pos.x, pos.z),
                                size: decalSize
                            }, scene);
                            decal.material = decalMaterial;
                        }
                    }
                }

                if (players) {
                    let s = Object.keys(players);
                    let s2 = Object.keys(otherPlayers);
                    if (!arraysEqual(s2, s)) {
                        for (let i = 0; i < s.length; i++) {
                            let found = false;
                            for (let j = 0; j < s2.length; j++) {
                                if (s[i] === s2[j])
                                    found = true;
                            }
                            if (!found) {
                                otherPlayers[s[i]] = new OtherPlayer(0, 0, 0, s[i], 1, playerModel);
                            }
                        }
                        for (let i = 0; i < s2.length; i++) {
                            let found = false;
                            for (let j = 0; j < s.length; j++) {
                                if (s[j] === s2[i])
                                    found = true;
                            }
                            if (!found) {
                                otherPlayers[s2[i]].mesh.dispose();
                                delete otherPlayers[s2[i]];
                            }
                        }
                    }
                    let index = 0;

                    for (let player in players) {
                        if (Object.keys(players)[index] !== multiplayer.getID()) {
                            otherPlayers[Object.keys(players)[index]].mesh.position = new BABYLON.Vector3(players[player]["X"] + 1, players[player]["Y"] + 2, players[player]["Z"] - 0.5);
                        } else {
                            otherPlayers[Object.keys(players)[index]].mesh.position = new BABYLON.Vector3(0, -100, -100);
                        }
                        index++;
                        for (var l = 0; l < decalList.length; l++) {
                            if (decalList[l].update()) decalList.splice(l, 1);
                        }
                    }
                }

                multiplayer.setPosition(player.mesh.position.x, player.mesh.position.y, player.mesh.position.z);
                multiplayer.sendPlayerData();
                camera.radius = 0.001;
            }
        }));
    };

    var multiplayer = new MMOC();

    var canvas = document.getElementById("renderCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    scene = new BABYLON.Scene(engine);

    //camera
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 200, new BABYLON.Vector3.Zero(), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.keysDown = camera.keysUp = camera.keysLeft = camera.keysRight = [];
    camera.radius = 0.001;
    console.log(camera)
    camera.maxZ = 1000;

    //asset loader
    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskErrorObservable.add(function (task) {
        console.log('task failed', task.errorObject.message, task.errorObject.exception);
    });
    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
    };
    assetsManager.onFinish = function (tasks) {
        createScene();

        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });

        multiplayer.init();
    };

    //load map image and create coordinate map
    var imageTask = assetsManager.addImageTask("image task", "map2.png");
    imageTask.onSuccess = function (task) {
        var canvas = document.createElement('canvas');
        canvas.width = task.image.width;
        canvas.height = task.image.height;
        let context = canvas.getContext('2d');
        context.drawImage(task.image, 0, 0, task.image.width, task.image.height);
        let mapData = context.getImageData(0, 0, task.image.width, task.image.height);
        for (var y = 0; y < task.image.width; y++) {
            let temp = [];
            for (var x = 0; x < task.image.height; x++) {
                //double positions to make level planes
                temp.push(mapData.data[y * (task.image.width * 4) + x * 4]);
                temp.push(mapData.data[y * (task.image.width * 4) + x * 4]);
            }
            map.push(temp);
            map.push(temp);
        }
    };

    var playerTask = assetsManager.addMeshTask("player task", "", "./", "snowman.babylon");
    playerTask.onSuccess = function (task) {
        //console.log(task.loadedMeshes[0]);
        task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        task.loadedMeshes[0].position.y = -100;
        task.loadedMeshes[0].rotation = new BABYLON.Vector3(-2 * Math.PI / 3, 0, -1.2);
        task.loadedMeshes[0].material.ambientColor = new BABYLON.Color3(1, 1, 1);
        playerModel = task.loadedMeshes[0];
    };

    assetsManager.load();

    // Resize
    window.addEventListener("resize", function () {
        //engine.resize();
    });

//update key list
    document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });

    document.addEventListener("click", function () {
        //let vel = Vector.sub(camera.position, fromBabylon(player.mesh.position));
        //vel.normalize();
        let alpha = camera.alpha;
        let beta = camera.beta;
        let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
        proj.push(new Projectile(fromBabylon(player.mesh.position).add(vel.mult(-4)), vel.mult(3), 1));
    });

    canvas.addEventListener("click", function (e) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);

    document.addEventListener("click", function (e) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);

    var pointerlockchange = function (e) {
        let enabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);

        if (enabled) {
            camera.attachControl(canvas);
        } else {
            camera.detachControl(canvas);
        }
    };

    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        a.sort();
        b.sort();

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}