var LoLsW;

function ACEeditor(height, gutter, readOnly) {
	var e= objectThatDelegatesTo(ACEeditorClass, {
		name: "ACE",
		height: height,
		gutter: (gutter===true) ? true : false,
		readOnly: (readOnly===true) ? true : false});
	return e;
}

ACEeditorClass={
};

function Grammar(name, startRule, makeList) {
	var g=objectThatDelegatesTo(GrammarClass, {
		name: name,
		startRule: startRule,
		makeList: makeList==true,
		language: undefined,
		defView: undefined});
	try {
		g.rules=eval(name);
	} catch (e) {
		g.rules=undefined;
	}
	return g;
}

GrammarClass= {
	changed:function() {
		if (this.language!==undefined)
			this.language.changed();
	},
	delete:function() {
		var l=this.language;
		this.setDefViewObj();
		if (l!==undefined) {
			this.language=undefined;
			l.deleteGrammarObj(this);
		} 
	},
	refresh:function() {
		if (this.defView===undefined)
			return;
		this.defView.refresh();
		this.rules=eval(this.name);
	},
	replaceWith:function(grammarObj) {
	// TODO: 
	},
	setDefView:function(name) {
		try {
			this.setDefViewObj(this.language.workspace.views[name]);
		} catch (e) {
			throw "View "+name+" not found to define grammar.";
		}
	},
	setDefViewObj:function(viewObj) {
		var i, v=this.defView, ds;
		if (v!==undefined) {
			i=v.grammarDefs.indexOf(this);
			if (i>=0)
				v.grammarDefs.splice(i,1);
		}
		this.defView=viewObj;
		if (viewObj!==undefined) {
			ds=viewObj.grammarDefs;
			i=ds.indexOf(this);
			if (i<0)
				ds[ds.length]=this;
		}
	},
	// private
	refByName:function() {
	},
	refByPtr:function() {
	} 
};

function Language(name, meta) {
	var l=objectThatDelegatesTo(LanguageClass, {
		name: name,
		meta: meta == true,
		code: [],
		decode: [],
		references: [],
		workspace: undefined});
	if (name===undefined && meta===undefined) {
		l.name="ometa";
		l.meta=true;
		l.createGrammar("BSOMetaJSParser","topLevel");
		l.createGrammar("BSOMetaJSTranslator","trans",true);		
	}
	return l;
}

LanguageClass= { 
	applyTo:function(source, decode) {
		var result=source, rules, pipe=this.code;
		if (decode!==undefined) {
			result=decode;
			pipe=this.decode;
		}
		if (pipe.length==0) return result;
		for (var i=0; i < pipe.length; i++) {
			rules=pipe[i].rules;
			if (pipe[i].makeList) {
				result=rules.match(result, pipe[i].startRule, undefined, 
					 function(m, i) {
						 alert('' + pipe[i].name + ' translation error');
						 throw fail;
					 });
			} else {
				result=rules.matchAll(result, pipe[i].startRule, undefined, 
					 function(m, i) {throw objectThatDelegatesTo(fail, {errorPos: i}) });
			}
		}
		if (this.meta && decode!==true) 
			eval(result);
		return result;		
	},
	changed:function() {
		for (var i=0; i<this.references.length; i++)
			this.references[i].changed();
	},
	createGrammar:function(name, startRule, makeList, decode) {
		var g=Grammar(name, startRule, makeList);
		if (decode===true)
			this.decode[this.decode.length]=g;
		else
			this.code[this.code.length]=g;
		g.language=this;	
		return g;			
	},
	delete:function() {
		var i, w=this.workspace;
		if (this.references.length>0) 
			throw "'"+this.name+"' is used by "+this.referenceNames().join();
		for (i=this.code.length-1; i>=0; i--) {
			this.code[i].language=undefined;
			this.code[i].delete();
		}
		this.code=[];
		for (i=this.decode.length-1; i>=0; i--) { 
			this.decode[i].language=undefined;
			this.decode[i].delete();
		}
		this.decode=[];
		if (w!==undefined) {
			this.workspace=undefined;
			w.deleteLanguageObj(this);
		}
		return this;
	}, 
	deleteGrammar:function(name, decode) { 
		var g= (decode===undefined) ? this.code[name] : this.decode[name]; 
		if (g!==undefined)
			this.deletedGrammarObj(g, decode);
	},  
	deleteGrammarObj:function(grammarObj, decode) {  
		var i, l=(decode===undefined) ? this.code : this.decode; 
		i=l.indexOf(grammarObj);
		if (i>=0)
			l.splice(i,1);
		if (grammarObj.language!==undefined) {
			grammarObj.language=undefined;
			grammarObj.delete();
		} 
	},
	referenceNames:function() {
		var i, l=this.references.length, names=[];
		for (i=0; i<l; i++) {
			names[i]=this.references[i].name;
		}
		return names.sort();
	}, 
	refresh:function() {
		var i;
		for (i=0; i<this.code.length; i++) 
			this.code[i].refresh();
		for (i=0; i<this.decode.length; i++) 
			this.decode[i].refresh();
	}, 
	replaceWith:function(langObj) {
	// TODO: 
	},
	// private
	refByName:function() {
	},
	refByPtr:function() {
	} 
};

