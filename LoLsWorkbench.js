// events
window.onbeforeunload = function() {
  if (LoLs.unsaved) 
    return "By leaving this page, any unsaved changes will be lost.";
}

// functions for page
function closeView(id) {
	var v, e=document.getElementById(id);
	if (LoLs.views.length<=1) {
		alert("Workspace must have at least one view");
		return;
	}
	v=LoLs.views[e.getAttribute("name")];
	try {
		v.delete();
	} catch (e) {
		alert(e);
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
  };
  document.getElementById(beforeId).insertAdjacentHTML(m,
	'<div id="'+id+'View" class="LoLsView" name="'+name+'">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-" ' +
	'			onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <scan id="'+id+'ViewName">'+ name +' </scan><i>view</i>' +
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
}
function openWorkspace(info) {
	var i;
  document.getElementById('ViewArea').innerHTML="";  
  LoLs=Workspace(info);
	if (info===undefined) {
		LoLs.createLanguage();
		LoLs.createView('Unnamed');
		LoLs.views['Unnamed'].setLanguage('ometa');
		LoLs.currentView=LoLs.views['Unnamed'];
	}
  document.getElementById('WorkspaceName').textContent=LoLs.name+' ';
  createLangRibbon(LoLs.languageNames());
  for (i=0; i<LoLs.views.length; i++) 
  	createView(LoLs.views[i]);
  // TODO: load grammar rules without refreshing
  LoLs.refreshAll(true);
  
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
function saveWorkspace(id) {
  var f=new Blob([LoLs.serialize()],{type: 'text/plain'}),
  	  l=document.createElement('a');
  l.setAttribute('href',window.URL.createObjectURL(f));
  l.setAttribute('download', LoLs.name+'.txt');
  l.click();
}
function setLanguage(lang) {
  if (event.altKey) 
    return languageUpdateForm(lang);
  LoLs.currentView.setLanguage(lang);
  LoLs.currentView.changed();
  LoLs.currentView.refresh();
  document.getElementById(LoLs.currentView.id).editor.focus();
}
function setupPage() {
	var gs={name: "Getting Started",
 languages: [
	{name: "ometa",
	 meta: true,
	 code: [
		{name: "BSOMetaJSParser",
		 startRule: "topLevel"},
		{name: "BSOMetaJSTranslator",
		 startRule: "trans",
		 makeList: true}]},
	{name: "math",
	 code: [
		{name: "math",
		 startRule: "expression",
		 defView: "Grammar"}]},
	{name: "calculate",
	 code: [
		{name: "calculate",
		 startRule: "le",
		 makeList: true,
		 defView: "Grammar"}]},
	{name: "LET",
	 code: [
		{name: "LET",
		 startRule: "let",
		 makeList: true,
		 defView: "Grammar"}]},
	{name: "raw",
	 code: [
		{name: "raw",
		 startRule: "it",
		 defView: "Grammar"}]}],
 views: [
	{name: "Read Me First",
	 editor:
	 	{name: "ACE", height: "100px", readOnly: true},
	 language: "raw",
	 contents: "Welcome to the Language Workbench for Language of Languages (LoLs).\n"+
	 "Select a workspace and interact with it using the language areas below.\n"+
	 "Each area displays the workspace according to a selected language.\n"+
	 "Changes in one area update all other areas and the Language Element\n"+
	 "Tree (LET) which defines the LoLs workspace."},
	{name: "Math Problem",
	 editor:
	 	{name: "ACE"},
	 language: "math",
	 contents: "2+3*4"},
	{name: "Answer",
	 editor:
	 	{name: "ACE", readOnly: true},
	 language: "calculate",
	 contents: "14",
	 inputView: "Math Problem"},
	{name: "LET Explorer",
	 editor:
	 	{name: "ACE", height: "200px", readOnly: true},
	 language: "LET",
	 contents: ".+. Add\n  2 Number\n  .*. Multiply\n    3 Number\n    4 Number\n",
	 inputView: "Math Problem"},
	{name: "Grammar",
	 editor:
	 	{name: "ACE", height: "250px", gutters: true},
	 language: "ometa",
	 contents: "ometa math {\n"+
	 "  expression = term:t space* end           -> t,\n"+
	 "  term       = term:t \"+\" factor:f         -> Le(\'Add\', t, f)\n"+
	 "             | term:t \"-\" factor:f         -> Le(\'Subtract\', t, f)\n"+
	 "             | factor,\n"+
	 "  factor     = factor:f \"*\" primary:p      -> Le(\'Multiply\', f, p)\n"+
	 "             | factor:f \"/\" primary:p      -> Le(\'Divide\', f, p)\n"+
	 "             | primary,\n"+
	 "  primary    = Group\n"+
	 "             | Number,\n"+
	 "  Group      = \"(\" term:t \")\"              -> Le(\'Group\', t),\n"+
	 "  Number     = space* digits:n             -> Le(\'Number\', n),\n"+
	 "  digits     = digits:n digit:d            -> (n * 10 + d)\n"+
	 "             | digit,\n"+
	 "  digit      = ^digit:d                    -> d.digitValue()\n"+
	 "}\n\n"+
	 "ometa calculate {\n"+
	 "  le     = [\'Number\' anything:n]  -> n\n"+
	 "         | [\'Group\' le:x]         -> x\n"+
	 "         | [\'Add\' le:l le:r]      -> (l + r)\n"+
	 "         | [\'Subtract\' le:l le:r] -> (l - r)\n"+
	 "         | [\'Multiply\' le:l le:r] -> (l * r)\n"+
	 "         | [\'Divide\' le:l le:r]   -> (l / r)\n"+
	 "}\n\n"+
	 "ometa LET {\n"+
	 "  let = [\'Number\' anything:n]:x    -> (sp(x)+n+\' Number\\n\')\n"+
	 "      | [\'Group\' let:e]:x          -> (sp(x)+\'(.) Group\\n\'+e)\n"+
	 "      | [\'Add\' let:l let:r]:x      -> (sp(x)+\'.+. Add\\n\'+l+r)\n"+
	 "      | [\'Subtract\' let:l let:r]:x -> (sp(x)+\'.-. Subtract\\n\'+l+r)\n"+
	 "      | [\'Multiply\' let:l let:r]:x -> (sp(x)+\'.*. Multiply\\n\'+l+r)\n"+
	 "      | [\'Divide\' let:l let:r]:x   -> (sp(x)+\'./. Divide\\n\'+l+r)\n"+
	 "}\n\n"+
	 "function sp(node) {\n  var s=\"\", i=node.depth();\n"+
	 "  while (i-- > 1) {s=s+\"  \"};\n"+
	 "  return s;\n"+
	 "}\n\n"+
	 "ometa raw {\n"+
	 "  it = anything*\n"+
	 "}"}],
 currentView: "Math Problem"}; 
	setupForms();
  openWorkspace(gs);
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
  var e=document.getElementById(view.id+"Refresh");    
	e.style.backgroundColor = "yellow";
	e=document.getElementById("refreshAll");
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