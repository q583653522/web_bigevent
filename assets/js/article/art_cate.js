$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initArctCateList();
  // 获取文章分类的列表
  function initArctCateList() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg(res.message);
        }
        // 使用模板引擎渲染模板
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        console.log(res);
      },
    });
  }
  //====================添加功能====================
  // 为添加类别按钮绑定点击事件
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    // 设置层索引
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  //需要用代理的模式,为弹出框#form-add的 确认按钮 绑定submit事件
  //因为绑定的时候，页面还没有这个元素.
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    //url表单数据 转为json字符串
    function serialize(a) {
      var o = {};
      var items = a.split("&");
      for (var i = 0; i < items.length; i++) {
        var item = items[i].split("=");
        o[item[0]] = item[1];
      }
      console.log(o);
      return JSON.stringify(o);
    }
    var data = $(this).serialize();
    // 将表单数据转换为对象格式
    data = serialize(data);
    console.log(data);

    $.ajax({
      method: "POST",
      url: "/my/cate/add",
      // contentType:'application/x-www-form-urlencoded',
      contentType: "application/json",
      data: data,
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("新增分类失败");
        }
        initArctCateList();
        layer.msg("新增分类成功");
        // 依据索引关闭对应层
        layer.close(indexAdd);
      },
    });
  });

  //====================修改功能====================
  //通过代理的形式，为btn-edit 绑定点击事件，
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    //弹出修改文章信息的弹窗。
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });

    // 使用自定义属性值 获取id值
    var id = $(this).attr("data-id");
    console.log(id);

    //获取已有分类信息
    $.ajax({
      method: "GET",
      url: "/my/cate/info/" + "?id=" + id,
      success: function (res) {
        console.log(res);
        //渲染表单
        form.val("form-edit", res.data);
      },
    });
  });

  //监听form-edit表单提交 代理形式
  $("body").on("submit", "#form-edit", function (e) {
    var data = $(this).serialize();
    function dataToJson(data) {
      dataObject = {};
      dataArray = data.split("&");
      for (var i = 0; i < dataArray.length; i++) {
        var item = dataArray[i].split("=");
        dataObject[item[0]] = item[1];
      }
      return JSON.stringify(dataObject);
    }
    data = dataToJson(data);
    console.log(data);
    e.preventDefault();
    $.ajax({
      method: "PUT",
      url: "/my/cate/info",
      data: data,
      contentType: "application/json",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("修改失败");
        }
        layer.msg("修改成功");
        layer.close(indexEdit);
        initArctCateList();
      },
    });
  });

  //====================删除功能=====================
  $("tbody").on("click", ".btn-del", function () {
    // console.log("删除");
    var id ={"id":$(this).attr("data-id")} ;
    var idUrl2 = new URLSearchParams(id);
    var idUrl = new URLSearchParams(id).toString();
    console.log(id)
    console.log(idUrl2)
    console.log(idUrl)
    // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "DELETE",
        url: "/my/cate/del/?" + idUrl,
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("删除失败");
          }
          layer.msg("删除成功");
          initArctCateList();
          layer.close(index);
          initArctCateList();
        },
      });
    });
  });
});