function View(name, contents, editor) {
	var v=objectThatDelegatesTo(ViewClass, {
		name: name,
		needsRefresh: false,
		id: undefined,
		editor: editor,
		references: [],
		language: undefined,
		grammarDefs: [],
		contents: contents,
		workspace: undefined});
	v.inputView=v;
	if (name === undefined)
		v.name="Unnamed";
	if (contents === undefined)
		v.contents="";
	if (editor === undefined)
		v.editor=ACEeditor("60px");	
	v.editor.contents=contents;	
	return v;
}

ViewClass={
	changed:function() {
		if (this.needsRefresh===false) {
			this.needsRefresh=true;
			if (this.workspace!==undefined)
				this.workspace.changed();
			for (var i=0; i<this.references.length; i++)
				this.references[i].changed();
			for (var i=0; i<this.grammarDefs.length; i++)
				this.grammarDefs[i].changed();
		}
		return;
	},
	delete:function() {
		var ds=this.grammarDefs, w=this.workspace;
		if (this.references.length>0) 
			throw "'"+this.name+"' is input to "+this.referenceNames().join();
		this.setInputViewObj();
		this.setLanguageObj();
		for (var i=ds.length-1; i>=0; i--) 
			ds[i].setDefViewObj();
		if (w!==undefined) {
			this.workspace=undefined;
			w.deleteViewObj(this);
		}
		return this;
	},
	focus:function() {
	// TODO: view gets focus
		this.workspace.currentView=this;
	},
	referenceNames:function() {
		var i, l=this.references.length, ns=[];
		for (i=0; i<l; i++) {
			ns[i]=this.references[i].name;
		}
		return ns.sort();
	},
	refresh:function() {
		var s;
		if (this.needsRefresh!==true) return;
		this.needsRefresh=undefined;
		if (this.inputView===this) {
			s=this.editor.contents;
		} else {
			this.inputView.refresh();
			s=this.inputView.contents;
		}
		this.language.refresh();
		this.contents=this.language.applyTo(s);	
		s=this.language.applyTo(this.contents,s);
		if (this.inputView===this) 
			this.editor.contents=s;
		else 
			this.inputView.contents=s;
		this.needsRefresh=false;
		this.workspace.changed();
	},
	replaceWith:function(viewObj) {
	// TODO: 
	},
	setInputView:function(name) {
		var v;
		if (this.workspace===undefined) 
			throw "Workspace not defined.";
		v=this.workspace.views[name];
		if (v===undefined)
			throw "View '"+name+"' not defined.";
		return this.setInputViewObj(v);
	},
	setInputViewObj:function(viewObj) {
		var i, v=this.inputView;
		if (v!==undefined && v!==this) {
			i=v.references.indexOf(this);
			if (i>=0)
				v.references.splice(i,1);
		}
		this.inputView= (viewObj===undefined) ? this : viewObj;			
		v=this.inputView;
		if (v!==this) {
			i=v.references.indexOf(this);
			if (i<0)
				v.references[v.references.length]=this;
		}
		return this;
	},
	setLanguage:function(name) {
		var l;
		if (this.workspace===undefined) 
			throw "Workspace not defined.";
		l=this.workspace.languages[name];
		if (l===undefined)
			throw "Language '"+name+"' not defined.";
		return this.setLanguageObj(l);
	},
	setLanguageObj:function(langObj) {
		var i, l=this.language;
		if (l!==undefined) {
			i=l.references.indexOf(this);
			if (i>=0)
				l.references.splice(i,1);
		}
		this.language=langObj;
		if (langObj!==undefined) {
			i=langObj.references.indexOf(this);
			if (i<0)
				langObj.references[langObj.references.length]=this;
		}
		return this;
	},
	// private
	refByName:function() {
	},
	refByPtr:function() {
	}
};

function Workspace(url) {
	var w=objectThatDelegatesTo(WorkspaceClass);
	if (url!==undefined) 
		w.load(url);
	else
		w.initialize();	
	return w;
}

