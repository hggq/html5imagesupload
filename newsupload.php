<?php
session_start();
$postdata = file_get_contents("php://input");
$postimg=json_decode($postdata,true);
$midpath="upimages/".'13'.date('w');
$basename=date("YmdHis").rand(10000,99999);

$marwebpath=dirname(dirname(__FILE__));


if(!file_exists($midpath)){
mkdir($midpath,0774);
chmod($midpath,0774);

mkdir($midpath."/_ico",0774);
chmod($midpath."/_ico",0774);
}
set_time_limit(200);
if(isset($postimg['pngimg'])){
	$data = $postimg['pngimg']; 
	$encodedData = str_replace(' ','+',$data);  
	$image=base64_decode($encodedData); 
	$filename=rand(10000,99999)."temp.jpg";   
	    $fp = fopen('tmp/'.$filename, 'w');  
        
        if(!$fp){
        	echo "error|temp dir is not create temp file!";
		    exit;	
        }


	    fwrite($fp, $image);  
	    fclose($fp);
		
		list($width, $height, $type, $attr)=getimagesize("tmp/".$filename);
		if($type!=3&&$type!=2&&$type!=1){
		    echo "error|not png or jpg file to up!";
		    exit;			
		}
		switch ($type) {
	  case 1:
		 $impng = imagecreatefromgif("tmp/".$filename); 
		 break;
	   case 2:
		 $impng = imagecreatefromjpeg("tmp/".$filename); 
		 break;
	   case 3:
		 $impng = imagecreatefrompng("tmp/".$filename); 
		 break;
	  }		
	  


	  if(!empty($postimg['orn'])) {
	      switch($postimg['orn']) {
	          case 8:
	              $impng = imagerotate($impng,90,0);
				  $tor=$height;
				  $height=$width;
				  $width=$tor;
	              break;
	          case 3:
	              $impng = imagerotate($impng,180,0);
	              break;
	          case 6:
	              $impng = imagerotate($impng,-90,0);
				  $tor=$height;
				  $height=$width;
				  $width=$tor;				  
	              break;
	      }
	  }
	  $extfile=".jpg";
	  if($type==1){
	  	  
		  if (!copy('tmp/'.$filename,$midpath."/".$basename.".gif")) {
	  	    echo "error|not move gif file !";
	  	    exit;
		  }
		  $extfile=".gif";
		  $im=$impng;
	  }else{
  	    $im = imagecreatetruecolor($width, $height);
  	    imagecopyresampled($im, $impng, 0, 0, 0, 0, $width, $height, $width,$height); 
  	    ImageJpeg($im,$midpath."/".$basename.".jpg",90); 
		ImageDestroy ($impng); 	  	
	  }
	  

     unlink('tmp/'.$filename);
		
}else{

   echo "error|post empty file!";
	exit;


}
//////////////////////////////////

echo $imgpic="upimages/13".date("w")."/".$basename.$extfile."|upimages/13".date("w")."/".$basename.$extfile;

?>