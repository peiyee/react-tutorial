function uuid() {
    var i, random;
    var uuid = '';
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }

        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

var WorkBox = React.createClass({
	getInitialState: function(){
		return{data: [{id: uuid(),day: "Monday",open: "3pm",close: "5pm"},
						{id: uuid(),day: "Monday",open: "3pm",close: "5pm"}]};
	},
	addWorkingDayData: function(value){
		var works = this.state.data;
		works.push(value);
		this.setState({data: works});
	},
	deleteWorkingDayData: function(value){
		var works = this.state.data;
		for(var i=works.length-1; i>=0; i--) {
		    if( works[i].id == value) 
		    	works.splice(i,1);
		}
		this.setState({data: works});
	},
	render: function() {
		return(
			<div className="calendarBox">
				<WorkList onDeleteItem={this.deleteWorkingDayData} data={this.state.data}/>
				<WorkForm onChange={this.addWorkingDayData}/>
			</div>
		);
	}
});
var WorkList = React.createClass({
	render: function(){
			var rows = this.props.data.map(function(entry,i){
				return(
						<WorkingDay 
						onDeleteItem={this.props.onDeleteItem}  
						day={entry.day} 
						open={entry.open} 
						close={entry.close} 
						key={entry.id} 
						id={entry.id}
						/>
					);
			},this);
			return(
				<div className="ui message">
					<div className="header">Operation Hours</div>
					{rows}
				</div>
				);
	}
});
var WorkingDay = React.createClass({
	handleClick: function(){
		this.props.onDeleteItem(this.props.id);
	},
	render: function(){
		return(
				<div onClick={this.handleClick}>
					{this.props.day} {this.props.open} to {this.props.close}
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
			<form onSubmit={this.handleSubmitWork} className="ui form">
			    <div className="three fields">
			      <div className="field">
			        <label>Day</label>
			        <input 
			         type="text" 
			         onChange={this.handleDayChange} 
			         value={this.state.day}/>
			      </div>
			      <div className="field">
							    <label>Open</label>
							    <input 
			         type="text" 
			         onChange={this.handleOpenChange} 
			         value={this.state.open}/>
			      </div>
			      <div className="field">
							   <label>close</label>
							   <input 
			        type="text" 
			        onChange={this.handleCloseChange} 
			        value={this.state.close}/>
			      </div>
			    </div>
				<input className="ui button" type="submit" value="Save"/>
			</form>
			);
	}

});

ReactDOM.render(<WorkBox/>,document.getElementById('content'));