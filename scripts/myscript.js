$(document).ready(function(){
	function loadform(selector,formJSON){
		var formObj;
		if(typeof(formJSON)==="string")
			$.parseJSON(formJSON)
		else if(typeof(formJSON)==="object")
			formObj = formJSON;
		if(!formObj) return;
		if(!dataSource) return;
		if(!formObj || !selector){
			console.log("empty objects");
			return;
		}

		var items = [];
		// сортируем элементы в указанном порядке, если он указан (считаем, что он обязательно есть)
		for(var sortindex in formObj.order)
			items.push(formObj[formObj.order[sortindex]]);
		selector.append("<form action="+formObj.action+">");
		var form = selector.find("form:last");
		
		$.get("templates/table_template.html").done(function(data,status,jqXHR){
			var template = "";
			if(jqXHR.statusText==="notmodified")
				template = jqXHR.responseText;
			else
				template = data;
			if(!template) return false;
			var TemplatesItems = [];
			for(var i in items){
				(function(i){
					var templateElement = {
						disable:items[i].editable?"":"disabled",
						inputType:items[i].inputType,
						title:items[i].inputTitle,
						disabled:(items[i].editable?"":"disabled"),
						value:dataSource.getData(items[i].datapath),
						checked:(items[i].checked?"checked":""),
						visible:items[i].visible,
						datapath:items[i].datapath,
						name:items[i].name,
						id:"tableinput"+i
					};
					TemplatesItems.push(templateElement);

				})(i);
			}
			selector.append(Mustache.to_html(template, {"rows":TemplatesItems}));
			for(var i in TemplatesItems){
				var inputEl = $("input."+TemplatesItems[i].id).data("valuepath",TemplatesItems[i].datapath);
				if(!TemplatesItems[i].visible)
					$("tr."+TemplatesItems[i].id).hide();
			}
			$("input[type=\"text\"]").change(function() {
				var value = $(this).val();
				dataSource.setData($(this).data("valuepath"),value);
			});
		});
		return form;
	}
	// для примера загружаем JSON из файла
	$.getJSON("formsdata/form1",function(data,status,jqXHR){
		var formObj;
		if(jqXHR.statusText==="notmodified")
			formObj = $.parseJSON(jqXHR.responseText);
		else
			formObj = data;
		loadform($("body"),formObj);
	}).fail(function(){console.log("error load JSON")});
});

