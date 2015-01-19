function setUpForms() {
	var e=document.getElementById('WorkbenchForms');
	setUpLanguageForm(e);
	setUpChangeForm(e);
	setUpViewForm(e);
}

function setUpLanguageForm(elem) {
var str='<div id="langAdd">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'		Language Name:' + 
	'		<input type="text" id="langAddName" value="Unnamed">' +
	'		<br>' +
	'		<input type="checkbox" id="langAddOutput" value="executable">Meta Language' +
	'		<table id="langAddCode">' +
	'			<tr>' +
	'				<th>Grammar</th>' +
	'				<th>Start Rule</th>' +		
	'				<th>Input</th>' +
	'				<th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<table id="langAddDecode">' +
	'			<tr>' +
	'				<th>Decode<br>Grammar</th>' +
	'				<th>Start Rule</th>' +	
	'				<th>Input</th>' +
	'				<th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<fieldset id="grammarToAdd">' +
	'			<legend>Grammar</legend>' +
	'		  <button type="button" title="add grammar"' +
	'		    onClick="addGrammar(\'langAdd\',\'grammarToAdd\')">+</button>' +
	'		  Name:' +
	'			<input type="text" name="name"">' +
	'			<br>' +
	'			from View:' +
	'			<input type="text" name="defView">' +
	'			<br>' +
	'			Start Rule:' + 
	'			<input type="text" name="startRule">' +
	'			<br>' +
	'			Flow:' +
	'			<select name="flow">' +
	'				<option value="code">code</option>' +
	'				<option value="decode">decode</option>' +
	'			</select>' +
	'			Input:' +
	'			<select name="input">' +
	'				<option value="List">List</option>' +
	'				<option value="Object">Object</option>' +
	'			</select>' +	
	'		</fieldset>' +
	'		<br>' +
	'		<button type="button" title="cancel" onClick="top.popUp(\'langAdd\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" title="add language" onClick="addLanguage(\'langAdd\')">' +
	'			Add Language' +
	'		</button>' +
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);
}

function setUpChangeForm(elem) {
var str='<div id="langChange">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'		<button id="deleteLanguage" type="button" title="delete language"' +
	'			onClick="removeLanguage(\'langChange\')">' +
	'		  Delete Language' +
	'		</button>' +
	'		<br>' +
	'		Language Name:' +
	'		<input type="text" id="langChangeName">' +
	'		<br>' +
	'		<input type="checkbox" id="langChangeOutput" value="executable">Meta Language' +
	'		<table id="langChangeCode">' +
	'			<tr>' +
	'				<th>Grammar</th>' +
	'				<th>Start Rule</th>' +	
	'				<th>Input</th>' +
	'				<th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<table id="langChangeDecode">' +
	'			<tr>' +
	'				<th>Decode<br>Grammar</th>' +
	'				<th>Start Rule</th>' +	
	'				<th>Input</th>' +
	'				<th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<fieldset id="grammarToChange">' +
	'			<legend>Grammar</legend>' +
	'		  <button type="button" title="add grammar"' +
	'		    onClick="addGrammar(\'langChange\',\'grammarToChange\')">+</button>' +
	'			Name:' +
	'			<input type="text" name="name">' +
	'			<br>' +
	'			from View:' + 
	'			<input type="text" name="defView">' +
	'			<br>' +
	'			Start Rule:' + 
	'			<input type="text" name="startRule">' +
	'			<br>' +
	'			Flow:' +
	'			<select name="flow">' +
	'				<option value="code">code</option>' +
	'				<option value="decode">decode</option>' +
	'			</select>' +
	'			Input:' +
	'			<select name="input">' +
	'				<option value="List">List</option>' +
	'				<option value="Object">Object</option>' +
	'			</select>' +
	'		</fieldset>' +
	'		<br>' +
	'		<button type="button" title="cancel" onClick="popUp(\'langChange\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" title="change language" onClick="changeLanguage(\'langChange\')">' +
	'			Change Language' +
	'		</button>' +
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);
}


