import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Text,
	Image,
	StyleSheet,
	WebView,
	TouchableOpacity
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import entities  from 'entities';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Entypo';
import Spinner from '../component/spinner';
import * as PostAction from '../action/post';
import Config from '../config';
import { CommonStyles, PostDetailStyles } from '../style';
import HtmlRender from '../component/htmlRender';

const category = "news";

class NewsPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hasFocus: false
		}
	}

	componentDidMount() {
		const { postAction, id, post, postContent } = this.props;
		if(!postContent || !postContent.NewsBody || !postContent.NewsBody.Content){
			postAction.getPostById(category, id);
		}
	}

	componentDidFocus() {
		this.setState({
			hasFocus: true
		});
	}

	renderPostContent() {
		let { postContent } = this.props;
		if (this.state.hasFocus && postContent 
			&& postContent.NewsBody && postContent.NewsBody.Content) {
			return (
				<View style={ CommonStyles.detailContainer }>
					<HtmlRender 
						content={ postContent.NewsBody.Content }>
					</HtmlRender>
				</View>
			)
		}
		return (
			<Spinner size="large" style = { CommonStyles.refreshSpinner } animating={true}/>
		)
	}

	renderPost() {
		let { post } = this.props;
		return (
			<ScrollView>
				{ this.renderPostContent() }
			</ScrollView>
		)
	}

	renderHeader(){
		let { post } = this.props;
		let publishDate = moment(post.createdate).format("YYYY-MM-DD HH:mm");

		return (
			<View style={ CommonStyles.detailHeader}>
				<View style={ CommonStyles.titleContainer }>
					<Text style={ CommonStyles.title }>
						{ entities.decodeHTML(post.title) }
					</Text>
					<View style={ CommonStyles.meta}>
						<Text>
							{ post.sourceName }
						</Text>
						<Text style={ CommonStyles.metaRight}>
							{ publishDate }
						</Text>
					</View>
				</View>
			</View>
		);
	}

	getHeaderLeftConfig(){
		let { router } = this.props;
	    return (
	    	<TouchableOpacity onPress={ ()=>{ router.pop() } }>
		      <Icon
		        name='chevron-left'
		        size={22}
		        style={ CommonStyles.navbarMenu }
		      />
		    </TouchableOpacity>
	    )
	}

	getHeaderRightConfig(){
		let { router } = this.props;
	    return (
	    	<TouchableOpacity>
		      <Icon
		        name='share'
		        size={18}
		        style={ CommonStyles.navbarMenu }
		      />
		    </TouchableOpacity>
	    )
	}

	getHeaderTitleConfig(){
	    return (
	      <Text style={ CommonStyles.navbarText }>
	        新闻详情
	      </Text>
	    )
	}

	render() {
		return (
			<View style={ CommonStyles.container}>
				<NavigationBar
		            style = { CommonStyles.navbar}
		            leftButton= { this.getHeaderLeftConfig() }
		            rightButton= { this.getHeaderRightConfig() }
		            title={ this.getHeaderTitleConfig() }>
		        </NavigationBar>
		        <ScrollView>
		        	{ this.renderHeader () }
		          	<View style={ CommonStyles.container}>
						{ this.renderPost() }
					</View>
		        </ScrollView>
			</View>
		)
	}
}

export default connect((state, props) => ({
  postContent: state.post.posts[props.id]
}), dispatch => ({ 
  postAction : bindActionCreators(PostAction, dispatch)
}), null, {
  withRef: true
})(NewsPage);