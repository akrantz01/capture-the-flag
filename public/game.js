verifyToken().then(status => {
    if (!status) window.location.href = `${window.location.protocol}//${window.location.host}/login.html`;
}).catch(() => window.location.href = `${window.location.protocol}//${window.location.host}/login.html`);

// Disable console.log (use console.info instead)
console.log = () => {};

//list of pressed keys
var keys = [];

//positions of scene meshes
/*currently on fence0, 0-20
[", {x: 0, y: 0, z: 0}, {x: -76, y: 78, z: 77}, {x: 311, y: 0, z: 170}, {x: -103, y: 0, z: 111}, {x: 99, y: 0, z: 28.081017125192844}, {x: 34, y: 0, z: 11}, {x: 231, y: 90, z: -145}, {x: -156, y: 0, z: -224}, {x: -162, y: -2, z: -224}, {x: -192, y: 0, z: -224}, {x: -426, y: 83, z: 197.81645722438955}, {x: 216, y: -3, z: 228.62414309043842}, {x: 48.614135955672765, y: 69, z: 302.69270927916335}, {x: 15, y: 0, z: 96.366923201049}, {x: 126.85939427492343, y: 0, z: 12.264696854805358}, {x: 75.26286696952977, y: 40, z: 298.29452756284235}, {x: -257, y: 0, z: -263}, {x: 386, y: 0, z: 67.96195374967739}, {x: 58, y: 0, z: -115}, {x: 49.18251664818074, y: 0, z: 29.55082021686961}, {x: 420, y: 89, z: 324.6530476304758}, {x: 87, y: 44, z: 38}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 5.24099311144921, y: 0, z: 144.8703287145665}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}"]

 end on stone0, 21 - 30
 [", {x: 0, y: 0, z: 0}, {x: 133.12425369248504, y: 46.500530670226, z: 228.51891160757486}, {x: 160.96606181468587, y: 115.90730847451019, z: 490.7199657372864}, {x: 371.3543228080738, y: 45.40360481191355, z: 330.0843189271697}, {x: 366.3300081802575, y: 26.499999999999996, z: 67.44666025680424}, {x: 44.5582009486879, y: 90.98983541950652, z: 299.7479841874339}, {x: 467.25561483311907, y: 13.162529719942853, z: 426.0620280113295}, {x: 132.8831578300287, y: 0, z: 131.34162804904648}, {x: 78.17954923786819, y: 97, z: 359.57317499730766}, {x: 202.3779134037944, y: 69.5, z: 353.56881714095766}, {x: 332.2864455930722, y: 34.04525258749051, z: 343.4334213243523}, {x: 272.3237608096992, y: 57.744122759558074, z: 212.619023489369}, {x: 106.27018330988814, y: 127.00633882114917, z: 448.04249699570806}, {x: 149.26610127455697, y: 0, z: 23.45094947020099}, {x: 299.472024949061, y: 8.752122927535698, z: 179.65315624185473}, {x: 149.4369837859979, y: 94.61823340494045, z: 311.692925386759}, {x: 151.01460327113114, y: 0, z: 14.455248981203317}, {x: 416.9567598256474, y: 18.22169544040213, z: 143.25517872512793}, {x: 208.6697540541672, y: 75.35862472805573, z: 376.4310412134263}, {x: 4.249909950930331, y: 127.49999999999999, z: 462.81136162306603}, {x: 450.19477807277855, y: 64, z: 350.23449218314886}, {x: 0, y: 0, z: 0}, {x: -132, y: 73, z: 298}, {x: -149, y: 73, z: 298}, {x: -163, y: 76, z: 261}, {x: -158, y: 84, z: 233}, {x: -34, y: 78, z: 299}, {x: 120, y: 96, z: -199}, {x: 21, y: 33, z: -313}, {x: 21, y: 34, z: -327}, {x: 21, y: 44, z: -410}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 25.807140869487878, y: 0, z: 37.0456896027358}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}"]

 end on snowfort 31 - 54
 [", {x: 0, y: 0, z: 0}, {x: 133.12425369248504, y: 46.500530670226, z: 228.51891160757486}, {x: 160.96606181468587, y: 115.90730847451019, z: 490.7199657372864}, {x: 371.3543228080738, y: 45.40360481191355, z: 330.0843189271697}, {x: 366.3300081802575, y: 26.499999999999996, z: 67.44666025680424}, {x: 44.5582009486879, y: 90.98983541950652, z: 299.7479841874339}, {x: 467.25561483311907, y: 13.162529719942853, z: 426.0620280113295}, {x: 132.8831578300287, y: 0, z: 131.34162804904648}, {x: 78.17954923786819, y: 97, z: 359.57317499730766}, {x: 202.3779134037944, y: 69.5, z: 353.56881714095766}, {x: 332.2864455930722, y: 34.04525258749051, z: 343.4334213243523}, {x: 272.3237608096992, y: 57.744122759558074, z: 212.619023489369}, {x: 106.27018330988814, y: 127.00633882114917, z: 448.04249699570806}, {x: 149.26610127455697, y: 0, z: 23.45094947020099}, {x: 299.472024949061, y: 8.752122927535698, z: 179.65315624185473}, {x: 149.4369837859979, y: 94.61823340494045, z: 311.692925386759}, {x: 151.01460327113114, y: 0, z: 14.455248981203317}, {x: 416.9567598256474, y: 18.22169544040213, z: 143.25517872512793}, {x: 208.6697540541672, y: 75.35862472805573, z: 376.4310412134263}, {x: 4.249909950930331, y: 127.49999999999999, z: 462.81136162306603}, {x: 450.19477807277855, y: 64, z: 350.23449218314886}, {x: 0, y: 0, z: 0}, {x: -132, y: 73, z: 298}, {x: -149, y: 73, z: 298}, {x: -163, y: 76, z: 261}, {x: -158, y: 84, z: 233}, {x: -34, y: 78, z: 299}, {x: 120, y: 96, z: -199}, {x: 21, y: 33, z: -313}, {x: 21, y: 34, z: -327}, {x: 21, y: 44, z: -410}, {x: -336, y: 0, z: 0}, {x: -168, y: 72, z: -82}, {x: -473, y: 0, z: -265}, {x: 273, y: 0, z: 0}, {x: -115, y: 91, z: 401}, {x: 167, y: 43, z: -157}, {x: 217, y: 89, z: 235}, {x: -130, y: 0, z: -250}, {x: -291, y: 0, z: 61}, {x: -276, y: 0, z: 80}, {x: 0, y: 0, z: 166}, {x: 380, y: 0, z: -181}, {x: 122, y: 91, z: -314}, {x: -363, y: 84, z: 129}, {x: 156, y: 100, z: -382}, {x: -148, y: -4, z: 0}, {x: -317, y: -1, z: -168}, {x: -314, y: 16, z: -177}, {x: -101, y: -1, z: 163}, {x: -264, y: -1, z: -286}, {x: -187, y: 0, z: 223}, {x: 0, y: 0, z: 0}, {x: 432, y: 0, z: -137}, {x: 26, y: 35, z: -197}, {x: 25.807140869487878, y: 0, z: 37.0456896027358}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}"]
 55 - 63
 [", {x: 0, y: 0, z: 0}, {x: 133.12425369248504, y: 46.500530670226, z: 228.51891160757486}, {x: 160.96606181468587, y: 115.90730847451019, z: 490.7199657372864}, {x: 371.3543228080738, y: 45.40360481191355, z: 330.0843189271697}, {x: 366.3300081802575, y: 26.499999999999996, z: 67.44666025680424}, {x: 44.5582009486879, y: 90.98983541950652, z: 299.7479841874339}, {x: 467.25561483311907, y: 13.162529719942853, z: 426.0620280113295}, {x: 132.8831578300287, y: 0, z: 131.34162804904648}, {x: 78.17954923786819, y: 97, z: 359.57317499730766}, {x: 202.3779134037944, y: 69.5, z: 353.56881714095766}, {x: 332.2864455930722, y: 34.04525258749051, z: 343.4334213243523}, {x: 272.3237608096992, y: 57.744122759558074, z: 212.619023489369}, {x: 106.27018330988814, y: 127.00633882114917, z: 448.04249699570806}, {x: 149.26610127455697, y: 0, z: 23.45094947020099}, {x: 299.472024949061, y: 8.752122927535698, z: 179.65315624185473}, {x: 149.4369837859979, y: 94.61823340494045, z: 311.692925386759}, {x: 151.01460327113114, y: 0, z: 14.455248981203317}, {x: 416.9567598256474, y: 18.22169544040213, z: 143.25517872512793}, {x: 208.6697540541672, y: 75.35862472805573, z: 376.4310412134263}, {x: 4.249909950930331, y: 127.49999999999999, z: 462.81136162306603}, {x: 450.19477807277855, y: 64, z: 350.23449218314886}, {x: 0, y: 0, z: 0}, {x: -132, y: 73, z: 298}, {x: -149, y: 73, z: 298}, {x: -163, y: 76, z: 261}, {x: -158, y: 84, z: 233}, {x: -34, y: 78, z: 299}, {x: 120, y: 96, z: -199}, {x: 21, y: 33, z: -313}, {x: 21, y: 34, z: -327}, {x: 21, y: 44, z: -410}, {x: -336, y: 0, z: 0}, {x: -168, y: 72, z: -82}, {x: -473, y: 0, z: -265}, {x: 273, y: 0, z: 0}, {x: -115, y: 91, z: 401}, {x: 167, y: 43, z: -157}, {x: 217, y: 89, z: 235}, {x: -130, y: 0, z: -250}, {x: -291, y: 0, z: 61}, {x: -276, y: 0, z: 80}, {x: 0, y: 0, z: 166}, {x: 380, y: 0, z: -181}, {x: 122, y: 91, z: -314}, {x: -363, y: 84, z: 129}, {x: 156, y: 100, z: -382}, {x: -148, y: -4, z: 0}, {x: -317, y: -1, z: -168}, {x: -314, y: 16, z: -177}, {x: -101, y: -1, z: 163}, {x: -264, y: -1, z: -286}, {x: -187, y: 0, z: 223}, {x: 0, y: 0, z: 0}, {x: 432, y: 0, z: -137}, {x: 26, y: 35, z: -197}, {x: -78, y: 1, z: 37.0456896027358}, {x: 250, y: -4, z: 500}, {x: -57, y: 0, z: -429}, {x: 123, y: 0, z: -500}, {x: 139, y: 0, z: -500}, {x: -253, y: 0, z: 0}, {x: 83, y: 0, z: 0}, {x: -299, y: 0, z: 77}, {x: -146, y: 0, z: 10}"]
 */
