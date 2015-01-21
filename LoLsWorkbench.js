// events
window.onbeforeunload = function() {
  if (LoLs.changed) 
    return "By leaving this page, any unsaved changes will be lost.";
}

//functions
function createACE(id,height,gutters,readOnly,value) {
  var e=document.getElementById(id), f=ace.edit(id);
	e.style.position="relative"; 
	e.style.height=height;
  f.getSession().setMode('ace/mode/textmate');
  f.renderer.setShowGutter(gutters);
  f.setValue(value);
  f.setReadOnly(readOnly);
  f.clearSelection();
  e.editor=f;
  return f;  
}
function createEditor(view) {
	var e=view.editor;
	if (e.name=="ACE") 
		return createACE(view.id,e.height,e.gutters,e.readOnly,e.contents);
	return createACE(view.id,e.height,e.gutters,e.readOnly,e.contents);
}
function createLangRibbon(names) { 
  var e, i, n, str;
  // TODO: create single element to hold languages
  e=document.getElementById("LangRibbon");
  for (i=e.childNodes.length-1; i>1; i--) {
  	n=e.childNodes[i];
  	n.parentNode.removeChild(n);
  };
  
  // TODO: ids need to not have spaces etc.
  str='';
  for (i=0; i<names.length; i++) {
		str+='<button id="' + names[i] + 'Lang" type="button"' +
			' onClick="setLanguage(\'' + names[i] + '\')">' +
			 names[i] + '</button> ';
	};
  e.insertAdjacentHTML("beforeend", str);
};
function createView(view,beforeId) {
  var name=view.name, id=genLocalId(name), m="afterend", e;
  view.id=id;
  if (beforeId===undefined) {
  	beforeId="WorkspaceArea";
  	m="beforeend";
  };
  document.getElementById(beforeId).insertAdjacentHTML(m,
	'<div class="LoLsView" name="'+name+'">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-" ' +
	'			onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <scan id="'+id+'ViewName">'+ name +' </scan><i>view</i>' +
	'	  <button type="button" title="open view" onClick="openView(this)">' +
	'			<img src="images/open-view.png" alt="Open View">' +
	'	  </button>' +
	'	  <button type="button" title="close view" onClick="closeView(this)">' +
	'			<img src="images/close.gif" alt="Close View">' +
	'	  </button>' +
	'	  <button id="'+id+'Refresh" type="button" title="refresh"' + 
	' 		onClick="refreshView(\''+name+'\')">'+
	'			<img src="images/refresh.png" alt="Refresh View">' +
	'	  </button>' +
	'	</div>' +
	'	<div id="'+ id +'" class="LoLsViewEditor">' +
	'	</div>' +
	'</div>'); 
	e=createEditor(view);
	e.on('change',(function(x) {return function() {viewChanged(x)}})(view));
  e.on('focus',(function(x) {return function() {viewFocus(x)}})(view));
}
function openWorkspace(url) {
	var i, e;
  if (LoLs !== undefined && LoLs.unsaved) {
    if (!confirm("Abandon the current workspace changes?"))
    	return;
  };
	// TODO: make a single element for deleting views
  e=document.getElementById('WorkspaceArea').childNodes;
  for (i=e.length-1; i>1; i--) {
  	e[i].parentNode.removeChild(e[i]);
  };
  
  LoLs=Workspace(url);
  document.getElementById('WorkspaceName').textContent=LoLs.name+' ';
  createLangRibbon(LoLs.languageNames());
  for (i=0; i<LoLs.views.length; i++) 
  	createView(LoLs.views[i]);
  // TODO: load compiled languages without refreshing
  LoLs.refreshAll(true);
	document.getElementById(LoLs.currentView.id).editor.focus();
}
function refreshAll() {
  LoLs.refreshAll();
  if (!LoLs.refreshNeeded())
    document.getElementById("refreshAll").style.backgroundColor = "white";
}
function refreshComplete(view) {
  var e=document.getElementById(view.id).editor;
  e.setValue("" + view.viewContents());
	e.clearSelection();	
	view.needsRefresh=false;
	e=document.getElementById(view.id+"Refresh");    
	e.style.backgroundColor = "white";
	if (!LoLs.refreshNeeded()) {
		e=document.getElementById("refreshAll");
		e.style.backgroundColor = "white";
	}
}
function refreshView(view) {
  LoLs.views[view].refresh();
}
function saveWorkspace(id) {
  // TODO: save current workspace
  alert("Save Current Workspace");
}
function setupPage() { 
	setUpForms();
	// TODO: replace temporary url for getting starting 
  openWorkspace("getting-started.ws");
}
function showOrHide(id, button) {
  var s = document.getElementById(id).style;
  if (s.visibility === "hidden") {
  	s.display = "block";
  	s.visibility = "visible";
  	button.title = "collapse";
  	button.value = "-";
  } else {
  	s.display = "none";
  	s.visibility = "hidden";
  	button.title = "expand";
  	button.value = "+";
  }
}
function updateViewContents(view) {
  var e=document.getElementById(view.id).editor;
  return e.getValue();
}
function viewChanged(view) {
	view.changed();
}
function viewFocus(view) {
	var b;
	if (LoLs.currentLanguage != undefined) {
		b=document.getElementById(LoLs.currentLanguage.name+"Lang");
		b.style.color = "white";
	}
	LoLs.currentView=view;
	LoLs.currentLanguage=LoLs.currentView.language;
	b=document.getElementById(LoLs.currentLanguage.name+"Lang");
	b.style.color = "red";
}
function viewHasChanged(view) {
  var e=document.getElementById(view.id+"Refresh");    
	e.style.backgroundColor = "yellow";
	e=document.getElementById("refreshAll");
	e.style.backgroundColor = "yellow";
}

