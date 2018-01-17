/*
* 手机上传图片插件
* 作者 黄自权
* 版本 1.01
* 
*/
(function($){
    $.fn.upload = function(options,data,callback){
        var defaults = {
			posturl:'upload.php'    
        };
        var sysdata = {
			ttid:0,
			ntid:0,
			owidth:640,
			oheight:640,
			autoup:true,
			orn:0  
        };
		var sdata=null;
		var fileup=false;
		var oFiles=null;
		var orn=0;
		var isios=null;
		var nwidth = 0; 
		var nheight = 0; 
		var newwidth = 0; 
		var newheight = 0; 
	
		var rFilter =/^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
        var options = $.extend(defaults, options);
		var sysdata = $.extend(sysdata, data);
        this.each(function(){
               //实现的功能设置    
			   $(this).bind("change",function(){
				   //保存上传的文件名
				nwidth = 0; 
				nheight = 0; 
				newwidth = 0; 
				newheight = 0; 
				   
				    oFiles= this.files;
					sdata=Array();
					$("#preview").html('');
					$.each(this.files,function(i,file){
						//取得exif信息
						fileup=false;
						sdata[i]=Array();
						sdata[i]['ttid']=sysdata.ttid;
						sdata[i]['ntid']=sysdata.ntid;
						sdata[i]['owidth']=sysdata.owidth;
						sdata[i]['oheight']=sysdata.oheight;
						sdata[i]['autoup']=sysdata.autoup;
						sdata[i]['orn']=0;
						
						FileExt=file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
						if(FileExt==".gif"){
							if(file.size>2024999){
								sdata[i]['autoup']=false;
							
							}
						}
					    EXIF.getData(file, function() {
					 	   	sdata[i]['orn'] = EXIF.getTag(this,'Orientation');
							sdata[i]['orn']=sdata[i]['orn']*1;
							switch(sdata[i]['orn']){
								case -90:
								sdata[i]['orn']=6;
								break;
								case 90:
								sdata[i]['orn']=8;
								break;
								case 180:
								sdata[i]['orn']=3;
								break;
							}
					    });//exif
 
						 var previewimg =new Image();
						    previewimg.setAttribute("id",i);
				 			previewimg.setAttribute("height",45);
				 			previewimg.setAttribute("width",45);
						    $("#preview").append(previewimg);    
						$('#showerror').html('正在读取文件'+file.name+'请稍候');
						sdata[i]['filename']=file.name;
					    var oReader = new FileReader();
					        oReader.onload = function(e){
								//gif图片直接上传
								FileExt=sdata[i]['filename'].substr(sdata[i]['filename'].lastIndexOf(".")).toLowerCase();
								//如果是gif文件直接pic拿到上传数据
								if(FileExt==".gif"){
									pic=e.target.result.substr(e.target.result.indexOf("base64,")+7);	
								}
								previewimg.onload = function (e) {
									//nwidth nheight 是全局变量
								nwidth=previewimg.naturalWidth;
								nheight=previewimg.naturalHeight;
								sdata[previewimg.id]['swidth']=nwidth;
								sdata[previewimg.id]['sheight']=nheight;
								console.log("原图宽+高："+nwidth+"+"+nheight);
								//缩放比例到owidth oheight
								sizemyimg(sysdata['owidth'],sysdata['oheight']);
								FileExt=sdata[i]['filename'].substr(sdata[i]['filename'].lastIndexOf(".")).toLowerCase();
								
								//取得原始图片数据，进行双线性插值缩放
				   				//newwidth;
				   			    //newheight;
				   			    /*
								if(nwidth>newwidth||nheight>newheight)
								{
								    var canvas =document.getElementById("oldimg");
								     canvas.width = nwidth;
								     canvas.height = nheight;

								     // Copy the image contents to the canvas
								     var ctx = canvas.getContext("2d");
								     ctx.drawImage(previewimg, 0, 0);
									 
									 var oldmdata=ctx.getImageData(0,0,nwidth,nheight);
									  */
									 /*
					    				newscanvas = document.getElementById("myCanvas");
					 				//新canvas高和宽
					    				newscanvas.width  = newwidth;
					    			    newscanvas.height = newheight;
									  var newctx = newscanvas.getContext("2d");
									  
									 */
									  /*
		var imagedata=scale(oldmdata.data,nwidth,nheight,newwidth,newheight);
									 
     canvas.width = newwidth;
     canvas.height = newheight;
									 // var imagedata=new ImageData(imageScaled, newwidth, newheight);
									  
			 console.log("处理缩放"+imagedata.width+" "+imagedata.height); 
									   ctx.putImageData(imagedata,0,0);
								}
							    
								 */
								 
								 
								 
								 
								//不是gif要用画布
								if(FileExt!=".gif"){
									drawimg(previewimg);
								}
								
								$('#showerror').html('图片处理完成，请点下面<font color=red>上传图片</font>');
								fileup=false;
						
							    if(sdata[previewimg.id]['autoup']){
									
									startUploading(sdata[previewimg.id]);
								}
        				};
		      previewimg.onerror=function(){

			      					$('#showerror').html('没有缩略图，请拍照或点上传按扭，有多张图片请继续上传');
									fileup=true;
								};
		previewimg.src="data:application/octet-stream;"+e.target.result.substr(e.target.result.indexOf("base64,"));	
		
  	  	}

							var ua = navigator.userAgent.toLowerCase();
							isios = ua.match(/ipad|iphone/i) != null;
							if(isios){
							   mpImg = new MegaPixImage(file);
							}
						    oReader.readAsDataURL(file);
							
					})
					
					//eachoFiles
			   });
   			function sizemyimg(icowidth,icoheight){
   				var widthratio=1;
   				var heightratio=1;
   				var RESIZEWIDTH=false;
   				var RESIZEHEIGHT=false;
   				    if((icowidth && nwidth > icowidth) || (icoheight && nheight >icoheight)){ 
   				    if(icowidth && nwidth > icowidth){ 
   				        widthratio = icowidth/nwidth; 
   				        RESIZEWIDTH=true; 
   				    } 
   				    if(icoheight && nheight > icoheight){ 
   				        heightratio = icoheight/nheight; 
   				        RESIZEHEIGHT=true; 
   				    } 
   				    if(RESIZEWIDTH && RESIZEHEIGHT)
   				     { 
   				        if(widthratio < heightratio)
   				          { 
   				                  ratio = widthratio; 
   				          }
   				      else{ 
   				            ratio = heightratio; 
   				          } 
   				    }else if(RESIZEWIDTH)
   				 	{ 
   				     	 ratio = widthratio; 
   				 	}else if(RESIZEHEIGHT)
   				 	{ 
   				 	    ratio = heightratio; 
   				 	} 
   				newwidth = Math.floor(nwidth * ratio); 
   				newheight =Math.floor(nheight * ratio); 
   			   }else{
   			   	newwidth = nwidth ; 
   			   	newheight = nheight;    	 
   			   }

   			}
   			function drawimg(oimg){

   				canvas = document.getElementById("myCanvas");
				//新canvas高和宽
   				canvas.width  = newwidth;
   			    canvas.height = newheight;
   				ctx = canvas.getContext('2d');

   			  ctx.fillStyle = "#ffffff";
   			 ctx.fillRect(0, 0, newwidth, newheight);
 
   			if(isios){
   			   mpImg.render(canvas, { maxWidth: newwidth, maxHeight: newheight, orientation: sysdata['orn'] });
   			     orn=1;
   			}else{
   			   ctx.drawImage(oimg, 0, 0, nwidth, nheight,0, 0, newwidth, newheight);

   			}
   			var theImgData = (ctx.getImageData(0, 0, canvas.width, canvas.height));

   			var myEncoder =new JPEGEncoder(90);

   			pic = myEncoder.encode(theImgData,90);

   			pic=pic.substr(pic.indexOf("base64,")+7);
   			}
   			function startUploading(pa) {
   				$('#showerror').html('正在上传'+pa['filename']+'请稍侯');
   			    var oXHR = new XMLHttpRequest();
   				if(typeof(callback) === "function"){
   			    oXHR.addEventListener('load', callback, false);					
   				}else{
   			    oXHR.addEventListener('load', uploadFinish, false);					
   				}        

   			    oXHR.open('POST',options['posturl']);
   				var value=null;
   				if(pic!=null){
   					 var value = '{"pngimg":"'+pic+'","ajaximg":"1"';
   					 var parmes='';
   					 for ( name in pa ) {
   					 	parmes+=',"'+name+'":"'+pa[name]+'"';
   					 }
   					parmes+='}';
   					value=value+parmes;
   				}else{
   						alert("请选择图片或拍照！");
   						return;		
   				}

   			 oXHR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
   			 oXHR.setRequestHeader('Content-Length', value.length);
   			 oXHR.send(value);

   			}
   			function uploadFinish(e) {
   			    var r= e.target.responseText.split("|");
   			   if(r[0]!='error')
   				{
   				  				   				  					$('#showerror').html('上传完成,可以继续重复上传图片');
   				}else{
   				   $('#showerror').html(r[1]);
   				}
   			}						         
		    });

    };
})($);