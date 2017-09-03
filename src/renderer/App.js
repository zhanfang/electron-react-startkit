/**
 * @file 主页面
 * @author zhanfang(fzhanxd@gmail.com)
 */

import React from 'react';
import {inject, observer} from 'mobx-react';
import './App.css';
import DevTools from 'mobx-react-devtools'

@inject('view')
@observer
export default class App extends React.Component {

    get style() {
        const {view: {width, height}} = this.props;
        return {width, height: (height - 44)};
    }

    render() {
        return (
            <div className='App'>
                <div className="body" style={this.style}>
                    Width is {this.style.width}. Height is {this.style.height}.
                </div>
                <DevTools />
            </div>
        );
    }
}
