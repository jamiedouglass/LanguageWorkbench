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
