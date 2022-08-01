import {
  planChartStyle,
  factChartStyle,
} from '../components/chart/chartStyles';

const createChartData = (dataToShow) => {
  let newChartData = dataToShow.plan.operation_list.reduce(
    (acc, item) => {
      acc.labels.push(item.title);
      acc.datasets[0].data.push(item.quantity);
      return acc;
    },
    {
      labels: [''],
      datasets: [
        {
          data: [NaN],
          ...planChartStyle,
        },
      ],
    }
  );
  newChartData.labels.push('');
  newChartData.datasets[0].data.push(NaN);

  let factChartData = null;

  if (dataToShow.fact.operation_list.length) {
    factChartData = dataToShow.fact.operation_list.reduce(
      (acc, item) => {
        acc.data.push(item.quantity);
        return acc;
      },
      {
        data: [NaN],
        ...factChartStyle,
      }
    );
    factChartData.data.push(NaN);
  }

  if (factChartData) newChartData.datasets.push(factChartData);

  return ({
    ...newChartData,
    date: dataToShow.date,
  });
};

export default createChartData;
