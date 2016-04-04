import React, {Component} from 'react'

var LoginView = React.createClass({
	userEmail: '',
	userPassword: '',
	_updateEmail: function(e) {
		this.userEmail = e.target.value
	},
	_updatePassword: function(e) {
		this.userPassword = e.target.value
	},
	_handleUserLogin: function() {
		this.props._loginUser(this.userEmail, this.userPassword)
	},
	_handleUserSignup: function() {
		this.props._signupUser(this.userEmail, this.userPassword)
	},
	render: function () {
		document.querySelector('body').style.background = "rgba(38,38,38,1)"
		var signupErrorMsg = ''
		var loginErrorMsg = ''
		if (this.props.loginError) loginErrorMsg = "Could not verify your account. Your email or password may be wrong."
		if (this.props.signupError) signupErrorMsg = "Could not verify your sign up. Your email address may already be in use."
		return (
				<div className="loginView">
				<img className="logo" src="./Images/largeLogo.svg"/>
					<div className="loginContainer">
						<h1>Welcome to Large</h1>
						<p> {signupErrorMsg}</p>
						<p> {loginErrorMsg}</p>
						<input onKeyDown={this._updateEmail} placeholder="Email address" className="userEmail"/>
						<input onKeyDown={this._updatePassword} placeholder="Password" type="password" className="userPassword" />
						<button onClick={this._handleUserLogin} className="loginButton">Login</button>
						<button onClick={this._handleUserSignup} className="signupButton">Sign Up</button>
					</div>
				</div>
			)
	}
})
export default LoginView
