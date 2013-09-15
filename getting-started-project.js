function loadGettingStarted() { 
  // TODO: load Getting Started as general project
  view = ace.edit('ReadMeFirst');
  view.getSession().setMode('ace/mode/textmate');
  view.renderer.setShowGutter(false);
  view.setValue('Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
    'Select a project and interact with it using the language areas below.\n' +
    'Each area displays the project according to a selected language.\n' +
    'Changes in one area update all other areas and the Language Element\n' +
    'Tree (LET) which defines the LoLs project.');
  view.setReadOnly(true);
  view.clearSelection();
  mathProblem = ace.edit('MathProblem');
  mathProblem.getSession().setMode('ace/mode/textmate');
  mathProblem.renderer.setShowGutter(false);
  mathProblem.setValue('2+3*4');
  mathProblem.clearSelection();
  answer = ace.edit('Answer');
  answer.getSession().setMode('ace/mode/textmate');
  answer.setReadOnly(true);
  answer.renderer.setShowGutter(false);
  answer.clearSelection();
  letExplorer = ace.edit('LETExplorer');
  letExplorer.getSession().setMode('ace/mode/textmate');
  letExplorer.setValue('.+. Addition\n   2 Natural Number\n   .*. Multiply\n' +
				'      3 Natural Number\n      4 Natural Number');
  letExplorer.clearSelection();
  grammar = ace.edit('MathGrammar');
  grammar.getSession().setMode('ace/mode/textmate');
  grammar.setValue('ometa math {\n' +
  '  expression = term:t space* end           -> t,\n' +
  '  term       = term:t "+" factor:f         -> [\'Add\', t, f]\n' +
  '             | term:t "-" factor:f         -> [\'Subtract\', t, f]\n' +
  '             | factor,\n' +
  '  factor     = factor:f "*" primary:p      -> [\'Multiply\', f, p]\n' +
  '             | factor:f "/" primary:p      -> [\'Divide\', f, p]\n' +
  '             | primary,\n' + 
  '  primary    = Group\n' +
  '             | Number,\n' +
  '  Group      = "(" term:t ")"              -> [\'Group\', t],\n' +
  '  Number     = space* digits:n             -> [\'Number\', n],\n' + 
  '  digits     = digits:n digit:d            -> (n * 10 + d)\n' +
  '             | digit,\n' + 
  '  digit      = ^digit:d                    -> d.digitValue(),\n' +
  '\n  le     = [\'Number\' anything:n]  -> n\n' +
  '         | [\'Group\' le:x]         -> x\n' +
  '         | [\'Add\' le:l le:r]      -> (l + r)\n' +
  '         | [\'Subtract\' le:l le:r] -> (l - r)\n' +
  '         | [\'Multiply\' le:l le:r] -> (l * r)\n' +
  '         | [\'Divide\' le:l le:r]   -> (l / r),\n' + 
  '\nlet = [\'Number\' anything:n]  -> [\'\'+n+\' Number\']\n' +
  ' | [\'Group\' let:x]           -> [\'(.) Group\'].concat(p(x))\n' +
  ' | [\'Add\' let:l let:r]       -> [\'.+. Add\'].concat(p(l),p(r))\n' +
  ' | [\'Subtract\' let:l let:r]  -> [\'.-. Subtract\'].concat(p(l),p(r))\n' +
  ' | [\'Multiply\' let:l let:r]  -> [\'.*. Multiply\'].concat(p(l),p(r))\n' +
  ' | [\'Divide\' let:l let:r]    -> [\'./. Divide\'].concat(p(l),p(r))\n' +
  '}');
  grammar.clearSelection();
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

