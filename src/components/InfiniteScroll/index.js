import React from 'react'
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const InfiniteScroll = React.createClass({
  getInitialState() {
    return {
      current: '1',
    };
  },
  render() {
    return (
		<div>InfiniteScroll</div>
    );
  },

})

export default InfiniteScroll