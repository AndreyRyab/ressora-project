import {
  planChartStyle,
  factChartStyle,
} from '../components/chart/chartStyles';

const createChartData = (dataToShow) => {
  console.log('createChartData, input: ', dataToShow);

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

  if (dataToShow.fact.length) {

    const factChartDataObj = dataToShow.fact.reduce((acc, dataInput) => {
      dataInput.operation_list.forEach(operation => {
        acc[operation.brief]
        ? (acc[operation.brief] = acc[operation.brief] + operation.quantity)
        : (acc[operation.brief] = operation.quantity);
      });
      return acc;
    }, {});

    factChartData = {
      data: [NaN, ...Object.values(factChartDataObj), NaN],
    }
  }

  if (factChartData) newChartData.datasets.push({ ...factChartData, ...factChartStyle });

  console.log('createChartData, output: ', {
    ...newChartData,
    date: dataToShow.date,
  });

  return ({
    ...newChartData,
    date: dataToShow.date,
  });
};

export default createChartData;
