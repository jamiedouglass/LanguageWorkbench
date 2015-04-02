
	//
	// Login
	// Using the endpoint
	// @param network	stringify				name to connect to
	// @param options	object		(optional)	{display mode, is either none|popup(default)|page, scope: email,birthday,publish, .. }
	// @param callback	function	(optional)	fired on signin
	//
	login :  function(){

		// Create self
		// An object which inherits its parent as the prototype.
		// And constructs a new event chain.
		var self = this.use(),
			utils = self.utils;

		// Get parameters
		var p = utils.args({network:'s', options:'o', callback:'f'}, arguments);

		// Apply the args
		self.args = p;

		// Local vars
		var url;

		// merge/override options with app defaults
		var opts = p.options = utils.merge(self.settings, p.options || {} );

		// Network
		p.network = self.settings.default_service = p.network || self.settings.default_service;

		//
		// Bind listener
		self.on('complete', p.callback);

		// Is our service valid?
		if( typeof(p.network) !== 'string' || !( p.network in self.services ) ){
			// trigger the default login.
			// ahh we dont have one.
			self.emitAfter('error complete', {error:{
				code : 'invalid_network',
				message : 'The provided network was not recognized'
			}});
			return self;
		}

		//
		var provider  = self.services[p.network];

		//
		// Callback
		// Save the callback until state comes back.
		//
		var responded = false;

		//
		// Create a global listener to capture events triggered out of scope
		var callback_id = utils.globalEvent(function(str){

			// Save this locally
			// responseHandler returns a string, lets save this locally
			var obj;

			if ( str ){
				obj = JSON.parse(str);
			}
			else {
				obj = {
					error : {
						code : 'cancelled',
						message : 'The authentication was not completed'
					}
				};
			}

			//
			// Cancel the popup close listener
			responded = true;

			//
			// Handle these response using the local
			// Trigger on the parent
			if(!obj.error){

				// Save on the parent window the new credentials
				// This fixes an IE10 bug i think... atleast it does for me.
				utils.store(obj.network,obj);

				// Trigger local complete events
				self.emit("complete success login auth.login auth", {
					network : obj.network,
					authResponse : obj
				});
			}
			else{
				// Trigger local complete events
				self.emit("complete error failed auth.failed", {
					error : obj.error
				});
			}
		});



		//
		// REDIRECT_URI
		// Is the redirect_uri root?
		//
		var redirect_uri = utils.url(opts.redirect_uri).href;


		//
		// Response Type
		//
		var response_type = provider.oauth.response_type || opts.response_type;

		// Fallback to token if the module hasn't defined a grant url
		if( response_type === 'code' && !provider.oauth.grant ){
			response_type = 'token';
		}


		//
		// QUERY STRING
		// querystring parameters, we may pass our own arguments to form the querystring
		//
		p.qs = {
			client_id	: provider.id,
			response_type : response_type,
			redirect_uri : redirect_uri,
			display		: opts.display,
			scope		: 'basic',
			state		: {
				client_id	: provider.id,
				network		: p.network,
				display		: opts.display,
				callback	: callback_id,
				state		: opts.state,
				redirect_uri: redirect_uri,
			}
		};

		//
		// SESSION
		// Get current session for merging scopes, and for quick auth response
		var session = utils.store(p.network);

		//
		// SCOPES
		// Authentication permisions
		//
		
		// convert any array, or falsy value to a string.
		var scope = (opts.scope||'').toString();

		scope = (scope ? scope + ',' : '') + p.qs.scope;

		// Append scopes from a previous session
		// This helps keep app credentials constant,
		// Avoiding having to keep tabs on what scopes are authorized
		if(session && "scope" in session && session.scope instanceof String){
			scope += ","+ session.scope;
		}

		// Save in the State
		// Convert to a string because IE, has a problem moving Arrays between windows
		p.qs.state.scope = utils.unique( scope.split(/[,\s]+/) ).join(',');

		// Map replace each scope with the providers default scopes
		p.qs.scope = scope.replace(/[^,\s]+/ig, function(m){
			// Does this have a mapping?
			if (m in provider.scope){
				return provider.scope[m];
			}else{
				// Loop through all services and determine whether the scope is generic
				for(var x in self.services){
					var _scopes = self.services[x].scope;
					if(_scopes && m in _scopes){
						// found an instance of this scope, so lets not assume its special
						return '';
					}
				}
				// this is a unique scope to this service so lets in it.
				return m;
			}

		}).replace(/[,\s]+/ig, ',');

		// remove duplication and empty spaces
		p.qs.scope = utils.unique(p.qs.scope.split(/,+/)).join( provider.scope_delim || ',');




		//
		// FORCE
		// Is the user already signed in with the appropriate scopes, valid access_token?
		//
		if(opts.force===false){

			if( session && "access_token" in session && session.access_token && "expires" in session && session.expires > ((new Date()).getTime()/1e3) ){
				// What is different about the scopes in the session vs the scopes in the new login?
				var diff = utils.diff( session.scope || [], p.qs.state.scope || [] );
				if(diff.length===0){

					// Ok trigger the callback
					self.emitAfter("complete success login", {
						unchanged : true,
						network : p.network,
						authResponse : session
					});

					// Nothing has changed
					return self;
				}
			}
		}


		// Page URL
		if ( opts.display === 'page' && opts.page_uri ){
			// Add a page location, place to endup after session has authenticated
			p.qs.state.page_uri = utils.url(opts.page_uri).href;
		}


		// Bespoke
		// Override login querystrings from auth_options
		if("login" in provider && typeof(provider.login) === 'function'){
			// Format the paramaters according to the providers formatting function
			provider.login(p);
		}



		// Add OAuth to state
		// Where the service is going to take advantage of the oauth_proxy
		if( response_type !== "token" ||
			parseInt(provider.oauth.version,10) < 2 ||
			( opts.display === 'none' && provider.oauth.grant && session && session.refresh_token ) ){

			// Add the oauth endpoints
			p.qs.state.oauth = provider.oauth;

			// Add the proxy url
			p.qs.state.oauth_proxy = opts.oauth_proxy;

		}


		// Convert state to a string
		p.qs.state = JSON.stringify(p.qs.state);



		//
		// URL
		//
		if( parseInt(provider.oauth.version,10) === 1 ){

			// Turn the request to the OAuth Proxy for 3-legged auth
			url = utils.qs( opts.oauth_proxy, p.qs );
		}

		// Refresh token
		else if( opts.display === 'none' && provider.oauth.grant && session && session.refresh_token ){

			// Add the refresh_token to the request
			p.qs.refresh_token = session.refresh_token;

			// Define the request path
			url = utils.qs( opts.oauth_proxy, p.qs );
		}

		// 
		else{

			url = utils.qs( provider.oauth.auth, p.qs );
		}


		self.emit("notice", "Authorization URL " + url );


		//
		// Execute
		// Trigger how we want self displayed
		// Calling Quietly?
		//
		if( opts.display === 'none' ){
			// signin in the background, iframe
			utils.iframe(url);
		}


		// Triggering popup?
		else if( opts.display === 'popup'){


			var popup = utils.popup( url, redirect_uri, opts.window_width || 500, opts.window_height || 550 );

			var timer = setInterval(function(){
				if(!popup||popup.closed){
					clearInterval(timer);
					if(!responded){

						var error = {
							code:"cancelled",
							message:"Login has been cancelled"
						};

						if(!popup){
							error = {
								code:'blocked',
								message :'Popup was blocked'
							};
						}

						self.emit("complete failed error", {error:error, network:p.network });
					}
				}
			}, 100);
		}

		else {
			window.location = url;
		}

		return self;
	},
