function ACEeditor(info,view) {
	var ed=objectThatDelegatesTo(ACEeditorClass,
		{name:"ACE",
		 height:"60px",
		 gutters:false,
		 readOnly:false,
		 contents:"",
		 view:view});
	ed.deserialize(info);
	return ed;
}

ACEeditorClass={
	changed: function() {
		if (this.view!==undefined)
			this.view.changed();
	},
	createEditor:function(view) {
		var e, f;
		if (view===undefined)
			return;
		this.view=view;
		e=document.getElementById(view.id);
		e.style.position="relative"; 
		e.style.height=this.height;
		f=ace.edit(view.id);
		f.getSession().setMode('ace/mode/text');
		f.renderer.setShowGutter(this.gutters);
		if (this.contents!==undefined) {
			f.setValue(this.contents);
			this.contents=undefined;
		}
		f.setReadOnly(this.readOnly);
		f.clearSelection();
		e.editor=f;
		f.on('change',(function(ed) {return function() {ed.changed()}})(this));
		f.on('focus', (function(ed) {return function() {ed.focus()}})(this));
  },
	deserialize:function(info) {
		var e=document.getElementById(this.view.id);
		if (info===undefined)
			return this;
		if (typeof info.name=="string" && info.name=="ACE")
			this.name="ACE";
		if (typeof info.height=="string") 
			this.height=info.height;
		if (info.gutters===true) 
			this.gutters=true;
		if (info.gutters===false) 
			this.gutters=false;
		if (info.readOnly===true) 
			this.readOnly=true;
		if (info.readOnly===false) 
			this.readOnly=false;
		if (e!==undefined && e!=null) {
			e.style.height=this.height;
			e=e.editor;
  		e.renderer.setShowGutter(this.gutters);
  		e.setReadOnly(this.readOnly);
		}
		return this;
	}, 
  focus: function(force) {
  	if (force===true && this.view.id!==undefined) {
  		document.getElementById(this.view.id).editor.focus();
  		return;
  	}
  	if (this.view!==undefined)
  		this.view.focus();
  },
  getContents: function() {
  	var e;
  	if (this.view!==undefined && this.view.id!==undefined)
  		e=document.getElementById(this.view.id);
  	if (e===undefined || e===null)
  		return this.contents;
  	return e.editor.getValue();
  },
  getSelection: function () {
  	var e;
  	if (this.view!==undefined && this.view.id!==undefined)
  		e=document.getElementById(this.view.id);
  	if (e===undefined || e===null)
  		return '';
  	return e.editor.getSelectedText();
  },
  insert: function(s) {
  	var e;
  	if (this.view!==undefined && this.view.id!==undefined)
  		e=document.getElementById(this.view.id);
  	if (e===undefined || e===null)
  		return undefined;
	return e.editor.insert(s);
  },
    serialize:function(indent,all) {
		var s="{";
		s+='"name": "'+this.name+'"';
		if (all===true || this.height!=="60px")
			s+=', "height": "'+this.height+'"';
		if (this.gutters)
			s+=', "gutters": true';
		if (all===true && !this.gutters)
			s+=', "gutters": false';
		if (this.readOnly)
			s+=', "readOnly": true';			
		if (all===true && !this.readOnly)
			s+=', "readOnly": false';
		s+="}";
		return s; 
	},
	setContents: function(contents) {
  	var e;
  	if (this.view!==undefined && this.view.id!==undefined)
  		e=document.getElementById(this.view.id);
  	if (e===undefined || e===null)
  		this.contents=contents;
  	else {
  		e=e.editor;
  		contents=""+contents;
  		if (contents!=e.getValue()) {
				e.setValue(contents);
				e.gotoLine(0,0);
  		}
  	}
	}
};

function Grammar(info,language,decode) {
	var gram=objectThatDelegatesTo(GrammarClass,
		{name:"Unnamed",
		 startRule:"start",
		 makeList:false,
		 language:undefined,
		 defView:undefined});
	if (language!==undefined)
		language.addGrammar(gram,decode);
	gram.deserialize(info,true);
	return gram;
}

