import React, { Component } from 'react';
import _ from 'lodash'
import ReactDOM from 'react-dom';
import immutable from 'object-path-immutable'

import objectPath from "object-path";

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
		let newList = this.state.list;
		let res = itemid.split("_");			
		let indexToUpdate = "";
		_.map( res, (i,index) => {
			if( index == 0 ){
				indexToUpdate += i;
			} else {
				indexToUpdate += '.list.'+i;
			}
		})
		indexToUpdate = indexToUpdate + '.text';
		const newObj = immutable.set(newList,indexToUpdate, value)
		this.setState({
			list: newObj
		})
	}

	_deleteItem = ( itemid ) => {
		if( itemid.indexOf('_') != -1 ){ 
			let newList = this.state.list;
			let res = itemid.split("_");	
			let indexToUpdate = "";
			_.map( res, (i,index) => {
				
				
				if( index < res.length - 1 ){
					if( indexToUpdate != ""){
						indexToUpdate += "."
					}
					indexToUpdate += i+'.list';
				} 
				// else {
				// 	indexToUpdate += '.'+i;
				// }
			})
			let currentItemIndex = res[res.length - 1];
			let itemIndexToRemove = (currentItemIndex * 1);
			let temp_list = objectPath.get(newList,indexToUpdate)

			_.remove( temp_list, (i, ind) => {
				if( ind == itemIndexToRemove ){
					return true;
				}
			})

			// temp_list.splice(newItemIndex, 0 , { text: '' });
			const newObj = immutable.set(newList,indexToUpdate, temp_list)
			// res[res.length - 1] =  (res[res.length - 1] * 1) + (1 * 1) ;
			// let toBeFocusLi = res.join("_");
			this.setState({
				list: newObj
			})
			// ,() => {
			// 	this._selectItemForEdit( toBeFocusLi )
			// })
		} else {

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
	}

	_onChangeItemText = (e) => {
		let editedItemId = e.target.id
		let editedItemValue = e.target.value
		this._updateItem( editedItemId, editedItemValue );		
	}

	_addEmptyNewListItem = ( currentId  ) => {
		if( currentId.indexOf('_') != -1 ){ 
			let newList = this.state.list;
			let res = currentId.split("_");	
			let indexToUpdate = "";
			_.map( res, (i,index) => {
				if( index < res.length - 1 ){
					if( indexToUpdate != ""){
						indexToUpdate += "."
					}
					indexToUpdate += i+'.list';
				}
			})
			let currentItemIndex = res[res.length - 1];
			let newItemIndex = (currentItemIndex * 1) + (1 * 1);
			let temp_list = objectPath.get(newList,indexToUpdate)
			temp_list.splice(newItemIndex, 0 , { text: '' });
			const newObj = immutable.set(newList,indexToUpdate, temp_list)
			res[res.length - 1] =  (res[res.length - 1] * 1) + (1 * 1) ;
			let toBeFocusLi = res.join("_");
			this.setState({
				list: newObj
			},() => {
				this._selectItemForEdit( toBeFocusLi )
			})
		} else {
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
	}


	_addSubList = ( li_id, li_value ) => {
		if( li_id.indexOf('_') != -1 ){

			let newList = this.state.list;
			let res = li_id.split("_");	

			res[res.length - 1] =  (res[res.length - 1] * 1) - (1 * 1) ;

			let indexToUpdate = "";
			_.map( res, (i,index) => {
				if( index == 0 ){
					indexToUpdate += i;
				} else {
					indexToUpdate += '.list.'+i;
				}
			})

			// let currentItemIndex = res[res.length - 1];
			// let newItemIndex = currentItemIndex + 1;
			let temp_list = objectPath.get(newList,indexToUpdate)

			temp_list.list = [{
				text: ''
			}]

			const newObj = immutable.set(newList,indexToUpdate, temp_list)

			let item_selected_for_edit = res.join("_") +'_0';

			this.setState({
				list: newObj
			},() => {
				this.setState({
					item_selected_for_edit: item_selected_for_edit
				})
			})


		} else {
			let newItemIndex = li_id - 1;
			let {list} = this.state;
			let newList = this.state.list;
			newList[newItemIndex].list = [
				{
					text: li_value
				}
			]

			let item_selected_for_edit = newItemIndex + '_0';

			this.setState({
				list: newList
			},() => {
				this.setState({
					item_selected_for_edit: item_selected_for_edit
				})
			})
		}
	}

	_onKeyPressItemText = (e) => {
		if( e.key == 'Enter' ){
			let editedItemId = e.target.id
			let parentULid = e.target.getAttribute('data-set-id');
			let parentUL_key = parentULid.replace("UL", "").trim();
			this._addEmptyNewListItem( editedItemId );
		} else if( e.key == 'Backspace' ){
			let timesBackspacePressed = this.state.timesBackspacePressed;
			if( e.target.value.length == 0 ) {
				timesBackspacePressed += 1;
			}
			if( timesBackspacePressed == 1 ){
				this._deleteItem( e.target.id )
				e.preventDefault();
			} else {
				this.setState({ timesBackspacePressed: timesBackspacePressed })
			}
		} else if( e.key == 'Tab' ){
			e.preventDefault();
			this._addSubList( e.target.id, e.target.value );
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
			let subList = null;
			if( item.list && item.list.length > 0 ) {
				subList = this._renderList( id,  item.list );
			}
			return <div>
				<li id={id} key={id} data-set-id={ULid} onClick={() => this._selectItemForEdit(id)}>
					{item.text}
				</li>
				{subList}
			</div>
		}
	}

	_renderList = (key, list) => {
		if( list.length == 0 ){
			list.push({
				text: ""
			})
		}

		let ULid = "UL0";
		return <ul id={ULid}>
			{_.map(list, (item, id ) => {
				if( key ){
					id = key + '_' + id
				}
				return this._renderListItem(ULid, id, item)
			})}
		</ul>
	}

  render() {
  	console.log( this.state )
  	let {list} = this.state;
  	if( list.length == 0 ){
			list.push({
				text: ""
			})
		}
  	let listItems = this._renderList( null, list);
    return (
    	<div id="bullets-list">
      	<h1>Bullet List</h1>
      	{listItems}
      </div>
    );
  }
}

export default BulletList;
