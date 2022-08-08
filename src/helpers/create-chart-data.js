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

  if (dataToShow.fact.length) {

    factChartDataObj = dataToShow.fact.reduce((acc, dataInput) => {
      dataInput.operation_list.forEach(operation => {
        acc[operation.brief]
        ? acc[operation.brief] += operation.quantity
        : acc[operation.brief] = operation.quantity;
      });
      return acc;
    })

    factChartData = {
      data: [NaN, ...Object.values(factChartDataObj), NaN],
    }
    
    /* .operation_list.reduce(
      (acc, item) => {
        acc.data.push(item.quantity);
        return acc;
      },
      {
        data: [NaN],
        ...factChartStyle,
      }
    ); */
    /* factChartData.data.push(NaN); */
    console.log(factChartData)
  }

  if (factChartData) newChartData.datasets.push({ ...factChartData, ...factChartStyle });

  return ({
    ...newChartData,
    date: dataToShow.date,
  });
};

export default createChartData;
