const plateMapping = {};
var currentMovement = null;

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

                plate.traverse(function (object) {
                    if (object.isMesh) {
                        object.material = appMc3d["materialPlate"].clone();
                    }

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

                man.command = command;

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
            if (!(i in plateMapping[plate.plateIndex])) {
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

            // appMc.mcJoystickCursor.visible = false;
        }

        if (stateGame == 1) {
            mouse.isDown = true;

            UpdateMousePosition(e);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera3d);
            const intersects = raycaster.intersectObjects(appMc3d["mcPlates"].children, true);
            if (intersects.length) {
                let object = null;
                if (!("isPlate" in intersects[0].object)) {
                    intersects[0].object.traverseAncestors((ancestor) => {
                        if (object === null && ancestor.isPlate === true) {
                            object = ancestor;
                        }
                    });
                } else {
                    object = intersects[0].object;
                }

                if (!(object.plateIndex in plateMapping && Object.keys(plateMapping[object.plateIndex]).length > 0)) {
                    object = null;
                }

                if (object !== null) {
                    currentMovement = {
                        sourceObject: object
                    };
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.material.color = new THREE.Color(0x008000);
                        }
                    });
                }
            }
        }

    }
}

function StageMove(e) {
    if (stateGame == 1 && mouse.isDown && currentMovement !== null) {
        UpdateMousePosition(e);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera3d);
        const intersects = raycaster.intersectObjects(appMc3d["mcPlates"].children, true);
        if (intersects.length) {
            let object = null;
            if (!("isPlate" in intersects[0].object)) {
                intersects[0].object.traverseAncestors((ancestor) => {
                    if (object === null && ancestor.isPlate === true) {
                        object = ancestor;
                    }
                });
            } else {
                object = intersects[0].object;
            }
            if (object !== null && object !== currentMovement.sourceObject && Object.keys(plateMapping[object.plateIndex] || {}).length < 16) {
                currentMovement.targetObject = object;
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material.color = new THREE.Color(0x0000FF);
                    }
                });
            }
        } else {
            if (currentMovement.targetObject) {
                currentMovement.targetObject.traverse((child) => {
                    if (child.isMesh) {
                        child.material.color = new THREE.Color(0xFFFFFF);
                    }
                });
                delete currentMovement.targetObject;
            }
        }
    }
}

function StageUp(e) {
    if (stateGame == 1 && mouse.isDown && currentMovement !== null) {
        if (currentMovement.targetObject && currentMovement.sourceObject) {
            let sourcePlateIndex = currentMovement.sourceObject.plateIndex;
            let targetPlateIndex = currentMovement.targetObject.plateIndex;
            if (Object.keys(plateMapping[targetPlateIndex] || {}).length < 16) {
                let sourceLastPlaceIndex = Object.keys(plateMapping[sourcePlateIndex]).length - 1;
                let sourceCommand = appMc3d["mcMan" + plateMapping[sourcePlateIndex][sourceLastPlaceIndex]].command;
                let targetLastPlaceIndex = Math.max(Object.keys(plateMapping[targetPlateIndex] || {}).length - 1, 0);
                let targetCommand;
                if (targetLastPlaceIndex > 0) {
                    targetCommand = appMc3d["mcMan" + plateMapping[targetPlateIndex][targetLastPlaceIndex]].command;
                } else {
                    targetCommand = sourceCommand;
                }
                if (sourceCommand == targetCommand) {
                    for (let i = sourceLastPlaceIndex; i >= 0; i--) {
                        let manIndex = plateMapping[sourcePlateIndex][i];
                        let man = appMc3d["mcMan" + manIndex];
                        if (man.command == sourceCommand) {
                            delete plateMapping[sourcePlateIndex][i];
                            man.plateIndex = targetPlateIndex;
                            PlaceManToPlate(man, appMc3d["mcPlate" + targetPlateIndex]);
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < appMc3d["mcPlates"].children.length; i++) {
            let mcPlate = appMc3d["mcPlates"].children[i];
            mcPlate.traverse((child) => {
                if (child.isMesh) {
                    child.material.color = new THREE.Color(0xFFFFFF);
                }
            });
        }
        currentMovement = null;
    }

    mouse.isDown = false;
}

function UpdateMousePosition(event) {
    let originalEvent = event.data.originalEvent;
    let target = originalEvent.target;
    if ("clientX" in event.data.originalEvent) {
        mouse.x = ((originalEvent.clientX - target.offsetLeft) / target.clientWidth) * 2 - 1;
        mouse.y = -((originalEvent.clientY - target.offsetTop) / target.clientHeight) * 2 + 1;
    } else if ("touches" in event.data.originalEvent) {
        mouse.x = ((originalEvent.touches[0].pageX - target.offsetLeft) / target.clientWidth) * 2 - 1;
        mouse.y = -((originalEvent.touches[0].pageY - target.offsetTop) / target.clientHeight) * 2 + 1;
    } else {
        console.warn("Unable to process event", event);
    }
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
