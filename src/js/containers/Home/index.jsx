import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Calendar } from "antd-mobile";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChoosePop } from "app/components";
import { lineChartConfig, barChartConfig } from "./config";
import { getTrade, getSummary } from "app/service";
import { dateFormat, tips, hideTips, delay } from "app/lib/utils";
import styles from "./index.module.scss";

@inject("historyStore")
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.newUser = 0;
    this.getTradePending = true;
    this.getSummaryPending = true;
    this.state = {
      date: dateFormat(new Date()),
      showCalendar: false,
      newUser: 0,
      lineData: [],
      barData: [
        {
          label: "中国电信",
          orderNum: 200,
          cr: 20
        },
        {
          label: "中国联通",
          orderNum: 300,
          cr: 40
        },
        {
          label: "中国移动",
          orderNum: 400,
          cr: 30
        }
      ],
      showChoosePop: false,
      numData: {},
      filterData: [],
      operatorFilterBack: "全部运营商",
      provinceFilterBack: "全部地区",
      operatorData: [
        {
          label: "中国电信",
          value: "0",
          active: false
        },
        {
          label: "中国联通",
          value: "1",
          active: false
        },
        {
          label: "中国移动",
          value: "2",
          active: false
        }
      ],
      provinceData: [
        {
          label: "浙江",
          value: "0",
          active: false
        },
        {
          label: "上海",
          value: "1",
          active: false
        },
        {
          label: "北京",
          value: "2",
          active: false
        },
        {
          label: "辽宁",
          value: "3",
          active: false
        },
        {
          label: "黑龙江",
          value: "4",
          active: false
        },
        {
          label: "吉林",
          value: "5",
          active: false
        }
      ]
    };

    this.renderLineChart = this.renderLineChart.bind(this);
    this.renderBarChart = this.renderBarChart.bind(this);
    this.prepareLineOptions = this.prepareLineOptions.bind(this);
    this.prepareBarOptions = this.prepareBarOptions.bind(this);
    this.chooseDate = this.chooseDate.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.chooseCalendar = this.chooseCalendar.bind(this);
    this.controlChoosePop = this.controlChoosePop.bind(this);
    this.choosePopCallback = this.choosePopCallback.bind(this);
    this.hideLoading = this.hideLoading.bind(this);
  }

  componentDidMount() {
    const { date } = this.state;
    this.init(date);
  }

  init(date) {
    tips("加载中", "loading", 0);
    this.renderLineChart(date);
    this.renderNumData(date);
  }

  async renderLineChart(date) {
    this.getTradePending = true;
    const res = await getTrade(date);
    this.getTradePending = false;
    this.hideLoading();
    this.setState({
      date,
      lineData: res
    });
  }

  async renderNumData(date) {
    this.getSummaryPending = true;
    const res = await getSummary(date);
    this.getSummaryPending = false;
    this.hideLoading();
    this.setState({
      numData: res
    });
  }

  renderBarChart(data) {
    console.log(data);
  }

  prepareLineOptions() {
    const { lineData } = this.state;
    const xCategories = [];
    let newUser = 0;
    const seriesData = lineData.map(i => {
      newUser += i.tradeCnt;
      const hour = Math.round((i.minOfDay / 60) * 100) / 100;
      return [hour, newUser];
    });
    for (let i = 0; i < 25; i++) {
      xCategories.push(i);
    }
    this.newUser = newUser;
    return {
      ...lineChartConfig,
      xAxis: {
        ...lineChartConfig.xAxis,
        categories: xCategories
      },
      series: [
        {
          ...lineChartConfig.series[0],
          data: seriesData
        }
      ]
    };
  }

  prepareBarOptions() {
    const { barData } = this.state;
    // TODO 映射关系需要改
    const categories = barData.map(i => i.label);
    const orderNum = barData.map(i => i.orderNum);
    const cr = barData.map(i => i.cr);
    return {
      ...barChartConfig,
      xAxis: {
        ...barChartConfig.xAxis,
        categories
      },
      series: [
        {
          ...barChartConfig.series[0],
          data: orderNum
        },
        {
          ...barChartConfig.series[1],
          data: cr
        }
      ]
    };
  }

  chooseDate() {
    this.setState({ showCalendar: true });
  }

  chooseCalendar(e) {
    this.closeCalendar();
    this.init(dateFormat(e));
  }

  closeCalendar() {
    this.setState({ showCalendar: false });
  }

  controlChoosePop(showChoosePop, type) {
    this.setState({
      choosePopTitle: `选择${type === "operator" ? "运营商" : "省份"}`,
      showChoosePop,
      filterData: showChoosePop ? this.state[`${type}Data`] : []
    });
  }

  choosePopCallback(data, title) {
    let chooseArr = data
      .filter(i => i.active)
      .map(i => i.label)
      .filter((i, k) => k < 4);
    const filterBackName =
      title === "选择运营商" ? "operatorFilterBack" : "provinceFilterBack";
    const dataName = title === "选择运营商" ? "operatorData" : "provinceData";
    if (chooseArr.length === 4) {
      chooseArr.splice(3, 1, "……");
    } else if (chooseArr.length === 0) {
      chooseArr = [title === "选择运营商" ? "全部运营商" : "全部地区"];
    }
    this.setState({ [filterBackName]: chooseArr.join(" "), [dataName]: data });
    this.renderBarChart(data);
  }

  hideLoading() {
    const { getTradePending, getSummaryPending } = this;
    if (!getTradePending && !getSummaryPending) {
      hideTips();
    }
  }

  render() {
    const {
      numData,
      filterData,
      operatorFilterBack,
      provinceFilterBack
    } = this.state;
    // 数字数据列表
    const numDataList = [
      {
        id: "allTradeCnt",
        label: "累计加入用户数",
        value: numData.allTradeCnt
      },
      {
        id: "allPayment",
        label: "累计支付笔数",
        value: numData.allPayment
      },
      {
        id: "monthTradeCnt",
        label: "本月新增用户数",
        value: numData.monthTradeCnt
      },
      {
        id: "monthPayment",
        label: "本月支付MAU",
        value: numData.monthPayment
      },
      {
        id: "yesterdayTradeCnt",
        label: "昨日加入用户数",
        value: numData.yesterdayTradeCnt,
        extraRender: (
          <div>
            较前日{" "}
            <span
              className={
                numData.tradeChangeRate < 0 ? styles.green : styles.red
              }
            >
              {`${(numData.tradeChangeRate * 100).toFixed(2)}%`}
            </span>
          </div>
        )
      },
      {
        id: "todayConversiontRate",
        label: "昨日转化率",
        value: `${(numData.todayConversiontRate * 100).toFixed(2)}%`,
        extraRender: (
          <div>
            较前日{" "}
            <span
              className={
                numData.rateOfConversionRate < 0 ? styles.green : styles.red
              }
            >
              {`${(numData.rateOfConversionRate * 100).toFixed(2)}%`}
            </span>
          </div>
        )
      }
    ];

    const lineOptions = this.prepareLineOptions();
    const barOptions = this.prepareBarOptions();

    const now = new Date();
    const { date, showChoosePop, choosePopTitle } = this.state;
    const { getTradePending, getSummaryPending } = this;

    return (
      <div className={styles.home}>
        <Calendar
          type="one"
          visible={this.state.showCalendar}
          onCancel={this.closeCalendar}
          onConfirm={this.chooseCalendar}
          minDate={new Date("2020/02/01")}
          maxDate={new Date(now)}
        />
        <ChoosePop
          visible={showChoosePop}
          onClose={() => this.controlChoosePop(false)}
          list={filterData}
          callback={this.choosePopCallback}
          title={choosePopTitle}
        />

        {/* 折线图 */}
        <div className={styles.lineChart}>
          <div className={styles.lineHead}>
            <div className={styles.lineSubTitle}>今日新增用户数</div>
            <div className={styles.lineTitle}>{this.newUser}</div>
            {(!getSummaryPending && !isNaN(numData.todayTradeCnt / numData.todayUv)) && (
              <div className={styles.lineSubTitle}>
                今日转化率：
                {(numData.todayTradeCnt / numData.todayUv * 100).toFixed(2)}
                %
              </div>
            )}
            <div className={styles.lineDate} onClick={this.chooseDate}>
              <span>{date}</span>
              <div className={styles.arrow} />
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={lineOptions} />
        </div>

        {/* 数据列表 */}
        {!getSummaryPending && (
          <div className={styles.numData}>
            {numDataList.map(i => (
              <div key={i.id} className={styles.numDataItem}>
                <div className={styles.numLabel}>{i.label}</div>
                <div className={styles.numValue}>{i.value}</div>
                <div className={styles.numExtra}>{i.extraRender}</div>
              </div>
            ))}
          </div>
        )}

        {/* 柱状图 */}
        {/* <div className={styles.barChart}>
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
            <div
              className={styles.filterEnterItem}
              onClick={() => this.controlChoosePop(true, "operator")}
            >
              <span>{operatorFilterBack}</span>
              <span className={styles.itemArrow} />
            </div>
            <div
              className={styles.filterEnterItem}
              onClick={() => this.controlChoosePop(true, "province")}
            >
              <span>{provinceFilterBack}</span>
              <span className={styles.itemArrow} />
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={barOptions} />
        </div> */}
      </div>
    );
  }
}

export default Home;
