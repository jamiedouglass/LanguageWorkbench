// Create a new YUI instance and populate it with the required modules.

YUI({useBrowserconsole: true}).use('test', function (Y) {
	var lolsWorkspaceTest = new Y.Test.Case({
		name: "LoLs default Workspace",
		setUp: function () {
			this.wsp = Workspace();
		},
		tearDown: function () {
			delete this.data;
		},
		testDefaultWorkspaceSetup : function() {
			Y.Assert.areEqual("Unnamed",this.wsp.name, "Workspace Name"); 
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved?"); 
			Y.Assert.areEqual(0,this.wsp.views.length, "number of views"); 
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view"); 
			Y.Assert.areEqual(0,this.wsp.languages.length, "number of languages"); 
			Y.Assert.areEqual(undefined,this.wsp.currentLanguage, "current language"); 
		},
		testCreateLanguage: function() {
			var lang, err;
			this.wsp.createLanguage("first");
			Y.Assert.areEqual(1,this.wsp.languages.length, "number of languages");
			lang=this.wsp.languages[0];
			Y.Assert.areEqual("first",lang.name, "language name");
			Y.Assert.areEqual(false,lang.meta, "Is meta");
			Y.Assert.areEqual(0,lang.code.length, "number of code grammars");
			Y.Assert.areEqual(0,lang.decode.length, "number of decode grammars");
			Y.Assert.areEqual(0,lang.references.length, "no language references");
			Y.Assert.areEqual(this.wsp,lang.workspace, "in this workspace");
			try {
				this.wsp.createLanguage("first");
			} catch (e) {
				if (e=="Language 'first' already defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err, "no duplicate languages");
			Y.Assert.areEqual(1,this.wsp.languages.length, "number of languages");
			Y.Assert.areEqual(lang,this.wsp.languages[0], "language not changed");			
			try {
				this.wsp.addLanguage(lang);
			} catch (e) {
				if (e=="Language 'first' already defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err, "no duplicate languages");
			Y.Assert.areEqual(1,this.wsp.languages.length, "number of languages");
			Y.Assert.areEqual(lang,this.wsp.languages[0], "language not changed");			
		},
		testCreateView: function() {
			var view, ed, err;
			this.wsp.createView("first");
			Y.Assert.areEqual(1,this.wsp.views.length, "number of views");
			view=this.wsp.views[0];
			Y.Assert.areEqual("first",view.name, "view name");
			Y.Assert.areEqual(undefined,view.language, "view language");
			Y.Assert.areEqual(false,view.needsRefresh, "view needs refresh");
			Y.Assert.areEqual(view,view.inputView, "view input view is itself");
			Y.Assert.areEqual(undefined,view.id, "view id");
			Y.Assert.areEqual(0,view.references.length, "number of view references");
			Y.Assert.areEqual(0,view.grammarDefs.length, "number of grammar definitions");
			Y.Assert.areEqual(this.wsp,view.workspace, "in this workspace");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name, "editor name");
			Y.Assert.areEqual("60px",ed.height, "editor height");
			Y.Assert.areEqual(false,ed.gutters, "editor gutters");
			Y.Assert.areEqual(false,ed.readOnly, "editor read only");
			Y.Assert.areEqual("",ed.contents, "editor contents");
			Y.Assert.areEqual(view,ed.view, "editor in this view");			
			try {
				this.wsp.createView("first");
			} catch (e) {
				if (e=="View 'first' already defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err, "no duplicate views");
			Y.Assert.areEqual(1,this.wsp.views.length, "number of views");
			Y.Assert.areEqual(view,this.wsp.views[0], "view not changed");			
			try {
				this.wsp.addView(view);
			} catch (e) {
				if (e=="View 'first' already defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err, "no duplicate views");
			Y.Assert.areEqual(1,this.wsp.views.length, "number of views");
			Y.Assert.areEqual(view,this.wsp.views[0], "view not changed");			
		},
		testFocus: function() {
			var view, err;
			this.wsp.createView("first");
			this.wsp.focus("first");
			view=this.wsp.currentView;
			Y.Assert.areEqual("first",view.name, "current view name");
			this.wsp.focus();
			Y.Assert.areEqual(undefined,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view");
			this.wsp.focus("first");
			view=this.wsp.currentView;
			Y.Assert.areEqual("first",view.name, "current view name");
			try {
				this.wsp.focusView();
			} catch (e) {
				if (e=="View: undefined not in workspace.")
					err=1;
			}
			Y.Assert.areEqual(1,err, "View: undefined not in workspace.");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view is the same");
			try {
				this.wsp.focusView(View({name:'Not Me'}));
			} catch (e) {
				if (e=="View: 'Not Me' not in workspace.")
					err=2;
			}
			Y.Assert.areEqual(2,err, "View: 'Not Me' not in workspace.");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view is the same");
		},	
		testIsRefreshNeeded: function () {
			Y.Assert.areEqual(false,this.wsp.isRefreshNeeded(),"Is refresh needed");
		},
		testLanguageNames: function () {
			Y.Assert.areEqual(0,this.wsp.languageNames().length,"number of language names");
		},
		testRefreshAll: function () {
			this.wsp.unsaved=false;
			Y.Assert.areEqual(undefined,this.wsp.refreshAll(true),"force refresh all");
			Y.Assert.areEqual(false,this.wsp.unsaved, "Is workspace unsaved?"); 
		},
		testWorkspaceSerialize: function () { 
			Y.Assert.areEqual('{"name": "Unnamed"}',this.wsp.serialize(),"Workspace serialize");
			Y.Assert.areEqual('{"name": "Unnamed",\n "languages": [\n	],\n' +
				' "views": [\n	],\n "currentView": undefined}',this.wsp.serialize('',true),
				"Workspace serialize all");
			Y.Assert.areEqual(' {"name": "Unnamed",\n  "languages": [\n 	],\n ' +
				' "views": [\n 	],\n  "currentView": undefined}',this.wsp.serialize(' ',true),
				"Workspace serialize all and indent ' '");
		},
		testWorkspaceSetName: function() {
			var err;
			this.wsp.unsaved=false;
			this.wsp.setName("My Work");
			Y.Assert.areEqual("My Work",this.wsp.name,"Workspace Name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved?"); 
			this.wsp.unsaved=false;
			try {
				this.wsp.setName();
			} catch (e) {
				if (e=="Workspace name is required.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"should catch setting name to undefined");
			Y.Assert.areEqual("My Work",this.wsp.name,"Workspace Name should be the same");
			try {
				this.wsp.setName("");
			} catch (e) {
				if (e=="Workspace name is required.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"should catch setting name to ''");
			Y.Assert.areEqual("My Work",this.wsp.name,"Workspace Name should be the same");
			Y.Assert.areEqual(false,this.wsp.unsaved, "Is workspace unsaved?");
			Y.Assert.areEqual('{"name": "My Work"}',this.wsp.serialize(),"Workspace serialize");
		}
	});			
	var lolsBasicWorkspaceTest = new Y.Test.Case({
		name : "LoLs Basic Workspace",
		setUp : function() {
			this.wsp=Workspace(
			{name:"Basic",
			 languages: [
				 {name: "ometa",
					meta: true,
					code: [
					 {name: "BSOMetaJSParser",
						startRule: "topLevel"},
					 {name: "BSOMetaJSTranslator",
						startRule: "trans",
						makeList: true}]}],
				views: [
				 {name: "Raw Grammar",
					language: "ometa",
					editor: {name: "ACE", height: "100px", gutters: false},
					contents: "ometa newRaw {\n  start = anything*\n}"}],
				 currentView: "LET Grammar"});
		},
		tearDown : function() {
			delete this.data;
		},
		testWorkspaceSetup: function() {
			var lang, grammar, view, ed;
			Y.Assert.areEqual("Basic",this.wsp.name, "workspace name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved");
			Y.Assert.areEqual(1,this.wsp.languages.length, "number of languages");
			lang=this.wsp.languages[0];
			Y.Assert.areEqual(lang,this.wsp.languages["ometa"], "first language by name");
			Y.Assert.areEqual(1,this.wsp.views.length, "number of views");
			view=this.wsp.views[0];
			Y.Assert.areEqual(view,this.wsp.views["Raw Grammar"], "first view by name");
			Y.Assert.areEqual("ometa",lang.name, "language name");
			Y.Assert.areEqual(true,lang.meta, "Is language meta");
			Y.Assert.areEqual(2,lang.code.length, "number of code grammars");
			grammar=lang.code[0];
			Y.Assert.areEqual("BSOMetaJSParser",grammar.name, "first grammar name");
			Y.Assert.areEqual("topLevel",grammar.startRule, "first grammar start rule");
			Y.Assert.areEqual(BSOMetaJSParser,grammar.rules, "first grammar rules");
			Y.Assert.areEqual(false,grammar.makeList, "first grammar make list");
			Y.Assert.areEqual(lang,grammar.language, "first grammar in language");
			Y.Assert.areEqual(undefined,grammar.defView, "first grammar not defined in view");
			grammar=lang.code[1];
			Y.Assert.areEqual("BSOMetaJSTranslator",grammar.name, "second grammar name");
			Y.Assert.areEqual("trans",grammar.startRule, "second grammar start rule");
			Y.Assert.areEqual(BSOMetaJSTranslator,grammar.rules, "second grammar rules");
			Y.Assert.areEqual(true,grammar.makeList, "second grammar make list");
			Y.Assert.areEqual(lang,grammar.language, "second grammar in language");
			Y.Assert.areEqual(undefined,grammar.defView, "second grammar not defined in view");			
			Y.Assert.areEqual(0,lang.decode.length, "no decode grammars");
			Y.Assert.areEqual(1,lang.references.length, "number of references for language");
			Y.Assert.areEqual(view,lang.references[0], "first language reference");
			Y.Assert.areEqual(this.wsp,lang.workspace, "language in workspace");
			Y.Assert.areEqual("Raw Grammar",view.name, "view name");
			Y.Assert.areEqual(lang,view.language, "language for view");
			Y.Assert.areEqual(false,view.needsRefresh, "view needs refresh");
			Y.Assert.areEqual(view,view.inputView, "input view is itself");
			Y.Assert.areEqual(undefined,view.id, "view id");
			Y.Assert.areEqual(0,view.references.length, "number of view references");
			Y.Assert.areEqual(0,view.grammarDefs.length, "number of grammar definition");
			Y.Assert.areEqual(this.wsp,view.workspace, "view is in workspace");				 
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name, "editor name");
			Y.Assert.areEqual("100px",ed.height, "editor height");
			Y.Assert.areEqual(true,ed.gutters, "editor gutters");
			Y.Assert.areEqual(false,ed.readOnly, "editor read only");
			Y.Assert.areEqual("ometa newRaw {\n  start = anything*\n}",
				ed.contents,"editor contents");
			Y.Assert.areEqual(view,ed.view, "editor in view");	
			Y.Assert.areEqual(undefined,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view");				 
		},
		testAddLanguage: function() {
			var lang, err, otherWsp;
			this.wsp.unsaved=false;
			this.wsp.addLanguage({name:"lang 2"});
			Y.Assert.areEqual(2,this.wsp.languages.length, "number of languages");
			lang=this.wsp.languages[0];
			Y.Assert.areEqual('ometa',lang.name, "first language name");
			Y.Assert.areEqual(lang,this.wsp.languages["ometa"], "language by name");
			lang=this.wsp.languages[1];
			Y.Assert.areEqual("lang 2",lang.name, "second language name");
			Y.Assert.areEqual(lang,this.wsp.languages["lang 2"], "language by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "workspace unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.addLanguage(this.wsp.languages[0]);
			} catch (e) {
				if (e=="Language 'ometa' already defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"Language 'ometa' already defined.");
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");
			try {
				this.wsp.addLanguage(this.wsp.languages[1]);
			} catch (e) {
				if (e=="Language 'lang 2' already defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"Language 'lang 2' already defined.");
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");
			otherWsp=Workspace();
			otherWsp.createLanguage("new");					
			try {
				this.wsp.addLanguage(otherWsp.languages[0]);
			} catch (e) {
				if (e=="Language 'new' already in workspace.")
					err=3;
			}
			Y.Assert.areEqual(3,err,"no language from another workspace");
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of language");
			try {
				this.wsp.addLanguage();
			} catch (e) {
				if (e=="Language to add is undefined.")
					err=4;
			}
			Y.Assert.areEqual(4,err,"language object missing");
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");						
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
		},
		testAddView: function() {
			var rawView=this.wsp.views["Raw Grammar"], view;
			this.wsp.unsave=false;
			this.wsp.addView({name:"view 2"},rawView);
			Y.Assert.areEqual(2,this.wsp.views.length, "number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0],"first view");			
			Y.Assert.areEqual(rawView,this.wsp.views["Raw Grammar"],
				"'Raw Grammar' view by name");			
			view=this.wsp.views[1];
			Y.Assert.areEqual("view 2",view.name, "view name");
			Y.Assert.areEqual(view,this.wsp.views["view 2"], "'view 2' view by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved");
			this.wsp.unsave=false;
			this.wsp.addView({name:"view 1"},rawView);
			Y.Assert.areEqual(3,this.wsp.views.length, "number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0],"first view");			
			Y.Assert.areEqual(rawView,this.wsp.views["Raw Grammar"],
				"'Raw Grammar' view by name");			
			view=this.wsp.views[1];
			Y.Assert.areEqual("view 1",view.name, "view name");
			Y.Assert.areEqual(view,this.wsp.views["view 1"], "'view 1' view by name");
			view=this.wsp.views[2];
			Y.Assert.areEqual("view 2",view.name, "view name");
			Y.Assert.areEqual(view,this.wsp.views["view 2"], "'view 2' view by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved");
			this.wsp.unsave=false;
			this.wsp.addView(View({name:"view 0"}),"");
			Y.Assert.areEqual(4,this.wsp.views.length, "number of views");
			view=this.wsp.views[0];
			Y.Assert.areEqual("view 0",view.name, "view name");
			Y.Assert.areEqual(view,this.wsp.views["view 0"], "'view 0' view by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved");
			this.wsp.unsave=false;
			this.wsp.addView({name:"view 3"},"end");
			Y.Assert.areEqual(5,this.wsp.views.length, "number of views");
			view=this.wsp.views[4];
			Y.Assert.areEqual("view 3",view.name, "view name");
			Y.Assert.areEqual(view,this.wsp.views["view 3"], "'view 3' view by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved");			
			Y.Assert.areEqual("view 0",this.wsp.views[0].name, "view name");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[1].name, "view name");
			Y.Assert.areEqual("view 1",this.wsp.views[2].name, "view name");
			Y.Assert.areEqual("view 2",this.wsp.views[3].name, "view name");
			Y.Assert.areEqual("view 3",this.wsp.views[4].name, "view name");	
		},
		testAddViewErrorChecking : function() {
			var err, otherWsp;
			this.wsp.unsaved=false
			try {
				this.wsp.addView();
			} catch (e) {
				if (e=="View to add is undefined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"View to add is undefined.");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(false,this.wsp.unsaved, "workspace unsaved");
			try {
				this.wsp.addView(this.wsp.views[0]);
			} catch (e) {
				if (e=="View 'Raw Grammar' already defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"View 'Raw Grammar' already defined.");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(false,this.wsp.unsaved, "workspace unsaved");
			otherWsp=Workspace();
			otherWsp.createView("new");
			try {
				this.wsp.addView(otherWsp.views[0]);
			} catch (e) {
				if (e=="View 'new' already in workspace.")
					err=3;
			}
			Y.Assert.areEqual(3,err,"View 'Raw Grammar' already in workspace.");
			Y.Assert.areEqual(1,this.wsp.views.length,"one view");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
		},
		testCreateLanguage: function() {
			var lang, err;
			this.wsp.unsaved=false;
			this.wsp.createLanguage("lang 2");
			Y.Assert.areEqual(2,this.wsp.languages.length, "number of languages");
			lang=this.wsp.languages[0];
			Y.Assert.areEqual('ometa',lang.name, "first language name");
			Y.Assert.areEqual(lang,this.wsp.languages["ometa"], "language by name");
			lang=this.wsp.languages[1];
			Y.Assert.areEqual("lang 2",lang.name, "second language name");
			Y.Assert.areEqual(lang,this.wsp.languages["lang 2"], "language by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "workspace unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.addLanguage(this.wsp.languages[0]);
			} catch (e) {
				if (e=="Language 'ometa' already defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"Language 'ometa' already defined.");
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");
		},
		testCreateView: function() {
			var view, err;
			this.wsp.unsave=false;
			this.wsp.createView("view 2","Raw Grammar");
			Y.Assert.areEqual(2,this.wsp.views.length, "number of views");
			view=this.wsp.views[1];
			Y.Assert.areEqual(view,this.wsp.views["view 2"], "view by name");
			this.wsp.createView("view 1","Raw Grammar");
			Y.Assert.areEqual(3,this.wsp.views.length, "number of views");
			view=this.wsp.views[1];
			Y.Assert.areEqual(view,this.wsp.views["view 1"], "view by name");
			this.wsp.addView(View({name:"view 0"}),"");
			Y.Assert.areEqual(4,this.wsp.views.length, "number of views");
			view=this.wsp.views[0];
			Y.Assert.areEqual(view,this.wsp.views["view 0"], "view by name");
			this.wsp.addView({name:"view 3"},"end");
			Y.Assert.areEqual(5,this.wsp.views.length, "number of views");
			view=this.wsp.views[4];
			Y.Assert.areEqual(view,this.wsp.views["view 3"], "view by name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
			Y.Assert.areEqual("view 0",this.wsp.views[0].name, "view name");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[1].name, "view name");
			Y.Assert.areEqual("view 1",this.wsp.views[2].name, "view name");
			Y.Assert.areEqual("view 2",this.wsp.views[3].name, "view name");
			Y.Assert.areEqual("view 3",this.wsp.views[4].name, "view name");	
			this.wsp.unsaved=false
			try {
				this.wsp.createView("Raw Grammar");
			} catch (e) {
				if (e=="View 'Raw Grammar' already defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"View 'Raw Grammar' already defined.");
			Y.Assert.areEqual(5,this.wsp.views.length,"number of views");
			Y.Assert.areEqual("view 0",this.wsp.views[0].name, "view name");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[1].name, "view name");
			Y.Assert.areEqual("view 1",this.wsp.views[2].name, "view name");
			Y.Assert.areEqual("view 2",this.wsp.views[3].name, "view name");
			Y.Assert.areEqual("view 3",this.wsp.views[4].name, "view name");	
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
		},
		testDeleteLanguage: function() {
			var lang, err;
			this.wsp.createLanguage('new');
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");
			lang=this.wsp.languages['new'];
			this.wsp.views[0].setLanguage('new');
			this.wsp.focus("Raw Grammar");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			this.wsp.unsaved=false;
			lang=this.wsp.languages['ometa'];
			this.wsp.deleteLanguage(lang);
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(0,lang.references.length,"number of language references");
			lang=this.wsp.languages['ometa'];
			Y.Assert.areEqual(undefined,lang,"ometa language not defined");
			Y.Assert.areNotEqual(lang,this.wsp.currentLanguage,"ometa not current language");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			lang=this.wsp.currentLanguage;
			try {
				this.wsp.deleteLanguage();
			} catch (e) {
				if (e=="Language to delete required")
					err=1;
			}
			Y.Assert.areEqual(1,err,"Language to delete required");
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.deleteLanguage(Language({name:'Not Me'}));
			} catch (e) {
				if (e=="Language 'Not Me' not defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"Language 'Not Me' not defined.");
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.deleteLanguage(Language({name:'new'}));
			} catch (e) {
				if (e=="Language 'new' in another workspace.")
					err=3;
			}
			Y.Assert.areEqual(3,err,"Language 'new' in another workspace.");
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
		},
		testDeleteView: function() {
			var view, rawView, err;
			this.wsp.createView('new','end');
			Y.Assert.areEqual(2,this.wsp.views.length,"number of views");
			view=this.wsp.views['new'];
			rawView=this.wsp.views[0];
			this.wsp.focus("Raw Grammar");
			Y.Assert.areEqual(view,this.wsp.views[1], "second view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			this.wsp.unsaved=false;
			this.wsp.deleteView(view);
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.deleteView();
			} catch (e) {
				if (e=="View to delete required")
					err=1;
			}
			Y.Assert.areEqual(1,err,"View to delete required");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0], "first view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.deleteView(View({name:'Not Me'}));
			} catch (e) {
				if (e=="View 'Not Me' not defined.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"View 'Not Me' not defined.");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0], "first view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.deleteView(View({name:'Raw Grammar'}));
			} catch (e) {
				if (e=="View 'Raw Grammar' in another workspace.")
					err=3;
			}
			Y.Assert.areEqual(3,err,"View 'Raw Grammar' in another workspace.");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0], "first view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			this.wsp.deleteView(rawView);
			Y.Assert.areEqual(0,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
		},		
		testFocus: function() {
			var lang=this.wsp.languages[0], view=this.wsp.views[0];
			this.wsp.focus();
			Y.Assert.areEqual(undefined,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view");				 
			this.wsp.focus("Raw Grammar");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view");				 
		},
		testFocusView: function() {
			var lang=this.wsp.languages[0], view=this.wsp.views[0], err;
			this.wsp.focus();
			Y.Assert.areEqual(undefined,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(undefined,this.wsp.currentView, "current view");				 
			this.wsp.focusView(view);
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view");	
			try {
				this.wsp.focusView(View({name:'Not Me'}));
			} catch (e) {
				if (e=="View: 'Not Me' not in workspace.")
					err=1
			}			 
			Y.Assert.areEqual(1,err,"View: 'Not Me' not in workspace.");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view");	
			err=0;	
			try {
				this.wsp.focusView();
			} catch (e) {
				if (e=="View: undefined not in workspace.")
					err=1
			}			 
			Y.Assert.areEqual(1,err,"View: undefined not in workspace.");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(view,this.wsp.currentView, "current view");	
		},
		testIsRefreshNeeded:function() {
			var view=this.wsp.views[0];
			view.needsRefresh=true;
			Y.Assert.areEqual(true,this.wsp.isRefreshNeeded(),"is refresh needed");
			view.needsRefresh=false;
			Y.Assert.areEqual(false,this.wsp.isRefreshNeeded(),"is refresh needed");
			view.changed();
			Y.Assert.areEqual(true,this.wsp.isRefreshNeeded(),"is refresh needed");
		},
		testLanguageNames: function() {
			var names=this.wsp.languageNames();
			Y.Assert.areEqual(1,names.length,"number of language names");
			Y.Assert.areEqual("ometa",names[0],"only language name");
			this.wsp.createLanguage("z");
			this.wsp.createLanguage("a");
			this.wsp.createLanguage("A");
			this.wsp.createLanguage("Z");
			names=this.wsp.languageNames();
			Y.Assert.areEqual(5,names.length,"number of language names");
			Y.Assert.areEqual("A",names[0],"1st language name");
			Y.Assert.areEqual("Z",names[1],"2nd language name");
			Y.Assert.areEqual("a",names[2],"3rd language name");
			Y.Assert.areEqual("ometa",names[3],"4th language name");
			Y.Assert.areEqual("z",names[4],"5th language name");		
		},
		testRefreshAll : function () {
			var view=this.wsp.views[0], lang;
			view.changed();
			Y.Assert.areEqual(true,this.wsp.isRefreshNeeded(),"is refresh needed");
			this.wsp.refreshAll();
			Y.Assert.areEqual(false,this.wsp.isRefreshNeeded(),"is refresh needed");
			this.wsp.refreshAll(true);
			Y.Assert.areEqual(false,this.wsp.isRefreshNeeded(),"is refresh needed");
			lang=Language({name: "RAW", code: [{name: "newRaw", startRule: "start"}]});
			Y.Assert.areEqual("newRaw",lang.code[0].name,"language code name");
			Y.Assert.areEqual("start",lang.code[0].startRule,"language start rule");
			Y.Assert.areEqual(newRaw,lang.code[0].rules,"language rules");
			Y.Assert.areNotEqual(undefined,newRaw.start,"start in newRaw");
		},
		testRemoveLanguage: function() {
			var lang, err;
			this.wsp.createLanguage('new');
			Y.Assert.areEqual(2,this.wsp.languages.length,"number of languages");
			lang=this.wsp.languages['new'];
			this.wsp.views[0].setLanguage('new');
			this.wsp.focus("Raw Grammar");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			this.wsp.unsaved=false;
			lang=this.wsp.languages['ometa'];
			this.wsp.removeLanguage('ometa');
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(0,lang.references.length,"number of language references");
			lang=this.wsp.languages['ometa'];
			Y.Assert.areEqual(undefined,lang,"ometa language not defined");
			Y.Assert.areNotEqual(lang,this.wsp.currentLanguage,"current language");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			lang=this.wsp.languages[0];
			try {
				this.wsp.removeLanguage('Not Me');
			} catch (e) {
				if (e=="Language 'Not Me' not defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"Language 'Not Me' not defined.");
			Y.Assert.areEqual(1,this.wsp.languages.length,"number of languages");
			Y.Assert.areEqual(lang,this.wsp.views[0].language, "first view language");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
		},		
		testRenameLanguage : function() {
			var lang, view, err;
			this.wsp.unsaved=false;
			lang=this.wsp.languages[0];
			view=this.wsp.views[0];
			this.wsp.focus("Raw Grammar");
			this.wsp.renameLanguage("ometa","New Name");
			Y.Assert.areEqual(1,this.wsp.languages.length,"only one language");
			Y.Assert.areEqual(lang,this.wsp.languages[0],"same language");
			Y.Assert.areEqual("New Name",lang.name, "language name");
			Y.Assert.areEqual(lang,view.language, "same language for view");
			Y.Assert.areEqual(false,view.needsRefresh, "no view refresh needed");
			Y.Assert.areEqual(lang,this.wsp.currentLanguage, "current language");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be saved");			
			this.wsp.renameLanguage("New Name","ometa");
			Y.Assert.areEqual("ometa",lang.name, "language name");
			this.wsp.unsaved=false;
			this.wsp.renameLanguage("ometa","ometa");
			Y.Assert.areEqual(1,this.wsp.languages.length,"one language");
			Y.Assert.areEqual("ometa",this.wsp.languages[0].name,"language not changed");
			try {
				this.wsp.renameLanguage("Not a Language","New Language");
			} catch (e) {
				err=1;
			}
			Y.Assert.areEqual(1,err,"no language to rename");
			Y.Assert.areEqual(1,this.wsp.languages.length,"one language");
			Y.Assert.areEqual("ometa",this.wsp.languages[0].name,"language not changed");
			try {
				this.wsp.renameLanguage("ometa");
			} catch (e) {
				err=2;
			}
			Y.Assert.areEqual(2,err,"language name required");
			Y.Assert.areEqual(1,this.wsp.languages.length,"one language");
			Y.Assert.areEqual("ometa",this.wsp.languages[0].name,"language not changed");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
			this.wsp.createLanguage("New Language");
			this.wsp.unsaved=false;
			try {
				this.wsp.renameView("ometa","New Language");
			} catch (e) {
				err=3;
			}
			Y.Assert.areEqual(3,err,"language already exists");
			Y.Assert.areEqual(2,this.wsp.languages.length,"two languages");
			Y.Assert.areEqual("ometa",this.wsp.languages[0].name,"language not changed");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
		},
		testRemoveView: function() {
			var view, rawView, err;
			this.wsp.createView('new','end');
			Y.Assert.areEqual(2,this.wsp.views.length,"number of views");
			view=this.wsp.views['new'];
			rawView=this.wsp.views[0];
			this.wsp.focus("Raw Grammar");
			Y.Assert.areEqual(view,this.wsp.views[1], "second view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			this.wsp.unsaved=false;
			this.wsp.removeView('new');
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be unsaved");
			this.wsp.unsaved=false;
			try {
				this.wsp.removeView("Not Me");
			} catch (e) {
				if (e=="View 'Not Me' not defined.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"View 'Not Me' not defined.");
			Y.Assert.areEqual(1,this.wsp.views.length,"number of views");
			Y.Assert.areEqual(rawView,this.wsp.views[0], "first view");
			Y.Assert.areEqual(rawView,this.wsp.currentView, "current view");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be unsaved");
		},		
		testRenameView: function () {
			var lang, view, ed, err;
			this.wsp.unsaved=false;
			lang=this.wsp.languages[0];
			view=this.wsp.views[0];
			this.wsp.focus("Raw Grammar");
			this.wsp.renameView("Raw Grammar","New Name");
			Y.Assert.areEqual(1,this.wsp.views.length,"only one view");
			Y.Assert.areEqual(view,this.wsp.views[0],"same view");
			Y.Assert.areEqual("New Name",view.name, "view name");
			Y.Assert.areEqual(lang,view.language, "ometa language for view");
			Y.Assert.areEqual(false,view.needsRefresh, "no view refresh needed");
			Y.Assert.areEqual(view,view.inputView, "view input to itself");
			Y.Assert.areEqual(undefined,view.id, "no view id");
			Y.Assert.areEqual(0,view.references.length, "no view references");
			Y.Assert.areEqual(0,view.grammarDefs.length, "no grammar definition");
			Y.Assert.areEqual(this.wsp,view.workspace, "in workspace");				 
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name, "ACE editor");
			Y.Assert.areEqual("100px",ed.height, "editor height");
			Y.Assert.areEqual(true,ed.gutters, "editor has gutters");
			Y.Assert.areEqual(false,ed.readOnly, "editor not read only");
			Y.Assert.areEqual("ometa newRaw {\n  start = anything*\n}",
				ed.contents, "contents is raw grammar");
			Y.Assert.areEqual(view,ed.view, "editor in view");	
			Y.Assert.areEqual(view,this.wsp.currentView, "current view");				 
			Y.Assert.areEqual(true,this.wsp.unsaved, "should be saved");			
			this.wsp.renameView("New Name","Raw Grammar");
			Y.Assert.areEqual("Raw Grammar",view.name, "view name");
			this.wsp.unsaved=false;
			this.wsp.renameView("Raw Grammar","Raw Grammar");
			Y.Assert.areEqual(1,this.wsp.views.length,"one view");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[0].name,"view not changed");
			try {
				this.wsp.renameView("Not a View","New View");
			} catch (e) {
				err=1;
			}
			Y.Assert.areEqual(1,err,"no view to rename");
			Y.Assert.areEqual(1,this.wsp.views.length,"one view");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[0].name,"view not changed");
			try {
				this.wsp.renameView("Raw Grammar");
			} catch (e) {
				err=2;
			}
			Y.Assert.areEqual(2,err,"view name required");
			Y.Assert.areEqual(1,this.wsp.views.length,"one view");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[0].name,"view not changed");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
			this.wsp.createView("New View");
			this.wsp.unsaved=false;
			try {
				this.wsp.renameView("Raw Grammar","New View");
			} catch (e) {
				err=3;
			}
			Y.Assert.areEqual(3,err,"view already exists");
			Y.Assert.areEqual(2,this.wsp.views.length,"two views");
			Y.Assert.areEqual("Raw Grammar",this.wsp.views[0].name,"view not changed");
			Y.Assert.areEqual(false,this.wsp.unsaved, "should be saved");
		},
		testWorkspaceSerialize : function () {
			Y.Assert.areEqual('{"name": "Basic",\n "languages": [\n	{"name": "ometa",\n' +
		'	 "meta": true,\n	 "code": [\n		{"name": "BSOMetaJSParser",\n' +
		'		 "startRule": "topLevel"},\n		{"name": "BSOMetaJSTranslator",\n' +
		'		 "startRule": "trans",\n		 "makeList": true}]}],\n' +
		' "views": [\n	{"name": "Raw Grammar",\n	 "language": "ometa",\n' +
		'	 "editor": {"name": "ACE", "height": "100px", "gutters": true},\n' +
		'	 "contents": "ometa newRaw {\\n  start = anything*\\n}"}]}',
				this.wsp.serialize(),"Workspace serialize");
			Y.Assert.areEqual('{"name": "Basic",\n "languages": [\n	{"name": "ometa",\n' +
		'	 "meta": true,\n	 "code": [\n		{"name": "BSOMetaJSParser",\n' +
		'		 "startRule": "topLevel",\n		 "makeList": false,\n		 "defView": ""},\n' +
		'		{"name": "BSOMetaJSTranslator",\n' +
		'		 "startRule": "trans",\n		 "makeList": true,\n		 "defView": ""}],\n' +
		'	 "decode": []}],\n' +
		' "views": [\n	{"name": "Raw Grammar",\n	 "language": "ometa",\n' +
		'	 "inputView": "Raw Grammar",\n	 "needsRefresh": false,\n' +
		'	 "editor": {"name": "ACE", "height": "100px", "gutters": true,' +
	  ' "readOnly": false},\n' +
		'	 "contents": "ometa newRaw {\\n  start = anything*\\n}"}],\n' +
		' "currentView": undefined}',
				this.wsp.serialize('',true),
				"Workspace serialize all");
			Y.Assert.areEqual(' {"name": "Basic",\n  "languages": [\n 	{"name": "ometa",\n' +
		' 	 "meta": true,\n 	 "code": [\n 		{"name": "BSOMetaJSParser",\n' +
		' 		 "startRule": "topLevel",\n 		 "makeList": false,\n 		 "defView": ""},\n' +
		' 		{"name": "BSOMetaJSTranslator",\n' +
		' 		 "startRule": "trans",\n 		 "makeList": true,\n 		 "defView": ""}],\n' +
		' 	 "decode": []}],\n' +
		'  "views": [\n 	{"name": "Raw Grammar",\n 	 "language": "ometa",\n' +
		' 	 "inputView": "Raw Grammar",\n 	 "needsRefresh": false,\n' +
		' 	 "editor": {"name": "ACE", "height": "100px", "gutters": true,' +
		' "readOnly": false},\n' +
		' 	 "contents": "ometa newRaw {\\n  start = anything*\\n}"}],\n' +
		'  "currentView": undefined}',
				this.wsp.serialize(' ',true),
				"Workspace serialize all and indent ' '");
		},
		testWorkspaceSetName: function() {
			var err;
			this.wsp.unsaved=false;
			this.wsp.setName("My Work");
			Y.Assert.areEqual("My Work",this.wsp.name,"Workspace Name");
			Y.Assert.areEqual(true,this.wsp.unsaved, "Is workspace unsaved?"); 
			this.wsp.unsaved=false;
			try {
				this.wsp.setName();
			} catch (e) {
				if (e=="Workspace name is required.")
					err=1;
			}
			Y.Assert.areEqual(1,err,"Workspace name is required.");
			Y.Assert.areEqual("My Work",this.wsp.name,"workspace name");
			try {
				this.wsp.setName("");
			} catch (e) {
				if (e=="Workspace name is required.")
					err=2;
			}
			Y.Assert.areEqual(2,err,"Workspace name is required.");
			Y.Assert.areEqual("My Work",this.wsp.name,"workspace name");
			Y.Assert.areEqual(false,this.wsp.unsaved, "Is workspace unsaved?");
		}
	});
	var lolsLanguageGrammarTest = new Y.Test.Case({
		name: "LoLs Language/Grammar",
		setUp: function () {
			this.wsp = Workspace();
		},
		tearDown: function () {
			delete this.data;
		},
		testDefaultGrammar: function() {
			var g=Grammar();
			Y.Assert.areEqual("Unnamed",g.name,"Grammar name");
			Y.Assert.areEqual("start",g.startRule,"Grammar start rule");
			Y.Assert.areEqual(undefined,g.rules,"Grammar rules");
			Y.Assert.areEqual(false,g.makeList,"Grammar make list");
			Y.Assert.areEqual(undefined,g.language,"Grammar language");
			Y.Assert.areEqual(undefined,g.defView,"Grammar definition view");
		},
		testGrammarWithRules: function() {
			var g=Grammar({name: "BSOMetaJSParser", startRule: "first", makeList: true});
			Y.Assert.areEqual("BSOMetaJSParser",g.name,"Grammar name");
			Y.Assert.areEqual("first",g.startRule,"Grammar start rule");
			Y.Assert.areNotEqual(undefined,g.rules,"Grammar rules");
			Y.Assert.areEqual(true,g.makeList,"Grammar make list");
			Y.Assert.areEqual(undefined,g.language,"Grammar language");
			Y.Assert.areEqual(undefined,g.defView,"Grammar definition view");
		},
		testLast: function() {
		}		
	});			
	var lolsViewEditorTest = new Y.Test.Case({
		name: "LoLs View/Editor",
		setUp: function () {
			this.wsp = Workspace();
		},
		tearDown: function () {
			delete this.data;
		},
		testFirst: function() {
		},
		testLast: function() {
		}		
	});			
	var lolsDemoUseCaseTest = new Y.Test.Case({
		name: "LoLs Demo Use Case",
		setUp: function () {
			this.wsp = Workspace(GettingStarted);
		},
		tearDown: function () {
			delete this.data;
		},
		testCheckSetup: function() {
			var lang, gram, view, ed;
			Y.Assert.areEqual("Getting Started",this.wsp.name,"Workspace name");
			Y.Assert.areEqual(5,this.wsp.languages.length,"number of languages");
			lang=this.wsp.languages[0];
			Y.Assert.areEqual("ometa",lang.name,"language name");
			Y.Assert.areEqual(lang,this.wsp.languages["ometa"],"language by name");
			Y.Assert.areEqual(true,lang.meta,"language meta");
			Y.Assert.areEqual(2,lang.code.length,"language code length");
			gram=lang.code[0];
			Y.Assert.areEqual("BSOMetaJSParser",gram.name,"code grammar name");
			Y.Assert.areEqual("topLevel",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(false,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(undefined,gram.defView,"code grammar definition view");
			gram=lang.code[1];
			Y.Assert.areEqual("BSOMetaJSTranslator",gram.name,"code grammar name");
			Y.Assert.areEqual("trans",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(true,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(undefined,gram.defView,"code grammar definition view");		
			Y.Assert.areEqual(0,lang.decode.length,"language decode length");	
			lang=this.wsp.languages[1];
			Y.Assert.areEqual("math",lang.name,"language name");
			Y.Assert.areEqual(lang,this.wsp.languages["math"],"language by name");
//			Y.Assert.areEqual(this.wsp.views["Grammar"],lang.defView,
//				"language definition view");
			Y.Assert.areEqual(false,lang.meta,"language meta");
			Y.Assert.areEqual(1,lang.code.length,"language code length");
			gram=lang.code[0];
			Y.Assert.areEqual("math",gram.name,"code grammar name");
			Y.Assert.areEqual("expression",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(false,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(this.wsp.views["Grammar"],gram.defView,"code grammar definition view");			
			Y.Assert.areEqual(0,lang.decode.length,"language decode length");		
			lang=this.wsp.languages[2];
			Y.Assert.areEqual("calculate",lang.name,"language name");
			Y.Assert.areEqual(lang,this.wsp.languages["calculate"],"language by name");
//			Y.Assert.areEqual(this.wsp.views["Grammar"],lang.defView,
//				"language definition view");
			Y.Assert.areEqual(false,lang.meta,"language meta");
			Y.Assert.areEqual(1,lang.code.length,"language code length");
			gram=lang.code[0];
			Y.Assert.areEqual("calculate",gram.name,"code grammar name");
			Y.Assert.areEqual("le",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(true,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(this.wsp.views["Grammar"],gram.defView,"code grammar definition view");						
			Y.Assert.areEqual(0,lang.decode.length,"language decode length");		
			lang=this.wsp.languages[3];
			Y.Assert.areEqual("LET",lang.name,"language name");
			Y.Assert.areEqual(lang,this.wsp.languages["LET"],"language by name");
//			Y.Assert.areEqual(this.wsp.views["Grammar"],lang.defView,
//				"language definition view");
			Y.Assert.areEqual(false,lang.meta,"language meta");
			Y.Assert.areEqual(1,lang.code.length,"language code length");
			gram=lang.code[0];
			Y.Assert.areEqual("LET",gram.name,"code grammar name");
			Y.Assert.areEqual("let",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(true,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(this.wsp.views["Grammar"],gram.defView,"code grammar definition view");					
			Y.Assert.areEqual(0,lang.decode.length,"language decode length");			
			lang=this.wsp.languages[4];
			Y.Assert.areEqual("raw",lang.name,"language name");
			Y.Assert.areEqual(lang,this.wsp.languages["raw"],"language by name");
//			Y.Assert.areEqual(this.wsp.views["Grammar"],lang.defView,
//				"language definition view");
			Y.Assert.areEqual(false,lang.meta,"language meta");
			Y.Assert.areEqual(1,lang.code.length,"language code length");
			gram=lang.code[0];
			Y.Assert.areEqual("raw",gram.name,"code grammar name");
			Y.Assert.areEqual("it",gram.startRule,"code grammar start rule");
			Y.Assert.areNotEqual(undefined,gram.rules,"code grammar rules");
			Y.Assert.areEqual(false,gram.makeList,"code grammar make list");
			Y.Assert.areEqual(lang,gram.language,"code grammar language");
			Y.Assert.areEqual(this.wsp.views["Grammar"],gram.defView,"code grammar definition view");			
			
			Y.Assert.areEqual(5,this.wsp.views.length,"number of views");
			view=this.wsp.views[0];
			Y.Assert.areEqual("Read Me First",view.name,"view name");
			Y.Assert.areEqual(view,this.wsp.views["Read Me First"],"view by name");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name,"editor name");
			Y.Assert.areEqual("100px",ed.height,"editor height");
			Y.Assert.areEqual(false,ed.gutters,"editor gutters");
			Y.Assert.areEqual(true,ed.readOnly,"editor read only");
			Y.Assert.areEqual(this.wsp.languages["raw"],view.language,"view language");
			
			view=this.wsp.views[1];
			Y.Assert.areEqual("Math Problem",view.name,"view name");
			Y.Assert.areEqual(view,this.wsp.views["Math Problem"],"view by name");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name,"editor name");
			Y.Assert.areEqual("60px",ed.height,"editor height");
			Y.Assert.areEqual(false,ed.gutters,"editor gutters");
			Y.Assert.areEqual(false,ed.readOnly,"editor read only");
			Y.Assert.areEqual(this.wsp.languages["math"],view.language,"view language");
			Y.Assert.areEqual(view,view.inputView,"input view");
			
			view=this.wsp.views[2];
			Y.Assert.areEqual("Answer",view.name,"view name");
			Y.Assert.areEqual(view,this.wsp.views["Answer"],"view by name");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name,"editor name");
			Y.Assert.areEqual("60px",ed.height,"editor height");
			Y.Assert.areEqual(false,ed.gutters,"editor gutters");
			Y.Assert.areEqual(true,ed.readOnly,"editor read only");
			Y.Assert.areEqual(this.wsp.languages["calculate"],view.language,"view language");
			Y.Assert.areEqual(this.wsp.views["Math Problem"],view.inputView,"input view");
			
			view=this.wsp.views[3];
			Y.Assert.areEqual("LET Explorer",view.name,"view name");
			Y.Assert.areEqual(view,this.wsp.views["LET Explorer"],"view by name");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name,"editor name");
			Y.Assert.areEqual("200px",ed.height,"editor height");
			Y.Assert.areEqual(false,ed.gutters,"editor gutters");
			Y.Assert.areEqual(true,ed.readOnly,"editor read only");
			Y.Assert.areEqual(this.wsp.languages["LET"],view.language,"view language");
			Y.Assert.areEqual(this.wsp.views["Math Problem"],view.inputView,"input view");
			
			view=this.wsp.views[4];
			Y.Assert.areEqual("Grammar",view.name,"view name");
			Y.Assert.areEqual(view,this.wsp.views["Grammar"],"view by name");
			ed=view.editor;
			Y.Assert.areEqual("ACE",ed.name,"editor name");
			Y.Assert.areEqual("250px",ed.height,"editor height");
			Y.Assert.areEqual(true,ed.gutters,"editor gutters");
			Y.Assert.areEqual(false,ed.readOnly,"editor read only");
			Y.Assert.areEqual(this.wsp.languages["ometa"],view.language,"view language");
			Y.Assert.areEqual(view,view.inputView,"input view");
			
			view=this.wsp.views["Math Problem"];
			Y.Assert.areEqual(view,this.wsp.currentView,"current view");
			lang=this.wsp.languages["math"];
			Y.Assert.areEqual(lang,this.wsp.currentLanguage,"current language");
		},
		testLast: function() {
		}		
	});			
	var lolsOMetaJSTest = new Y.Test.Case({
		name: "OMeta JS Tests",
		setUp: function () {
			this.wsp = Workspace();
		},
		tearDown: function () {
			delete this.data;
		},
		testFirst: function() {
		},
		testLast: function() {
		}		
	});			
	// Create and run test suite
	var suite = new Y.Test.Suite("LoLs Workbench Testing");
	suite.add(lolsWorkspaceTest);
	suite.add(lolsBasicWorkspaceTest);
	suite.add(lolsLanguageGrammarTest);
	suite.add(lolsViewEditorTest);
	suite.add(lolsDemoUseCaseTest);
	suite.add(lolsOMetaJSTest);
	Y.Test.Runner.add(suite);
	Y.Test.Runner.run();
	});