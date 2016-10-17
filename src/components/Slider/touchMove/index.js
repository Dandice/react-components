import './slider.less'
import React from 'react'
import {wrapperClick} from '../../utils/tap'

const transformName = (function () {
    var _elementStyle = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        transform,
        i = 0,
        l = vendors.length;

    for (; i < l; i++) {
        transform = vendors[i] + 'ransform';
        if (transform in _elementStyle) return transform;
    }
})();
let time = 400;


const Slider = React.createClass({
    getInitialState(){
        console.log('24 getInitialState');
        let {loop = false, itemClass = 'navigator_item'} = this.props;
        loop = loop && this.props.children.length > 1;
        time = this.props.time || 400;
        return {
            loop,
            itemClass,
            children: this.setChildren(this.props)
        }
    },    
    componentWillReceiveProps(nextProps){
        let children = this.setChildren(nextProps);
        this.setState({
            children: children,
            loop: nextProps.loop && this.props.children.length > 1
        });
    },
    componentWillUpdate(nextProps){

    },
    componentDidUpdate(){
        this.setSliderInfo();
        if (this.props.reset) {
            this.toCard(this.state.loop ? 1 : 0, time);
        }
    },
    componentDidMount(){
        this.initSet = true;
        this.wrapper = this.refs.wrapper;
        console.log(this.refs.wrapper);
        this.x = 0;
        this.y = 0;
        this.currentIndex = this.state.loop ? 1 : 0;
        this.setSliderInfo();
        if (this.props.move) this.bindListener();
        this.toCard(this.currentIndex, 0);
        this.initSet = false;
        this.props.cb && this.props.cb(0);
        if (this.props.navigator) {
            this.setNav();
        }
    },
    setChildren(props){
        let preTotal = this.total;
        let children = Array.isArray(props.children) ? props.children.slice(0) : [props.children];
        let childrenLength = children.length;
        if (props.loop && childrenLength > 1) {
            let firstChild = React.cloneElement(children[0], {
                key: children[0].key + 'loop'
            });
            let lastChild = React.cloneElement(children[childrenLength - 1], {
                key: children[childrenLength - 1].key + 'loop'
            });
            children.unshift(lastChild);
            children.push(firstChild);
        }
        this.total = children.length;
        console.log('props.sliderWidth');
        console.log(props.sliderWidth);
        this.itemWidth = props.sliderWidth;
        if (this.scroller && preTotal < this.total) {
            this.scroller.style.width = this.total * this.itemWidth + 'px';
        }
        return children;
    },
    setSliderInfo(){
        if (this.initSet) {
            this.scroller = this.refs.scroller;
            this.scroller.style['transitionTimingFunction'] = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.style = this.scroller.style;
            this.scroller.addEventListener('transitionend', this.transitionEnd);
            this.scroller.addEventListener('webkitTransitionEnd', this.transitionEnd);
        }
        let children = this.scroller.children;
        for (let i = 0; i < children.length; i++) {
            console.log('97 this.itemWidth');
            console.log(this.itemWidth);
            children[i].style.width = this.itemWidth + 'px';
        }
        this.scroller.style.width = this.total * this.itemWidth + 'px';
        this.maxOffsetWidth = 0 - this.itemWidth * (this.total - 1);
    },
    bindListener(){
        this.wrapper.addEventListener('touchstart', this.start);
        this.wrapper.addEventListener('touchmove', this.move);
        this.wrapper.addEventListener('touchend', this.end);
        this.wrapper.addEventListener('touchcancel', this.end);

    },
    unbindListener(){
        this.wrapper.removeEventListener('touchstart', this.start);
        this.wrapper.removeEventListener('touchmove', this.move);
        this.wrapper.removeEventListener('touchend', this.end);
        this.wrapper.removeEventListener('touchcancel', this.end);
    },
    render(){
        return <div className="slider_wrapper" ref="wrapper" style={{width: this.props.sliderWidth}} >
            {this.getPreBtn()}
            <div ref="scroller" className="slide_scroller">
                {this.state.children}
            </div>
            {this.getNavigator()}
            {this.getNextBtn()}
        </div>
    },
    getPreBtn() {
        if (this.props.useButton) return <div onClick={wrapperClick(this.prev)}
                                              className={this.props.preBtnClass}></div>
    },
    getNextBtn(){
        if (this.props.useButton) return <div onClick={wrapperClick(this.next)}
                                              className={this.props.nextBtnClass}></div>
    },
    getNavigator(){
        if (this.props.navigator) {
            let children = this.state.loop ? this.state.children.slice(0, this.state.children.length - 2) : this.state.children;
            return <div className={this.props.navigatorClass} ref="nav">
                {children.map(()=> {
                    return <span></span>
                })}
            </div>
        }
    },
    prev(){
        this.toCard(this.currentIndex - 1, time);
    },
    next(){
        this.toCard(this.currentIndex + 1, time);
    },
    start(e){
        if (this.inTransition) {
            this.pauseTransition();
        }
        this.distX = 0;
        this.distY = 0;
        this.startX = this.x;
        this.startY = this.y;
        this.pointX = e.touches[0].pageX;
        this.pointY = e.touches[0].pageY;
        this.startTime = Date.now();
        this.moved = true;
        this.setTransitionTime();
        this.directionLocked = null;
        this.swipeDirection = false;
    },
    move(e){
        let point = e.touches[0],
            deltaX = point.pageX - this.pointX,
            deltaY = point.pageY - this.pointY,
            timeStamp = Date.now(), absDistX, absDistY;
        this.distX += deltaX;
        this.distY += deltaY;
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        absDistX = Math.abs(this.distX);
        absDistY = Math.abs(this.distY);

        this.swipeDirection = this.distX > 0;
        if (timeStamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
            return;
        }
        if (absDistY > absDistX && !this.directionLocked) {
            this.directionLocked = 'v';
        } else if (absDistY < absDistX && !this.directionLocked) {
            this.directionLocked = 'h'
        }
        if (this.directionLocked == 'h') {
            e.preventDefault();
        } else if (this.directionLocked == 'v') {
            this.moved = false;
            return;
        }
        deltaY = 0;
        let newX = this.x + deltaX;
        let newY = this.y + deltaY;
        if (!this.state.loop && newX > 0 || newX < this.maxOffsetWidth) {
            newX = this.x + deltaX / 3;
        }
        this.moved = true;
        this.translate(newX, newY);

    },
    end(e){
        if (!this.moved) {
            return;
        }
        this.endTime = Date.now();
        let currentPosition = this.getCardPosition();
        this.toCard(currentPosition, time);
    },
    toCard(index, time){
        index = index < 0 ? 0 : index;
        index = index > this.total - 1 ? this.total - 1 : index;
        let cbIndex;
        let changed = false;
        if (index != this.currentIndex && !this.initSet) {
            changed = true;
            cbIndex = this.state.loop ? index - 1 : index;
            if (cbIndex < 0) {
                cbIndex = this.total - 3;
            } else if (cbIndex > this.total - 3) {
                cbIndex = 0;
            }
        }
        this.currentIndex = index;
        let x = 0 - index * this.itemWidth;
        if (!this.state.loop && this.props.offset && index != 0) {
            if (index != this.total - 1) {
                x = x + (document.body.clientWidth - this.itemWidth) / 2;
            }
            else if (index == this.total - 1) {
                x = x + (document.body.clientWidth - this.itemWidth);
            }
        }
        let y = 0;
        this.translate(x, y, time);
        if (this.props.navigator) {
            this.setNav();
        }
        if (changed) {
            this.props.cb && this.props.cb(cbIndex);
        }

    },
    getCardPosition(){
        if (this.x > 0) return 0;
        if (this.x < this.maxOffsetWidth) return this.total - 1;
        let position;
        if (Math.abs(this.distX) > (this.itemWidth / 4)) {
            position = this.swipeDirection ? this.currentIndex - 1 : this.currentIndex + 1;
        } else {
            position = this.currentIndex;
        }
        return position;

    },
    transitionEnd(){
        this.inTransition = false;
        if (this.state.loop) {
            if (this.currentIndex == 0) {
                this.toCard(this.total - 2);
            } else if (this.currentIndex == this.total - 1) {
                this.toCard(1);
            }
        }

    },
    setNav(){
        let index = this.currentIndex;
        if (this.state.loop) {
            if (index == 0) {
                index = this.total - 3;
            } else if (index == this.total - 1) {
                index = 0;
            } else {
                index--;
            }
        }
        let nav = this.refs.nav;
        for (let i = 0; i < nav.children.length; i++) {
            nav.children[i].className = '';
        }

        nav.children[index].className = 'active';
    },
    translate(x, y, time){
        this.setTransitionTime(time);
        if (time > 0) this.inTransition = true;
        this.style[transformName] = 'translate(' + x + 'px,' + y + 'px)' + ' translateZ(0)';
        this.x = x;
        this.y = y;
    },
    setTransitionTime(time){
        time = time || 0;
        this.style['transitionDuration'] = time + 'ms';
        this.style['webkitTransitionDuration'] = time + 'ms';
    },
    pauseTransition(){
        var matrix = window.getComputedStyle(this.scroller, null),
            x, y;
        matrix = matrix[transformName].split(')')[0].split(', ');
        x = +(matrix[12] || matrix[4]);
        y = +(matrix[13] || matrix[5]);
        this.translate(x, y);
    },
    componentWillUnmount(){
        if (this.props.move)  this.unbindListener();
    }
});

export default Slider;