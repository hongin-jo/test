var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var ENTER = 13;
var WH = $(window).height();
var WW = $(window).width();

var data = null;

var is_alert = 0;//alert popup이 떠 있는가? 0:아님 1:떠있음;

//db정보===================================================================

//작품 db 정보
var list_artwork_db = new Array();

//작가 db 정보
var list_artist_db = new Array();

//컬렉션 db 정보
var list_col_db = new Array();

//전시회 db 정보
var list_exh_db = new Array();

//db정보===================================================================

//사운드 미리듣기 관련 변수 ================================================================
//사운드 미리듣기 변수
var is_presound;

//오디오 객체
var pre_audio = null; // = new Audio();

//2초 뒤 플레이 시키는 timer id
var twosecond;

//비디오 객체
var pre_video = null;
//사운드 미리듣기 관련 변수 ================================================================

//경고창 팝업 관련 현재 포커스 된 객체
var focus_element = null;

//로딩 함수 관련 변수 ==========================================================
//로딩바가 있는가?
var is_loading;

var flowTime = null;
var flowTime2 = null;
var nowPerc = null;
var chart = null;
var loading_type = null;
//로딩 함수 관련 변수 ==========================================================

//로그인 여부
var is_login = 0;//기본 0 , 로그인 시 1

// 기가 단말 로그인 글로벌
var giga_DevId = null;
var giga_DevType = null;
var giga_Nickname = null;

var apistatus = 0;
var options = {};
var gapikey;
var gkeytype;

if(ser_type == "main"){
	gapikey ="RTUwMDQyMDh8R0JPWENPTU18MTYwMDY3MzQyNzc5Ng=="; // api key given from developer portal
	//options.keytype="GBOXDEVM"; // 개발자모드를 설정하고 사용하세요.
	gkeytype ="GBOXCOMM"; // 개발자센터에서 승인이 되어야 사용하실 수 있습니다.
}else if(ser_type == "developed"){

	gapikey ="RTUwMDQyMDh8R0JPWERFVk18MTYwMDY2NzU5ODAxNw=="; // api key given from developer portal
	gkeytype = "GBOXDEVM"; // 개발자모드를 설정하고 사용하세요.
	//options.keytype="GBOXCOMM"; // 개발자센터에서 승인이 되어야 사용하실 수 있습니
}

//기가 메세지 전송 변수
var pushDate = null;
var today_date; //오늘 날짜 넣을 함수

//오늘날짜
today_date = new Date();

//날짜 포맷 변환(2021-03-31 -->03312021)
var y = today_date.getFullYear();
var m = today_date.getMonth();
m = m + 1;
if(m < 10){
	m = '0' + m;
}
var d = today_date.getDate();
if(d < 10){
	d = '0' + d;
}
var mdy = m + d + y;//오늘 날짜 포맷 변환된 결과

//Cookies.set('pushDate', "test", { path: '', expires: 2 });//쿠키 현재 경로에 2일 간 저장

//console.log(mdy);
//confirm("오늘 날짜 : " + mdy);

//기가 발화 가이드

var gigaVoiceGuide = '<div id="voice-guide">' +
	'<div class="genie-voice-guide voice-guide-container">' +
	'<p class="guide-mic">' +
	'<i class="g-voice-icon">' +
	'<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" :style="`fill: ${this.color};`">' +
	'</svg>' +
	'</i>' +
	'<!-- 호출어 추가 -->' +
	'<!-- gigagenie.appinfo.getUserInfo - extra.kwsid으로 셋팅 -->' +
	'<span id=kws>KWS</span>' +
	'</p>' +
	'<p class="lolling-list">' +
	'<span>발화가이드01</span>' +
	'<span>발화가이드02</span>' +
	'<span>발화가이드03</span>' +
	'</p>' +
	'<p class="voice-guide-common">서비스를 종료하려면 “나가기”</p>' +
	'</div>' +
	'</div>';
var $current=0;
var $interval;
var timerR;

//전역 변수 end+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$(document).ready(function() {


	//gigainit()을 하면 gigagenie 객체에서 단말기 아이디, 모델명, 닉네임 알아올 수 있다.
	giga_DevId = "gid1";
	giga_DevType = "gigamodel";
	giga_Nickname = "테스트";
	console.log(giga_DevId, giga_DevType, giga_Nickname);
	// $.ajax({
	// 	url : "ajax_check_giga_user.php", //TODO 기가지니 유저 정보 가져오는 back과 연결
	// 	type : "post",
	// 	dataType : "json",
	// 	data :
	// 		{
	// 			giga_DevId : giga_DevId,
	// 			giga_DevType : giga_DevType,
	// 			giga_Nickname : giga_Nickname,
	// 		},
	// 	error:function(request,status,error){
	// 		console.log("code = "+ request.status +
	// 			" message = " + request.responseText +
	// 			" error = " + error);//
	// 	},
	// 	async : false,
	//
	// }).done(function(data) {
	// 	if(data.ret == true){
	// 		if(data.is_giga_user == 1){
	// 			//giga 회원임이 확인 되었고 로그인 처리 되었으면
	// 			//다음 동작 실행
	// 			//alert("test");
	// 		}else{
	// 			//giga 회원이 아직 아니면 동의 팝업
	// 			devIdPop();return;
	// 		}
	//
	// 	}else{
	// 		alert_pop(data.msg);
	// 	}
	// });
	// alert("test");

	//giga dev callback
	/*gigaAgree(giga_DevId, function (gid) {
		//common 에서는 찍히지 않는다
		 console.log('gid : ' + gid + 'giga_DevId : ' + giga_DevId + 'giga_DevType : ' +  giga_DevType + 'giga_Nickname : ' +  giga_Nickname);
	})*/
	//console.log(gkeytype);


	$('body').addClass('onlygiga');
	/* 2020.10.19 giga collection */
	$('div').attr('tabindex', '-1')


	$(':input[name="btnBack"]').on({
		focus : function(){
			////console.log('fo')
			$(this).children('i').removeClass('icon-goback-inacive').addClass('icon-goback-active')
		},
		blur : function(){
			////console.log('bl')
			$(this).children('i').removeClass('icon-goback-active').addClass('icon-goback-inacive')
		}
	})


	deviceWH();


	/* data-href */
	$('*[data-href]').click(function(){
		window.location = $(this).data('href');
		return false;
	});


	/* only number */
	$(".onlynum").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});

	$(document).on("keyup", ".onlynum", function(ev){	$(this).val( $(this).val().replace(/[^0-9]/g,""));	});
	$(document).on("keyup", ".onlyeng", function(ev){	$(this).val( $(this).val().replace(/[^\!-z]/g,"") ); });
	$(document).on("keyup", ".onlyengnum", function(ev){	$(this).val( $(this).val().replace(/[^\!-z0-9]/g,"") ); });
	$(document).on("keyup", ".touppercase", function(ev){	$(this).val( $(this).val().toUpperCase().replace(/[^\!-z]/g,"") ); });



	/* focus-menu */
	$('.headerInner a').on({
		focus : function(){
			//console.log("in");

			$('#headerArea').addClass('focus-menu');
			$('.section2').addClass('open-menu');
		},
		blur : function(){
			//console.log("out");

			$('#headerArea').removeClass('focus-menu');
			$('.section2').removeClass('open-menu');
		}
	});
	$('.headerInner').on({
		mouseover : function(){
			$('#headerArea').addClass('focus-menu');
			$('.section2').addClass('open-menu');
		},
		mouseout : function(){
			$('#headerArea').removeClass('focus-menu');
			$('.section2').removeClass('open-menu');
		}
	});


	// profile 유무에 따른 focus 변화 //
	$('.self-profile>a').on({

		focus : function(){
			//if(is_login != 1){
			//비로그인시에만 작동
			$('#p_img').attr('src', '/giga/@source/image/icon/2x/icon-profile-active@2x.png');
			//}
		},
		blur : function(){
			//if(is_login != 1){
			//비로그인시에만 작동
			$('#p_img').attr('src', '/giga/@source/image/icon/2x/icon-profile-inactive@2x.png');
			//}
		}

	});


	//페이지 로드될때 현재 페이지 정보 있으면 왼쪽 메뉴에 현재 페이지 정보와 일치하는 아이콘 선택
	var cur_page = $("#cur_page").val();

	//왼쪽 메뉴 아이콘 active 초기화
	$(".nav-menu-list > li").removeClass("active");

	switch(cur_page){
		case "artwork" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "artist" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "search" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "home" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "collection" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "exhibition" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "storage" :

			//현재 페이지 아이콘 선택
			$(".nav-" + cur_page).addClass("active");
			break;

		case "setting" :

			//현재 페이지 아이콘 선택
			$(".self-setting").addClass("active");
			break;

		case "account" :

			//현재 페이지 아이콘 선택
			$(".self-profile").addClass("active");

			//뒤로가기 인풋 네임 교체
			$("#btnBack").attr("name", "btnBackAcc");
			break;
	}

	/*
	$('body').append('<div style ="position: absolute; top: 300px; right: 300px; color: red; background-color: green; font-size: 50px; z-index: 999;" id="mmm"></div><div style ="position: absolute; top: 400px; right: 300px; color: blue; background-color: green; font-size: 50px; z-index: 999;" id="mmm2"></div><div style ="position: absolute; top: 500px; right: 300px; color: yellow; background-color: green; font-size: 50px; z-index: 999;" id="mmm3"></div><div style ="position: absolute; top: 600px; right: 300px; color: yellow; background-color: green; font-size: 50px; z-index: 999;" id="mmm4"></div>');
	setTimeout(function() {
		$('#mmm').text('window height: ' + WH + ' // window width: ' + WW);
		$('#mmm2').text('screen height: ' + screen.height + ' // screen width: ' + screen.width);
		$('#mmm3').text('back height: ' + $('#backimg').height() + ' // back width: ' + $('#backimg').width());
		$('#mmm4').text('player height: ' + $('#play_src').height() + ' // player width: ' + $('#play_src').width());
	}, 5000);
	*/
});

