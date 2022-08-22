import {
  planChartStyle,
  factChartStyle,
} from '../components/chart/chartStyles';

const addStylesToChart = (data) => {
  let dataToChart = {
    labels: data.labels,
    datasets: [
      {
        data: data.datasets[0].data,
        ...planChartStyle,
      }
    ],
  };

  if (data.datasets.length > 1) {
    dataToChart.datasets.push({
      data: data.datasets[1].data,
        ...factChartStyle,
    })
  }

  return dataToChart;
};

export default addStylesToChart;
