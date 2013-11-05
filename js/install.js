	var server_path = "../php/install.php";
var init_dom = function(){
	var language = {
		 "step":"步骤"
		,"steps":
			["检查系统环境,包括:检查 PHP版本,检查关键PHP参数是否准确,检查核心文件及文件夹的执行权限"
			 ,"配置安装模式,数据库连接参数,系统语言"
			 ,"初始化数据库表"
			 ,"初始化 权限,用户组,管理员帐号 等基础数据"
			 ,"模拟基础的业务数据:用户,用户组,科目,简单的练习卷.你也可以跳过这一步,直接登录系统首页: <a href='../html/desktop.html' target='_blank'>首页</a> 帐号密码都是 admin "
			 ,"模拟学生练习记录"
			 ,"模拟多人考卷"
			 ,"多人考卷执行批改"
			 ]
		 ,"database":{
	         "db":"数据库名称"
	         ,"port":"端口"
	         ,"unm":"帐号"
	         ,"pwd":"密码"
	         ,"host":"域名"
	         ,"mode":"安装模式"
	         ,"type":"数据库类型"
		 } 
		,simulate:{
			 year_start:"开始年份"
			,year_stop:"结束年份"
		}
		,"il8n":"语言"
	};
	
	var buttons = $(".btn_step");
	for(var i=0;i<buttons.length;i++){
		$(buttons[i]).html(language.step+" "+(i+1));
		$($(".directions_step")[i]).html(language.steps[i]);
	}
	
	$('#mode').html(language.database.mode);
    $('#host').html(language.database.host);
    $('#unm').html(language.database.unm);
    $('#pwd').html(language.database.pwd);
    $('#db').html(language.database.db);
    $('#port').html(language.database.port);
    $('#il8n').html(language.il8n);
    $('#type').html(language.database.type);
    
    $('#year_start').html(language.simulate.year_start);
    $('#year_stop').html(language.simulate.year_stop);
}



var on_mode_changed = function(){
	var value = $('#mode').val();
	if(value!='WLS'){
		$('#host').attr('disabled',true);
		$('#unm').attr('disabled',true);
		$('#pwd').attr('disabled',true);
		$('#port').attr('disabled',true);
		$('#db').attr('disabled',true);
	}else{
		$('#host').attr('disabled',false);
		$('#unm').attr('disabled',false);
		$('#pwd').attr('disabled',false);
		$('#port').attr('disabled',false);
		$('#db').attr('disabled',false);
	}	
	
	if(value=='BAIDU')$('#db').attr('disabled',false);
}

var step1 = function() {
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[0]).attr("disabled", true);
    $.ajax({
            url : server_path+"?class=install&function=step1&rand="+Math.random(),
            dataType : 'json',
            type : "POST",
            data : {
                    executor : "",
                    session : ""
            },
            success : function(response) {
                    $(log_doms[0]).append(response.msg + "<br/>");
                    if (response.status == "1") {
                            $(btn_doms[0]).attr("disabled", true);
                            $(btn_doms[0]).addClass("btn_done");
                            $(log_doms[0]).addClass("log_done");
                            $($("fieldset")[1]).addClass("f_step");
                    } else {
                            $(btn_doms[0]).attr("disabled", false);
                    }
            },
            error : function(response) {
                    $(log_doms[0]).append(response.responseText);
                    $(btn_doms[0]).attr("disabled", false);
                    $(btn_doms[0]).attr("class", "btn_step");
            }
    });
}

var step2 = function() {
    var status = 1;

    var host = $('[name=host]').val();
    if (host == null || host == "")status = 0;

    var unm = $('[name=unm]').val();
    if (unm == null || unm == "")status = 0;

    var pwd = $('[name=pwd]').val();
    //if(pwd==null||pwd=="")status = 0;

    var port = $('[name=port]').val();
    //if(port==null||port=="")status = 0;

    var db = $('[name=db]').val();
    if (db == null || db == "")status = 0;

    if (status == 0) {
            alert("Must input everything");
            return;
    }

    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[1]).attr("disabled", true);
    $.ajax({
            url : server_path+"?class=install&function=step2&rand="+Math.random(),
            dataType : 'json',
            type : "POST",
            data : {
                    executor : "",
                    session : "",
                    
                    unm : unm,
                    host : host,
                    pwd : pwd,
                    db : db,
                    port : port,
                    il8n : $('[name=il8n]').val(),
                    type : $('[name=type]').val(),
                    mode : $('[name=mode]').val()
            },
            success : function(response) {
                    $(log_doms[1]).append(response.msg + "<br/>");
                    if (response.status == "1") {
                            $(btn_doms[1]).attr("disabled", true);
                            $(btn_doms[1]).addClass("btn_done");
                            $(log_doms[1]).addClass("log_done");                           
                            var formItems = $("[name]",$("fieldset")[1]);
                            for(var i=0;i<formItems.length;i++){
                            	$(formItems[i]).attr("disabled","disabled");
                            }
                            $($("fieldset")[2]).addClass("f_step");
                    } else {
                            $(btn_doms[1]).attr("disabled", false);
                    }
            },
            error : function(response) {
                    $(log_doms[1]).append(response.responseText);
                    $(btn_doms[1]).attr("disabled", false);
                    $(btn_doms[1]).attr("class", "btn_step");
            }
    });
}


