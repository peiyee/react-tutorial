var CommentBox = React.createClass({
  render: function() {
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList/>
        <CommentForm/>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return(
        <div className="commentForm">
          hello i am a comment form
        </div>
      );
  }
});

var CommentList = React.createClass({
  render: function() {
    return(
    <div className="commentList">
      hello, iam a comment list
    </div>
    );
  }
});



ReactDOM.render(<CommentBox/>,document.getElementById("content"));