let poss = [{x: 0, y: 0, z: 0}, {x: -76, y: 78, z: 77}, {x: 311, y: 0, z: 170}, {x: -103, y: 0, z: 111}, {x: 99, y: 0, z: 28.081017125192844}, {x: 34, y: 0, z: 11}, {x: 231, y: 90, z: -145}, {x: -156, y: 0, z: -224}, {x: -162, y: -2, z: -224}, {x: -192, y: 0, z: -224}, {x: -426, y: 83, z: 197.81645722438955}, {x: 216, y: -3, z: 228.62414309043842}, {x: 48.614135955672765, y: 69, z: 302.69270927916335}, {x: 15, y: 0, z: 96.366923201049}, {x: 126.85939427492343, y: 0, z: 12.264696854805358}, {x: 75.26286696952977, y: 40, z: 298.29452756284235}, {x: -257, y: 0, z: -263}, {x: 386, y: 0, z: 67.96195374967739}, {x: 58, y: 0, z: -115}, {x: 49.18251664818074, y: 0, z: 29.55082021686961}, {x: 420, y: 89, z: 324.6530476304758}, {x: 0, y: 0, z: 0}, {x: -132, y: 73, z: 298}, {x: -149, y: 73, z: 298}, {x: -163, y: 76, z: 261}, {x: -158, y: 84, z: 233}, {x: -34, y: 78, z: 299}, {x: 120, y: 96, z: -199}, {x: 21, y: 33, z: -313}, {x: 21, y: 34, z: -327}, {x: 21, y: 44, z: -410}, {x: -336, y: 0, z: 0}, {x: -168, y: 72, z: -82}, {x: -473, y: 0, z: -265}, {x: 273, y: 0, z: 0}, {x: -115, y: 91, z: 401}, {x: 167, y: 43, z: -157}, {x: 217, y: 89, z: 235}, {x: -130, y: 0, z: -250}, {x: -291, y: 0, z: 61}, {x: -276, y: 0, z: 80}, {x: 0, y: 0, z: 166}, {x: 380, y: 0, z: -181}, {x: 122, y: 91, z: -314}, {x: -363, y: 84, z: 129}, {x: 156, y: 100, z: -382}, {x: -148, y: -4, z: 0}, {x: -317, y: -1, z: -168}, {x: -314, y: 16, z: -177}, {x: -101, y: -1, z: 163}, {x: -264, y: -1, z: -286}, {x: -187, y: 0, z: 223}, {x: 0, y: 0, z: 0}, {x: 432, y: 0, z: -137}, {x: 26, y: 35, z: -197}, {x: -78, y: 1, z: 37.0456896027358}, {x: 250, y: -4, z: 500}, {x: -57, y: 0, z: -429}, {x: 123, y: 0, z: -500}, {x: 139, y: 0, z: -500}, {x: -253, y: 0, z: 0}, {x: 83, y: 0, z: 0}, {x: -299, y: 0, z: 77}, {x: -146, y: 0, z: 10}];

var camera, scene, currentType;

// Key codes
// The commented numbers are for arrow keys
var LEFT = 65; // 37;
var UP = 87; // 38;
var RIGHT = 68; // 39;
var DOWN = 83; // 40;
var SPACE = 32;
var ESC = 27;

//map coords
//var map = [];
var proj = [];

//players
var player;
var otherPlayers = {};

//list of paint platters
var decalList = [];

//spawn points
var spawns = [{x: 243.85, y: 132, z: -218.78}, {x: -343.63, y: 132, z: 293.73}];

var healthbar;

let mousedown = false;

