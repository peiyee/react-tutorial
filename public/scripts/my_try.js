var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentFromServer: function() {
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr,status,err){
        console.log(this.props.url,status,err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      type: 'POST',
      data: comment,
      success: function(data){
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr,status,err){
        console.log(this.props.url,status,err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentFromServer();
    console.log("a");
    setInterval(this.loadCommentFromServer,this.props.pollInterval);
  },
  render: function() {
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onSubmitComment={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: "",text: ""};
  },
  handleAuthorChanged: function(e) {
    this.setState({author: e.target.value});
  },
  handleCommentChanged: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if(!text || !author){
      return;
    }
    this.props.onSubmitComment({author: author,text: text});
    this.setState({author: "",text: ""});
  },
  render: function() {
    return(
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.author}
            onChange={this.handleAuthorChanged} 
          />
          <input
            type="text"
            placeholder="Your Comment"
            value={this.state.text}
            onChange={this.handleCommentChanged}
          />
          <input type="submit" value="Post" />
        </form>
      );
  }
});

var CommentList = React.createClass({

  render: function() {
    var commentNodes = this.props.data.map(function(comment){
      return(
          <Comment author={comment.author} key={comment.id}>{comment.text}</Comment>
        );
    });
    return(
    <div className="commentList">
      {commentNodes}
    </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(),{sanitize: true});
    return {__html: rawMarkup};
  },
  render: function() {
   return(
    <div className="comment">
      <h2 className="commentAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
    );
  }
});

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];
ReactDOM.render(<CommentBox url="/api/comments" pollInterval={2000} />,document.getElementById("content"));