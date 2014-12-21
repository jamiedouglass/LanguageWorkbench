var LoLs={					
/* reserved for saving to file, GitHub, etc.
	guid: GUID,
  url: URL,  				// workspace file
*/
  name: "",  				// workspace name
  changed: false,		// true => needs to be saved
	languages:[],
	currentLanguage: undefined,
	views: [],				// by name
	currentView: undefined,
	viewOrder: []};
// TODO: load meta language such as ometa or CAT from general workspace
LoLs.languages["ometa"]={
/* reserved for saving to file, GitHub, etc.
	guid: GUID,
  url: URL,					// language file with pointers to grammar sources
*/
	name: "ometa",
	code:[
   {
/* reserved for saving to file, GitHub, etc.
	  guid: GUID,
    url: URL,				// javascript executable file
*/
    name: "BSOMetaJSParser",
    rules: BSOMetaJSParser,
    startRule: "topLevel",
    language: undefined,
    inputIsList: true},
   {
/* reserved for saving to file, GitHub, etc.
	  guid: GUID,
    url: URL,				// javascript executable file
*/
    name: "BSOMetaJSTranslator",
    rules: BSOMetaJSTranslator,
    startRule: "trans",
    language: undefined,
    inputIsList: false,
    evalResults: true}],
  decode:[],
  references:[]};		// Set of Views using language
LoLs.languages["ometa"].code[0].language=LoLs.languages["ometa"];
LoLs.languages["ometa"].code[1].language=LoLs.languages["ometa"];

function createLanguage(name, startRule, inputIsList, inputView) {
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
       inputView: LoLs.views[inputView]}],
    decode:[],
    references:[]};		// Set of Views using language
  LoLs.languages[name].code[0].language=LoLs.languages[name];
  view=LoLs.languages[name].code[0].inputView;
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
// TODO: update when language loaded or regenerated
    rules=eval(lang[i].name);
    lang.rules=rules;
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