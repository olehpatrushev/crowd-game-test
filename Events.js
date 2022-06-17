const plateMapping = {};

async function LoadModels() {
    await LoadPlateModels();
    await LoadManModels();
    InitGame();
}

function LoadPlateModels() {
    return new Promise((resolve, reject) => {
        var loaderGLTF = new THREE.GLTFLoader();

        appMc3d["mcPlates"] = new THREE.Group();
        appMc3d["groupLevelCamera"].add(appMc3d["mcPlates"]);

        loaderGLTF.parse(dataJson["mPlate"], "", function (gltf) {
            for (let i = 0; i <= 2; i++) {
                let plate = appMc3d["mcPlate" + i] = new THREE.Group();
                plate.gltf = gltf;
                plate.scene = gltf.scene.clone();
                plate.add(plate.scene);
                appMc3d["mcPlates"].add(plate);

                plate.position.x = (i - 1) * 13;

                plate.isPlate = true;
                plate.plateIndex = i;

                gltf.scene.traverse(function (object) {
                    // if (object.isSkinnedMesh) {
                    //     object.material = appMc3d["materialWorldS"];
                    // } else if (object.isMesh) {
                    //     object.material = appMc3d["materialWorld"];
                    // }

                    object.castShadow = true;
                    object.receiveShadow = true;

                    appMc3d["mcPlate" + i][object.name] = object;
                });
            }

            resolve();
        }, undefined, function (error) {
            reject();
        });
    });
}

function LoadManModels() {
    return new Promise((resolve, reject) => {
        var loaderGLTF = new THREE.GLTFLoader();

        appMc3d["mcMen"] = new THREE.Group();
        appMc3d["groupLevelCamera"].add(appMc3d["mcMen"]);

        loaderGLTF.parse(dataJson["mMan"], "", function (gltf) {
            for (let i = 0; i < 32; i++) {
                let man = appMc3d["mcMan" + i] = new THREE.Group();
                man.gltf = gltf;
                man.scene = THREE.SkeletonUtils.clone(gltf.scene);
                man.add(man.scene);
                appMc3d["mcMen"].add(man);

                man.manIndex = i;
                man.isMan = true;

                let command = 0;
                if (Math.floor(i / 4) % 2 == 1) {
                    command = 1;
                }

                man.scene.traverse(function (object) {
                    object.material = appMc3d["materialManTypeS" + command];

                    object.castShadow = true;
                    object.receiveShadow = true;

                    man[object.name] = object;
                });

                man.mixer = new THREE.AnimationMixer(man.scene);

                for (let p = 0; p < gltf.animations.length; p++) {
                    man.mixer.clipAction(gltf.animations[p]).play();
                }

                SeekAnimationTime(man.mixer, 0);

                if (i < 16) {
                    PlaceManToPlate(man, appMc3d["mcPlate0"]);
                } else {
                    PlaceManToPlate(man, appMc3d["mcPlate1"]);
                }
            }

            renderer3d.clear(true, true, true);
            renderer3d.compile(appMc3d["mcMen"], camera3d);

            resolve();
        }, undefined, function (error) {
            reject();
        });
    });
}

//---------------------------------------------------------------------------------
function PlaceManToPlate(man, plate) {
    let placeFree = false;
    let index = null;
    if (!(plate.plateIndex in plateMapping)) {
        placeFree = true;
        index = 0;
        plateMapping[plate.plateIndex] = {};
    } else {
        for (let i = 0; i < 16; i++) {
            if (!(i in plateMapping[plate.plateIndex]) || plateMapping[plate.plateIndex][i] === null) {
                index = i;
                placeFree = true;
                break;
            }
        }
    }

    if (placeFree) {
        plateMapping[plate.plateIndex][index] = man.manIndex;
        man.position.x = plate.position.x;
        if (index % 2 == 0) {
            man.position.x -= 1;
        } else {
            man.position.x += 1;
        }
        man.position.z = -1.3 * Math.floor(index / 2);
    }
}


//-----------------------------------------------------

function SeekAnimationTime(animMixer, timeInSeconds) {
    animMixer.time = 0;
    for (var i0 = 0; i0 < animMixer._actions.length; i0++) {
        animMixer._actions[i0].time = 0;
    }
    animMixer.update(timeInSeconds)
}

//-----------------------------------------------------

