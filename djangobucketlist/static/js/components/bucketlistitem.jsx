import React, { Component } from 'react';
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
    ListGroup,
    ListGroupItem,
    Panel,
    Alert
} from 'react-bootstrap';

export default class BucketListItem extends Component {
    constructor() {
        super();
        this.deleteBucketlistItem = this.deleteBucketlistItem.bind(this);
        this.displayBucketlistItems = this.displayBucketlistItems.bind(this);
        this.displaySingleBucketlistItem = this.displaySingleBucketlistItem.bind(this);
        this.displayBucketlistItemsTitle = this.displayBucketlistItemsTitle.bind(this);
        this.handleEditBucketlistItem = this.handleEditBucketlistItem.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleUpdateBucketlistItem = this.handleUpdateBucketlistItem.bind(this);
        this.hideDeletePopover = this.hideDeletePopover.bind(this);
        this.updateBucketlistItem = this.updateBucketlistItem.bind(this);
        this.showEditBucketlistItemForm = this.showEditBucketlistItemForm.bind(this);
        this.hideEditBucketlistItemForm = this.hideEditBucketlistItemForm.bind(this);
        this.handleDisplayMessage = this.handleDisplayMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        //this.displayAllBucketlistItems = this.displayAllBucketlistItems.bind(this);
        this.state = {
          items: [],
          bucketlistId: 0,
          itemId: 0,
          itemName: '',
          showDeletePopover: false,
          showEditDeleteButton: "none",
          flashMessage: "",
          messageType: "success",
          displayFlashMessageStatus: "none",

        }
    }
    handleFieldChange(event) {
      event.preventDefault();
      let key = event.target.name;
      let value = event.target.value;
      this.setState({
          [key]: value
      });
    }

    displayBucketlistItems(bucketlistId, items) {

      if (!(bucketlistId === 0 || bucketlistId === '' || bucketlistId === undefined)) {
        if (items.length > 0) {
          return (
            items.map((item) => {
              return (
                this.displaySingleBucketlistItem(bucketlistId, item)
              );
          })
          );
        }
        else {
          return (
            <div>
              No items yet. Items are displayed within here
            </div>
        );
        };
      }
    }

  handleEditBucketlistItem(bucketlistId, itemId, itemName) {
    this.setState({
      bucketlistId: bucketlistId,
      itemId: itemId,
      itemName: itemName
    });
    this.showEditBucketlistItemForm();
  }
  showEditBucketlistItemForm() {
    this.setState({ editBucketlistItemForm: true})
  }

  hideEditBucketlistItemForm() {
    this.setState({ editBucketlistItemForm: false})
  }

  handleUpdateBucketlistItem(event) {
    event.preventDefault();
    this.updateBucketlistItem(this.state.bucketlistId, this.state.itemId, this.state.itemName);
    this.hideEditBucketlistItemForm();
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

  updateBucketlistItem(bucketlistId, itemId, itemName) {
    if (itemName === '') {
      return;
    }
    request
      .put('/api/v1/bucketlists/'+bucketlistId+'/items/'+itemId)
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .send({"name": itemName})
      .end((err, result) => {
        if (result.status === 200) {
          this.props.fetchBucketlistItems(bucketlistId);
          this.handleDisplayMessage("Succesfully updated", 3000, "success")
        } else {
          var message = "Unable to update item. Please try again"
          if (!(result.body.message) === undefined);
          {
            message = result.body.message
          }
          this.handleDisplayMessage(message, 3000, "danger" )
        }
      });
  }

  deleteBucketlistItem(bucketlistId, itemId) {
    if (bucketlistId === '' || bucketlistId === 0 || bucketlistId === undefined) {
      return;
    }
    if (itemId === '' || itemId === 0 || itemId === undefined) {
      return;
    }
    request
      .delete('/api/v1/bucketlists/'+bucketlistId+'/items/'+itemId)
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .end((err, result) => {
        if (result.status === 204) {
          this.props.fetchAllBucketlists();
          this.props.fetchBucketlistItems(bucketlistId);
          this.handleDisplayMessage("Succesfully deleted", 3000, "success")
        } else {
          var message = "Unable to delete item. Please try again"
          if (!(result.body.message) === undefined);
          {
            message = result.body.message
          }
          this.handleDisplayMessage(message, 3000, "danger" )
        }
      });
  }
  displaySingleBucketlistItem(bucketlistId, item) {
    return (
      <ListGroupItem onMouseEnter={this.mousenter}>
        <div className="row"  key={item.id}>
          <div id={item.id} className="single-bucketlist-item">
            <a className="item-name">{item.name} </a>
            <div className="manage">
              <a onClick={()=>this.handleEditBucketlistItem(bucketlistId, item.id, item.name)}><span className="badge btn edit-item" title="Edit this item">Edit</span></a>
              <OverlayTrigger
                trigger="click"
                container={document.body}
                placement="top"
                rootClose={true}
                show={this.state.showDeletePopover}
                onHide={() => this.setState({ showDeletePopover: false })}
                  overlay={
                  <Popover id = {bucketlistId} title="Do you really want to delete this item?">
                    <a style={{ 'marginLeft': 60, position: 'relative' }} className="btn btn-danger" onClick={()=>this.deleteBucketlistItem(bucketlistId, item.id)}>Yes</a>
                    <a style={{ 'marginLeft': 30, position: 'relative' }} className="btn btn-primary"
                    onClick={() => this.hideDeletePopover()}>No</a>

                  </Popover>}>
                  <a><span className="badge btn delete-item" title="Delete this item">Delete</span></a>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        </ListGroupItem>

    );
  }

  displayBucketlistItemsTitle(bucketlistId, bucketlistName) {
    if (bucketlistId === 0 || bucketlistId === '' || bucketlistId === undefined) {
        return (
          <div> No bucketlist selected. </div>
        )
    }
    else {
      return (

        <div>
      {this.props.bucketlistName}
        </div>
      )
    }
  }

  hideDeletePopover() {
    this.setState({ showDeletePopover: false })
  }

  render() {
    let closeEditBucketlistItemForm = () => this.setState({ editBucketlistItemForm: false });
    const props = this.props;
    return(
      <div>
      <div style={{display:this.props.displayNewItemMessageStatus}}>
      <Alert bsStyle={this.props.newItemMessageType}>
        {this.props.newItemFlashMessage}
      </Alert>
      </div>
      <div style={{display:this.state.displayFlashMessageStatus}}>
      <Alert bsStyle={this.state.messageType}>
        {this.state.flashMessage}
      </Alert>
      </div>
      <Panel header={props.bucketlistName}>
      <ListGroup fill>
      {this.displayBucketlistItems(props.bucketlistId, props.items)}
      </ListGroup>
      </Panel>

      <BucketListItemModalForm
        show={this.state.editBucketlistItemForm}
        onHide={closeEditBucketlistItemForm}
        handleFieldChange={this.handleFieldChange}
        onSave={this.handleUpdateBucketlistItem}
        formtitle={"Edit this item"}
        required={false}
        itemName={this.state.itemName}
      />
      </div>

    );
  }
}