/* back */
$(document).on('click', ':input[name="btnBack"]', function(ev) {
	ev.preventDefault();
	window.history.back();
});

/* side-pop */
$(document).on('click', 'button[name="btnDetailInfo"]', function() {
	$('.box').fadeIn('slow');
	$('.side-pop').addClass('have-focus').css({'left':0});
	$('.btn-pop-close').focus();

});

$(document).on('click', '.btn-pop-close', function() {
	$('.side-pop').css({'left':'-50%'});
	$('.box').fadeOut();
	$('button[name="btnDetailInfo"]').focus();
});

/* contents toggle */
$(document).on('click', '.btn-toggle-content', function() {
	var btn = $(this);
	var toggleBox = btn.parent().next('.toggle-content');

	toggleBox.slideToggle(250);
	btn.toggleClass('active');
});

/* tab */
$(document).on('focus', '.tab-head a[href*="#"]', function(ev) {
	ev.preventDefault();
	var targetId = $(this).attr('href');
	$(this).parent().addClass('active').siblings().removeClass('active');
	$('.tab-contents').find(targetId).removeClass('disnone').siblings().addClass('disnone');
	console.log('?')
	//imgCheck();

});
$(document).on('click', '.tab-head a[href*="#"]', function(ev) {
	ev.preventDefault();
	var targetId = $(this).attr('href');
	$(this).parent().addClass('enter').siblings().removeClass('enter');
});


//alert popup창에서 확인 눌렀을 때 팝업 닫기
$(document).on("click", "#btnAccCor", function(){
	//팝업 닫기
	del_alert_pop();
	$("#like_pop").remove();
	focus_element.focus();
});

//alert popup창에서 확인 눌렀을 때 팝업 닫고 reload
$(document).on("click", "#btnAccCorReload", function(){
	//팝업 닫기
	del_alert_pop();
	location.reload();
});

//alert popup창에서 확인 눌렀을 때 팝업 닫고 뒤로가기
$(document).on("click", "#btnAccCorBack", function(){
	//팝업 닫기
	del_alert_pop();
	history.back();
});

//alert popup창에서 확인 눌렀을 때 팝업 닫고 reload
$(document).on("click", "#btnAccCorLogin", function(){
	//팝업 닫기
	del_alert_pop();
	location.href = "start_account.html";
});

//gexp popup창에서 예 눌렀을 때 팝업 닫고 reload
$(document).on("click", "#btnEnterPop", function(){
	//팝업 닫기
	$("#noy_pop").remove();
	is_alert = 0;
	location.href = "start_account.html";
});

//gexp popup창에서 아니오 눌렀을 때 팝업 닫고 reload
$(document).on("click", "#btnClosePop", function(){
	var cur_page = $("#cur_page").val();

	//팝업 닫고
	$("#noy_pop").remove();
	is_alert = 0;

	if(cur_page == "storage"){
		//보관함에서 아니오 누르면 back
		window.history.back();
	}else if(cur_page == "player"){
		//player 페이지에서는 팝업 닫고 컨트롤 UI 띄우기
		keyboardup();

		//키업 막아논거 풀기
		is_prevent_keyup = 0;
	}else{
		//보관함,player 이외의 페이지에서 닫기 눌렀을 때 팝업열릴때 포커스 위치에 포커스
		focus_element.focus();
	}


	/*행동 - ‘7일 체험 계정’ 사용시
	[보관함] 진입 -->back
	[감상]중 좋아요, [감상]중 컬렉션 담기 선택시 ->닫기 동작만*/


});


//함수 start ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//상세 페이지 로그 남기는 함수
function add_log_page(page_type, id){
	// $.ajax({
	// 	url : "ajax_add_log_page.php",  //TODO 상세 page 로그 남기는 함수
	// 	type : "post",
	// 	dataType : "json",
	// 	data :
	// 		{
	// 			page_type : page_type,
	// 			id : id,
	// 		},
	// 	error:function(request,status,error){
	// 		//alert("code = "+ request.status +
	// 		//" message = " + request.responseText +
	// 		//" error = " + error); // 실패 시 처리
	// 	},
	//
	// }).done(function(data){
	//
	// 	if(data.ret == true){
	//
	// 		//성공적으로 로그 기록
	//
	// 	}else{
	// 		//실패시
	// 		alert(data.msg);
	// 	}
	// });
}

//감상로그 기록 함수(한 작품 플레이 기준)--> 플레이어에서 감상(액자모드 감상 X)
function add_log_play(id_col, id_artwork, num_basic, num_org){

	//재생 시간 계산
	var play_time = obj.currentTime;

	//작품을 10초 미만으로 감상시에는 감상로그를 남기지 않는다.
	if(play_time < 10){
		return;
	}

	// $.ajax({
	// 	url : "ajax_add_log_play.php", //TODO 감상 로그 기록
	// 	type : "post",
	// 	dataType : "json",
	// 	data :
	// 		{
	// 			id_col : id_col,
	// 			id_artwork : id_artwork,
	// 			play_time : play_time,
	// 			num_basic : num_basic,
	// 			num_org : num_org,
	// 		},
	// 	error:function(request,status,error){
	// 		//alert("code = "+ request.status +
	// 		//" message = " + request.responseText +
	// 		//" error = " + error); // 실패 시 처리
	// 	},
	//
	// }).done(function(data){
	//
	// 	if(data.ret == true){
	//
	// 		//성공적으로 로그 기록
	//
	// 	}else{
	// 		//실패시
	// 		alert(data.msg);
	// 	}
	// });
}

