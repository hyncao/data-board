import React from "react";
import { Modal, Button } from "antd-mobile";
import styles from "./index.module.scss";

export default class ChoosePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempList: null
    };
    this.pick = this.pick.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  pick(value) {
    const { list } = this.props;
    let { tempList } = this.state;
    tempList = (tempList || list).map(i => ({
      ...i,
      active: i.value === value ? !i.active : i.active
    }));
    this.setState({ tempList });
  }

  confirm() {
    const { list, onClose, callback } = this.props;
    let { tempList } = this.state;
    callback(tempList || list);
    onClose();
  }

  render() {
    const { visible, onClose, title, list } = this.props;
    const { tempList } = this.state;
    return (
      <Modal popup visible={visible} onClose={onClose} animationType="slide-up">
        <div className={styles.container}>
          <div>{title}</div>
          <div className={styles.box}>
            {(tempList || list).map(i => (
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
