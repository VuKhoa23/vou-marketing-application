// Số lượng người tham gia - BarChart

export const barChartDataNumberOfParticipants = [
  {
    "name": "DOOKKI KHAI TRƯƠNG CỬA HÀNG MỚI",
    "data": {
      "Tuần 1": [100, 120, 160, 130, 170, 140, 150],
      "Tuần 2": [130, 150, 160, 180, 200, 170, 190],
      "Tuần 3": [120, 130, 140, 160, 170, 180, 160],
      "Tuần 4": [150, 180, 170, 200, 220, 210, 240]
    }
  },
  {
    "name": "SỰ KIỆN ĐẶC BIỆT CỦA HIGHLANDS COFFEE",
    "data": {
      "Tuần 1": [80, 120, 90, 140, 130, 160, 140],
      "Tuần 2": [110, 130, 140, 120, 160, 180, 170],
      "Tuần 3": [100, 110, 130, 120, 150, 140, 130],
      "Tuần 4": [130, 150, 140, 170, 160, 190, 180]
    }
  },
  {
    "name": "KHUYẾN MÃI GIẢM GIÁ CỦA BOBAPOP",
    "data": {
      "Tuần 1": [180, 230, 220, 210, 240, 260, 250],
      "Tuần 2": [220, 240, 230, 250, 270, 280, 270],
      "Tuần 3": [210, 200, 220, 240, 250, 240, 230],
      "Tuần 4": [240, 270, 260, 280, 290, 300, 310]
    }
  },
  {
    "name": "RA MẮT SẢN PHẨM MỚI TỪ KFC",
    "data": {
      "Tuần 1": [70, 90, 80, 60, 90, 80, 70],
      "Tuần 2": [85, 95, 105, 90, 100, 85, 75],
      "Tuần 3": [90, 80, 70, 60, 50, 60, 80],
      "Tuần 4": [100, 110, 100, 90, 80, 70, 60]
    }
  },
  {
    "name": "THREE OCLOCK HAPPY VALENTINE DAY",
    "data": {
      "Tuần 1": [60, 70, 55, 75, 65, 80, 70],
      "Tuần 2": [70, 80, 65, 85, 75, 90, 85],
      "Tuần 3": [50, 55, 60, 70, 65, 75, 60],
      "Tuần 4": [80, 90, 85, 95, 100, 105, 110]
    }
  }
];




export const barChartOptionsNumberOfParticipants = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "40px",
    },
  },
};

// Consumption Users Reports

export const userParticipationData = {
  gender: {
    "Nam": [55, 70, 65, 80, 75, 85, 60, 90, 70, 80],
    "Nữ": [45, 55, 50, 65, 60, 75, 55, 70, 65, 80],
    "Khác": [50, 65, 60, 55, 70, 75, 65, 80, 70, 85],
  },
  ageGroups: {
    "Dưới 18": [30, 25, 35, 28, 32, 40, 33, 37, 30, 35],
    "18-35": [130, 115, 125, 140, 130, 150, 160, 140, 155, 145],
    "Trên 35": [65, 70, 60, 75, 80, 70, 85, 78, 72, 77],
  },
  regions: {
    "Bắc": [90, 85, 95, 100, 92, 98, 105, 100, 95, 110],
    "Trung": [55, 60, 50, 65, 55, 70, 60, 65, 55, 70],
    "Nam": [95, 105, 100, 110, 105, 115, 120, 110, 125, 115],
  },
};


export const eventNames = [
  "DOOKKI KHAI TRƯƠNG CỬA HÀNG MỚI",
  "SỰ KIỆN ĐẶC BIỆT CỦA HIGHLANDS COFFEE",
  "KHUYẾN MÃI GIẢM GIÁ CỦA BOBAPOP",
  "RA MẮT SẢN PHẨM MỚI TỪ KFC",
  "THREE OCLOCK HAPPY VALENTINE DAY",
];



export const barChartOptionsConsumption = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "solid",
    colors: ["#5E37FF", "#5BBCFF", "#387ADF"],
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'left',
    fontSize: '14px',
    labels: {
      colors: '#A3AED0',
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 30,
      vertical: 0,
    },
  },
  colors: ["#5E37FF", "#5BBCFF", "#387ADF"],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "30px",
    },
  },
};

export const pieChartOptions = {
  labels: ["Facebook", "Instagram", "X", "Threads"],
  colors: ["#050C9C", "#3572EF", "#3ABEF9", "#A7E6FF"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '18px',
    fontWeight: '900',
    labels: {
      colors: 'gray.600',
    },
    itemMargin: {
      horizontal: 10,
      vertical: 10,
    }
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#050C9C", "#3572EF", "#3ABEF9", "#A7E6FF"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
  },
};

export const pieChartData = {
  events: [
    "DOOKKI KHAI TRƯƠNG CỬA HÀNG MỚI",
    "SỰ KIỆN ĐẶC BIỆT CỦA HIGHLANDS COFFEE",
    "KHUYẾN MÃI GIẢM GIÁ CỦA BOBAPOP",
    "RA MẮT SẢN PHẨM MỚI TỪ KFC",
    "HỘI CHỢ THƯƠNG MẠI NFT"
  ],
  data: [
    [40, 20, 25, 15],
    [30, 25, 20, 25],
    [35, 15, 25, 25],
    [20, 30, 25, 25],
    [25, 25, 25, 25]
  ]
};

// Total Spent Default

export const lineChartDataTotalSpent = {
  "Revenue": {
    "daily": {
      "labels": ["01-08-2024", "02-08-2024", "03-08-2024", "04-08-2024", "05-08-2024", "06-08-2024"],
      "data": [500, 640, 480, 660, 490, 680]
    },
    "weekly": {
      "labels": ["31-2024", "32-2024", "33-2024", "34-2024", "35-2024", "36-2024"],
      "data": [2900, 3100, 2500, 3200, 3000, 3400]
    },
    "monthly": {
      "labels": ["03-2024", "04-2024", "05-2024", "06-2024", "07-2024", "08-2024"],
      "data": [11500, 10000, 13500, 11000, 13000, 14000]
    }
  },
  "Profit": {
    "daily": {
      "labels": ["01-08-2024", "02-08-2024", "03-08-2024", "04-08-2024", "05-08-2024", "06-08-2024"],
      "data": [300, 400, 240, 460, 200, 460]
    },
    "weekly": {
      "labels": ["31-2024", "32-2024", "33-2024", "34-2024", "35-2024", "36-2024"],
      "data": [1500, 2200, 1400, 2700, 1800, 2000]
    },
    "monthly": {
      "labels": ["03-2024", "04-2024", "05-2024", "06-2024", "07-2024", "08-2024"],
      "data": [7000, 6000, 7500, 5000, 8200, 7400]
    }
  }
};



export const lineChartOptionsTotalSpent = {
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: "#4318FF",
    },
  },
  colors: ["#4318FF", "#39B8FF"],
  markers: {
    size: 0,
    colors: "white",
    strokeColors: "#7551FF",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: "circle",
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    type: "line",
  },
  xaxis: {
    type: "numeric",
    categories: [],
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      color: ["#7551FF", "#39B8FF"],
      opacity: 0.5,
    },
  },
  color: ["#7551FF", "#39B8FF"],
};