//액자모드 감상로그 기록 함수(한 작품 플레이 기준)
function add_log_frame(id_col, id_artwork, Elased_time){

	if(!Elased_time){
		//경과시간 없다면  기록 남기지 않는다.
		return;
	}

	//작품을 10초 미만으로 감상시에는 감상로그를 남기지 않는다.
	if(Elased_time < 10){
		return;
	}

	// $.ajax({
	// 	url : "ajax_add_log_frame.php",   //TODO 액자모드 감상로그 기록
	// 	type : "post",
	// 	dataType : "json",
	// 	data :
	// 		{
	// 			id_col : id_col,
	// 			id_artwork : id_artwork,
	// 			Elased_time : Elased_time,
	// 		},
	// 	error:function(request,status,error){
	// 		//alert("code = "+ request.status +
	// 		//" message = " + request.responseText +
	// 		//" error = " + error); // 실패 시 처리
	// 	},
	//
	// }).done(function(data){
	//
	// 	if(data.ret == true){
	//
	// 		//성공적으로 로그 기록
	//
	// 	}else{
	// 		//실패시
	// 		alert(data.msg);
	// 	}
	// });
}

/* 컬렉션 오울 길이 늘리기 */
function owlStage (){
	var nowColll = $('.item-size-collection');
	var nowOwlWidth = nowColll.find('.owl-stage').width();
	var nowOwl0Width = nowColll.find('.owl-item').eq(0).width();
	var nowOwlLength = nowColll.find('.owl-item').length;
	////console.log(nowOwlWidth)
	var nowOwlWidth2 = nowOwlWidth + (nowOwl0Width * 2.2);

	nowColll.find('.owl-stage').css({'min-width':nowOwlWidth2});
}

/* device height width */
function deviceWH(){
	////console.log(WW, WH);
	$('#wrap').css({'height':WH, 'width':WW});
}

/* collection 2초후 커짐 */
function twoSec(){
	clearTimeout(timerR);
	$('.item-size-collection').find('.content-textarea-tags').removeClass('look2sec');
	$('.focus-on').addClass('wide-collection');
	timerR = setTimeout(function(){
		$('.focus-on').find('.content-textarea-tags').addClass('look2sec')
	},2350);

}
function twoSecFin(){
	$('.focus-on').removeClass('wide-collection');
	$('.focus-on').find('.content-textarea-tags').removeClass('look2sec')
	clearTimeout(timerR);
}

//카루셀 리스트 이미지 체크 함수
function imgCheck() {

	//클래스 img-sz 마다 비율을 읽어온다.
	$(".img-sz").each(function(){
		//이미지 비율
		var imgRatio = $(this).attr("imgRatio");

		imgRatio = Number(imgRatio);//숫자형으로 변환

		//div 사이즈
		var size = $(this).attr("size");

		//console.log(imgRatio, size);

		//div 비율
		var divRatio;

		switch(size){
			case "artwork" :
				divRatio = 225/400;
				break;

			case "artist" :
				divRatio = 300/216;
				break;

			case "col" :
				divRatio = 720/1280;
				break;

			case "exh" :
				divRatio = 225/820;
				break;
			case "profile" :
				divRatio = 50/50;
				break;
		}

		if(size == 'col'){
			if(imgRatio > divRatio){
				//세로로 길다
				$(this).find("img").css({'width':'118.519vh', 'height' : 'auto'});
			}else if(imgRatio < divRatio){
				//가로로 길다
				$(this).find("img").css({'width':'auto', 'height' : '66.667vh'});
			}else{
				$(this).find("img").css({'width':'118.519vh', 'height' : 'auto'});
			}
		}else{

			if(imgRatio > divRatio){
				//세로로 길다 (width 맞추기)
				$(this).find("img").css({'width':'100%', 'height' : 'auto'});
			}else if(imgRatio < divRatio){
				//가로로 길다 (height 맞추기)
				$(this).find("img").css({'width':'auto', 'height' : '100%'});
			}else{
				//그 외(width 맞추기)
				$(this).find("img").css({'width':'100%', 'height' : 'auto'});
			}
		}


	});
}

//js 에 저장된  작품 db 정보에서 작품 아이디로 해당 작품 정보 얻어오는 함수
function get_js_db_artwork(id_artwork){
	var artwork_db = null;

	for(var i=0; i<list_artwork_db.length; i++){
		var artwork = list_artwork_db[i];
		if(id_artwork == artwork.id){
			artwork_db = artwork;
			break;
		}
	}

	if(artwork_db == null){
		//작품 리스트 db에서 해당 아이디로 작품 정보 못 얻었을 때
		artwork_db = "empty";
	}

	return artwork_db;
}

//js 에 저장된  작가 db 정보에서 작가 아이디로 해당 작가 정보 얻어오는 함수
function get_js_db_artist(id_artist){
	var artist_db = null;

	for(var i=0; i<list_artist_db.length; i++){
		var artist = list_artist_db[i];
		if(id_artist === artist.id){
			artist_db = artist;
			break;
		}
	}

	if(artist_db == null){
		//작가 리스트 db에서 해당 아이디로 작가 정보 못 얻었을 때
		artist_db = "empty";
	}

	return artist_db;
}

//js 에 저장된  컬렉션 db 정보에서 컬렉션 아이디로 해당 컬렉션 정보 얻어오는 함수
function get_js_db_col(id_col){
	var col_db = null;

	for(var i=0; i<list_col_db.length; i++){
		var col = list_col_db[i];
		if(id_col == col.id){
			col_db = col;
			break;
		}
	}

	if(col_db == null){
		//컬렉션 리스트 db에서 해당 아이디로 컬렉션 정보 못 얻었을 때
		col_db = "empty";
	}

	return col_db;
}

//js 에 저장된  전시회 db 정보에서 전시 아이디로 해당 전시 정보 얻어오는 함수
function get_js_db_exh(id_exh){
	var exh_db = null;

	for(var i=0; i<list_exh_db.length; i++){
		var exh = list_exh_db[i];
		if(id_exh === exh.id){
			exh_db = exh;
			break;
		}
	}

	if(exh_db == null){
		//전시 리스트 db에서 해당 아이디로 전시 정보 못 얻었을 때
		exh_db = "empty";
	}

	return exh_db;
}

//플레이어에 게스트 모드로 접근시 플레이 하려고 했던 작품 아이디 쿠키 저장함수
function save_ck_play_id(id, type){

	Cookies.set("play_id", id, {expires: 31});
	Cookies.set("play_id_type", type, {expires: 31});
}

//저장된 플레이 아이디 쿠키 파괴 함수
function destroy_ck_play_id(){

	Cookies.remove('play_id');
	Cookies.remove('play_id_type');
}

//alert 창 대신 popup 띄우기
function alert_pop(msg){
	//현재 포커스 위치
	focus_element = document.activeElement;

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop acc-discord-pop focus-box focus-box-pop" id="alert_pop">' +
		'<div class="start-pop-wrap acc-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="' +
		'">' + msg + '</h3>' +
		'<button type="button" name="btnAccCor" id="btnAccCor" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#alert_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnAccCor").focus();

	is_alert = 1;
}

//alert 창 대신 popup 띄우기(확인 눌럿을 때 팝업 닫고 reload)
function alert_pop_reload(msg){
	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop acc-discord-pop focus-box focus-box-pop" id="alert_pop">' +
		'<div class="start-pop-wrap acc-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">' + msg + '</h3>' +
		'<button type="button" name="btnAccCor" id="btnAccCorReload" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#alert_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnAccCorReload").focus();

	is_alert = 1;
}

