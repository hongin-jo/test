/*
//현재 서버 -->상용서버
var ser_type = "main";
*/

//현재 서버 -->개발서버
var ser_type = "developed";

if(ser_type == "main"){
	var config_url = "https://patron.digital/";
}else if(ser_type == "developed"){
	var config_url = "http://52.141.6.6/";
}