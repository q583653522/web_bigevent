$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 美化时间过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1 + "").padStart(2, "0");
    var d = (dt.getDate() + "").padStart(2, "0");
    var h = (dt.getHours() + "").padStart(2, "0");
    var mi = (dt.getMinutes() + "").padStart(2, "0");
    var s = (dt.getSeconds() + "").padStart(2, "0");

    return `${y}-${m}-${d} ${h}:${mi}:${s}`;
  };

  // 定义查询对象
  var q = {
    pagenum: 1 /* 当前页码数 */,
    pagesize: 10 /* 每页显示的文章数 */,
    cate_id: null /* 文章分类ID */,
    state: null /* 文章状态 */,
  };
  console.log(JSON.stringify(q));

  //默认渲染页面
  initTable();
  initCate();

  // 获取文章列表数据,并渲染到表格中方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg(res.message);
        }
        console.log("获取文章列表成功");
        console.log(res);
        // 使用模板引擎渲染表格数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类下拉框
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg(res.message);
        }
        console.log("获取文章分类成功");
        console.log(res);
        // 调用模板引擎渲染分类的下拉框
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通知layui，重新渲染表单
        form.render();
      },
    });
  }
  // =============文章列表筛选=============
  // 监听表单提交
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单数据
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 更新查询对象 q ,赋值
    q.cate_id = cate_id;
    q.state = state;
    // 调用查询方法
    initTable();
  });

  // =============定义渲染分页的方法=============
  // 确定表格渲染后，再调用该方法渲染分页
  function renderPage(total) {
    // 获取分页数据
    console.log(total);
    // 调用laypage.render()方法渲染分页的结构
    laypage.render({
      elem: "pageBox", //分页容器的id
      count: total, //数据总数
      limit: q.pagesize, //每页显示的条数
      limits: [2, 3, 5, 10], //可供选择的每页显示的条数
      curr: q.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"], // 注意顺序
      // 分页发生切换的时候触发的事件
      // 监听分页的点击事件
      // 拿到页码值,重新渲染表格.
      // 触发jump的方式有两种,
      // 1. 种是点击页码,种是点击上一页,下一页按钮
      // 2 只要调用了laypage.render()方法,就会触发jump回调.
      // 解决:条件判断调用方式
      jump: function (obj, first) {
        console.log(`当前页码值:${obj.curr}`);
        // console.log(first);
        // 更新查询对象的当前页码值
        q.pagenum = obj.curr;
        // 根据最新的q获取对应的数据列表,并渲染到表格中.注意死循环问题
        // 解决:依据first参数,判断是否第一次调用.
        // 更新查询对象的每页条目数
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  // =============文章删除=============
  // 通过代理的形式为删除按钮绑定点击事件处理函数
  $("tbody").on("click", ".btn-delete", function () {
    // 获取当前删除按钮的个数
    var len = $(".btn-delete").length;
    // 获取事件文章的id
    var id = $(this).attr("data-id");
    layer.confirm(
      "确认删除该文章?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          method: "DELETE",
          url: "/my/article/info/?id=" + id,
          success: function (res) {
            if (res.code !== 0) {
              return layer.msg(res.message);
            }
            layer.msg("删除成功");
            // 当数据删除成功后,需判断当前这儿一页中,是否还有剩余的数据
            // 如果没有剩余的数据了,则让页码值-1
            // 重新渲染表格
            // 如果len=1 ,则说明删除后,页面没有数据.
            if (len === 1) {
              q.pagenum = q.pagenum ===1 ? 1 : q.pagenum - 1;
            }
            initTable();
          },
        });
        layer.close(index);
      }
    );
  });
});
