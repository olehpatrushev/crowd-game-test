function InitBasicObj() {
    var i, j;

    //------------------------------------------------------------------------------------
    //- 3D WORLD

    //- Light

    appMc3d["lightAmbient"] = new THREE.AmbientLight(0xffffff, 1.0);
    main3d.add(appMc3d["lightAmbient"]);

    appMc3d["lightDirectional"] = new THREE.DirectionalLight(0xffffff, 0.3);
    appMc3d["lightDirectional"].position.set(10, 30, 5);
    appMc3d["lightDirectional"].castShadow = true;
    main3d.add(appMc3d["lightDirectional"]);

    appMc3d["lightDirectional"].shadow.camera.left = -2;
    appMc3d["lightDirectional"].shadow.camera.right = 2;
    appMc3d["lightDirectional"].shadow.camera.top = 2;
    appMc3d["lightDirectional"].shadow.camera.bottom = -2;

    appMc3d["lightDirectional"].shadow.mapSize.width = 1024;
    appMc3d["lightDirectional"].shadow.mapSize.height = 1024;

    //- groupDebug3d

    // var GridHelper3d = new THREE.GridHelper(100, 10, 0xcccccc, 0xcccccc);
    // var AxesHelper3d = new THREE.AxesHelper(100);
    // AxesHelper3d.position.y = 0.01;
    //scene3d.add( GridHelper3d );
    // scene3d.add(AxesHelper3d);

    //- MATERIALS

    moduleTexture.threeTextures["texture_world"].texture.magFilter = THREE.NearestFilter;
    moduleTexture.threeTextures["texture_world"].texture.wrapS = THREE.RepeatWrapping;
    moduleTexture.threeTextures["texture_world"].texture.wrapT = THREE.RepeatWrapping;
    moduleTexture.threeTextures["texture_world"].texture.flipY = false;

    appMc3d["materialWorldS"] = new THREE.MeshLambertMaterial({
        map: moduleTexture.threeTextures["texture_world"].texture,
        skinning: true,
        color: 0xffffff,
        emissive: 0x000000
    });
    appMc3d["materialWorld"] = new THREE.MeshLambertMaterial({
        map: moduleTexture.threeTextures["texture_world"].texture,
        skinning: false,
        color: 0xffffff,
        emissive: 0x000000
    });

    appMc3d["materialManTypeS0"] = new THREE.MeshStandardMaterial({color: 0xFFFF00, emissive: 0x000000, skinning: true});
    appMc3d["materialManTypeS1"] = new THREE.MeshStandardMaterial({color: 0xFF0000, emissive: 0x000000, skinning: true});

    appMc3d["materialPlate"] = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0x000000});

    appMc3d["materialDetect"] = new THREE.MeshLambertMaterial({color: 0xff0000, emissive: 0x000000});

    //- OBJS

    //- groupLevel

    appMc3d["groupLevel"] = new THREE.Group();
    main3d.add(appMc3d["groupLevel"]);

    appMc3d["groupLevelShake"] = new THREE.Group();
    appMc3d["groupLevelShake"].shakeAX = 0;
    appMc3d["groupLevelShake"].shakeAY = 0;
    appMc3d["groupLevelShake"].shakeD = 0;
    appMc3d["groupLevel"].add(appMc3d["groupLevelShake"]);

    appMc3d["groupLevelCamera"] = new THREE.Group();
    appMc3d["groupLevelShake"].add(appMc3d["groupLevelCamera"]);

    /*

    //- EffAttack

    appMc3d.idEffAttack = 0;

    for(i=0; i<20; i++){
        appMc3d["materialEffAttack"+i] 	= new THREE.SpriteMaterial({map:moduleTexture.threeTextures["eff_light"].texture, depthWrite: false, blending:THREE.AdditiveBlending, transparent:true, sizeAttenuation:true});

        appMc3d["mcEffAttack"+i]	= new THREE.Sprite( appMc3d["materialEffAttack"+i] );
        appMc3d["mcEffAttack"+i].visible = false;
        appMc3d["groupLevelShake"].add( appMc3d["mcEffAttack"+i] );
    }

    */
    /*
    appMc3d["geomCylinder"] 	= new THREE.CylinderGeometry( 3, 3, 2, 20 );
    appMc3d["materialCylinder"] = new THREE.MeshLambertMaterial({color: 0x964b00, emissive: 0x000000, flatShading: true});
    appMc3d["meshCylinder"] 	= new THREE.Mesh( appMc3d["geomCylinder"], appMc3d["materialCylinder"] );
    appMc3d["meshCylinder"].position.set(10, 0, 5);
    appMc3d["meshCylinder"].receiveShadow = true;
    appMc3d["groupLevel"].add( appMc3d["meshCylinder"] );
    */


    //-

    //------------------------------------------------------------------------------------
    //- 2D WORLD

    //- mcMain

    appMc.mcMain = new PIXI.Container();
    appMc.mcMain.visible = false;
    stage.addChild(appMc.mcMain);

    appMc.mcGame = new PIXI.Container();
    appMc.mcMain.addChild(appMc.mcGame);

    appMc.mcUI = new PIXI.Container();
    appMc.mcMain.addChild(appMc.mcUI);

    //- mcBgOverlay

    appMc.mcBgOverlay = new PIXI.Graphics();
    appMc.mcBgOverlay.beginFill(0x939393, 0.9);
    appMc.mcBgOverlay.drawRect(-1280 * 0.5, -1280 * 0.5, 1280, 1280);
    appMc.mcBgOverlay.endFill();
    appMc.mcBgOverlay.alpha = 0;
    appMc.mcUI.addChild(appMc.mcBgOverlay);

    // //- mcJoystick
    //
    // appMc.mcJoystick = new PIXI.Container();
    // appMc.mcJoystick.visible = false;
    // appMc.mcUI.addChild(appMc.mcJoystick);
    //
    // appMc.mcJoystickBg = new PIXI.Sprite();
    // appMc.mcJoystickBg.texture = moduleTexture.pixiTextures["ui_joystick_bg"];
    // appMc.mcJoystickBg.anchor.set(0.5, 0.5);
    // appMc.mcJoystick.addChild(appMc.mcJoystickBg);
    //
    // appMc.mcJoystickBar = new PIXI.Sprite();
    // appMc.mcJoystickBar.texture = moduleTexture.pixiTextures["ui_joystick_bar"];
    // appMc.mcJoystickBar.anchor.set(0.5, 0.5);
    // appMc.mcJoystick.addChild(appMc.mcJoystickBar);
    //
    // // appMc.mcJoystickCursor = new PIXI.Sprite();
    // // appMc.mcJoystickCursor.texture = moduleTexture.pixiTextures["cursor"];
    // // appMc.mcJoystickCursor.anchor.set(0.1, 0.0);
    // // appMc.mcJoystickCursor.a = 0;
    // // appMc.mcJoystick.addChild(appMc.mcJoystickCursor);

    //- mcHelper

    appMc.mcHelper = new PIXI.Container();
    appMc.mcUI.addChild(appMc.mcHelper);

    // appMc.mcHelperBg = new PIXI.Graphics();
    // appMc.mcHelperBg.beginFill(0x939393, 1);
    // appMc.mcHelperBg.drawRect(-550 * 0.5, -160 * 0.5, 550, 160);
    // appMc.mcHelperBg.endFill();
    // appMc.mcHelperBg.filterOutline = new PIXI.filters.OutlineFilter(4, 0xffffff);
    // appMc.mcHelperBg.padding = 10;
    // appMc.mcHelperBg.filterBlur = new PIXI.filters.BlurFilter();
    // appMc.mcHelperBg.filterShadow = new PIXI.filters.DropShadowFilter();
    // appMc.mcHelperBg.filterShadow.alpha = 0.2;
    // appMc.mcHelperBg.filterShadow.angle = 90 * toRAD;
    // appMc.mcHelperBg.filterShadow.blur = 12;
    // appMc.mcHelperBg.filterShadow.distance = 20;
    // appMc.mcHelperBg.filterShadow.color = 0x000000;
    // appMc.mcHelperBg.filters = [appMc.mcHelperBg.filterOutline, appMc.mcHelperBg.filterShadow, appMc.mcHelperBg.filterBlur];
    // appMc.mcHelper.addChild(appMc.mcHelperBg);

    // appMc.mcHelperT = PIXIText("Example text", {
    //     fontFamily: "font_baloo",
    //     fontSize: 50,
    //     color: 0xffffff,
    //     align: "center",			// left, right, center
    //     valign: "center",			// top, bottom, center
    //     letterSpacing: -3,
    //     lineHeight: 0,
    //     wordWrapWidth: 500,
    //     wordWrapHeight: 120,
    //     wordWrap: true
    // });
    // appMc.mcHelperT.x = 0;
    // appMc.mcHelperT.y = 0;
    // appMc.mcHelper.addChild(appMc.mcHelperT);

    //- mcDownload

    appMc.mcDownload = new PIXI.Container();
    appMc.mcUI.addChild(appMc.mcDownload);

    appMc.mcDownloadS = new PIXI.Container();
    appMc.mcDownloadS.tm = 50;
    appMc.mcDownload.addChild(appMc.mcDownloadS);

    appMc.mcDownloadBtnBg = new PIXI.Sprite();
    appMc.mcDownloadBtnBg.texture = moduleTexture.pixiTextures["btn_download"];
    appMc.mcDownloadBtnBg.tint = params.colorBtnInstall.value;
    appMc.mcDownloadBtnBg.anchor.set(0.5, 0.5);
    appMc.mcDownloadBtnBg.filterShadow = new PIXI.filters.DropShadowFilter();
    appMc.mcDownloadBtnBg.filterShadow.alpha = 0.1;
    appMc.mcDownloadBtnBg.filterShadow.angle = 90 * toRAD;
    appMc.mcDownloadBtnBg.filterShadow.blur = 4;
    appMc.mcDownloadBtnBg.filterShadow.distance = 10;
    appMc.mcDownloadBtnBg.filterShadow.color = 0x000000;
    appMc.mcDownloadBtnBg.filters = [appMc.mcDownloadBtnBg.filterShadow];
    appMc.mcDownloadS.addChild(appMc.mcDownloadBtnBg);

    appMc.mcDownloadBtnLight = new PIXI.Sprite();
    appMc.mcDownloadBtnLight.texture = moduleTexture.pixiTextures["btn_light"];
    appMc.mcDownloadBtnLight.anchor.set(0.5, 0.5);
    appMc.mcDownloadBtnLight.blendMode = PIXI.BLEND_MODES.ADD;
    appMc.mcDownloadBtnLight.alpha = 0.6;
    appMc.mcDownloadBtnLight.x = -280;
    appMc.mcDownloadBtnLight.scale.y = 3;
    appMc.mcDownloadS.addChild(appMc.mcDownloadBtnLight);

    appMc.mcDownloadBtnMask = new PIXI.Sprite();
    appMc.mcDownloadBtnMask.texture = moduleTexture.pixiTextures["btn_mask"];
    appMc.mcDownloadBtnMask.anchor.set(0.5, 0.5);
    appMc.mcDownloadS.addChild(appMc.mcDownloadBtnMask);

    appMc.mcDownloadBtnLight.mask = appMc.mcDownloadBtnMask;

    appMc.mcDownloadBtnT = PIXIText(params.textInstall.value, {
        fontFamily: "font_baloo",
        fontSize: 36,
        color: params.colorTextBtnInstall.value,
        align: "center",			// left, right, center
        valign: "center",			// top, bottom, center
        letterSpacing: -3,
        lineHeight: -5,
        wordWrapWidth: 260,
        wordWrapHeight: 80,
        wordWrap: false
    });
    appMc.mcDownloadBtnT.x = 0;
    appMc.mcDownloadBtnT.y = 0;
    appMc.mcDownloadS.addChild(appMc.mcDownloadBtnT);

    //- mcBgFS

    appMc.mcBgFS = new PIXI.Graphics();
    appMc.mcBgFS.beginFill(0x121214, 1);
    appMc.mcBgFS.drawRect(-1280 * 0.5, -1280 * 0.5, 1280, 1280);
    appMc.mcBgFS.endFill();
    appMc.mcBgFS.alpha = 0;
    appMc.mcBgFS.visible = false;
    appMc.mcUI.addChild(appMc.mcBgFS);

    //- mcBtnSound

    appMc.mcBtnSound = new PIXI.Container();
    if (adPlatform.value == "google") {
        appMc.mcBtnSound.visible = false;
    }
    appMc.mcUI.addChild(appMc.mcBtnSound);

    appMc.mcBtnSoundB = new PIXI.Sprite();
    appMc.mcBtnSoundB.texture = moduleTexture.pixiTextures["btn_sound_on"];
    appMc.mcBtnSoundB.anchor.set(0.5, 0.5);
    appMc.mcBtnSound.addChild(appMc.mcBtnSoundB);

    //-----------------------------------------------
    //- GAME


    //-----------------------------------------------
    //- SETTINGS

    //-----------------------------------------------
    //- SAVING OBJ

    //-----------------------------------------------
    //- EVENT

    appMc.mcBgOverlay.interactive = true;
    appMc.mcBgOverlay.on('pointerdown', StageDown);
    appMc.mcBgOverlay.on('pointermove', StageMove);
    appMc.mcBgOverlay.on('pointerup', StageUp);
    appMc.mcBgOverlay.on('pointerout', StageUp);
    appMc.mcBgOverlay.on('pointeroutside', StageUp);
    appMc.mcBgOverlay.on('touchendoutside', StageUp);

    appMc.mcBtnSound.interactive = true;
    appMc.mcBtnSound.on('pointerup', BtnGlobalSound);

    appMc.mcDownload.interactive = true;
    appMc.mcDownload.on('pointerdown', ClickAd);

    appMc.mcBgFS.interactive = true;
    appMc.mcBgFS.on('pointerup', ClickAd);
    if (params.modeOneCick.value && adPlatform.value != "unity") {
        appMc.mcBgFS.visible = true;
    }
}
