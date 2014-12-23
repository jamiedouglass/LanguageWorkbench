// events
window.onbeforeunload = function() {
  if (LoLs.changed) {
    return "By leaving this page, any unsaved changes will be lost.";
  };
}

//functions
function setupPage() { 
  // TODO: load Getting Started as general workspace
// loadGettingStarted();

	LoLs=getWorkspace("Getting Started");
	linkWorkspace(LoLs);
	showWorkspace(LoLs);
	
}

function addRemoveLanguage(id) {
  // TODO: add and/or remove languages to/from language ribbon
  alert("add and/or remove languages to/from language ribbon");  
}

function openWorkspace(id) {
  // TODO: open existing or create new workspace
  alert("Open Existing Workspace or Create New Workspace");
}

function getWorkspace(fn) {
	var work;
	if (fn == "Getting Started") {
		work={ 
			name: "Getting Started",		
			languages: [
		 {name: "ometa",
			code: [
    	 {name: "BSOMetaJSParser",
    		startRule: "topLevel",
    		inputIsList: true},
   		 {name: "BSOMetaJSTranslator",
        startRule: "trans",
        inputIsList: false,
        evalResults: true}],
 			decode: []},
 		 {name: "math",
			code: [
			 {name: "math",
// TODO: add rules by eval(name) after refreshing defView
    		startRule: "expression",
    		inputIsList: true,
        defView: "Grammar"}],
 			decode: []},
 		 {name: "calculate",
			code: [
			 {name: "calculate",
// TODO: add rules by eval(name) after refreshing defView
    		startRule: "le",
    		inputIsList: false,
        defView: "Grammar"}],
 			decode: []},
 		 {name: "LET",
			code: [
			 {name: "LET",
// TODO: add rules by eval(name) after refreshing defView
    		startRule: "let",
    		inputIsList: false,
        defView: "Grammar"}],
 			decode: []},
 		 {name: "raw",
			code: [
			 {name: "raw",
// TODO: add rules by eval(name) after refreshing defView
    		startRule: "it",
    		inputIsList: true,
        defView: "Grammar"}],
 			decode: []}],			
			views: [
			{name: "Read Me First",	
    	 editorProperties: {
    	   name: "ACE editor", height: "100px", gutters: false, readOnly: true},   				 
    	 changed: false,
    	 language: "raw",
    	 inputView: "Read Me First", 
    	 contents: 'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
			'Select a workspace and interact with it using the language areas below.\n' +
			'Each area displays the workspace according to a selected language.\n' +
			'Changes in one area update all other areas and the Language Element\n' +
			'Tree (LET) which defines the LoLs workspace.'},

			{name: "Math Problem",	
    	 editorProperties: {
    	   name: "ACE editor", height: "60px", gutters: false, readOnly: false},   				 
    	 changed: false,
    	 language: "math",
    	 inputView: "Math Problem", 
    	 contents: '2+3*4'},

			{name: "Answer",	
    	 editorProperties: {
    	   name: "ACE editor", height: "60px", gutters: false, readOnly: true},   				 
    	 changed: false,
    	 language: "calculate",
    	 inputView: "Math Problem", 
    	 contents: ''},

			{name: "LET Explorer",	
    	 editorProperties: {
    	   name: "ACE editor", height: "200px", gutters: false, readOnly: true},   				 
    	 changed: false,
    	 language: "LET",
    	 inputView: "Math Problem", 
    	 contents: ''},

			{name: "Grammar",	
    	 editorProperties: {
    	   name: "ACE editor", height: "250px", gutters: true, readOnly: false},   				 
    	 changed: false,
    	 language: "ometa",
    	 inputView: "Grammar", 
    	 contents: 	'ometa math {\n' +
			'  expression = term:t space* end           -> t,\n' +
			'  term       = term:t "+" factor:f         -> Le(\'Add\', t, f)\n' +
			'             | term:t "-" factor:f         -> Le(\'Subtract\', t, f)\n' +
			'             | factor,\n' +
			'  factor     = factor:f "*" primary:p      -> Le(\'Multiply\', f, p)\n' +
			'             | factor:f "/" primary:p      -> Le(\'Divide\', f, p)\n' +
			'             | primary,\n' + 
			'  primary    = Group\n' +
			'             | Number,\n' +
			'  Group      = "(" term:t ")"              -> Le(\'Group\', t),\n' +
			'  Number     = space* digits:n             -> Le(\'Number\', n),\n' + 
			'  digits     = digits:n digit:d            -> (n * 10 + d)\n' +
			'             | digit,\n' + 
			'  digit      = ^digit:d                    -> d.digitValue()\n' +
			'}\n\n' + 
			'ometa calculate {\n' +
			'  le     = [\'Number\' anything:n]  -> n\n' +
			'         | [\'Group\' le:x]         -> x\n' +
			'         | [\'Add\' le:l le:r]      -> (l + r)\n' +
			'         | [\'Subtract\' le:l le:r] -> (l - r)\n' +
			'         | [\'Multiply\' le:l le:r] -> (l * r)\n' +
			'         | [\'Divide\' le:l le:r]   -> (l / r)\n' +
			'}\n\n' + 
			'ometa LET {\n' +
			'  let = [\'Number\' anything:n]:x    -> (sp(x)+n+\' Number\\n\')\n' +
			'      | [\'Group\' let:e]:x          -> (sp(x)+\'(.) Group\\n\'+e)\n' +
			'      | [\'Add\' let:l let:r]:x      -> (sp(x)+\'.+. Add\\n\'+l+r)\n' +
			'      | [\'Subtract\' let:l let:r]:x -> (sp(x)+\'.-. Subtract\\n\'+l+r)\n' +
			'      | [\'Multiply\' let:l let:r]:x -> (sp(x)+\'.*. Multiply\\n\'+l+r)\n' +
			'      | [\'Divide\' let:l let:r]:x   -> (sp(x)+\'./. Divide\\n\'+l+r)\n' +
			'}\n\n' +
			'function sp(node) {\n' +
			'  var s="", i=node.depth();\n' +
			'  while (i-- > 1) {s=s+"  "};\n' +
			'  return s;\n' +
			'}\n\n' +
			'ometa raw {\n' +
			'  it = anything*\n' +
			'}'}],
// TODO: currentView needs to change to currentViewSelection
			currentView: "Math Problem"};			
 			
	  return work;
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

function showWorkspace(w) { 
  var ribbon, str, startView, view, thisView;
  document.getElementById('WorkspaceName').textContent=w.name+' ';
  ribbon=[];
  for (var i=0; i<w.languages.length; i++) {
  	ribbon.push(w.languages[i].name);
  };
  ribbon.sort();
  str='';
  for (var i=0; i<ribbon.length; i++) {
		str=str + '<button id="' + ribbon[i] + 'Lang" type="button"' +
			' onClick="setLanguage(\'' + ribbon[i] + '\')">' + ribbon[i] + '</button> ';
	};
  document.getElementById("LangRibbon").insertAdjacentHTML("beforeend", str);
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
    language: lang,
    inputView: source,   // point to this views or another view 
    									   // view displays input or output
    contents: undefined,
    references: [],      // Set of Views which use contents as input 
    langDefs:[]};        // Set of Languages that View defines  
// TODO: support inserting view
  LoLs.views[LoLs.views.length] = LoLs.views[name];
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