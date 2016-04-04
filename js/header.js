import React, {Component} from 'react'

var Header = React.createClass ({
	render: function () {
		return (
				<div className="header">
					<h1>Welcome to Large</h1>
					<div className="toggleViews">
						<a href="#addPost">Add Post</a>
						<a href="#viewAll">View All Posts</a>
					</div>
				</div>
			)
	}
})
export default Header
