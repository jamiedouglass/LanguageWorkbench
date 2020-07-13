var LoLs;

var EmptyWorkspace={name: "My Work",	
 languages: [
		{name: "OMeta JS",
		 meta: true,
		 code: [
			 {name: "BSOMetaJSParser",
				startRule: "topLevel"},
			 {name: "BSOMetaJSTranslator",
				startRule: "trans",
				makeList: true}]}], 
 views: [
		{name: "My View",	
		 editor: {name: "ACE", height: "300px", gutters: false, readOnly: false},   				 
		 language: "OMeta JS",
		 contents: 	'ometa MyLanguage {\n  start=anything*\n}'}],
 currentView: "My View"};			
		
var GettingStarted={name: "Getting Started",
 languages: [
	{name: "OMeta JS",
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
	 language: "OMeta JS",
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

function Le(concept) {
  var a, args = new Array(arguments.length); 
  args[0] = concept;
  for (var i=1; i < arguments.length; i++) {
    a = arguments[i];
    if (Array.isArray(a)) {
      a.__proto__ = args;
    }
    args[i] = a;
  }
  return args;
}

Array.prototype.parent = function() {
  if (Array.prototype === this.__proto__) {
    return undefined;
  }
  return this.__proto__;
}

Array.prototype.concept = function() {
  if (this.length == 0) {
    return undefined;
  }
  return this[0];
}

Array.prototype.children = function() {
  return this.slice(1);
}

Array.prototype.child = function(index) {
  if (this.hasOwnProperty(index)) return this[index];
  return undefined;
}

Array.prototype.depth = function() {
  var d=0, n=this;
  while (n !== undefined) {
    n=n.parent();
    d++;
  }
  return d;
}