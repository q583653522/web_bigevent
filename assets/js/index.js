// 入口函数
$(function () {
  //调用 gerUserInfo 函数获取用户信息
  getUserInfo();

  var layer = layui.layer;

  //点击按钮实现退出登录功能
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm(
      "确认退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        console.log("ok");
        // 1. 清空本地存储的token
        localStorage.removeItem("token");
        // 2. 回退页面
        location.href = "./login.html";
        // 3. 关闭confirm弹窗
        layer.close(index);
      }
    );
  });
});

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "get",
    url: "/my/userinfo",
    // contentType: "application/json",
    // 有权限请求，需要设置请求头
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      console.log(res);
      if (res.code !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      // 调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },
    
  });
}

// 头像渲染
function renderAvatar(user) {
  // 1. 获取用户名称
  var name = user.nickname || user.username;
  // 2.设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // console.log($("#welcome").html());
  // 3. 按需渲染设置用户头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 4. 未设置头像，设置默认头像
    $(".layui-nav-img").hide();
    var firstChar = name[0].toUpperCase();
    $(".text-avatar").html(firstChar).show();
  }
}