GrammarClass= {
	changed:function() {
		if (this.language!==undefined)
			this.language.changed();
	},
	delete:function() {
		var lang=this.language;
		this.setDefView();
		if (lang!==undefined) {
			this.language=undefined;
			lang.deleteGrammar(this);
		} 
	},
	deserialize:function(info,quiet) {
		var oldName=this.name, oldRules=this.rules;
		if (info===undefined) 
			return this;
		if (typeof info.name=="string" && info.name!="") {
			this.name=info.name;
			try {
				this.rules=eval(this.name);
			} catch (e) {
				this.rules=oldRules;
				if (quiet!==true) {
					this.name=oldName;
					throw "Unable to set rules for grammar '"+info.name+"'.";
				}
			} 
		}
		if (typeof info.startRule=="string" && info.startRule!="")
			this.startRule=info.startRule;
		if (info.makeList===true) 
			this.makeList=true;
		if (info.makeList===false) 
			this.makeList=false;
		if (typeof info.defView=="string") {
			try {
				if (info.defView=="")
					this.setDefView();
				else
					this.setDefView(info.defView);
			} catch (e) {
				alert(e);
			}
		}
		return this;
	},
	refresh:function() {
		var oldRules=this.rules;
		if (this.defView===undefined)
			return;
		this.defView.refresh();
		try {
			this.rules=eval(this.name);
		} catch (e) {
			alert("Unable to set rules for grammar '"+this.name+"'.");
			this.rules=oldRules;
		}
	},
	serialize:function(indent,all) {
		var s="{";
		if (indent==undefined)
			indent="";
		s+='"name": "'+this.name+'"';
		s+=',\n'+indent+' "startRule": "'+this.startRule+'"';
		if (this.makeList)
			s+=',\n'+indent+' "makeList": true';
		if (all===true && !this.makeList)
			s+=',\n'+indent+' "makeList": false';
		if (this.defView !== undefined)
			s+=',\n'+indent+' "defView": "'+this.defView.name+'"';
		if (all===true && this.defView === undefined)
			s+=',\n'+indent+' "defView": ""';
		s+="}";
		return s; 
	},
	setDefView:function(name) {
		var i, ds, view, old=this.defView;
		if (name!==undefined) {
			try {
				view=this.language.workspace.views[name];
			} catch (e) {
				throw "View '"+name+"' not available to define grammar.";
			}
		}
		if (old!==undefined) {
			i=old.grammarDefs.indexOf(this);
			if (i>=0)
				old.grammarDefs.splice(i,1);
		}
		this.defView=view;
		if (view!==undefined) {
			ds=view.grammarDefs;
			i=ds.indexOf(this);
			if (i<0)
				ds[ds.length]=this;
		}
	}
};

function Language(info,workspace) {
	var lang=objectThatDelegatesTo(LanguageClass,
		{name:"Unnamed",
		 meta:false,
		 code:[],
		 decode:[],
		 references:[],
		 workspace:undefined});
	if (typeof info.name=="string" && info.name!="")
		lang.name=info.name;
	if (workspace!==undefined)
		workspace.addLanguage(lang);
	lang.deserialize(info);
	return lang;
}