var step3 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[2]).attr("disabled", true);
	$.ajax({
		url: "../php/install.php?class=install&function=step3"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[2]).append(response.msg + "<br/>");
			if(response.status=="1"){
				sqls = response.sql;
				step3_2();
			}else{
				$(btn_doms[2]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[2]).attr("disabled", false);
		}
	});	
}

var sqls = [];
var offset = 0;
var step3_2 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
	var sqls_ = [];
	for(var i=offset;(i<offset+20)&&(i<sqls.length-1);i++){
		sqls_.push(sqls[i]);
	}
	$.ajax({
		url: "../php/install.php?class=install&function=step3_2"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
			,sqls: $.ligerui.toJSON(sqls_)
        }         
        ,success : function(response) {
            $(log_doms[2]).append(response.msg + "<br/>");
            if (response.status == "1") {
   				offset +=20;
   				if(offset<=sqls.length-1){
   					step3_2();
   				}else{
                    $(btn_doms[2]).addClass("btn_done");
                    $(log_doms[2]).addClass("log_done");
   					$($("fieldset")[3]).addClass("f_step");
   				}                    
            } else {
            	$(btn_doms[2]).attr("disabled", false);
            }
	    }
	    ,error : function(response) {
	            $(log_doms[2]).append(response.responseText);
	            $(btn_doms[2]).attr("disabled", false);
	            $(btn_doms[2]).attr("class", "btn_step");
	    }
	});	
};

var step4 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[3]).attr("disabled", true);
	$.ajax({
		url: "../php/install.php?class=install&function=step4"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[3]).append(response.msg + "<br/>");
			if(response.status=="1"){
                $(btn_doms[3]).addClass("btn_done");
                $(log_doms[3]).addClass("log_done");
				$($("fieldset")[4]).addClass("f_step");
			}else{
				$(btn_doms[4]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[3]).attr("disabled", false);
		}
	});	
}

var step = 0;
var dates = [];

var urls_1 = [];
var step_1 = 0;
var step5 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
	if(step_1==0){
		var year_start = $('[name=year_start]',fieldset_doms[4]).val();
		var year_stop = $('[name=year_stop]',fieldset_doms[4]).val();
		if(parseInt(year_start)!=year_start){
			alert("year_start wrong! must input Integer");return;
		}
		if(parseInt(year_stop)!=year_stop){
			alert("year_stop wrong! must input Integer");return;
		}
		if(year_stop-year_start > 10){
			alert("Year gap too big , ensure it's smaller than 10");return;
		}
		if(year_stop < year_start){
			alert("year_stop must bigger than year_start");return;
		}		
		if(year_start<2000){
			alert("year start from 2000 please");return;
		}
		
		for(var year=year_start;year<=year_stop;year++){
			var date_start,date_stop;
			date_start = new Date(year,'02','04');
			date_stop = new Date(year,'06','12');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}

			date_start = new Date(year,'07','27');
			date_stop = new Date(year,'11','30');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}
		}


		var ddd = [];
		var len = 10;
		for(var i=0;i<dates.length;i+=len){
			var dd = [];
			for(var ii=i;ii<i+len;ii++){
				if(ii>=dates.length)break;
				dd.push(dates[ii])
			}
			ddd.push(dd);
		}

		urls_1 = [
		 "../php/install.php?class=install&function=data4test__basic_group"
		,"../php/install.php?class=install&function=data4test__basic_user"
		,"../php/install.php?class=install&function=data4test__exam_subject"
		];

		for(var i=0;i<ddd.length;i++){
			var theurl = "../php/install.php?class=install&function=data4test__exam_paper&dates="+$.ligerui.toJSON(ddd[i]);
			if(i==0)theurl+="&delete=1";
			urls_1.push(theurl);
		}
		$(log_doms[4]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_1.length+", this may take a long long time <br/><br/>");
		$(btn_doms[4]).attr("disabled", true);
        $(btn_doms[4]).addClass("btn_done");
        $(log_doms[4]).addClass("log_done");
	}
	
	$.ajax({
		url: urls_1[step_1]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[4]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[4])).html(step_1+1);
				if(step_1>=urls_1.length-1){
					$('#step6').css("display","block");
					return;
				}
				step_1++;				
				step5();
			}else{
				$('#btn_simulate').attr("disabled",false);
			}
		}
		,error : function(response){				
			alert("net error");
			$('#btn_simulate').attr("disabled",false);
		}
	});	
}

