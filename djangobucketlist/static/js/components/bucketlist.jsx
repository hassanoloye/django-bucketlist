import React, { Component } from 'react';
import BucketListItem from './bucketlistitem.jsx';
import BucketListModalForm from './bucketlist-modal.jsx';
import BucketListItemModalForm from './bucketlist-item-modal.jsx';
import request from 'superagent';
import {
    Col,
    form,
    Form,
    FormGroup,
    FormControl,
    Control,
    ControlLabel,
    Checkbox,
    Button,
    Tab,
    Tabs,
    ButtonToolbar,
    OverlayTrigger,
    Overlay,
    Popover,
    Accordion,
    Panel,
    Alert
} from 'react-bootstrap';

export default class BucketList extends Component {
    constructor() {
        super();
        this.onbucketlistClick = this.onbucketlistClick.bind(this);
        this.deleteBucketlist = this.deleteBucketlist.bind(this);
        this.displayAllBucketlists = this.displayAllBucketlists.bind(this);
        this.displaySingleBucketlist = this.displaySingleBucketlist.bind(this);
        this.fetchBucketlistItems = this.fetchBucketlistItems.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSaveNewBucketlistItem = this.handleSaveNewBucketlistItem.bind(this);
        this.saveNewBucketlistItem = this.saveNewBucketlistItem.bind(this);
        this.submitNewBucketlistItem = this.submitNewBucketlistItem.bind(this);
        this.showNewBucketlistItemForm = this.showNewBucketlistItemForm.bind(this);
        this.showEditBucketlistForm = this.showEditBucketlistForm.bind(this);
        this.handleEditBucketlist = this.handleEditBucketlist.bind(this);
        this.handleUpdateBucketlist = this.handleUpdateBucketlist.bind(this);
        this.updateBucketlist = this.updateBucketlist.bind(this);
        this.handleSaveNewBucketlist = this.handleSaveNewBucketlist.bind(this);
        this.saveNewBucketlist = this.saveNewBucketlist.bind(this);
        this.showNewBucketlistForm = this.showNewBucketlistForm.bind(this);
        this.hideNewBucketlistForm = this.hideNewBucketlistForm.bind(this);
        this.handleDisplayMessage = this.handleDisplayMessage.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        this.hideDeletePopover = this.hideDeletePopover.bind(this);
        this.handleDisplayNewItemMessage = this.handleDisplayNewItemMessage.bind(this);
        this.displayNewItemMessage = this.displayNewItemMessage.bind(this);
        this.hideNewItemMessage = this.hideNewItemMessage.bind(this);
        this.state = {
          items: [],
          bucketlists: [],
          newBucketListName: '',
          bucketlistName: '',
          bucketlistId: 0,
          itemName: '',
          showDeletePopover: false,
          itemDoneStatus: false,
          flashMessage: "",
          messageType: "success",
          displayFlashMessageStatus: "none",
          displayNewItemMessageStatus: "none",
          newItemFlashMessage: "",
          newItemMessageType: "success",
        }
    }

    onbucketlistClick(bucketlistId, bucketlistName) {
      if (bucketlistId === '' || bucketlistId === undefined) {
        this.setState({items: []});
      }
      else {
        this.setState({
          bucketlistId: bucketlistId,
          bucketlistName: bucketlistName
        });
        this.fetchBucketlistItems(bucketlistId);
      }
    }

    showNewBucketlistForm(event) {
      event.preventDefault();
      return this.setState({ newBucketlistForm: true });
    }

    hideNewBucketlistForm() {
      this.setState({ newBucketlistForm: false });
    }

    handleSaveNewBucketlist(event) {
      event.preventDefault();
      this.saveNewBucketlist(this.state.newBucketListName);
      this.hideNewBucketlistForm();
    }

    saveNewBucketlist(bucketlistName) {
      if (bucketlistName === '') {
        return;
      }
      request
        .post('/api/v1/bucketlists/')
        .type('form')
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .send({"name": bucketlistName})
        .end((err, result) => {
          if (result.status === 201) {
            this.props.fetchAllBucketlists();
            this.handleDisplayMessage("Succesfully created", 3000, "success")
          } else {
            var message = "Unable to create a new bucketlist. Please try again"
            if (!(result.body.message) === undefined);
            {
              message = result.body.message
            }
            this.handleDisplayMessage(message, 3000, "danger" )
          }
        });
    }
    handleDisplayMessage(message, timeout=3000, messageType) {
      this.displayMessage(message, messageType);
      setTimeout(this.hideMessage, timeout);
    }

