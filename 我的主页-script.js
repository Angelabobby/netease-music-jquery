$(function () {
  // *****登录成功后头像下拉列表显示/隐藏的函数*****
  let dropDown = $("div.drop-down"); // 登录后下拉框的容器
  function enter() {
    dropDown.show(); // 鼠标进入，显示下拉框
  }
  function leave() {
    dropDown.hide(); // 鼠标移出，隐藏下拉框
  }

  // 若有Cookie，则初始化
  let profile = Cookies.get("profile");
  let loginBtnBox = $("div.login-btn-mod"); // 右上角登录按钮的容器
  let loginBtn = $(".login-btn"); // 导航栏右上角登录按钮
  let avatar = $("img.avatar"); // 登陆后显示的头像
  if (Cookies.get("userName") && profile) {
    let profileObj = JSON.parse(profile);
    loginBtn.hide(); // 隐藏登录按钮
    avatar.attr("src", profileObj.avatarUrl);
    avatar.show(); // 显示头像
    loginBtnBox.on("mouseenter", enter); // 鼠标进入事件显示下拉框
    loginBtnBox.on("mouseleave", leave); // 鼠标移出事件隐藏下拉框
  }

  // *****退出登录AJAX*****
  let logOut = $("a.log-out"); // 退出登录按钮
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
        window.location.href = "index.html";
      },
    });
  }
});
