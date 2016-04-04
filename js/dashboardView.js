import React, {Component} from 'react'
import Backbone from 'bbfire'
import Firebase from 'firebase'
import {BlogModel, UserCollection, AllUsersCollection} from "./app"

var DashboardView = React.createClass({
	render: function() {
		return (
			<div className="dashboardView">
				<Header email={this.props.email} />
			</div>
		)
	}
})
var Header = React.createClass ({
	render: function () {
		document.querySelector('body').style.background = "rgba(249,249,249,1)"
		return (
				<div className="header">
					<img className="logo" src="./Images/largeLogo.png"/>
					<h1>Large</h1>
					<div className="toggleViews">
						<a href="#addPost">Add Post</a>
						<a href="#allPosts">View All Posts</a>
						<a href="#myPosts">View My Posts</a>
						<a href="#logout">Logout</a>
					</div>
					<p>Hello, {this.props.email}</p>
				</div>
			)
	}
})
var AllPostsView = React.createClass({
	componentWillMount: function() {
  		var self = this
    	this.props.newAllColl.on('sync',function() {self.forceUpdate()})
	},
	render: function () {
		var newAllColl = this.state.newAllColl
		return (
				<div className="allPostsView">
					<Header email={this.props.email} />
					<BlogList allBlogsCollection={newAllColl} />
				</div>
			)
	},
	getInitialState: function() {
		return {
			newAllColl: this.props.newAllColl
		}
	}
})
var BlogList = React.createClass({
	_makeBlogComponent: function(model,i) {
		return (
				<BlogComponent blogModel={model} key={i}/>
			)
	},
	render: function() {
		
		return (
				<div className="allBlogsList">
					{this.props.allBlogsCollection.map(this._makeBlogComponent)}
				</div>
			)
	}
})
var BlogComponent = React.createClass({
	render: function() {
		// console.log(this)		
		return (
				<div className="blogContainer" >
					<p className="blogTitle">{this.props.blogModel.get("blogTitle")}</p>
					<p className="blogContent">{this.props.blogModel.get("blogContent")}</p>

				</div>
			)
	}
})
var MyPostsView = React.createClass({
	componentWillMount: function() {
  		var self = this
    	this.props.uColl.on('sync',function() {self.forceUpdate()})
	},
	render: function() {
		console.log(this)
		var uColl = this.state.uColl
		return (
				<div className="myPostsView">
					<Header email={this.props.email} />
					<MyBlogsList uColl={uColl} />
				</div>
			)
	},
	getInitialState: function() {
		return {
			uColl: this.props.uColl
		}
	}
})
var MyBlogsList = React.createClass({
	_makeBlogComponent: function(model,i) {
		return (
				<BlogComponent blogModel={model} key={i}/>
			)
	},
	render: function() {
		return (
			<div className="myBlogsList">
				{this.props.uColl.map(this._makeBlogComponent)}
			</div>
			)
	}
})


export {Header, AllPostsView, DashboardView, MyPostsView}