//alert 창 대신 popup 띄우기(확인 눌럿을 때 팝업 닫고 뒤로가기)
function alert_pop_back(msg){

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop acc-discord-pop focus-box focus-box-pop" id="alert_pop">' +
		'<div class="start-pop-wrap acc-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">' + msg + '</h3>' +
		'<button type="button" name="btnAccCor" id="btnAccCorBack" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#alert_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnAccCorBack").focus();

	is_alert = 1;

	if(is_alert == 1){
		//팝업 창이 떠 있는 상태에서 확인버튼 포커스 잃으면 다시 확인 버튼에 포커스 준다.
		$("#btnAccCorBack").blur(function(){
			$("#btnAccCorBack").focus();
		});
	}
}

//alert 창 대신 popup 띄우기(확인 눌럿을 때 팝업 닫고 로그인 페이지로 가기)
function alert_pop_login(msg){

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop acc-discord-pop focus-box focus-box-pop" id="alert_pop">' +
		'<div class="start-pop-wrap acc-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">' + msg + '</h3>' +
		'<button type="button" name="btnAccCor" id="btnAccCorLogin" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#alert_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnAccCorLogin").focus();

	is_alert = 1;
}

//alert 창 popup 제거
function del_alert_pop(){
	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	$("#alert_pop").remove();
	is_alert = 0;
}

//로딩페이지 부르기
function openLoading(callback){
	//$('body').append();
	loading_type = $("#loading_type").val();

	var loadHtml = "";

	switch(loading_type){

		case "player" : //player_artwork.html, player.html, 플레이어 관련 로딩

			//현재 페이지 로딩 페이지 선택
			loadHtml = "loading_player.html";
			break;

		case "loading2" : //왼쪽 메뉴 안보이는 로딩

			//현재 페이지 로딩 페이지 선택
			loadHtml = "loading2.html";
			break;

		default ://왼쪽 메뉴 보이는 로딩
			//현재 페이지 로딩 페이지 선택
			loadHtml = "loading.html";
			break;
	}

	//로딩 UI
	$('body').append('<div class="loading_screen"></div>');


	$('.loading_screen').load(loadHtml, function(){
		chart = window.chart = new EasyPieChart(document.querySelector('.chartP'), {
			//easing: 'easeOutElastic',
			//delay: 3000,
			barColor: '#2841fa',
			trackColor: '#fff',
			scaleColor: false,
			lineWidth: 5,
			trackWidth: 5,
			lineCap: 'butt',
			onStep: function(from, to, percent) {
				this.el.children[0].innerHTML = Math.round(percent);
			}
		});

		if(loading_type == "player"){
			//로딩 유형이 플레이어 일 때 로딩 함수
			loading_guage_player();
		}else{
			//로딩 유형이 플레이어 제외 다른 것일 때 로딩 함수
			//게이지 채우는 동작 함수
			loading_guage();
		}


		//callback 함수 있으면
		if(callback){
			//callback
			callback();
		}
	});

	is_loading = 1;
}

// 로딩 페이지 지우기
function closeLoading(){
	//로딩 UI 지우기
	$('.loading_screen').remove();

	is_loading = 0;
}

//로딩 게이지 채우기(일반)
function loading_guage() {
	nowPerc = 1;	//로딩게이지 숫자 시작

	$('.chartP').addClass('overthat2');//예술을 플레이 하다 문구 보이기

	//차트 게이지 채우기
	flowTime = setInterval(frame, 30);
}

//로딩 게이지 채우기(일반)
function frame() {

	if (nowPerc >= 85) {
		//85이 되면 일단 멈춘다.
		clearInterval(flowTime);

	} else {
		nowPerc++;
		chart.update(Math.round(nowPerc));	//시간마다 도형 채움
	}
}

//로딩 게이지 채우기(player)
function loading_guage_player() {
	nowPerc = 1;	//로딩게이지 숫자 시작

	$('.chartP').addClass('overthat2');//예술을 플레이 하다 문구 보이기

	flowTime = setInterval(frame_player, 30);
}

function frame_player() {

	if (nowPerc >= 85) {
		//85이 되면 시간을 바꾼다.
		clearInterval(flowTime);

		nowPerc++;
		chart.update(Math.round(nowPerc));	//시간마다 도형 채움

		flowTime2 = setInterval(frame_player2, 500);
	} else {
		nowPerc++;
		chart.update(Math.round(nowPerc));	//시간마다 도형 채움
		if(nowPerc > 10){
			//숫자표시
			$('.chartP').addClass('overthat');
			$('.loading_player_replace').text(nowPerc);
		}

	}
}

function frame_player2() {

	if (nowPerc >= 98) {
		//98이 되면 일단 멈춘다.
		clearInterval(flowTime2);
	} else {
		nowPerc++;
		chart.update(Math.round(nowPerc));	//시간마다 도형 채움
		//숫자표시
		$('.chartP').addClass('overthat');
		$('.loading_player_replace').text(nowPerc);

	}
}

//음악 플레이
function play_sound(sound_src){
	if(!sound_src){
		//사운드 정보가 없으면
		return;
	}
	twosecond = setTimeout(function(){
		pre_audio = new Audio();
		pre_audio.src = sound_src;//오디오 소스 (음원 주소)
		pre_audio.loop = true;
		pre_audio.autoplay = true;
	},2500);
}

//2초뒤 음악 플레이 timer 초기화
function clear_twosecond(){
	clearTimeout(twosecond);
}

//영상 플레이
function play_video(video_src){
	if(!video_src){
		//영상 정보가 없으면
		return;
	}
	twosecond = setTimeout(function(){
		//배경 이미지 안보이게
		$("#backimg").addClass("disnone");
		//영상 태그 보이게
		$("#video").removeClass("disnone");

		//video = $("#video");
		pre_video = document.getElementById("video");
		pre_video.src = video_src;
		pre_video.autoplay = true;
		pre_video.loop = true;
		//video.load();

	},2500);
}

//audio 초기화 함수
function audio_init(){
	if(pre_audio != null){
		//audio stop은 2개 동작.
		pre_audio.pause();
		pre_audio.currentTime = 0;

		pre_audio = null;
	}
}

//audio 일시정지 함수
function audio_paused(){
	if(pre_audio != null){
		//audio stop은 2개 동작.
		pre_audio.pause();
		pre_audio.currentTime = 0;

		//pre_audio = null;
	}
}

//video 초기화 함수
function video_init(){
	if(pre_video != null){
		//audio stop은 2개 동작.
		pre_video.pause();
		pre_video.currentTime = 0;

		pre_video = null;
	}
}

//video 일시정지 함수
function video_paused(){
	if(pre_video != null){
		//video stop은 2개 동작.
		pre_video.pause();
		pre_video.currentTime = 0;

		//pre_audio = null;
	}
}

//사운드 미리듣기 (작가)
function pre_sound_play_artist(id_artist){

	////console.log("pre_sound_play : " + id_artwork);
	////console.log("is_presound : " + is_presound);

	//미리듣기가 세팅 되어 있는지 조사
	if(is_presound == 1){

		//기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
		audio_init();

		//기존에 플레이 중인 영상이 있다면 멈춰야 한다.
		video_init();

		//해당 artist 정보 조회
		var artist = get_js_db_artist(id_artist);

		if(artist != "empty"){
			//작가 정보가 있으면
			if(artist.artwork_rep != 0){
				//console.log("play");
				//작가의 대표 작품이 있다면(작가관련 작품이 없을 때는  없다.)
				var is_video = artist.artwork_rep.is_video;

				if(is_video == 0){
					//작품의 사운드 정보 가져온다.
					var sound_src = artist.artwork_rep.sound.s_src;

					//비디오가 아니면 배경음악을 플레이한다.
					play_sound(sound_src);
				}else if(is_video == 1){
					//작품의 영상 정보를 가져온다.
					var video_src = artist.artwork_rep.hdVideo_src;
					//비디오 이면 영상을 플레이한다.
					play_video(video_src);
				}
			}
		}

	}
}

