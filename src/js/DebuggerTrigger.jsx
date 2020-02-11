import React from 'react';
import {
  setLS,
  getLS,
  tips,
} from 'app/lib/utils';

export default class DebuggerTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.trigger = this.trigger.bind(this);
  }

  trigger() {
    const count = this.count;
    if (count === 10) {
      let debuggerFlag = getLS('debuggerFlag');
      if (debuggerFlag === 'y') {
        debuggerFlag = 'n';
        tips('关闭调试模式');
      } else {
        debuggerFlag = 'y';
        tips('打开调试模式');
      }
      setLS('debuggerFlag', debuggerFlag);
      this.count = 0;
    } else {
      this.count = count + 1;
    }
  }

  render() {
    return (
      <div
        style={{
          position: 'fixed',
          zIndex: 998,
          width: '1rem',
          height: '1rem',
        }}
        onClick={this.trigger}
      ></div>
    );
  }
}
