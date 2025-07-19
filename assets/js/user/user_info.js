$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称不能超过6个字符";
      }
    },
  });

  initUserInfo();
  // 初始化 用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      // contentType: "application/json",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("获取用户信息失败");
        }
        console.log(res);

        //调用 form.val()快速为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 重置表单的数据
  $("#btnReset").on("click", function (e) {
    // 阻止默认的表单提交事件
    e.preventDefault();
    initUserInfo();
  });

  // 监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    // 将表单数据序列化成对象
    var serializedData = $(this).serialize();
    var dataObject = {};
    var searchParams = new URLSearchParams(serializedData);
    console.log(searchParams)
    searchParams.forEach(function(value, key) {
      dataObject[key] = value;
    });
    console.log(dataObject)
    dataObject = JSON.stringify(dataObject);
    console.log(dataObject)

    // 阻止默认的表单提交事件
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      method: "put",
      url: "/my/userinfo",
      data: dataObject,
      contentType: "application/json",
      success:function(res){
        if(res.code!== 0){
          console.log(res.message)
          return layer.msg('更新用户信息失败')
        } 
        layer.msg('更新用户信息成功')
        // 调用 父页面中的方法，重新渲染用户的头像和用户的信息
        // 在子页面中，调用父页面的渲染方法 getUserInfo()
        window.parent.getUserInfo()
      }
    })
  });


});
