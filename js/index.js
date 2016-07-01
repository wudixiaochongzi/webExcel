
//--------------对数据的操作:先以死数据为例，数据保存在本地存储中-----------------
var listCont=$('.goodsList tbody');
var nineBox=$('.nineBox');
var excel=[
    {id:0,num:5,name:'张三',email:'zhangsan@163.com',phone:13273191079},
    {id:1,num:8,name:'李四',email:'456aa@163.com',phone:13373191079},
    {id:2,num:6,name:'王五',email:'aa123@163.com',phone:13789083772},
    {id:3,num:3,name:'赵六',email:'123456@qq.com',phone:13457765432},
    {id:4,num:20,name:'田七',email:'sadsf@gmail.com',phone:13578990843},
    {id:5,num:12,name:'李飞',email:'lihan@163.com',phone:15643222445},
    {id:6,num:17,name:'张思',email:'66666@qq.com',phone:12134564332},
    {id:7,num:9,name:'郑和',email:'lihan@132.com',phone:13784322457},
    {id:8,num:4,name:'和珅',email:'aaaaaa@126.com',phone:15973228990},
    {id:9,num:11,name:'秦琼',email:'rytrytr@163.com',phone:15294738929},
    {id:10,num:19,name:'关羽',email:'gunayu@126.com',phone:13585939002},
    {id:11,num:5,name:'韩信',email:'hanxin@126.com',phone:14245678897},
    {id:12,num:2,name:'曹操',email:'caocao@126.com',phone:12134564332},
    {id:13,num:13,name:'刘备',email:'liubei@126.com',phone:13973223990},
    {id:14,num:6,name:'赵云',email:'zhaoyun@126.com',phone:18973823550},
    {id:15,num:21,name:'张飞',email:'zhangfei@126.com',phone:13973666990},
    {id:16,num:12,name:'吕布',email:'lvbu@126.com',phone:1597776990},
    {id:17,num:1,name:'董卓',email:'dongzhuo@126.com',phone:16973222980}
];
if (localStorage.excel==undefined){
    localStorage.setItem("excel",JSON.stringify(excel));
}
//获取数据函数
function getData () {
    var data=JSON.parse(localStorage.getItem("excel"));
    return data||[];
}
//保存到后台数据函数
function saveData (data) {
    localStorage.setItem("excel",JSON.stringify(data));
}
//绘制数据到页面
reWrite();
function reWrite () {
    //表格的绘制
    var str='';
    var data=getData();
    data.forEach(function(obj,i){
        str+='<tr id="'+obj.id+'"><td class="text-center" id="num">'+obj.num+'</td><td class="text-center" id="name">'+obj.name+'</td><td class="text-center" id="email">'+obj.email+'</td><td class="text-center" id="phone">'+obj.phone+'</td></tr>';
    });
    listCont.empty().html(str);
    //九宫格的绘制
    var nineStr='';
    data.forEach(function(obj,i){
        nineStr+='<div class="col-md-4 col-sm-6 nineItem"><div class="nineContent"><p>序号：'+obj.num+'</p><p>姓名：'+obj.name+'</p><p>邮箱：'+obj.email+'</p> <p>手机：'+obj.phone+'</p></div></div>';
    });
    nineBox.html(nineStr);
}

