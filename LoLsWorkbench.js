// events
window.onbeforeunload = function() {
  if (LoLs.unsaved) 
    return "By leaving this page, any unsaved changes will be lost.";
}

// functions for page
function getStyle(e,styleProp) {
  if (e.currentStyle) {
    return e.currentStyle[styleProp];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(e,null).getPropertyValue(styleProp);
  } else {
    return e.style[styleProp]; 
  }
}
function inputSize(elem, pad) {
	var font, value=elem.value, e=document.getElementById('measure');
	if (value===undefined)
		value=' ';
	if (pad===undefined)
		pad=0;
	e.style.font=getStyle(elem,'font');
	e.textContent=value;
	elem.style.width=e.clientWidth+pad+'px';
}
function setWorkspaceName(elem) {
	var name=elem.value;
	inputSize(elem);
	if (LoLs.name == name)
		return;
	try {
		LoLs.setName(name);
	} catch (e) {
		alert(e);
	}
}
function setViewName(elem) {
	var oldName=elem.name, name=elem.value;
	inputSize(elem);
	if (name == oldName)
		return;
	try {
			LoLs.renameView(oldName,name);
			elem.name=name;
	} catch (e) {
		alert(e);
		elem.name=oldName;
		elem.value=oldName;
		inputSize(elem);
	}
}
function closeView(id) {
	var v, e=document.getElementById(id);
	if (LoLs.views.length<=1) {
		alert("Workspace must have at least one view");
		return;
	}
	try {
		LoLs.views[e.getAttribute("name")].delete();
	} catch (err) {
		alert(err);
		return;
	}
	e.parentNode.removeChild(e);	
}
function createLangRibbon(names) { 
  var e=document.getElementById("LangArea"), i, str='';
  e.innerHTML="";
  // TODO: ids need to not have spaces etc.
  for (i=0; i<names.length; i++) {
		str+='<button id="' + names[i] + 'Lang" type="button"' +
			' onClick="setLanguage(\'' + names[i] + '\')">' +
			 names[i] + '</button> ';
	};
  e.insertAdjacentHTML("beforeend", str);
};
function createView(view,beforeId) {
  var name=view.name, id=genLocalId(name), m="afterend";
  if (beforeId===undefined) {
  	beforeId="ViewArea";
  	m="beforeend";
  }
  else 
  	beforeId+="View";
  document.getElementById(beforeId).insertAdjacentHTML(m,
	'<div id="'+id+'View" class="LoLsView" name="'+name+'">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-"' +
	'			onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <input id="'+id+'ViewName" class="LoLsViewName" name="'+name+'"'+
	'     type="text" oninput="inputSize(this,10)"' +
	'  	  onblur="setViewName(this)" value="'+name+'">&thinsp;<i>view</i>' +
	'	  <button type="button" title="open view" onClick="openView(\''+id+'View\')">' +
	'			<img src="images/open-view.png" alt="Open View">' +
	'	  </button>' +
	'	  <button type="button" title="close view" onClick="closeView(\''+id+'View\')">' +
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
	view.createEditor(id);
	inputSize(document.getElementById(id+'ViewName'));
}
function openWorkspace(info) {
	var i, e;
  document.getElementById('ViewArea').innerHTML=""; 
	if (info===undefined)
		LoLs=Workspace(EmptyWorkspace);
	else
  	LoLs=Workspace(info);
  e=document.getElementById('WorkspaceName')
  e.value=LoLs.name;
  inputSize(e);
  createLangRibbon(LoLs.languageNames());
  for (i=0; i<LoLs.views.length; i++) 
  	createView(LoLs.views[i]);
  // TODO: load grammar rules without refreshing
  LoLs.refreshAll(true);
  if (info!==undefined)
  	LoLs.unsaved=false;
	LoLs.currentView.focus(true);
}
function refreshAll() {
	try {
  	LoLs.refreshAll(event.altKey);
  } catch (e) {
  	if (e.errorPos!==undefined)
  		insertMessage(e.view.id, e.errorPos, 'Unknown->');
  	else
  		alert(e);
  }
  if (!LoLs.isRefreshNeeded())
    document.getElementById("refreshAll").style.backgroundColor = "white";
}
function refreshCompleted(view) {
  var e=document.getElementById(view.id+"Refresh");	    
	e.style.backgroundColor = "white";
	if (!LoLs.isRefreshNeeded()) {
		e=document.getElementById("refreshAll");
		e.style.backgroundColor = "white";
	}
}
function refreshView(viewName) {
	try {
  	LoLs.views[viewName].refresh(event.altKey);
  } catch (e) {
  	if (e.errorPos!==undefined)
  		insertMessage(e.view.id, e.errorPos, 'Unknown->');
  	else
  		alert(e);
  }
}
function saveWorkspace() {
  var d=new Blob([LoLs.serialize()],{type: 'text/plain'}),
  	  e=document.createElement('a');
  e.setAttribute('href',window.URL.createObjectURL(d));
  e.setAttribute('download', LoLs.name+'.txt');
  e.click();
  LoLs.unsaved=false;
}
function setLanguage(name) {
  if (event.altKey) 
    return languageForm(name);
  if (LoLs.currentView!==undefined) {
  	LoLs.currentView.setLanguage(name);
		LoLs.currentView.changed();
		LoLs.currentView.refresh();
  	document.getElementById(LoLs.currentView.id).editor.focus();
  }
}
function setupPage() {
	setupForms();
  openWorkspace(GettingStarted);
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
function switchLang(fromLang, toLang) {
	var b1, b2;
	if (fromLang!==undefined) 
		b1=document.getElementById(fromLang.name+"Lang");
	if (b1!== undefined && b1!==null)	
		b1.style.color = "white";
	if (toLang!==undefined) 
		b2=document.getElementById(toLang.name+"Lang");
	if (b2!== undefined && b2!==null)	
		b2.style.color = "red";
}
function viewHasChanged(view) {
  var e;
  e=document.getElementById(view.id+"Refresh");
  if (e!== undefined && e!==null)    
		e.style.backgroundColor = "yellow";
	e=document.getElementById("refreshAll");
  if (e!== undefined && e!==null)    
		e.style.backgroundColor = "yellow";
}

// Editor support
function insertMessage(id, index, message) {
	function indexToPosition(doc, index) {
		var lines = doc.getAllLines(),
			newLineLen = doc.getNewLineCharacter().length,
			row, column = index;
		for (row = 0; column >= lines[row].length + newLineLen; row ++) 
			column -= lines[row].length + newLineLen;
		return {row:row, column:column};
	}
  var editor = document.getElementById(id).editor,
  	doc = editor.getSession().getDocument(),
    pos = indexToPosition(doc, index);
  doc.insert(pos, message);
  editor.find(message, {backwards:true}, false);
  editor.focus();
}