//사운드 미리듣기 (작품)
function pre_sound_play_artwork(id_artwork){

	////console.log("pre_sound_play : " + id_artwork);
	////console.log("is_presound : " + is_presound);

	//미리듣기가 세팅 되어 있는지 조사
	if(is_presound == 1){

		//기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
		audio_init();

		//기존에 플레이 중인 영상이 있다면 멈춰야 한다.
		video_init();

		//해당 작품 오디오 / 비디오 읽기
		var artwork = get_js_db_artwork(id_artwork);

		var is_video = artwork.is_video;

		if(is_video == 0){
			//작품의 사운드 정보 가져온다.
			var sound_src = artwork.sound.s_src;
			//비디오가 아니면 배경음악을 플레이한다.
			play_sound(sound_src);
		}else if(is_video == 1){
			//작품의 영상 정보를 가져온다.
			var video_src = artwork.hdVideo_src;
			//영상 플레이
			play_video(video_src);
		}

	}
}

//사운드 미리듣기 (컬렉션)
function pre_sound_play_col(id_col){

	////console.log("pre_sound_play : " + id_artwork);
	////console.log("is_presound : " + is_presound);

	//미리듣기가 세팅 되어 있는지 조사
	if(is_presound == 1){

		//기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
		audio_init();

		//기존에 플레이 중인 영상이 있다면 멈춰야 한다.
		video_init();

		//해당 col 정보
		var col = get_js_db_col(id_col);

		if(col != "empty"){
			//컬렉션 정보가 있을 때
			if(col.artwork_rep != 0){

				var is_video = col.artwork_rep.is_video;

				if(is_video == 0){
					//작품의 사운드 정보 가져온다.
					var sound_src = col.artwork_rep.sound.s_src;

					//비디오가 아니면 배경음악을 플레이한다.
					play_sound(sound_src);
				}else if(is_video == 1){
					//작품의 영상정보를 가져온다.
					var video_src = col.artwork_rep.hdVideo_src;

					//영상 플레이
					play_video(video_src);
				}
			}
		}

	}
}

//이미지 로드 완료여부 판별 함수
function preloadImages(urls, allImagesLoadedCallback){
	var loadedCounter = 0;
	var toBeLoadedNumber = urls.length;
	urls.forEach(function(url){
		preloadImage(url, function(){
			loadedCounter++;
			////console.log('Number of loaded images: ' + loadedCounter);

			if(loadedCounter == toBeLoadedNumber){
				allImagesLoadedCallback();
			}
		});
	});
	function preloadImage(url, anImageLoadedCallback){
		var img = new Image();
		img.src = url;
		img.onload = anImageLoadedCallback;
	}
}

//like popup  좋아요 팝업
function like_pop(msg){
	//현재 포커스 위치
	focus_element = document.activeElement;

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop acc-discord-pop focus-box focus-box-pop" id="like_pop">' +
		'<div class="start-pop-wrap acc-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-success-l"></i></div>' +
		'<h3 class="start-pop-head">' + msg + '</h3>' +
		'<button type="button" name="btnAccCor" id="btnAccCor" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#like_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnAccCor").focus();

	is_alert = 1;
}

//noy popup  아니오 또는 예 팝업
function noy_pop(){
	//현재 포커스 위치
	focus_element = document.activeElement;

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop focus-box focus-box-pop needlog-pop" id="noy_pop">' +
		'<div class="start-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">' + '로그인이 필요한 기능입니다<br />로그인 하시겠습니까' + '</h3>' +
		'<ul class="start-pop-bns clearfix">' +
		'<li class="fleft"><button type="button" name="btnClosePop" id="btnClosePop" class="focus-obj">취소</button></li>' +
		'<li class="fleft"><button type="button" name="btnEnterPop" id="btnEnterPop" class="focus-obj">확인</button></li>' +
		'</ul>' +
		'</div>' +
		'</div>';


	$("body").append(html);


	//확인 취소 버튼 키코드 이벤트 등록
	$(document).keyup(function(){
		var keycode = event.which || event.keyCode;

		if(keycode == 37){
			$("#btnClosePop").focus();
		}

		if(keycode == 39){
			$("#btnEnterPop").focus();
		}
	});

	//확인 버튼에 포커스
	$("#btnEnterPop").focus();

	console.log(up, right, left, down);

	is_alert = 1;
}

//noy popup  아니오 또는 예 팝업
function gexp_pop(){
	//현재 포커스 위치
	focus_element = document.activeElement;

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<aside class="start-pop focus-box focus-box-pop guestend-pop" id="guestend_pop">' +
		'<div class="start-pop-wrap a-center guestend-pop-wrap">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">게스트 기간이 만료되었습니다</h3>' +
		'<ul class="start-pop-bns clearfix">' +
		'<li class="fleft"><button type="button" name="btnCloseGuestendPop" id="btnCloseGuestendPop" class="focus-obj">취소</button></li>' +
		'<li class="fleft"><button type="button" name="btnEnterGuestendPop" id="btnEnterGuestendPop" class="focus-obj">지금 회원가입</button></li>' +
		'</ul>' +
		'</div>' +
		'</div>';


	$("body").append(html);
	$("#guestend_pop").show().css("opacity", "1");

	//확인 버튼에 포커스
	$("#btnEnterGuestendPop").focus();

	is_alert = 1;
}

// devIdPop 디바이스 사용 동의
function devIdPop() {
	//현재 포커스 위치
	focus_element = document.activeElement;

	var html = '<div class="devid-pop focus-box focus-box-pop" id="devid_pop">' +
		'<div class="devid-pop-wrap a-center">' +
		'<div class="devid-cover">' +
		'<div class="devid-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="devid-pop-head">' + '제3자 서비스 개인정보 이용 동의' + '</h3>' +
		'<div class="devid-table-area"><table><caption><colgroup><col><col></colgroup><tbody><tr><th scope="col">제공받는자</th><th scope="col">주식회사 노다멘</th></tr><tr><th>목적</th><th>우리집 갤러리 서비스 제공 및 문의 응대</th></tr><tr><th>항목</th><th>모델명, 단말번호 (DeviceID)</th></tr><tr><th>보유기간</th><th>서비스 제공기간</th></tr></tbody></caption></table></div>'+
		'<p class="devid-ment">동의를 거부할 경우 우리집 갤러리 서비스 이용이 불가합니다.</p>' +
		'</div>' +
		'<ul class="devid-pop-bns clearfix">' +
		'<li class="fleft"><button type="button" name="btnDisagreeDevid" id="btnDisagreeDevid" class="focus-obj" onclick="devIdPopDisagreee()">동의 안함</button></li>' +
		'<li class="fleft"><button type="button" name="btnAgreeDevid" id="btnAgreeDevid" class="focus-obj" onclick="devIdPopAgreee()">동의함</button></li>' +
		'</ul>' +
		'</div>' +
		'</div>';


	$("body").append(html);


	//확인 취소 버튼 키코드 이벤트 등록
	$(document).keyup(function(e){
		var keycode = event.which || event.keyCode;

		if(keycode == 37){
			$("#btnDisagreeDevid").focus();
		} else if(keycode == 39){
			$("#btnAgreeDevid").focus();
		}else{
			e.preventDefault();
		}
	});

	//확인 버튼에 포커스
	$("#btnAgreeDevid").focus();
}
//devIdPop disagree
function devIdPopDisagreee() {
	exitPatron();
	window.open('','_self').close();
}
//devIdPop agree
function devIdPopAgreee() {
	//일단 팝업만 종료 해놓았습니다
	$('#devid_pop').remove();

	//팝업종료 후 포커스
	$('#btn_exh_play').focus();
	//console.log('giga_DevId : ' + giga_DevId); giga_DevId 정상 출력됨 요 부분에서 giga_DevId, giga_DevType, giga_Nickname DB에 등록
}