LanguageClass= {
	addGrammar:function(grammar,decode) {
		if (decode===true)
			this.decode[this.decode.length]=grammar;
		else
			this.code[this.code.length]=grammar;
		grammar.language=this;	
		return grammar;			
	}, 
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
					 function(list, pos) {
						 alert('' + pipe[i].name + ' translation error');
						 throw fail;
					 });
			} else {
				result=rules.matchAll(result, pipe[i].startRule, undefined, 
					 function(list, pos) {throw objectThatDelegatesTo(fail, {errorPos: pos}) });
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
		return Grammar(
				{name:name, 
				 startRule:startRule, 
				 makeList:makeList},this,decode);
	},
	delete:function() {
		var i, w=this.workspace;
		if (this.references.length>0) 
			throw "'"+this.name+"' is used by "+this.referenceNames().join(", ");
		if (w!==undefined) {
			this.workspace=undefined;
			try {
				w.deleteLanguage(this);
			} catch (e) {
				this.workspace=w;
				throw e;
			}
		}
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
		return this;
	}, 
	deleteGrammar:function(grammar, decode) {  
		var i, ls=(decode===true) ? this.decode : this.code; 
		i=ls.indexOf(grammar);
		if (i>=0)
			ls.splice(i,1);
		if (decode!==undefined) {
			i=this.decode.indexOf(grammar);
			if (i>=0)
				this.decode.splice(i,1);
		}
		if (grammar.language!==undefined) {
			grammar.language=undefined;
			grammar.delete();
		} 
	},
	deserialize:function(info) {
		var i;
		if (info === undefined)
			return this;
		if (typeof info.name=="string" && info.name!="")
			this.setName(info.name);
		if (info.meta===true)
			this.meta=true;
		if (info.meta===false)
			this.meta=false;
		if (info.code!==undefined) {
			for (i=this.code.length-1; i>=0; i--)
				this.code[i].delete();
			for (i=0; i<info.code.length; i++)
				Grammar(info.code[i],this);
		}
		if (info.decode!==undefined) {
			for (i=this.decode.length-1; i>=0; i--)
				this.decode[i].delete();
			for (i=0; i<info.decode.length; i++)
				Grammar(info.code[i],this,true);
		}
		return this;
	},
	referenceNames:function() {
		var i, len=this.references.length, names=[];
		for (i=0; i<len; i++) {
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
 	serialize:function(indent,all) {
		var i, s="{";
		if (indent==undefined)
			indent="";
		s+='"name": "'+this.name+'"';
		if (this.meta)
			s+=',\n'+indent+' "meta": true';
		if (!this.meta && all===true)
			s+=',\n'+indent+' "meta": false';
		if (this.code.length>0) {
			s+=',\n'+indent+' "code": [\n'+indent+'\t';
			for (i=0; i<this.code.length; i++) {
				if (i!=0) s+=',\n'+indent+'\t';
				s+=this.code[i].serialize(indent+'\t',all);
			}
			s+="]";
		}
		else {
			if (all===true)
				s+=',\n'+indent+' "code": []';
		}		
		if (this.decode.length>0) {
			s+=',\n'+indent+' "decode": [\n'+indent+'\t';
			for (i=0; i<this.decode.length; i++) {
				if (i!=0) s+=',\n'+indent+'\t';
				s+=this.decode[i].serialize(indent+'\t',all);
			}			
			s+="]";
		}
		else {
			if (all===true)
				s+=',\n'+indent+' "decode": []';
		}		
		s+="}";
		return s; 
	},
	setName:function(name) {
		var oldName=this.name;
		if (name==oldName)
			return;
		if (typeof name!="string" || name=="")
			throw "Language name required.";
		this.name=name;
		if (this.workspace===undefined)
			return;
		try {
			this.workspace.renameLanguage(oldName,name);
		} catch (e) {
			this.name=old;
			throw e;
		}
	}
};

function View(info,workspace,beforeView) {
	var view=objectThatDelegatesTo(ViewClass,
		{name:"Unnamed",
		 language:undefined,
		 needsRefresh:false,
		 editor:undefined,
		 inputView:undefined,
		 id:undefined,
		 references:[],
		 grammarDefs:[],
		 workspace:undefined});
	if (typeof info.name=="string" && info.name!="")
		view.name=info.name;
	view.editor=ACEeditor({},view);
	view.inputView=view;
	if (workspace!==undefined)
		workspace.addView(view,beforeView);
	view.deserialize(info);
	return view;
}

ViewClass={
	changed:function() {
		if (this.needsRefresh!==false) 
			return;
		this.needsRefresh=true;
		if (this.workspace!==undefined)
			this.workspace.changed();
		for (var i=0; i<this.references.length; i++)
			this.references[i].changed();
		for (var i=0; i<this.grammarDefs.length; i++)
			this.grammarDefs[i].changed();
		viewHasChanged(this);
	},
	createEditor:function (id) {
		this.id=id;
		this.editor.createEditor(this);
	},
	delete:function() {
		var ds=this.grammarDefs, w=this.workspace;
		if (this.references.length>0) 
			throw "'"+this.name+"' is input to "+this.referenceNames().join(',');
		this.setInputView();
		this.setLanguage();
		for (var i=ds.length-1; i>=0; i--) 
			ds[i].setDefView();
		if (w!==undefined) {
			this.workspace=undefined;
			w.deleteView(this);
		}
		return this;
	},
	deserialize:function(info) {
		if (info === undefined)
			return this;
		if (typeof info.name=="string" && info.name!="")
			this.setName(info.name);
		if (info.needsRefresh===true)
			this.needsRefresh=true;
		if (info.needsRefresh===false)
			this.needsRefresh=false;
		if (info.editor!==undefined) 
			this.editor=ACEeditor(info.editor,this);
		if (this.workspace !== undefined) {
			if (typeof info.language=="string")
				this.setLanguage(info.language);
			if (typeof info.inputView=="string")
				this.setInputView(info.inputView);
		}
		if (info.contents!==undefined)
			this.setContents(info.contents);
		return this;
	},
	focus:function(force) {
		if (force===true) 
			this.editor.focus(true);
		if (this.workspace!==undefined)
			this.workspace.focusView(this);
	},
	getContents:function() {
		return this.editor.getContents();
	},
	getInputContents:function() {
		if (this.inputView===this)
			return this.editor.getContents();
		return this.inputView.getOutputContents();
	},
	getOutputContents:function() {
		this.refresh();
		if (this.inputView===this)
			return this.contents;
		return this.editor.getContents();
	},
	getSelection: function() {
		return this.editor.getSelection();
	},
	insert: function(s) {
		return this.editor.insert(s);
	},
	isRefreshNeeded:function() {
		return this.needsRefresh;
	},
	referenceNames:function() {
		var i, len=this.references.length, ns=[];
		for (i=0; i<len; i++) {
			ns[i]=this.references[i].name;
		}
		return ns.sort();
	},
	refresh:function(force) {
		var source, result, view=this.workspace.currentView,
		    aceEditor=document.getElementById(this.id).editor;
		if (this.needsRefresh!==true && force!==true) return;
		this.needsRefresh=undefined;
		aceEditor.getSession().clearAnnotations();
		aceEditor.renderer.setShowGutter(this.editor.gutters);
		source=this.getInputContents();
		if (this.language!==undefined) {
			try {
				this.language.refresh();
				result=this.language.applyTo(source);
			} catch (e) {
				this.needsRefresh=true;
				if (e.errorPos!==undefined) {
					if (e.view===undefined) 
						e.view=this;
				}
				else 
					e=this.name+" error at unknown position\n\n"+e;
				throw e;
			}
		}
		else
			result=source;
		if (this.inputView===this) {
			this.contents=result;
			if (this.language!==undefined) {
				try {	
					this.editor.setContents(this.language.applyTo(this.contents,source));
				} catch (e) {
					this.needsRefresh=true;
					if (e.errorPos!==undefined) 
						e.view=this;
					else 
						e=this.name+" error at unknown position\n\n"+e;
					throw e;
				}
			}
		}
		else
			this.editor.setContents(result);
		this.needsRefresh=false;
		this.workspace.changed();
		refreshCompleted(this);
		if (view!==undefined && typeof view.name=="string")
			this.workspace.focus(view.name)
	},
	serialize:function(indent,all) {
		var i, s="{";
		if (indent==undefined)
			indent="";
		s+='"name": "'+this.name+'"';
		if (this.language!==undefined)
			s+=',\n'+indent+' "language": "'+this.language.name+'"';
		if (this.inputView!==undefined && (this.inputView!==this || all===true))
			s+=',\n'+indent+' "inputView": "'+this.inputView.name+'"';		
		if (this.needsRefresh)
			s+=',\n'+indent+' "needsRefresh": true';		
		if (!this.needsRefresh && all===true)
			s+=',\n'+indent+' "needsRefresh": false';		
		if (this.editor!==undefined)
			s+=',\n'+indent+' "editor": '+this.editor.serialize(indent+'\t',all);
		if (this.getContents() !== "" || all===true)
			s+=',\n'+indent+' "contents": '+JSON.stringify(this.getContents());
		s+="}";
		return s; 
	},
	setContents:function(contents) {
		if (this.editor !==undefined)
			this.editor.setContents(contents);
	},
	setInputView:function(name) {
		var i, old=this.inputView, view;
		if (this.workspace===undefined) 
			throw "Workspace not defined.";
		if (typeof name=="string" && name!="") {
			view=this.workspace.views[name];
			if (view===undefined)
				throw "View '"+name+"' not defined.";
		}
		if (old!==undefined && old!==this) {
			i=old.references.indexOf(this);
			if (i>=0)
				old.references.splice(i,1);
		}
		this.inputView= (view===undefined) ? this : view;			
		view=this.inputView;
		if (view!==this) {
			i=view.references.indexOf(this);
			if (i<0)
				view.references[view.references.length]=this;
		}
		return;
	},
	setLanguage:function(name) {
		var i, old=this.language, lang;
		if (this.workspace===undefined) 
			throw "Workspace not defined.";
		if (typeof name=="string" && name!="") {
			lang=this.workspace.languages[name];
			if (lang===undefined)
				throw "Language '"+name+"' not defined.";
		}
		if (old!==undefined) {
			i=old.references.indexOf(this);
			if (i>=0)
				old.references.splice(i,1);
		}
		this.language=lang;
		if (lang!==undefined) {
			i=lang.references.indexOf(this);
			if (i<0)
				lang.references[lang.references.length]=this;
		}
		switchLang(old,lang);
	},
	setName:function(name) {
		var oldName=this.name;
		if (name==oldName)
			return;
		if (typeof name!="string" || name=="")
			throw "View name required.";
		this.name=name;
		if (this.workspace===undefined)
			return;
		try {
			this.workspace.renameView(oldName,name);
		} catch (e) {
			this.name=oldName;
			throw e;
		}
	}
};

function Workspace(info) {
	var i, ls, w=objectThatDelegatesTo(WorkspaceClass,
		{name:"Unnamed",
		 unsaved:true,
		 languages:[],
		 currentLanguage:undefined,
		 views:[],
		 currentView:undefined});
	if (info === undefined) 
		return w;
	if (typeof info.name=="string" && info.name!="")
		w.setName(info.name);
	ls=info.languages;
	if (ls!==undefined) {
		for (i=0; i<ls.length; i++) 
			w.createLanguage(ls[i].name); 
	}
	ls=info.views;
	if (ls!==undefined) {
		for (i=0; i<ls.length; i++) 
			w.createView(ls[i].name);
	}
	ls=info.languages;
	if (ls!==undefined) {
		for (i=0; i<ls.length; i++) 
			w.languages[ls[i].name].deserialize(ls[i]); 
	}
	ls=info.views;
	if (ls!==undefined) {
		for (i=0; i<ls.length; i++) 
			w.views[ls[i].name].deserialize(ls[i]); 
	}
	if (typeof info.currentView=="string" && info.currentView!="")
		w.focus(info.currentView);
	return w;
}

WorkspaceClass = { 
	addLanguage:function(lang) {
		if (lang===undefined)
			throw "Language to add is undefined."; 
		if (this.languages[lang.name]!==undefined) 
			throw	"Language '"+lang.name+"' already defined.";
		if (lang.workspace!==undefined)
			throw	"Language '"+lang.name+"' already in workspace.";
		this.languages[this.languages.length]=lang;
		this.languages[lang.name]=lang;
		lang.workspace=this;
		this.changed();
		return lang;		
	},
	addView:function(view,viewBefore) {
		var i;
		if (view===undefined)
			throw "View to add is undefined."; 
		if (this.views[view.name]!==undefined) 
			throw "View '"+view.name+"' already defined.";
		if (view.workspace!==undefined) 
			throw "View '"+view.name+"' already in workspace.";
		if (viewBefore!="") {
			i=this.views.indexOf(viewBefore);
			i= (i>=0) ?	i+1 : this.views.length;
		}
		else
			i=0;
		this.views.splice(i,0,view);
		this.views[view.name]=view;
		view.workspace=this;
		this.changed();
		return view;
	},
	changed:function() {
		this.unsaved=true;
	},
	createLanguage:function(name) {
		if (this.languages[name]!==undefined)
			throw "Language '"+name+"' already defined.";
		return Language({name:name},this);		
	},
	createView:function(name,before) {
		if (this.views[name]!==undefined) 
			throw "View '"+name+"' already defined.";
		return View({name:name},this,this.views[before]);
	},
	deleteLanguage:function(lang) {
		var i, l;
		if (lang===undefined)
			throw "Language to delete required";
		l=this.languages[lang.name];
		if (l===undefined) 
			throw "Language '"+lang.name+"' not defined.";
		if (lang!==l)
			throw	"Language '"+lang.name+"' in another workspace.";
		if (lang.workspace!==undefined) 
			lang.delete();
		if ((i=this.languages.indexOf(lang))>=0)
			this.languages.splice(i,1);
		delete this.languages[lang.name];
		this.changed();
		return lang;
	},
	deleteView:function(view) {
		var i, v;
		if (view===undefined)
			throw "View to delete required";
		v=this.views[view.name];
		if (v===undefined) 
			throw "View '"+view.name+"' not defined.";
		if (view!==v)
			throw	"View '"+view.name+"' in another workspace.";
		if (view.workspace!==undefined) 
			view.delete();
		if ((i=this.views.indexOf(view))>=0)
			this.views.splice(i,1);
		delete this.views[view.name];
		if (this.currentView===view)
			this.currentView=undefined;
		this.changed();
		return view;
	},
	focus:function(name) {
		var view=this.views[name];
		if (view!==undefined)
			view.focus(true);
		else {
			this.languageView=undefined;
			this.currentView=undefined;
		}
	},
	focusView:function(view) {
		var lang=this.currentLanguage, name;
		if (this.views.indexOf(view)<0) {
			name= (view===undefined) ? 'undefined' : "'"+view.name+"'";
			throw "View: "+name+" not in workspace.";
		}
		this.currentView=view;
		this.currentLanguage=view.language;
		switchLang(lang,this.currentLanguage);
	},
	isRefreshNeeded:function() {
		var i, len=this.views.length;
		for (i=0; i<len; i++) 
			if (this.views[i].isRefreshNeeded())
				return true;
		return false;
	},
	languageNames:function() {
		var i, len=this.languages.length, names=[];
		for (i=0; i<len; i++) {
			names[names.length]=this.languages[i].name;
		};
		names.sort();
		return names;
	},
	refreshAll:function(force) {
		var i, len=this.views.length, v=this.currentView;
		if (force === true) {
			for (i=0; i<len; i++) {
				this.views[i].needsRefresh=true;
				viewHasChanged(this.views[i]);
			}
		}
		for (i=0; i<len; i++) 
			this.views[i].refresh();
		if (this.views.length>0)
			this.changed();
		if (v!==undefined && typeof v.name=="string")
			this.focus(v.name);
	},
	removeLanguage:function(name) {
		var lang=this.languages[name];
		if (lang===undefined)
			throw "Language '"+name+"' not defined.";
		return this.deleteLanguage(lang);
	},
	renameLanguage:function(oldName,newName) {
		var lang=this.languages[oldName], l=this.languages[newName], wsp;
		if (lang!==undefined && lang===l)
			return;
		if (lang===undefined)
			throw "Language '"+oldName+"' not defined.";
		if (typeof newName!="string" || newName=="")
			throw "Language name required.";
		if (this.languages[newName]!==undefined) 
			throw "Language '"+newName+"' is already defined.";
		delete this.languages[oldName];
		this.languages[newName]=lang;
		try {
			wsp=lang.workspace;
			lang.workspace=undefined;
			lang.setName(newName);
			lang.workspace=wsp;
		} catch (e) {
			this.languages[oldName]=lang;
			delete this.languages[newName];
			lang.workspace=wsp;
			throw e;
		}
		this.changed();
	},
	removeView:function(name) {
		var view=this.views[name];
		if (view===undefined)
			throw "View '"+name+"' not defined.";
		return this.deleteView(view);
	},
	renameView:function(oldName,newName) {
		var view=this.views[oldName], v=this.views[newName], wsp;
		if (view!==undefined && view===v)
			return;
		if (view===undefined)
			throw "View '"+oldName+"' not defined.";
		if (typeof newName!="string" || newName=="")
			throw "View name required.";
		if (v!==undefined) 
			throw "View '"+newName+"' is already defined.";
		delete this.views[oldName];
		this.views[newName]=view;
		try {
			wsp=view.workspace;
			view.workspace=undefined;
			view.setName(newName);
			view.workspace=wsp;
		} catch (e) {
			this.views[oldName]=view;
			delete this.views[newName];
			view.workspace=wsp;
			throw e;
		}
		this.changed();
	},
	serialize:function(indent,all) {
		var i, s="";
		if (indent==undefined)
			indent="";
		s+=indent+'{';
		s+='"name": "'+this.name+'"';
		if (this.languages.length>0 || all===true) {
			s+=',\n'+indent+' "languages": [\n'+indent+'\t';
			for (i=0; i<this.languages.length; i++) {
				if (i!=0) s+=',\n'+indent+'\t';
				s+=this.languages[i].serialize(indent+'\t',all);
			}
			s+="]";
		}
		if (this.views.length>0 || all===true) {
			s+=',\n'+indent+' "views": [\n'+indent+'\t';
			for (i=0; i<this.views.length; i++) {
				if (i!=0) s+=',\n'+indent+'\t';
				s+=this.views[i].serialize(indent+'\t',all);
			}			
			s+="]";
		}
		if (this.currentView!==undefined) 
			s+=',\n'+indent+' "currentView": "'+this.currentView.name+'"';
		if (this.currentView===undefined && all===true) 
			s+=',\n'+indent+' "currentView": undefined';
		s+="}";
		return s; 
	},
	setName:function(name) {
		if (typeof name!="string" || name=="") 
			throw "Workspace name is required.";
		this.name=name;
		this.changed();
	},
};