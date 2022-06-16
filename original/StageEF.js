//---------------------------------------------------------------------------------
//- EF

function StageEF(){				

	appObj.time_current = performance.now();				
	if(appObj.time_current - appObj.time_old > 25){
		if(!pauseGlobal){
			appObj.time_old = appObj.time_current;
			// 33 - 30 fps
			// 16 - 60 fps
			
			var i,j,k,d,a;
			var objTemp;
			var objTempExtra;
			var objTempHero = appMc3d["mcHero"];
			
			//console.time("Code");
			
			//- HERO
			
			if(objTempHero.state != objTempHero.old_state){
				objTempHero.old_state = objTempHero.state;
				SeekAnimationTime(objTempHero.mixer, 0/30);
			}
			
				//- stand
				
			if(objTempHero.state == "Stand"){
				
				objTempHero.mixer.update( 0.05 );	
				
				if(objTempHero.mixer.time >= 30/30){
					
					SeekAnimationTime(objTempHero.mixer, 0/30);
				
				}
			
			}else if(objTempHero.state == "Run"){
				
				objTempHero.mixer.update( 0.08 );	
				
				if(objTempHero.mixer.time >= 70/30){
					SeekAnimationTime(objTempHero.mixer, 40/30);
				}else if(objTempHero.mixer.time < 40/30){
					SeekAnimationTime(objTempHero.mixer, 40/30);
				}
					
				//- rotation
				
				while(objTempHero.speedToA - objTempHero.speedA > Math.PI){ objTempHero.speedToA -= 2*Math.PI; }
				while(objTempHero.speedA - objTempHero.speedToA > Math.PI){ objTempHero.speedToA += 2*Math.PI; }
				
				objTempHero.speedA = objTempHero.speedToA - 0.80*(objTempHero.speedToA - objTempHero.speedA);
				
				objTempHero.rotation.y = -objTempHero.speedA;
				while(objTempHero.rotation.y > 2*Math.PI){ objTempHero.rotation.y -= 2*Math.PI; }
				while(objTempHero.rotation.y < 0){ objTempHero.rotation.y += 2*Math.PI; }
				
				//- speed
				
				objTempHero.mx = objTempHero.position.x;
				objTempHero.mz = objTempHero.position.z;
						
				objTempHero.position.x += -objTempHero.speedV * Math.sin(objTempHero.speedA);
				objTempHero.position.z += objTempHero.speedV * Math.cos(objTempHero.speedA);
					
				//- [hit wall]
				
				for(i=0; i<appMc3d["mcWorld"]["mAllWall"].children.length; i++){
					objTempExtra = appMc3d["mcWorld"]["mAllWall"].children[i];
					
					if(DetectCollision3dCubes(objTempHero["mHeroB"], objTempExtra)){
						objTempExtra.material = appMc3d["materialDetect"];
					}else{
						objTempExtra.material = appMc3d["materialWorld"];			
					}
				}
				
				for(i=0; i<appMc3d["mcWorld"]["mAllWallHit"].children.length; i++){
					objTempExtra = appMc3d["mcWorld"]["mAllWallHit"].children[i];
					
					var _d = DistancePointToPoint(
						objTempHero.position.x,
						objTempHero.position.z,
						objTempExtra.position.x,
						objTempExtra.position.z
					);
					
					if(_d < objTempExtra.wx*0.5){
						var _a = Math.atan2((objTempHero.position.x - objTempExtra.position.x), (objTempHero.position.z - objTempExtra.position.z));
					
						objTempHero.position.x = objTempExtra.position.x;
						objTempHero.position.z = objTempExtra.position.z;			
						objTempHero.position.x += objTempExtra.wx*0.5*Math.sin(_a);
						objTempHero.position.z += objTempExtra.wx*0.5*Math.cos(_a);
						
						//-
						
						for(j=0; j<appMc3d["mcWorld"]["mAllWallHit"].children.length; j++){
							objTempExtra = appMc3d["mcWorld"]["mAllWallHit"].children[j];
							
							d = DistancePointToPoint(
								objTempHero.position.x,
								objTempHero.position.z,
								objTempExtra.position.x,
								objTempExtra.position.z
							);
							
							if(d < objTempExtra.wx*0.5){
								objTempHero.position.x = objTempHero.mx;
								objTempHero.position.z = objTempHero.mz;
								
								break;
							}
						}
					}
				}
			}
			
			//- ELEMENTS
			
			//if(appMc.mcBtn.visible){
			//	objTemp = appMc.mcBtnB;
			//	objTemp.a += 20;
			//	if(objTemp.a >= 360){
			//		objTemp.a -= 360;
			//	}
			//	objTemp.scale.set(1+0.015*Math.sin(objTemp.a*toRAD));
			//}
	
			if(appMc.mcDownload.visible){
				objTemp = appMc.mcDownloadS;
				
				objTemp.tm++;
				if(objTemp.tm > 150){
					objTemp.tm = 0;
					
					gsap.killTweensOf( appMc.mcDownloadS );
					gsap.killTweensOf( appMc.mcDownloadS.scale );					
					gsap.killTweensOf( appMc.mcDownloadBtnLight );
					gsap.killTweensOf( appMc.mcDownloadBtnLight.skew );
					
					appMc.mcDownloadS.scale.set(1);
					appMc.mcDownloadBtnLight.x = -280;
					appMc.mcDownloadBtnLight.rotation = 0;
					appMc.mcDownloadBtnLight.skew.x = 1.0;
					
					gsap.to(objTemp.scale,					0.30, 	{delay:1.00, overwrite: "none", x:1.05, y:1.05});
					gsap.to(objTemp.scale,					1.20, 	{delay:1.30, overwrite: "none", x:1.00, y:1.00, ease:Elastic.easeOut});
					
					gsap.to(appMc.mcDownloadBtnLight,		3.40, 	{delay:0.00, overwrite: "none", x:280, ease:Expo.easeInOut});
					gsap.to(appMc.mcDownloadBtnLight.skew,	3.00, 	{delay:0.00, overwrite: "none", x:-0.6, ease:Expo.easeInOut});
					
				}			
			}
			
			if(appMc.mcJoystickCursor.visible){
				objTemp = appMc.mcJoystickCursor;
				objTemp.a += 10;
				if(objTemp.a >= 360){ objTemp.a -= 360; }
				objTemp.x = 60*Math.cos(objTemp.a*toRAD);			
				objTemp.y = 60*Math.sin(objTemp.a*toRAD);
				objTemp.rotation = 0.1*Math.sin(objTemp.a*toRAD+1);
				
			}
			
			//- CAMERA
			
			objTemp = appMc3d["groupLevelShake"];
			
			if(objTemp.shakeD > 0){
				objTemp.shakeAX += 70;
				objTemp.shakeAY += 90;
				if(objTemp.shakeAX >= 360){ objTemp.shakeAX -= 360; }
				if(objTemp.shakeAY >= 360){ objTemp.shakeAY -= 360; }
				
				objTemp.position.x = 0.1 * objTemp.shakeD * Math.sin(objTemp.shakeAX * toRAD);
				objTemp.position.z = 0.1 * objTemp.shakeD * Math.sin(objTemp.shakeAY * toRAD);
				
				objTemp.shakeD *= 0.8;
				if(objTemp.shakeD < 0.01){
					objTemp.shakeD = 0;
				}			
			}
			
			objTemp = appMc3d["groupLevelCamera"];
			
			objTemp.to_x = -objTempHero.position.x;
			objTemp.to_y = -objTempHero.position.y;
			objTemp.to_z = -objTempHero.position.z;
			
			objTemp.position.x = objTemp.to_x - 0.85*(objTemp.to_x - objTemp.position.x);
			objTemp.position.y = objTemp.to_y - 0.85*(objTemp.to_y - objTemp.position.y);
			objTemp.position.z = objTemp.to_z - 0.85*(objTemp.to_z - objTemp.position.z);
			
			//-
			
			//console.timeEnd("Code");
			
		}
		
		//- 3D RENDER
		
		renderer3d.render( scene3d, camera3d );
		
		//- PIXI RENDER
		
		renderer.render(stage);
				
		//- RESIZE
		
		objTemp = appObj;
		
		objTemp.tm_resize++;
		if(objTemp.tm_resize == 10){
			objTemp.tm_resize = 0;
			
			if(objTemp.mainWidth != Math.ceil(window.innerWidth) || objTemp.mainHeight != Math.ceil(window.innerHeight)){
				AppResize();
			}
		}
	}
	
	//- RAF
	window.requestAnimationFrame(StageEF);
}
