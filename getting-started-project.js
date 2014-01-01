function createView(name,gutter,readOnly,value) {
  var id=genLocalId(name);
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
  view=ace.edit(id);
  view.getSession().setMode('ace/mode/textmate');
  view.renderer.setShowGutter(gutter);
  view.setValue(value);
  view.setReadOnly(readOnly);
  view.clearSelection();
  return view;  
}

function loadGettingStarted() { 
  // TODO: load Getting Started as general project
  document.getElementById("ProjectName").textContent='Getting Started'+' ';
  view = createView('Read Me First',false,true,
	'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
	'Select a project and interact with it using the language areas below.\n' +
	'Each area displays the project according to a selected language.\n' +
	'Changes in one area update all other areas and the Language Element\n' +
	'Tree (LET) which defines the LoLs project.');
  mathProblem = createView('Math Problem',false,false,'2+3*4');  
  answer = createView('Answer',false,true,'');  
  letExplorer = createView('LET Explorer',false,true,
	 '.+. Add\n  2 Natural Number\n  .*. Multiply\n' +
	 '    3 Natural Number\n    4 Natural Number');	 
  grammar = createView('Math Grammar',true,false,
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
	'  digit      = ^digit:d                    -> d.digitValue(),\n\n' +
	'  le     = [\'Number\' anything:n]  -> n\n' +
	'         | [\'Group\' le:x]         -> x\n' +
	'         | [\'Add\' le:l le:r]      -> (l + r)\n' +
	'         | [\'Subtract\' le:l le:r] -> (l - r)\n' +
	'         | [\'Multiply\' le:l le:r] -> (l * r)\n' +
	'         | [\'Divide\' le:l le:r]   -> (l / r),\n\n' + 
	'  let = [\'Number\' anything:n]  -> [\'\'+n+\' Natural Number\']\n' +
	'      | [\'Group\' let:x]           -> [\'(.) Group\'].concat(p(x))\n' +
	'      | [\'Add\' let:l let:r]       -> [\'.+. Add\'].concat(p(l),p(r))\n' +
	'      | [\'Subtract\' let:l let:r]  -> [\'.-. Subtract\'].concat(p(l),p(r))\n' +
	'      | [\'Multiply\' let:l let:r]  -> [\'.*. Multiply\'].concat(p(l),p(r))\n' +
	'      | [\'Divide\' let:l let:r]    -> [\'./. Divide\'].concat(p(l),p(r))\n' +
	'}');
  
  updateAnswerView();
  mathProblem.focus(); 
}

function p(x) { 
  var a = [], j = 0; 
  for (var i = 0; i < x.length; i++) {
    a[j++] = '  ' + x[i];  
  }
  return a;
}


function l(x) {  
  var s = '';
  for (var i = 0; i < x.length; i++) {
    s = s + x[i] + '\n';  
  }
  return s;
}

function updateMathGrammarView() {
  var code;
  try {
    code=translateCode(grammar.getValue());
    eval(code);
  } catch (e) {
    if (e.errorPos != undefined) {
      insertMessage(grammar, e.errorPos, " Unknown-->");
    } else {
      alert("Math Grammar error at unknown position\n\n" + e);
    }
  }
}

function updateMathProblemView() {
  var result, doc, pos;
  updateMathGrammarView();
  if (math == undefined) 
    return undefined;
  try {
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
  var result = updateMathProblemView();
  try {
    if (result == undefined) 
      return;
    if (math != undefined) 
      result = math.match(result,'le');
    answer.setValue("" + result);
  } catch (e) {
    alert("Answer error at unknown position\n\n" + e);
  }
}

function updateLETExplorerView() {
  var result = updateMathProblemView();
  try {
    if (result == undefined) 
      return;
    if (math != undefined) 
      result = math.match(result,'let');
    letExplorer.setValue("" + l(result));
  } catch (e) {
    alert("LET Explorer error at unknown position\n\n" + e);
  }
}