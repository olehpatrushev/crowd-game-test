
function LoadWorldModels(){
	var loaderGLTF = new THREE.GLTFLoader();	
	loaderGLTF.parse( dataJson["mWorld"], "", function(gltf){
		var i,j;
		
		appMc3d["mcWorld"] = new THREE.Group();		
		appMc3d["mcWorld"].gltf = gltf;
		appMc3d["mcWorld"].scene = gltf.scene;
		appMc3d["mcWorld"].add( gltf.scene );
		appMc3d["groupLevelCamera"].add( appMc3d["mcWorld"] );
		
		gltf.scene.traverse(function ( object ) {
			if(object.isSkinnedMesh){
				object.material = appMc3d["materialWorldS"];					
			}else if(object.isMesh){		
				object.material = appMc3d["materialWorld"];				
			}
				
			//-
			
			object.castShadow = true;
			object.receiveShadow = true;
			
			//-
			
			//ProcessSizeObject3d(object);
			
			//-
			
			appMc3d["mcWorld"][object.name] = object;			
		});
		
		//- mAllWall
		
		for(i=0; i<appMc3d["mcWorld"]["mAllWall"].children.length; i++){	
			appMc3d["mcWorld"]["mAllWall"].children[i].geometry.computeBoundingBox();
			
			ProcessSizeObject3d( appMc3d["mcWorld"]["mAllWall"].children[i] );
		}
		
		//- mAllWallHit
		
		for(i=0; i<appMc3d["mcWorld"]["mAllWallHit"].children.length; i++){			
			ProcessSizeObject3d( appMc3d["mcWorld"]["mAllWallHit"].children[i] );
		}
		
		appMc3d["mcWorld"]["mAllWallHit"].visible = false;
		
		//-
		
		LoadHeroModels();
		
	}, undefined, function ( error ) {});	
}

function LoadHeroModels(){
	var loaderGLTF = new THREE.GLTFLoader();	
	loaderGLTF.parse( dataJson["mHero"], "", function(gltf){
		var i,j;
		
		appMc3d["mcHero"] = new THREE.Group();		
		appMc3d["mcHero"].gltf = gltf;
		appMc3d["mcHero"].scene = gltf.scene;
		appMc3d["mcHero"].add( gltf.scene );
		appMc3d["groupLevelCamera"].add( appMc3d["mcHero"] );
		
		gltf.scene.traverse(function ( object ) {
			if(object.isSkinnedMesh){
				object.material = appMc3d["materialWorldS"];					
			}else if(object.isMesh){		
				object.material = appMc3d["materialWorld"];				
			}
				
			//-
			
			object.castShadow = true;
			object.receiveShadow = true;
			
			//-
			
			//ProcessSizeObject3d(object);
			
			//-
			
			appMc3d["mcHero"][object.name] = object;			
		});
		
		//-
		
		appMc3d["mcHero"].mixer = new THREE.AnimationMixer( gltf.scene );
		
		for(i=0; i<gltf.animations.length; i++){
			appMc3d["mcHero"].mixer.clipAction( gltf.animations[ i ] ).play();
		}
		
		SeekAnimationTime(appMc3d["mcHero"].mixer, 0);
		
		//-
		
		appMc3d["mcHero"].state = "Stand";
		
		appMc3d["mcHero"].speedA = 0.00;
		appMc3d["mcHero"].speedV = 0.02;
		
		appMc3d["mcHero"].speedToA = appMc3d["mcHero"].speedA;
		
		appMc3d["mcHero"]["mHeroB"].geometry.computeBoundingBox();
		
		//-
		
		InitGame();
		
	}, undefined, function ( error ) {});	
}

//-----------------------------------------------------

function SeekAnimationTime(animMixer, timeInSeconds){
	animMixer.time = 0;
	for(var i0=0; i0<animMixer._actions.length; i0++){
	  animMixer._actions[i0].time=0;
	}
	animMixer.update(timeInSeconds)
}

//-----------------------------------------------------

function InitGame(){
	
	//- Resize
	
	AppResize();
	window.addEventListener('resize', AppResize);
	
	//- Animation
	
	InitAnimation();
		
	//- EF
	
	StageEF();
			
}

//-----------------------------------------------------

function InitAnimation(){
	//- Animation
	
	appMc.mcMain.visible=true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";

	//-
	
	/*marker_init@start*/
	/*marker_init@end*/
	
	//-
	
	//EndGame();
}

//-----------------------------------------------------

function StageDown(e){
	numGlobalClick++;
	
	if(adPlatform.value=="unity" && params.modeOneCick.value==true && numGlobalClick>=2){
		
		ClickAd();
		
	}else{
		
		if(pauseGlobal){
			pauseGlobal = false;
			try{ gsap.globalTimeline.resume() }catch(e){}
		}
		
		//-
				
		if(stateGame == 0){
			stateGame = 1;
			
			if(!isGlobalActive){
				isGlobalActive = true;
				Howler.mute(!isGlobalSound);	
			}	
				
			if(params.playSounds.value){	
				//appSounds["sBg"].play();
				//appSounds["sBg"].fade(0, appSounds["sBg"].volume(), 1000);	
			}
			
			appMc.mcJoystickCursor.visible = false;
		}
		
		if(stateGame==1){
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
	
function StageMove(e){
	if(stateGame==1 && mouse.isDown){
		
		mouse.x = e.data.getLocalPosition(appMc.mcUI).x;
		mouse.y = e.data.getLocalPosition(appMc.mcUI).y;
		
		mouse.a = Math.atan2((mouse.y - mouse.downY), (mouse.x - mouse.downX));
		mouse.d = DistancePointToPoint(mouse.x, mouse.y, mouse.downX, mouse.downY);
		
		if(mouse.d > 100){ mouse.d = 100; }
		
		appMc.mcJoystickBar.x = mouse.d * Math.cos(mouse.a);
		appMc.mcJoystickBar.y = mouse.d * Math.sin(mouse.a);
		
		//-
		
		appMc3d["mcHero"].speedToA = mouse.a;
		appMc3d["mcHero"].state = "Run";
	}
}

function StageUp(e){
	if(stateGame==1 && mouse.isDown){
		appMc3d["mcHero"].state = "Stand";
	}
	
	appMc.mcJoystick.visible = false;
	
	mouse.isDown = false;
}	

//-----------------------------------------------------

var gameCloseMintegral = false;
function AdGameEnd(){	
	if(!gameCloseMintegral && adPlatform.value=="mintegral"){
		gameCloseMintegral = true;
		window.gameEnd && window.gameEnd();	
	}				
}

//-----------------------------------------------------

function EndGame(){
	if(stateGame != 10){
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
				
		if(params.fullscreenCta.value){
			gsap.set(appMc.mcBgFS,				{delay:1.0, overwrite: "none", visible:true});
		}
	
	}
}
