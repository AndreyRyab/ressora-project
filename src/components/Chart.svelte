<script>
	import Chart from 'chart.js/auto';
  import { afterUpdate } from 'svelte';

  export let chartData;

  const fact = [NaN, 30, 18, 25, 22, 30, 21, NaN];
  let chart;
	let ctx;
  let chartCanvas;

	afterUpdate(() => {
    ctx = chartCanvas.getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.title,
        datasets: [{
          label: 'План',
          borderWidth: 4,
          borderColor: 'rgb(252, 186, 3)',
          pointStyle: 'circle',
          tension: 0.3,
          fill: false,
          data: chartData.plan,
        },
        {
          label: 'Факт',
          borderWidth: 4,
          borderColor: 'rgb(255, 99, 132)',
          pointStyle: 'circle',
          tension: 0.3,
          fill: false,
          data: fact,
        }]
      },
		});
	});

</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>
