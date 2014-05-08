(function() {
  'use strict';
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.fbapi = (function() {
    var that;

    that = fbapi;

    fbapi.prototype.init = {
      debug: false,
      id: '',
      me: [],
      friends: [],
      channelURL: '',
      appid: '',
      pageid: '',
      scope: 'user_about_me,user_likes',
      photoid: 0,
      errMsg: {
        'errMsg_auth': '使用者取消登入或授權不完全',
        'errMsg_unfeed': '取消發佈',
        'errMsgUnLogin': '使用者取消登入',
        'errMsgNotFans': '使用者不是粉絲'
      },
      access_token: ''
    };

    function fbapi() {
      var k, nextFunc, setinit, _i, _len;

      nextFunc = null;
      setinit = function(init, k) {
        if (typeof k === 'object') {
          return $.extend(init, k);
        } else if (typeof k === 'function') {
          return nextFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(this.init, k);
      }
      if ($('#fb-root').length === 0) {
        $('body').prepend('<div id="fb-root"></div>');
      }
      $.ajaxSetup({
        cache: !0
      });
      $.getScript('//connect.facebook.net/zh_TW/all.js', function() {
        FB.init({
          appId: root.fbapp.init.appid,
          channelURL: root.fbapp.init.channelURL,
          status: true,
          cookie: true,
          xfbml: true
        });
        return root.fbapp.getaccesstoken();
      });
      if (typeof nextFunc === 'function') {
        nextFunc();
      }
    }

    fbapi.prototype.getaccesstoken = function() {
      var closeFunc, k, nextFunc, setinit, _i, _len;

      nextFunc = null;
      closeFunc = null;
      setinit = function(init, k) {
        if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(this.init, k);
      }
      return FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          root.fbapp.init.access_token = response.authResponse.accessToken;
          root.fbapp.init.id = response.authResponse.userID;
          root.fbapp.init.debug === true && console.log(response);
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else if (response.status === 'not_authorized') {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsg_auth);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        } else {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsgUnLogin);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        }
      });
    };

    fbapi.prototype.login = function() {
      var closeFunc, k, nextFunc, setinit, _i, _len;

      nextFunc = null;
      closeFunc = null;
      setinit = function(k) {
        if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(k);
      }
      return FB.login(function(response) {
        if (response.authResponse) {
          root.fbapp.init.access_token = response.authResponse.accessToken;
          root.fbapp.init.id = response.authResponse.userID;
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsgUnLogin);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        }
      }, {
        scope: this.init.scope
      });
    };

    fbapi.prototype.me = function() {
      var closeFunc, k, nextFunc, setinit, _i, _len;

      nextFunc = null;
      closeFunc = null;
      setinit = function(k) {
        if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(k);
      }
      return FB.api('/me/', function(response) {
        root.fbapp.init.debug === true && console.log(response);
        if (response) {
          root.fbapp.init.me = response;
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else {
          if (typeof closeFunc === 'function') {
            closeFunc(response);
          }
          return root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsg_auth);
        }
      });
    };

    fbapi.prototype.friends = function() {
      var closeFunc, k, limit, nextFunc, setinit, _i, _len;

      limit = null;
      nextFunc = null;
      closeFunc = null;
      setinit = function(k) {
        if (typeof k === 'number') {
          return limit = k;
        } else if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(k);
      }
      return FB.api('/me/friends/' + (limit !== null ? "'?limit='" + limit : void 0), function(response) {
        root.fbapp.init.debug === true && console.log(response);
        if (response) {
          root.fbapp.init.friends = response.data;
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg_auth);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        }
      });
    };

    fbapi.prototype.ui = function() {
      var closeFunc, k, nextFunc, obj, setinit, _i, _len;

      obj = {};
      nextFunc = null;
      closeFunc = null;
      setinit = function(k) {
        if (typeof k === 'object') {
          return obj = k;
        } else if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(k);
      }
      if (obj.method != null) {
        obj.method = 'feed';
      }
      return FB.ui(obj, function(response) {
        if (response && response.post_id) {
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsg_unfeed);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        }
      });
    };

    fbapi.prototype.fans = function() {
      var closeFunc, k, nextFunc, pageid, setinit, _i, _len;

      pageid = root.fbapp.init.pageid;
      nextFunc = null;
      closeFunc = null;
      setinit = function(k) {
        if (typeof k === 'string') {
          return pageid = k;
        } else if (typeof k === 'function' && nextFunc === null) {
          return nextFunc = k;
        } else if (typeof k === 'function' && nextFunc === 'function' && closeFunc === null) {
          return closeFunc = k;
        }
      };
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        setinit(k);
      }
      if (pageid === null) {
        return false;
      }
      return FB.api("/me/likes/" + pageid, function(response) {
        root.fbapp.init.debug === true && console.log(response);
        if (response.data.length > 0) {
          if (typeof nextFunc === 'function') {
            return nextFunc(response);
          }
        } else {
          root.fbapp.init.debug === true && console.log(root.fbapp.init.errMsg.errMsgNotFans);
          if (typeof closeFunc === 'function') {
            return closeFunc(response);
          }
        }
      });
    };

    return fbapi;

  })();

}).call(this);