//첫 진입 팝업 first_enter_pop
function first_enter_pop(){
	//기가 서비스용 함수;;
	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	//30일 체험하기 정보 세팅
	$.ajax({
		url : "ajax_insert_exp_period.php",
		type : "post",
		dataType : "json",
		data :
			{
			},
	}).done(function(data) {
		if(data.ret == true){
			//체험기간 정보 성공적 저장시

			//현재 포커스 위치
			focus_element = document.activeElement;

			//토스트 팝업
			var fe_msg = '<b>30일 체험하기 계정으로 진입하였습니다.</b><br />기간 만료 시 회원가입하시면 무료로 작품을 감상할 수 있습니다.';

			msgToastHtml.addClass('first_enter_toast');
			msgToastHtml.find('.toast-container').prepend('<div class="start-pop-icon"><i class="g-icon icon-popup-info"></i></div>');
			msgToastHtml.find('.msg-area').html('<p class="msg" style="white-space: nowrap;">' + fe_msg + '</p>')
			msgToastPopup();

			setTimeout(function(){
				//3초뒤 토스트 팝업 사라짐
				closeMsgToast();
				//페이지 갱신
				location.reload();
			}, 3000);


		}else{
			alert_pop(data.msg);
		}
	});

	/*
		var html = '<div class="start-pop focus-box focus-box-pop" id="first_enter_pop">' +
					'<div class="start-pop-wrap a-center">' +
						'<div class="start-pop-icon"><i class="g-icon icon-popup-info"></i></div>' +
						'<h3 class="start-pop-head">' + '파트론에 오신 것을 환영합니다' + '</h3>' +
						'<div class="start-pop-line" style="width: 55.55555555vh"></div>' +
						'<p class="start-pop-sent">현재 7일 체험하기 계정으로 진입하였습니다.<br />체험 기간이 만료되면 <b>회원가입 후 모든 작품을 무료로 감상</b>할 수 있습니다.</p>' +
						'<ul class="start-pop-bns clearfix">' +
							'<li class="fleft"><button type="button" name="btnClosePop" id="btnClosePop" class="focus-obj">지금 가입하기</button></li>' +
							'<li class="fleft"><button type="button" name="btn7dayPop" id="btn7dayPop" class="focus-obj">7일 체험하기</button></li>' +
						'</ul>' +
					'</div>' +
				'</div>';

		$("body").append(html);

		//확인 버튼에 포커스
		$("#btn7dayPop").focus();

		//팝업창 떠 있음
		is_alert = 1;

		//이벤트 ===============================================================
		//확인 취소 버튼 키코드 이벤트 등록
		$(document).keyup(function(){
			var keycode = event.which || event.keyCode;

			if(keycode == 37){
				$("#btnClosePop").focus();
			}

			if(keycode == 39){
				$("#btn7dayPop").focus();
			}
		});

		//지금 가입하기 버튼 누르면 qr 로그인 페이지로 이동
		$(document).on("click", "#btnClosePop", function(){
			//qr 로그인 페이지로 이동
			location.href = "qr_membership.html";
		});

		//7일 체험하기 눌렀을 때 7일 체험 하기 정보 저장후 다시 홈
		$(document).on("click", "#btn7dayPop", function(){
			//7일 체험하기 정보 저장 후 다시 홈
			$.ajax({
				url : "ajax_insert_exp_period.php",
				type : "post",
				dataType : "json",
				data :
				{
						 },


			}).done(function(data) {
				if(data.ret == true){
					//체험기간 정보 성공적 저장시 페이지 갱신
					location.reload();
				}else{
					alert_pop(data.msg);
				}
			});
		});

		//이벤트 ===============================================================
	*/

}

//체험기간 만료 진입 팝업 experience_expires_pop
function experience_expires_pop(){
	//현재 포커스 위치
	focus_element = document.activeElement;

	if(is_loading == 1){
		//로딩페이지가 떠 있으면 로딩창 지우기
		closeLoading();
	}

	var html = '<div class="start-pop focus-box focus-box-pop" id="first_enter_pop">' +
		'<div class="start-pop-wrap a-center">' +
		'<div class="start-pop-icon"><i class="g-icon icon-alert"></i></div>' +
		'<h3 class="start-pop-head">' + '체험 기간이 만료되었습니다' + '</h3>' +
		'<div class="start-pop-line" style="width: 55.55555555vh"></div>' +
		'<p class="start-pop-sent">사용중이던 30일 체험하기 기간이 만료되었습니다.<br /><b>회원가입 후 모든 작품을 무료로 감상</b>해 보세요.</p>' +
		'<button type="button" name="btnSAEnterPop" id="btnSAEnterPop" class="focus-obj">확인</button>' +
		'</div>' +
		'</div>';

	$("body").append(html);

	//확인 버튼에 포커스
	$("#btnSAEnterPop").focus();

	is_alert = 1;

	//확인 버튼 눌렀을 때 팝업 닫기
	$(document).on("click", "#btnSAEnterPop", function(){
		//모달 닫기
		$("#first_enter_pop").remove();

		//계정 선택 페이지 지금 가입하기 버튼에 포커스
		$('#btn_guest_join').focus();
	});
}

//toast
/* message modal */

var msgToastHtml = $('<div class="toast"><div class="toast-wrap"><div class="toast-container clearfix"><div class="msg-area"></div><span class="url"></span></div></div></div>');
function msgToastPopup() {
	$('body').append(msgToastHtml);

	is_alert = 1;//팝업창 떠 있음
}
/* closeMsgToast */
function closeMsgToast() {
	if ($('.toast').length > 0) {
		$('.toast').remove();
		$('body').removeClass('overflow');

		is_alert = 0; //팝업창 사라짐
	}
}


//giga ( 웹에서는 gigagenie 객체를 몰라서 이 밑으로 function 정의를 제외한 나머지 코드들은 실행 되지 않는다. 웹에선 javascript error로 뜬다. )

gigainit();

function vsctimer(){
	var $interval=setInterval(function(){voiceStepChange()},5000);
}

// voiceStepChange 발화가이드 내용 변경
function voiceStepChange (){
	//$(".voice-step-wrap").after($('.voice-step-wrap').clone());
	/*$(".voice-step-wrap").animate({bottom:"+=60rem"},1000,function(){
      $(this).css({"bottom":0});
      $(".voice-step-wrap").append( $(this).children(".voice-step").eq(0) );
    });*/
	var vswL = $(".voice-step").length;
	var vswLmo = vswL - 1;
	var vswH = (vswL * 60) + 'px';

	$current++;
	if($current==vswL)$current=0;

	//console.log($(".voice-step-wrap").css('bottom'))
	//console.log($current, vswLmo)

	if($current == vswLmo){
		$(".voice-step-wrap").animate({bottom: 0});
		$(".voice-step").eq(0).addClass('onVoice').siblings().removeClass('onVoice');
	}else{
		$(".voice-step-wrap").animate({bottom: '+=60'});
		$(".voice-step").eq($current+1).addClass('onVoice').siblings().removeClass('onVoice');
	}
}

vsctimer();
$(".voice-step").eq(0).addClass('onVoice');

//앱탈출
$(document).on("click", "#exit_app", function(){
	exitPatron();
});

