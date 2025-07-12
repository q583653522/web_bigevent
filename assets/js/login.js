$(function () {
  // 点击 注册账号连接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 点击 登录连接
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  // 从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  // 自定义校验规则
  form.verify({
    // 自定义了pwd校验规则,不是空格开头,6~12位,
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    // 注册界面,密码两次输入一致
    repwd: function (value) {
      // 通过形参拿到密码确认框和输入框的value值,判断比较
      var pwd = $('.reg-box [name="password"]').val();
      if (pwd !== value) {
        return "两次输入的密码不一致";
      }
    },

    username: function (value) {
      if (value.trim() === "") {
        return "用户名是必需项";
      }
    },
  });
  //测试注册按钮点击事件
  $("#form_reg .layui-form-item .layui-btn").on("click", function () {
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
      repassword: $("#form_reg [name=repassword]").val(),
    };
    data = JSON.stringify(data);

    console.log("注册按钮点击");
    console.log(data);
  });
  //测试登录按钮点击事件
  $("#form_login .layui-form-item .layui-btn").on("click", function () {
    //   var data = $('#form_login').serialize();
    //   // data = JSON.stringify(data);
    //   console.log("注册按钮点击");
    //   console.log(data);
    // data = {
    //     username: $("#form_login [name='username']").val(),
    //   password: $("#form_login [name='password']").val(),
    //   };
    //   data = JSON.stringify(data);
    //   console.log(data);
  });

  // 监听注册表单的提交
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    // 阻止默认提交
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
      repassword: $("#form_reg [name=repassword]").val(),
    };
    data = JSON.stringify(data);
    $.ajax({
      url: "/api/reg",
      type: "POST",
      data: data,
      // 我真是屮了,这里居然要设置content-type,不然会报错
      contentType: "application/json",
      success: function (res) {
        //默认人的点击行为
        $("#link_login").click();
        return layer.msg(res.message);
      },
      error: function (err) {
        return layer.msg(err.message);
        // console.log(err)
      },
    });
  });

  // 监听登录表单的提交
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    // var data2 = $(this).serialize();
    var data3 = $(this).serialize();

    var data2 = {
      username: $("#form_login [name='username']").val(),
      password: $("#form_login [name='password']").val(),
    };
    data2 = JSON.stringify(data2);
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: data2,
      contentType: "application/json",
      success: function (res) {
        if (res.code !== 0) {
          console.log("登录失败");
          return layer.msg(res.message);
        }
        
        console.log(data3)
        console.log(data2)
        layer.msg("登录成功");
        console.log(res.token);
        //将登录成功的 token 字符串，保存到本地 localStorage 中
        localStorage.setItem("token", res.token);
        //跳转后台
        // location.href = './index.html'

      },
    });
  });
});

// qwerrewq5 qwerrewq5
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTQ0NDcsInVzZXJuYW1lIjoicXdlcnJld3E1Iiwibmlja25hbWUiOiIiLCJlbWFpbCI6IiIsImlhdCI6MTc1MjMwODQ1OCwiZXhwIjoxNzUyMzQ0NDU4fQ.GhNA4RgIJj_cow2Lq7r97phT8j7zF0W8I4xYFahPdtA