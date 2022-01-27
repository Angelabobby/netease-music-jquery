$(function () {
  let loginInfo = $("div.login-info");
  let userProfile = $("div.user-profile");
  let loginBtn = $(".login-btn"); // 导航栏右上角登录按钮
  let loginBox = $(".login-box"); // 弹出的登录框
  let profile = Cookies.get("profile");
  let profileAvatar = $("img.profile-avatar");
  let profileUsername = $("a.profile-username");
  let level = $("span.level");
  let eventCount = $("li.event-count");
  let follows = $("li.follows");
  let followeds = $("li.followeds");
  let closeImg = $(".closeImg"); // 登录框头部的关闭窗口按钮
  let errors = $("div.errors"); // 密码或验证码错误的容器
  let phone = $("#phone"); // 手机号输入框
  let captcha = $("input#captcha"); // 验证码输入框
  let password = $("#password"); // 密码输入框
  let isCaptcha = true; // 当前使用的登录方式，短信登录
  let passwordMod = $("div.password-mod"); // 密码登录模块
  let captchaMod = $("div.captcha-mod"); // 短信登录模块
  let loginBtnRed = $(".login-btn-red"); // 页面主体部分的红色登录按钮
  let loginBoxHead = $(".loginBoxHead"); // 弹出登录框头部
  let loginBtnBlue = $("a.login-button-blue"); // 登录框蓝色登录按钮
  let auto = $("input#auto"); // 自动登录复选框
  let avatar = $("img.avatar"); // 登陆后显示的头像
  let errorsDesc = $("span.errors-desc"); // 密码或验证码错误的描述
  let dropDown = $("div.drop-down"); // 登录后下拉框的容器
  let loginBtnBox = $("div.login-btn-mod"); // 右上角登录按钮的容器
  let getCaptcha = $("a.get-captcha");
  let chooseLoginMethod = $("a.choose-login-method");
  let logOut = $("a.log-out"); // 退出登录按钮
  let search = $(".search"); // 搜索容器
  let searchRes = $(".searchRes"); // 搜索结果容器
  let imgList = []; // 保存图片地址的数组
  let btns = []; // 保存动态生成小圆点DOM对象的数组
  let carouBox = $(".carouBox"); // 轮播图模块容器
  let btnsBox = $(".btns-box"); // 轮播图小圆点的容器
  let img = $("img.img"); // 轮播图图片
  let background = $(".background"); // 高斯模糊背景
  let index = 0; // 定义全局索引，用于同步轮播图、背景图和按钮交互信息
  let interval; // 定义全局定时器变量，用于定时切换轮播图

  // 用于测试Ajax的按钮
  $("button").on("click", function () {
    $.ajax({
      type: "get",
      url: `https://muise-git-master-329639010.vercel.app/user/playlist?uid=32953014&timestamp=${new Date().getTime()}`,
      // data: { id: 6452 },
      dataType: "json",
      success: function (Obj) {
        console.log(Obj);
      },
    });
  });

  // *****初始化页面，若有cookie则不需要登录*****
  if (Cookies.get("userName")) {
    loginBtn.hide(); // 隐藏登录按钮
    avatar.show(); // 显示头像
    loginBtnBox.on("mouseenter", enter); // 鼠标进入事件显示下拉框
    loginBtnBox.on("mouseleave", leave); // 鼠标移出事件隐藏下拉框
  }

  // *****若有cookie，则从cookie读取数据*****
  function loginFillInfo(profile) {
    if (profile) {
      profileObj = JSON.parse(profile);
      avatar.attr("src", profileObj.avatarUrl);
      profileAvatar.attr("src", profileObj.avatarUrl);
      profileUsername.html(profileObj.nickname);
      eventCount.html("动态 : " + profileObj.eventCount);
      follows.html("关注 : " + profileObj.follows);
      followeds.html("粉丝 : " + profileObj.followeds);
      loginInfo.hide(); // 隐藏登录信息框
      userProfile.show(); // 显示用户详情框
      $.get({
        url: `https://muise-git-master-329639010.vercel.app/user/detail?uid=${Cookies.get(
          "userId"
        )}`,
        success: function (data) {
          level.html("等级: " + data.level);
        },
      });
    }
  }
  loginFillInfo(profile);

  // *****导航栏的登录按钮点击事件，点击后打开登录框*****
  loginBtn.on("click", function (e) {
    e.preventDefault();
    loginBox.show();
  });

  // *****红色登录按钮点击事件，点击后打开登录框*****
  loginBtnRed.on("click", function (e) {
    e.preventDefault();
    loginBox.show();
  });

  // *****登录框关闭按钮点击事件，点击后关闭登录框*****
  closeImg.on("click", function () {
    loginBox.hide();
    errors.hide(); // 隐藏错误提示
    phone.val(""); // 关闭后清除输入过的信息
    captcha.val("");
    password.val("");
    isCaptcha = true; // 关闭后回复默认的短信登录方式
    defaultLogin();
    passwordMod.hide();
    captchaMod.show();
    // 恢复登录框位置
    loginBox.css("left", "696px");
    loginBox.css("top", "312px");
  });

  // *****登录框拖动事件*****
  let maxLeft = $(window).outerWidth() - loginBox.innerWidth(); // 登录框left的最大值
  let maxTop = $(window).outerHeight() - loginBox.innerHeight(); // 登录框top的最大值
  let oldX; // 记录鼠标横向位置
  let oldY; // 记录鼠标纵向位置
  let downX;
  let downY;
  let left;
  let topp;
  loginBoxHead.on("mousedown", function (Edown) {
    downX = Edown.offsetX;
    downY = Edown.offsetY;
    function move(Emove) {
      // e.clientX 鼠标在文档的横向位置
      // e.offsetX 鼠标在容器内的横向位置
      // div.offsetLeft 容器左边在父容器内的横向位置
      left = Emove.clientX - downX;
      topp = Emove.clientY - downY;
      if (left < 0 && Emove.pageX < oldX) {
        left = 0;
        downX = Emove.offsetX;
      }
      if (left > maxLeft && Emove.pageX > oldX) {
        left = maxLeft;
        downX = Emove.offsetX;
      }
      if (topp < 0 && Emove.pageY < oldY) {
        topp = 0;
        downY = Emove.offsetY;
      }
      if (topp > maxTop && Emove.pageY > oldY) {
        topp = maxTop;
        downY = Emove.offsetY;
      }
      loginBox.css("left", left + "px");
      loginBox.css("top", topp + "px");
      oldX = Emove.pageX;
      oldY = Emove.pageY;
    }
    $(window.document).on("mousemove", move);
    $(window.document).on("mouseup", function () {
      $(window.document).off("mousemove", move);
    });
  });

  // *****密码登录Ajax*****
  function pwdLoginAjax(e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/login/cellphone?timestamp=${new Date().getTime()}`,
      data: {
        phone: phone.val(),
        password: password.val(),
      },
      dataType: "json",
      success: function (Obj) {
        console.log("密码登录", Obj);
        if (Obj.code === 200) {
          Cookies.set("userName", Obj.profile.nickname, 1 / 24); // 登陆成功设置cookies
          Cookies.set("userId", Obj.profile.userId, 1 / 24); // 登陆成功设置cookies
          Cookies.set("profile", JSON.stringify(Obj.profile), 1 / 24); // 用cookie保存登陆成功返回的对象
          loginFillInfo(JSON.stringify(Obj.profile)); // 登录后填充信息
          errors.hide();
          if (auto.attr("checked")) {
            window.localStorage.setItem("userName", Obj.profile.nickname);
          }
          loginBox.hide(); // 登录成功，关闭登录框
          loginBtn.hide(); // 隐藏登录按钮
          avatar.attr("src", Obj.profile.avatarUrl);
          avatar.show(); // 显示头像
          loginBtnBox.on("mouseenter", enter); // 鼠标进入事件显示下拉框
          loginBtnBox.on("mouseleave", leave); // 鼠标移出事件隐藏下拉框
        } else if (Obj.code === 502 && Obj.msg === "密码错误") {
          errors.show();
          errorsDesc.html("手机号或密码错误");
        }
      },
    });
  }

  // *****登录成功后头像下拉列表函数*****
  function enter() {
    dropDown.show(); // 鼠标进入，显示下拉框
  }
  function leave() {
    dropDown.hide(); // 鼠标移出，隐藏下拉框
  }

  // *****发送验证码AJAX*****
  getCaptcha.on("click", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/captcha/sent?timestamp=${new Date().getTime()}`,
      data: {
        phone: phone.val(),
      },
      dataType: "json",
      success: function (Obj) {
        console.log("验证码发送", Obj);
      },
    });
  });

  // *****验证码登录AJAX*****
  loginBtnBlue.on("click", captchaLoginAjax);
  function captchaLoginAjax(e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/login/cellphone?timestamp=${new Date().getTime()}`,
      data: {
        phone: phone.val(),
        captcha: captcha.val(),
      },
      dataType: "json",
      success: function (Obj) {
        console.log("短信登录", Obj);
        if (Obj.code === 200) {
          Cookies.set("userName", Obj.profile.nickname, 1 / 24); // 登陆成功设置cookies
          Cookies.set("userId", Obj.profile.userId, 1 / 24); // 登陆成功设置cookies
          Cookies.set("profile", JSON.stringify(Obj.profile), 1 / 24); // 用cookie保存登陆成功返回的对象
          loginFillInfo(JSON.stringify(Obj.profile)); // 登录后填充信息
          errors.hide();
          if (auto.attr("checked")) {
            window.localStorage.setItem("userName", Obj.profile.nickname);
          }
          loginBox.hide(); // 登录成功，关闭登录框
          loginBtn.hide(); // 隐藏登录按钮
          avatar.attr("src", Obj.profile.avatarUrl);
          avatar.show(); // 显示头像
          loginBtnBox.on("mouseenter", enter); // 鼠标进入事件显示下拉框
          loginBtnBox.on("mouseleave", leave); // 鼠标移出事件隐藏下拉框
        }
      },
      error: function () {
        errors.show();
        errorsDesc.html("验证码错误");
      },
    });
  }

  // *****切换登录方式的点击事件*****
  chooseLoginMethod.on("click", function (e) {
    e.preventDefault();
    // 点击后显示的内容
    if (isCaptcha === true) {
      // 显示密码登录
      passwordMod.show();
      captchaMod.hide();
      loginBtnBlue.off("click", captchaLoginAjax); // 移除短信登录
      loginBtnBlue.on("click", pwdLoginAjax); // 添加密码登录
      chooseLoginMethod.html("短信登录");
      isCaptcha = false;
    } else {
      // 显示短信登录
      passwordMod.hide();
      captchaMod.show();
      loginBtnBlue.off("click", pwdLoginAjax); // 移除密码登录
      loginBtnBlue.on("click", captchaLoginAjax); // 添加短信登录
      chooseLoginMethod.html("密码登录");
      isCaptcha = true;
    }
  });
  // 回复默认的登录方式
  function defaultLogin() {
    loginBtnBlue.off("click", pwdLoginAjax); // 移除密码登录
    loginBtnBlue.off("click", captchaLoginAjax); // 移除短信登录
    loginBtnBlue.on("click", captchaLoginAjax); // 添加短信登录
  }

  // *****退出登录AJAX*****
  logOut.on("click", function (e) {
    e.preventDefault();
    logOutAjax();
  });
  function logOutAjax() {
    $.ajax({
      type: "get",
      url: `https://muise-git-master-329639010.vercel.app/logout?timestamp=${new Date().getTime()}`,
      dataType: "json",
      success: function (Obj) {
        console.log("退出登录", Obj);
        Cookies.remove("userName"); // 退出后清除cookie
        Cookies.remove("userId"); // 登陆成功设置cookies
        Cookies.remove("profile"); // 退出后清除登录信息
        loginInfo.show(); // 显示登录信息框
        userProfile.hide(); // 隐藏用户详情框
        loginBtn.show(); // 显示登录按钮
        avatar.hide(); // 隐藏头像
        loginBtnBox.off("mouseenter", enter); // 移除，鼠标进入事件显示下拉框
        loginBtnBox.off("mouseleave", leave); // 移除，鼠标移出事件隐藏下拉框
        dropDown.hide(); // 隐藏登录下拉框
        phone.val(""); // 退出后清除输入过的信息
        captcha.val("");
        password.val("");
        isCaptcha = true; // 退出后回复默认的短信登录方式
        defaultLogin();
        passwordMod.hide();
        captchaMod.show();
        errors.hide(); // 隐藏错误提示
      },
    });
  }

  // *****搜索框键盘松开事件*****
  search.on("keyup", debounce(searchAjax, 300)); // 防抖延迟300毫秒
  function searchAjax() {
    // 若搜索框无内容，则隐藏搜索结果，否则显示
    if (search.val()) {
      searchRes.show();
    } else {
      searchRes.hide();
    }
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/search?timestamp=${new Date().getTime()}`,
      data: {
        keywords: search.val(),
      },
      dataType: "json",
      success: function (Obj) {
        searchRes.html("");
        if (search.val() && Obj.result) {
          for (let i = 0; i < 5; i++) {
            let str = Obj.result.songs[i].name + "-" + Obj.result.songs[i].artists[0].name;
            searchRes.append($("<div></div>").html(str));
          }
        }
      },
    });
  }
  // 搜索框聚焦事件，聚焦时显示搜索结果
  search.on("focus", function () {
    if (search.val()) {
      searchRes.show();
    }
  });
  // 搜索框失焦事件，失焦时隐藏搜索内容
  search.on("blur", function () {
    searchRes.hide();
  });
  // 防抖函数
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ***** 轮播图模块的异步请求 *****
  $.ajax({
    type: "get",
    url: `https://muise-git-master-329639010.vercel.app/banner?type=0&timestamp=${new Date().getTime()}`,
    dataType: "json",
    success: function (Obj) {
      for (let i = 0; i < Obj.banners.length; i++) {
        imgList[i] = Obj.banners[i].imageUrl;
        // 动态生成小圆点，因为有时数量为9，有时数量为10
        let elem = $("<a></a>").addClass("btns");
        btns.push(elem);
        btnsBox.append(elem);
      }
      // 为小圆点添加样式
      for (let i = 0; i < btns.length; i++) {
        btns[i].attr("index", i);
        btns[i].on("click", function (e) {
          e.preventDefault();
          index = Number($(e.target).attr("index"));
          clearBtns();
          $(e.target).css("background-position-x", "23px");
          img.attr("src", imgList[index]);
          background.css("background", `url(${imgList[index]})`);
        });
      }
      // 异步请求成功后，显示第一张图片
      img.attr("src", imgList[index]);
      background.css("background", `url(${imgList[0]})`);
      btns[0].css("background-position-x", "23px");
    },
    complete: function () {
      // 初始化自动翻页，五秒切换一次
      interval = setInterval(carouselNext, 5000);
      // 轮播图事件：鼠标进入停止，鼠标离开继续
      carouBox.on("mouseenter", function () {
        clearInterval(interval);
      });
      carouBox.on("mouseleave", function () {
        interval = setInterval(carouselNext, 5000);
      });
      // 轮播图自动翻页的函数
      let timeoutID;
      function carouselNext() {
        clearBtns();
        clearTimeout(timeoutID);
        index = index === imgList.length - 1 ? 0 : index + 1;
        img.css("opacity", "0");
        timeoutID = setTimeout(function () {
          img.css("opacity", "1");
          img.attr("src", imgList[index]);
          background.css("background", `url(${imgList[index]})`);
          btns[index].css("background-position-x", "23px");
        }, 900);
      }
    },
  });
  // 重置所有小圆点样式的函数
  function clearBtns() {
    btns.forEach((item) => {
      item.css("background-position-x", "3px");
    });
  }

  // *****轮播图上一页按钮点击事件*****
  let leftBtn = $(".leftBtn"); // 轮播图上一页按钮
  let rightBtn = $(".rightBtn"); // 轮播图下一页按钮
  leftBtn.on("click", function () {
    index = index === 0 ? imgList.length - 1 : index - 1;
    img.attr("src", imgList[index]);
    background.css("background", `url(${imgList[index]})`);
    clearBtns();
    btns[index].css("background-position-x", "23px");
  });
  // *****轮播图下一页按钮点击事件*****
  rightBtn.on("click", function () {
    index = index === imgList.length - 1 ? 0 : index + 1;
    img.attr("src", imgList[index]);
    background.css("background", `url(${imgList[index]})`);
    clearBtns();
    btns[index].css("background-position-x", "23px");
  });

  // *****获取歌单的异步请求*****
  let player = $("div.player"); // 播放器容器(绝对定位，需要移动)
  let audio = $("audio.audio"); // 播放器模块
  let music = $("source.music"); // 音乐源source标签
  let isLocked = false; // 默认播放器为取消固定
  let playerName = $("span.player-name"); // 播放器显示歌名
  let playerArtist = $("span.player-artist"); // 播放器显示歌手名
  function playlistAjax(playlistID) {
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/playlist/detail?timestamp=${new Date().getTime()}`,
      data: { id: playlistID },
      dataType: "json",
      success: function (Obj) {
        music.attr(
          "src",
          `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[0].id}.mp3`
        );
        audio[0].load();
        audio[0].play();
        playerName.html(Obj.playlist.tracks[0].name);
        playerArtist.html(Obj.playlist.tracks[0].ar[0].name);
        if (!isLocked) {
          player.css("bottom", "0px");
          setTimeout(() => {
            player.css("bottom", "-45px");
          }, 3000);
        }
      },
    });
  }

  // *****热门推荐的异步请求，用于获取歌单封面图片、歌单播放信息和歌单描述*****
  let playlistImgDiv = $(".playlistImgDiv"); // 歌单的容器
  let playlistImgs = $(".playlistImgs"); // 歌单的图片
  let playlistPlayCountSpan = $(".playCount"); // 歌单播放数
  let playlistDesc = $(".playlistDesc"); // 歌单说明文字
  let playAudioBtns = $("a.playAudio"); // 歌单内的播放按钮
  $.ajax({
    type: "post",
    url: `https://muise-git-master-329639010.vercel.app/personalized?timestamp=${new Date().getTime()}`,
    data: { limit: 8 },
    dataType: "json",
    success: function (Obj) {
      let result = Obj.result;
      for (let i = 0; i < playlistImgDiv.length; i++) {
        $(playlistImgs[i]).attr("src", result[i].picUrl);
        $(playlistPlayCountSpan[i]).html(`${parseInt(result[i].playCount / 10000)}万`);
        $(playlistDesc[i]).html(result[i].name);
        $(playAudioBtns[i]).on("click", function (e) {
          e.preventDefault();
          playlistAjax(result[i].id);
        });
      }
    },
  });

  // *****获取专辑信息的异步请求函数*****
  function albumAjax(albumID) {
    $.ajax({
      type: "post",
      url: `https://muise-git-master-329639010.vercel.app/album?timestamp=${new Date().getTime()}`,
      data: { id: albumID },
      dataType: "json",
      success: function (Obj) {
        music.attr("src", `https://music.163.com/song/media/outer/url?id=${Obj.songs[0].id}.mp3`);
        audio[0].load();
        audio[0].play();
        playerName.html(Obj.songs[0].name);
        playerArtist.html(Obj.songs[0].ar[0].name);
        if (!isLocked) {
          player.css("bottom", "0px");
          setTimeout(() => {
            player.css("bottom", "-45px");
          }, 3000);
        }
      },
    });
  }

  // *****新碟上架的异步请求*****
  $.ajax({
    type: "post",
    url: `https://muise-git-master-329639010.vercel.app/top/album?timestamp=${new Date().getTime()}`,
    data: {
      limit: 5,
      offset: 0,
      area: "ZH",
      type: "hot",
      year: 2022,
      month: 1,
    },
    dataType: "json",
    success: function (Obj) {
      let monthData = Obj.monthData;
      let g1PlayBtns = $("#g1 a.play-icon-btn");
      let g2PlayBtns = $("#g2 a.play-icon-btn");
      let g3PlayBtns = $("#g3 a.play-icon-btn");
      let g4PlayBtns = $("#g4 a.play-icon-btn");
      // 第1、3组，下标5-9
      for (let i = 5; i < 10; i++) {
        $($("#g1 .coverImg")[i - 5]).attr("src", monthData[i].picUrl);
        $($("#g1 .songName")[i - 5]).html(monthData[i].name);
        $($("#g1 .songArtist")[i - 5]).html(monthData[i].artists[0].name);

        $($("#g3 .coverImg")[i - 5]).attr("src", monthData[i].picUrl);
        $($("#g3 .songName")[i - 5]).html(monthData[i].name);
        $($("#g3 .songArtist")[i - 5]).html(monthData[i].artists[0].name);

        $(g1PlayBtns[i - 5]).on("click", function (e) {
          e.preventDefault();
          albumAjax(monthData[i].id);
        });

        $(g3PlayBtns[i - 5]).on("click", function (e) {
          e.preventDefault();
          albumAjax(monthData[i].id);
        });
      }
      // 第2、4组，下标0-4
      for (let i = 0; i < 5; i++) {
        $($("#g2 .coverImg")[i]).attr("src", monthData[i].picUrl);
        $($("#g2 .songName")[i]).html(monthData[i].name);
        $($("#g2 .songArtist")[i]).html(monthData[i].artists[0].name);

        $($("#g4 .coverImg")[i]).attr("src", monthData[i].picUrl);
        $($("#g4 .songName")[i]).html(monthData[i].name);
        $($("#g4 .songArtist")[i]).html(monthData[i].artists[0].name);

        $(g2PlayBtns[i]).on("click", function (e) {
          e.preventDefault();
          albumAjax(monthData[i].id);
        });

        $(g4PlayBtns[i]).on("click", function (e) {
          e.preventDefault();
          albumAjax(monthData[i].id);
        });
      }
    },
  });

  // ***** 无缝滚动 *****
  // 右按钮点击事件，点击后向左无缝滚动，模拟向左翻动
  let scrollLeft = $(".scrollLeft"); // 左滚动翻页按钮
  let scrollRight = $(".scrollRight"); // 右滚动翻页按钮
  let showContent = $(".showContent"); // 无缝滚动所有内容容器
  let isMoving = false; // 定义isMoving变量，保存group节点移动状态，默认为不动状态
  scrollRight.on("click", function (e) {
    e.preventDefault();
    if (!isMoving) {
      isMoving = true;
      // 移动第2、3、4个节点
      $("#g2").css("left", `${$("#g2").offsetLeft - 634} + "px";`);
      $("#g3").css("left", `${$("#g3").offsetLeft - 634} + "px";`);
      $("#g4").css("left", `${$("#g4").offsetLeft - 634} + "px";`);
      let temp = $("#g1"); //保存第1个节点
      showContent.remove($("#g1")); //移除第1个节点
      showContent.append(temp); //将第1个节点添加到队列末尾
      $(showContent[3]).css("left", "1268px"); //调整末尾节点的样式
      // 修改id属性
      for (let i = 0; i < 4; i++) {
        $(showContent.children()[i]).attr("id", `g${i + 1}`);
      }
      setTimeout(() => {
        isMoving = false;
      }, 1000);
    }
  });
  // 左按钮点击事件，点击后向右无缝滚动，模拟向右翻动
  scrollLeft.on("click", function (e) {
    e.preventDefault();
    if (!isMoving) {
      isMoving = true;
      // 移动第1、2、3个节点
      $("#g1").css("left", `${$("#g1").offsetLeft + 634} + "px"`);
      $("#g2").css("left", `${$("#g2").offsetLeft + 634} + "px"`);
      $("#g3").css("left", `${$("#g3").offsetLeft + 634} + "px"`);
      let temp = $("#g4"); //保存第4个节点
      showContent.remove($("#g4")); //移除第4个节点
      showContent.prepend(temp); //将第4个节点添加到第1个节点之前
      $(showContent[0]).css("left", "-634px"); //调整新添加节点的位置到队列开头
      // 修改id属性
      for (let i = 0; i < 4; i++) {
        $(showContent.children()[i]).attr("id", `g${i + 1}`);
      }
      setTimeout(() => {
        isMoving = false;
      }, 1000);
    }
  });
  // *****榜单*****
  // 飙升榜的异步请求
  let billCoverImgs = $("div.bill-cover img");
  $.ajax({
    type: "post",
    url: `https://muise-git-master-329639010.vercel.app/playlist/detail?timestamp=${new Date().getTime()}`,
    data: { id: 19723756 },
    dataType: "json",
    success: function (Obj) {
      $(billCoverImgs[0]).attr("src", Obj.playlist.coverImgUrl);
      let risingBillSongs = $("div.rising-bill a.songs");
      let risingBillPlayBtns = $("div.rising-bill a.bill-play"); // 获取播放按钮
      for (let i = 0; i < risingBillSongs.length; i++) {
        $(risingBillSongs[i]).html(Obj.playlist.tracks[i].name);
        $(risingBillSongs[i]).attr(
          "href",
          `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`
        );
        $(risingBillSongs[i]).attr("title", Obj.playlist.tracks[i].name);
        $(risingBillPlayBtns[i]).on("click", function (e) {
          e.preventDefault();
          music.attr(
            "src",
            `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`
          );
          audio[0].load();
          audio[0].play();
          playerName.html(Obj.playlist.tracks[i].name);
          playerArtist.html(Obj.playlist.tracks[i].ar[0].name);
          if (!isLocked) {
            player.css("bottom", "0px");
            setTimeout(() => {
              player.css("bottom", "-45px");
            }, 3000);
          }
        });
      }
    },
  });
  // 新歌榜的异步请求
  $.ajax({
    type: "post",
    url: `https://muise-git-master-329639010.vercel.app/playlist/detail?timestamp=${new Date().getTime()}`,
    data: { id: 3779629 },
    dataType: "json",
    success: function (Obj) {
      $(billCoverImgs[1]).attr("src", Obj.playlist.coverImgUrl);
      let newBillSongs = $("div.new-bill a.songs");
      let newBillPlayBtns = $("div.new-bill a.bill-play"); // 获取播放按钮
      for (let i = 0; i < newBillSongs.length; i++) {
        $(newBillSongs[i]).html(Obj.playlist.tracks[i].name);
        $(newBillSongs[i]).attr(
          "href",
          `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`
        );
        $(newBillSongs[i]).attr("title", Obj.playlist.tracks[i].name);
        $(newBillPlayBtns[i]).on("click", function (e) {
          e.preventDefault();
          music.attr(
            "src",
            `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`
          );
          audio[0].load();
          audio[0].play();
          playerName.html(Obj.playlist.tracks[i].name);
          playerArtist.html(Obj.playlist.tracks[i].ar[0].name);
          if (!isLocked) {
            player.css("bottom", "0px");
            setTimeout(() => {
              player.css("bottom", "-45px");
            }, 3000);
          }
        });
      }
    },
  });
  // 原创榜的异步请求
  $.ajax({
    type: "post",
    url: `https://muise-git-master-329639010.vercel.app/playlist/detail?timestamp=${new Date().getTime()}`,
    data: { id: 2884035 },
    dataType: "json",
    success: function (Obj) {
      $(billCoverImgs[2]).attr("src", Obj.playlist.coverImgUrl);
      let originalBillSongs = $("div.original-bill a.songs");
      let originalBillPlayBtns = $("div.original-bill a.bill-play"); // 获取播放按钮
      for (let i = 0; i < originalBillSongs.length; i++) {
        $(originalBillSongs[i]).html(Obj.playlist.tracks[i].name);
        $(originalBillSongs[i]).attr(
          "href",
          `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`
        );
        $(originalBillSongs[i]).attr("title", Obj.playlist.tracks[i].name);
        $(originalBillPlayBtns[i]).on("click", function (e) {
          e.preventDefault();
          music.attr(
            "src",
            `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`
          );
          audio[0].load();
          audio[0].play();
          playerName.html(Obj.playlist.tracks[i].name);
          playerArtist.html(Obj.playlist.tracks[i].ar[0].name);
          if (!isLocked) {
            player.css("bottom", "0px");
            setTimeout(() => {
              player.css("bottom", "-45px");
            }, 3000);
          }
        });
      }
    },
  });

  // 为li添加鼠标移入、移出事件，触发后显示、隐藏小组件
  let risingBillLis = $("div.rising-bill ol li");
  let newBillLis = $("div.new-bill ol li");
  let originalBillLis = $("div.original-bill ol li");
  let risingBillPlay = $("div.rising-bill a.play");
  let newBillPlay = $("div.new-bill a.play");
  let originalBillPlay = $("div.original-bill a.play");
  risingBillPlay.on("click", function (e) {
    e.preventDefault();
    playlistAjax(19723756);
  });
  newBillPlay.on("click", function (e) {
    e.preventDefault();
    playlistAjax(3779629);
  });
  originalBillPlay.on("click", function (e) {
    e.preventDefault();
    playlistAjax(2884035);
  });

  for (let i = 0; i < risingBillLis.length; i++) {
    $(risingBillLis[i]).on("mouseenter", function (e) {
      $(e.currentTarget.lastElementChild).show();
      $(e.currentTarget.children[1]).addClass("short");
    });
    $(risingBillLis[i]).on("mouseleave", function (e) {
      $(e.currentTarget.lastElementChild).hide();
      $(e.currentTarget.children[1]).removeClass("short");
    });
    $(newBillLis[i]).on("mouseenter", function (e) {
      $(e.currentTarget.lastElementChild).show();
      $(e.currentTarget.children[1]).addClass("short");
    });
    $(newBillLis[i]).on("mouseleave", function (e) {
      $(e.currentTarget.lastElementChild).hide();
      $(e.currentTarget.children[1]).removeClass("short");
    });
    $(originalBillLis[i]).on("mouseenter", function (e) {
      $(e.currentTarget.lastElementChild).show();
      $(e.currentTarget.children[1]).addClass("short");
    });
    $(originalBillLis[i]).on("mouseleave", function (e) {
      $(e.currentTarget.lastElementChild).hide();
      $(e.currentTarget.children[1]).removeClass("short");
    });
  }

  // 获取入驻歌手的异步请求
  let singerImgs = $("div.singer-head img");
  let singerNames = $("span.singer-name");
  $.ajax({
    type: "get",
    url: `https://muise-git-master-329639010.vercel.app/artist/list?timestamp=${new Date().getTime()}`,
    dataType: "json",
    success: function (Obj) {
      for (let i = 0; i < singerImgs.length; i++) {
        $(singerImgs[i]).attr("src", Obj.artists[i].picUrl);
        $(singerNames[i]).html(Obj.artists[i].name);
      }
    },
  });

  // 热门主播
  let djImgs = $("a.dj-head img");
  let djNames = $("a.dj-name");
  let djDescs = $("p.dj-desc");
  $.ajax({
    type: "get",
    url: `https://muise-git-master-329639010.vercel.app/dj/hot?timestamp=${new Date().getTime()}`,
    dataType: "json",
    success: function (Obj) {
      for (let i = 0; i < djImgs.length; i++) {
        $(djImgs[i]).attr("src", Obj.djRadios[i].picUrl);
        $(djNames[i]).html(Obj.djRadios[i].name);
        $(djDescs[i]).html(Obj.djRadios[i].rcmdtext);
      }
    },
  });
  // 回到顶部按钮
  let backTopButton = $(".back-top");
  backTopButton.on("click", (e) => {
    e.preventDefault();
    document.body.scrollIntoView();
  });
  $(window.document).on("scroll", () => {
    if (document.documentElement.scrollTop === 0) {
      backTopButton.addClass("hidden");
    } else {
      backTopButton.removeClass("hidden");
    }
  });

  // 播放器模块
  let playerMod = $("div.player-mod"); // 播放器模块(固定定位)
  let lock = $("a.lock"); // 记录是否固定的flag变量
  // 打开页面后若未选择固定，则5秒后隐藏播放器
  if (isLocked === false) {
    player.css("bottom", "0px");
    setTimeout(() => {
      player.css("bottom", "-45px");
    }, 5000);
  }
  // 移入显示，移出隐藏的函数和相应的事件
  function playerEnter() {
    player.css("bottom", "0px");
  }
  function playerLeave() {
    player.css("bottom", "-45px");
  }
  playerMod.on("mouseenter", playerEnter);
  playerMod.on("mouseleave", playerLeave);
  // 固定/取消固定的函数
  function unlockedEnter() {
    lock.css("background-position", "-80px -400px");
  }
  function unlockedLeave() {
    lock.css("background-position", "-80px -380px");
  }
  function lockedEnter() {
    lock.css("background-position", "-100px -400px");
  }
  function lockedLeave() {
    lock.css("background-position", "-100px -380px");
  }
  lock.on("mouseenter", unlockedEnter);
  lock.on("mouseleave", unlockedLeave);
  // 点击后
  lock.on("click", function (e) {
    e.preventDefault();
    if (isLocked === false) {
      // 点击后锁定
      isLocked = true;
      playerMod.off("mouseleave", playerLeave);
      lock.css("background-position", "-100px -400px");
      lock.off("mouseenter", unlockedEnter);
      lock.off("mouseleave", unlockedLeave);
      lock.on("mouseenter", lockedEnter);
      lock.on("mouseleave", lockedLeave);
    } else {
      // 点击后解锁
      isLocked = false;
      playerMod.on("mouseleave", playerLeave);
      lock.css("background-position", "-80px -400px");
      lock.off("mouseenter", lockedEnter);
      lock.off("mouseleave", lockedLeave);
      lock.on("mouseenter", unlockedEnter);
      lock.on("mouseleave", unlockedLeave);
    }
  });
});
