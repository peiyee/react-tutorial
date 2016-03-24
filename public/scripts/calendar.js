
var WorkBox = React.createClass({
	getInitialState: function(){
		return{data: [{id: _.uniqueId(),day: "Monday",open: "3pm",close: "5pm"},
						{id: _.uniqueId(),day: "Tuesday",open: "8am",close: "5pm"}],
				edit: ""};
	},
	addWorkingDay: function(value){
		var works = this.state.data;
		value.id = _.uniqueId();
		works.push(value);
		this.setState({data: _.sortBy(works,["id"])});
		this.setState({edit: ""});
	},
	updateWorkingDay: function(value){
		var works = this.state.data;
		works.push(value);
		this.setState({data: _.sortBy(works,["id"])});
		this.setState({edit: ""});
	},
	deleteWorkingDayData: function(value){
		var works = _.reject(this.state.data,{id: value});
		this.setState({data: works});
	},
	preUpdateWorkingDay: function(value){
		if(this.state.edit){
			// user must save before edit another item
			alert("Your are still editing...");
			return;
		}
		var day = _.find(this.state.data,{id: value});
		this.setState({edit: day});
		this.deleteWorkingDayData(value);
	},
	render: function() {
		return(
			<div className="calendarBox">
				<WorkList onEditItem={this.preUpdateWorkingDay} onDeleteItem={this.deleteWorkingDayData} data={this.state.data}/>
				<WorkForm isEdit={this.state.edit} onAdd={this.addWorkingDay} onUpdate={this.updateWorkingDay}/>
			</div>
		);
	}
});
var WorkList = React.createClass({
	render: function(){
			var rows = this.props.data.map(function(entry,i){
				return(
						<WorkingDay 
						onEditItem={this.props.onEditItem}
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
	handleEditClick: function(){
		this.props.onEditItem(this.props.id);
	},
	handleDeleteClick: function(){
		this.props.onDeleteItem(this.props.id);
	},
	render: function(){
		return(
				<div>
					<div>
						{this.props.day} {this.props.open} to {this.props.close}
					</div>
					<div onClick={this.handleEditClick} className="mini ui vertical animated button" tabIndex="0">
					  <div className="hidden content">Edit</div>
					  <div className="visible content">
					    <i className="edit icon"></i>
					  </div>
					</div>
					<div onClick={this.handleDeleteClick} className="mini ui vertical animated button" tabIndex="0">
					  <div className="hidden content">Delete</div>
					  <div className="visible content">
					    <i className="remove icon"></i>
					  </div>
					</div>
				</div>
			);
	}
});
var WorkForm = React.createClass({
	getInitialState: function() {
		return {day: "",open: "",close: ""};
	},
	componentWillReceiveProps: function(newProps){
		// will not setState if the props doesn't changed
		if(this.props.isEdit.id == newProps.isEdit.id)
			return;
		this.setState({day: newProps.isEdit.day});
		this.setState({open: newProps.isEdit.open});
		this.setState({close: newProps.isEdit.close});
		this.setState({id: newProps.isEdit.id});
	},
	handleOpenChange: function(e){
		console.log("typed");
		this.setState({open: e.target.value});
	},
	handleDayChange: function(e){
		console.log("typed");
		this.setState({day: e.target.value});
	},
	handleCloseChange: function(e){
		this.setState({close: e.target.value});
	},
	handleSubmitWork: function(e){
		e.preventDefault();
		console.log("add");
		var day = this.state.day.trim();
		var open = this.state.open.trim();
		var close = this.state.close.trim();
		if(!day||!open||!close)
			return;
		this.props.onAdd(this.state);
		this.setState({day: "",open: "",close:""});
	},
	handleUpdateWork: function(e){
		e.preventDefault();
		console.log("edit");
		var day = this.state.day.trim();
		var open = this.state.open.trim();
		var close = this.state.close.trim();
		if(!day||!open||!close)
			return;
		this.props.onUpdate(this.state);
		this.setState({day: "",open: "",close:"",id:""});
	},
	componentDidMount: function(){
		console.log("Did mount");
      $('div[name="dayInputDropdown"]')
        .dropdown({
        	onChange: (value,text) =>{
        		console.log(value);
        		this.setState({day: value});
        	}
        });
      $('div[name="openInputDropdown"]')
        .dropdown({
        	onChange: (value,text) =>{
        		console.log(value);
        		this.setState({open: value});
        	}
        });
       $('div[name="closeInputDropdown"]')
          .dropdown({
          	onChange: (value,text) =>{
          		console.log(value);
          		this.setState({close: value});
          	}
          });
    },
    componentDidUpdate() {
    	console.log("Did update");
        $('.ui.dropdown').dropdown('refresh');
     },
	render: function(){
		return(
			<form onSubmit={this.props.isEdit ? this.handleUpdateWork : this.handleSubmitWork} className="ui form">
			    <div className="four fields">
			      <div className="field">
			        <label>Day</label>
			        <div name="dayInputDropdown" className="ui fluid search selection dropdown">
			          <input type="hidden" name="user"/>
			          <i className="dropdown icon"></i>
			          <div ref="dayInput" onChange={this.handleDayChange} className="default text">Select</div>
			          <DayList days={days}/>
			        </div>
			      </div>
			      <div className="field">
				    <label>Open</label>
				    <div name="openInputDropdown" className="ui fluid search selection dropdown">
			          <input type="hidden" name="user"/>
			          <i className="dropdown icon"></i>
			          <div onChange={this.handleOpenChange} className="default text">Select</div>
			          <TimeList timeSlots={timeSlots}/>
			        </div>
			      </div>
			      <div className="field">
				    <label>Close</label>
				    <div name="closeInputDropdown" className="ui fluid search selection dropdown">
			          <input type="hidden" name="user"/>
			          <i className="dropdown icon"></i>
			          <div onChange={this.handleCloseChange} className="default text">Select</div>
			          <TimeList timeSlots={timeSlots}/>
			        </div>
			      </div>
			    </div>
				<input className="ui button" type="submit" value={this.props.isEdit ? "Update":"Save"}/>
			</form>
			);
	}
});

var DayList = React.createClass({
	render: function(){
		var days = this.props.days.map(function(entry){
				return(
					  <div key={_.uniqueId()} className="item">
					    {entry.full}
					  </div>
					  );
				},this);
		return(
				<div className="menu">
					{days}
				</div>
				);
	}

});

var TimeList = React.createClass({
	render: function(){
		var timeSlots = this.props.timeSlots.map(function(entry){
			return(
					<div key={_.uniqueId()} className="item">
						{entry}
					</div>
				);
		},this);
		return(
				<div className="menu">
					{timeSlots}
				</div>
			);
	}

});

var getTimeSlot = function(divider){
	var append = function(e,elem){
		return elem+e;
	};
	var total_minutes = 12 * 60;
	divider = divider || 60;
	var slots = [total_minutes];
	while(total_minutes>0){
		total_minutes -= divider;
		slots.push(total_minutes);
	}
	slots.pop();
	slots = slots.reverse().map(convertMinutesToHourMinute);
	slots = slots.map(append.bind(null,"am")).concat(slots.map(append.bind(null,"pm")));
	return slots;
};

var convertMinutesToHourMinute = function(min){
	if(min<0)
		return;
	var hours = (Math.trunc(min/60)).toString();
	var minutes = (min % 60).toString();
	minutes = minutes.length==2 ? minutes : minutes+"0";
	return(hours+":"+minutes);
};

var timeSlots = getTimeSlot(60);

var days = [
  {
    "full": "Monday",
    "short":"Mon"
  },
  {
    "full": "Tuesday",
    "short":"Tue"
  },
  {
    "full": "Wednesday",
    "short":"Wed"
  },
  {
    "full": "Thursday",
    "short":"Thu"
  },
  {
    "full": "Friday",
    "short":"Fri"
  },
  {
    "full": "Saturday",
    "short":"Sat"
  },
  {
    "full": "Sunday",
    "short":"Sun"
  }
];
//{this.props.isEdit ? "Update":"Save"}
// ReactDOM.render(<WorkBox/>,document.getElementById('content'));
ReactDOM.render(<WorkBox/>,document.getElementById('content'));