//---------------------------------------------------------------------------------
//- Resize

function AppResize(e){
	appObj.mainWidth		= Math.ceil(window.innerWidth);
	appObj.mainHeight		= Math.ceil(window.innerHeight); 
	appObj.canvasWidth		= Math.ceil(1.5*window.innerWidth);
	appObj.canvasHeight		= Math.ceil(1.5*window.innerHeight); 
	
	renderer.view.style.width	= appObj.mainWidth+"px";
	renderer.view.style.height	= appObj.mainHeight+"px";							
	renderer.view.width			= appObj.canvasWidth;
	renderer.view.height		= appObj.canvasHeight;
	
	renderer.resize(appObj.canvasWidth, appObj.canvasHeight);
	
	stage.position.set(Math.ceil(appObj.canvasWidth*0.5), Math.ceil(appObj.canvasHeight*0.5));
		
	//- 3D
	
	camera3d.aspect = window.innerWidth / window.innerHeight;	
	renderer3d.setSize( 1.5*window.innerWidth, 1.5*window.innerHeight );

	document.getElementById( 'canvas_three' ).style.width 	= appObj.mainWidth+"px";
	document.getElementById( 'canvas_three' ).style.height 	= appObj.mainHeight+"px";
	document.getElementById( 'canvas_three' ).width 		= 1.5*window.innerWidth;
	document.getElementById( 'canvas_three' ).height		= 1.5*window.innerHeight;
					
	//- POSITION OBJ
	
	appMc.mcGame.scale.set(1, 1);	
	appMc.mcUI.scale.set(1, 1);	
	
	if(appObj.mainWidth<appObj.mainHeight){	
		
		appMc.mcGame.scale.x = appObj.canvasWidth/1280;
		appMc.mcGame.scale.y = appMc.mcGame.scale.x;
		if(appMc.mcGame.scale.y*1280 < appObj.canvasHeight){
			appMc.mcGame.scale.y = appObj.canvasHeight/1280;
			appMc.mcGame.scale.x = appMc.mcGame.scale.y;
		}
		
		appMc.mcUI.scale.x = appObj.canvasWidth/720;
		appMc.mcUI.scale.y = appMc.mcUI.scale.x;
		if(appMc.mcUI.scale.y*1280 > appObj.canvasHeight){
			appMc.mcUI.scale.y = appObj.canvasHeight/1280;
			appMc.mcUI.scale.x = appMc.mcUI.scale.y;
		}
			
		camera3d.position.x = -2;
		camera3d.position.y = 2;
		camera3d.position.z = 0;
		camera3d.fov = 50;	
		camera3d.updateProjectionMatrix();
		camera3d.lookAt(new THREE.Vector3(0, 0, 0));
		
		appMc.mcDownload.x = 0;
		appMc.mcDownload.y = -145+appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcDownload.scale.set(1);
		
		appMc.mcBgFS.scale.x = 0.1 + appObj.canvasWidth/1280/appMc.mcUI.scale.x;
		appMc.mcBgFS.scale.y = 0.1 + appObj.canvasHeight/1280/appMc.mcUI.scale.x;
		
		appMc.mcBgOverlay.scale.x = 0.1 + appObj.canvasWidth/1280/appMc.mcUI.scale.x;
		appMc.mcBgOverlay.scale.y = 0.1 + appObj.canvasHeight/1280/appMc.mcUI.scale.x;
		
		appMc.mcBtnSound.x = 60-appObj.canvasWidth*0.5/appMc.mcUI.scale.y;
		appMc.mcBtnSound.y = -115+appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcBtnSound.scale.set(0.5);
		
		appMc.mcHelper.x = 0;
		appMc.mcHelper.y = 150-appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcHelper.scale.set(1);
			
	}else{
		
		appMc.mcGame.scale.x = appObj.canvasWidth/1280;
		appMc.mcGame.scale.y = appMc.mcGame.scale.x;
		if(appMc.mcGame.scale.y*1280 < appObj.canvasHeight){
			appMc.mcGame.scale.y = appObj.canvasHeight/1280;
			appMc.mcGame.scale.x = appMc.mcGame.scale.y;
		}
		
		appMc.mcUI.scale.x = appObj.canvasWidth/1280;
		appMc.mcUI.scale.y = appMc.mcUI.scale.x;	
		if(appMc.mcUI.scale.y*720 > appObj.canvasHeight){
			appMc.mcUI.scale.y = appObj.canvasHeight/720;
			appMc.mcUI.scale.x = appMc.mcUI.scale.y;
		}
			
		camera3d.position.x = -2;
		camera3d.position.y = 2;
		camera3d.position.z = 0;
		camera3d.fov = 25;	
		camera3d.updateProjectionMatrix();
		camera3d.lookAt(new THREE.Vector3(0, 0, 0));
		
		appMc.mcDownload.x = -215+appObj.canvasWidth*0.5/appMc.mcUI.scale.y;
		appMc.mcDownload.y = -125+appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcDownload.scale.set(1);
		
		appMc.mcBgFS.scale.x = 0.1 + appObj.canvasWidth/1280/appMc.mcUI.scale.x;
		appMc.mcBgFS.scale.y = 0.1 + appObj.canvasHeight/1280/appMc.mcUI.scale.x;
		
		appMc.mcBgOverlay.scale.x = 0.1 + appObj.canvasWidth/1280/appMc.mcUI.scale.x;
		appMc.mcBgOverlay.scale.y = 0.1 + appObj.canvasHeight/1280/appMc.mcUI.scale.x;
		
		appMc.mcBtnSound.x = 60-appObj.canvasWidth*0.5/appMc.mcUI.scale.y;
		appMc.mcBtnSound.y = -110+appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcBtnSound.scale.set(0.55);
		
		appMc.mcHelper.x = 0;
		appMc.mcHelper.y = 150-appObj.canvasHeight*0.5/appMc.mcUI.scale.y;
		appMc.mcHelper.scale.set(1);
				
	}
}