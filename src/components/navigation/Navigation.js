import React from 'react'
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Navigation = React.createClass({
  getInitialState() {
    return {
      current: '1',
    };
  },
  handleClick(e) {
    console.log('click ', e);
    this.setState({current: e.key});
    this.props.getRightContent(e.key);
  },
  getRightContent() {
    console.log('getRightContent');
    console.log(this.state.current);
    switch(this.state.current) {
        case '1': return (<div><Slider /></div>); break;
        case '2': return (<div><InfiniteScroll /></div>); break;
    }
  },
  render() {
    return (
		<Menu onClick={this.handleClick}
		style={{ width: 240 }}
		defaultOpenKeys={['sub1']}
		selectedKeys={[this.state.current]}
		mode="inline">
			<Menu.Item key="1">Slider 卡片滑动切换</Menu.Item>
			<Menu.Item key="2">Infinite Scroll 无限滚动</Menu.Item>
			<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Infinite Scroll 无限滚动</span></span>}>
				<Menu.Item key="5">Option 5</Menu.Item>
				<Menu.Item key="6">Option 6</Menu.Item>
				<SubMenu key="sub3" title="Submenu">
				<Menu.Item key="7">Option 7</Menu.Item>
				<Menu.Item key="8">Option 8</Menu.Item>
			</SubMenu>
		</SubMenu>
		</Menu>
    );
  },

})

export default Navigation