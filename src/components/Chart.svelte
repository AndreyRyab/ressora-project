<script>
  import { chartData } from '../stores';
	import Chart from 'chart.js/auto';
  import { afterUpdate } from 'svelte';

  const fact = [NaN, 30, 18, 25, 22, 30, 21, NaN];
  let chart;
	let ctx;
  let chartCanvas;

	afterUpdate(() => {
    ctx = chartCanvas.getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: $chartData,
		});
	});

</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>
