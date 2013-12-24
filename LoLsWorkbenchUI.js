function setupPage() { 
  // TODO: load Getting Started as general project
  loadGettingStarted();
}

function translateCode(s) {
  var translationError = function(m, i) {
    alert('Translation error - please report this!');
    throw fail};
  var tree = BSOMetaJSParser.matchAll(s, 'topLevel', undefined, function(m, i) {
    throw objectThatDelegatesTo(fail, {errorPos: i})});
  return BSOMetaJSTranslator.match(tree, 'trans', undefined, translationError)
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
  
function showOrHide(id) {
  var	button = document.getElementById(id + "Button"),
    style = document.getElementById(id).style;
  if (style.visibility === "hidden") {
  	style.display = "block";
  	style.visibility = "visible";
  	button.value = "-";
  	button.title = "collapse";
  } else {
  	style.display = "none";
  	style.visibility = "hidden";
  	button.value = "+";
  	button.title = "expand";
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
	  alert("Math Problem Error\n\n" + e);
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
    alert("Answer Error\n\n" + e);
  }
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
      alert("Math Grammar Error\n\n" + e);
    }
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
    alert("LET Explorer Error\n\n" + e);
  }
}