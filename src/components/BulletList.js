import React, { Component } from 'react';
import _ from 'lodash'

class BulletList extends Component {
	constructor(props){
		super(props);
		this.state = {
			item_selected_for_edit: 0,
			list: []
		}
	}

	_selectItemForEdit = (id) => {
		this.setState({
			item_selected_for_edit: id 
		})
	}

	_onChangeItemText = (e) => {
		let editedItemId = e.target.id
		let editedItemValue = e.target.value
		let newList = _.map( this.state.list, (item, id) => {
			if( id == editedItemId ){
				return {
					text: editedItemValue
				}
			} else {
				return item
			}
		})
		this.setState({
			list: newList
		})
	}

	_renderSelectedItem = ( id, item ) => {
		return <li id={id} key={id}>
			<input
				id={id}
				className="current-edit-item" 
				type="text" 
				value={item.text}
				onChange={this._onChangeItemText}
			/>
		</li>
	}

	_renderListItem = ( id, item ) => {
		if( id === this.state.item_selected_for_edit ){
			return this._renderSelectedItem( id, item )
		} else {			
			return <li id={id} key={id} onClick={() => this._selectItemForEdit(id)}>
				{item.text}
			</li>
		}
	}

	_renderList = () => {
		const { list } = this.state;
		if( list.length == 0 ){
			list.push({
				text: ""
			})
		}
		console.log( list )
		return <ul>
			{_.map(list, (item, id ) => {
				return this._renderListItem(id, item)
			})}
		</ul>
	}

  render() {
  	console.log( this.state )
  	let listItems = this._renderList();
    return (
    	<div id="bullets-list">
      	<h1>Bullet List</h1>
      	{listItems}
      </div>
    );
  }
}

export default BulletList;
