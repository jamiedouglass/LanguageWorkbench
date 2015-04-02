function setupSignInForm(elem) {
	var str='<div id="SignInWorkbench">' +
	'<div>' +
	'	<form autocomplete="off">' +
	'		<h3>Sign In Workspace</h3>' +
	'		<button class ="zocial icon google" title = "Sign into Google" onclick="hello(\'google\').login()">Google Sign-in</button>' +
	'		<button type="button" title="cancel" onClick="hideForm(\'SignInWorkbench\')">' +
	'			Cancel' +
	'		</button>' +
	'	</form>' +
	'</div>' +
  '</div>';
	elem.insertAdjacentHTML("beforeend", str);	
}
function signInForm() {
  showForm('SignInWorkbench');
}
/*
<!--convert html to str then insert like above
<link rel="stylesheet" href="css-social-buttons/css/zocial.css" />
<button class ="zocial icon google" title = "Sign into Google" onclick="hello('google').login()">Google Sign-in</button>
<button class ="zocial icon github" title = "Sign into GitHub" onclick="hello('github').login()">GitHub Sign-in</button>
<button class ="zocial icon linkedin" title = "Sign into LinkedIn" onclick="hello('linkedin').login()">LinkedIn Sign-in</button>
<button class ="zocial icon facebook" title = "Sign into Facebook" onclick="hello('facebook').login()">Facebook Sign-in</button>
<button class ="zocial icon yahoo" title = "Sign into Yahoo" onclick="hello('yahoo').login()">Yahoo Sign-in</button>
<button title = "Log out of Google" onclick="hello('google').logout()">Google Sign-out</button>
-->
*/

hello.init({
	google : '137204177451-16si0pna0ohluv8eurf44qgrfel09dq1.apps.googleusercontent.com'
},{redirect_uri:'http://www.languageoflanguages.com/workbench/index.html'});

hello.on('auth.login', function(auth) {
	hello(auth.network).api('/me').then(function(r) {
		var label = document.getElementById("profile_"+auth.network);
		if (!label) {
			label = document.createElement('div');
			label.id = "profile_"+auth.network;
			document.getElementById('profile').appendChild(label);
		}
		label.innerHTML = '<img src ="'+r.thumbnail+'"/>Hey'+r.name;
	});
});
