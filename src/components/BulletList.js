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
			list: [],
			hoverItemSelected:null
		}
	}

	_selectItemForEdit = (id) => {
		this.setState({
			item_selected_for_edit: id 
		})
	}

	_toggleSublistView = (e) => {
		let id = e.target.id
		let {list} = this.state;
		let pathArray = id.split('_');
		let pathToGet = "";
		_.map( pathArray, (i,index) => {
			if( index == 0 ){
				pathToGet += i;
			} else {
				pathToGet += '.list.'+i;
			}
		})
		let temp_list = objectPath.get(list,pathToGet)
		if( temp_list && temp_list.list && temp_list.list.length > 0 ){
			let isCollapsed = true;
			if( temp_list.collapsed ){
				isCollapsed = false;
			}
			temp_list.collapsed = isCollapsed;			
		}
		const newObj = immutable.set(list,pathToGet, temp_list)
		this.setState({
			list: newObj
		})
	}

	_onBulletClick = (e) => {
		let {list} = this.state;
		
	}

	_onBulletHover = (e) => {
		let {list} = this.state;
		// this._toggleSublistView( e.target.id );
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
			let lastIndexVal = (res[res.length - 1] * 1) - (1 * 1) ;
			if( lastIndexVal < 0 ){
				res = res.slice(0, -1);
			} else {
				res[res.length - 1] =  lastIndexVal;	
			}
			
			let toBeFocusLi = res.join("_");

			this.setState({
				list: newObj
			},() => {
				this._selectItemForEdit( toBeFocusLi )
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

	_moveItemToParentList = ( li_id, li_value ) => {
		if( li_id.indexOf('_') != -1 ){
			let newList = this.state.list;
			let res = li_id.split("_");
			let indexToUpdate = "";
			_.map( res, (i,index) => {
				if( index < res.length - 2 ){
					if( indexToUpdate != ""){
						indexToUpdate += "."
					}
					indexToUpdate += i+'.list';
				}
			})
			let temp_list = objectPath.get(newList,indexToUpdate)
			let newIndexToAddItem = (res[res.length - 2 ] * 1) + (1*1);
			let id_to_focus = ""
			_.map( res, (i,index) => {
				if( index < res.length - 2 ){
					id_to_focus += i+'_';
				}
			})
			id_to_focus +=newIndexToAddItem;
			temp_list.splice(newIndexToAddItem, 0 , { text: li_value });
			const newObj = immutable.set(newList,indexToUpdate, temp_list)

			this.setState({
				list: newObj
			}, () => {
				this._deleteItem(li_id)
				this.setState({
					item_selected_for_edit: id_to_focus
				})
			})
		}
	}


	_addSubList = ( li_id, li_value ) => {


		// if( li_id.indexOf('_') != -1 ){

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

			if( indexToUpdate != -1 ){
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
			}


		// } 
		// else {

		// 	let newItemIndex = li_id - 1;
		// 	if( newItemIndex >= 0 ){



		// 		let {list} = this.state;
		// 		let newList = this.state.list;
		// 		newList[newItemIndex].list = [
		// 			{
		// 				text: li_value
		// 			}
		// 		]

		// 		let item_selected_for_edit = newItemIndex + '_0';

		// 		this.setState({
		// 			list: newList
		// 		},() => {
		// 			this.setState({
		// 				item_selected_for_edit: item_selected_for_edit
		// 			})
		// 		})
		// 	}
		// }
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
			if( e.shiftKey ){
				this._moveItemToParentList( e.target.id, e.target.value );
			} else {
				this._addSubList( e.target.id, e.target.value );
			}
		} 
	}

	_renderItem = ( editMode, ULid, id, item ) => {

		let collapseExpandDiv = null;
		if( item.list && item.list.length > 0 ) {
			if( item.collapsed ){
				collapseExpandDiv = <span className="span-collapse-expand" id={id} onClick={this._toggleSublistView }> + </span>
			} else {
				collapseExpandDiv = <span className="span-collapse-expand" id={id} onClick={this._toggleSublistView}> - </span>	
			}
		}

		if( this.state.hoverItemSelected != id ){
			collapseExpandDiv = null
		}


		return <div className="li-box">
			<div 
				className="box-left"
				onMouseEnter={() => {
					this.setState({
						hoverItemSelected: id
					})
				}}
				onMouseLeave={() => {
					this.setState({
						hoverItemSelected: null
					})
				}}
			>
				{collapseExpandDiv}
				<span 
					className="dot" 
					id={id} 
					key={id} 
					// onClick={this._onBulletClick}
					// onMouseOver={this._onBulletHover}
				></span>
			</div>
			<div className="box-right">
				{ 
					editMode ?
				
						<div id={id} key={id}>
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
						</div>
					:

						<div id={id} key={id} data-set-id={ULid} className="non-edit-mode-div" onClick={() => this._selectItemForEdit(id)}>
							{item.text}
						</div>
					}
			</div>
			<div className="clear-float"/>
		</div>
	}

	_renderListItem = ( ULid, id, item ) => {
		let itt = null
		if( id == this.state.item_selected_for_edit ){
			itt = this._renderItem( true, ULid, id, item )
		} else {
			itt = this._renderItem( false, ULid, id, item )
		}
		let subList = null;
		if( item.list && item.list.length > 0 ) {
			if( item.collapsed ){
				
			} else {
				subList = this._renderList( id,  item.list );	
			}
		}

		// calculate padding left
		let paddingValue = 20;
		if( id.toString().indexOf('_') != -1 ){
			let explodeID = id.split("_");
			
			if( explodeID.length > 0 ){
				paddingValue = paddingValue * explodeID.length;
			}
		}

		return (<div>
			{itt}

			{
				subList ?
					<div className="sub-list">
						<div className="li-box">
							<div className="box-left">
								
							</div>
							<div className="box-right">
								{subList}
							</div>
							<div className="clear-float"/>
						</div>				
					</div>
				:
				null
			}
		</div>)
	}

	_renderList = (key, list) => {
		if( list.length == 0 ){
			list.push({
				text: ""
			})
		}

		let ULid = "UL0";
		return <div id={ULid} className="list-start">
			{_.map(list, (item, id ) => {
				if( key ){
					id = key + '_' + id
				}
				return this._renderListItem(ULid, id, item)
			})}
		</div>
	}

  render() {
  	let {list} = this.state;
  	if( list.length == 0 ){
			list.push({
				text: ""
			})
		}
  	let listItems = this._renderList( null, list);
    return (
    	<div id="bullets-list">
      	{listItems}
      </div>
    );
  }
}

export default BulletList;