var step_2 = 0;
var students = null;
var urls = [];
var dates = [];
var date_start,date_stop;
date_start = new Date('2013','02','04');
date_stop = new Date('2013','06','12');
for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
	var d = new Date(i);
	dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
}

var ddd = [];
var len = 20;
for(var i=0;i<dates.length;i+=len){
	var dd = [];
	for(var ii=i;ii<i+len;ii++){
		if(ii>=dates.length)break;
		dd.push(dates[ii])
	}
	ddd.push(dd);
}

for(var i=0;i<ddd.length;i++){
	var theurl = "../php/install.php?class=install&function=simulate__exam_paper_log&dates="+$.ligerui.toJSON(ddd[i]);
	urls.push(theurl);
}
var urls_2 = urls;
var student_step = 0;
var simulate__exam_paper_log = function(){
	$('#btn_simulate__exam_paper_log').attr("disabled",true);

	if(students==null){
		$.ajax({
			 url: "../php/install.php?class=install&function=simulate__get_students"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				students = response.data;
				simulate__exam_paper_log();
			}
			,error : function(response){				

			}
		});	
		return;
	}
	
	if(step_2==0){
		$('#log_simulate__exam_paper_log').append("<br/> AJAX operation: <span id='simulate__exam_paper_log___step'>0</span>/"+(urls_2.length * students.length)+", this may take a long long time <br/><br/>");
	}
	
	var url_ = urls_2[step_2];
	if(step_2==0&&student_step==0){
		url_+="&delete=1";
	}
	$.ajax({
		url: url_
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
			,student: students[student_step]
        }         
		,success : function(response) {
			$('#log_simulate__exam_paper_log').append(response.msg+"<br/>");
			if(response.status=="1"){
				$('#btn_simulate__exam_paper_log').attr("disabled",true);
				$('#log_simulate__exam_paper_log').attr("class","log_done");
				$('#simulate__exam_paper_log___step').html(step_2+1+student_step*urls_2.length);
				if(step_2>=urls_2.length-1){
					step_2 = 0;
					student_step ++;
				}
				if(student_step>=students.length-1){
					$('#step7').css("display","block");
					return;
				}
				//if(step>3)return;
				step_2++;				
				simulate__exam_paper_log();
				
			}else{
				$('#btn_simulate__exam_paper_log').attr("disabled",false);
			}
		}
		,error : function(response){				
			alert("net error");
			$('#btn_simulate__exam_paper_log').attr("disabled",false);
		}
	});	
}

var step_7 = 0;
var students_7 = null;
var dates = [];
var date_start,date_stop;
date_start = new Date('2013','02','04');
date_stop = new Date('2013','06','12');
for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
	var d = new Date(i);
	dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
}

var ddd = [];
var len = 10;
for(var i=0;i<dates.length;i+=len){
	ddd.push(dates[i]);
}

