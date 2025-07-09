$(function () {
  // 点击 注册账号连接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })
  // 点击 登录连接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  // 从layui中获取form对象
  var form = layui.form
  // 自定义校验规则
  form.verify({
    // 自定义了pwd校验规则,不是空格开头,6~12位,
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    // 注册界面,密码两次输入一致
    repwd: function (value) {
      // 通过形参拿到密码确认框和输入框的value值,判断比较
      var pwd = $('.reg-box [name="password"]').val();
      if (pwd !== value) {
        return '两次输入的密码不一致';
      }
    },

    username: function (value) {
      if (value.trim() === '') {
        return '用户名是必需项';
      }
    }
  })
  //测试注册按钮点击事件
  $('#form_reg .layui-form-item .layui-btn').on('click', function () {
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
      repassword: $('#form_reg [name=repassword]').val()

    };
    data = JSON.stringify(data);

    console.log('注册按钮点击')
    console.log(data)

  })

  // 监听注册表单的提交
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    // 阻止默认提交
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
      repassword: $('#form_reg [name=repassword]').val()
    };
    // console.log('注册提交')
    // $.post('http://big-event-vue-api-t.itheima.net/api/reg',
    //   data,
    //   function (res) {
    //     console.log(data)
    //     console.log(res)
    //     console.log(res.code)
    //   }
    // )
    data = JSON.stringify(data);
    $.ajax({
      url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      type: 'POST',
      data: data,
      // 我真是屮了,这里居然要设置content-type,不然会报错
      contentType: 'application/json',
      success: function (res) {
        console.log(res)
      },
      error: function (err) {
        console.log(err)
      }
    })
  })
})
