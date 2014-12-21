// events
window.onbeforeunload = function() {
  if (LoLs.changed) {
    return "By leaving this page, any unsaved changes will be lost.";
  };
}

//functions
function setupPage() { 
  // TODO: load Getting Started as general workspace
  loadGettingStarted();
}

function addRemoveLanguage(id) {
  // TODO: add and/or remove languages to/from language ribbon
  alert("add and/or remove languages to/from language ribbon");  
}

function openWorkspace(id) {
  // TODO: open existing or create new workspace
  alert("Open Existing Workspace or Create New Workspace");
}

function saveWorkspace(id) {
  // TODO: save current workspace
  alert("Save Current Workspace");
}

function refreshAll(id) {
  var button, clear=true;
  for (var i=0; i < LoLs.viewOrder.length; i++) {
    refreshView(LoLs.viewOrder[i].name);
    if (LoLs.viewOrder[i].changed)
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
function createView(name,lang,gutter,readOnly,value,height,source) {
  var e, view, id=genLocalId(name);
  view=createACEeditor(name,id,height,gutter,readOnly,value);
  LoLs.views[name]={
  	name: name,
    id: id,
  	editorProperties: {},   // reserved for other than ACE editor support
    changed: false,					// undefined (updating), true, false
    changeFn: function(e) {
      viewChanged(this[0].myView);
    },
    focusFn:function() {
      var langButton;
      if (LoLs.currentLanguage != undefined) {
        langButton=document.getElementById(LoLs.currentLanguage.name+"Lang");
        langButton.style.color = "white";
      }
      LoLs.currentView=this[0].myView;
      LoLs.currentLanguage=LoLs.currentView.language;
      langButton=document.getElementById(LoLs.currentLanguage.name+"Lang");
      langButton.style.color = "red";
    },
    blurFn:function() {
    },
// TODO: use object rather than name
    language: lang,
// TODO: use object rather than name
    inputView: source,   // point to this views or another view 
    									   // view displays input or output
    contents: undefined,
// TODO: use object rather than name
    references: [],      // Set of Views which use contents as input 
    langDefs:[]};        // Set of Languages that View defines  
// TODO: support inserting view
  LoLs.viewOrder[LoLs.viewOrder.length] = LoLs.views[name];
  LoLs.views[name].changeFn.myView=LoLs.views[name];
  view.on('change', LoLs.views[name].changeFn);
  LoLs.views[name].focusFn.myView=LoLs.views[name];
  view.on('focus', LoLs.views[name].focusFn);
  LoLs.views[name].blurFn.myView=LoLs.views[name];
  view.on('blur', LoLs.views[name].blurFn);
  return view;  
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
// TODO: eliminate duplicate refreshing of views
// TODO: bidirectional view dependency support A updates B & B updates A
    if (lolsView.changed==undefined)
  	  return lolsView.contents;
    lolsView.changed=undefined;
   lang=lolsView.language.code;
   for (var i=0; i <lang.length; i++) {
    	if (lang[i].inputView !== undefined)
    		refreshView(lang[i].inputView.name);
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
    cleared=true;
    for (var i=0; i <LoLs.viewOrder.length; i++) {
    	if (LoLs.viewOrder[i].changed)
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
  langObj.references=langObj.references.filter(function(x) {x!==LoLs.currentView});
  langObj=LoLs.languages[lang];
  langObj.references=langObj.references.filter(function(x) {x!==LoLs.currentView});
  langObj.references[langObj.references.length]=LoLs.currentView;    
  LoLs.currentView.language=langObj;
  refreshView(LoLs.currentView.name);
  document.getElementById(LoLs.currentView.id).editor.focus();
}