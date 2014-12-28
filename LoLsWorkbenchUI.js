// events
window.onbeforeunload = function() {
  if (LoLs.changed) {
    return "By leaving this page, any unsaved changes will be lost.";
  };
}

//functions
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
function setupPage() { 
  LoLs=getWorkspace("Getting Started");
	linkWorkspace(LoLs);
	showWorkspace(LoLs);
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

function openWorkspace(id) {
  // TODO: open existing or create new workspace
	LoLs=EmptyWorkspace; // copy???
	linkWorkspace(LoLs);
	showWorkspace(LoLs);

}

function getWorkspace(fn) {
// TODO: load getting started as general workspace
	if (fn == "Getting Started") {
	  return GettingStarted;
	};
  // TODO: get existing workspace
  alert("Can't Get Existing Workspace " + fn);	
}

function linkWorkspace(w) {
  var lang, view, refs, defs;
  w.changed=false;
  for (var i=0; i<w.languages.length; i++) {
  	lang=w.languages[i];
  	w.languages[lang.name]=lang;
  	lang.references=[];
  	for (var j=0; j<lang.code.length; j++) {
  	  lang.code[j].language=lang;
  	  if (lang.code[j].defView === undefined)
  	    lang.code[j].rules=eval(lang.code[j].name);
  	};
  	for (var j=0; j<lang.decode.length; j++) {
  	  lang.decode[j].language=lang;
  	  if (lang.decode[j].defView === undefined)
  	    lang.decode[j].rules=eval(lang.decode[j].name);
  	};
	};
  for (var i=0; i<w.views.length; i++) {
  	view=w.views[i];
    w.views[view.name]=view;
    view.id=undefined;   																				// create on display
    view.language=w.languages[view.language];
    view.language.references[view.language.references.length]=view;
    view.references=[];
    view.langDefs=[];
    view.grammarDefs=[];
  };
  for (var i=0; i<w.views.length; i++) {
  	view=w.views[i];
    view.inputView=w.views[view.inputView];
    if (view.inputView !== view) {
      refs=view.inputView.references;
      refs[refs.length]=view;
    };
  };
  for (var i=0; i<w.languages.length; i++) {
  	lang=w.languages[i];
  	for (var j=0; j<lang.code.length; j++) {
  	  if (lang.code[j].defView!==undefined) {
  	  	view=w.views[lang.code[j].defView];
  	  	lang.code[j].defView=view;
				defs=view.grammarDefs;
				defs[defs.length]=lang.code[j];
				if (view.langDefs.indexOf(lang)<0)
				  view.langDefs[view.langDefs.length]=lang;
  	  }
  	};
  	for (var j=0; j<lang.decode.length; j++) {
  	  if (lang.decode[j].defView!==undefined) {
  	  	view=w.views[lang.decode[j].defView];
  	  	lang.decode[j].defView=view;
				defs=view.grammarDefs;
				defs[defs.length]=lang.decode[j];
				if (view.langDefs.indexOf(lang)<0)
				  view.langDefs[view.langDefs.length]=lang;
  	  }
  	};
	};
  w.currentView=w.views[w.currentView];
  w.currentLanguage=w.currentView.language;
  
  return w;
};

function relaceLangRibbon() { 
  var i, ribbon=[], str, doc, node;
  for (i=0; i<LoLs.languages.length; i++) {
  	ribbon.push(LoLs.languages[i].name);
  };
  ribbon.sort();
  str='';
  for (i=0; i<ribbon.length; i++) {
		str=str + '<button id="' + ribbon[i] + 'Lang" type="button"' +
			' onClick="setLanguage(\'' + ribbon[i] + '\')">' +
			 ribbon[i] + '</button> ';
	};
  doc=document.getElementById("LangRibbon");
  for (i=doc.childNodes.length-1; i>1; i--) {
  	node=doc.childNodes[i];
  	node.parentNode.removeChild(node);
  };
  doc.insertAdjacentHTML("beforeend", str);
};

function showWorkspace(w) { 
  var startView, view, thisView, nodes, i;
  nodes=document.getElementById('WorkspaceArea').childNodes;
  for (i=nodes.length-1; i>1; i--) {
  	nodes[i].parentNode.removeChild(nodes[i]);
  };
  document.getElementById('WorkspaceName').textContent=w.name+' ';
  relaceLangRibbon();
  for (var i=0; i<w.views.length; i++) {
  	view=w.views[i];
  	view.id=genLocalId(view.name);
    thisView=createACEeditor(view.name,view.id,
    	view.editorProperties.height,
    	view.editorProperties.gutters,
    	view.editorProperties.readOnly,
    	view.contents);
    if (view === w.currentView)
      startView=thisView;

    view.changeFn=function(e) {viewChanged(this[0].myView);};
    view.changeFn.myView=view;
    thisView.on('change', view.changeFn);
    view.focusFn=function() {viewFocus(this[0].myView);};
  	view.focusFn.myView=view;
    thisView.on('focus', view.focusFn);

    view.changed=true;
  };
  refreshAll();
  if (startView)
  	startView.focus(); 
}

function saveWorkspace(id) {
  // TODO: save current workspace
  alert("Save Current Workspace");
}

function refreshAll(id) {
  var button, clear=true;
  for (var i=0; i < LoLs.views.length; i++) {
    refreshView(LoLs.views[i].name);
    if (LoLs.views[i].changed)
    	clear=false;
  }
  if (clear) {
    button=document.getElementById("refreshAll");
    button.style.backgroundColor = "white";
  }
}

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
  
function showOrHide(id, button) {
  var style = document.getElementById(id).style;
  if (style.visibility === "hidden") {
  	style.display = "block";
  	style.visibility = "visible";
  	button.title = "collapse";
  	button.value = "-";
  } else {
  	style.display = "none";
  	style.visibility = "hidden";
  	button.title = "expand";
  	button.value = "+";
  }
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

function viewChanged(view) {
  var button;
	if (view.changed || view.changed==undefined)
		return;
	view.changed=true;
	LoLs.changed=true;
	button=document.getElementById(view.id+"Refresh");    
	button.style.backgroundColor = "yellow";
	for (var i=0;i<view.references.length;i++) {
		viewChanged(view.references[i]);
	};
	for (var i=0;i<view.langDefs.length;i++) {
		languageChanged(view.langDefs[i]);
	};
	button=document.getElementById("refreshAll");
	button.style.backgroundColor = "yellow";
}

function viewFocus(view) {
	var langButton;
	if (LoLs.currentLanguage != undefined) {
		langButton=document.getElementById(LoLs.currentLanguage.name+"Lang");
		langButton.style.color = "white";
	}
	LoLs.currentView=view;
	LoLs.currentLanguage=LoLs.currentView.language;
	langButton=document.getElementById(LoLs.currentLanguage.name+"Lang");
	langButton.style.color = "red";
}

function languageChanged(lang) {
  for (var i=0; i<lang.references.length; i++) {
    viewChanged(lang.references[i]);
  }
}

function createACEeditor(name,id,height,gutter,readOnly,value,beforeId) {
  var e, frame, marker="afterend";
  if (beforeId===undefined) {
  	beforeId="WorkspaceArea";
  	marker="beforeend";
  };
  document.getElementById(beforeId).insertAdjacentHTML(marker,
	'<div class="LoLsView" name="'+name+'">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-" ' +
	'		onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <scan id="'+id+'ViewName">'+ name +' </scan><i>view</i>' +
	'	  <button type="button" title="open view" onClick="openView(this)">' +
	'		<img src="open-view.png" alt="Open View">' +
	'	  </button>' +
	'	  <button type="button" title="close view" onClick="closeView(this)">' +
	'		<img src="close.gif" alt="Close View">' +
	'	  </button>' +
	'	  <button id="'+id+'Refresh" type="button" title="refresh"' + 
	' onClick="refreshView(\''+name+'\')">'+
	'		<img src="refresh.png" alt="Refresh View">' +
	'	  </button>' +
	'	</div>' +
	'	<div id="'+ id +'" class="LoLsViewEditor">' +
	'	</div>' +
	'</div>'); 
	e=document.getElementById(id);
	e.style.position="relative"; 
	e.style.height=height;
  frame=ace.edit(id);
  frame.getSession().setMode('ace/mode/textmate');
  frame.renderer.setShowGutter(gutter);
  frame.setValue(value);
  frame.setReadOnly(readOnly);
  frame.clearSelection();
  e.editor=frame;
  return frame;  
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

function refreshView(viewName) {
  var lolsView, editor, source, lang, langViews, button, cleared;
  try {
    lolsView=LoLs.views[viewName];
// TODO: bidirectional view dependency support A updates B & B updates A
    if (lolsView.changed==undefined)
  	  return lolsView.contents;
    lolsView.changed=undefined;
   lang=lolsView.language.code;
   for (var i=0; i <lang.length; i++) {
    	if (lang[i].defView !== undefined)
    		refreshView(lang[i].defView.name);
    };
    editor=document.getElementById(lolsView.id).editor;
    if (lolsView.inputView === lolsView) {
      source=editor.getValue();
    } else {
      source=refreshView(lolsView.inputView.name);
    };
    lolsView.contents=applyLanguage(lang,source);
    if (lolsView.inputView !== lolsView) {
      editor.setValue("" + lolsView.contents);
    }
    lolsView.changed=false;
    button=document.getElementById(lolsView.id+"Refresh");    
    button.style.backgroundColor = "white";
    for (var i=0; i<lolsView.grammarDefs.length; i++) {
    	lolsView.grammarDefs[i].rules=eval(lolsView.grammarDefs[i].name);
    };
    cleared=true;
    for (var i=0; i <LoLs.views.length; i++) {
    	if (LoLs.views[i].changed)
    		cleared=false;
    };
    if (cleared) {
      button=document.getElementById("refreshAll");
      button.style.backgroundColor = "white";
    };
	  return lolsView.contents;
  } catch (e) {
    if (e.errorPos != undefined) {
	    insertMessage(editor, e.errorPos, " Unknown-->");
	  } else {
      alert("" + viewName + " error at unknown position\n\n" + e);
	  }
	  if (lolsView.changed==undefined)
	    lolsView.changed=true;
    return lolsView.contents;
  }
}
// TODO: eliminate global for language change
var OLDLang;
function setLanguage(lang) {
  var i, langObj, elem, rows, str, inputOption, view;
  if (event.altKey) {
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
  	return;
  };
  langObj=LoLs.currentView.language;
  langObj.references=langObj.references.filter(function(x) {return x!==LoLs.currentView});
  langObj=LoLs.languages[lang];
  langObj.references=langObj.references.filter(function(x) {return x!==LoLs.currentView});
  langObj.references[langObj.references.length]=LoLs.currentView;    
  LoLs.currentView.language=langObj;
  refreshView(LoLs.currentView.name);
  document.getElementById(LoLs.currentView.id).editor.focus();
}