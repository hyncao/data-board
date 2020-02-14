import React from "react";
import { Modal, Button } from "antd-mobile";
import styles from "./index.module.scss";

export default class ChoosePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempList: []
    };
    this.pick = this.pick.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { visible, list } = props;
    const { tempList } = state;
    if (!visible) {
      return { tempList: [] };
    }
    if (tempList.length > 0) {
      return { tempList };
    } else {
      return { tempList: list };
    }
  }

  pick(value) {
    let { tempList } = this.state;
    tempList = tempList.map(i => ({
      ...i,
      active: i.value === value ? !i.active : i.active
    }));
    this.setState({ tempList });
  }

  confirm() {
    const { onClose, callback, title } = this.props;
    let { tempList } = this.state;
    callback(tempList, title);
    onClose();
  }

  render() {
    const { visible, onClose, title } = this.props;
    const { tempList } = this.state;
    return (
      <Modal popup visible={visible} onClose={onClose} animationType="slide-up">
        <div className={styles.container}>
          <div>{title}</div>
          <div className={styles.box}>
            {tempList.length > 0 &&
              tempList.map(i => (
                <div
                  key={i.value}
                  className={`${styles.item} ${i.active ? styles.active : ""}`}
                  onClick={() => this.pick(i.value)}
                >
                  {i.label}
                </div>
              ))}
          </div>
          <Button type="primary" onClick={this.confirm}>
            确认
          </Button>
        </div>
      </Modal>
    );
  }
}
