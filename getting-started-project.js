function createView(name,gutter,readOnly,value,height) {
  var e, view, id=genLocalId(name);
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
// TODO: generalize with onClick="refreshView(this)" 
	'	  <button type="button" title="refresh" onClick="update'+id+'View()">' +
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
  return view;  
}

function loadGettingStarted() { 
  // TODO: load Getting Started as general project
  var startView;
  document.getElementById("ProjectName").textContent='Getting Started'+' ';
  createView('Read Me First',false,true,
	'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
	'Select a project and interact with it using the language areas below.\n' +
	'Each area displays the project according to a selected language.\n' +
	'Changes in one area update all other areas and the Language Element\n' +
	'Tree (LET) which defines the LoLs project.',"100px");
  startView=createView('Math Problem',false,false,'2+3*4',"20px");  
  createView('Answer',false,true,'',"20px");  
  createView('LET Explorer',false,true,'',"100px");	 
  createView('Grammar',true,false,
	'ometa math {\n' +
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
	'ometa text {\n' +
	'  doc = anything*\n' +
	'}',"250px");
  
  updateGrammarView();
  updateAnswerView();
  updateLETExplorerView();
  startView.focus(); 
}

function sp(node) {
  var s='', i=node.depth();
  while (i-- > 1) {
    s=s+'  ';
  }
  return s; 
}

function updateReadMeFirstView() {
  var readMeFirst, result;
  if (text == undefined) 
    return undefined;
  try {
  readMeFirst=document.getElementById("ReadMeFirst").editor;
	result=text.matchAll(readMeFirst.getValue(), 'doc', undefined, 
	  function(m, i) {throw objectThatDelegatesTo(fail, {errorPos: i}) });
	return result;
  } catch (e) {
    if (e.errorPos != undefined) {
	    insertMessage(readMeFirst, e.errorPos, " Unknown-->");
	  } else {
	    alert("Read Me First error at unknown position\n\n" + e);
	  }
  }
}

function updateGrammarView() {
  var grammar, code;
  try {
    grammar=document.getElementById("Grammar").editor;
    code=translateCode(grammar.getValue());
    eval(code);
  } catch (e) {
    if (e.errorPos != undefined) {
      insertMessage(grammar, e.errorPos, " Unknown-->");
    } else {
      alert("Grammar error at unknown position\n\n" + e);
    }
  }
}

function updateMathProblemView() {
  var mathProblem, result;
  if (math == undefined) 
    return undefined;
  try {
  mathProblem=document.getElementById("MathProblem").editor;
	result=math.matchAll(mathProblem.getValue(), 'expression', undefined, 
	  function(m, i) {throw objectThatDelegatesTo(fail, {errorPos: i}) });
	return result;
  } catch (e) {
    if (e.errorPos != undefined) {
	    insertMessage(mathProblem, e.errorPos, " Unknown-->");
	  } else {
	    alert("Math Problem error at unknown position\n\n" + e);
	  }
  }
}

function updateAnswerView() {
  var answer, result = updateMathProblemView();
  try {
    if (result == undefined) 
      return;
    if (math != undefined) 
      result = calculate.match(result,'le');
    answer=document.getElementById("Answer").editor;
    answer.setValue("" + result);
  } catch (e) {
    alert("Answer error at unknown position\n\n" + e);
  }
}

function updateLETExplorerView() {
  var letExplorer, result = updateMathProblemView();
  try {
    if (result == undefined) 
      return;
    if (math != undefined) 
      result = LET.match(result,'let');
    letExplorer=document.getElementById("LETExplorer").editor;
    letExplorer.setValue("" + result);
  } catch (e) {
    alert("LET Explorer error at unknown position\n\n" + e);
  }
}