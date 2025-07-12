//每次调用$.get 或$.post $.ajax都会执行这个函数
$.ajaxPrefilter(function(options){
  options.url = 'http://big-event-vue-api-t.itheima.net'+options.url
  console.log(options.url)
})