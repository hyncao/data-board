import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Calendar } from "antd-mobile";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChoosePop } from "app/components";
import { lineChartConfig, barChartConfig } from "./config";
import { getTrade, getSummary, getProvince } from "app/service";
import { dateFormat, tips, hideTips, num2Percent } from "app/lib/utils";
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
      allProvinceData: [],
      groupData: [],
      showChoosePop: false,
      numData: {
        allTradeCnt: '暂无',
        allPayment: '暂无',
        monthTradeCnt: '暂无',
        monthPayment: '暂无',
        yesterdayTradeCnt: '暂无',
        tradeChangeRate: '暂无',
        todayConversiontRate: '暂无',
        rateOfConversionRate: '暂无',
        todayTradeCnt: '暂无',
        todayUv: '暂无',
      },
      filterData: [],
      operatorFilterBack: "全部运营商",
      provinceFilterBack: "全部地区",
      operatorData: [
        {
          label: "电信",
          value: "0",
          active: false
        },
        {
          label: "联通",
          value: "1",
          active: false
        },
        {
          label: "移动",
          value: "2",
          active: false
        }
      ],
      provinceData: []
    };

    this.init = this.init.bind(this);
    this.renderData = this.renderData.bind(this);
    this.prepareGroupData = this.prepareGroupData.bind(this);
    this.prepareProvinceData = this.prepareProvinceData.bind(this);
    this.prepareLineOptions = this.prepareLineOptions.bind(this);
    this.chooseDate = this.chooseDate.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.chooseCalendar = this.chooseCalendar.bind(this);
    this.controlChoosePop = this.controlChoosePop.bind(this);
    this.choosePopCallback = this.choosePopCallback.bind(this);
    this.hideLoading = this.hideLoading.bind(this);
    this.fold = this.fold.bind(this);
    this.getProvinceData = this.getProvinceData.bind(this);
  }

  componentDidMount() {
    const { date } = this.state;
    this.init(date);
  }

  init(date) {
    tips("加载中", "loading", 0);
    this.setState({ date });
    this.renderData({
      date,
      pending: "getTradePending",
      service: getTrade,
      stateName: "lineData"
    });
    this.renderData({
      date,
      pending: "getSummaryPending",
      service: getSummary,
      stateName: "numData"
    });
    this.renderData({
      date,
      pending: "getProvincePending",
      service: getProvince,
      stateName: "allProvinceData"
    });
  }

  // 从接口拿数据
  async renderData({ date, pending, service, stateName }) {
    this[pending] = true;
    let res = await service(date);
    if (!res) {
      if (stateName === 'numData') {
        ({ numData: res } = this.state);
      } else {
        res = [];
      }
    }
    this[pending] = false;
    this.hideLoading();
    this.setState({ [stateName]: res }, () => {
      if (stateName === "allProvinceData") {
        // 针对分省数据做额外的操作
        this.prepareGroupData();
        this.prepareProvinceData();
      }
    });
  }

  // 根据接口数据准备省份列表
  prepareProvinceData() {
    const { allProvinceData, operatorData } = this.state;
    let provinceData = [];
    (allProvinceData || []).forEach(item => {
      operatorData.forEach(operator => {
        if (item.name.indexOf(operator.label) > -1) {
          const province = item.name.split(operator.label)[0];
          if (!provinceData.includes(province)) {
            provinceData.push(province);
          }
        }
      });
    });
    provinceData = provinceData.map(i => ({
      label: i,
      value: i,
      active: false
    }));
    this.setState({ provinceData });
  }

  // 准备集团数据并加入state
  prepareGroupData() {
    const { allProvinceData } = this.state;
    const fixedData = (allProvinceData || []).filter(i => i.group);
    let groupData = [];
    fixedData.forEach(i => {
      if (!groupData.includes(i.group)) {
        groupData.push(i.group);
      }
    });
    groupData = groupData.map(i => {
      const children = fixedData.filter(data => data.group === i);
      let user = 0;
      let totalRate = 0;
      children.forEach(item => {
        user += parseInt(item.user);
        totalRate += parseFloat(item.rate);
      });
      const avgRate = num2Percent(totalRate / children.length);
      return {
        group: i,
        user,
        avgRate,
        children,
        fold: true
      };
    });
    this.setState({ groupData });
  }

  prepareLineOptions() {
    const { lineData } = this.state;
    const xCategories = [];
    let newUser = 0;
    const seriesData = (lineData || []).map(i => {
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
  }

  hideLoading() {
    const { getTradePending, getSummaryPending, getProvincePending } = this;
    if (!getTradePending && !getSummaryPending && !getProvincePending) {
      hideTips();
    }
  }

  fold(group) {
    let { groupData } = this.state;
    groupData = groupData.map(i => ({
      ...i,
      fold: i.group === group ? !i.fold : i.fold
    }));
    this.setState({ groupData });
  }

  // 处理数据为分省数据
  getProvinceData() {
    const { allProvinceData = [], provinceData, operatorData } = this.state;
    const nameArr = [];
    let provinceArr = provinceData.filter(i => i.active);
    let operatorArr = operatorData.filter(i => i.active);
    provinceArr = provinceArr.length === 0 ? provinceData : provinceArr;
    operatorArr = operatorArr.length === 0 ? operatorData : operatorArr;
    provinceArr.forEach(province => {
      operatorArr.forEach(operator => {
        nameArr.push(province.label + operator.label);
      });
    });
    return (allProvinceData || []).filter(i => !i.group && nameArr.includes(i.name));
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
              {num2Percent(numData.tradeChangeRate)}
            </span>
          </div>
        )
      },
      {
        id: "todayConversiontRate",
        label: "昨日转化率",
        value: num2Percent(numData.todayConversiontRate),
        extraRender: (
          <div>
            较前日{" "}
            <span
              className={
                numData.rateOfConversionRate < 0 ? styles.green : styles.red
              }
            >
              {num2Percent(numData.rateOfConversionRate)}
            </span>
          </div>
        )
      }
    ];

    const lineOptions = this.prepareLineOptions();

    const now = new Date();
    const { date, showChoosePop, choosePopTitle, groupData } = this.state;
    const splitProvinceData = this.getProvinceData();
    const { getSummaryPending } = this;

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
            {!getSummaryPending &&
              !isNaN(numData.todayTradeCnt / numData.todayUv) && (
                <div className={styles.lineSubTitle}>
                  今日转化率：
                  {num2Percent(numData.todayTradeCnt / numData.todayUv)}
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

        <div className={styles.h3} />

        {/* 集团数据 */}
        <div className={styles.barChart}>
          <div className={styles.barTitle}>
            <div className={styles.title}>今日集团数据</div>
          </div>
          
          {groupData.length > 0 ? (
            <>
              <div className={styles.tHead}>
                <div>所属区域</div>
                <div>新增用户数</div>
                <div>转化率</div>
              </div>
              <div className={styles.tBody}>
                {groupData.map(i => (
                  <div className={styles.tItem} key={i.group}>
                    <div className={styles.tParent}>
                      <div>{i.group}</div>
                      <div>{i.user}</div>
                      <div>{i.avgRate}</div>
                      <div onClick={() => this.fold(i.group)}>
                        {i.fold ? "展开" : "收起"}
                      </div>
                    </div>
                    {!i.fold &&
                      i.children.length > 0 &&
                      i.children.map(item => (
                        <div className={styles.tChildren} key={item.name}>
                          <div>{item.name}</div>
                          <div>{item.user}</div>
                          <div>{num2Percent(item.rate)}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.empty}>没有更多数据</div>
          )}
        </div>

        {/* 分省数据 */}
        <div className={styles.barChart}>
          <div className={styles.barTitle}>
            <div className={styles.title}>今日分省数据</div>
          </div>
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
          {splitProvinceData.length > 0 ? (
            <>
              <div className={styles.tHead}>
                <div>所属区域</div>
                <div>新增用户数</div>
                {/* <div>转化率</div> */}
              </div>
              {splitProvinceData.map(i => (
                <div className={styles.tChildren} key={i.name}>
                  <div>{i.name}</div>
                  <div>{i.user}</div>
                  {/* <div>{num2Percent(i.rate)}</div> */}
                </div>
              ))}
            </>
          ) : (
            <div className={styles.empty}>没有更多数据</div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
