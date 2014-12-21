function loadGettingStarted() { 
  // TODO: load Getting Started as general workspace
  var startView, view;
  LoLs.name='Getting Started';
  document.getElementById('WorkspaceName').textContent=LoLs.name+' ';
  // TODO: Implement language ribbon support
  document.getElementById("LangRibbon").insertAdjacentHTML("beforeend",
    '<button id="calculateLang" type="button"' +
    ' onClick="setLanguage(\'calculate\')">calculate</button>' +
    '<button id="LETLang" type="button"' +
    ' onClick="setLanguage(\'LET\')">LET</button>' +
    '<button id="mathLang" type="button"' +
    ' onClick="setLanguage(\'math\')">math</button>' +
    '<button id="ometaLang" type="button"' +
    ' onClick="setLanguage(\'ometa\')">ometa</button>' +
    '<button id="textLang" type="button"' +
    ' onClick="setLanguage(\'text\')">text</button>');
  createView('Read Me First',"text",false,true,
	'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
	'Select a workspace and interact with it using the language areas below.\n' +
	'Each area displays the workspace according to a selected language.\n' +
	'Changes in one area update all other areas and the Language Element\n' +
	'Tree (LET) which defines the LoLs workspace.','100px','Read Me First');
  startView=createView('Math Problem',"math",false,false,'2+3*4','60px','Math Problem');  
  createView('Answer',"calculate",false,true,'',"60px",'Math Problem');  
  createView('LET Explorer',"LET",false,true,'',"200px",'Math Problem');	 
  createView('Grammar',"ometa",true,false,
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
	'function sp(node) {\n' +
  '  var s="", i=node.depth();\n' +
  '  while (i-- > 1) {s=s+"  "};\n' +
  '  return s;\n' +
  '}\n\n' +
	'ometa text {\n' +
	'  doc = anything*\n' +
	'}',"250px",'Grammar');
	view=LoLs.views["Grammar"];
	view.language=LoLs.languages[view.language];
	view.language.references[view.language.references.length]=view;
	view.inputView=LoLs.views[view.inputView];
	if (view.inputView !== view)
	  view.inputView.references[view.inputView.references.length]=view;
  refreshView("Grammar");
  createLanguage("text","doc",true,"Grammar");
	createLanguage("math","expression",true,"Grammar");
	createLanguage("calculate","le",false,"Grammar");
	createLanguage("LET","let",false,"Grammar");
	view=LoLs.views["Read Me First"];
	view.language=LoLs.languages[view.language];
	view.language.references[view.language.references.length]=view;
	view.inputView=LoLs.views[view.inputView];
	if (view.inputView !== view)
	  view.inputView.references[view.inputView.references.length]=view;
	view=LoLs.views["Math Problem"];
	view.language=LoLs.languages[view.language];
	view.language.references[view.language.references.length]=view;
	view.inputView=LoLs.views[view.inputView];
	if (view.inputView !== view)
	  view.inputView.references[view.inputView.references.length]=view;
	view=LoLs.views["Answer"];
	view.language=LoLs.languages[view.language];
	view.language.references[view.language.references.length]=view;
	view.inputView=LoLs.views[view.inputView];
	if (view.inputView !== view)
	  view.inputView.references[view.inputView.references.length]=view;
	view=LoLs.views["LET Explorer"];
	view.language=LoLs.languages[view.language];
	view.language.references[view.language.references.length]=view;
	view.inputView=LoLs.views[view.inputView];
	if (view.inputView !== view)
	  view.inputView.references[view.inputView.references.length]=view;
  refreshView("Answer");
  refreshView("LET Explorer");
  startView.focus(); 
}