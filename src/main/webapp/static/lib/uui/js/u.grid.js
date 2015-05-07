;
(function($, window, document, undefined) {
	/*
	 * 对象所支持的属性及默认值
	 */
	var dataSource = function(options, gridComp) {
		this.defaults = {
			
		}
		this.gridComp = gridComp;
		this.options = $.extend({}, this.defaults, options);
		this.rows = new Array(); // 存储数据行
		this.hasParentRows = new Array(); // 存在父项
		this.nothasParentRows = new Array(); // 不存在父项
		this.sortRows();
		
	};
	var gridCompColumn = function(options, gridOptions) {
		this.defaults = {
				width:200, // 默认宽度为200
				sortable: true, // 是否可以排序
				canDrag: true, // 是否可以拖动
				fixed: false, // 是否固定列
				visible: true, // 是否显示
				sumCol:false, // 是否计算合计
				editable:false, // 是否可修改
				autoExpand:false, // 是否自动扩展列
				editType:'text', // 编辑类型，支持传入function扩展
				dataType:'string', // 数据类型
				format:'yyyy-MM-dd hh:mm:ss',
				//renderType:'', 渲染类型
		};
			// 从grid继承的属性
		var gridDefault = {
			sortable: gridOptions.sortable,
			canDrag: gridOptions.canDrag,
			editable: gridOptions.editable,
			width: gridOptions.columnWidth,
		};
		if(options.dataType == 'Date'){
			this.defaults.format = 'yyyy-MM-dd';
		}
		this.options = $.extend({}, this.defaults, gridDefault, options);
		
		this.firstColumn = false;
	};

	var gridComp = function(ele, options) {
		this.dataSource = dataSource;
		this.gridCompColumn = gridCompColumn;
		this.ele = ele[0];
		this.$ele = ele;

		this.defaults = {
			id: 'grid',
			width: '100%',
			height: '100%',
			columnWidth:200,
			sortable: true, // 是否可以排序
			canDrag: true, // 是否可以拖动
			showHeader: true, // 是否显示表头
			columnMenu: true, // 是否存在列头操作按钮
			showNumCol: false, // 是否显示数字列
			multiSelect:false, // 是否显示复选框
			showSumRow: false, // 是否显示合计行
			editable: false, // 是否可修改
			showTree:false, // 是否显示树表
			autoExpand:true, // 是否默认展开
			
			onBeforeRowSelected:function(i,row){return true},
			onRowSelected:function(i,row){return true},
			onBeforeRowUnSelected:function(i,row){return true},
			onRowUnSelected:function(i,row){return true},
			onBeforeAllRowSelected:function(rows){return true},
			onAllRowSelected:function(rows){return true},
			onBeforeAllRowUnSelected:function(rows){return true},
			onAllRowUnSelected:function(rows){return true},
			onBeforeRowEditConfirm:function(row,index){return true},
		}
		
		this.transDefault = {
			ml_show_column:'显示/隐藏列',
			ml_clear_set:'清除设置',
			ml_no_rows:'无数据',
		}
		
		this.transMap = $.extend({},this.transDefault,options.transMap);

		this.options = $.extend({}, this.defaults, options);

		this.gridCompColumnArr = new Array(); // 存储设置默认值之后的columns对象
		this.gridCompColumnFixedArr = new Array(); // 存储设置默认值之后的固定列columns对象
		this.basicGridCompColumnArr = new Array(); // 存储基本的columns对象，用于清除设置
		
		this.treeLeft = 10; // 树表时每一级之间的差值
		this.multiSelectWidth = 40; // 复选框列宽度
		this.numWidth = 40; // 数字列宽度
		this.multiWidth = 40; // 复选框宽度
		this.headerHeight = 34; // header区域高度
		this.countContentHeight = true;// 是否计算内容区的高度（是否为流式）
		this.minColumnWidth = 80; // 最小列宽
		this.columnMenuWidth = 160; // column menu的宽度
		this.scrollBarHeight = 16; // 滚动条高度
		
		this.initGrid();
	};

	/*
	 * 对象提供的方法
	 */
	gridComp.prototype = {
		/*
		 * 创建grid
		 */
		initGrid: function() {
			var oThis = this;
			this.initOptions();
			this.initVariable();
			this.initGridCompColumn();
			this.initDataSource();
			this.createDivs();
			setInterval(function(){oThis.setIntervalFun.call(oThis)}, 100);
		},
		
		/*
		 * 对传入参数进行格式化处理
		 * 宽度、高度处理
		 * 左侧区域宽度计算
		 * 除去内容区域的高度
		 */
		initOptions: function() {
			this.options.width = this.formatWidth(this.options.width);
			this.options.height = this.formatWidth(this.options.height);
			if(this.options.height == '100%'){
				this.countContentHeight = false;
			}
		},
		
		/*
		 * 初始化变量
		 */
		initVariable:function(){
			this.selectRows = new Array();
			this.selectRowsObj = new Array();
			this.allRows = new Array();
			// 鼠标点击移动时位置记录
			this.mouseUpX = 'mouseUpX';
			this.mouseUpY = 'mouseUpY';
			this.mouseDownX = 'mouseDownX';
			this.mouseDownY = 'mouseDownY';
			this.mouseMoveX = 'mouseMoveX';
			this.mouseMoveY = 'mouseMoveY';
			this.scrollLeft = 0; // 记录横向滚动条
			this.scrollTop = 0;// 记录纵向滚动条
			this.showType = ''; // 记录grid显示方式，form和grid
			this.createGridFlag = false; // 是否已经创建grid展示
			this.createFormFlag = false; // 是否已经创建form展示
			
			// 计算用变量
			this.fixedWidth = 0; // 固定区域宽度
			this.leftW = 0; // 左侧区域宽度（数字列复选框等）
			this.wholeWidth = 0; // 整体宽度
			this.halfWholeWidth = 0; // 整体宽度的一半
			this.wholeHeight = 0; // 整体高度
			this.rowHeight = 0; // 数据行高度
			this.contentWidth = 0; // 内容区宽度
			this.contentMinWidth = 0; // 内容区最小宽度
			this.exceptContentHeight = 0; // 内容区域之外的高度
			this.contentHeight = 0; //内容区高度
			this.columnClickX = 0;
			this.columnClickY = 0;
			this.$sd_storageData = null;// 本地缓存内容为object
			this.columnMenuMove = false;// 是否在column menu区域移动
			this.createColumnMenuFlage = false;
			this.eidtRowIndex = -1; // 当前修改行
			this.overWidth = false; // 数据列宽度之和是否大于整体宽度
			this.firstColumn = true; // 用于记录是否已经存在第一列，true表示还没有，false表示已经存在
			
			
			var url = window.location.href;
			var index = url.indexOf('?');
			if(index > 0){
				url = url.substring(0,index);
			}
			this.localStorageId = this.options.id + url;
			
			if (this.options.showNumCol) {
				this.leftW += this.numWidth;
			}
			if(this.options.multiSelect){
				this.leftW += this.multiWidth;
			}
			if(this.options.showHeader){
				this.exceptContentHeight +=this.headerHeight;
			}
		},
		/*
		 * 计算用变量清楚
		 */
		clearVariable:function(){
			
		},
		/*
		 * 创建gridCompColumn对象方便后续处理
		 */
		initGridCompColumn: function() {
			var oThis = this;
			if (this.options.columns) {
				$.each(this.options.columns, function(i) {
					var column = new gridCompColumn(this, oThis.options);
					oThis.gridCompColumnArr[i] = column;
					var column1 = new gridCompColumn(this, oThis.options);
					oThis.basicGridCompColumnArr[i] = column1;
				});
			}
			var localGridCompColumnArr = this.getGridCompColumnArrFromLocal();
			// 获取本地缓存中的数据
			if(localGridCompColumnArr != null){
				this.gridCompColumnArr = localGridCompColumnArr;
				$.each(this.gridCompColumnArr,function(){
					var field = this.options.field;
					for(var i =0;i < oThis.options.columns.length;i++){
						var c = oThis.options.columns[i];
						if(c.field == field){
							var options = $.extend({},c,this.options);
							this.options = options;
							break;
						}
					}
				});
			}
			
			this.initGridCompFixedColumn();
			this.columnsVisibleFun();
		},
		
		/*
		 * 将固定列放入gridCompColumnFixedArr
		 */
		initGridCompFixedColumn:function(){
			var oThis = this;
			var w = 0;
			$.each(this.gridCompColumnArr,function(i){
				if(this.options.fixed == true && this.options.visible){
					this.firstCoulmn = oThis.firstColumn;
					oThis.firstColumn = false;
					oThis.gridCompColumnFixedArr.push(this);
					w += parseInt(this.options.width);
				}
			});
			this.fixedWidth = w;
			$.each(this.gridCompColumnFixedArr,function(i){
				for(var i = oThis.gridCompColumnArr.length;i >-1;i-- ){
					if(oThis.gridCompColumnArr[i] == this){
						oThis.gridCompColumnArr.splice(i,1);
						break;
					}
				}
			});
		},

		/*
		 * 创建dataSource对象方便后续处理
		 */
		initDataSource: function() {
			var oThis = this;
			this.dataSourceObj = new dataSource(this.options.dataSource,this);
		},

		/*
		 * 创建div区域
		 */
		createDivs: function() {
			var oThis = this;
			// 创建顶层div
			var htmlStr = '<div id="' + this.options.id + '" data-role="grid" class="ufida-grid" style="width:' + this.options.width + ';height:' + this.options.height + '">';
			htmlStr += '</div>';
			this.ele.insertAdjacentHTML('afterBegin', htmlStr);
			// 创建屏幕div,用于拖动等操作
			var htmlStr = '<div id="' + this.options.id + '_top" class="ufida-grid-top"></div>';
//			window.top.document.body.insertAdjacentHTML('afterBegin', htmlStr);
			this.ele.insertAdjacentHTML('afterBegin', htmlStr);
			
			this.initEventFun(); //创建完成之后顶层div添加监听
			this.widthChangeFunc(); // 根据整体宽度创建grid或form展示区域
		},
		
		/*
		 * 创建div区域
		 */
		repaintDivs:function(){
			// 后期可以考虑form展示
			this.repaintGridDivs();
		},
		/*
		 * 创建grid形式下div区域
		 */
		createGridDivs: function() {
			if (this.createGridFlag) {
				return;
			}
			var htmlStr = '<div id="' + this.options.id + '_grid" class="ufida-grid-grid">';
			if(this.options.showHeader){
				htmlStr += this.createColumnMenu();
				htmlStr += this.createHeader();
			}
			htmlStr += this.createContent();
			if(this.options.editable){
				htmlStr += this.createContentEditMenu();
			}
			htmlStr += '</div>';
			$('#' + this.options.id)[0].insertAdjacentHTML('afterBegin', htmlStr);
			
			this.headerFirstClassFun();
			this.initGridEventFun();
			this.afterGridDivsCreate();
			this.createGridFlag = true;
		},
		/*
		 * 重画grid
		 */
		repaintGridDivs: function() {
			$('#' + this.options.id + '_grid').remove();
			this.createGridFlag = false;
			this.createGridDivs();
			this.countWidth();
			$('#' + this.options.id + '_content')[0].scrollLeft = this.scrollLeft;
		},
		
		/*
		 * 创建columnMenu区域
		 */
		createColumnMenu: function() {
			var htmlStr = '<div class="ufida-grid-column-menu" id="' + this.options.id + '_column_menu">';
			htmlStr += '<ul data-role="menu" role="menubar" class="ufida-grid-column-menu-ul" id="' + this.options.id + '_column_menu_ul">';

			// 创建显示/隐藏列
			htmlStr += '<li class="ufida-grid-column-menu-li" role="menuitem">';
			htmlStr += '<div class="ufida-grid-column-menu-div1" id="' + this.options.id + '_showColumn">';
//			htmlStr += '<div class="ufida-grid-column-menu-div2 fa fa-columns"></div>'; 
			htmlStr += '<span class="ufida-grid-column-menu-span">' + this.transMap.ml_show_column + '</span>';
			htmlStr += '<div class="ufida-grid-column-menu-div3 fa fa-caret-right"></div>';
			htmlStr += '</div></li>';
			
			// 创建清除设置
			htmlStr += '<li class="ufida-grid-column-menu-li" role="menuitem">';
			htmlStr += '<div class="ufida-grid-column-menu-div1" id="' + this.options.id + '_clearSet">';
			//htmlStr += '<div class="ufida-grid-column-menu-div2 fa fa-columns"></div>';
			htmlStr += '<span class="ufida-grid-column-menu-span">' + this.transMap.ml_clear_set + '</span>';
			htmlStr += '</div></li>';
			
			htmlStr += '</ul></div>';
			
			// 创建数据列区域
			htmlStr += '<div class="ufida-grid-column-menu" id="' + this.options.id + '_column_menu_columns">';
			htmlStr += '<ul data-role="menu" role="menubar" class="ufida-grid-column-menu-columns-ul" id="' + this.options.id + '_column_menu_columns_ul">';
			$.each(this.gridCompColumnArr, function(i) {
				htmlStr += '<li class="ufida-grid-column-menu-columns-li" role="menuitem" index="' + i + '">';
				htmlStr += '<div class="ufida-grid-column-menu-columns-div1">';
				var checkedStr = "";
				if(this.options.visible)
					checkedStr = 'checked';
				htmlStr += '<div class="ufida-grid-column-menu-columns-div2"><input type="checkbox" ' + checkedStr + '></div>';
				htmlStr += '<span class="ufida-grid-column-menu-columns-span">' + this.options.title + '</span>';
				htmlStr += '</div></li>';
			});
			htmlStr += '</ul></div>';
			return htmlStr;
		},

		/*
		 * 创建header区域
		 */
		createHeader: function() {
			var htmlStr = '<div class="ufida-grid-header" id="' + this.options.id + '_header"><div class="ufida-grid-header-wrap" id="' + this.options.id + '_header_wrap" data-role="resizable">';
			if (this.options.multiSelect || this.options.showNumCol) {
				htmlStr += '<div id="' + this.options.id + '_header_left" class="ufida-grid-header-left" style="width:' + this.leftW + 'px;">';
				if (this.options.multiSelect) {
					htmlStr += '<div class="ufida-grid-header-multi-select" style="width:' + this.multiWidth + 'px;"><input type="checkbox" id="' + this.options.id + '_header_multi_input"></div>'
				}
				if (this.options.showNumCol) {
					htmlStr += '<div class="ufida-grid-header-num" style="width:' + this.numWidth + 'px;"></div>';
				}
				htmlStr += '</div>';
			}
			htmlStr += this.createHeaderTable('fixed');
			htmlStr += this.createHeaderTable();
			htmlStr += '</div>';
			htmlStr += '<div class="ufida-grid-header-resize-handle" id="' + this.options.id + '_resize_handle"><div class="ufida-grid-header-resize-handle-inner"></div></div>';
			htmlStr += '</div>';
			return htmlStr;
		},
		/*
		 * 创建header区域table
		 */
		createHeaderTable:function(createFlag){
			var leftW,positionStr,idStr;
			if(createFlag == 'fixed'){
				leftW = parseInt(this.leftW);
				positionStr = 'absolute;width:'+this.fixedWidth+'px;z-index:11;background:#F9F9F9;';
				idStr = 'fixed_';
			}else{
				leftW = parseInt(this.leftW) + parseInt(this.fixedWidth);	
				positionStr = 'relative;';
				idStr = '';
				if(this.contentMinWidth > 0){
					positionStr += 'min-width:'+this.contentMinWidth+'px;';
				}
			}
			
			var htmlStr = '<table role="grid" id="' + this.options.id + '_header_'+idStr+'table" style="position:'+ positionStr+';left:' + leftW + 'px">';
			htmlStr += this.createColgroup(createFlag);
			htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_header_'+idStr+'thead">';
			htmlStr += this.createThead(createFlag);
			htmlStr += '</thead></table>';
			return htmlStr;
		},
		/*
		 * 创建colgroup
		 */
		createColgroup: function(createFlag) {
			var oThis = this,
				htmlStr = '<colgroup>',gridCompColumnArr;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function() {
				htmlStr += '<col';
				if (this.options.width && !this.options.autoExpand) {
					htmlStr += ' style="width:' + oThis.formatWidth(this.options.width) + '"';
				}else if(this.options.autoExpand){
					htmlStr += ' style="min-width:' + oThis.formatWidth(oThis.minColumnWidth) + '"';
				}
				htmlStr += '>';
			});
			htmlStr += '</colgroup>';
			return htmlStr;
		},
		
		/*
		 * 创建thead区域
		 */
		createThead: function(createFlag) {
			var oThis = this;
			var htmlStr = '<tr role="row">';
			var visibleIndex = 0;
			var gridCompColumnArr;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function(i) {
				var vi = visibleIndex;
				if(this.options.visible == false){
					vi = -1;
				}else{
					visibleIndex++;
				}
				htmlStr += '<th role="columnheader" data-filed="' + this.options.field + '" rowspan="1" class="ufida-grid-header-th" field="' + this.options.field + '" index="' + i + '" visibleIndex="' + vi + '">';
				htmlStr += '<div class="ufida-grid-header-link" field="' + this.options.field + '" title="' + this.options.title + '">' + this.options.title + '</div>';
				if(oThis.options.columnMenu && createFlag != 'fixed'){
					htmlStr += '<div class="ufida-grid-header-columnmenu fa fa-bars " field="' + this.options.field + '"></div>';
				}
				htmlStr += '</th>';
			});
			htmlStr += '</tr>';

			return htmlStr;
		},
		/*
		 * 创建内容区域
		 */
		createContent: function() {
			var h = '';
			if(this.countContentHeight){
				var wh = $('#' + this.options.id)[0].offsetHeight;
				this.wholeHeight = wh;
				if (wh > 0) {
					this.contentHeight = parseInt(wh) - this.exceptContentHeight > 0?parseInt(wh) - this.exceptContentHeight:0;
					h = 'style="max-height:' + this.contentHeight + 'px;"';
				}
			}
			var htmlStr = '<div id="' + this.options.id + '_content" class="ufida-grid-content" ' + h + '>';
			if (this.options.showNumCol || this.options.multiSelect) {
				htmlStr += this.createContentLeft();
				if(this.options.showSumRow){
					htmlStr += '<div class="ufida-grid-content-left-sum-bottom" id="' + this.options.id + '_content_left_sum_bottom" style="width:' + (this.leftW + this.fixedWidth) + 'px">';
					htmlStr += '</div>';
				}
				htmlStr += '<div class="ufida-grid-content-left-bottom" id="' + this.options.id + '_content_left_bottom" style="width:' + (this.leftW + this.fixedWidth) + 'px">';
				htmlStr += '</div>';
			}
			htmlStr += this.createContentTable('fixed');
			htmlStr += this.createContentTable();
			htmlStr += '</div>';
			return htmlStr;
		},
		
		/*
		 * 创建无数据区域
		 */
		createNoRowsDiv:function(){
			var styleStr = '';
			if(this.contentMinWidth > 0){
				styleStr += 'stype="width:' + this.contentMinWidth + 'px;"';
			}
			
			var htmlStr = '<div class="ufida-grid-noRowsDiv"' + styleStr + ' id="' + this.options.id + '_noRows"></div>';
			htmlStr += '<div class="ufida-grid-noRowsShowDiv" id="' + this.options.id + '_noRowsShow">' + this.transDefault.ml_no_rows + '</div>';
			
			return htmlStr; 
		},
		/*
		 * 创建内容区table
		 */
		createContentTable:function(createFlag){
			var leftW,idStr,styleStr,hStr,cssStr,tableStyleStr;
			if(this.countContentHeight){
				hStr = 'max-height:' + this.contentHeight + 'px;';
			}else{
				hStr = "";
			}
			if(createFlag == 'fixed'){
				leftW = parseInt(this.leftW);
				idStr = 'fixed_';
				cssStr = 'fixed-';
				styleStr = 'style="position:absolute;width:'+this.fixedWidth+'px;left:' + leftW + 'px;' +hStr+'"';
				tableStyleStr = 'style="width:'+this.fixedWidth+'px;"';
			}else{
				leftW = parseInt(this.leftW) + parseInt(this.fixedWidth);	
				idStr = '';
				cssStr = '';
				styleStr = 'style="position:relative;left:' + leftW + 'px;' +hStr;
				if(this.contentMinWidth > 0){
					styleStr += 'width:' + this.contentMinWidth + 'px;"';
				}
				styleStr += '"';
				tableStyleStr = '';
				if(this.contentMinWidth > 0){
					tableStyleStr = 'style="min-width:' + this.contentMinWidth + 'px;"';
				}
			}
			var  htmlStr = '<div id="' + this.options.id + '_content_'+idStr+'div" class="ufida-grid-content-'+cssStr+'div" '+styleStr+'>';
			htmlStr += '<table role="grid" id="' + this.options.id + '_content_'+idStr+'table" ' + tableStyleStr+'>';
			htmlStr += this.createColgroup(createFlag);
			htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_content_'+idStr+'thead" style="display:none">';
			htmlStr += this.createThead(createFlag);
			htmlStr += '</thead>';
			htmlStr += this.createContentRows(createFlag);
			htmlStr += '</table>';
			if(createFlag != 'fixed'){
				htmlStr += this.createNoRowsDiv();
			}
			htmlStr += '</div>';
			return htmlStr;
		},
		/*
		 * 创建内容区左侧区域
		 */
		createContentLeft: function() {
			var oThis = this,
				htmlStr = "",
				left = 0;
			if(this.options.multiSelect){
				htmlStr += '<div class="ufida-grid-content-left" id="' + this.options.id + '_content_multiSelect" style="width:' + this.multiSelectWidth + 'px;">';
				// 遍历生成所有行
				if (this.dataSourceObj.rows) {
					$.each(this.dataSourceObj.rows, function(i) {
						htmlStr += oThis.createContentLeftMultiSelectRow(this);
					});
				}
				htmlStr += '</div>';
				left += this.multiSelectWidth;
			}
			if (this.options.showNumCol) {
				htmlStr += '<div class="ufida-grid-content-left" id="' + this.options.id + '_content_numCol" style="width:' + this.numWidth + 'px;left:' + left + 'px;">';
				// 遍历生成所有行
				if (this.dataSourceObj.rows) {
					$.each(this.dataSourceObj.rows, function(i) {
						htmlStr += oThis.createContentLeftNumColRow(i);
					});
				}
				htmlStr += '</div>';
			}
			
			return htmlStr;
		},
		
		/*
		 * 创建内容区左侧区域复选区（一行）
		 */
		createContentLeftMultiSelectRow:function(row){
			var displayStr = '';
			if(!this.options.autoExpand && row.level > 0){
				displayStr = 'display:none;'
			}
			var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="ufida-grid-content-multiSelect"><input type="checkbox"></div>';
			return htmlStr;
		},
		/*
		 * 创建内容区左侧区域数字列（一行）
		 */
		createContentLeftNumColRow:function(index){
			var htmlStr = '<div style="width:' + this.numWidth + 'px;" class="ufida-grid-content-num">' + (index+1) + '</div>';
			return htmlStr;
		},
		/*
		 * 创建内容区域所有行
		 */
		createContentRows: function(createFlag) {
			var oThis = this,
				htmlStr = "",idStr;
			if(createFlag == 'fixed'){
				idStr = 'fixed_';
			}else{
				idStr = '';
			}
			// 遍历生成所有行
			if (this.dataSourceObj.rows) {
				htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_content_'+idStr+'tbody">';
				$.each(this.dataSourceObj.rows, function(i) {
					htmlStr += oThis.createContentOneRow(this,createFlag);
				});
				if(oThis.options.showSumRow && this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
					htmlStr += oThis.createSumRow(createFlag);
				}
				htmlStr += '</tbody>';
			}
			return htmlStr;
		},
		
		/*
		 * 创建内容区域数据行
		 */
		createContentOneRow: function(row,createFlag) {
			var styleStr = '';
			if(!this.options.autoExpand && row.level > 0){
				styleStr = 'style="display:none"';
			}
			var htmlStr = '<tr role="row" ' + styleStr + '>';
			htmlStr += this.createContentOneRowTd(row,createFlag);
			htmlStr += '</tr>';
			return htmlStr;
		},
		
		/*
		 * 数据更新重画当前行
		 */
		repaintRow:function(tr,row,createFlag){
			var $tr = $(tr);
			var index = $('tr',$tr.parent()).index($tr);
			tr.innerHTML = this.createContentOneRowTd(row,createFlag);
			
			this.renderTypeFun(index);
		},
		/*
		 * 创建行td对应的html
		 */
		createContentOneRowTd:function(row,createFlag){
			var oThis = this;
			var htmlStr = '',gridCompColumnArr;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			var value = row.value;
			$.each(gridCompColumnArr, function() {
				var f = this.options.field,
					v = $(value).attr(f);
					v = oThis.getString(v,'');
				var renderType = this.options.renderType;
				var treeStyle = '';
				var spanStr ='';
				var vStr= '';
				
				if(oThis.options.showTree && this.firstColumn){
					var l = parseInt(oThis.treeLeft)*parseInt(row.level);
					treeStyle = 'style="position:relative;';
					if(row.hasChild){
						if(oThis.options.autoExpand){
							spanStr = '<span class=" fa fa-minus-square-o ufida-grid-content-tree-span"></span>';
						}else{
							spanStr = '<span class=" fa fa-plus-square-o ufida-grid-content-tree-span"></span>';
						}
					}else{
						l += 18;
					}
					treeStyle += 'left:'+ l +'px;"';
				}
				htmlStr += '<td role="rowcell" title="' + v + '"><div class="ufida-grid-content-td-div" ' + treeStyle+'>' + spanStr + '<span>' + v + '</span></div></td>';
				
			});
			
			return htmlStr;
		},
		/*
		 * 创建合计行
		 */
		createSumRow:function(createFlag){
			var oThis = this,idStr,gridCompColumnArr;
			if(createFlag == 'fixed'){
				idStr = 'fixed_';
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				idStr = '';
				gridCompColumnArr = this.gridCompColumnArr;
			}
			var t = parseInt(this.wholeHeight) - this.exceptContentHeight - 48 - this.scrollBarHeight;
			t = t> 0?t:0;
			var htmlStr = '<tr role="row" class="ufida-grid-content-sum-row" id="' + this.options.id + '_content_'+idStr+'sum_row" style="top:'+t+'px;">';
			$.each(gridCompColumnArr, function() {
				var f = this.options.field;
				var sumValue = oThis.dataSourceObj.getSumValue(f,this,oThis);
				htmlStr += '<td role="rowcell" title="' + sumValue + '"><div class="ufida-grid-content-td-div"><span>' + sumValue + '</span></div></td>';
			});
			htmlStr += '</tr>';
			return htmlStr;
		},
		/*
		 * 重画合计行
		 */
		repairSumRow:function(){
			$('#' + this.options.id + '_content_div tbody .ufida-grid-content-sum-row').remove();
			if(this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
				var htmlStr = this.createSumRow();
				$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
			}
			$('#' + this.options.id + '_content_fixed_div tbody .ufida-grid-content-sum-row').remove();
			if(this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
				var htmlStr = this.createSumRow('fixed');
				$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
			}
		},
		/*
		 * 重画数据区域
		 */
		rePairContentRows: function() {
			var $pDiv = $('#' + this.options.id + '_content_tbody').parent();
			$('#' + this.options.id + '_content_tbody').remove();
			var htmlStr = this.createContentRows();
			if($pDiv[0]){
				$pDiv[0].insertAdjacentHTML('afterBegin', htmlStr);
			}
		},
		
		/*
		 * 创建内容区编辑按钮
		 */
		createContentEditMenu:function(){
			var htmlStr = '<div class="ufida-grid-content-edit-menu" id="' + this.options.id + '_content_edit_menu">';
			htmlStr += '<button type="button" class="ufida-grid-content-edit-menu-button fa fa-check" id="' + this.options.id + '_content_edit_menu_ok">Ok</button>';
			htmlStr += '<button type="button" class="ufida-grid-content-edit-menu-button fa fa-times" id="' + this.options.id + '_content_edit_menu_cancel">Cancel</button>';
			htmlStr += '</div>';
			return htmlStr;
		},

		/*
		 * 创建form形式下div
		 */
		createFromDivs: function() {
			if (this.createFormFlag) {
				return;
			}
			var htmlStr = '<div id="' + this.options.id + '_form" class="ufida-grid-form">';
			htmlStr += this.createFromContent();
			$('#' + this.options.id)[0].insertAdjacentHTML('afterBegin', htmlStr);
			this.createFormFlag = true;
		},

		/*
		 * 创建form形式下内容区域
		 */
		createFromContent: function() {
			var htmlStr = '<div class="ufida-grid-form-content" id="' + this.options.id + '_form_content" class="ufida-grid-content">';
			htmlStr += '<table role="grid" id="' + this.options.id + '_form_content_table">';
			htmlStr += this.createFormContentRows();
			htmlStr += '</table>';
			return htmlStr;
		},

		/*
		 * 创建form形式下内容区域所有行
		 */
		createFormContentRows: function() {
			var oThis = this,
				htmlStr = "";
			// 遍历生成所有行
			if (this.dataSourceObj.rows) {
				htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_form_content_tbody">';
				$.each(this.dataSourceObj.rows, function() {
					htmlStr += '<tr role="row"><td role="rowcell">';
					var value = this.value;
					$.each(oThis.gridCompColumnArr, function() {
						var f = this.options.field,
							t = this.options.title,
							v = $(value).attr(f);
						htmlStr += '<div>' + t + ':</div>';
						htmlStr += '<div>' + v + '</div>';
					});
					htmlStr += '</td></tr>';
				});
				htmlStr += '</tbody>';
			}
			return htmlStr;
		},
		
		/*
		 * 创建完成之后顶层div添加监听
		 */
		initEventFun: function() {
			var oThis = this;
			$('#' + this.options.id).on('mousedown', function(e) {
				if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
					// 点击的是header区域
					oThis.mouseDownX = e.clientX;
					oThis.mouseDownY = e.clientY;
					var eleTh = $(e.target).closest('th')[0];
					oThis.swapColumnStart(e, eleTh);
					e.preventDefault();
				} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
					// 点击的是数据区域
				}
			});
			$('#' + this.options.id).on('mousemove', function(e) {
				if (!oThis.countWidthFlag) {
					oThis.countWidth(e); //某些情况下不是创建完就显示的，所以在mousemove中处理
					oThis.countWidthFlag = true;
				}
				if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
					// 在header区域移动
					var eleTh = $(e.target).closest('th')[0];
					oThis.headerThDrag(e, eleTh);
				}
				oThis.mouseMoveX = e.clientX;
				oThis.mouseMoveY = e.clientY;
				if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX') {
					// 鼠标按下之后移动了
					oThis.swapColumnFlag = true;
				}
				oThis.dragFun(e);
				oThis.swapColumnFun(e);
				e.stopPropagation();
			});
			$('#' + this.options.id + '_top').on('mousemove', function(e) {
				oThis.mouseMoveX = e.clientX;
				oThis.mouseMoveY = e.clientY;
				if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX') {
					// 鼠标按下之后移动了
					oThis.swapColumnFlag = true;
				}
				oThis.dragFun(e);
				oThis.swapColumnFun(e);
				e.stopPropagation();
			});
			$('#' + this.options.id).on('mouseup', function(e) {
				if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
					// 点击的是header区域
					oThis.mouseUpX = e.clientX;
					oThis.mouseUpY = e.clientY;
					//点击过程中鼠标没有移动 
					if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
					//或者移动距离小于5px(由于移动之后会显示屏幕div，暂时不做处理)
//					if( Math.abs(parseInt(oThis.mouseDownX) - parseInt(oThis.mouseUpX)) <=5 && Math.abs(parseInt(oThis.mouseDownY) - parseInt(oThis.mouseUpY)) <=5){
						oThis.columnClickX = e.clientX;
						oThis.columnClickY = e.clientY;
						var eleTh = $(e.target).closest('th')[0];
						if($(e.target).hasClass('ufida-grid-header-columnmenu')){
							//点击的是columnmenu
							//待完善 考虑屏幕高度决定columnMenu显示形式
							$('#' + oThis.options.id + '_column_menu').css('display','block');
							$('#' + oThis.options.id + '_column_menu').css('left',eleTh.attrRightTotalWidth - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth -oThis.columnMenuWidth + 1);
							$('#' + oThis.options.id + '_column_menu').css('top',oThis.headerHeight);
							oThis.ele.createColumnMenuFlage = true;
						}else{
							// 执行click操作,进行排序
							oThis.canSortable(e, eleTh);
						}
					}
				} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
					// 点击的是数据区域

				}
				oThis.dragEnd(e);
				oThis.swapColumnEnd(e);
				oThis.mouseUpX = 'mouseUpX';
				oThis.mouseUpY = 'mouseUpY';
				oThis.mouseDownX = 'mouseDownX';
				oThis.mouseDownY = 'mouseDownY';
				oThis.mouseMoveX = 'mouseMoveX';
				oThis.mouseMoveY = 'mouseMoveY';
			});
			$('#' + this.options.id+ '_top').on('mouseup', function(e) {
				oThis.dragEnd(e);
				oThis.swapColumnEnd(e);
				oThis.mouseUpX = 'mouseUpX';
				oThis.mouseUpY = 'mouseUpY';
				oThis.mouseDownX = 'mouseDownX';
				oThis.mouseDownY = 'mouseDownY';
				oThis.mouseMoveX = 'mouseMoveX';
				oThis.mouseMoveY = 'mouseMoveY';
			});
			$(document).on('click',function(){
				if(oThis.columnMenuMove == false && oThis.ele.createColumnMenuFlage == false){
					$('#' + oThis.options.id + '_column_menu',oThis.$ele).css('display','none');
				}
				oThis.ele.createColumnMenuFlage = false;
			});
		},

		/*
		 * 创建完成之后grid层 div添加监听
		 */
		initGridEventFun: function() {
			var oThis = this;
			// 拖动
			$('#' + this.options.id + '_resize_handle').on('mousedown', function(e) {
				oThis.dragStart(e);
				return false;
			});
			// 同步滚动条
			$('#' + this.options.id + '_content_div').on('scroll', function(e) {
				oThis.scrollLeft = this.scrollLeft;
				oThis.scrollTop = this.scrollTop;
				$('#' + oThis.options.id + '_header_table').css('left', oThis.leftW - oThis.scrollLeft + oThis.fixedWidth + "px");
				$('#' + oThis.options.id + '_noRowsShow').css('left', oThis.scrollLeft + "px");
				$('#' + oThis.options.id + '_content_multiSelect').css('top', -oThis.scrollTop + "px");
				$('#' + oThis.options.id + '_content_numCol').css('top', -oThis.scrollTop + "px");
				$('#' + oThis.options.id + '_content_fixed_div').css('top', -oThis.scrollTop + "px");
			});
			// 全选
			$('#' + this.options.id + '_header_multi_input').on('click', function(e) {
				if(this.checked){
					oThis.setAllRowSelect();
				}else{
					oThis.setAllRowUnSelect();
				}
			});
			
			// 选中行
			$('#' + oThis.options.id + '_content .ufida-grid-content-left input').on('click',function(e){
				var $div = $($(this).parent());
				var index = $('div',$div.parent()).index($div);
				if(this.checked){
					oThis.setRowSelect(index);
				}else{
					oThis.setRowUnselect(index);
				}
			});
			
			// column按钮
			$('#' + this.options.id + '_column_menu_ul').on('mousemove', function(e) {
				oThis.columnMenuMove = true;
			});
			$('#' + this.options.id + '_column_menu_ul').on('mouseout', function(e) {
				oThis.columnMenuMove = false;
			});
			
			// 显示/隐藏列按钮
			$('#' + this.options.id + '_showColumn').on('mousemove', function(e) {
				if(oThis.hideMenuColumns)
					clearTimeout(oThis.hideMenuColumns);
				
				var sX = window.top.document.body.clientWidth;
				$('#' + oThis.options.id + '_column_menu_columns').css('display','block');
				var menuLeft = $('#' + oThis.options.id + '_column_menu').css('left');
				var columnsLeft = parseInt(menuLeft) + oThis.columnMenuWidth;
				var maxLeft = oThis.columnClickX + oThis.columnMenuWidth;
				if(maxLeft > sX)
					columnsLeft = parseInt(menuLeft) - oThis.columnMenuWidth;
				$('#' + oThis.options.id + '_column_menu_columns').css('left',columnsLeft);
				$('#' + oThis.options.id + '_column_menu_columns').css('top',oThis.headerHeight);
				oThis.columnMenuMove = true;
			});
			$('#' + this.options.id + '_showColumn').on('mouseout', function(e) {
				oThis.hideMenuColumns = setTimeout(function(){
					$('#' + oThis.options.id + '_column_menu_columns').css('display','none');	
					oThis.columnMenuMove = false;
				},200);
				
			});
			$('#' + this.options.id + '_column_menu_columns').on('mousemove', function(e) {
				if(oThis.hideMenuColumns)
					clearTimeout(oThis.hideMenuColumns);
				$('#' + oThis.options.id + '_column_menu_columns').css('display','block');
				oThis.columnMenuMove = true;
			});
			$('#' + this.options.id + '_column_menu_columns').on('mouseout', function(e) {
				oThis.hideMenuColumns = setTimeout(function(){
					$('#' + oThis.options.id + '_column_menu_columns').css('display','none');	
					oThis.columnMenuMove = false;
				},200);
			});
			
			// 清除设置按钮
			$('#' + this.options.id + '_clearSet').on('click', function(e) {
				oThis.clearLocalData();
				oThis.gridCompColumnArr = oThis.cloneObj(oThis.basicGridCompColumnArr);
				oThis.repaintGridDivs();
			});
			// 显示/隐藏列 对应所有列的点击处理
			$('#' + this.options.id + '_column_menu_columns_ul li input').on('click', function(e) {
				//待完善 优化与li的click的代码整合
				var index = $(this).closest('li').attr('index');
				
				if(oThis.gridCompColumnArr[index].options.visible){
					$(this)[0].checked = false;
					var ll = $('input:checked',$('#' + oThis.options.id + '_column_menu_columns_ul')).length;
					if(ll == 0){
						$(this)[0].checked = true;
						return;
					}
					oThis.setColumnVisibleByIndex(index,false);
					oThis.gridCompColumnArr[index].options.visible = false;
				}else{
					$(this)[0].checked = true;
					oThis.setColumnVisibleByIndex(index,true);
					oThis.gridCompColumnArr[index].options.visible = true;
				}
				oThis.saveGridCompColumnArrToLocal();
				e.stopPropagation();
			});
			$('#' + this.options.id + '_column_menu_columns_ul li').on('click', function(e) {
				var index = $(this).attr('index');
				//获取选中列数量，不能小于1
				if(oThis.gridCompColumnArr[index].options.visible){
					$('input',$(this))[0].checked = false;
					var ll = $('input:checked',$('#' + oThis.options.id + '_column_menu_columns_ul')).length;
					if(ll == 0){
						$('input',$(this))[0].checked = true;
						return;
					}
					oThis.setColumnVisibleByIndex(index,false);
					oThis.gridCompColumnArr[index].options.visible = false;
				}else{
					$('input',$(this))[0].checked = true;
					oThis.setColumnVisibleByIndex(index,true);
					oThis.gridCompColumnArr[index].options.visible = true;
				}
				oThis.saveGridCompColumnArrToLocal();
			});
			
			// 数据行相关事件
			$('#' + this.options.id + '_content_tbody tr').on('click',function(e){
				var $this = $(this);
				var index = $('tr',$this.parent()).index($this);
				var row = oThis.dataSourceObj.rows[index];
				var rowChildIndex = row.childRowIndex;
				if(oThis.options.editable && oThis.eidtRowIndex != index){
					if(oThis.eidtRowIndex != -1){
						oThis.editOk();
					}
					oThis.editRow(this);
				}
				if(oThis.dataSourceObj.rows[index].checked)
					oThis.setRowUnselect(index);
				else
					oThis.setRowSelect(index);
			});
			
			$('#' + this.options.id + '_content_tbody tr td').on('click',function(e){
				var $this = $(this);
				var $tr = $this.parent();
				var index = $('tr',$tr.parent()).index($tr);
				var row = oThis.dataSourceObj.rows[index];
				var rowChildIndex = row.childRowIndex;
				
				var minus = $this.find('.fa-minus-square-o');
				var plus = $this.find('.fa-plus-square-o');
				if(minus.length >0){
					// 合上 需要将所有的都合上
					minus.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
					if(rowChildIndex.length > 0){
						var allChildRowIndex = oThis.getAllChildRowIndex(row);
						$.each(allChildRowIndex, function() {    
							var $tr1 = $('tr:eq(' + parseInt(this) +')',$tr.parent());
							$tr1.css('display','none');	  
							// 左侧复选区隐藏
							$('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')').css('display','none');
							$('.fa-minus-square-o',$tr1).removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
						});
					}
				}else if(plus.length > 0){
					// 展开
					plus.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
					if(rowChildIndex.length > 0){
						$.each(rowChildIndex, function() {    
							var $tr1 = $('tr:eq(' + parseInt(this) +')',$tr.parent());
						    $tr1.css('display','');	
						    var ss = $('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')')[0]; 
							$('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')').css('display','');
						});
					}
				}
			});
			
			// 行编辑按钮相关事件
			$('#' + this.options.id + '_content_edit_menu_ok').on('click',function(e){
				oThis.editOk();
			});
			$('#' + this.options.id + '_content_edit_menu_cancel').on('click',function(e){
				oThis.editCancel();
			});
		},

		/*
		 * 定时器处理
		 */
		setIntervalFun: function(e) {
			this.widthChangeFunc();
			this.changeHeightFun();
		},
		
		
		
		
		/*
		 * grid区域创建完成之后处理
		 * 1、数据列显示处理
		 * 2、取行高
		 */
		afterGridDivsCreate:function(){
			this.columnsVisibleFun();
			this.countRowHeight();
			this.renderTypeFun();
			this.noRowsShowFun();
		},
		/*
		 * 处理是否显示无数据行
		 */
		noRowsShowFun:function(){
			if(this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
				$('#' + this.options.id + '_noRowsShow').css('display','none');
				$('#' + this.options.id + '_noRows').css('display','none');
			}else{
				$('#' + this.options.id + '_noRowsShow').css('display','block');
				$('#' + this.options.id + '_noRows').css('display','block');
			}
		},
		/*
		 * 处理renderType
		 * begin为起始行，length为行数（增加行数时使用）
		 */
		renderTypeFun:function(begin,length){
			var oThis = this,begin = parseInt(begin),length = parseInt(length);
			var end = begin;
			if(length >0){
				end = parseInt(begin + length - 1);
			}
			
			$.each(this.gridCompColumnArr,function(i){
				oThis.renderTypeByColumn(this,i,begin,length);
			})
		},
		/*
		 * 处理renderType
		 * gridCompColumn对象，index为第几列
		 * begin为起始行，length为行数（增加行数时使用）
		 */
		renderTypeByColumn:function(gridCompColumn,i,begin,length){
			var oThis = this;
			var renderType = gridCompColumn.options.renderType;
			var dataType = gridCompColumn.options.dataType;
			var format = gridCompColumn.options.format;
			var field = gridCompColumn.options.field;
			var end = begin;
			if(length >0){
				end = parseInt(begin + length - 1);
			}
			if(typeof renderType == 'function' || dataType == 'Date' || dataType == 'DateTime'){
				$.each(oThis.dataSourceObj.rows, function(j) {    
					if((begin >= 0 && j >= begin && j <= end) || isNaN(begin)){
						var td = $('#' + oThis.options.id + '_content_tbody tr:eq(' + j + ') td:eq(' +i+ ')')[0];
						var span = $('#' + oThis.options.id + '_content_tbody tr:eq(' + j + ') td:eq(' +i+ ') span:last-child')[0];
						var v = $(this.value).attr(field);
						v = oThis.getString(v,'');
						if(typeof renderType == 'function'){
							renderType.call(oThis,v,span,this,gridCompColumn);
						}else if(dataType == 'Date'){
							var dateObj = new Date(v);
							if(parseInt(dateObj.valueOf()) > 0){
								v = dateObj.format(format);
							}
							span.innerHTML = v;
							td.title = v;
						}else if(dataType == 'DateTime'){
							var dateObj = new Date(v);
							if(parseInt(dateObj.valueOf()) > 0){
								v = dateObj.format(format);
							}
							span.innerHTML = v;
							td.title = v;
						}
					}
				});
			}
		},
		/*
		 * 取行高
		 */
		countRowHeight:function(){
			if($('#' + this.options.id + '_content_tbody tr')[0]){
				this.rowHeight = $('#' + this.options.id + '_content_tbody tr')[0].offsetHeight;
			}
		},
		
		/*
		 * column是否显示处理
		 */
		columnsVisibleFun:function(){
			var oThis = this;
			var w = 0;
			if(this.gridCompColumnFixedArr.length > 0){
				
			}else{
				this.firstColumn = true;
			}
			$.each(this.gridCompColumnArr,function(){
				if(this.options.visible == false){
					oThis.setColumnVisibleByColumn(this,false);
					this.firstColumn = false;
				}else{
					w+=parseInt(this.options.width);
					this.firstColumn = oThis.firstColumn;
					oThis.firstColumn = false;
				}
			});
			this.contentWidth = w;
			$('#'+this.options.id + '_header_table').css('width',w+'px');
			$('#'+this.options.id + '_content_table').css('width',w+'px');
			$('#'+this.options.id + '_noRows').css('width',w+'px');
		},
		/*
		 * 设置某列是否显示(传入column)
		 */
		setColumnVisibleByColumn:function(column,visible){
			var index = this.getIndexOfColumn(column);
			this.setColumnVisibleByIndex(index);
		},
		
		/*
		 * 设置某列是否显示(传入index为gridCompColumnArr中的数据)
		 */
		setColumnVisibleByIndex:function(index,visible){
			if(index >= 0){
				var column = this.gridCompColumnArr[index];
				var visibleIndex = this.getVisibleIndexOfColumn(column);
				if(visible){ //显示
					var htmlStr = '<col';
					if (this.gridCompColumnArr[index].options.width) {
						htmlStr += ' style="width:' + this.formatWidth(this.gridCompColumnArr[index].options.width) + '"';
					}
					htmlStr += '>';
					var nextVisibleIndex = this.getNextVisibleInidexOfColumn(column);
					if(nextVisibleIndex == -1){
						$('#' + this.options.id + '_header col:last')[0].insertAdjacentHTML('afterEnd',htmlStr);
						$('#' + this.options.id + '_content col:last')[0].insertAdjacentHTML('afterEnd',htmlStr);
					}else{
						$('#' + this.options.id + '_header col:eq(' + (nextVisibleIndex) + ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
						$('#' + this.options.id + '_content col:eq(' + (nextVisibleIndex) + ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
					}
					$('#' + this.options.id + '_header th:eq(' + index + ')').css('display', "");
					$('td:eq(' + index + ')',$('#' + this.options.id + '_content tbody tr')).css('display', "");
				}else{ //隐藏
					$('#' + this.options.id + '_header col:eq(' + visibleIndex + ')').remove();
					$('#' + this.options.id + '_header th:eq(' + index + ')').css('display', "none");
					$('#' + this.options.id + '_content col:eq(' + visibleIndex + ')').remove();
					$('td:eq(' + index + ')',$('#' + this.options.id + '_content tbody tr')).css('display', "none");
				}
				this.countWidth();
				this.saveGridCompColumnArrToLocal();
			}
		},
		
		/*
		 * 获取column属于第几列
		 */
		getIndexOfColumn:function(column){
			var index = -1;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					index = i;
					break;
				}
			}
			return index;
		},
		/*
		 * 获取column属于当前显示第几列
		 */
		getVisibleIndexOfColumn:function(column){
			var index = -1;
			var j = 0;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					if(!($('#' + this.options.id + '_header th:eq(' + i + ')').css('display') == 'none')){
						index = j;	
					}
					break;
				}
				if(!($('#' + this.options.id + '_header th:eq(' + i + ')').css('display') == 'none')){
					j++;
				}
			}
			return index;
		},
		/*
		 * 获取column后面第一个显示列所在第几列
		 */
		getNextVisibleInidexOfColumn:function(column){
			var index = -1;
			var flag = false;
			var j = 0;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					flag = true;
				}
				if(flag == true && !($('#' + this.options.id + '_header th:eq(' + i + ')').css('display') == 'none')){
					index = j;	
					break;
				}
				if(!($('#' + this.options.id + '_header th:eq(' + i + ')').css('display') == 'none')){
					j++;
				}
			}
			return index;
		},
		
		
		/*
		 * 拖动开始
		 */
		dragStart: function(e) {
			this.dragFlag = true;
			this.dragStartX = e.clientX;
		},
		/*
		 * 改变列宽度处理
		 */
		dragFun: function(e) {
			if (this.dragFlag) {
				var nowTh = $('#' + this.options.id + '_resize_handle')[0].nowTh,
					$nowTh = $(nowTh),
					nowThIndex = $nowTh.attr('visibleIndex');
				if (nowTh) {
					this.dragEndX = e.clientX;
					var changeWidth = this.dragEndX - this.dragStartX,
						newWidth = nowTh.attrWidth + changeWidth;
						cWidth = this.contentWidth + changeWidth;
					if (newWidth > this.minColumnWidth) {
						$('#' + this.options.id + '_header_table col:eq(' + nowThIndex + ')').css('width', newWidth + "px");
						$('#' + this.options.id + '_content_table col:eq(' + nowThIndex + ')').css('width', newWidth + "px");
						$('#' + this.options.id + '_header_table').css('width', cWidth + "px");
						$('#' + this.options.id + '_content_table').css('width', cWidth + "px");
						$('#' + this.options.id + '_noRows').css('width', cWidth + "px");
						// 拖动之后就不再是自动扩展列了
						this.gridCompColumnArr[nowThIndex].options.width = newWidth;
						this.gridCompColumnArr[nowThIndex].options.autoExpand = false;
					}
				}
				$('#' + this.options.id + '_top').css('display', 'block');
			}
		},
		/*
		 * 拖动结束
		 */
		dragEnd: function(e) {
			if (this.dragFlag) {
				this.countWidth();
				this.saveGridCompColumnArrToLocal();
			}
			$('#' + this.options.id + '_resize_handle')[0].nowTh = null;
			this.dragFlag = false;
			$('#' + this.options.id + '_top').css('display', 'none');
		},

		/*
		 * 交换列位置开始，并不修改swapColumnFlag，当移动的时候才修改swapColumnFlag
		 */
		swapColumnStart: function(e, ele) {
			this.swapColumnEle = ele;
			this.swapColumnStartX = e.clientX;
			this.swapColumnStartY = e.clientY;
		},
		/*
		 * 交换位置
		 */
		swapColumnFun: function(e) {
			var oThis = this;
			if (this.swapColumnFlag) {
				var nowTh = this.swapColumnEle,
					$nowTh = $(nowTh),
					nowGridCompColumn = nowTh.gridCompColumn;
				//创建拖动区域
				if ($('#' + this.options.id + '_clue').length == 0) {
					var $d = $('<div class="ufida-grid ufida-grid-header-drag-clue" id="' + this.options.id + '_clue" />').css({
						width: nowTh.scrollWidth + "px",
						left: nowTh.attrLeftTotalWidth - oThis.scrollLeft + oThis.leftW +oThis.fixedWidth + "px",
						top: "0px",
						paddingLeft: $nowTh.css("paddingLeft"),
						paddingRight: $nowTh.css("paddingRight"),
						lineHeight: $nowTh.height() + "px",
						paddingTop: $nowTh.css("paddingTop"),
						paddingBottom: $nowTh.css("paddingBottom")
					}).html(nowGridCompColumn.options.title || nowGridCompColumn.options.field).prepend('<span class="fa fa-ban ufida-grid-header-drag-status" />');
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d[0]);
					$d.on('mousemove',function(){
						e.stopPropagation();
					});
				}
				this.swapColumnEndX = e.clientX;
				this.swapColumnEndY = e.clientY;
				var changeX = this.swapColumnEndX - this.swapColumnStartX,
					changeY = this.swapColumnEndY - this.swapColumnStartY;
				$('#' + this.options.id + '_clue').css({
					left: nowTh.attrLeftTotalWidth + changeX - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth + "px",
					top: changeY + "px"
				});

				// 创建提示div
				if ($('#' + this.options.id + '_swap_top').length == 0) {
					var $d = $('<span class="fa fa-sort-desc ufida-grid-header-swap-tip-span"  id="' + this.options.id + '_swap_top"/>');
					$d.css({
						top: $nowTh.height() - 6 + 'px',
					});
					var $d1 = $('<span class="fa fa-sort-asc ufida-grid-header-swap-tip-span" id="' + this.options.id + '_swap_down" />');
					$d1.css({
						top: '6px'
					});
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d[0]);
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d1[0]);
				}
				this.canSwap = false;
				$('#' + this.options.id + '_header_table th').each(function(i) {
					var left = $(this).offset().left,
						right = left + parseInt(this.attrWidth);
					if (i == 0 && e.clientX < left) {
						// 移动到最左边
						if (oThis.swapColumnEle != this) {
							oThis.swapToColumnEle = 'LeftEle';
							$('#' + oThis.options.id + '_swap_top').css({
								left: -oThis.scrollLeft - 3 + oThis.leftW +oThis.fixedWidth + 'px',
								display: 'block'
							});
							$('#' + oThis.options.id + '_swap_down').css({
								left: -oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
								display: 'block'
							});
						}
						oThis.canSwap = true;
					} else if (left < e.clientX && e.clientX < right) {
						if (oThis.swapColumnEle != this && parseInt($(this).attr('index')) + 1 != parseInt($(oThis.swapColumnEle).attr('index'))) {
							if (oThis.swapToColumnEle != this) {
								oThis.swapToColumnEle = this;
								$('#' + oThis.options.id + '_swap_top').css({
									left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW  + oThis.fixedWidth + 'px',
									display: 'block'
								});
								$('#' + oThis.options.id + '_swap_down').css({
									left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
									display: 'block'
								});
							}
							oThis.canSwap = true;
							return false;
						}
					}
				});
				if (this.canSwap) {
					$('.ufida-grid-header-drag-status').removeClass('fa-ban').addClass('fa-plus-circle');
				} else {
					$('#' + this.options.id + '_swap_top').css('display', 'none');
					$('#' + this.options.id + '_swap_down').css('display', 'none');
					$('.ufida-grid-header-drag-status').removeClass('fa-plus-circle').addClass('fa-ban');
					this.swapToColumnEle = null;
				}
				$('#' + this.options.id + '_top').css('display', 'block');
			}
		},
		/*
		 * 交换位置结束
		 */
		swapColumnEnd: function(e) {
			var oThis = this;
			if (this.swapColumnFlag) {
				if (this.swapToColumnEle) {
					var swapColumnEle = this.swapColumnEle,
						swapToColumnEle = this.swapToColumnEle,
						swapColumnIndex = $(swapColumnEle).attr('index'),
						swapToColumnIndex = $(swapToColumnEle).attr('index'),
						swapGridCompColumn = this.gridCompColumnArr[swapColumnIndex];
					this.gridCompColumnArr.splice(parseInt(swapToColumnIndex) + 1, 0, swapGridCompColumn);
					if (swapColumnIndex < swapToColumnIndex)
						this.gridCompColumnArr.splice(swapColumnIndex, 1);
					else
						this.gridCompColumnArr.splice(parseInt(swapColumnIndex) + 1, 1);
					this.saveGridCompColumnArrToLocal();
					this.repaintGridDivs();
				}
				$('#' + this.options.id + '_clue').remove();
				$('#' + this.options.id + '_swap_top').css('display', 'none');
				$('#' + this.options.id + '_swap_down').css('display', 'none');
			}
			this.swapColumnFlag = false;
			$('#' + this.options.id + '_top').css('display', 'none');
		},
		/*
		 * 处理排序
		 */
		canSortable: function(e, ele) {
			var oThis = this,
				$ele = $(ele),
				field = $ele.attr('field'),
				sortable = oThis.getColumnAttr('sortable', field);
			if (sortable) {
				if ($(".fa-angle-up").parent().parent()[0] == ele) { //原来为升序，本次为降序
					$(".fa-angle-up").remove();
					$(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-angle-down ufida-grid-header-sort-span" ></span>');
					oThis.dataSourceObj.sortRows(field, "asc");
				} else if ($(".fa-angle-down").parent().parent()[0] == ele) { //原来为降序，本次为不排序
					$(".fa-angle-down").remove();
					oThis.dataSourceObj.sortRows();
				} else { //本次为升序
					$(".fa-angle-up").remove();
					$(".fa-angle-down").remove();
					$(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-angle-up ufida-grid-header-sort-span"></span>');
					oThis.dataSourceObj.sortRows(field, "desc");
				}
				oThis.rePairContentRows();
				oThis.afterGridDivsCreate();
			}
		},
		/*
		 * 计算拖动div所在位置
		 */
		headerThDrag: function(e, ele) {
			if (!this.dragFlag && !this.swapColumnFlag && ele && ele.gridCompColumn && ele.gridCompColumn.options.canDrag && $('#' + this.options.id + '_resize_handle')[0].nowTh != ele) {
				var $ele = $(ele);
				$('#' + this.options.id + '_resize_handle').css('left', ele.attrRightTotalWidth - this.scrollLeft - 4 + this.leftW + this.fixedWidth);
				$('#' + this.options.id + '_resize_handle')[0].nowTh = ele;
			}
		},
		
		/*
		 * 创建编辑行
		 */
		editRow:function(tr){
			var $tr = $(tr),oThis = this;
			var index = $('tr',$tr.parent()).index($tr);
			this.eidtRowIndex = index;
			var row = this.dataSourceObj.rows[index].value;
			this.editRowObj = this.cloneObj(row);
			$.each(this.gridCompColumnArr, function(i) {
				if(this.options.editable){
					var td = $('td:eq(' + i + ')',$tr)[0];
					var field = this.options.field;
					var value = $(row).attr(field); 
					oThis.editCell(td,value,field,this.options.editType,oThis.editRowObj);
				}
			});
			$('#' +this.options.id + '_content_edit_menu').css('display','block');
			$('#' +this.options.id + '_content_edit_menu').css('left',this.leftW + this.fixedWidth + 'px');
			var t = this.rowHeight * (index + 1) + this.headerHeight + 1;
			$('#' +this.options.id + '_content_edit_menu').css('top',t + 'px');
		},
		
		/*
		 * 行编辑完成
		 */
		editOk:function(){
			var oThis = this;
			var tr = $('#' + this.options.id + '_content_tbody tr:eq(' + this.eidtRowIndex+ ')')[0];
			var row = this.dataSourceObj.rows[this.eidtRowIndex];
			if(typeof this.options.onBeforeRowEditConfirm == 'function'){
				if(this.options.onBeforeRowEditConfirm.call(this,this.editRowObj,this.eidtRowIndex)){
					row.value = this.editRowObj;
					this.repaintRow(tr,row);
					$('#' +this.options.id + '_content_edit_menu').css('display','none');
					this.eidtRowIndex = -1;
				}
			}
		},
		
		/*
		 * 行编辑取消
		 */
		editCancel:function(){
			var tr = $('#' + this.options.id + '_content_tbody tr:eq(' + this.eidtRowIndex+ ')')[0];
			var row = this.dataSourceObj.rows[this.eidtRowIndex];
			this.repaintRow(tr,row);
			$('#' +this.options.id + '_content_edit_menu').css('display','none');
			this.eidtRowIndex = -1;
		},
		
		/*
		 * 编辑单元格
		 */
		editCell:function(td,value,field,editType,rowObj){
			if(editType == 'text'){
				td.innerHTML = '<input type="text" value="' +value+'" field="' + field+'" style="width:100%;height:100%;min-height:20px;font-size:12px;">';
				$('input',$(td)).on('blur',function(){
					$(rowObj).attr(field,this.value);
				});
			}else if(typeof editType == 'function'){
				editType.call(this,td,value,field,rowObj);
			}
		},
		/*
		 * 修改第一列的css
		 */
		headerFirstClassFun:function(){
			$('#' + this.options.id + '_grid .ufida-grid-header-th-first').removeClass('ufida-grid-header-th-first');
			$('#' + this.options.id + '_grid th:eq(0)').addClass('ufida-grid-header-th-first');
		},
		
		/*
		 * 创建完成之后处理变量
		 */
		countWidth: function(e) {
			var oThis = this;
			this.contentWidth = 0;
				
			// 记录每列宽度及当前宽度之和
			$('#' + this.options.id + '_header_table th').each(function(i) {
				var w = this.offsetWidth;//判断是否设置了width
				if(w > 0 && w < oThis.minColumnWidth)
					w = oThis.minColumnWidth;
				var gridCompColumn = oThis.gridCompColumnArr[i];
				this.attrLeftTotalWidth = oThis.contentWidth;
				oThis.contentWidth += w;
				if (!$('#' + oThis.options.id + '_resize_handle')[0].nowTh && gridCompColumn.options.canDrag) {
					$('#' + oThis.options.id + '_resize_handle').css('left', w - 4 + oThis.leftW);
					$('#' + oThis.options.id + '_resize_handle')[0].nowTh = this;
				}
				this.gridCompColumn = gridCompColumn;
				this.attrWidth = w;
				this.attrRightTotalWidth = oThis.contentWidth;
			});
			$('#' + this.options.id + '_header_table').css('width', this.contentWidth + "px");
			$('#' + this.options.id + '_content_table').css('width', this.contentWidth + "px");
			$('#' + this.options.id + '_noRows').css('width', this.contentWidth + "px");
		},
		
		/*
		 * 整体宽度改变处理
		 */
		widthChangeFunc: function() {
			var oThis = this;
			if($('#' + this.options.id)[0]){
				var w = $('#' + this.options.id)[0].offsetWidth;
				if(this.wholeWidth != w){
					this.wholeWidth = w;
					var halfWholeWidth = parseInt(w/2);
					if(this.fixedWidth > halfWholeWidth){
						this.fixedWidth = halfWholeWidth;
					}
					if (w > 300 && (this.showType == 'form' || this.showType == '')) {
						this.createGridDivs();
						$('#' + this.options.id + '_form').css('display', 'none');
						$('#' + this.options.id + '_grid').css('display', 'block');
						this.showType = 'grid';
					} else if (w > 0 && w < 300 && (this.showType == 'grid' || this.showType == '')) {
						this.createFromDivs();
						$('#' + this.options.id + '_grid').css('display', 'none');
						$('#' + this.options.id + '_form').css('display', 'block');
						this.showType = 'form';
						if(typeof this.options.afterCreate == 'function'){
							this.options.afterCreate.call(this);
						}
					}
					if(w > 300){
						this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
						if(this.contentMinWidth < 0)
							this.contentMinWidth = 0;
						setTimeout(function(){
							$('#' + oThis.options.id + '_content_div').css('width', oThis.contentMinWidth + 'px');
							$('#' + oThis.options.id + '_content_table').css('min-width', oThis.contentMinWidth + 'px');
							$('#' + oThis.options.id + '_header_table').css('min-width', oThis.contentMinWidth + 'px');
							if(typeof oThis.options.afterCreate == 'function'){
								oThis.options.afterCreate.call(oThis);
							}
						},100);
					}
				}
				
			}
		},
		
		/*
		 * 整体高度改变处理
		 */
		changeHeightFun: function() {
			if(this.countContentHeight){
				var oldH = this.wholeHeight,
					h = $('#' + this.options.id)[0].offsetHeight;
				this.wholeHeight = h;
				if (oldH != h) {
					var contentH = h - this.exceptContentHeight > 0 ? h - this.exceptContentHeight : 0;
					$('#' + this.options.id + '_content').css('height', contentH + 'px');
					$('#' + this.options.id + '_content_div').css('height', contentH + 'px');
				}
			}
		},
		
		/*
		 * 获取本地个性化存储的设置
		 */
		getLocalData:function(){
			if (window.localStorage == null)
				return null;
			if (this.$sd_storageData != null)
				return this.$sd_storageData;
			else{
				if (window.localStorage.getItem(this.localStorageId) == null){
					try{
						window.localStorage.setItem(this.localStorageId,"{}");
					}
					catch(e){
						return null;
					}
				}
				var storageDataStr = window.localStorage.getItem(this.localStorageId);
				if(typeof(JSON) == "undefined")
					this.$sd_storageData = eval("("+storageDataStr+")");
				else
					this.$sd_storageData = JSON.parse(storageDataStr);
				return this.$sd_storageData; 
			}
		},
		/*
		 * 保存本地个性化存储的设置
		 */
		saveLocalData:function(){
			var oThis = this;
			if(this.saveSettimeout){
				clearTimeout(this.saveSettimeout);
			}
			this.saveSettimeout = setTimeout(function(){
				if (oThis.$sd_storageData == null || window.localStorage == null)
					return;
				var strogeDataStr = JSON.stringify(oThis.$sd_storageData);
				try{
					window.localStorage.setItem(oThis.localStorageId,strogeDataStr);
				}catch(e){
					
				}
			},200);
		},
		/*
		 * 清除本地个性化存储的设置
		 */
		clearLocalData:function(){
			if(this.saveSettimeout){
				clearTimeout(this.saveSettimeout);
			}
			window.localStorage.setItem(this.localStorageId,"{}");
			this.$sd_storageData = {};
		},
		/*
		 * 将数据列顺序保存至本地个性化存储
		 */
		saveGridCompColumnArrToLocal:function(){
			var defData = this.getLocalData();
			defData["gridCompColumnArr"] = this.gridCompColumnArr.concat(this.gridCompColumnFixedArr);
			this.saveLocalData();
		},
		/* 
		 * 从本地个性化存储中取出数据列顺序
		 */
		getGridCompColumnArrFromLocal:function(){
			var defData = this.getLocalData();
			if (defData == null) return null;
			if(defData["gridCompColumnArr"] == null) return null;
			return defData["gridCompColumnArr"];
		},
		/*
		 * 获取某列对应属性
		 */
		getColumnAttr: function(attr, field) {
			for (var i = 0; i < this.gridCompColumnArr.length; i++) {
				if (this.gridCompColumnArr[i].options.field == field) {
					return $(this.gridCompColumnArr[i].options).attr(attr);
				}
			}
			return "";
		},
		
		/*
		 * 根据field获取gridcompColumn对象
		 */
		getColumnByField: function(field){
			for (var i = 0; i < this.gridCompColumnArr.length; i++) {
				if (this.gridCompColumnArr[i].options.field == field) {
					return this.gridCompColumnArr[i];
				}
			}
			return null;
		},
		/*
		 * 对宽度和高度进行处理
		 */
		formatWidth: function(w) { // 获得宽度
			return (w + "").indexOf("%") > 0 ? w : parseInt(w) + "px";
		},
		/*
		 * 两个元素交换位置，要求传入参数e1在e2之前
		 */
		swapEle: function(e1, e2) {
			var n = e1.next(),
				p = e2.prev();
			e2.insertBefore(n);
			e1.insertAfter(p);
		},
		getString:function(value,defaultValue){
			if(value == null || value == undefined || value == 'null' || value == 'undefined'){
				value = defaultValue;
			}
			return value;
		},
		
		/*
		 * 克隆对象
		 */
		 cloneObj:function(obj){  
		    var o;  
		    if(typeof obj == "object"){  
		        if(obj === null){  
		            o = null;  
		        }else{  
		            if(obj instanceof Array){  
		                o = [];  
		                for(var i = 0, len = obj.length; i < len; i++){  
		                    o.push(this.cloneObj(obj[i]));  
		                }  
		            }else{  
		                o = {};  
		                for(var k in obj){  
		                    o[k] = this.cloneObj(obj[k]);  
		                }  
		            }  
		        }  
		    }else{  
		        o = obj;  
		    }  
		    return o;  
		},
	
			/*
		 * 设置数据源
		 */
		setDataSource: function(dataSource) {
			this.initVariable();
			this.options.dataSource = dataSource;
			this.initDataSource();
			this.repaintDivs();
		},
		
		/*
		 * 设置数据源 格式为：
		 * {
    		fields:['column1','column2','column3','column4','column5','column6'],
    		values:[["cl1","1","cl3","cl4","cl5","cl6"]
    				,["cl12","2","cl32","cl42","cl52","cl62"]
    				,["cl13","3","cl33","cl43","cl53","cl63"]
    				,["cl14","4","cl34","cl44","cl54","cl64"]
    				,["cl15","5","cl35","cl45","cl55","cl65"]
    				,["cl16","6","cl36","cl46","cl56","cl66"]
		    	]

			}
		 */
		setDataSourceFun1: function(dataSource){
			var dataSourceObj = {};
			if(dataSource.values){
				var valuesArr = new Array();
				$.each(dataSource.values, function() {    
					if(dataSource.fields){
						var valueObj = {},value = this;
						$.each(dataSource.fields, function(j) {
							$(valueObj).attr(this,value[j])
						});
						valuesArr.push(valueObj);
					}
				});
			}
			$(dataSourceObj).attr('values',valuesArr);
			this.setDataSource(dataSourceObj);
		},
		/*
		 * 添加一行
		 */
		addOneRow:function(index,row){
			var l = this.dataSourceObj.rows.length;
			if(l < index)
				index = l;
			var rowObj = {};
			rowObj.value = row;
			this.dataSourceObj.rows.splice(index,0,rowObj);
			var htmlStr = this.createContentOneRow(rowObj);
			if($('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')')[0])
				$('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
			else
				$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStr);
			var htmlStr = this.createContentOneRow(rowObj,'fixed');
			if($('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')')[0])
				$('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
			else	
				$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStr);
			//
			if(this.options.multiSelect){
				var htmlStr = this.createContentLeftMultiSelectRow(rowObj);
				if($('#' + this.options.id + '_content_multiSelect div:eq(' + index + ')')[0])
					$('#' + this.options.id + '_content_multiSelect div:eq(' + index + ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
				else
					$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin',htmlStr);
			}
			if (this.options.showNumCol) {
				var htmlStr = this.createContentLeftNumColRow(l);
				$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd',htmlStr);
			}
			this.repairSumRow();
			this.noRowsShowFun();
			this.renderTypeFun(index,1);
		},
		
		/*
		 * 添加多行
		 */
		addRows:function(index,rows){
			var htmlStr = '',htmlStrmultiSelect='',htmlStrNumCol='',htmlStrFixed='',oThis = this,l = this.dataSourceObj.rows.length;
			if(l < index)
				index = l;
			var rowObjArr = new Array();
			$.each(rows, function(i) {
				var rowObj = {};
				rowObj.value = this;
				rowObjArr.push(rowObj);
				oThis.dataSourceObj.rows.splice(index + i,0,rowObj);
			});
			
			$.each(rowObjArr, function(i) {
				htmlStr += oThis.createContentOneRow(this);
				htmlStrFixed += oThis.createContentOneRow(this,'fixed');
				if(oThis.options.multiSelect){
					htmlStrmultiSelect += oThis.createContentLeftMultiSelectRow(this);
				}
				if(oThis.options.showNumCol){
					htmlStrNumCol += oThis.createContentLeftNumColRow(l + i);
				}
			});
			if($('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')')[0])
				$('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
			else
				$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStr);
			if($('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')')[0])
				$('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')')[0].insertAdjacentHTML('beforeBegin',htmlStrFixed);
			else
				$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStrFixed);
			if(this.options.multiSelect){
				if($('#' + this.options.id + '_content_multiSelect div:eq(' + index + ')')[0])
					$('#' + this.options.id + '_content_multiSelect div:eq(' + index + ')')[0].insertAdjacentHTML('beforeBegin',htmlStrmultiSelect);
				else
					$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin',htmlStrmultiSelect);
			}
			if (this.options.showNumCol) {
				$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd',htmlStrNumCol);
			}
			this.repairSumRow();
			this.noRowsShowFun();
			this.renderTypeFun(index,rows.length);
		},
		/*
		 * 删除一行
		 */
		deleteOneRow:function(index){
			index = parseInt(index);
			this.dataSourceObj.rows.splice(index,1);
			$('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')').remove();
			$('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')').remove();
			$('#' + this.options.id + '_content_multiSelect >div:nth-child('+(this.dataSourceObj.rows.length +1)+ ')').remove();
			$('#' + this.options.id + '_content_numCol >div:nth-child('+(this.dataSourceObj.rows.length +1)+ ')').remove();
			this.repairSumRow();
			this.noRowsShowFun();
		},
		
		/*
		 * 删除多行
		 */
		deleteRows:function(indexs){
			var oThis = this;
			indexs.sort(function(a,b){
				return b-a;
			});
			
			$.each(indexs, function(i) {    
				oThis.deleteOneRow(this);
			});
		},
		
		/*
		 * 修改某一行
		 */
		updateRow:function(index,row){
			this.deleteOneRow(index);
			this.addOneRow(index,row);
		},
		
		/*
		 * 选中一行
		 */
		setRowSelect:function(rowIndex){
			if(typeof this.options.onBeforeRowSelected == 'function'){
				if(!this.options.onBeforeRowSelected(rowIndex,this.dataSourceObj.rows[rowIndex].value)){
					return;
				}
			}
			//已经选中退出
			if(this.dataSourceObj.rows[rowIndex].checked)
				return;
			if(!this.options.multiSelect){
				if(this.selectRowsObj.length > 0)
					this.selectRowsObj[0].checked = false;
				this.selectRows = new Array();
				this.selectRowsObj = new Array();
				$('#' + this.options.id + '_content_tbody tr').css('background','');
				$('#' + this.options.id + '_content_tbody tr').css('color','');
				$('#' + this.options.id + '_content_tbody tr a').css('color','');
			}else{
				$('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex+ ')')[0].checked = true;
			}
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ')').css('background','#00b0ff');
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ')').css('color','#fff');
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ') a').css('color','#fff');
			this.selectRows.push(this.dataSourceObj.rows[rowIndex].value);
			this.selectRowsObj.push(this.dataSourceObj.rows[rowIndex]);
			this.dataSourceObj.rows[rowIndex].checked = true;
			if(typeof this.options.onRowSelected == 'function'){
				this.options.onRowSelected(rowIndex,this.dataSourceObj.rows[rowIndex].value);
			}
			
		},
		
		/*
		 * 反选一行
		 */
		setRowUnselect:function(rowIndex){
			var oThis=this;
			if(typeof this.options.onBeforeRowUnSelected == 'function'){
				if(!this.options.onBeforeRowUnSelected(rowIndex,this.dataSourceObj.rows[rowIndex].value)){
					return;
				}
			}
			//已经选中退出
			if(!this.dataSourceObj.rows[rowIndex].checked)
				return;
			if(this.options.multiSelect){
				$('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex+ ')')[0].checked = false;
			}
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ')').css('background','');
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ')').css('color','');
			$('#' + this.options.id + '_content_tbody tr:eq(' + rowIndex+ ') a').css('color','');
			$.each(this.selectRows,function(i){
				if(this == oThis.dataSourceObj.rows[rowIndex].value){
					oThis.selectRows.splice(i,1);
					oThis.selectRowsObj.splice(i,1);
				}
			})
			this.dataSourceObj.rows[rowIndex].checked = false;
			if(typeof this.options.onRowUnSelected == 'function'){
				this.options.onRowUnSelected(rowIndex,this.dataSourceObj.rows[rowIndex].value);
			}
		},
		
		/*
		 * 选中所有行
		 */
		setAllRowSelect:function(){
			if(typeof this.options.onBeforeAllRowSelected == 'function'){
				if(!this.options.onBeforeAllRowSelected(this.dataSourceObj.rows)){
					return;
				}
			}
			for(var i=0;i<this.dataSourceObj.rows.length;i++){
				this.setRowSelect(i);
			}
			if(typeof this.options.onAllRowSelected == 'function'){
				this.options.onAllRowSelected(this.dataSourceObj.rows);
			}
				
		},
		
		/*
		 * 反选所有行
		 */
		setAllRowUnSelect:function(){
			if(typeof this.options.onBeforeAllRowUnSelected == 'function'){
				if(!this.options.onBeforeAllRowUnSelected(this.dataSourceObj.rows)){
					return;
				}
			}
			for(var i=0;i<this.dataSourceObj.rows.length;i++){
				this.setRowUnselect(i);
			}
			if(typeof this.options.onAllRowSelected == 'function'){
				this.options.onAllRowUnSelected(this.dataSourceObj.rows);
			}
		},
		
		/*
		 * 获取选中行
		 */
		getSelectRows:function(){
			return this.selectRows;
		},
		
		/*
		 * 获取所有行
		 */
		getAllRows:function(){
			var oThis = this;
			this.allRows = new Array();
			if(this.dataSourceObj.rows){
				$.each(this.dataSourceObj.rows,function(){
					oThis.allRows.push(this.value);
				});
			}
			return this.allRows;
		},
		
		/*
		 * 获取选中行
		 */
		getRowByIndex:function(index){
			return this.dataSourceObj.rows[index];
		},
		
		/*
		 * 获取数据行下所有子元素
		 */
		getAllChildRow:function(row){
			if(row.allChildRowIndex && row.allChildRow.length > 0){
				return row.allChildRow;
			}
			row.allChildRow = new Array();
			this.getAllChildRowFun(row,row.allChildRow);
			return row.allChildRow;
		},
		
		/*
		 * 获取数据行下所有子元素的index
		 */
		getAllChildRowIndex:function(row){
			if(row.allChildRowIndex && row.allChildRowIndex.length > 0){
				return row.allChildRowIndex;
			}
			row.allChildRowIndex = new Array();
			this.getAllChildRowIndexFun(row,row.allChildRowIndex);
			return row.allChildRowIndex;
		},
		
		
		getAllChildRowFun:function(row,rowArry){
			var oThis = this;
			if(row.childRow.length > 0){
				Array.prototype.push.apply(rowArry, row.childRow);
				$.each(row.childRow, function() {    
					  oThis.getAllChildRowFun(this,rowArry);                                                        
				});
			}
		},
		
		getAllChildRowIndexFun:function(row,rowArry){
			var oThis  = this;
			if(row.childRowIndex.length > 0){
				Array.prototype.push.apply(rowArry, row.childRowIndex);
				$.each(row.childRow, function() {    
					  oThis.getAllChildRowIndexFun(this,rowArry);                                                        
				});
			}
		},
		
		/*
		 * 根据filed设置renderType
		 */
		setRenderType:function(field,renderType){
			var gridCompColumn = this.getColumnByField(field);
			gridCompColumn.options.renderType = renderType;
			var index = this.getIndexOfColumn(gridCompColumn);
			this.renderTypeByColumn(gridCompColumn,index);
		},
		
		/*
		 * 根据filed设置editType
		 */
		setEditType:function(field,editType){
			var gridCompColumn = this.getColumnByField(field);
			gridCompColumn.options.editType = editType;
		},
		
		/*
		 * 设置是否可修改
		 */
		setEditable:function(editable){
			this.options.editable = editable;
		},
}
	dataSource.prototype = {
		/*
		 * 将values转化为rows并进行排序
		 */
		sortRows:function(field,sortType){
			if(this.gridComp.options.showTree){
				this.treeSortRows(field,sortType);
			}else{
				this.basicSortRows(field,sortType);
			}
		},
		/*
		 * 将values转化为rows并进行排序(标准)
		 */
		basicSortRows: function(field, sortType) {
			//待完善 如果是数字的话设计排序，需要根据数据类型，未确定是dataset还是grid上定义
			var oThis = this;
			if (sortType == "asc") {
				this.rows.sort(function(a, b) {
					var v1 = $(b.value).attr(field);
					v1 = oThis.gridComp.getString(v1,'');
					var v2 = $(a.value).attr(field);
					v2 = oThis.gridComp.getString(v2,'');
					try{
						return v1.localeCompare(v2);
					}catch(e){
						return 0;
					}
				});
			} else if (sortType == "desc") {
				this.rows.sort(function(a, b) {
					var v1 = $(a.value).attr(field);
					v1 = oThis.gridComp.getString(v1,'');
					var v2 = $(b.value).attr(field);
					v2 = oThis.gridComp.getString(v2,'');
					try{
						return v1.localeCompare(v2);
					}catch(e){
						return 0;
					}
				});
			} else {
				this.rows = new Array();
				if(this.options.values){
					$.each(this.options.values, function(i) {
						var rowObj = {};
						rowObj.value = this;
						oThis.rows.push(rowObj);
					});
				}
			}
		},
		
		/*
		 * 将values转化为rows并进行排序(数表)
		 */
		treeSortRows: function(field, sortType) {
			var oThis = this;
			this.rows = new Array();
			this.hasParentRows = new Array();
			this.nothasParentRows = new Array();
			if(this.options.values){
				$.each(this.options.values, function(i){
					var rowObj = {};
					var $this = $(this);
					var keyField = oThis.gridComp.options.keyField;
					var parentKeyField = oThis.gridComp.options.parentKeyField;
					var keyValue = oThis.gridComp.getString($this.attr(keyField),'');
					var parentKeyValue = oThis.gridComp.getString($this.attr(parentKeyField),'');
					rowObj.value = this;
					rowObj.keyValue = keyValue;
					rowObj.parentKeyValue = parentKeyValue;
					if(parentKeyValue == ''){
						oThis.nothasParentRows.push(rowObj);
					}else{
						oThis.hasParentRows.push(rowObj);
					}
					oThis.rows.push(rowObj);
				});
				// 判断存在父项的数据的父项是否真正存在
				$.each(this.hasParentRows,function(i){
					var parentKeyValue = this.parentKeyValue;
					var hasParent = false;
					$.each(oThis.rows,function(){
						if(this.keyValue == parentKeyValue){
							hasParent = true;
						}
					});
					if(!hasParent){
						oThis.hasParentRows.splice(i,0);
						oThis.nothasParentRows.push(this);
					}
				});
				oThis.rows = new Array();
				var level = 0;
				// 遍历nothasParentRows，将子项加入rows
				$.each(this.nothasParentRows, function(i) {
					this.level = level;
					oThis.rows.push(this);
					oThis.pushChildRows(this,level);
				});
			}
		},
		
		/*
		 * 将当前行子项插入rows数组
		 */
		pushChildRows:function(row,level){
			var keyValue = row.keyValue;
			var oThis = this;
			var nowLevel = parseInt(level) + 1;
			var hasChild = false;
			var childRowArray = new Array();
			var childRowIndexArray = new Array();
			$.each(this.hasParentRows, function(i) {
				if(this && this.parentKeyValue == keyValue){
					hasChild = true;
					this.level = nowLevel;
					oThis.rows.push(this);
					childRowArray.push(this);
					var index = parseInt(oThis.rows.length - 1);
					childRowIndexArray.push(index);
					oThis.hasParentRows.splice(i,0);
					oThis.pushChildRows(this,nowLevel);
				}
			});
			row.hasChild = hasChild;
			row.childRow = childRowArray;
			row.childRowIndex = childRowIndexArray;
		},
		/*
		 * 获取合计值
		 */
		getSumValue:function(field,gridCompColumn,gridComp){
			var sumValue = null;
			if(gridCompColumn.options.sumCol){
				$.each(this.rows, function(i) {    
					var v = $(this.value).attr(field);
					if(gridCompColumn.options.dataType == 'int'){
						sumValue  += parseInt(v);
					}else{
						sumValue  += parseFloat(v);
					}
				});
			}
			if(sumValue != null && sumValue != undefined && sumValue != 'null' && sumValue != 'undefined'){
				return sumValue + '';
			}else{
				return '';
			}
			
		},

	};
	// 方法扩展
	$.fn.grid = function(options) {
		var grid = new gridComp(this, options);
		return grid;
	};
})(jQuery, window, document);