/* giga 초기화 */
function gigainit(){
	options={};
	options.apikey = gapikey;
	options.keytype = gkeytype;

	gigagenie.init(options, function (result_cd, result_msg, extra) {
		//confirm("gigainit :" + result_cd)
		if (result_cd === 200) {

			giga_DevType = extra.devicetype;//기가 단말기 모델명 알아오는 곳

			//confirm("test");
			gigagenie.appinfo.getContainerId(options, function (result_cd, result_msg, extra) {
				if (result_cd === 200) {
					//confirm("The container id is " + extra.containerid);
					//confirm("The device id is " + extra.deviceid);
					giga_DevId = extra.deviceid;//기가 단말기 고유 아이디 알아오는 곳
				} else {
					//confirm("getContainerId is fail.");
				}
			});

			/* onRemoteKeyEvent  리모컨 키 이벤트 수신 API */
			gigagenie.media.onRemoteKeyEvent = function (extra) {
				//confirm("Getting onRemoteKeyEvent." + extra.key);

				if($('#content').hasClass('player__page')){
					if(extra.key == 'prev'){
						$("#btnControlPrev").trigger("click");
					}else{
						$("#btnControlNext").trigger("click");
					}
				}
			};

			//user 조회
			gigagenie.appinfo.getUserInfo(null, function (result_cd, result_msg, extra) {
				//confirm("getUserInfo:" + result_cd)

				if (result_cd === 200) {
					/*confirm('yyy' + extra.usernickname + extra.kwsid + extra.ispin + extra.regspeaker + extra.registwithapp)
                    var usernickname = extra.usernickname;
                    var kwsid = extra.kwsid;
                    var ispin = extra.ispin;
                    var regspeaker = extra.regspeaker;
                    var registwithapp = extra.registwithapp;
                    confirm("UserNickName:" + extra.usernickname + " kwsid:" + extra.kwsid + " ispin:" + extra.ispin + " regspeaker:" + extra.regsepaker + "registwithapp:" + extra.registwithapp);
                    if (ispin) confirm("ispin is true");
                    else confirm("ispin is false");*/
					//confirm('yyy' + extra.registwithapp)

					var usernickname = extra.usernickname;
					var kwsid = extra.kwsid;
					var ispin = extra.ispin;
					var regspeaker = extra.regspeaker;
					var registwithapp = extra.registwithapp;

					giga_Nickname = usernickname;//기가 회원 닉네임 알아오는 곳
				} else {
					//confirm("getUserInfo fail.");
				}
			});
			gigagenie.appinfo.getUserSetInfo(null, function (result_cd, result_msg, extra) {
				if (result_cd === 200) {
					var address = extra.address;
					console.log("RYC address:" + address);
				} else {
					console.log("getUserInfo fail.");
				}
			});

			gigagenie.payment.getOtvSaid(options, function (result_cd, result_msg, extra) {
				if (result_cd === 200) {
					console.log("RYC SAID: " + extra.said);
				} else {
					console.log("reqPayToken Fail");
				}
			});

			//push msg 앱으로 메시지 보냄(패트론 앱 접속시 하루에 한번만 보내기)
			pushDate = Cookies.get('pushDate');
			//console.log(pushDate);
			//confirm("pushDate : " + pushDate);

			//하루중 처음 접속했다....
			/*if(pushDate != mdy){
                //패트론 앱 하루중 처음 접속했으면 실행....
                options.target = 'COMP_APP';
                options.msgtype = 'EXEC_WEB';
                options.msg = 'https://benefit.kt.com/gigagenie/gallery/main.asp';
                 //'http://patron.digital/mobile';//사이트 주소입력
                options.popuptext ='우리집갤러리 이벤트 응모하고, 화보집과 스벅 받으세요!';
                gigagenie.appinfo.sendPushMsg(options, function (result_cd, result_msg, extra) {
                    if (result_cd === 200) {
                        //푸쉬 메세지 성공적으로 전송시
                        //confirm("Sending Push msg to companion app is Success");
                        //pushDate에 전송 날짜 저장
                        Cookies.set('pushDate', mdy, { path: '', expires: 2 });//쿠키 현재 경로에 2일 간 저장

                    } else {
                        console.log("Sending Push msg to companion app Set is fail.");
                    }
                });
            }*/
		}
		else{
			//confirm("init 실패");
		}
	});


}

// giga callback func
function gigaAgree(giga_DevId, callback) {
	callback(giga_DevId);
}

//getParameter
/*
var getParameter = function (param) {

    var returnValue;

    var url = location.href;

    //var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    for (var i = 0; i < parameters.length; i++) {

        var varName = parameters[i].split('=')[0];

        if (varName.toUpperCase() == param.toUpperCase()) {

            returnValue = parameters[i].split('=')[1];

            return decodeURIComponent(returnValue);

        }

    }

};
*/

//user 조회
/*gigagenie.appinfo.getUserInfo(null, function (result_cd, result_msg, extra) {
    confirm("getUserInfo" + result_cd)
    if (result_cd === 200) {
        var usernickname = extra.usernickname;
        var kwsid = extra.kwsid;
        var ispin = extra.ispin;
        var regspeaker = extra.regspeaker
        confirm("UserNickName:" + usernickname + " kwsid:" + kwsid + " regspeaker:" + regsepaker);
        if (ispin) confirm("ispin is true");
        else confirm("ispin is false");
    } else {
        confirm("getUserInfo fail.");
    }
});*/

/* onAppStatusChange callback */
gigagenie.init.onAppStatusChange = function (extra) {
	if (extra.changeStatus == 0) {
		if (extra.muteFlag == true) {
			// TODO: 일반적으로 서비스 종료 권고 //mute 상태 (음악 등 재생 불가)||지니야 프로그램 돌때 음성명령이 존재할때
			//exitPatron();
			//confirm("true");
			/*
            gigagenie.voice.svcFinished(null, function (result_cd, result_msg) {
                audio_init();
                video_init();
            });
            */
			return;
		} else {
			// TODO: Media Contents Resume //unmute 상태 (음악등 재생 가능)||지니야 프로그램 돌때 음성명령이 없을 때
			//confirm("false");
			//exitPatron();
			if(pre_audio != null){
				pre_audio.play();
			}

			if(pre_video != null){
				pre_video.play();
			}


		}
	} else {
		// TODO: Media Contents Pause|| 지니야 호출 시점
		//confirm("3");
		//exitPatron();
		audio_paused();
		video_paused();

	}
}


var giga_addr ='giga'

