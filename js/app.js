// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'bbfire'
import Firebase from 'firebase'
import LoginView from './loginView'
import {Header,AllPostsView, DashboardView, MyPostsView} from "./dashboardView"

function app() {
    // start app
    // new Router()
    var AddPostView = React.createClass({
	blogTitle: '',
	blogContent: '',
	_handleBlogTitle: function(e) {
		this.blogTitle = e.target.value
	},
	_handleBlogContent: function(e) {
		this.blogContent = e.target.value
	},
	_saveBlog: function() {
		var userBlogModel = new BlogModel()
		userBlogModel.attributes.blogTitle = this.blogTitle
		userBlogModel.attributes.blogContent = this.blogContent
		console.log(userBlogModel)
		this.state.newAllColl.add(userBlogModel.attributes)
		this.state.newUserColl.add(userBlogModel.attributes)
		location.hash = "myPosts"
	},
	render: function() {
		return (
				<div className="addPostView">
					<Header email={this.props.email}/>
					<textarea placeholder="title" onKeyDown={this._handleBlogTitle} className="blogTitleInput"/>
					<textarea placeholder="content" onKeyDown={this._handleBlogContent} className="blogContentInput"/>
					<button className="addBlog" onClick={this._saveBlog}>Save blog</button>
				</div>
			)
	},
	getInitialState: function() {
		return {
			newUserColl: this.props.newUserColl,
			newAllColl: this.props.newAllColl
		}
	}
	})


    var BlogModel = Backbone.Model.extend({
    	defaults: {
    		blogTitle: null,
    		blogContent: null
    	}
    })
    var UserCollection = Backbone.Firebase.Collection.extend({
      url: "http://blogginglarge.firebaseio.com/users",
      initialize: function(uid) {
        this.url = `http://blogginglarge.firebaseio.com/users/${uid}/blogs`
      },
      model: BlogModel,
      autoSync: true
    })
    var AllUsersCollection = Backbone.Firebase.Collection.extend({
    	url: "http://blogginglarge.firebaseio.com",
    	model: BlogModel,
    	autoSync: true,
    	parse: function(rawData) {
			return rawData.results
		}
    })

 	var BlogRouter = Backbone.Router.extend({
 		routes: {
 			"myPosts": "handleMyPosts",
 			"allPosts": "handleAllPosts",
 			"addPost": "handleAddPost",
 			"*default": "handleLogin"
 		},
 		initialize: function() {
 			this.ref = new Firebase("https://blogginglarge.firebaseio.com");
 			var auth = this.ref.getAuth()
 			if (!auth) location.hash = "login"
        	console.log(auth)
 			Backbone.history.start()
 		},
 		handleLogin: function() {
 			location.hash="login"
 			DOM.render(<LoginView _signupUser={this._signupUser.bind(this)} _loginUser={this._loginUser.bind(this)} />, document.querySelector('.container'))
 		},
 		handleAllPosts: function() {
 			var allBlogsCollection = new AllUsersCollection()
 			allBlogsCollection.fetch()
 			DOM.render(<AllPostsView newAllColl={allBlogsCollection}  email={this.ref.getAuth().password.email} />, document.querySelector('.container'))
 		},
 		handleAddPost: function() {
 			var uColl = new UserCollection(this.ref.getAuth().uid)
 			DOM.render(<AddPostView newAllColl={new AllUsersCollection} newUserColl={uColl} email={this.ref.getAuth().password.email} />, document.querySelector('.container'))
 		},
 		handleMyPosts: function() {
 			var uColl = new UserCollection(this.ref.getAuth().uid) 
 			uColl.fetch() 
 			DOM.render(<MyPostsView uColl={uColl} email={this.ref.getAuth().password.email} />, document.querySelector('.container'))
 		},
 		_logoutUser: function() {
	        this.ref.unauth()
    	    location.hash = "login"
 		},
 		_signupUser: function(userEmail,userPassword) {
 			var ref = this.ref 
 			var boundLoginUser = this._loginUser.bind(this)
 			var boundSignUpUser = this._signupUser.bind(this)
 			var storeUser = function(userData) {
            ref.child('users').child(userData.uid).set({email:userEmail})
          	}
			ref.createUser({
			  email    : userEmail,
			  password : userPassword
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			    DOM.render(<LoginView signupError={error} _signupUser={boundSignUpUser} _loginUser={boundLoginUser}  />, document.querySelector('.container'))
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    boundLoginUser(userEmail, userPassword)
			    storeUser(userData)
			  }
			});
 		},
 		_loginUser: function(userEmail,userPassword) {
 			var ref = this.ref
 			var boundLogoutUser = this._logoutUser.bind(this)
 			var boundLoginUser = this._loginUser.bind(this)
 			var boundSignUpUser = this._signupUser.bind(this)
			ref.authWithPassword({
			  email    : userEmail,
			  password : userPassword
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			    DOM.render(<LoginView loginError={error} _signupUser={boundSignUpUser} _loginUser={boundLoginUser} />, document.querySelector('.container'))
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			    DOM.render(<DashboardView logout={boundLogoutUser} email={ref.getAuth().password.email} />,document.querySelector('.container'))
			  }
			});
 		}
 	})
 	var blogRouter = new BlogRouter()
}
// export {BlogModel, UserCollection, AllUsersCollection}
app()

