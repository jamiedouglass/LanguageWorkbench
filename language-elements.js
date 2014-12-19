var LoLs= {
/* reserved for saving to file, GitHub, etc.
	guid: GUID,
  url: URL,
*/
  name: "",
  changed: false,
	languages:[],
	currentLanguage: undefined,
	viewOrder: [],
	currentView: undefined,
	views: []};
LoLs.languages["ometa"]={
/* reserved for saving to file, GitHub, etc.
	guid: GUID,
  url: URL,
*/
	name: "ometa",
	code:[
   {
/* reserved for saving to file, GitHub, etc.
	  guid: GUID,
    url: URL,
*/
    name: "BSOMetaJSParser",
    rules: BSOMetaJSParser,
    startRule: "topLevel",
    sourceIsList: true,
    references:[LoLs.languages["ometa"]]},
   {
/* reserved for saving to file, GitHub, etc.
	  guid: GUID,
    url: URL,
*/
    name: "BSOMetaJSTranslator",
    rules: BSOMetaJSTranslator,
    startRule: "trans",
    sourceIsList: false,
    evalResults: true,
    references:[LoLs.languages["ometa"]]}],
  decode:[],
  references:[]};

function createLanguage(name, startRule, sourceIsList, langView) {
  LoLs.languages[name]={
/* reserved for saving to file, GitHub, etc.
		guid: GUID,
  	url: URL,
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
       sourceIsList: sourceIsList,
       references:[LoLs.languages[name]],
// TODO: eliminate old fields
       langView: langView}],
    decode:[],
    references:[]};
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
    if (lang[i].sourceIsList) {
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