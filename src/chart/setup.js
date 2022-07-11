
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


{/* <script>
	import chartjs from 'chart.js@2.6.0';
	let chartData;
	import { onMount } from 'svelte';

	const datapoints1 = [NaN, 20, 10, 5, 2, 20, 30, 45, NaN];
  const datapoints2 = [NaN,30, 40, 25, 22, 30, 50, 15, NaN];
	let chartLabels = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', ''];
	let ctx;
	let chartCanvas;

	onMount(async (promise) => {
		  ctx = chartCanvas.getContext('2d');
			const chart = new chartjs(ctx, {
				type: 'line',
				data: {
						labels: chartLabels,
						datasets: [{
								label: 'План',
								borderColor: 'rgb(252, 186, 3)',
							fill: false,
								data: datapoints1
						},
											{
								label: 'Факт',
								borderColor: 'rgb(255, 99, 132)',
												fill: false,
								data: datapoints2
						}]
				}
		});

	});

</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas> */}

