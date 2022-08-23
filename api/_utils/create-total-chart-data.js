module.exports.createTotalChartData = (dataToShow) => {
  const rawData = dataToShow.reduce((acc, item, index) => {
    if (index === 0) {
      item.plan.operation_list.forEach(operation => {
        acc.labels.push(operation.title);
        acc.plan[operation.brief] = operation.quantity;
        acc.fact[operation.brief] = 0;
      });
      item.fact.forEach(dataInput => {
        dataInput.operation_list.forEach(operation => {
          acc.fact[operation.brief] += operation.quantity;
        });
      })
      return acc;
    }
    item.plan.operation_list.forEach(operation => {
      acc.plan[operation.brief] += operation.quantity;
    });
    item.fact.forEach(dataInput => {
      dataInput.operation_list.forEach(operation => {
        acc.fact[operation.brief] += operation.quantity;
      });
    })
    return acc;
  },
  {
    labels: [''],
    plan: {},
    fact: {},
  })

  const result = {
    labels: [...rawData.labels, ''],
    datasets: [
      { data: [NaN, ...Object.values(rawData.plan), NaN] },
      { data: [NaN, ...Object.values(rawData.fact), NaN]  }
    ],
    date: [dataToShow[0].date, dataToShow[dataToShow.length - 1].date],
  };

  return result;
};
