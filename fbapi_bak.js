/*
#example
var fbapp = new fbapi();
fbapp.init.appid = "571724289556131";

fbapp.start();

*/
function fbapi(){
	var that=this;
	if( $('#fb-root').is()==false ){
		$('body').prepend('<div id="fb-root"></div>');
	}

	this.init = {
		debug			:	false,
		id				:	'',
		me				:	[],
		fds				:	[],
		channelURL		:	'',
		appid			:	'',
		pageid			:	'',
		scope			:	'user_about_me,user_likes,publish_stream',
		photoid			:	0,
		errMsg			:	{'errMsg_auth':'使用者取消登入或授權不完全','errMsg_unfeed':'取消發佈','errMsgUnLogin':'使用者取消登入','errMsgNotFans':'使用者不是粉絲'},
		access_token	:	''
	}
	,this.start = function(nextFunc){
		
		$.ajaxSetup({ cache: true });
		$.getScript('//connect.facebook.net/zh_TW/all.js', function(){
			FB.init({
				appId: that.init.appid,
				channelURL : that.init.channelURL, // channel.html file
				status: true,
				cookie: true,
				xfbml: true
			});
			//that.getaccesstoken();
			//FB.getLoginStatus(that.updateStatusCallback);
			if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(); }
		});
	}
	,this.updateStatusCallback = function(s){
		that.init.debug == true && console_log( s );
	}
	,this.login = function(nextFunc){
		FB.login(function(response){
			if( response.authResponse ){
				that.init.access_token = response.authResponse.accessToken;
				that.init.id = response.authResponse.userID;
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				that.init.debug == true && console_log( that.init.errMsg.errMsgUnLogin );
			}
		},{scope:that.init.scope});
	}
	,this.getaccesstoken = function(nextFunc,closeFunc){
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				that.init.access_token = response.authResponse.accessToken;
				that.init.id = response.authResponse.userID;
				that.init.debug == true && console_log( response );
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			} else if (response.status === 'not_authorized') {
				that.init.debug == true && console_log( that.init.errMsg.errMsg_auth );
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
			} else {
				that.init.debug == true && console_log( that.init.errMsg.errMsgUnLogin );
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
			}
		 });
	}
	,this.getMe = function(nextFunc,closeFunc){
		FB.api('/me/',function(response){
			that.init.debug == true && console_log( response );
			if( response ){
				that.init.me = response;
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_auth );
			}
		});
	}
	,this.getFds = function(limit,nextFunc,closeFunc){
		FB.api('/me/friends/'+( (typeof limit=='number')?'?limit='+limit : '' ),function(response){
			that.init.debug == true && console_log( response );
			if( response ){
				that.init.fds = response.data;
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_auth );
			}
		});
	}
	,this.fql = function(query,nextFunc,closeFunc){
		// var query = 'SELECT name, uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me() ) ORDER BY name DESC';
		var publish = {
			method			:	'fql.query',
			query			:	query
		}
		FB.api(publish,function(response){
			if( response ){
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_auth );
			}
		});
	}
	//place search
	,this.getPlace = function(search,nextFunc,closeFunc){
		FB.api('/search?type=place&q='+search,function(response){
			that.init.debug == true && console_log( response );
			if( response.data.length > 0 ){
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsgNotFans );
			}
		});
	}
	,this.isFans = function(nextFunc,closeFunc){
		FB.api('/me/likes/'+that.init.pageid,function(response){
			that.init.debug == true && console_log( response );
			if( response.data.length > 0 ){
				if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsgNotFans );
			}
		});
	}
	//FB api post data
	,this.autopost = function(data,nextFunc,closeFunc){
		/*
		//data,json中不須加上 access_token 但必須先取得 access_token (toLogin本身會取得)
		{
			message			:	'發佈測試message'
			,name			:	'發佈測試title'
			,description	:	'發佈測試des'
			,caption		:	'發佈測試cap'
			,link			:	location.href
			,picture		:	'http://www.....'
		}
		*/
		var dd = data;
		dd.access_token = that.init.access_token
		$.ajax({
			type: 'POST',
			url: 'https://graph.facebook.com/' + that.init.id + '/feed?method=post',
			data: dd,
			success: function (data) {
				that.init.debug == true && console_log( data );
				if(typeof data.error != 'undefined'){//失敗
					that.init.debug == true && console_log( that.init.errMsg.errMsgUnLogin );
					if(typeof closeFunc!='undefined' && typeof closeFunc == 'function') { closeFunc(data); }
				}else{//成功
					if(typeof nextFunc!='undefined' && typeof nextFunc == 'function') { nextFunc(data); }
				}
			},
			error: function (data) {
				that.init.debug == true && console_log( that.init.errMsg.errMsgUnLogin );
				if(typeof closeFunc!='undefined' && typeof closeFunc == 'function') { closeFunc(data); }
			},
			dataType: "jsonp"
		});
	}
	,this.feed = function(obj,nextFunc,closeFunc){

		FB.api('feed','post',obj,function(response){
			that.init.debug == true && console_log( response );
			if( response ){
				if( typeof nextFunc != 'undefined' && typeof nextFunc == 'function' ) { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_unfeed );
			}
		});

	}
	,this.photo = function(obj,nextFunc,closeFunc){
		/*obj = {
				access_token	:	fbapp.init.access_token
				,status			: 'success'
				,url			:	'img url'
				,message		:	'test test test'
				,tags			:	[{tag_uid: fbid ,tag_text: name ,x:50,y:50},{tag_uid: fbid ,tag_text: name ,x:50,y:50}]
				,place			:	'place code number'
			}*/
		FB.api('/me/photos','post',obj,function(response){
			if(response) {
				that.init.photoid = response.id;
				that.init.debug == true && console_log( response );
				if( typeof nextFunc != 'undefined' && typeof nextFunc == 'function' ) { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_unfeed );
			}
		});
	}
	,this.phototags = function(photoid,obj,nextFunc,closeFunc){
		//{to:obj}
		FB.api('/'+photoid+'/tags','post',{tags:obj},function(response){
			if(response) {
				if( typeof nextFunc != 'undefined' && typeof nextFunc == 'function' ) { nextFunc(response); }
			}else{
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_unfeed );
			}
		});
	}
	,this.checkin = function(obj,nextFunc,closeFunc,postid){
		if(typeof postid=='undefined')postid='me';
		FB.api('/'+postid+'/checkins', 'post',obj,function(response){
			console.log(response)
		})
	}
	//FB UI
	,this.invite = function(obj,nextFunc,closeFunc){
		/*var obj = {
			message			:	that.init.share_i_mess,
			title			:	that.init.share_i_tit,
			max_recipients	:	that.init.share_i_mexuser
		}*/
		//if(typeof obj.max_recipients == 'undefined')obj.max_recipients = 5;
		obj.method = 'apprequests';
		FB.ui(obj,function(response){
			if( response ) {
				that.init.share_i_fds = response['to'];
				if( that.init.share_i_fds.length >= that.init.share_i_num ){
					if( typeof nextFunc != 'undefined' && typeof nextFunc == 'function' ) { nextFunc(response); }
				}else{
					alert('至少邀請'+that.init.share_i_num+'位好友才算完成喔！');
				}
			}else{
				//選擇"取消"
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
				that.init.debug == true && console_log( that.init.errMsg.errMsg_unfeed );
			}
		});
	}
	,this.ui = function(obj,nextFunc,closeFunc){
		if(typeof obj.method == 'undefined')obj.method='feed';
		FB.ui(obj,function(response){
			if (response && response.post_id) {
				if( typeof nextFunc != 'undefined' && typeof nextFunc == 'function' ) { nextFunc(response); }
			} else {
				that.init.debug == true && console_log( that.init.errMsg.errMsg_unfeed );
				if( typeof closeFunc != 'undefined' && typeof closeFunc == 'function' ) { closeFunc(response); }
			}
		})
	}
}
if(typeof console_log != 'function'){
	var console_log = function(s){ window.console && console.log(s) }
}