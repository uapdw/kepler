		<script src="/ecmgr/static/js/emall/admgr.js"></script>

		<table data-bind="foreach: datas">
			<tr>
				<td data-bind="text: name"></td>
				<td data-bind="text: age"></td>
			</tr>
		</table>	
		<nav>
		  <ul class="pagination"  data-bind="foreach:paginations">
		    <li data-bind="attr:{class:calssname}"><a href="#" data-bind="text:name"></a></li>
		  </ul>
		</nav>
				
				[{name:'&laquo;',calssname:''},name:'1']