    hideMessage() {
      this.setState({displayFlashMessageStatus: "none",
                    flashMessage: ""
                  });
    }

    displayMessage(message, messageType) {
      this.setState({flashMessage: message,
                    displayFlashMessageStatus: "block",
                    messageType: messageType
                  });
    }

    handleDisplayNewItemMessage(message, timeout=3000, messageType) {
      this.displayNewItemMessage(message, messageType);
      setTimeout(this.hideNewItemMessage, timeout);
    }

    displayNewItemMessage(message, messageType) {
      this.setState({newItemFlashMessage: message,
                      displayNewItemMessageStatus: "block",
                    newItemMessageType: messageType});

    }

    hideNewItemMessage() {
      this.setState({displayNewItemMessageStatus: "none",
                    newItemFlashMessage: ""
                  });
    }

    deleteBucketlist(bucketlistId) {
      if (bucketlistId === '' || bucketlistId === 0 || bucketlistId === undefined) {
        return;
      }
      request
        .delete('/api/v1/bucketlists/'+bucketlistId)
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .end((err, result) => {
          if (result.status === 204) {
            this.props.fetchAllBucketlists();
            this.handleDisplayMessage("Succesfully deleted", 3000, "success")
          } else {
            var message = "Unable to delete. Please try again"
            if (!(result.body.message) === undefined);
            {
              message = result.body.message
            }
            this.handleDisplayMessage(message, 3000, "danger" )
          }
        });
    }

    handleSaveNewBucketlistItem(bucketlistId, bucketlistName) {
      this.setState({
        bucketlistId: bucketlistId,
        bucketlistName: bucketlistName,
      });
      this.showNewBucketlistItemForm();
    }

    handleFieldChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        this.setState({
            [key]: value
        });
    }

    showNewBucketlistItemForm() {
      this.setState({ newBucketlistItemForm: true });
    }

    submitNewBucketlistItem(event) {
      event.preventDefault();
      this.saveNewBucketlistItem(this.state.bucketlistId, this.state.itemName);
      this.hideNewBucketlistItemForm();
    }
    saveNewBucketlistItem(bucketlistId, itemName) {
      if (itemName === '') {
        return;
      }
      request
        .post('/api/v1/bucketlists/'+bucketlistId+'/items/')
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .send({"name": itemName })
        .end((err, result) => {
          if (result.status === 201) {
            this.props.fetchAllBucketlists();
            this.fetchBucketlistItems(bucketlistId);
            this.handleDisplayNewItemMessage("Sucessfully created", 3000, "success")
          } else {
            var message = "Unable to create item. Please try again"
            if (!(result.body.message) === undefined);
            {
              message = result.body.message
            }
            this.handleDisplayNewItemMessage(message, 3000, "danger" )
          }
        });
    }

    hideNewBucketlistItemForm() {
      this.setState({ newBucketlistItemForm: false });
    }

    handleEditBucketlist(bucketlistId, bucketlistName) {
      this.setState({
        bucketlistId: bucketlistId,
        bucketlistName: bucketlistName
      });
      this.showEditBucketlistForm();
    }

    showEditBucketlistForm() {
      this.setState({ editBucketlistForm: true });
    }
    hideEditBucketlistForm() {
      this.setState({ editBucketlistForm: false });
    }

    handleUpdateBucketlist(event) {
      event.preventDefault();
      this.updateBucketlist(this.state.bucketlistId, this.state.bucketlistName);
      this.hideEditBucketlistForm();
    }

    updateBucketlist(bucketlistId, bucketlistName) {
      if (bucketlistName === '') {
        return;
      }
      request
        .put('/api/v1/bucketlists/'+bucketlistId)
        .type('form')
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .send({"name": bucketlistName})
        .end((err, result) => {
          if (result.status === 200) {
            this.props.fetchAllBucketlists();
            this.handleDisplayMessage("Succesfully updated", 3000, "success")
          } else {
            var message = "Unable to update your bucketlist. Please try again"
            if (!(result.body.message) === undefined);
            {
              message = result.body.message
            }
            this.handleDisplayMessage(message, 3000, "danger" )
          }
        });
    }

    displayAllBucketlists() {
        if (this.props.bucketlists.length > 0) {
          return (
            this.props.bucketlists.map((bucketlist) => {
              return (
                this.displaySingleBucketlist(bucketlist, (this.props.bucketlists.indexOf(bucketlist)+1).toString())
              );
          })
          );
        }
        else {
          return (
            <div>
              No bucketlist yet. Click the Create New bucketlist
               to start creating a bucketlist
            </div>
        );
        };

    }
    hideDeletePopover() {
      console.log(this.state.showDeletePopover)
      this.setState({ showDeletePopover: false })
    }
    displaySingleBucketlist(bucketlist, bucketlistIndex) {
      return (

              <Panel header={bucketlist.name + "(" + bucketlist.items.length +")"} eventKey={bucketlistIndex} onClick={()=>this.onbucketlistClick(bucketlist.id, bucketlist.name)} onExit = {this.testexit} onEntering={this.testentered}>
              <div className="row"  key={bucketlist.id}>
                <div className="single-bucketlist">

              <div className="manage">
                <a onClick={()=>this.handleSaveNewBucketlistItem(bucketlist.id, bucketlist.name)}><span className="badge add-item" title="Add Items">Add items</span></a>
                <a onClick={()=>this.handleEditBucketlist(bucketlist.id, bucketlist.name)}><span className="badge btn edit-item" title="Edit this bucetlist">Edit</span></a>
                <OverlayTrigger
                  trigger="click"
                  container={document.body}
                  placement="top"
                  rootClose={true}
                  target={() => ReactDOM.findDOMNode(this.refs.target)}
                  show={this.state.showDeletePopover}
                  onHide={() => this.setState({ showDeletePopover: false })}
                    overlay={
                    <Popover id = {bucketlist.id} title="Do you really want to delete this bucketlist?">
                      <a style={{ 'marginLeft': 60, position: 'relative' }} className="btn btn-danger" onClick={()=>this.deleteBucketlist(bucketlist.id)}>Yes</a>
                      <a style={{ 'marginLeft': 30, position: 'relative' }} className="btn btn-primary"
                      onClick={() => this.hideDeletePopover()}>No</a>

                    </Popover>}>
                    <a> <span className="badge btn delete-item" title="Delete this bucketlist">Delete</span></a>
                </OverlayTrigger>


              </div>
              </div>
            </div>
              </Panel>



    );
  }

    fetchBucketlistItems(bucketlistId) {
      request
        .get(`/api/v1/bucketlists/`+bucketlistId)
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .end((err, result) => {
          if (result.status === 200) {
            this.setState({
              items: result.body.items,
            });
          } else {
            this.setState({
              items: [],
            });
          }
        });
    }

    render() {

      let closeEditBucketlistForm = () => this.setState({ editBucketlistForm: false})
      let closeNewBucketistItemForm = () => this.setState({ newBucketlistItemForm: false });
      let closeNewBucketlistForm = () => this.setState({ newBucketlistForm: false });

      return(
        <div>
        <div><a className="new-bucket-list" onClick={this.showNewBucketlistForm} title="Create New Bucketlist"><span className="glyphicon glyphicon-plus-sign"></span></a></div>
          <div className="bucket-list">
          <div style={{display:this.state.displayFlashMessageStatus}}>
          <Alert bsStyle={this.state.messageType}>
            {this.state.flashMessage}
          </Alert>
          </div>
          <Accordion>
            {this.displayAllBucketlists()}
            </Accordion>
          </div>

          <div className="bucket-list-items">
            <BucketListItem
            bucketlistId = {this.state.bucketlistId}
            bucketlistName = {this.state.bucketlistName}
            items={this.state.items}
            fetchAllBucketlists={this.props.fetchAllBucketlists}
            fetchBucketlistItems={this.fetchBucketlistItems}
            newItemMessageType={this.state.newItemMessageType}
            newItemFlashMessage={this.state.newItemFlashMessage}
            displayNewItemMessageStatus={this.state.displayNewItemMessageStatus} />
          </div>

          <BucketListModalForm
            show={this.state.newBucketlistForm}
            onHide={closeNewBucketlistForm}
            handleFieldChange={this.handleFieldChange}
            onSave={this.handleSaveNewBucketlist}
            formName="newBucketListName"
            formtitle="Add Bucketlist"
            placeholder="Enter bucketlist name"
          />


          <BucketListItemModalForm
            show={this.state.newBucketlistItemForm}
            onHide={closeNewBucketistItemForm}
            handleFieldChange={this.handleFieldChange}
            onSave={this.submitNewBucketlistItem}
            formtitle={"Add an item to " + this.state.bucketlistName}
            placeholder="Enter item name"
            required={true}
          />



          <BucketListModalForm
            show={this.state.editBucketlistForm}
            onHide={closeEditBucketlistForm}
            bucketlistName = {this.state.bucketlistName}
            handleFieldChange={this.handleFieldChange}
            onSave={this.handleUpdateBucketlist}
            formName="bucketlistName"
            formtitle="Edit Bucketlist"
          />

        </div>
      );
    }
}