$('tbody').on('dblclick','td',function(){
    $(this).html("<input type='text' name='editInput' id='editInput' value='"+ $.trim($(this).text())+"'>");
    $(this).find("input").focus();
    $(this).find("input").select();
    $(this).find("input").blur(
        function() {
            var data=getData();
            var thisId=$(this).parent("td").parent('tr').attr('id');
            var thisData=$(this).parent("td").attr('id');
            var val=$(this).val();
            if(val==''){
                $(this).parent("td").html('&nbsp;');
            }else{
                $(this).parent("td").html(val);
            }
            data.forEach(function(obj,i){
                if (obj.id==thisId){
                    if (thisData=='num'){
                        obj.num=val;
                        excel=data;
                        saveData(data);
                        reWrite();
                    }else if (thisData=='name'){
                        obj.name=val;
                        excel=data;
                        saveData(data);
                        reWrite();
                    }else if(thisData=='email'){
                        obj.email=val;
                        excel=data;
                        saveData(data);
                        reWrite();
                    }else if(thisData=='phone'){
                        obj.phone=val;
                        excel=data;
                        saveData(data);
                        reWrite();
                    }
                }
            });
        }
    );
});
var StartTD = null;
var StartIndex = null;
var EndTD = null;
var EndIndex = null;
$(this).ready(function () {
    $("tbody td").unbind("mousedown").bind("mousedown", function () {
        $("tbody td").css("background-color", "");
        StartTD = $(this);
        var y = $(this).index();
        var x = $(this).parent().index();
        StartIndex = { x: x, y: y };
    });
    $("tbody td").unbind("mouseup").bind("mouseup", function () {
        EndTD = $(this);
        var y = $(this).index();
        var x = $(this).parent().index();
        EndIndex = { x: x, y: y };
        SelectTD(StartIndex, EndIndex, "#B7DBFF");
    });
    $("#btMerge").click(function () {
        MergeCell(StartIndex, EndIndex);
    });
});
//----------------选中单元格----------------
function SelectTD(StartIndex, EndIndex,Color) {
    var MinX = null;
    var MaxX = null;
    var MinY = null;
    var MaxY = null;
    if (StartIndex.x < EndIndex.x) {
        MinX = StartIndex.x; MaxX = EndIndex.x;
    }else {
        MinX = EndIndex.x; MaxX = StartIndex.x;
    }
    if (StartIndex.y < EndIndex.y) {
        MinY = StartIndex.y; MaxY = EndIndex.y;
    } else {
        MinY = EndIndex.y; MaxY = StartIndex.y;
    }
    StartIndex = { x: MinX, y: MinY };
    EndIndex = { x: MaxX, y: MaxY };
    for (var i = MinX; i <= MaxX; i++) {
        for (var j = MinY; j <= MaxY; j++) {
            var SelectTR = $("tbody tr").eq(i);
            $("td", SelectTR).eq(j).css("background-color", Color);
        }
    }
}
//------------------合并单元格-----------------
function MergeCell(StartIndex, EndIndex) {
    var Colspan = null;
    var Rowspan = null;
    Rowspan = Math.abs(EndIndex.x - StartIndex.x) + 1;
    Colspan = Math.abs(EndIndex.y - StartIndex.y) + 1;
    if (EndIndex.x < StartIndex.x){
        var a=EndIndex.x;
        EndIndex.x=StartIndex.x;
        StartIndex.x=a;
    }
    if (EndIndex.y < StartIndex.y){
        var b=EndIndex.y;
        EndIndex.y=StartIndex.y;
        StartIndex.y=b;
    }
    var IndexTR = $("tbody tr").eq(StartIndex.x);
    $("td", IndexTR).eq(StartIndex.y).attr("colspan", Colspan).attr("rowspan", Rowspan);
    for (var i = StartIndex.x; i <= EndIndex.x; i++) {
        for (var j = StartIndex.y; j <= EndIndex.y; j++) {
            if (i == StartIndex.x && j == StartIndex.y) continue;
            var SelectTR = $("tbody tr").eq(i);
            $("td", IndexTR).eq(StartIndex.y).html(''+$("td", IndexTR).eq(StartIndex.y).html()+$("td", SelectTR).eq(j).html());
            $("td", SelectTR).eq(j).hide();
        }
    }
}
//-----------------排序--------------------
$(".sorter").tableSorter();
//----------------固定表头--------------------
$('#goodsList').scroll(function() {
    var id = '#' + this.id;
    var scrollTop = $('id').scrollTop() || $(id).get(0).scrollTop,
        style = {
            'position': 'absolute',
            'left': '0',
            'right': '0',
            'top': scrollTop + 'px'
        };
    var th_width = [];
    $(id + ' .scrollTable th').each(function() {
        th_width.push(this.offsetWidth);
    });
    if ($(id + ' .fixTable') && $(id + ' .fixTable').length) {
        (scrollTop === 0) ? $(id + ' .fixTable').addClass('hidden') : $(id + ' .fixTable').removeClass('hidden');
        $(id + ' .fixTable').css(style);
    } else {
        var html = $(id + ' .scrollTable thead').get(0).innerHTML;
        var table = $('<table class="table table-bordered fixTable"><thead>' + html + '</thead></table>');
        table.css(style);
        $(id).append(table);
    }
});

//--------------九宫格屏幕样式-----------------
var nineBtn=$('#nineBtn');
var listBtn=$('#listBtn');
var goodsList=$('.goodsList');
var nineList=$('.nineList');
nineBtn.click(function(){
    goodsList.addClass('hidden');
    nineList.removeClass('hidden');
});
listBtn.click(function(){
    nineList.addClass('hidden');
    goodsList.removeClass('hidden');
});
