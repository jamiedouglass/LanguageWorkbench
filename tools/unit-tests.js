// Create a new YUI instance and populate it with the required modules.

YUI({useBrowserconsole: true}).use('test', function (Y) {
	var testCase1 = new Y.Test.Case({

			name: "Example Test Case",

			//---------------------------------------------
			// Setup and tear down
			//---------------------------------------------

			setUp : function () {
					this.data = { name : "Nicholas", age : 28 };
			},

			tearDown : function () {
					delete this.data;
			},

			testName: function () {
					Y.Assert.areEqual("Nicholas", this.data.name, "Name should be 'Nicholas'");
			},

			testAge: function () {
					Y.Assert.areEqual(28, this.data.age, "Age should be 28");
			}
	});
	
	var lolsTestCase = new Y.Test.Case({
			name : "LoLs Test Case",
			setUp : function () {
					this.data = Workspace(EmptyWorkspace);
			},
			tearDown : function () {
					delete this.data;
			},
			
			testParse : function() {
					try {
						this.data.views[0].refresh(true);
			    } catch (e) {
			    	Y.Assert.fail("Bad parse: "+e);
			    }
			}
	});

	// Create test suite

	var suite = new Y.Test.Suite("Example Test");
	suite.add(testCase1);
	suite.add(lolsTestCase);
	Y.Test.Runner.add(suite);
	
	// Run the test suite
	Y.Test.Runner.run();

	});