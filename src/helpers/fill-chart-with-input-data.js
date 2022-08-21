import {
  planChartStyle,
  factChartStyle,
} from '../components/chart/chartStyles';

const fillChartWithInputData = (summaryForm, isPlan) => {
  let newChartData = summaryForm.reduce(
    (acc, item) => {
      acc.labels.push(item.title);
      acc.data.push(item.quantity);
      return acc;
    },
    {
      labels: [''],
      data: [NaN],
    },
  );

  newChartData.labels.push('');
  newChartData.data.push(NaN);

  let inputChartData;

  if (isPlan) {
    inputChartData = {
      datasets: [{
        ...newChartData,
        ...planChartStyle,
        label: 'План',
      }],
      labels: newChartData.labels,
    };
  } else {
    inputChartData = {
      datasets: [{
        ...newChartData,
        ...factChartStyle,
        label: 'Факт',
      }],
      labels: newChartData.labels,
    };
  }

  return inputChartData;
};

export default fillChartWithInputData;