// Editor support
function indexToPosition(doc, index) {
  var lines = doc.getAllLines(),
    newLineLen = doc.getNewLineCharacter().length,
    column = index;
  for (var row = 0; column >= lines[row].length + newLineLen; row ++) {
    column -= lines[row].length + newLineLen;
  }
  return {row:row, column:column};
}
function insertMessage(editor, index, message) {
  var doc = editor.getSession().getDocument(),
    pos = indexToPosition(doc, index);
  doc.insert(pos, message);
  editor.find(message, {backwards:true}, false);
  editor.focus();
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
  popUp('openView');  
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
  popUp('openView');
  if (OLDView.language!==lang) {
  	OLDView.language=lang;
  	reviewView(OLDView.name);
  };
	e.focus(); 
}

// TODO: eliminate global
var OLDView;
function openView(here) {
	var i, view, name=here.parentNode.childNodes[3].textContent, str='', lang, elem, list;
	view=LoLs.views[name.substring(0,name.length-1)];
	OLDView=view;
	document.getElementById('openViewName').value=view.name;
	document.getElementById('openViewInput').value=view.inputView.name;
	for (i=0; i<LoLs.languages.length; i++) {
		lang=LoLs.languages[i].name;
		str+='<option value="'+lang+'">'+lang+'</option>';
	};
	elem=document.getElementById('openViewLang');
	list=elem.childNodes;
	for (i=list.length-1; i>0; i--) {
		list[i].parentNode.removeChild(list[i]);
	};
	elem.insertAdjacentHTML('beforeend',str);
	elem.value=OLDView.language.name;
	document.getElementById('openViewHeight').value=
		view.editorProperties.height.substring(0,view.editorProperties.height.length-2);
	document.getElementById('openViewReadonly').checked=view.editorProperties.readOnly;
	document.getElementById('openViewGutters').checked=view.editorProperties.gutters;
  popUp('openView');
}
function closeView(id) {
	var i, str, view, elem=id.parentNode.parentNode, found;
	if (document.getElementById("WorkspaceArea").childNodes.length<=4) {
		alert("Workspace must have at least one view");
		return;
	};
	view=LoLs.views[elem.getAttribute("name")];
	if (view.references.length>0) {
	  str="view is input to ";
	  for (i=0; i<view.references.length; i++) {
	  	str +=view.references[i].name+' ';
	  };
		alert(str);
		return;
	};
	for (i=0; i<view.grammarDefs.length; i++) {
		view.grammarDefs[i].defView=undefined;
	};
	view.language.references=view.language.references.filter(function(x) {return x!==view});
	if (view.inputView !== view)
		view.inputView.references=view.inputView.references.filter(function(x) {return x!==view});
	LoLs.views=LoLs.views.filter(function(x) { return x!==view});
	for (i=0; i<LoLs.views.length; i++) {
		LoLs.views[LoLs.views[i].name]=LoLs.views[i];
	};
	elem.parentNode.removeChild(elem);	
}
// TODO: eliminate global for language change
var OLDLang;
function setLanguage(lang) {
  if (event.altKey) 
    return languageUpdateForm(lang);
  LoLs.currentView.setLanguage(lang);
  LoLs.currentView.changed();
  LoLs.currentView.refresh();
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
	popUp('langChange');
}