import './recommendCard.less'
import React from 'react'

const RecommendCard = React.createClass({
    getInitialState(){
        return {
            item: this.props.item,
            index: this.props.index
        }
    },
    render(){
        const {item, index} = this.state;
        const me = this;
        return (<div className="recommend-item">
            <img src={this.state.item.image} alt=""/>
        </div>);
    }
})

export default  RecommendCard