// 인텐트
gigagenie.voice.onActionEvent = function (extra) {

	//전체 파라미터 확인 : JSON.stringify(extra)

	var intent = extra.actioncode;

	switch (intent) {

		case 'CallArtistExh':
			// 카테고리 선택 인텐트가 호출된 경우
			var cata = extra.parameter['NE-ARTIST'];
			switch (cata) {
				case '서기환':
					window.location = config_url + giga_addr + "/docent.html?id_exh=26&is_voice=1";
					break;
				case '김창열':
					//alert("voice");
					window.location = config_url + giga_addr + "/docent.html?id_exh=23&is_voice=1";
					break;
				case '박서보':
					window.location = config_url + giga_addr + "/docent.html?id_exh=18&is_voice=1";
					break;
				case '고영훈':
					window.location = config_url + giga_addr + "/docent.html?id_exh=32&is_voice=1";
					break;
				case '이정웅':
					window.location = config_url + giga_addr + "/docent.html?id_exh=15&is_voice=1";
					break;
				case '쇠라':
					window.location = config_url + giga_addr + "/docent.html?id_exh=16&is_voice=1";
					break;
				case '드가':
					window.location = config_url + giga_addr + "/docent.html?id_exh=30&is_voice=1";
					break;
				case '피사로':
					window.location = config_url + giga_addr + "/docent.html?id_exh=13&is_voice=1";
					break;
				case '고흐':
					window.location = config_url + giga_addr + "/docent.html?id_exh=24&is_voice=1";
					break;
				case '고갱':
					window.location = config_url + giga_addr + "/docent.html?id_exh=10&is_voice=1";
					break;
				case '세잔':
					window.location = config_url + giga_addr + "/docent.html?id_exh=29&is_voice=1";
					break;
				case '마네':
					window.location = config_url + giga_addr + "/docent.html?id_exh=9&is_voice=1";
					break;
				case '모네':
					window.location = config_url + giga_addr + "/docent.html?id_exh=25&is_voice=1";
					break;
				default :
					window.location = config_url + giga_addr + "/docent.html?id_exh=3&is_voice=1";
			}

			break;

		case 'CallThemeExh':
			var cat = extra.parameter['NE-THEME'];
			switch (cat) {
				case '겨울':
					window.location = config_url + giga_addr + "/docent.html?id_exh=12&is_voice=1";
					break;
				case '신년':
					window.location = config_url + giga_addr + "/docent.html?id_exh=13&is_voice=1";
					break;
				case '정물화':
					window.location = config_url + giga_addr + "/docent.html?id_exh=2&is_voice=1";
					break;
				case '인상파':
					window.location = config_url + giga_addr + "/docent.html?id_exh=3&is_voice=1";
					break;
				//default :
				//window.location = config_url + giga_addr + "/docent.html?id_exh=3&is_voice=1";
			}

			break;

		case 'CallArtwork':

			var cat = extra.parameter['NE-ARTIST'];

			switch(cat) {
				case '서기환' :
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=1890&is_voice=1";
					break;
				case '김창열' :
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=658&is_voice=1";
					break;
				case '박서보' :
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=696&is_voice=1";
					break;
				case '고영훈' :
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=587&is_voice=1";
					break;
				case '이정웅' :
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=629&is_voice=1";
					break;
				case '쇠라':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=638&is_voice=1";
					break;
				case '드가':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=257&is_voice=1";
					break;
				case '피사로':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=421&is_voice=1";
					break;
				case '뭉크':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=10&is_voice=1";
					break;
				case '고흐':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=137&is_voice=1";
					break;
				case '고갱':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=348&is_voice=1";
					break;
				case '세잔':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=332&is_voice=1";
					break;
				case '마네':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=270&is_voice=1";
					break;
				case '모네':
					window.location = config_url + giga_addr + "/player_artwork.html?id_artwork=250&is_voice=1";
					break;
			}
			break;

		case 'Click':
			console.log('pop Click');
			var cat = extra.parameter['NE-CLICK'];
			console.log('pop Click1');
			switch(cat){
				case '선택하기':
					console.log('pop Click2');
					$(":focus").click();

					if($('#cur_page').attr('value') == 'artwork' || $('#cur_page').attr('value') == 'exhibition' || $('#cur_page').attr('value') == 'storage'){
						var asss = $(":focus").attr('href');
						//confirm(asss);
						window.location = config_url + giga_addr + '/' + asss;
					}
					break;
				case '초이스':
					alert('choice');
					break;
			}
			break;

		case 'Signup':
			window.location = config_url + giga_addr + '/qr_membership.html';
			break;

		case 'GoHome':
			window.location = config_url + giga_addr + '/home.html';
			break;

		case 'GoBack':
			window.history.back();
			break;

		case 'GoCategory':
			var cat = extra.parameter['NE-GOCATEGORY'];
			switch (cat) {
				case '작품':
					window.location = config_url + giga_addr + "/artwork.html";
					break;
				case '작가':
					window.location = config_url + giga_addr + "/artist.html";
					break;
				case '전시':
					window.location = config_url + giga_addr + "/exhibition.html";
					break;
				case '보관함':
					window.location = config_url + giga_addr + "/storage.html";
					break;
				case '검색':
					window.location = config_url + giga_addr + "/search.html";
					break;
				case '계정':
					window.location = config_url + giga_addr + "/account.html";
					break;
				case '설정':
					window.location = config_url + giga_addr + "/setting.html";
					break;
			}

			break;

		case 'PopupButton':
			//console.log('pop case');
			var cat = extra.parameter['NE-POPUP'];
			//console.log('pop cat');

			/*
            //닫기 취소 확인 테스트용
            switch (cat) {
                case '닫기':
                console.log('pop 닫기');
                    window.location = config_url + giga_addr + "/start_account.html";
                    break;
                case '취소':
                console.log('pop 취소');
                    console.log('취소');
                    break;
                case '확인':
                console.log('pop 확인');
                    window.location = config_url + giga_addr + "/start_account.html";
                    break;
            }
            */

			/*
            if($('.focus-box-pop').attr('id') == 'first_enter_pop'){
                //팝업의 id가 first_enter_pop 인 경우 -> index
                switch (cat) {
                    case '닫기':
                        window.location = config_url + giga_addr + "/start_account.html";
                        break;
                    case '취소':
                        console.log('취소');
                        break;
                    case '확인':
                        window.location = config_url + giga_addr + "/start_account.html";
                        break;
                }
            }else if($('.focus-box-pop').attr('id') == 'alert_pop'){
                //팝업의 id 가 alert_pop 인 경우 -> account, account_add
                //비밀번호 일치하지 않을 때 -> account
                //로그 아웃 -> account
                //로그인 -> account
                switch (cat) {
                    case '닫기':
                        del_alert_pop();
                        break;
                    case '취소':
                        console.log('취소');
                        break;
                    case '확인':
                        del_alert_pop();
                        break;
                }
            }else if($('.focus-box-pop').attr('id') == 'dellog_pop'){
                //팝업의 id 가 dellog_pop 인 경우 -> 기기에서 삭제 account
                switch (cat) {
                    case '닫기':
                        $('#btnCloseDellogPop').trigger("click");
                        break;
                    case '취소':
                        $('#btnCloseDellogPop').trigger("click");
                        break;
                    case '확인':
                        $('#btnEnterDellogPop').trigger("click");
                        break;
                }
            }else if($('.focus-box-pop').attr('id') == 'like_pop'){
                //팝업의 id 가 like_pop 인 경우 -> 플레이어에서 좋아요 player, plyer_artwork
                switch (cat) {
                    case '닫기':
                        $('#btnAccCor').trigger("click");
                        break;
                    case '취소':
                        console.log('취소');
                        break;
                    case '확인':
                        $('#btnAccCor').trigger("click");
                        break;
                }
            }else if($('.focus-box-pop').attr('id') == 'noy_pop'){
                //팝업의 id 가 noy_pop 인 경우 -> 로그인이 안되어있고 플레이어에서 좋아요, 컬렉션 담기, 보관함 진입시에 player, plyer_artwork, storage
                switch (cat) {
                    case '닫기':
                        $('#btnClosePop').trigger("click");
                        break;
                    case '취소':
                        $('#btnClosePop').trigger("click");
                        break;
                    case '확인':
                        $('#btnEnterPop').trigger("click");
                        break;
                }
            }else if($('.focus-box-pop').attr('id') == 'frame_pop'){
                //팝업의 id 가 frame_pop 인 경우 -> frame
                switch (cat) {
                    case '닫기':
                        $('#btnCloseStartPop').trigger("click");
                        break;
                    case '취소':
                        $('#btnCloseStartPop').trigger("click");
                        break;
                    case '확인':
                        $('#btnEnterStartPop').trigger("click");
                        break;
                }
            }


            if($('.side-pop').css('left') == 0){
                //aside 팝업이 실행 되었을때 -> player, player_artwork
                switch (cat) {
                    case '닫기':
                        $('.btn-pop-close').trigger('click');
                        break;
                    case '취소':
                        console.log('취소');
                        break;
                    case '확인':
                        console.log('확인');
                        break;
                }
            }
            */

			break;

	}
}


/* 2020.11.03 tv 앱 종료 */
function exitPatron(){
	//alert('종료');
	//기가 api
	gigagenie.voice.svcFinished();
}
