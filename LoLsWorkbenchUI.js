// events
window.onbeforeunload = function() {
  if (LoLs.changed) {
    return "By leaving this page, any unsaved changes will be lost.";
  };
}

//functions
function setupPage() { 
  // TODO: load Getting Started as general project
  loadGettingStarted();
}

function addRemoveLanguage(id) {
  // TODO: add and/or remove languages to/from language ribbon
  alert("add and/or remove languages to/from language ribbon");  
}

function openProject(id) {
  // TODO: open existing or create new project
  alert("Open Existing Project or Create New Project");
}

function saveProject(id) {
  // TODO: save current project
  alert("Save Current Project");
}

function refreshAll(id) {
  var button;
  for (var i=0; i < LoLs.viewOrder.length; i++) {
    refreshView(LoLs.viewOrder[i]);
  }
  button=document.getElementById("refreshAll");
  button.style.backgroundColor = "white";
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
  view=createACEeditor(name,id, gutter,readOnly,value,height);
// TODO: use View object rather than name
  LoLs.viewOrder[LoLs.viewOrder.length] = name;
  LoLs.views[name]={
  	name: name,
    id: id,
  	editorProperties: {},   // reserved for other than ACE editor support
    updating: false,
    changed: false,
    changeFn: function(e) {
      var button, view=this[0].myView;
      LoLs.changed=true;
      if (view.updating || view.changed)
        return;
      view.changed=true;
      button=document.getElementById(view.id+"Refresh");    
      button.style.backgroundColor = "yellow";
      button=document.getElementById("refreshAll");
      button.style.backgroundColor = "yellow";
    },
    focusFn:function() {
      var langButton;
      if (LoLs.currentLanguage) {
        langButton=document.getElementById(LoLs.currentLanguage+"Lang");
        langButton.style.color = "white";
      }
      LoLs.currentView=this[0].myView;
      LoLs.currentLanguage=LoLs.currentView.lang;
      langButton=document.getElementById(LoLs.currentLanguage+"Lang");
      langButton.style.color = "red";
    },
    blurFn:function() {
    },
    lang: lang,
    inputView: undefined,  // source, change to use view rather than view name
    outputView: undefined,
    result: undefined,
    references: [],
// TODO: eliminate old fields
    source: source};
  LoLs.views[name].changeFn.myView=LoLs.views[name];
  view.on('change', LoLs.views[name].changeFn);
  LoLs.views[name].focusFn.myView=LoLs.views[name];
  view.on('focus', LoLs.views[name].focusFn);
  LoLs.views[name].blurFn.myView=LoLs.views[name];
  view.on('blur', LoLs.views[name].blurFn);
  return view;  
}
function createACEeditor(name,id, gutter,readOnly,value,height) {
  var e, frame;
  document.getElementById("ProjectArea").insertAdjacentHTML("beforeend",
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
  // TODO: close this view in current project
  alert("Close This View");
}

function refreshView(viewName) {
  var lolsView, editor, source, lang, button, cleared;
  try {
    lolsView=LoLs.views[viewName];
// TODO: eliminate duplicate refreshing of views
// TODO: bidirectional view dependency support A updates B & B updates A
    if (lolsView.updating)
  	  return lolsView.result;
    lolsView.updating=true;
    lang=LoLs.languages[lolsView.lang].code;
    for (var i=0; i <lang.length; i++) {
    	if (lang[i].langView !== undefined)
    		refreshView(lang[i].langView);
    };
    editor=document.getElementById(lolsView.id).editor;
    if (lolsView.source == undefined || lolsView.source == lolsView.name) {
      source=editor.getValue();
    } else {
      source=refreshView(lolsView.source);
    };
    lolsView.result=applyLanguage(lang,source);
    if (lolsView.source !== undefined || lolsView.source == lolsView.name) {
      editor.setValue("" + lolsView.result);
    }
    lolsView.changed=false;
    lolsView.updating=false;
    button=document.getElementById(lolsView.id+"Refresh");    
    button.style.backgroundColor = "white";
    cleared=true;
    for (var i=0; i <LoLs.viewOrder.length; i++) {
    	if (LoLs.views[LoLs.viewOrder[i]].changed)
    		cleared=false;
    };
    if (cleared) {
      button=document.getElementById("refreshAll");
      button.style.backgroundColor = "white";
    };
	  return lolsView.result;
  } catch (e) {
    if (e.errorPos != undefined) {
	    insertMessage(editor, e.errorPos, " Unknown-->");
	  } else {
      alert("" + viewName + " error at unknown position\n\n" + e);
	  }
    lolsView.updating=false;
    return lolsView.result;
  }
}

function setLanguage(lang) {
  LoLs.currentView.lang=lang;
  refreshView(LoLs.currentView.name);
  document.getElementById(LoLs.currentView.id).editor.focus();
}