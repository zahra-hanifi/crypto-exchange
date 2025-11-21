<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'CoinPriceChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    const labels = this.data.map((d) => new Date(d[0]).toLocaleString())

    const prices = this.data.map((d) => d[1])

    const ctx = this.$refs.canvas.getContext('2d')

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price',
            data: prices,
            borderWidth: 2,
            borderColor: '#d9a80b',
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: false
            },
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          y: {
            title: {
              display: false
            },
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: '#fff',
            titleColor: '#2f2f2f',
            bodyColor: '#2f2f2f',
            borderColor: '#F0B90B61',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: () => '',
              label: (ctx) => {
                const price = ctx.raw
                const time = new Date(ctx.label).toLocaleString()
                return [`Price: $${price.toLocaleString()}`, time]
              }
            }
          }
        }
      }
    })
  },
  beforeDestroy() {
    if (this.chart) this.chart.destroy()
  }
}
</script>