//list of paint platters on ground
let groundDecalList = [];
let xdist = 0;//for sniper movement
var ground;
var multiplayer, canvas, engine;
function runGame() {
    if (scene !== undefined || canvas !== undefined) {
        toastr.error("An instance is already running", "Unable to start a new game instance");
        return;
    }

    $("#renderCanvas").css("display", "block");
    $("#UI").css("display", "block");

    //list of projectiles
    var createScene = function () {
        //lights
        var light = new BABYLON.DirectionalLight("DirLight", new BABYLON.Vector3(-0.1, -1, 0.2), scene);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.position = new BABYLON.Vector3(300, 300, 100);
        light.shadowEnabled = true;

        var light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), scene);
        light3.diffuse = new BABYLON.Color3(0.7, 0.7, 0.9);
        light3.specular = new BABYLON.Color3(0, 0, 0);
        light3.intensity = 0.8;

        //create ground
        let width = 1000;
        let height = 1000;

        ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "map3.png", width, height, 60 * 2, 0, 255 / 2, scene, false);

        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("snow.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 4;
        groundMaterial.diffuseTexture.vScale = 4;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;

        //create player/data
        player = new Player(0, 0, 0);

        //init player vairables
        let spawn = true;
        let team = 0;
        let lastPlayerPos = new BABYLON.Vector3();

        //create flags
        var flags = [new Flag(spawns[0].x, spawns[0].y, spawns[0].z, 1), new Flag(spawns[1].x, spawns[1].y, spawns[1].z, 2)];

        //create weapon types
        let gunOffset = new Vector(0, 1, 0);

        function rotateGunOffset(alpha) {
            gunOffset.x = Math.cos(alpha + Math.PI / 2);
            gunOffset.z = Math.sin(alpha + Math.PI / 2);
        }

        let startCamPos = [camera.beta, camera.alpha];
        let weaponTypes = {
            normal: function (alpha, beta) {
                rotateGunOffset(alpha);
                alpha += 0.01;
                let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
                proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(-4)), vel.mult(3), team, true, 1));
            },
            machineGun: function (alpha, beta) {
                rotateGunOffset(alpha);
                alpha += 0.01;
                alpha += (Math.random() - 0.5) / 30;
                beta += (Math.random() - 0.5) / 30;
                beta += 0.04;
                let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
                let variance = -Math.random() - 1;
                proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(variance)), vel.mult(-6 / variance), team, true, 0.2));
            },
            sniper: function (alpha, beta) {
                camera.angularSensibilityX = camera.angularSensibilityY = 1000;
                setTimeout(function () {
                    camera.fov = 1;
                }, 100);
                camera.maxZ = 500;
                scene.fogDensity = 0.01;
                let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
                proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(-4)), vel.mult(300), team, true, 3));
            },
        };
        mousedown = false;
        let velOffset = [0, 0];
        let posOffset = [0, 0];

        //create projectiles on click
        document.addEventListener("mouseup", function (e) {
            mousedown = false;
            //right click: punch
            if (e.which === 3) {
                let close = [];

                let alpha = camera.alpha;
                let beta = camera.beta;
                let vec1 = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));

                let pos2 = fromBabylon(player.mesh.position);

                for (let index = 0; index < Object.keys(otherPlayers).length; index++) {
                    if (Object.keys(otherPlayers)[index] !== multiplayer.getID()) {
                        let pos1 = fromBabylon(otherPlayers[Object.keys(otherPlayers)[index]].mesh.position);
                        let vec2 = pos1.clone().sub(pos2);
                        vec2.y = vec1.y = 0;
                        if (vec2.angleTo(vec1) > 2.5) {
                            close.push([pos1, Object.keys(otherPlayers)[index]]);
                        }
                    }
                }

                let closest = null;
                let bestDist = 400;
                for (let player_ in close) {
                    let dist = Vector.distsq(close[player_][0], pos2);
                    if (dist < bestDist) {
                        closest = close[player_];
                        bestDist = dist;
                    }
                }

                if (closest !== null) {
                    multiplayer.changeHealth(-10, closest[1]);
                }
            } else {//left click: projectile
                switch (currentType) {
                    case "normal":
                        weaponTypes[currentType](camera.alpha, camera.beta);
                        break;
                    case "sniper":
                        weaponTypes[currentType](camera.alpha, camera.beta);
                        break;
                    default:
                        break;
                }
            }
        });
        document.addEventListener("mousedown", function (e) {
            mousedown = true;
            xdist = 0;
            if (e.which === 3) {
                return;
            } else {
                switch (currentType) {
                    case "sniper":
                        velOffset = [0, 0];
                        camera.fov = 0.1;
                        camera.angularSensibilityX = camera.angularSensibilityY = 30000;
                        camera.maxZ = 1000;
                        scene.fogDensity = 0.003;
                        startCamPos = [camera.beta, camera.alpha];
                        posOffset = [0, 0];
                        break;
                    default:
                        break;
                }
            }
        });
        document.addEventListener("mousemove", function (e) {
            //console.log(e)
            xdist = e.movementX;
            if (mousedown) {
                if (e.which === 3) {
                    return;
                } else {
                    switch (currentType) {
                        case "sniper":
                            velOffset[1] -= e.movementX / 10000;
                            velOffset[0] -= e.movementY / 10000;
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        //update player
        var team1 = document.getElementById("team1");
        var team2 = document.getElementById("team2");

        //healing variables
        let delay = 0;
        let wait = null;
        let healtime = null;
        let heal = false;

        //create fog and snow
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.01;

        let particleSystem = new BABYLON.GPUParticleSystem("particles", {capacity: 400}, scene);

        particleSystem.particleTexture = new BABYLON.Texture("snowflake.png", scene);

        // Where the particles come from
        particleSystem.emitter = player.mesh; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-100, 30, -100); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(100, 0, 100); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(1, 1, 1, 0.5);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.2;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.emitRate = 100000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -20, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-7, -8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, -8, -3);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.0005;

        // Start the particle system
        particleSystem.start();

        //run every frame
        scene.executeWhenReady(scene.registerBeforeRender(function () {
            //more projectile controls
            if (mousedown) {
                switch (currentType) {
                    case "machineGun":
                        if (delay % 3 === 0)
                            weaponTypes[currentType](camera.alpha, camera.beta);
                        break;
                    case "sniper":
                        posOffset[1] += velOffset[1];
                        posOffset[0] += velOffset[0];
                        camera.beta = startCamPos[0] + posOffset[0];
                        camera.alpha = startCamPos[1] + posOffset[1];
                        camera.update();
                        break;
                    default:
                        break;
                }
            }
            //add delay to ensure things load
            if (ground) {
                delay++;
            }
            if (delay > 100) {
                //create scoreboard
                team1.innerText = multiplayer.getScores().Team1;
                team2.innerText = multiplayer.getScores().Team2;

                //update player
                player.input(keys);
                player.update(ground);
                // console.log(player.mesh.position.x+", "+ player.mesh.position.y+", "+ player.mesh.position.z)


                //update player health
                let players = multiplayer.getPlayers();
                let th = player.health;

                if (players[multiplayer.getID()] !== undefined) {
                    player.health = players[multiplayer.getID()].Health;
                }

                if (player.health < th) {
                    heal = false;
                    clearTimeout(wait);
                    clearInterval(healtime);
                    wait = setTimeout(function () {
                        heal = true;
                    }, 1000);
                }

                if (player.health >= 100) {
                    heal = false;
                    clearInterval(healtime);
                }
                if (heal) {
                    heal = false;
                    healtime = setInterval(function () {
                        if (players[multiplayer.getID()].Health >= 100) {
                            clearInterval(healtime);
                        } else {
                            multiplayer.changeHealth(1, multiplayer.getID());
                        }
                    }, 1000);
                }

                //update healthbar/speed bar
                let color;
                if (player.health < 15) color = "#e74c3c"; else if (player.health < 50) color = "#f39c12"; else color = "#2ecc71";
                healthbar[0].style.left = "-" + (100 - player.health) + "%";
                healthbar[0].style.background = color;
                document.querySelectorAll("#health-text")[0].innerHTML = player.health;
                document.querySelectorAll("#health")[0].style.color = color;
                document.querySelectorAll('#armor-bar .level')[0].style.left = "-" + (160 - player.maxSpeed) / 1.6 + "%";
                document.querySelectorAll("#armor-text")[0].innerHTML = player.maxSpeed;

                //die if below map
                if (player.mesh.position.y < -100) {
                    spawn = true;
                }

                //start respawn if dead
                if (player.health <= 0) {
                    spawn = true;
                    multiplayer.changeHealth(-player.health + 100, multiplayer.getID());
                }

                //broadcast decals/projectiles info to server
                for (var i = 0; i < proj.length; i++) {
                    let id = proj[i].update(ground, scene, otherPlayers, players, decalList);
                    if (id === -2) {
                        if (team === 1) {
                            multiplayer.broadcast("-2" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, proj[i].vel.x, proj[i].vel.y, proj[i].vel.z, proj[i].type);
                        } else {
                            multiplayer.broadcast("-3" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, proj[i].vel.x, proj[i].vel.y, proj[i].vel.z, proj[i].type);
                        }
                    } else if (id !== 0 && id !== -1) {
                        let t = "";
                        for (let i = 0; i < multiplayer.getID().length; i++) {
                            let ch = multiplayer.getID().charCodeAt(i);
                            t += ch;
                        }
                        t = t % 13427;
                        multiplayer.broadcast(id.pickedMesh.tempID, id.pickedPoint.x, id.pickedPoint.y, id.pickedPoint.z, team, id.pickedMesh.tempID2, t, proj[i].type);
                        proj.splice(i, 1);
                    } else if (id === -1) {
                        multiplayer.broadcast("-1" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, team, 0, 0, proj[i].type);
                        proj.splice(i, 1);
                    }
                }

                //get broadcasted decals/projectiles from server
                let broadDecals = multiplayer.getBroadcasts();
                if (Object.keys(broadDecals).length > 0) {
                    for (let dec2 in broadDecals) {
                        let dec = broadDecals[dec2];
                        let pos = new BABYLON.Vector3(dec.Coordinates.X, dec.Coordinates.Y, dec.Coordinates.Z);
                        if ((dec.ID.slice(0, 2) === "-2" && dec.ID !== "-2" + multiplayer.getID()) || dec.ID.slice(0, 2) === "-3" && dec.ID !== "-3" + multiplayer.getID()) {
                            let tvel = new BABYLON.Vector3(dec.Vel.X, dec.Vel.Y, dec.Vel.Z);
                            if (dec.ID.slice(0, 2) === "-2") {
                                proj.push(new Projectile(pos, tvel, 1, false, dec.Size));
                            } else {
                                proj.push(new Projectile(pos, tvel, 2, false, dec.Size));
                            }
                        } else if (dec.ID.slice(0, 2) !== "-1" && dec.ID !== '') {
                            if (dec.ID === multiplayer.getID()) {
                                if (dec.Vel.X === team) {
                                    player.friendHit(dec.Size*10);
                                } else {
                                    player.enemyHit(dec.Size*10);
                                }
                            } else if (otherPlayers[dec.ID]) {
                                let t = "";
                                for (let i = 0; i < multiplayer.getID().length; i++) {
                                    let ch = multiplayer.getID().charCodeAt(i);
                                    t += ch;
                                }
                                t = t % 13427;
                                if (dec.Vel.Z !== t) {
                                    decalList.push(new Decal(pos, (Vector.sub(fromBabylon(otherPlayers[dec.ID].mesh.position), fromBabylon(pos)).normalize()).toBabylon(), otherPlayers[dec.ID].mesharray[dec.Vel.Y], dec.Vel.X, scene));
                                }
                            }
                        } else if (dec.ID !== 0 && dec.ID !== '' && dec.ID !== "-1" + multiplayer.getID()) {
                            var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);

                            if (dec.Vel.X === 1)
                                decalMaterial.diffuseTexture = new BABYLON.Texture("redsplat.png", scene);
                            else
                                decalMaterial.diffuseTexture = new BABYLON.Texture("bluesplat.png", scene);
                            decalMaterial.diffuseTexture.hasAlpha = true;
                            decalMaterial.zOffset = -2;
                            var decalSize = new BABYLON.Vector3(10, 10, 10);
                            var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {
                                position: pos,
                                normal: ground.getNormalAtCoordinates(pos.x, pos.z),
                                size: decalSize
                            }, scene);
                            decal.material = decalMaterial;
                            groundDecalList.push(decal);
                        }
                    }
                }

                let flagsEvents = multiplayer.getFlagEvents();
                //update player list and positions
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
                                if (players[s[i]].Team === 1)
                                    otherPlayers[s[i]] = new OtherPlayer(0, 0, 0, 0, s[i], players[s[i]].Name, 1, snowman1, snowman2, scene);
                                else
                                    otherPlayers[s[i]] = new OtherPlayer(0, 0, 0, 0, s[i], players[s[i]].Name, 2, snowman2, snowman1, scene);
                                /*if (s[i] === multiplayer.getID()) {
                                    otherPlayers[s[i]].mesh.dispose();
                                    advancedTexture.removeControl(otherPlayers[s[i]].healthbar);
                                    otherPlayers[s[i]].healthbar.dispose();
                                    advancedTexture.removeControl(otherPlayers[s[i]].label);
                                    otherPlayers[s[i]].label.dispose();
                                }*/
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
                                /*advancedTexture.removeControl(otherPlayers[s2[i]].healthbar);
                                otherPlayers[s2[i]].healthbar.dispose();
                                advancedTexture.removeControl(otherPlayers[s2[i]].label);
                                otherPlayers[s2[i]].label.dispose();*/

                                delete otherPlayers[s2[i]];
                            }
                        }
                    }
                    let index = 0;

                    for (let player_ in players) {
                        let tid = Object.keys(players)[index];
                        if (tid !== multiplayer.getID()) {
                            //update flag properties
                            if (flagsEvents.Action === 1) {
                                if (flagsEvents.Flag < 0) {
                                    flags[-flagsEvents.Flag - 1] = new Flag(spawns[-flagsEvents.Flag - 1].x, spawns[-flagsEvents.Flag - 1].y, spawns[-flagsEvents.Flag - 1].z, -flagsEvents.Flag)
                                } else if (flagsEvents.ID === tid) {
                                    flags[flagsEvents.Flag].taken(otherPlayers[tid].team, otherPlayers[tid].mesh, tid);
                                    //otherPlayers[tid].hasFlag = true;
                                }
                            } else if (flagsEvents.Action === 0) {
                                if (flagsEvents.Flag < 0) {
                                    flags[-flagsEvents.Flag - 1].mesh.dispose();
                                    flags[-flagsEvents.Flag - 1] = new Flag(spawns[-flagsEvents.Flag - 1].x, spawns[-flagsEvents.Flag - 1].y, spawns[-flagsEvents.Flag - 1].z, -flagsEvents.Flag)
                                } else {
                                    flags[flagsEvents.Flag].pmesh = null;
                                    //flags[flagsEvents.Flag].moved = false;
                                    flags[flagsEvents.Flag].hold = false;
                                    flags[flagsEvents.Flag].id = 0;
                                    flags[flagsEvents.Flag].count = 0;
                                }
                            }
                            //update other players positions
                            otherPlayers[tid].move();
                            otherPlayers[tid].health = players[player_].Health;
                            otherPlayers[tid].bounding.position = new BABYLON.Vector3(players[player_]["X"] + 1, players[player_]["Y"] - 5, players[player_]["Z"] - 0.5);
                            otherPlayers[tid].mesh.position = new BABYLON.Vector3(players[player_]["X"] + 1, players[player_]["Y"] - 5, players[player_]["Z"] - 0.5);
                            //otherPlayers[Object.keys(players)[index]].mesh.rotate(-otherPlayers[Object.keys(players)[index]].alpha + players[player_]["Orientation"]);
                            let deltar = otherPlayers[tid].alpha - players[player_]["Orientation"];
                            otherPlayers[tid].mesh.rotate(BABYLON.Axis.Y, deltar, BABYLON.Space.WORLD);
                            otherPlayers[tid].alpha = players[player_]["Orientation"];
                            otherPlayers[tid].mesh.deltar = deltar;
                            for (let it = 0; it < otherPlayers[tid].mesharray.length; it++) {
                                otherPlayers[tid].mesharray[it].deltar = deltar;
                            }

                            otherPlayers[tid].bounding.position.y += 5;
                            //console.log(players[player_]["Orientation"])
                        } else {
                            otherPlayers[Object.keys(players)[index]].mesh.position = new BABYLON.Vector3(0, -100, -100);
                            if (spawn) {//respawn
                                /*if (flags[0].id === multiplayer.getID()) {
                                    multiplayer.lostFlag(0);
                                    //console.log('test3')
                                    flags[0].pmesh = null;
                                    //flags[i].moved = false;
                                    flags[0].hold = false;
                                    flags[0].id = 0;
                                    flags[0].count = 0;
                                }
                                if (flags[1].id === multiplayer.getID()) {
                                    multiplayer.lostFlag(1);
                                    //console.log('test3')
                                    flags[1].pmesh = null;
                                    //flags[i].moved = false;
                                    flags[1].hold = false;
                                    flags[1].id = 0;
                                    flags[1].count = 0;
                                }*/

                                team = players[multiplayer.getID()].Team;
                                lastPlayerPos = player.mesh.position;
                                //setTimeout(function () {
                                //console.log(team)
                                player.fall = false;
                                player.mesh.position.y = 100000 + player.mesh.position.y;

                                //}, 50);
                                spawn = false;
                                setTimeout(function () {
                                    //console.log(team)
                                    player.fall = true;
                                    player.mesh.position = new BABYLON.Vector3(spawns[team - 1].x, spawns[team - 1].y, spawns[team - 1].z);

                                }, 1000);
                            }
                        }
                        index++;
                    }
                    //console.log(player.mesh.position);

                    //update flags
                    if (team > 0) {
                        for (let i = 0; i < flags.length; i++) {
                            flags[i].update();
                            //console.log(flags[i]);
                            if (!flags[i].hold) {
                                //console.log("not held");
                                if (i !== team - 1) {
                                    //console.log(flags[i].count);
                                    let dist = (player.pos.x - flags[i].mesh.position.x) * (player.pos.x - flags[i].mesh.position.x) + (player.pos.z - flags[i].mesh.position.z) * (player.pos.z - flags[i].mesh.position.z);
                                    //console.log(flags[i].count, dist)
                                    if (dist < 200) {
                                        flags[i].count++;
                                        //console.log("count: " + flags[i].count);
                                    } else if (flags[i].count > 0) {
                                        flags[i].count -= 2;
                                    }
                                    if (flags[i].count >= 50) {
                                        flags[i].taken(team, player.mesh, multiplayer.getID());
                                        multiplayer.gotFlag(i);
                                    }
                                } else {
                                    let dist = (player.pos.x - flags[i].mesh.position.x) * (player.pos.x - flags[i].mesh.position.x) + (player.pos.z - flags[i].mesh.position.z) * (player.pos.z - flags[i].mesh.position.z);
                                    //console.log(dist, flags[i].moved);
                                    if (dist < 200 && flags[i].moved && player.pos.y < 10000) {
                                        flags[i].taken(team, player.mesh, multiplayer.getID());
                                        multiplayer.gotFlag(i);
                                    }
                                }
                            } else {
                                //console.log("held");
                                if (i !== team - 1) {
                                    if (player.health <= 0 && flags[i].id === multiplayer.getID()) {
                                        multiplayer.lostFlag(i);
                                        //console.log('test3')
                                        flags[i].pmesh = null;
                                        //flags[i].moved = false;
                                        flags[i].hold = false;
                                        flags[i].id = 0;
                                        flags[i].count = 0;
                                    }
                                    let dist2 = (player.pos.x - spawns[1 - i].x) * (player.pos.x - spawns[1 - i].x) + (player.pos.z - spawns[1 - i].z) * (player.pos.z - spawns[1 - i].z);
                                    if (dist2 < 200 && flags[i].id === multiplayer.getID()) {
                                        //console.log('test2')
                                        multiplayer.updateScore();
                                        multiplayer.lostFlag(-(i + 1));
                                        flags[i].mesh.dispose();
                                        flags[i].sphere.dispose();
                                        flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1);
                                        //flags[i].updatePosition(spawns[i].x, spawns[i].y, spawns[i].z)
                                    }
                                } else {
                                    let dist = (player.pos.x - spawns[i].x) * (player.pos.x - spawns[i].x) + (player.pos.z - spawns[i].z) * (player.pos.z - spawns[i].z);
                                    if (dist < 200 && flags[i].id === multiplayer.getID()) {
                                        //console.log('test')
                                        multiplayer.lostFlag(-(i + 1));
                                        flags[i].mesh.dispose();
                                        flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1);
                                    }
                                    if (player.health <= 0 && flags[i].id === multiplayer.getID()) {
                                        multiplayer.lostFlag(i);
                                        //console.log('test4')
                                        flags[i].updatePosition(lastPlayerPos.x, lastPlayerPos.y, lastPlayerPos.z);
                                        flags[i].pmesh = null;
                                        //flags[i].moved = false;
                                        flags[i].hold = false;
                                        flags[i].id = 0;
                                        flags[i].count = 0;
                                    }
                                }
                            }
                        }
                        /*let dist = (player.pos.x - spawns[i].x) * (player.pos.x - spawns[i].x) + (player.pos.z - spawns[i].z) * (player.pos.z - spawns[i].z);
                        if (dist < 200) {
                            flagCountDown++;
                        }
                        if (flagCountDown === 1) {
                            highlight.addMesh(flags[i].mesh, new BABYLON.Color3(i, i, 1 - i));
                        }
                        if (flagCountDown === 0) {
                            highlight.removeMesh(flags[i].mesh);
                        }
                        if (dist > 200 && flagCountDown > 0) {
                            flagCountDown -= 2;
                        }
                        if (flagCountDown > 50) {
                            highlight.removeMesh(flags[i].mesh);
                            flags[i].taken(team, player.mesh);
                            multiplayer.gotFlag(i);
                        }
                        if (player.health <= 0) {
                            multiplayer.lostFlag(i);
                        }
                        let dist2 = (player.pos.x - spawns[1 - i].x) * (player.pos.x - spawns[1 - i].x) + (player.pos.z - spawns[1 - i].z) * (player.pos.z - spawns[1 - i].z);
                        if (dist2 < 200 && flags[i].taken) {
                            if (i !== team - 1) {
                                /*setTimeout(function () {
                                    flags[2 - team].updatePosition(spawns[2 - team].x, spawns[2 - team].y, spawns[1].z)
                                }, 30);
                                flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1)
                                flagCountDown = 0;
                                multiplayer.updateScore();
                            } else {
                                multiplayer.gotFlag(-(i + 1));
                            }
                        }
                    }*/
                    }
                }

                //move decals with player
                for (var l = 0; l < decalList.length; l++) {
                    if (decalList[l].update()) decalList.splice(l, 1);
                }

                if (groundDecalList.length > 128) {
                    groundDecalList[0].dispose();
                    groundDecalList.splice(0, 1);
                }

                //send client player info
                multiplayer.setPosition(player.mesh.position.x, player.mesh.position.y, player.mesh.position.z);
                multiplayer.setOrientation(camera.alpha);
                multiplayer.sendPlayerData();
                camera.radius = 0.001;
            }
        }));

        //for editing models in scene
        /*var slider = document.getElementById("coh");
        var output = document.getElementById("output");
        output.innerHTML = "0";

        slider.oninput = function () {
            curmod = boxes[parseFloat(this.value)];
            output.innerHTML = masterMeshList[parseFloat(this.value)].name + ", "  +this.value;
        };

        var sliderx = document.getElementById("x");
        var outputx = document.getElementById("outputx");
        outputx.innerHTML = "0";

        sliderx.oninput = function () {
            curmod.scaling.x = parseFloat(this.value)/100;
            outputx.innerHTML = this.value;
        };

        var slidery = document.getElementById("y");
        var outputy = document.getElementById("outputy");
        outputy.innerHTML = "0";

        slidery.oninput = function () {
            curmod.scaling.y = parseFloat(this.value)/100;
            outputy.innerHTML = this.value;
        };

        var sliderz = document.getElementById("z");
        var outputz = document.getElementById("outputz");
        outputz.innerHTML = "0";

        sliderz.oninput = function () {
            curmod.scaling.z = parseFloat(this.value)/100;
            outputz.innerHTML = this.value;
        };*/
    };
    //let curmod = null;

    multiplayer = new MMOC()//to get player data

    canvas = document.getElementById("renderCanvas");//create canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //create render/engine objects
    engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    scene = new BABYLON.Scene(engine);

    //camera
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 200, new BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    camera.maxZ = 500;
    camera.keysDown = camera.keysUp = camera.keysLeft = camera.keysRight = [];

    //asset loader
    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskErrorObservable.add(function (task) {
        console.log('task failed', task.errorObject.message, task.errorObject.exception);
    });
    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
    };
    assetsManager.onFinish = function (tasks) {//start scene
        createScene();
        healthbar = document.querySelectorAll('#health-bar .level');

        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });

        multiplayer.init();
    };

    //start physics engine
    var gravityVector = new BABYLON.Vector3(0, -100, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.collisionsEnabled = true;

    //create and divide up meshes from christmas.glb
    let playerTask = assetsManager.addMeshTask("player task", "", "./GLTF/", "christmas.glb");
    let models = {};
    let cabin1 = new BABYLON.Mesh("cabin1", scene);
    let cabin2 = new BABYLON.Mesh("cabin2", scene);
    let sled = new BABYLON.Mesh("sled", scene);
    let campfire = new BABYLON.Mesh("campfire", scene);
    let bench1 = new BABYLON.Mesh("bench1", scene);
    let bench2 = new BABYLON.Mesh("bench2", scene);
    let present1 = new BABYLON.Mesh("present1", scene);
    let present2 = new BABYLON.Mesh("present2", scene);
    let present3 = new BABYLON.Mesh("present3", scene);

    let fences = [];
    let stones = [];
    let tree1 = new BABYLON.Mesh("tree1", scene);
    let tree2 = new BABYLON.Mesh("tree2", scene);
    let tree3 = new BABYLON.Mesh("tree3", scene);
    let tree4 = new BABYLON.Mesh("tree4", scene);
    let tree5 = new BABYLON.Mesh("tree5", scene);
    let tree6 = new BABYLON.Mesh("tree6", scene);
    let tree7 = new BABYLON.Mesh("tree7", scene);
    let tree8 = new BABYLON.Mesh("tree8", scene);
    let fancytree = new BABYLON.Mesh("fancytree", scene);
    let lightpost1 = new BABYLON.Mesh("lightpost1", scene);
    let lightpost2 = new BABYLON.Mesh("lightpost2", scene);

    let snowman1 = new BABYLON.Mesh("snowman1", scene);
    let snowman2 = new BABYLON.Mesh("snowman2", scene);

    let snowfort = new BABYLON.Mesh("snowfort", scene);
    let rockformations = [];
    let snowpatches = [];

    let train = new BABYLON.Mesh("train", scene);

    let masterMeshList = [train, cabin1, cabin2, sled, campfire, bench1, bench2, present1, present2, present3, tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, fancytree, lightpost1, lightpost2];
    let cabinmeshes = {};
    let boxes = [];

    playerTask.onSuccess = function (task) {
        let cabinmark = 0;
        let mark = 0;
        (task).loadedMeshes.forEach((mesh) => {
            if (mesh.name.indexOf("fence") > -1 || mesh.name.indexOf("group") > -1 || mesh.name.indexOf("log") > -1 || mesh.name.indexOf("wreath") > -1 || mesh.name.indexOf("wheel") > -1 || mesh.name.indexOf("track") > -1 || mesh.name.indexOf("tie") > -1 || mesh.name.indexOf("stone") > -1 || mesh.name.indexOf("rock") > -1 || mesh.name.indexOf("light") > -1 || mesh.name.indexOf("snow") > -1 || mesh.name.indexOf("train") > -1 || mesh.name.indexOf("wagon") > -1 || mesh.name.indexOf("tree") > -1) {
                models[mesh.name + mark] = mesh;//"wreath(Clone)_primitive0101", "wreath(Clone)_primitive1102"
                //"lightsRed(Clone)_primitive061", "lightsRed(Clone)_primitive062", "lightsRed(Clone)_primitive063", "lightsRed(Clone)_primitive064",
                mark++;
            } else {
                cabinmeshes[mesh.name + cabinmark] = mesh;
                cabinmark++;
            }
        });

        let cabin1list = ["cabinRoofChimney(Clone)_primitive03", "cabinWindowLarge(Clone)54", "cabinRoofChimney(Clone)_primitive14", "cabinRoofChimney(Clone)_primitive25", "cabinRoofChimney(Clone)_primitive36", "cabinRoofChimney(Clone)_primitive36", "door_primitive248", "cabinDoor(Clone)49", "frame_primitive050", "frame_primitive151", "frame_primitive252", "frame_primitive353", "cabinCorner(Clone)55", "cabinWall(Clone)56", "cabinWall(Clone)57", "cabinWall(Clone)58", "cabinCorner(Clone)59", "cabinCorner(Clone)60", "cabinWall(Clone)61", "cabinWall(Clone)62", "cabinRoof(Clone)_primitive063", "cabinRoof(Clone)_primitive164", "cabinRoof(Clone)_primitive065", "cabinRoof(Clone)_primitive166", "cabinRoof(Clone)_primitive067", "cabinRoof(Clone)_primitive168", "cabinSideCenter(Clone)69", "cabinSideCenter(Clone)70", "cabinRoof(Clone)_primitive071", "cabinRoof(Clone)_primitive172", "cabinFloor(Clone)73",];
        //+"wreath(Clone)_primitive0101", "wreath(Clone)_primitive1102"
        let cabin2list = ["frame12", "door_primitive013", "door_primitive114", "door_primitive215", "cabinDoor(Clone)16", "cabinRoofCorner(Clone)_primitive017", "cabinRoofCorner(Clone)_primitive118", "cabinRoofCorner(Clone)_primitive019", "cabinRoofCorner(Clone)_primitive120", "cabinWall(Clone)21", "cabinWall(Clone)22", "cabinCorner(Clone)23", "cabinCorner(Clone)24", "cabinRoofCorner(Clone)_primitive025", "cabinRoofCorner(Clone)_primitive126", "cabinRoofCorner(Clone)_primitive027", "cabinRoofCorner(Clone)_primitive128", "cabinWall(Clone)29", "frame_primitive030", "frame_primitive131", "cabinWindow(Clone)32", "cabinWall(Clone)33", "cabinWall(Clone)34", "frame_primitive035", "frame_primitive136", "cabinWindow(Clone)37", "cabinWall(Clone)38", "cabinWall(Clone)39", "cabinWall(Clone)40", "cabinFloor(Clone)41"];
        let campfirelist = ["campfireStones_blocks1", "campfire_large2"];
        let benches = ["bench(Clone)11", "bench(Clone)44"];
        let present1list = ["lid_primitive074", "lid_primitive175", "present(Clone)_primitive076", "present(Clone)_primitive177"];
        //+tie_primitive1100
        //+tie_primitive099
        //"tie_primitive0103", "tie_primitive1104", "tie_primitive0105", "tie_primitive1106", "tie_primitive0107", "tie_primitive1108"
        let present2list = ["lid_primitive078", "lid_primitive179", "presentLow(Clone)_primitive080", "presentLow(Clone)_primitive181"];
        let present3list = ["presentLow(Clone)_primitive080", "presentLow(Clone)_primitive181", "Group_primitive082", "Group_primitive183", "lid_primitive084", "lid_primitive185"];

        for (let i = 0; i < cabin1list.length; i++) {
            cabin1.addChild(cabinmeshes[cabin1list[i]]);
        }
        cabin1.addChild(models["wreath(Clone)_primitive0101"]);
        cabin1.addChild(models["wreath(Clone)_primitive1102"]);
        for (let i = 0; i < cabin2list.length; i++) {
            cabin2.addChild(cabinmeshes[cabin2list[i]]);
        }
        let cabin2lightlist = ["lightsRed(Clone)_primitive061", "lightsRed(Clone)_primitive063", "lightsRed(Clone)_primitive162", "lightsRed(Clone)_primitive164", "lightsMulti(Clone)_primitive065", "lightsMulti(Clone)_primitive068", "lightsMulti(Clone)_primitive166", "lightsMulti(Clone)_primitive169", "lightsMulti(Clone)_primitive267", "lightsMulti(Clone)_primitive270", "lightpost(Clone)_primitive071", "lightpost(Clone)_primitive172"];

        for (let i = 0; i < cabin2lightlist.length; i++) {
            cabin2.addChild(models[cabin2lightlist[i]]);
        }

        for (let i = 0; i < campfirelist.length; i++) {
            campfire.addChild(cabinmeshes[campfirelist[i]]);
        }
        sled.addChild(cabinmeshes["sled(Clone)8"]);
        bench1.addChild(cabinmeshes[benches[0]]);
        bench2.addChild(cabinmeshes[benches[1]]);
        for (let i = 0; i < present1list.length; i++) {
            present1.addChild(cabinmeshes[present1list[i]]);
        }
        for (let i = 0; i < present2list.length; i++) {
            present2.addChild(cabinmeshes[present2list[i]]);
        }
        for (let i = 0; i < present3list.length; i++) {
            present3.addChild(cabinmeshes[present3list[i]]);
        }

        let fencelist = ["fence6", "fence_simple0", "fence_simple1", "fence_simple2", "fence_corner3", "fence_simple2", "fence_corner3", "fence4", "fence5", "fence6"];
        for (let i = 0; i < fencelist.length; i++) {
            models[fencelist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
            fences.push((new BABYLON.Mesh("fence" + i, scene)).addChild(models[fencelist[i]]));
            masterMeshList.push(fences[i]);
        }
        let stonelist = ["stone_tall107", "stone_tall98", "stone_tall89", "stone_tall510", "stone_tall411", "stone_tall312", "stone_tall213", "stone_tall114", "stone_smallTop215", "stone_smallTop116", "stone_smallFlat317", "stone_smallFlat218", "stone_smallFlat119", "stone_small920", "stone_small821", "stone_small722", "stone_large623", "stone_large524", "stone_large425", "stone_large326", "stone_large227", "stone_large128", "stone_statue_primitive029", "stone_statue_primitive130"];
        for (let i = 0; i < stonelist.length; i++) {
            models[stonelist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
            stones.push((new BABYLON.Mesh("stone" + i, scene)).addChild(models[stonelist[i]]));
            masterMeshList.push(stones[i]);
        }
        let tree1list = ["treePineSnowed(Clone)_primitive036", "treePineSnowed(Clone)_primitive137"];
        for (let i = 0; i < tree1list.length; i++) {
            tree1.addChild(models[tree1list[i]]);
        }
        let tree2list = ["treePineSnow(Clone)_primitive044", "treePineSnow(Clone)_primitive145", "treePineSnow(Clone)_primitive246"];
        for (let i = 0; i < tree2list.length; i++) {
            tree2.addChild(models[tree2list[i]]);
        }
        let tree3list = ["treePineSnow(Clone)_primitive073", "treePineSnow(Clone)_primitive174", "treePineSnow(Clone)_primitive275"];
        for (let i = 0; i < tree3list.length; i++) {
            tree3.addChild(models[tree3list[i]]);
        }
        let tree4list = ["treePineSnow(Clone)_primitive076", "treePineSnow(Clone)_primitive177", "treePineSnow(Clone)_primitive278"];
        for (let i = 0; i < tree4list.length; i++) {
            tree4.addChild(models[tree4list[i]]);
        }
        let tree5list = ["treePineSnow(Clone)_primitive084", "treePineSnow(Clone)_primitive185", "treePineSnow(Clone)_primitive286"];
        for (let i = 0; i < tree5list.length; i++) {
            tree5.addChild(models[tree5list[i]]);
        }
        let tree6list = ["treePineSnow(Clone)_primitive087", "treePineSnow(Clone)_primitive188", "treePineSnow(Clone)_primitive289"];
        for (let i = 0; i < tree6list.length; i++) {
            tree6.addChild(models[tree6list[i]]);
        }
        let tree7list = ["treePineSnow(Clone)_primitive090", "treePineSnow(Clone)_primitive191", "treePineSnow(Clone)_primitive292"];
        for (let i = 0; i < tree7list.length; i++) {
            tree7.addChild(models[tree7list[i]]);
        }
        let tree8list = ["treePineSnow(Clone)_primitive096", "treePineSnow(Clone)_primitive197", "treePineSnow(Clone)_primitive298"];
        for (let i = 0; i < tree8list.length; i++) {
            tree8.addChild(models[tree8list[i]]);
        }
        let fancytreelist = ["treeDecorated(Clone)_primitive038", "treeDecorated(Clone)_primitive139", "treeDecorated(Clone)_primitive240", "treeDecorated(Clone)_primitive341"];
        for (let i = 0; i < fancytreelist.length; i++) {
            fancytree.addChild(models[fancytreelist[i]]);
        }
        fancytree.addChild(cabinmeshes["star7"]);
        let lightpost1list = ["lightpost(Clone)_primitive042", "lightpost(Clone)_primitive143"];
        for (let i = 0; i < lightpost1list.length; i++) {
            lightpost1.addChild(models[lightpost1list[i]]);
        }
        let lightpost2list = ["lightpost(Clone)_primitive081", "lightpost(Clone)_primitive182"];
        for (let i = 0; i < lightpost2list.length; i++) {
            lightpost2.addChild(models[lightpost2list[i]]);
        }
        let snowman1list = ["snowman(Clone)_primitive047", "snowman(Clone)_primitive148", "snowman(Clone)_primitive249"];
        for (let i = 0; i < snowman1list.length; i++) {
            snowman1.addChild(models[snowman1list[i]]);
        }
        let snowman2list = ["snowmanFancy(Clone)_primitive050", "snowmanFancy(Clone)_primitive151", "snowmanFancy(Clone)_primitive252", "snowmanFancy(Clone)_primitive353", "snowmanFancy(Clone)_primitive454"];
        for (let i = 0; i < snowman2list.length; i++) {
            snowman2.addChild(models[snowman2list[i]]);
        }
        let snowfortlist = ["snowFort(Clone)55"];
        snowfort = (new BABYLON.Mesh("snowfort", scene)).addChild(models[snowfortlist[0]]);
        masterMeshList.push(snowfort);
        let rockformationlist = ["rockFormationSmall(Clone)_primitive157", "rockFormationMedium(Clone)_primitive058", "rockFormationMedium(Clone)_primitive159"];
        for (let i = 0; i < rockformationlist.length; i++) {
            models[rockformationlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
            rockformations.push((new BABYLON.Mesh("rockformation" + i, scene)).addChild(models[rockformationlist[i]]));
        }
        let largerockformationlist = ["rockFormationLarge(Clone)_primitive180", "rockFormationLarge(Clone)_primitive079"];
        let largerockform = new BABYLON.Mesh("lagrerockformation", scene);
        for (let i = 0; i < largerockformationlist.length; i++) {
            largerockform.addChild(models[largerockformationlist[i]]);
            largerockform.scaling = new BABYLON.Vector3(16, 16, 16);
        }
        rockformations.push(largerockform);
        let rockformation2list = ["rockFormationLarge(Clone)_primitive093", "rockFormationLarge(Clone)_primitive194"];
        let largerockform2 = new BABYLON.Mesh("lagrerockformation2", scene);
        for (let i = 0; i < rockformation2list.length; i++) {
            largerockform2.scaling = new BABYLON.Vector3(16, 16, 16);
            largerockform2.addChild(models[rockformation2list[i]]);
        }
        rockformations.push(largerockform2);
        for (let i = 0; i < rockformations.length; i++) {
            masterMeshList.push(rockformations[i]);
        }

        let snowpatchlist = ["snowPatch(Clone)60", "snowPatch(Clone)83", "snowPatch(Clone)95"];
        for (let i = 0; i < snowpatchlist.length; i++) {
            models[snowpatchlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
            snowpatches.push((new BABYLON.Mesh("snowpatch" + i, scene)).addChild(models[snowpatchlist[i]]));
            masterMeshList.push(snowpatches[i]);
        }

        let trainlist = ["trackCorner(Clone)_primitive0109", "trackCorner(Clone)_primitive1110", "trackCorner(Clone)_primitive2111", "trackCornerLarge(Clone)_primitive0112", "trackCornerLarge(Clone)_primitive1113", "trackCornerLarge(Clone)_primitive2114", "trackStraight(Clone)_primitive0115", "trackStraight(Clone)_primitive1116", "trackStraight(Clone)_primitive2117", "trackCorner(Clone)_primitive0118", "trackCorner(Clone)_primitive1119", "trackCorner(Clone)_primitive2120", "trackStraight(Clone)_primitive0121", "trackStraight(Clone)_primitive1122", "trackStraight(Clone)_primitive2123", "trackCornerLarge(Clone)_primitive0124", "trackCornerLarge(Clone)_primitive1125", "trackCornerLarge(Clone)_primitive2126", "trackCornerLarge(Clone)_primitive0127", "trackCornerLarge(Clone)_primitive1128", "trackCornerLarge(Clone)_primitive2129", "trackStraight(Clone)_primitive0130", "trackStraight(Clone)_primitive1131", "trackStraight(Clone)_primitive2132", "trackCornerLarge(Clone)_primitive0133", "trackCornerLarge(Clone)_primitive1134", "trackCornerLarge(Clone)_primitive2135", "trackCorner(Clone)_primitive0136", "trackCorner(Clone)_primitive1137", "trackCorner(Clone)_primitive2138", "trackCorner(Clone)_primitive0139", "trackCorner(Clone)_primitive1140", "trackCorner(Clone)_primitive2141", "trackStraight(Clone)_primitive0142", "trackStraight(Clone)_primitive1143", "trackStraight(Clone)_primitive2144", "wheel_primitive0145", "wheel_primitive1146", "wheel_primitive0147", "wheel_primitive1148", "trainLocomotive(Clone)_primitive0149", "trainLocomotive(Clone)_primitive1150", "wheel_primitive0151", "wheel_primitive1152", "wheel_primitive0153", "wheel_primitive1154", "wheel_primitive0155", "wheel_primitive1156", "wheel_primitive0157", "wheel_primitive1158", "trainTender(Clone)_primitive0159", "trainTender(Clone)_primitive1160", "wheel_primitive0161", "wheel_primitive1162", "wheel_primitive0163", "wheel_primitive1164", "trainWagon(Clone)_primitive0165", "trainWagon(Clone)_primitive1166", "trainWagon(Clone)_primitive2167", "trainWagon(Clone)_primitive3168", "log169", "log170", "log171", "log172", "log173", "wheel_primitive0174", "wheel_primitive1175", "wheel_primitive0176", "wheel_primitive1177", "trainWagonFlat(Clone)_primitive0178", "trainWagonFlat(Clone)_primitive1179"];
        for (let i = 0; i < trainlist.length; i++) {
            //models[trainlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
            train.addChild((new BABYLON.Mesh("train" + i, scene)).addChild(models[trainlist[i]]));
        }

        cabin1.position.x += 20;
        cabin2.position.y += 20;

        //scale meshes up

        sled.scaling = new BABYLON.Vector3(16, 16, 16);
        campfire.scaling = new BABYLON.Vector3(16, 16, 16);
        bench1.scaling = new BABYLON.Vector3(16, 16, 16);
        bench2.scaling = new BABYLON.Vector3(16, 16, 16);
        present1.scaling = new BABYLON.Vector3(16, 16, 16);
        present2.scaling = new BABYLON.Vector3(16, 16, 16);
        present3.scaling = new BABYLON.Vector3(16, 16, 16);

        tree1.scaling = new BABYLON.Vector3(16, 16, 16);
        tree2.scaling = new BABYLON.Vector3(16, 16, 16);
        tree3.scaling = new BABYLON.Vector3(16, 16, 16);
        tree4.scaling = new BABYLON.Vector3(16, 16, 16);
        tree5.scaling = new BABYLON.Vector3(16, 16, 16);
        tree6.scaling = new BABYLON.Vector3(16, 16, 16);
        tree7.scaling = new BABYLON.Vector3(16, 16, 16);
        tree8.scaling = new BABYLON.Vector3(16, 16, 16);
        fancytree.scaling = new BABYLON.Vector3(16, 16, 16);
        lightpost1.scaling = new BABYLON.Vector3(16, 16, 16);
        lightpost2.scaling = new BABYLON.Vector3(16, 16, 16);

        snowman1.scaling = new BABYLON.Vector3(16, 16, 16);
        snowman2.scaling = new BABYLON.Vector3(16, 16, 16);

        snowfort.scaling = new BABYLON.Vector3(16, 16, 16);
        cabin1.scaling = new BABYLON.Vector3(16, 16, 16);
        cabin2.scaling = new BABYLON.Vector3(16, 16, 16);
        train.scaling = new BABYLON.Vector3(16, 16, 16);

        //alter scalings slightly to fit meshes better
        let scaling = [{x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 0.44, y: 1, z: 0.55}, {
            x: 0.73,
            y: 2.98,
            z: 1.56
        }, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1, y: 1.57, z: 0.97}, {x: 0.2, y: 1, z: 0.06}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {
            x: 0.66,
            y: 0.82,
            z: 0.63
        }, {x: 1, y: 1, z: 1}, {x: 0.34, y: 0.48, z: 1.18}, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1.8, y: 2.77, z: 2.16}, {x: 1, y: 1, z: 1}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 0.57, y: 1.1, z: 0.48}, {x: 0.33, y: 2.55, z: 20}, {
            x: 0.35,
            y: 3,
            z: 20
        }, {x: 0.22, y: 1.01, z: 20}, {x: 1, y: 2.41, z: 1}, {x: 1, y: 3, z: 1}, {x: 1, y: 1, z: 1}, {
            x: 0.77,
            y: 2.23,
            z: 0.56
        }, {x: 0.59, y: 1.88, z: 0.73}, {x: 1, y: 2.01, z: 0.73}, {x: 0.59, y: 1.8, z: 0.77}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 0.7, y: 2.31, z: 0.74}, {x: 0.82, y: 3, z: 0.86}, {x: 1, y: 2.21, z: 1}, {x: 0.74, y: 3, z: 1}, {
            x: 0.93,
            y: 3,
            z: 1
        }, {x: 0.85, y: 2.38, z: 0.85}, {x: 0.87, y: 2.34, z: 0.84}, {x: 0.87, y: 2.68, z: 0.78}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 0.74, y: 3, z: 0.84}, {x: 0.87, y: 1.96, z: 0.89}, {x: 0.89, y: 2.33, z: 0.95}, {
            x: 0.89,
            y: 2.22,
            z: 0.91
        }, {x: 1, y: 2.42, z: 1}, {x: 1.21, y: 2.45, z: 1.53}, {x: 0, y: 0, z: 0}, {x: 0.91, y: 2.12, z: 1.12}, {
            x: 1,
            y: 1,
            z: 1
        }, {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x: 1, y: 1.95, z: 1}, {x: 0.19, y: 0.04, z: 0.16}, {
            x: 1,
            y: 0.67,
            z: 1
        }, {x: 1, y: 0.57, z: 1}, {x: 1, y: 1, z: 1}];

        //set timeout to let positions finish loading
        setTimeout(function () {
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].position = masterMeshList[i].getBoundingInfo().boundingBox.centerWorld;
                boxes[i].position.y -= 3;

                //see boundingboxes
                /*let outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
                outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
                outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);

                let outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
                outputplane.material.diffuseTexture = outputplaneTexture;
                outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
                outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                outputplane.material.backFaceCulling = false;

                //outputplaneTexture.getContext().clearRect(0, 140, 512, 512);
                outputplaneTexture.drawText(masterMeshList[i].name, null, 140, "bold 80px verdana", "white");

                outputplaneTexture.hasAlpha = true;

                outputplane.position.x = boxes[i].position.x;
                outputplane.position.y = boxes[i].position.y+30;
                outputplane.position.z = boxes[i].position.z;*/
            }
        }, 1000);

        //create bounding boxes (for physics approx.) and set positions
        for (let i = 0; i < masterMeshList.length; i++) {
            masterMeshList[i].position.x = poss[i].x;
            masterMeshList[i].position.y = poss[i].y;
            masterMeshList[i].position.z = poss[i].z;

            let bbb = null;
            if (masterMeshList[i].getChildren().length > 0)
                bbb = totalBoundingInfo(masterMeshList[i].getChildren());
            else
                bbb = masterMeshList[i].getBoundingInfo();
            masterMeshList[i].setBoundingInfo(bbb);
            //masterMeshList[i].showBoundingBox = true;
            var bb = masterMeshList[i].getBoundingInfo().boundingBox;
            var width = bb.maximum.x - bb.minimum.x;
            var height = bb.maximum.y - bb.minimum.y;
            var depth = bb.maximum.z - bb.minimum.z;


            var box = BABYLON.MeshBuilder.CreateBox("bb", {
                width: width * 16,
                height: height * 16,
                depth: depth * 16
            }, scene);
            box.material = new BABYLON.StandardMaterial("sm", scene);
            box.material.diffuseColor = BABYLON.Color3.Red();
            box.material.alpha = 0;
            box.position = bb.centerWorld;

            box.scaling.x = scaling[i].x;
            box.scaling.y = scaling[i].y;
            box.scaling.z = scaling[i].z;

            box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0.5,
                friction: 0.5
            }, scene);

            boxes.push(box);
        }
    };
    //create bounding box of multiple meshes
    var totalBoundingInfo = function (meshes) {
        var boundingInfo = meshes[0].getBoundingInfo();
        var min = boundingInfo.minimum.add(meshes[0].position);
        var max = boundingInfo.maximum.add(meshes[0].position);
        for (var i = 1; i < meshes.length; i++) {
            boundingInfo = meshes[i].getBoundingInfo();
            min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
            max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
        }
        return new BABYLON.BoundingInfo(min, max);
    };
    assetsManager.load();//load assets

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    //update key presses
    document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });

    //pointer lock handling
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

    //function to check if 2 arrays contents are equal
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

    // Allow exiting to account screen
    setInterval(() => {
        if (keys[ESC]) window.location.href = `${window.location.protocol}//${window.location.host}/login.html`
    }, 15);

    // Display exiting to account info
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    setTimeout(() => toastr.info("Press 'ESC' to exit to your account"), 1000);
}
