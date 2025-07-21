$(function () {
  var layer = layui.layer;
  var form = layui.form;

  // 初始化富文本编辑器
  initEditor();

  // ==============文章加载文章分类的方法================
  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/cate/list",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("获取文章分类失败!");
        }
        console.log(res.data);

        // 调用模板引擎，渲染文章分类列表
        var htmlStr = template("cateTpl", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // ==============文章封面裁剪区域================
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 初始化裁剪区域:依据图片的原始尺寸，初始化裁剪区域的尺寸
  $image.cropper(options);

  // 模拟点击上传图片按钮
  $("#uploadImg").on("click", function () {
    $("#coverFile").click();
  });
  // 4. 监听文件选择
  $("#coverFile").on("change", function (e) {
    // 更换裁剪的图片
    console.log(e);
    // 判断用户是否选择了文件
    if (e.target.files.length === 0) {
      return;
    }
    var file = e.target.files[0];
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file);
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // ==============文章发布================
  // 定义文章的发布状态
  var art_state = "已发布";
  // 监听文章存为草稿按钮 绑定事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
  // 监听文章发布按钮 绑定事件
  $("#form-pub").on("submit", function (e) {
    console.log("有提交事件");
    e.preventDefault();
    console.log($(this));
    // 基于form表单创建formData对象 ,[0]是为了将jquery对象转化为dom对象
    var fd = new FormData($(this)[0]);
    // 追加文章状态
    fd.append("state", art_state);

    // 将封面裁剪过后的图片，追加到formData对象中
    // 裁剪&转换
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，追加到formData对象中
        fd.append("cover_img", blob);
        // 发送ajax请求
        publishArticle(fd);
      });
  });
  // 定义发布文章的函数，发送ajax请求
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 如果向服务器提交的FormData格式的数据
      // 那么需要设置contentType: false, processData: false
      processData: false,
      contentType: false,
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg(res.message);
        } 
        //发布后,delay 500ms后跳转到文章列表页面
          setTimeout(function () {
          location.href ='/article/art_list.html'
          }, 500);
          layer.msg("发布成功!");
          console.log(res)
        
      },
    });
  }
});
