"use strict";

// eslint-disable-next-line no-undef
Chart.Tooltip.positioners.myCustomPositioner = function(elements) {

    if(elements.length){ // to prevent errors in the console
        const { x, y, base } = elements[0].element; // _model doesn't exist anymore
        const width = !base ? 0 : base - x;// so it doesn't break in combo graphs like lines + bars
        return { 
            x: x + (width / 2), 
            y: y,
            xAlign: 'center',
            yAlign: 'bottom'
        };
    }
    return false;
};

var summaryGraphChart = null;

export function resetGraphChart() {
    if (summaryGraphChart) {
        summaryGraphChart.destroy();
        summaryGraphChart = null;
    }
}

export function setupSummaryGraph(labels, dataSet) {
    const ctx = document.getElementById('summaryGraphCanvas');

    // eslint-disable-next-line no-undef
    summaryGraphChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataSet,
        },
        options: {
            indexAxis: 'y',
            animation: false,
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                bar: {
                    borderWidth: 2,
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.perDungeonPerPlayersLabels.get(context.label)
                        }
                    },
                    position: 'myCustomPositioner'
                },
                legend: {
                    labels: {
                        color: 'white',
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: "white",
                        font: {
                            size: 14
                        },
                        callback: function(value) {
                            return value + "%";
                        }
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        autoSkip: false,
                        color: "white",
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}
