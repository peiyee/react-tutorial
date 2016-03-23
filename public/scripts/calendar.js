var WorkBox = React.createClass({
	getInitialState: function(){
		return{data: []};
	},
	testing: function(value){
		var works = this.state.data;
		works.push(value);
		this.setState({data: works});
	},
	render: function() {
		return(
			<div className="calendarBox">
				<WorkList data={this.state.data}/>
				<WorkForm onChange={this.testing}/>
			</div>
		);
	}
});
var WorkList = React.createClass({
	render: function(){
			var rows = this.props.data.map(function(entry){
				return(
					<WorkRow day={entry.day} open={entry.open} close={entry.close} key={entry.id}/>
					);
			});
			return(
				<div className="workList">
					{rows}
				</div>
				);
	}
});
var WorkRow = React.createClass({
	render: function(){
		return(
			<div className="workRow">
				<h2>day</h2>
				<div>{this.props.day}</div>
				<h2>open</h2>
				<div>{this.props.open}</div>
				<h2>close</h2>
				<div>{this.props.close}</div>
			</div>
			);
	}
});
var WorkForm = React.createClass({
	getInitialState: function() {
		return {id: Date.now(),day: "",open: "",close: ""};
	},
	handleOpenChange: function(e){
		this.setState({open: e.target.value});
	},
	handleDayChange: function(e){
		this.setState({day: e.target.value});
	},
	handleCloseChange: function(e){
		this.setState({close: e.target.value});
	},
	handleSubmitWork: function(e){
		e.preventDefault();
		var day = this.state.day.trim();
		var open = this.state.open.trim();
		var close = this.state.close.trim();
		if(!day||!open||!close)
			return;
		this.props.onChange(this.state);
		this.setState({day: "",open: "",close:"",id:""});
	},
	render: function(){
		return(
			<form onSubmit={this.handleSubmitWork} className="workForm">
				<h2>day</h2>
				<input type="text" onChange={this.handleDayChange} value={this.state.day}/>
				<h2>open</h2>
				<input type="text" onChange={this.handleOpenChange} value={this.state.open}/>
				<h2>close</h2>
				<input type="text" onChange={this.handleCloseChange} value={this.state.close}/>
				<input type="submit" value="Add more"/>
			</form>
			);
	}

});

ReactDOM.render(<WorkBox/>,document.getElementById('content'));