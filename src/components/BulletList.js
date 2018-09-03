import React, { Component } from 'react';
import _ from 'lodash'
import ReactDOM from 'react-dom';

class BulletList extends Component {
	constructor(props){
		super(props);
		this.state = {
			timesBackspacePressed: 0,
			item_selected_for_edit: 0,
			list: []
		}
	}

	_selectItemForEdit = (id) => {
		this.setState({
			item_selected_for_edit: id 
		})
	}

	_updateItem = ( itemid, value ) => {
		let newList = _.map( this.state.list, (item, id) => {
			if( id == itemid ){
				return {
					text: value
				}
			} else {
				return item
			}
		})
		this.setState({
			list: newList
		})
	}

	_deleteItem = ( itemid ) => {
		let newList = this.state.list;
		_.remove( newList, (item, id) => {
			if( id == itemid ){
				return true
			}
		})
		let toBeFocusLi = itemid - 1;
		if( toBeFocusLi < 0 ){
			toBeFocusLi = 0;
		}
		this.setState({
			list: newList,
			timesBackspacePressed: 0 // reset
		},() => {
			this._selectItemForEdit( toBeFocusLi )
		})
	}

	_onChangeItemText = (e) => {
		let editedItemId = e.target.id
		let editedItemValue = e.target.value
		this._updateItem( editedItemId, editedItemValue );		
	}

	_addEmptyNewListItem = ( parentUL_key ) => {
		let newItemIndex = this.state.item_selected_for_edit + 1;
		let newList = this.state.list;
		newList.splice(newItemIndex, 0 , { text: '' })
		let toBeFocusLi = newItemIndex;
		this.setState({
			list: newList
		},() => {
			this._selectItemForEdit( toBeFocusLi )
		})
	}

	_onKeyPressItemText = (e) => {
		if( e.key == 'Enter' ){
			let editedItemId = e.target.id
			let parentULid = e.target.getAttribute('data-set-id');
			let parentUL_key = parentULid.replace("UL", "").trim();
			this._addEmptyNewListItem( parentUL_key );
		} else if( e.key == 'Backspace' ){
			let timesBackspacePressed = this.state.timesBackspacePressed;
			if( e.target.value.length == 0 ) {
				timesBackspacePressed += 1;
			}
			if( timesBackspacePressed == 2 ){
				this._deleteItem( e.target.id )
			} else {
				this.setState({ timesBackspacePressed: timesBackspacePressed })
			}
		}
	}

	_renderSelectedItem = ( ULid, id, item ) => {
		return <li id={id} key={id}>
			<input
				autoFocus
				id={id}
				className="current-edit-item" 
				data-set-id={ULid}
				type="text" 
				value={item.text}
				onChange={this._onChangeItemText}
				onKeyDown={this._onKeyPressItemText}
			/>
		</li>
	}

	_renderListItem = ( ULid, id, item ) => {
		if( id === this.state.item_selected_for_edit ){
			return this._renderSelectedItem( ULid, id, item )
		} else {			
			return <li id={id} key={id} data-set-id={ULid} onClick={() => this._selectItemForEdit(id)}>
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
		// console.log( list )
		let ULid = "UL0";
		return <ul id={ULid}>
			{_.map(list, (item, id ) => {
				return this._renderListItem(ULid, id, item)
			})}
		</ul>
	}

  render() {
  	// console.log( this.state )
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
