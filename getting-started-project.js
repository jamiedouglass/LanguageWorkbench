function loadGettingStarted() { 
  // TODO: load Getting Started as general project
  var startView;
  document.getElementById('ProjectName').textContent='Getting Started'+' ';
  createLanguage("text","doc",false,"Grammar");
	createLanguage("math","expression",false,"Grammar");
	createLanguage("calculate","le",true,"Grammar");
	createLanguage("LET","let",true,"Grammar");  
  // TODO: Implement language ribbon support
  document.getElementById("LangRibbon").insertAdjacentHTML("beforeend",
    '<button type="button">calculate</button>' +
    '<button type="button">LET</button>' +
    '<button type="button">math</button>' +
    '<button type="button">ometa</button>' +
    '<button type="button">text</button>');
  createView('Read Me First',"text",false,true,
	'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
	'Select a project and interact with it using the language areas below.\n' +
	'Each area displays the project according to a selected language.\n' +
	'Changes in one area update all other areas and the Language Element\n' +
	'Tree (LET) which defines the LoLs project.','100px');
  startView=createView('Math Problem',"math",false,false,'2+3*4','60px');  
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
	'}',"250px");
  refreshView("Grammar");
  refreshView("Answer");
  refreshView("LET Explorer");
  startView.focus(); 
}