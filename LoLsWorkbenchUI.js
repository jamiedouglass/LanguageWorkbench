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
		t = document.getElementById(form+"CodeGrammar");
  }
  else {
		t = document.getElementById(form+"DecodeGrammar");
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
	var i, elem=document.getElementById(id+'Name'), checked, table, rows, lang, g;
	if (elem.value == '') {
		elem.value += 'needs value';
		elem.focus();
		return;
	};
	if (LoLs.languages[elem.value] !== undefined) {
		elem.value += ' already defined';
		elem.focus();
		return;
	};
	checked=document.getElementById('langAddOutput').checked;
	table=document.getElementById('addCodeGrammar');
	rows=table.getElementsByTagName("tr");
	lang={name: elem.value,
		code: [],
		decode: [],
		references: []};
	if (rows.length<2) {
		elem.value += ' at least one code grammar';
		elem.focus();
		return;
	};
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
		if (g.defView !== "") {
			g.defView=LoLs.views[g.defView];
			if (g.defView.langDefs.indexOf(lang)<0)
				g.defView.langDefs[g.defView.langDefs.length]=lang;
		} else {
			g.defView=undefined;
		};	 
	};
	table=document.getElementById('addDecodeGrammar');
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
		if (g.defView !== "") {
			g.defView=LoLs.views[g.defView];
			if (g.defView.langDefs.indexOf(lang)<0)
				g.defView.langDefs[g.defView.langDefs.length]=lang;
		} else {
			g.defView=undefined;
		};	 
	};
	if (checked)
		lang.code[lang.code.length-1].evalResults=true;
	LoLs.languages[LoLs.languages.length]=lang;
	LoLs.languages[lang.name]=lang;
	relaceLangRibbon(); 
  popUp(id);  
	if (LoLs.currentView)
		document.getElementById(LoLs.currentView.id).editor.focus(); 
}

function removeLanguage(id) {
	var form=document.getElementById(id);
  // TODO: remove language from language ribbon
  alert("remove language from language ribbon");  
  popUp(id);  
}

function changeLanguage(id) {
	var form=document.getElementById(id);
  // TODO: change language on language ribbon
  alert("change language on language ribbon");
  popUp(id);  
}

function openWorkspace(id) {
  // TODO: open existing or create new workspace
  alert("Open Existing Workspace or Create New Workspace");
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
			' onClick="setLanguage(\'' + ribbon[i] + 
			'\')" ondblclick="popUp(\'langChange\')">' +
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
  var startView, view, thisView;
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

function openView(id) {
  // TODO: open a copy of this view
  alert("Open a Copy of This View");
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

function createACEeditor(name,id,height,gutter,readOnly,value) {
  var e, frame;
  document.getElementById("WorkspaceArea").insertAdjacentHTML("beforeend",
	'<div class="LoLsView">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-" ' +
	'		onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <scan>'+ name +' </scan><i>view</i>' +
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
  // TODO: close this view in current workspace
  alert("Close This View");
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

function setLanguage(lang) {
  var langObj;
  langObj=LoLs.currentView.language;
  langObj.references=langObj.references.filter(function(x) {return x!==LoLs.currentView});
  langObj=LoLs.languages[lang];
  langObj.references=langObj.references.filter(function(x) {return x!==LoLs.currentView});
  langObj.references[langObj.references.length]=LoLs.currentView;    
  LoLs.currentView.language=langObj;
  refreshView(LoLs.currentView.name);
  document.getElementById(LoLs.currentView.id).editor.focus();
}