<script>
  import { chartData } from '../../stores';
	import Chart from 'chart.js/auto';
  import { afterUpdate } from 'svelte';

  let chart;
	let context;
  let chartCanvas;

	afterUpdate(() => {
    context = chartCanvas.getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(context, {
      type: 'line',
      data: $chartData,
		});
	});

</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>
