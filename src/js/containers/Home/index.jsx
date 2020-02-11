import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Calendar } from "antd-mobile";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChoosePop } from 'app/components';
import { dateFormat, tips, hideTips } from "app/lib/utils";
import styles from "./index.module.scss";

@inject("historyStore")
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: dateFormat(new Date()),
      showCalendar: false,
      lineData: [100, 200, 221, 342, 342],
      showChoosePop: false,
      numData: {
        totalUser: "48.96万",
        totalPayment: "50.35万",
        monthUser: "20万",
        monthPayment: "30万",
        yesterdayUser: "3999",
        userChange: 2.4,
        yesterdayCR: "8.47%",
        CRChange: -0.3
      },
      filterData: [
        {
          label: '中国电信',
          value: '0',
          active: false,
        },
        {
          label: '中国联通',
          value: '1',
          active: false,
        },
        {
          label: '中国移动',
          value: '2',
          active: false,
        },
      ]
    };
    this.chooseDate = this.chooseDate.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.chooseCalendar = this.chooseCalendar.bind(this);
    this.controlChoosePop = this.controlChoosePop.bind(this);
    this.renderLineChart = this.renderLineChart.bind(this);
    this.renderBarChart = this.renderBarChart.bind(this);
  }

  componentDidMount() {}

  chooseDate() {
    this.setState({ showCalendar: true });
  }

  chooseCalendar(e) {
    this.closeCalendar();
    this.setState({
      date: dateFormat(e)
    });
  }

  closeCalendar() {
    this.setState({ showCalendar: false });
  }

  controlChoosePop(showChoosePop) {
    this.setState({
      showChoosePop,
    })
  }

  renderLineChart(data) {
    console.log(data);
  }

  renderBarChart(data) {
    console.log(data);
  }

  render() {
    const { lineData, numData, filterData } = this.state;
    // 数字数据列表
    const numDataList = [
      {
        id: "totalUser",
        label: "累计加入用户数",
        value: numData.totalUser
      },
      {
        id: "totalPayment",
        label: "累计支付笔数",
        value: numData.totalPayment
      },
      {
        id: "monthUser",
        label: "本月新增用户数",
        value: numData.monthUser
      },
      {
        id: "monthPayment",
        label: "本月支付MAU",
        value: numData.monthPayment
      },
      {
        id: "yesterdayUser",
        label: "昨日加入用户数",
        value: numData.yesterdayUser,
        extraRender: (
          <div>
            较前日{" "}
            <span
              className={numData.userChange < 0 ? styles.green : styles.red}
            >
              {numData.userChange}
            </span>
          </div>
        )
      },
      {
        id: "yesterdayCR",
        label: "昨日转化率",
        value: numData.yesterdayCR,
        extraRender: (
          <div>
            较前日{" "}
            <span className={numData.CRChange < 0 ? styles.green : styles.red}>
              {numData.CRChange}
            </span>
          </div>
        )
      }
    ];

    const xCategories = [];
    for (let i = 0; i < 25; i++) {
      xCategories.push(i);
    }
    const lineOptions = {
      chart: {
        backgroundColor: {
          // 背景渐变
          linearGradient: [0, 0, 0, 500],
          stops: [
            [0, "#548df7"],
            [1, "#105ae7"]
          ]
        },
        type: "line",
        height: 500,
        marginLeft: 80, // 左间距
        marginBottom: 80 // 下间距
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: xCategories, // X轴刻度
        lineColor: "#fff",
        lineWidth: 1,
        allowDecimals: false, // 是否允许小数
        title: "",
        labels: {
          // 刻度字体样式
          style: {
            color: "#fff",
            fontSize: "20px"
          }
        }
      },
      yAxis: {
        gridLineColor: "transparent",
        lineColor: "#fff",
        lineWidth: 1,
        title: "",
        labels: {
          // 刻度字体样式
          style: {
            color: "#fff",
            fontSize: "20px"
          }
        },
        offset: -10
      },
      tooltip: {
        // 设置tip弹窗样式
        useHTML: true,
        headerFormat: "",
        pointFormat:
          '<span style="font-size: 26px; color: #555;">{point.x}日: {point.y}</span>'
      },
      series: [
        {
          data: lineData,
          color: "#fff",
          showInLegend: false
        }
      ]
    };
    const barOptions = {
      chart: {
        type: "bar",
        marginLeft: 160, // 左间距
        marginRight: 80 // 右间距
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: ['中国移动', '中国联通', '中国电信', '上海移动', '浙江移动'],
        gridLineColor: "transparent",
        title: "",
        labels: {
          // 刻度字体样式
          style: {
            color: "#333",
            fontSize: "26px"
          }
        },
      },
      yAxis: {
        gridLineColor: "transparent",
        title: "",
        labels: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            allowOverlap: true, // 允许数据标签重叠
            style: {
              fontSize: '22px',
            }
          }
        }
      },
      tooltip: {
        // 设置tip弹窗样式
        useHTML: true,
        headerFormat: "",
        pointFormat:
          '<span style="font-size: 26px; color: #555;">{point.x} {series.name}: {point.y}</span>'
      },
      series: [
        {
          name: "订单量",
          data: [107, 31, 235, 203, 22],
          color: "#5885fa",
          showInLegend: false
        },
        {
          name: "转化率",
          data: [23.2, 15.6, 94.7, 48, 63],
          color: "#0cc32d",
          showInLegend: false
        }
      ]
    };

    const now = new Date();
    const { date, showChoosePop } = this.state;

    return (
      <div className={styles.home}>
        <Calendar
          type="one"
          visible={this.state.showCalendar}
          onCancel={this.closeCalendar}
          onConfirm={this.chooseCalendar}
          minDate={new Date(+now - 5184000000)}
          maxDate={new Date(now)}
        />
        <ChoosePop visible={showChoosePop} onClose={() => this.controlChoosePop(false)} list={filterData} callback={this.renderBarChart} title="选择运营商" />

        <div className={styles.lineChart}>
          <div className={styles.lineHead}>
            <div className={styles.lineSubTitle}>今日新增用户数</div>
            <div className={styles.lineTitle}>8888</div>
            <div className={styles.lineSubTitle}>今日转化率：10%</div>
            <div className={styles.lineDate} onClick={this.chooseDate}>
              <span>{date}</span>
              <div className={styles.arrow} />
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={lineOptions} />
        </div>

        <div className={styles.numData}>
          {numDataList.map(i => (
            <div key={i.id} className={styles.numDataItem}>
              <div className={styles.numLabel}>{i.label}</div>
              <div className={styles.numValue}>{i.value}</div>
              <div className={styles.numExtra}>{i.extraRender}</div>
            </div>
          ))}
        </div>

        <div className={styles.barChart}>
          <div className={styles.barTitle}>
            <div className={styles.title}>今日分省数据</div>
            <div className={styles.colorTips}>
              <span className={styles.blueTips} />
              <span>订单量</span>
              <span className={styles.greenTips} />
              <span>转化率</span>
            </div>
          </div>
          
          <div className={styles.filterEnterBox}>
            <div className={styles.filterEnterItem} onClick={() => this.controlChoosePop(true)}>
              <span>全部</span>
              <span className={styles.itemArrow} />
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={barOptions} />
        </div>
      </div>
    );
  }
}

export default Home;
