var GettingStarted={name: "Getting Started",		
 languages: [
// workbench meta language
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
		 
// getting started calculator example languages
 		{name: "math",
		 code: [
			 {name: "math",
    		startRule: "expression",
    		inputIsList: true,
        defView: "Grammar"}],
 		 decode: []},
 		 
 		{name: "calculate",
		 code: [
			 {name: "calculate",
    		startRule: "le",
    		inputIsList: false,
        defView: "Grammar"}],
 		 decode: []},
 		 
 		{name: "LET",
		 code: [
			 {name: "LET",
    		startRule: "let",
    		inputIsList: false,
        defView: "Grammar"}],
 		 decode: []},
 		 
 		{name: "raw",
		 code: [
			 {name: "raw",
    		startRule: "it",
    		inputIsList: true,
        defView: "Grammar"}],
 		 decode: []}],	
 		 		
 views: [
		{name: "Read Me First",	
		 editorProperties: 
			 {name: "ACE editor", height: "100px", gutters: false, readOnly: true},   				 
		 changed: false,
		 language: "raw",
		 inputView: "Read Me First", 
		 contents: 'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
		'Select a workspace and interact with it using the language areas below.\n' +
		'Each area displays the workspace according to a selected language.\n' +
		'Changes in one area update all other areas and the Language Element\n' +
		'Tree (LET) which defines the LoLs workspace.'},

		{name: "Math Problem",	
		 editorProperties: 
			 {name: "ACE editor", height: "60px", gutters: false, readOnly: false},   				 
		 changed: false,
		 language: "math",
		 inputView: "Math Problem", 
		 contents: '2+3*4'},

		{name: "Answer",	
		 editorProperties: 
			 {name: "ACE editor", height: "60px", gutters: false, readOnly: true},   				 
		 changed: false,
		 language: "calculate",
		 inputView: "Math Problem"},

		{name: "LET Explorer",	
		 editorProperties: 
			 {name: "ACE editor", height: "200px", gutters: false, readOnly: true},   				 
		 changed: false,
		 language: "LET",
		 inputView: "Math Problem"},

		{name: "Grammar",	
		 editorProperties: 
			 {name: "ACE editor", height: "250px", gutters: true, readOnly: false},   				 
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
		
// current selected view		
 currentView: "Math Problem"};			
