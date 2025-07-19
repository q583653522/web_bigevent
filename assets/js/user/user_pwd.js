$(function () {
  var form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $('[name="old_pwd"]').val()) {
        return "新密码不能与旧密码相同";
      }
    },
    rePwd: function (vaule) {
      if (vaule !== $('[name="new_pwd"]').val()) {
        return "两次输入的密码不一致";
      }
    },
  });

  $('.layui-form').on('submit',function(e){
    var data = $(this).serialize();
    var dataObject = {};
    var searchParams = new URLSearchParams(data)
    console.log(searchParams)
    searchParams.forEach(function(value,key){
      dataObject[key] = value;})
    console.log(dataObject)
    data = JSON.stringify(dataObject);
    console.log(data)

    e.preventDefault();
    $.ajax({
      method:'PATCH',
      url:'/my/updatepwd',
      contentType:'application/json',
      data:data,
      success:function(res){
        if(res.code !== 0){
          console.log(res.msg)
          return layui.layer.msg('更新密码失败');
        }
        console.log(res.msg)
        layui.layer.msg('更新密码成功');
        // 重置表单
        // $('.layui-form')获取的时jquery对象数组，要用[0]获取第一个对象元素，即form表单（DOM对象） 使用原生reset方法重置表单
        $('.layui-form')[0].reset();
      }
    })
  })
});
