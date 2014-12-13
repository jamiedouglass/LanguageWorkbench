var LoLs= {
	languages:[],
	viewNames: [],
	views: []};
LoLs.languages["ometa"]=[
   {name: "BSOMetaJSParser",
    startRule: "topLevel",
    sourceIsLET: false},
   {name: "BSOMetaJSTranslator",
    startRule: "trans",
    sourceIsLET: true,
    evaluate: true}];

function createLanguage(name, startRule, sourceIsLET, langView) {
  LoLs.languages[name]=[
   {name: name,
    startRule: startRule,
    sourceIsLET: sourceIsLET,
    langView: langView}];
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
    if (lang[i].sourceIsLET) {
      result=rules.match(result, lang[i].startRule, undefined, 
         function(m, i) {
           alert('' + lang[i].name + ' translation error');
           throw fail;
         });
	  } else {
      result=rules.matchAll(result, lang[i].startRule, undefined, 
	       function(m, i) {throw objectThatDelegatesTo(fail, {errorPos: i}) });
	  };
    if (lang[i].evaluate) 
      eval(result);
	};
	return result;
}