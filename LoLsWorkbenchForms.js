function setupForms() {
	var e=document.getElementById('WorkbenchForms');
	setupLanguageForm(e);
	setupChangeForm(e);
	setupOpenForm(e);
	setupViewForm(e);
}

function setupLanguageForm(elem) {
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
	'		<button type="button" title="cancel" onClick="top.showHideForm(\'langAdd\')">' +
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
function setupOpenForm(elem) {
	var str='<div id="OpenWorkspace">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'   <input id="localFile" type="file">' +
	'		<br>' +
	'		<button type="button" title="cancel" onClick="showHideForm(\'OpenWorkspace\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" title="new workspace" onClick="openNew()">' +
	'			New' +
	'		</button>'+
	'		<button type="button" title="open workspace" onClick="openFile()">' +
	'			Open' +
	'		</button>'+
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);	
}
function setupChangeForm(elem) {
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
	'		<button type="button" title="cancel" onClick="showHideForm(\'langChange\')">' +
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
function setupViewForm(elem) {
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
	'		<button type="button" title="cancel" onClick="showHideForm(\'openView\')">' +
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
function showHideForm(id) {
	var el = document.getElementById(id);
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
function openForm(id) {
	if (LoLs !== undefined && LoLs.unsaved) {
    if (!confirm("Abandon the current workspace changes?"))
    	return;
  };	
	showHideForm(id);
}
function openFile() {
	var f=document.getElementById("localFile").files[0], r=new FileReader();
	if (f === undefined || f === null) {
		alert("Must select file to open");
		return;
	}
	if (LoLs !== undefined && LoLs.unsaved) {
    if (!confirm("Abandon the current workspace changes?"))
    	return;
  };
	r.onloadend = function (evt) {
    openWorkspace(eval(evt.target.result));
    showHideForm('OpenWorkspace');
  }
  function errorHandler(evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert("File Not Found!");
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert("File is not readable");
                break;
            case evt.target.error.ABORT_ERR:
                break; // noop
            default:
                alert("An error occurred reading this file.");
        };
  }
	r.onerror = errorHandler;
  r.readAsText(f);
}
function openNew() {
	openWorkspace();
	showHideForm('OpenWorkspace');
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
	createLangRibbon(); 
  showHideForm(id);  
	if (LoLs.currentView !== undefined)
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
	createLangRibbon();
  showHideForm(id);  
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
var OLDLang;
function changeLanguage(id) {
	var elem=document.getElementById('langChangeName'), lang, 
		refs=LoLs.currentLanguage.references, view;
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
	createLangRibbon(); 
  showHideForm(id);  
	if (LoLs.currentView)
		document.getElementById(LoLs.currentView.id).editor.focus();   
}
function languageUpdateForm(lang) {
  var i, langObj, elem, rows, str, inputOption, view;
	langObj=LoLs.languages[lang];
	OLDLang=langObj;
	elem=document.getElementById('deleteLanguage');
	elem.disabled=langObj.references.length>0;
	elem=document.getElementById('langChangeName');
	elem.value=langObj.name;
	elem=document.getElementById('langChangeOutput');
	elem.checked=(langObj.code[langObj.code.length-1].evalResults == true);
	elem=document.getElementById('langChangeCode');
	rows=elem.getElementsByTagName("tr");
	for (i=rows.length-1; i>0; i--) {
		rows[i].parentNode.removeChild(rows[i]);
	};
	for (i=0; i<langObj.code.length; i++) {
		if (langObj.code[i].inputIsList) {
			inputOption = "List";
		} else {
			inputOption = "Object";
		};
		view = '';
		if (langObj.code[i].defView!==undefined)
			view=langObj.code[i].defView.name;
		str ='<tr><td>'+langObj.code[i].name+'</td>'+
			 '<td>'+langObj.code[i].startRule+'</td>'+		
			 '<td>'+inputOption+'</td>'+		
			 '<td>'+view+'</td>'+		
			'<td><button type="button" title="delete grammar"'+
			' onclick="deleteGrammar(this)">X</button></td></tr>';
		elem.insertAdjacentHTML("beforeend", str);
	};
	elem=document.getElementById('langChangeDecode');
	rows=elem.getElementsByTagName("tr");
	for (i=rows.length-1; i>0; i--) {
		rows[i].parentNode.removeChild(rows[i]);
	};
	for (i=0; i<langObj.decode.length; i++) {
		if (langObj.decode[i].inputIsList) {
			inputOption = "List";
		} else {
			inputOption = "Object";
		};
		view = '';
		if (langObj.decode[i].defView!==undefined)
			view=langObj.decode[i].defView.name;
		str ='<tr><td>'+langObj.decode[i].name+'</td>'+
			 '<td>'+langObj.decode[i].startRule+'</td>'+		
			 '<td>'+inputOption+'</td>'+		
			 '<td>'+view+'</td>'+		
			'<td><button type="button" title="delete grammar"'+
			' onclick="deleteGrammar(this)">X</button></td></tr>';
		elem.insertAdjacentHTML("beforeend", str);
	};   
	showHideForm('langChange');
}
var OLDView;
function openView(id) {
	var i, v, n=document.getElementById(id).getAttribute("name"), str='', lang, elem, list;
	v=LoLs.views[n];
	OLDView=v;
	document.getElementById('openViewName').value=v.name;
	document.getElementById('openViewInput').value=v.inputView.name;
	list=LoLs.languageNames();
	for (i=0; i<list.length; i++) {
		lang=list[i];
		str+='<option value="'+lang+'">'+lang+'</option>';
	};
	elem=document.getElementById('openViewLang');
	elem.innerHTML="";
	elem.insertAdjacentHTML('beforeend',str);
	elem.value=OLDView.language.name;
	document.getElementById('openViewHeight').value=
		v.editor.height.substring(0,v.editor.height.length-2);
	document.getElementById('openViewReadonly').checked=v.editor.readOnly;
	document.getElementById('openViewGutters').checked=v.editor.gutters;
  showHideForm('openView');
}
function addView() {
	var i, thisView, view, name, value, e, list;
	name=document.getElementById('openViewName').value;
	if (name == undefined || name == "" || LoLs.views[name] !== undefined)
		return;
	value=document.getElementById('openViewHeight').value;
	try {
		e=Number(value);
		if (e<10 || e>1000)
			throw "out of range";
	} 
	catch (e) {
		alert("view height must be 10 to 1000.");
		return;
	}; 
	view= {
		name: name,
		id: genLocalId(name),
	 	editorProperties: 
			{name: "ACE editor", 
			 height: value+"px", 
			 gutters: document.getElementById('openViewGutters').checked, 
			 readOnly: document.getElementById('openViewReadonly').checked},   				 
		 changed: true,
		 language: LoLs.languages[document.getElementById('openViewLang').value],
		 inputView: document.getElementById('openViewInput').value,
		 contents: "",
		 references: [],
		 langDefs: [],
		 grammarDefs: []};
	view.language.references[view.language.references.length]=view;
  if (view.inputView=="" || view.name==view.inputView) {
  	view.inputView=view.name;
  }; 
  view.inputView=LoLs.views[view.inputView];
  if (view.inputView===undefined) {
  	view.inputView=view;
  };
	list=LoLs.views;
	LoLs.views=[];
	for (i=0; i<list.length; i++) {
		LoLs.views[LoLs.views.length]=list[i];
		LoLs.views[list[i].name]=list[i];
		if (list[i]===OLDView) {
			LoLs.views[LoLs.views.length]=view;
			LoLs.views[view.name]=view;	
		};
	};
	// TODO: position dialog box
  thisView=createACEeditor(view.name,view.id,
    view.editorProperties.height,
    view.editorProperties.gutters,
    view.editorProperties.readOnly,
    view.contents,
    OLDView.id);
  view.changeFn=function(e) {viewChanged(this[0].myView);};
  view.changeFn.myView=view;
  thisView.on('change', view.changeFn);
  view.focusFn=function() {viewFocus(this[0].myView);};
  view.focusFn.myView=view;
  thisView.on('focus', view.focusFn);
  view.changed=true;
  refreshView(name);
  thisView.focus(); 
  showHideForm('openView');  
}
function updateView() {
	var name, value, e, lang;
	name=document.getElementById('openViewName').value;
	if (name == undefined || name =="")
		return;
	value=document.getElementById('openViewHeight').value;
	try {
		e=Number(value);
		if (e<10 || e>1000)
			throw "out of range";
	} 
	catch (e) {
		alert("view height must be 10 to 1000.");
		return;
	}; 
  LoLs.views[OLDView.name]=undefined;
  OLDView.name=name;
  LoLs.views[OLDView.name]=OLDView;
  OLDView.inputView=document.getElementById('openViewInput').value;
  if (OLDView.inputView=="" || OLDView.name==OLDView.inputView) {
  	OLDView.inputView=OLDView.name;
  }; 
  OLDView.inputView=LoLs.views[OLDView.inputView];
  if (OLDView.inputView===undefined) {
  	OLDView.inputView=OLDView;
  };
  lang=LoLs.languages[document.getElementById('openViewLang').value];
  OLDView.editorProperties.height=value+"px";
  OLDView.editorProperties.readOnly=document.getElementById('openViewReadonly').checked;
  OLDView.editorProperties.gutters=document.getElementById('openViewGutters').checked;
  e=document.getElementById(OLDView.id);
	e.style.height=OLDView.editorProperties.height;
	e=e.editor;
  e.renderer.setShowGutter(OLDView.editorProperties.gutters);
  e.setReadOnly(OLDView.editorProperties.readOnly);
	document.getElementById(OLDView.id+"ViewName").textContent=OLDView.name+" ";
  showHideForm('openView');
  if (OLDView.language!==lang) {
  	OLDView.language=lang;
  	reviewView(OLDView.name);
  };
	e.focus(); 
}