WorkspaceClass = { 
	addLanguageObj:function(langObj) {
		if (this.languages[langObj.name]) 
			throw	"Language '"+langObj.name+"' already defined.";
		this.languages[this.languages.length]=langObj;
		this.languages[langObj.name]=langObj;
		this.changed();
		langObj.workspace=this;
		return langObj;		
	},
	addViewObj:function(viewObj,afterObj) {
		var i;
		if (this.views[viewObj.name]) 
			throw "View '"+viewObj.name+"' already defined.";
		i=this.views.indexOf(afterObj);
		i= (i>=0) ?	i+1 : this.views.length;
		this.views.splice(i,0,viewObj);
		this.views[viewObj.name]=viewObj;
		this.changed();
		viewObj.workspace=this;
		return viewObj;
	},
	changed:function() {
		this.unsaved=true;
	},
	createLanguage:function(name) {
		var l;
		if (this.languages[name])
			throw "Language '"+name+"' already defined.";
		l=Language(name);
		return this.addLanguageObj(l);		
	},
	createView:function(name,after) {
		var v;
		if (this.views[name]) 
			throw "View '"+name+"' already defined.";
		v=View(name);
		return this.addViewObj(v,this.views[after]);
	},
	deleteLanguageObj:function(langObj) {
		var i, w=langObj.workspace;
		if (this.languages[langObj.name]===undefined) 
			throw "Language '"+langObj.name+"' not defined.";
		if (w!==undefined) {
			langObj.workspace=undefined;
			try {
				langObj.delete();
			} catch (e) {
				langObj.workspace=w;
				return;
			}
		}
		if ((i=this.languages.indexOf(langObj))>=0)
			this.languages.splice(i,1);
		this.languages[langObj.name]=undefined;
		this.changed();
		return langObj;
	},
	deleteViewObj:function(viewObj) {
		var i, w=viewObj.workspace;
		if (this.views[viewObj.name]===undefined) 
			throw "View '"+viewObj.name+"' not defined.";
		if (w!==undefined) {
			viewObj.workspace=undefined;
			try {
				viewObj.delete();
			} catch (e) {
				viewObj.workspace=w;
				return;
			}
		}
		if ((i=this.views.indexOf(viewObj))>=0)
			this.views.splice(i,1);
		this.views[viewObj.name]=undefined;
		this.changed();
		return viewObj;
	},
	focusView:function(view) {
		var v=this.views[view];
		if (v!==undefined)
			v.focus();
	},
	initialize:function() {
		this.name="Unnamed";
		this.url=undefined;
		this.unsaved=true;
		this.languages=[];
		this.currentLanguage=null;
		this.views=[];
		this.currentView=null;
	},
	languageNames:function() {
		var i,names=[];
		for (i=0; i<this.languages.length; i++) {
			names[names.length]=this.languages[i].name;
		};
		names.sort();
		return names;
	},
	load:function(url) {
		this.initialize();
		this.url=url;
	// TODO: load data for workspace from url file
	// TODO: map loaded workspace data into workspace
	// temporary for getting starting 
		if (url=="getting-started.ws") {
			var ml, cl, el, rl, v, gv;
			this.setName("Getting Started");
			this.createLanguage();
			// TODO: improve interface to add grammar  
			ml=this.createLanguage("math");
			ml=ml.createGrammar("math","expression");
			cl=this.createLanguage("calculate");
			cl=cl.createGrammar("calculate","le",true);
			el=this.createLanguage("LET");
			el=el.createGrammar("LET","let",true);
			rl=this.createLanguage("raw");
			rl=rl.createGrammar("raw","it");
			// TODO: improve interface to add view, editor language
			v=this.addViewObj(View("Read Me First", 
		'Welcome to the Language Workbench for Language of Languages (LoLs).\n' +
		'Select a workspace and interact with it using the language areas below.\n' +
		'Each area displays the workspace according to a selected language.\n' +
		'Changes in one area update all other areas and the Language Element\n' +
		'Tree (LET) which defines the LoLs workspace.', 
				ACEeditor("100px", false, true)));
			v.setLanguage("raw");
			v=this.addViewObj(View("Math Problem", 
				"2+3*4", 
				ACEeditor("60px", false, false)));
			v.setLanguage("math");
			v=this.addViewObj(View("Answer", 
				"", 
				ACEeditor("60px", false, true)));
			v.setInputView("Math Problem");
			v.setLanguage("calculate");
			v=this.addViewObj(View("LET Explorer", 
				"", 
				ACEeditor("200px", false, true)));
			v.setInputView("Math Problem");
			v.setLanguage("LET");
			gv=this.addViewObj(View("Grammar", 
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
		'ometa raw {\n' +
		'  it = anything*\n' +
		'}', 
				ACEeditor("250px", true, false)));
			gv.setLanguage("ometa");
			// TODO: improve interface   
			ml.setDefViewObj(gv);
			cl.setDefViewObj(gv);
			el.setDefViewObj(gv);
			rl.setDefViewObj(gv);
			this.focusView("Math Problem")
		} 
		this.unsaved=false;
		return this;
	},
	refreshAll:function() {
		var i, l=this.views.length;
		for (i=0; i<l; i++) 
			this.views[i].refresh();
		this.changed();
	},
	refreshNeeded:function() {
		var i, l=this.views.length;
		for (i=0; i<l; i++) 
			if (this.views[i].needsRefresh)
				return true;
		return false;
	},
	removeLanguage:function(name) {
		var l=this.languages[name];
		if (l===undefined)
			throw "Language '"+name+"' not defined.";
		return this.deleteLanguageObj(l);
	},
	removeView:function(name) {
		var v=this.views[name];
		if (v===undefined)
			throw "View '"+name+"' not defined.";
		return this.deleteViewObj(v);
	},
	save:function(url) {
		if (url!==undefined)
			this.url=url;
		if (this.url===undefined) 
			throw "Need URL to save workspace.";
	// TODO: save workspace to url file
		this.unsaved=false;
	},
	setName:function(name) {
		if (name===undefined || name===null || name=="") 
			throw "Workspace name is required.";
		this.name=name;
		this.changed();
	},
};