function setUpViewForm(elem) {
var str='<div id="openView">' +
	'<div>' +
	'	<form>' +
	'		Name:' +
	'		<input type="text" id="openViewName" value="Unnamed">' +
	'		<br>' +
	'		Input View:' +
	'		<input type="text" id="openViewInput">' +
	'		<br>' +
	'		Language:' +
	'		<select id="openViewLang">' +
	'		</select>' +
	'		<br>' +
	'		Height(in pixels):' +
	'		<input type="number" id="openViewHeight" value="100" min="10" max="1000">' +
	'		<br>' +
	'		<input type="checkbox" id="openViewReadonly">Readonly' +
	'		<br>' +
	'		<input type="checkbox" id="openViewGutters">Gutters' +
	'		<br>' +
	'		<button type="button" title="cancel" onClick="popUp(\'openView\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" title="update view" onClick="updateView()">' +
	'			Update View' +
	'		</button>' +
	'		<button type="button" title="add view" onClick="addView()">' +
	'			New View' +
	'		</button>' +
	'	</form>' +
	'</div>' +
	'</div>';
	elem.insertAdjacentHTML("beforeend", str);
}

function popUp(id) {
	var el = document.getElementById(id);
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function addGrammar(form,gid) {
  var str, t, g = document.getElementById(gid), elem = [], grammarData=[];
  for (var i = 0; i < g.elements.length ;i++) {
    if (g.elements[i].name) {
    	grammarData[g.elements[i].name] = g.elements[i].value;
    	elem[g.elements[i].name]=g.elements[i];
    }
  }
  if (grammarData["name"]) {
    try {eval(grammarData["name"])} catch (e) {
			elem["name"].value += " error";
			elem["name"].focus();
			return;
    };
  } else {
  	elem["name"].focus();
  	return;
  };
  if (grammarData["startRule"]) {
    try {
    	if(eval(grammarData["name"])[grammarData["startRule"]] === undefined) {
				elem["startRule"].value += " error";
				elem["startRule"].focus();
				return;
    	}
    } catch (e) {
			elem["startRule"].value += " error";
			elem["startRule"].focus();
			return;
    };
  } else {
  	elem["startRule"].focus();
  	return;
  };
  if (grammarData["defView"]) {
    if (LoLs.views[grammarData["defView"]] === undefined) {
			elem["defView"].value += " error";
			elem["defView"].focus();
			return;
    };
  } else {
  	grammarData["defView"]="";
  };
  if (grammarData["flow"] == "code") {
		t = document.getElementById(form+"Code");
  }
  else {
		t = document.getElementById(form+"Decode");
  };
  str ='<tr><td>'+grammarData["name"]+'</td>'+
					 '<td>'+grammarData["startRule"]+'</td>'+		
					 '<td>'+grammarData["input"]+'</td>'+		
					 '<td>'+grammarData["defView"]+'</td>'+		
					'<td><button type="button" title="delete grammar"'+
					' onclick="deleteGrammar(this)">X</button></td></tr>';
	t.insertAdjacentHTML("beforeend", str);
}

function deleteGrammar(here) {
	var row=here.parentNode.parentNode;
	row.parentNode.removeChild(row);
}

function addLanguage(id) {
	var i, elem=document.getElementById(id+'Name'), lang, view;	
	lang=pullLangInfo('langAdd');
	if (lang.name == '') {
		elem.value += 'needs value';
		elem.focus();
		return;
	};
	if (LoLs.languages[lang.name] !== undefined) {
		elem.value += ' already defined';
		elem.focus();
		return;
	};
	if (lang.code.length<1) {
		elem.value += ' at least one code grammar';
		elem.focus();
		return;
	};
	for (i=0; i<lang.code.length; i++) {
		view=lang.code[i].defView;
		if (view.langDefs.indexOf(lang)<0)
			view.langDefs[view.langDefs.length]=lang;
	}
	for (i=0; i<lang.decode.length; i++) {
		view=lang.decode[i].defView;
		if (view.langDefs.indexOf(lang)<0)
			view.langDefs[view.langDefs.length]=lang;
	}
	LoLs.languages[LoLs.languages.length]=lang;
	LoLs.languages[lang.name]=lang;
	relaceLangRibbon(); 
  popUp(id);  
	if (LoLs.currentView)
		document.getElementById(LoLs.currentView.id).editor.focus(); 
}

function pullLangInfo(pre) {
	var i, elem=document.getElementById(pre+'Name'), checked, table, rows, g;
	var lang={name: elem.value,
		code: [],
		decode: [],
		references: []};
	checked=document.getElementById(pre+'Output').checked;
	table=document.getElementById(pre+'Code');
	rows=table.getElementsByTagName("tr");
	for (i=1; i<rows.length; i++) {
		g=rows[i].getElementsByTagName("td");
		g={name: g[0].textContent,
		 rules: eval(g[0].textContent),
		 startRule: g[1].textContent,
		 language: lang,
		 inputIsList: g[2].textContent,
		 defView: g[3].textContent};
		if (g.inputIsList == "List") {
		  g.inputIsList=true;
		} else {
		  g.inputIsList=false;
		};
		lang.code[lang.code.length]=g;
		if (g.defView == "") {
			g.defView=undefined;
		} else {
			g.defView=LoLs.views[g.defView];
		};	 
	};
	table=document.getElementById(pre+'Decode');
	rows=table.getElementsByTagName("tr");
	for (i=1; i<rows.length; i++) {
		g=rows[i].getElementsByTagName("td");
		g={name: g[0].textContent,
		 rules: eval(g[0].textContent),
		 startRule: g[1].textContent,
		 language: lang,
		 inputIsList: g[2].textContent,
		 defView: g[3].textContent};
		if (g.inputIsList == "List") {
		  g.inputIsList=true;
		} else {
		  g.inputIsList=false;
		};
		lang.decode[lang.decode.length]=g;		 
		if (g.defView == "") {
			g.defView=undefined;
		} else {
			g.defView=LoLs.views[g.defView];
		};	 
	};
	if (checked && lang.code.length>=1)
		lang.code[lang.code.length-1].evalResults=true;
	return lang;
}

function removeLanguage(id) {
	var form=document.getElementById('langChangeName');
	removeLanguageObj(LoLs.languages[form.value]);
	relaceLangRibbon();
  popUp(id);  
	if (LoLs.currentView)
		document.getElementById(LoLs.currentView.id).editor.focus(); 
}

function removeLanguageObj(langObj) {
	var view;
	if (langObj === undefined)
		return;
	if (langObj.references.length>0)
		return;
	for (var i=0; i<langObj.code.length; i++) {
		if (langObj.code[i].defView !== undefined) {
			view=langObj.code[i].defView;
			view.grammarDefs=view.grammarDefs.filter(function(x) {return x !== langObj.code[i]});
			view.langDefs=view.langDefs.filter(function(x) {return x !== langObj});
		};
	};
	for (var i=0; i<langObj.decode.length; i++) {
		if (langObj.decode[i].defView !== undefined) {
			view=langObj.decode[i].defView;
			view.grammarDefs=view.grammarDefs.filter(function(x) {return x !== langObj.code[i]});
			view.langDefs=view.langDefs.filter(function(x) {return x !== langObj});
		};
	};
	LoLs.languages=LoLs.languages.filter(function (x) {return x !== langObj});
	for (var i=0; i<LoLs.languages.length; i++) {
		LoLs.languages[LoLs.languages[i].name]=LoLs.languages[i];
	};
}

function changeLanguage(id) {
	var elem=document.getElementById('langChangeName'), lang, refs=OLDLang.references, view;
	var i;
  lang=pullLangInfo('langChange');
	if (lang.name == '') {
		elem.value += 'needs value';
		elem.focus();
		return;
	};
	if (lang.code.length<1) {
		elem.value += ' at least one code grammar';
		elem.focus();
		return;
	};
  OLDLang.references=[];
  removeLanguageObj(OLDLang);
	for (i=0; i<lang.code.length; i++) {
		view=lang.code[i].defView;
		if (view.langDefs.indexOf(lang)<0)
			view.langDefs[view.langDefs.length]=lang;
	};
	for (i=0; i<lang.decode.length; i++) {
		view=lang.decode[i].defView;
		if (view.langDefs.indexOf(lang)<0)
			view.langDefs[view.langDefs.length]=lang;
	};
	for (i=0; i<refs.length; i++) {
		view=refs[i];
		view.language=lang;
		view.references[view.references.length]=view;
	};
	LoLs.languages[LoLs.languages.length]=lang;
	LoLs.languages[lang.name]=lang;
	relaceLangRibbon(); 
  popUp(id);  
	if (LoLs.currentView)
		document.getElementById(LoLs.currentView.id).editor.focus();   
}