
const labels = ['', 'операция 1', 'операция 2', 'операция 3', 'операция 4', 'операция 5', ''];
const datapoints1 = [0, 14, 20, 20, 60, 60, 120, 100, 0];
const datapoints2 = [0, 10, 30, 35, 80, 40, 110, 80, 0];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'План',
      data: datapoints1,
      borderColor: Utils.CHART_COLORS.red,
      fill: false,
      
      tension: 0.4
    }, {
      label: 'Факт',
      data: datapoints2,
      borderColor: Utils.CHART_COLORS.blue,
      fill: false,
      tension: 0.4
    }
  ]
};