function InitGame() {

    //- Resize

    AppResize();
    window.addEventListener('resize', AppResize);

    //- Animation

    InitAnimation();

    //- EF
    //
    if (ENABLE_ORBIT_CONTROLS) {
        window.orbitControls = new THREE.OrbitControls(camera3d, AppCanvas);
        window.orbitControls.update();
    }

    StageEF();
}

//-----------------------------------------------------

function InitAnimation() {
    //- Animation

    appMc.mcMain.visible = true;
    document.getElementById('main').style.visibility = "visible";
    document.getElementById('progress').style.display = "none";

    //-

    /*marker_init@start*/
    /*marker_init@end*/

    //-

    //EndGame();
}

//-----------------------------------------------------

function StageDown(e) {
    numGlobalClick++;

    if (adPlatform.value == "unity" && params.modeOneCick.value == true && numGlobalClick >= 2) {

        ClickAd();

    } else {

        if (pauseGlobal) {
            pauseGlobal = false;
            try {
                gsap.globalTimeline.resume()
            } catch (e) {
            }
        }

        //-

        if (stateGame == 0) {
            stateGame = 1;

            if (!isGlobalActive) {
                isGlobalActive = true;
                Howler.mute(!isGlobalSound);
            }

            if (params.playSounds.value) {
                //appSounds["sBg"].play();
                //appSounds["sBg"].fade(0, appSounds["sBg"].volume(), 1000);
            }

            appMc.mcJoystickCursor.visible = false;
        }

        if (stateGame == 1) {
            mouse.isDown = true;

            mouse.x = mouse.downX = e.data.getLocalPosition(appMc.mcUI).x;
            mouse.y = mouse.downY = e.data.getLocalPosition(appMc.mcUI).y;

            appMc.mcJoystickCursor.visible = false;

            appMc.mcJoystick.visible = true;
            appMc.mcJoystick.x = mouse.x;
            appMc.mcJoystick.y = mouse.y;
            appMc.mcJoystickBar.x = 0;
            appMc.mcJoystickBar.y = 0;

        }

    }
}

function StageMove(e) {
    if (stateGame == 1 && mouse.isDown) {

        mouse.x = e.data.getLocalPosition(appMc.mcUI).x;
        mouse.y = e.data.getLocalPosition(appMc.mcUI).y;

        mouse.a = Math.atan2((mouse.y - mouse.downY), (mouse.x - mouse.downX));
        mouse.d = DistancePointToPoint(mouse.x, mouse.y, mouse.downX, mouse.downY);

        if (mouse.d > 100) {
            mouse.d = 100;
        }

        appMc.mcJoystickBar.x = mouse.d * Math.cos(mouse.a);
        appMc.mcJoystickBar.y = mouse.d * Math.sin(mouse.a);

        //-

        appMc3d["mcMan"].speedToA = mouse.a;
        appMc3d["mcMan"].state = "Run";
    }
}

function StageUp(e) {
    if (stateGame == 1 && mouse.isDown) {
        appMc3d["mcMan"].state = "Stand";
    }

    appMc.mcJoystick.visible = false;

    mouse.isDown = false;
}

//-----------------------------------------------------

var gameCloseMintegral = false;

function AdGameEnd() {
    if (!gameCloseMintegral && adPlatform.value == "mintegral") {
        gameCloseMintegral = true;
        window.gameEnd && window.gameEnd();
    }
}

//-----------------------------------------------------

function EndGame() {
    if (stateGame != 10) {
        stateGame = 10;

        //-

        mouse.isDown = false;

        //-

        /*marker_endgame@start*/
        /*marker_endgame@end*/

        //-

        //gsap.killTweensOf( appMc.mcGame );
        //gsap.killTweensOf( appMc.mcGame.scale );

        //gsap.to(appMc.mcDownload,		0.2, 	{delay:0.0, overwrite: "none", alpha:0});
        //gsap.set(appMc.mcDownload,		 	{delay:0.2, overwrite: "none", visible:false});

        //gsap.from(appMc.mcGame,		1.4, 	{delay:0.0, overwrite: "none", x:"+=0.5", y:"+=0.5", ease:Expo.easeOut});

        if (params.fullscreenCta.value) {
            gsap.set(appMc.mcBgFS, {delay: 1.0, overwrite: "none", visible: true});
        }

    }
}
