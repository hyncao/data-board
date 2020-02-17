// 折线图配置
export const lineChartConfig = {
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
    },
    max: 24,
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
      '<span style="font-size: 26px; color: #555;">{point.x}: {point.y}</span>'
  },
  series: [
    {
      color: "#fff",
      showInLegend: false // 是否显示chart下方的数据类别筛选
    }
  ]
};

// 柱状图配置
export const barChartConfig = {
  chart: {
    type: "bar",
    marginLeft: 160, // 左间距
    marginRight: 80 // 右间距
  },
  title: {
    text: ""
  },
  xAxis: {
    gridLineColor: "transparent",
    title: "",
    labels: {
      // 刻度字体样式
      style: {
        color: "#333",
        fontSize: "26px"
      }
    }
  },
  yAxis: {
    gridLineColor: "transparent",
    title: "",
    labels: false
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true, // 图表上显示具体数值
        allowOverlap: true, // 允许数据标签重叠
        style: {
          fontSize: "22px"
        }
      }
    }
  },
  tooltip: {
    // 设置tip弹窗样式
    useHTML: true,
    headerFormat: "",
    pointFormat:
      '<span style="font-size: 26px; color: #555;">{point.category} {series.name}: {point.y}</span>'
  },
  series: [
    {
      name: "订单量",
      color: "#5885fa",
      showInLegend: false
    },
    {
      name: "转化率",
      color: "#0cc32d",
      showInLegend: false
    }
  ]
};