var urls_7 = [];
var student_step = 0;
var subjects = null;
var subject_step = 0;
var simulate__exam_paper_multionline = function(){
	if(students_7==null){
		step_7 = 0;
		$.ajax({
			 url: "../php/install.php?class=install&function=simulate__get_students"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				students_7 = response.data;
				$.ajax({
					 url: "../php/install.php?class=install&function=simulate__get_subjects"
					,dataType: 'json'
			        ,type: "POST"		
			        ,data: {
						 executor: ""
						,session: ""
			        }         
					,success : function(response) {
						subjects = response.data;
						
						var ddddd = [];
						for(var i=0;i<ddd.length;i+=5){
							var dddd = [];
							for(var i2=i;i2<ddd.length,i2<i+5;i2++){
								if(i2>=ddd.length)break;
								dddd.push(ddd[i2]);
							}
							ddddd.push(dddd);
						}
						
						var sssss = [];
						for(var i=0;i<students_7.length;i+=15){
							var ssss = [];
							for(var i2=i;i2<i+15;i2++){
								if(i2>=students_7.length)break;
								ssss.push(students_7[i2]);
							}
							sssss.push(ssss);
						}	
						
						var ttttt = [];
						for(var i=0;i<subjects.length;i+=5){
							var tttt = [];
							for(var i2=i;i2<subjects.length,i2<i+5;i2++){
								if(i2>=subjects.length)break;
								tttt.push(subjects[i2]);
							}
							ttttt.push(tttt);
						}								
						
						$('#log_simulate__exam_paper_multionline').append("<br/> AJAX operation: <span id='simulate__exam_paper_multionline___step'>0</span>/"+(ttttt.length*sssss.length*ddddd.length)+", this may take a long long time <br/><br/>");
						
						
						for(var i=0;i<ddddd.length;i++){
							for(var i2=0;i2<sssss.length;i2++){
								for(var i3=0;i3<ttttt.length;i3++){
									var theurl = "../php/install.php?class=install&function=simulate__exam_paper_multionline&dates="+$.ligerui.toJSON(ddddd[i])+"&students="+$.ligerui.toJSON(sssss[i2])+"&subjects="+$.ligerui.toJSON(ttttt[i3]);
									urls_7.push(theurl);
								}
							}
						}						
						simulate__exam_paper_multionline();
						
					}
					,error : function(response){				

					}
				});	
				return;
				
			}
			,error : function(response){				

			}
		});	
		return;
	}
	
	
	var url_ = urls_7[step_7];
	if(step_7==0){
		url_+="&delete=1";
	}
	$.ajax({
		url: url_
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$('#log_simulate__exam_paper_multionline').append(response.msg+"<br/>");
			if(response.status=="1"){
				$('#btn_simulate__exam_paper_multionline').attr("disabled",true);
				$('#log_simulate__exam_paper_multionline').attr("class","log_done");
				step_7++;
				$('#simulate__exam_paper_multionline___step').html(step_7);
				if(step_7>=urls_7.length){
					$('#step8').css("display","block");
					return;
				}
				simulate__exam_paper_multionline();
				
			}else{
				$('#btn_simulate__exam_paper_log').attr("disabled",false);
			}
		}
		,error : function(response){				
			alert("net error");
			$('#btn_simulate__exam_paper_log').attr("disabled",false);
		}
	});	
	
}

var urls_8 = [];
var step_8 = 0;
var exam_paper_multionline__close_ids = null;
var len_8 = 10;
var simulate__exam_paper_multionline__close = function(){
	if(exam_paper_multionline__close_ids==null){
		$.ajax({
			 url: "../php/install.php?class=install&function=exam_paper_multionline__close_ids"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				exam_paper_multionline__close_ids = response.data;
				for(var i=0;i<exam_paper_multionline__close_ids.length;i+=len_8){
					var ids = [];
					for(var i2=i;i2<i+len_8;i2++){
						if(i2>=exam_paper_multionline__close_ids.length)break;
						ids.push(exam_paper_multionline__close_ids[i2]);
					}
					
					urls_8.push("../php/install.php?class=install&function=exam_paper_multionline__close&ids="+$.ligerui.toJSON(ids));
				}
				
				$('#log_simulate__exam_paper_multionline_close').append("<br/> AJAX operation: <span id='simulate__exam_paper_multionline_close___step'>0</span>/"+(urls_8.length)+", this may take a long long time <br/><br/>");
				simulate__exam_paper_multionline__close();
			}
		});
		return;
	}
	
	var url_ = urls_8[step_8];
	$.ajax({
		url: url_
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$('#log_simulate__exam_paper_multionline_close').append(response.msg+"<br/>");
			if(response.status=="1"){
				$('#btn_simulate__exam_paper_multionline_close').attr("disabled",true);
				$('#log_simulate__exam_paper_multionline_close').attr("class","log_done");
				step_8++;
				$('#simulate__exam_paper_multionline_close___step').html(step_8);
				if(step_8>=urls_8.length)return;
				simulate__exam_paper_multionline__close();
				
			}else{
				$('#btn_simulate__exam_paper_multionline_close').attr("disabled",false);
			}
		}
		,error : function(response){				
			alert("net error");
			$('#btn_simulate__exam_paper_multionline_close').attr("disabled",false);
		}
	});	
	
}