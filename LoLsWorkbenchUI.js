function setupPage() { 
  // TODO: load Getting Started as general project
  loadGettingStarted();
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

function translateCode(s) {
  var translationError = function(m, i) {
    alert('Translation error - please report this!');
    throw fail;
    };
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

function closeView(id) {
  // TODO: close this view in current project
  alert("Close This View");
}

function refreshView(id) {
  // TODO: refresh this view in current project
  alert("Refresh View");
}