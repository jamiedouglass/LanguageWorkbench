function setupForms() {
	var e=document.getElementById('WorkbenchForms');
	setupLanguageForm(e);
	setupWorkspaceForm(e);
	setupViewForm(e);
}

function setupLanguageForm(elem) {
	var str='<div id="langForm">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'		<h3>Language</h3>' +
	'		<button id="deleteLang" type="button" title="delete language"' +
	'			onClick="removeLanguage()">' +
	'		  Delete Language' +
	'		</button>' +
	'		<br>' +
	'		Language Name:' +
	'		<input type="text" id="langFormName" value="Unnamed" onchange="checkButtons()">' +
	'		<br>' +
	'		<input type="checkbox" id="langFormOutput">Meta Language' +
	'		<table id="langFormCode">' +
	'			<tr>' +
	'				<th>Grammar</th> <th>Start Rule</th> <th>Input</th> <th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<table id="langFormDecode">' +
	'			<tr>' +
	'				<th>Decode<br>Grammar</th> <th>Start Rule</th> <th>Input</th> <th>View</th>' +
	'			</tr>' +
	'		</table>' +
	'		<fieldset id="grammarToLang">' +
	'			<legend>Grammar</legend>' +
	'		  <button type="button" title="add grammar"' +
	'		    onClick="addGrammar(\'langForm\',\'grammarToLang\')">+</button>' +
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
	'		<button type="button" title="cancel" onClick="hideForm(\'langForm\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button id="addLang" type="button" title="add language"' +
	' 		onClick="addLanguage()">' +
	'			Add Language' +
	'		</button>' +
	'		<button id="updateLang" type="button" title="update language"' +
	' 		onClick="updateLanguage()">' +
	'			Update Language' +
	'		</button>' +
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);
}
function setupWorkspaceForm(elem) {
	var str='<div id="OpenWorkspace">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'		<h3>Open Workspace</h3>' +
	'   <input id="localFile" type="file" onchange="enableButton(\'openFormButton\')">' +
	'		<br><br><hr>' +
	'		<button type="button" title="cancel" onClick="hideForm(\'OpenWorkspace\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" title="new workspace" onClick="openNew()">' +
	'			New' +
	'		</button>'+
	'		<button id="openFormButton" type="button" title="open workspace"'+
	'     onClick="openFile()" disabled>' +
	'			Open' +
	'		</button>'+
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);	
}
function setupViewForm(elem) {
var str='<div id="openView">' +
	'<div>' +
	'	<form>' +
	'		<h3>View</h3>' +
	'		Name:' +
	'		<input type="text" id="openViewName" value="Unnamed">' +
	'		<br>' +
	'		Input View:' +
	'		<input type="text" id="openViewInput" value="">' +
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
	'		<button type="button" title="cancel" onClick="hideForm(\'openView\')">' +
	'			Cancel' +
	'		</button>' +
	'		<button type="button" id="updateViewButton" title="update view" onClick="updateView()">' +
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
function enableButton(id) {
	var e=document.getElementById(id);
	e.disabled=false;
}
function disableButton(id) {
	var e=document.getElementById(id);
	e.disabled=true;
}
function showForm(id) {
	var el = document.getElementById(id);
	el.style.visibility = "visible";
}
function hideForm(id) {
	var el = document.getElementById(id);
	el.style.visibility = "hidden";
}
function addGrammar(form,gid) {
  var i, str, t, elem = [], grammarData=[],
  		g=document.getElementById(gid);
  for (i=0; i<g.elements.length ;i++) {
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
    }
  } else {
		elem["name"].value += " name required";
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
		elem["startRule"].value += " start rule required";
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
function pullLangInfo() {
	var info;
	function pullGrammarInfo(tableName) {
		var i, r, info=[],
				table=document.getElementById(tableName),
				rows=table.getElementsByTagName("tr");
		for (i=1; i<rows.length; i++) {
			r=rows[i].getElementsByTagName("td");
			info[info.length]=
				{name: r[0].textContent,
			 	 startRule: r[1].textContent,
			 	 makeList: (r[2].textContent=="Object"),
			 	 defView: r[3].textContent};
		}
		return info;
	}
	info={name: document.getElementById('langFormName').value,
				meta: document.getElementById('langFormOutput').checked};
	info.code=pullGrammarInfo('langFormCode');
	info.decode=pullGrammarInfo('langFormDecode');	
	return info;
}
function addLanguage() {
	var lang;	
	try {
		lang=pullLangInfo();
		if (lang.code.length<1) 
			throw ' at least one code grammar';
		Language(lang,LoLs);
	} catch (e) {
		alert(e);
		return;
	}
	createLangRibbon(LoLs.languageNames());
		document.getElementById(id+'InputView').name=view.inputView.name;
	if (view.inputView===view)
		document.getElementById(id+'InputView').hidden=true; 
 
  hideForm('langForm');  
	if (LoLs.currentView !== undefined)
		LoLs.currentView.focus(true); 
}
function removeLanguage() {
	var name;
	try {
		name=document.getElementById('langFormName').value;
		LoLs.removeLanguage(name);
	} catch (e) {
		alert(e);
		return;
	}
	createLangRibbon(LoLs.languageNames());
  hideForm('langForm');  
	if (LoLs.currentView!==undefined)
		LoLs.currentView.focus(true); 
}
function updateLanguage() {
	var oldName, lang;	
	try {
		oldName=document.getElementById('langForm').name;
		lang=pullLangInfo();
		if (lang.code.length<1) 
			throw ' at least one code grammar';
		LoLs.languages[oldName].deserialize(lang);
	} catch (e) {
		alert(e);
		return;
	}
	createLangRibbon(LoLs.languageNames()); 
  hideForm('langForm');  
	if (LoLs.currentView !== undefined)
		LoLs.currentView.focus(true); 
}
function languageForm(name) {
  var i, lang, elem, rows, str, inputOption, view;
  function pushLangInfo(lang) {
  	var i;
  	function pushGrammarInfo(grammars,tableName) {
			var i, str='', dataType, defView,
					table=document.getElementById(tableName),
					rows=table.getElementsByTagName("tr");
			for (i=rows.length-1; i>0; i--) 
					rows[i].parentNode.removeChild(rows[i]);
			for (i=0; i<grammars.length; i++) {
				dataType=(grammars[i].makeList) ? "Object" : "List";
				defView=(grammars[i].defView===undefined) ? '' : grammars[i].defView.name;
				str+='<tr><td>'+grammars[i].name+'</td>'+
								 '<td>'+grammars[i].startRule+'</td>'+		
								 '<td>'+dataType+'</td>'+		
								 '<td>'+defView+'</td>'+		
								'<td><button type="button" title="delete grammar"'+
								' onclick="deleteGrammar(this)">X</button></td></tr>';
			}
			table.insertAdjacentHTML("beforeend", str);
		}
  	document.getElementById('langFormName').value=lang.name;
  	document.getElementById('langFormOutput').checked=lang.meta;
  	pushGrammarInfo(lang.code,'langFormCode');
  	pushGrammarInfo(lang.decode,'langFormDecode');
  }
	elem=document.getElementById('langForm');
  if (name!==undefined) {
		lang=LoLs.languages[name];
		elem.name=lang.name;
		pushLangInfo(lang);
	}
	checkButtons();
	showForm('langForm');
}
function checkButtons() {
	var lang, elem;
	lang=LoLs.languages[document.getElementById('langFormName').value];
	if (lang!==undefined) {
		elem=document.getElementById('deleteLang');
		elem.disabled=lang.references.length>0;
		document.getElementById('addLang').disabled=true;
		document.getElementById('updateLang').disabled=false;
	}
	else {
		document.getElementById('deleteLang').disabled=true;
		document.getElementById('addLang').disabled=false;
		document.getElementById('updateLang').disabled=true;
	}
}
function openWorkspaceForm() {
	if (LoLs !== undefined && LoLs.unsaved) {
    if (!confirm("Abandon the current workspace changes?"))
    	return;
  };	
	showForm('OpenWorkspace');
}
function openFile() {
	var f=document.getElementById("localFile").files[0], reader=new FileReader();
	if (f === undefined || f === null) {
		alert("Must select file to open");
		return;
	}
	reader.onloadend = function (evt) {
		var info;
		try {
			info=JSON.parse(evt.target.result);
    	openWorkspace(info);
		} catch (e) {
			alert("Error in file: "+e);
			return;
		}
    hideForm('OpenWorkspace');
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
	reader.onerror = errorHandler;
  reader.readAsText(f);
}
function openNew() {
	openWorkspace();
	hideForm('OpenWorkspace');
}
function addFirstView() {
	var i,lang, elem, list, str='';
	// TODO: position form visible on screen
	document.getElementById('openView').name=undefined;
	list=LoLs.languageNames();
	for (i=0; i<list.length; i++) {
		lang=list[i];
		str+='<option value="'+lang+'">'+lang+'</option>';
	};
	elem=document.getElementById('openViewLang');
	elem.innerHTML="";
	elem.insertAdjacentHTML('beforeend',str);
	elem.value=LoLs.languages[0].name;
	disableButton('updateViewButton');
  showForm('openView');
}
function openView(id) {
	var i,lang, elem, list, str='', name, view;
	name=document.getElementById(id).getAttribute("name");
	view=LoLs.views[name];
	// TODO: position form visible on screen
	document.getElementById('openView').name=view.name;
	document.getElementById('openViewName').value=view.name;
	document.getElementById('openViewInput').value=view.inputView.name;
	list=LoLs.languageNames();
	for (i=0; i<list.length; i++) {
		lang=list[i];
		str+='<option value="'+lang+'">'+lang+'</option>';
	};
	elem=document.getElementById('openViewLang');
	elem.innerHTML="";
	elem.insertAdjacentHTML('beforeend',str);
	elem.value=view.language.name;
	str=view.editor.height.substring(0,view.editor.height.length-2);
	document.getElementById('openViewHeight').value=str;
	document.getElementById('openViewReadonly').checked=view.editor.readOnly;
	document.getElementById('openViewGutters').checked=view.editor.gutters;
	enableButton('updateViewButton');  
  showForm('openView');
}
function addView() {
	var view, beforeView, value, n;
	try {
		beforeView=document.getElementById('openView').name;
		if (beforeView!==undefined)
			beforeView=LoLs.views[beforeView];
		value=document.getElementById('openViewHeight').value;
		n=Number(value);
		if (Math.round(n)!=n)
			throw "height must be a whole number.";
		if (n<10 || n>1000)
			throw "view height must be 10 to 1000.";
		view= {
			name: document.getElementById('openViewName').value,
			editor: 
				{name: "ACE", 
				 height: value+"px", 
				 gutters: document.getElementById('openViewGutters').checked, 
				 readOnly: document.getElementById('openViewReadonly').checked},   				 
			 language: document.getElementById('openViewLang').value,
			 inputView: document.getElementById('openViewInput').value};
		if (beforeView===undefined) {
			view=View(view,LoLs,'');
			createView(view,'firstView');
		}
		else {
			view=View(view,LoLs,beforeView);
			createView(view,beforeView.id);
		}
		view.focus(true);
	} 
	catch (e) {
		alert(e);
		return;
	} 
  hideForm('openView');  
}
function updateView() {
	var oldName, value, n, view;
	try {
		oldName=document.getElementById('openView').name;
		value=document.getElementById('openViewHeight').value;
		n=Number(value);
		if (Math.round(n)!=n)
			throw "height must be a whole number.";
		if (n<10 || n>1000)
			throw "view height must be 10 to 1000.";
		view= {
			name: document.getElementById('openViewName').value,
			editor: 
				{name: "ACE", 
				 height: value+"px", 
				 gutters: document.getElementById('openViewGutters').checked, 
				 readOnly: document.getElementById('openViewReadonly').checked},   				 
			 language: document.getElementById('openViewLang').value,
			 inputView: document.getElementById('openViewInput').value};
		view=LoLs.views[oldName].deserialize(view);
		view.focus(true);
	} 
	catch (e) {
		alert(e);
		return;
	} 
  hideForm('openView');  
}