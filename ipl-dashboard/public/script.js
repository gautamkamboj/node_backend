async function fetchData() {
    const response = await fetch('/api/ipl-data');
    const data = await response.json();
    return data;
}

function createChart(ctx, type, data, options) {
    return new Chart(ctx, {
        type: type,
        data: data,
        options: options,
    });
}

function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function initializeCharts(seasonData) {
    const orangeCapCtx = document.getElementById('orangeCapChart').getContext('2d');
    const mostFoursCtx = document.getElementById('mostFoursChart').getContext('2d');
    const mostSixesCtx = document.getElementById('mostSixesChart').getContext('2d');
    const mostFiftiesCtx = document.getElementById('mostFiftiesChart').getContext('2d');
    const mostCenturiesCtx = document.getElementById('mostCenturiesChart').getContext('2d');

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true, // Set to true to maintain aspect ratio
        scales: {
            x: { beginAtZero: true },
        },
    };
    

    const orangeCapChart = createChart(orangeCapCtx, 'bar', {
        labels: [],
        datasets: [{
            label: 'Runs',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    }, chartOptions);

    const mostFoursChart = createChart(mostFoursCtx, 'bar', {
        labels: [],
        datasets: [{
            label: 'Fours',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    }, chartOptions);

    const mostSixesChart = createChart(mostSixesCtx, 'bar', {
        labels: [],
        datasets: [{
            label: 'Sixes',
            data: [],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
        }],
    }, chartOptions);

    const mostFiftiesChart = createChart(mostFiftiesCtx, 'bar', {
        labels: [],
        datasets: [{
            label: 'Fifties',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    }, chartOptions);

    const mostCenturiesChart = createChart(mostCenturiesCtx, 'bar', {
        labels: [],
        datasets: [{
            label: 'Centuries',
            data: [],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    }, chartOptions);

    return {
        orangeCapChart,
        mostFoursChart,
        mostSixesChart,
        mostFiftiesChart,
        mostCenturiesChart,
    };
}

function updateCharts(charts, seasonData) {
    const {
        orangeCapChart,
        mostFoursChart,
        mostSixesChart,
        mostFiftiesChart,
        mostCenturiesChart,
    } = charts;

    updateChart(orangeCapChart, seasonData.topTenOrangeCapPlayers.map(p => p.playerName), seasonData.topTenOrangeCapPlayers.map(p => p.playerScore));
    updateChart(mostFoursChart, seasonData.topTenMostFoursPlayers.map(p => p.playerName), seasonData.topTenMostFoursPlayers.map(p => p.playerScore));
    updateChart(mostSixesChart, seasonData.topTenMostSixsPlayers.map(p => p.playerName), seasonData.topTenMostSixsPlayers.map(p => p.playerScore));
    updateChart(mostFiftiesChart, seasonData.topTenMostFiftiesPlayers.map(p => p.playerName), seasonData.topTenMostFiftiesPlayers.map(p => p.playerScore));
    updateChart(mostCenturiesChart, seasonData.topTenMostCenturiesPlayers.map(p => p.playerName), seasonData.topTenMostCenturiesPlayers.map(p => p.playerScore));
}

document.addEventListener('DOMContentLoaded', async () => {
    const iplData = await fetchData();
    const seasonSelect = document.getElementById('season-select');
    const seasons = Object.keys(iplData);
    
    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonSelect.appendChild(option);
    });

    const charts = initializeCharts();

    seasonSelect.addEventListener('change', (event) => {
        const selectedSeason = iplData[event.target.value];
        updateCharts(charts, selectedSeason);
    });

    // Initialize with the first season data
    if (seasons.length > 0) {
        seasonSelect.value = seasons[0];
        updateCharts(charts, iplData[seasons[0]]);
    }
});
