//每次调用$.get 或$.post $.ajax都会先执行这个函数
$.ajaxPrefilter(function (options) {
  options.url = "http://big-event-vue-api-t.itheima.net" + options.url;
  console.log(options.url);

  // 统一为有权限的接口，设置headers请求头
  if (options.url.indexOf("/my") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  // 全局统一挂载，complete回调函数，不论成功还是失败，最终都会调用complate函数
  options.complete = function (res) {
    console.log("执行了complete");
    //在 compltete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据。
    // console.log(res);
    if (
      res.responseJSON.code == 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1. 强制清空 token
      localStorage.removeItem("token");
      // 2. 强制回退页面到登录页面
      location.href = "./login.html";
    }
  };
});
