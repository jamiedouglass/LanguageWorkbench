var LoLs;

var EmptyWorkspace={name: "My Work",	
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
		 decode: []}], 
 views: [
		{name: "My View",	
		 editorProperties: 
			 {name: "ACE editor", height: "300px", gutters: true, readOnly: false},   				 
		 changed: false,
		 language: "ometa",
		 inputView: "My View", 
		 contents: 	''}],
	
// current selected view		
 currentView: "My View"};			
		
function createLanguage(name, startRule, inputIsList, defView) {
  var view;
  LoLs.languages[name]={
/* reserved for saving to file, GitHub, etc.
		guid: GUID,
  	url: URL,				// javascript executable file
*/
    name: name,
    code:[
      {
/* reserved for saving to file, GitHub, etc.
	guid: GUID,
  url: URL,
*/
       name: name,
       rules: eval(name),
       startRule: startRule,
       language: undefined,
       inputIsList: inputIsList,
       defView: LoLs.views[defView]}],
    decode:[],
    references:[]};		// Set of Views using language
  LoLs.languages[LoLs.languages.length]=LoLs.languages[name];
  LoLs.languages[name].code[0].language=LoLs.languages[name];
  view=LoLs.languages[name].code[0].defView;
  if (view)
    view.langDefs[view.langDefs.length]=LoLs.languages[name];
}

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

Array.prototype.depth = function() {
  var d=0, n=this;
  while (n !== undefined) {
    n=n.parent();
    d++;
  }
  return d;
}

function applyLanguage(lang, source) {
  var rules, result=source;
  for (var i=0; i < lang.length; i++) {
    rules=lang[i].rules;
    if (lang[i].inputIsList) {
      result=rules.matchAll(result, lang[i].startRule, undefined, 
	       function(m, i) {throw objectThatDelegatesTo(fail, {errorPos: i}) });
	  } else {
      result=rules.match(result, lang[i].startRule, undefined, 
         function(m, i) {
           alert('' + lang[i].name + ' translation error');
           throw fail;
         });
	  };
    if (lang[i].evalResults) 
      eval(result);
	};
	return result;
}