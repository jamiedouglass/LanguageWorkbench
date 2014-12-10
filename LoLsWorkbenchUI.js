// events
window.onbeforeunload = function() {
  /* TODO: track changes and determine if a message needs to popup
  if (dirty === false) {
    return;
  }
  */
  return "By leaving this page, any unsaved changes will be lost.";
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
  // TODO: refresh all the views in the current project
  alert("Refresh All Views in Project");
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
  var e, view, id=genLocalId(name), changeFn;
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
	'	  <button type="button" title="refresh" onClick="refreshView(\''+name+'\')">'+
	'		<img src="refresh.png" alt="Refresh View">' +
	'	  </button>' +
	'	</div>' +
	'	<div id="'+ id +'" class="LoLsViewEditor">' +
	'	</div>' +
	'</div>'); 
	e=document.getElementById(id);
	e.style.position="relative"; 
	e.style.height=height;
  view=ace.edit(id);
  view.getSession().setMode('ace/mode/textmate');
  view.renderer.setShowGutter(gutter);
  view.setValue(value);
  view.setReadOnly(readOnly);
  view.clearSelection();
  e.editor=view;
  changeFn=function(e) {
    var view=this[0].myView;
    if (view.updating)
      return;
    view.changed = true;
  };
  LoLs.views[name]={
  	name: name,
    id: id,
    lang: lang,
    updating: false,
    changed: true,
    changeFn: changeFn,
    result: undefined,
    source: source};
  changeFn.myView=LoLs.views[name];
  view.on('change', LoLs.views[name].changeFn);
  return view;  
}

function closeView(id) {
  // TODO: close this view in current project
  alert("Close This View");
}

function refreshView(viewName) {
  var lolsView, editor, source, lang;
  try {
    lolsView=LoLs.views[viewName];
// TODO: eliminate duplicate refreshing of views
// TODO: bidirectional view dependency support A updates B & B updates A
    if (lolsView.updating)
  	  return lolsView.result;
    lolsView.updating=true;
    lang=LoLs.languages[lolsView.lang];
    for (var i in lang) {
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