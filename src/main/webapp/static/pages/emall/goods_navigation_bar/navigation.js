$(function(){
	var firstShow = $("#first");
	firstShow.parent().show();
	firstShow.children("a").addClass('active');
	
	
	var clickLink = $("li.level1>a");
	clickLink.click(function(){
		var _this = $(this), curUl= _this.next(); allUl = $('.level2');
		clickLink.removeClass('active');
		_this.addClass("active");
		if(curUl.is(":hidden")){
			allUl.hide(500);
			curUl.show(500);
		}else{
			allUl.hide(500);
		}
		return false;
	});
	
	var clickLinkTwo = $(".level2>li>a");
	clickLinkTwo.click(function(){
		_this = $(this);
		clickLinkTwo.removeClass('active');
		_this.addClass('active');
	});
	
	$(".extra>a").click(function(){		
		$hide=$(".hide");
		if($hide.is(":hidden")){
			$hide.show();
			$(this).html("收起");
		}else{
			$hide.hide();
			$(this).html("显示全部商品");
		}
	});
	
})