import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import iplData from './iplData.json'; // Import JSON data directly

const App = () => {
  const [selectedSeason, setSelectedSeason] = useState('');
  const [charts, setCharts] = useState({
    orangeCapChart: null,
    mostFoursChart: null,
    mostSixesChart: null,
    mostFiftiesChart: null,
    mostCenturiesChart: null
  });

  useEffect(() => {
    if (selectedSeason && iplData[selectedSeason]) {
      const seasonData = iplData[selectedSeason];
      updateCharts(seasonData);
    }
  }, [selectedSeason]);

  const updateCharts = (seasonData) => {
    const {
      topTenOrangeCapPlayers,
      topTenMostFoursPlayers,
      topTenMostSixsPlayers,
      topTenMostFiftiesPlayers,
      topTenMostCenturiesPlayers
    } = seasonData;

    destroyChart(charts.orangeCapChart);
    destroyChart(charts.mostFoursChart);
    destroyChart(charts.mostSixesChart);
    destroyChart(charts.mostFiftiesChart);
    destroyChart(charts.mostCenturiesChart);

    const newCharts = initializeCharts();
    setCharts(newCharts);

    updateChart(newCharts.orangeCapChart, topTenOrangeCapPlayers.map(p => p.playerName), topTenOrangeCapPlayers.map(p => p.playerScore));
    updateChart(newCharts.mostFoursChart, topTenMostFoursPlayers.map(p => p.playerName), topTenMostFoursPlayers.map(p => p.playerScore));
    updateChart(newCharts.mostSixesChart, topTenMostSixsPlayers.map(p => p.playerName), topTenMostSixsPlayers.map(p => p.playerScore));
    updateChart(newCharts.mostFiftiesChart, topTenMostFiftiesPlayers.map(p => p.playerName), topTenMostFiftiesPlayers.map(p => p.playerScore));
    updateChart(newCharts.mostCenturiesChart, topTenMostCenturiesPlayers.map(p => p.playerName), topTenMostCenturiesPlayers.map(p => p.playerScore));
  };

  const destroyChart = (chart) => {
    if (chart !== null) {
      chart.destroy();
    }
  };

  const initializeCharts = () => {
    const orangeCapCtx = document.getElementById('orangeCapChart').getContext('2d');
    const mostFoursCtx = document.getElementById('mostFoursChart').getContext('2d');
    const mostSixesCtx = document.getElementById('mostSixesChart').getContext('2d');
    const mostFiftiesCtx = document.getElementById('mostFiftiesChart').getContext('2d');
    const mostCenturiesCtx = document.getElementById('mostCenturiesChart').getContext('2d');

    const orangeCapChart = new Chart(orangeCapCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Score',
          data: [],
          backgroundColor: 'orange'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    const mostFoursChart = new Chart(mostFoursCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Score',
          data: [],
          backgroundColor: 'green'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    const mostSixesChart = new Chart(mostSixesCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Score',
          data: [],
          backgroundColor: 'blue'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    const mostFiftiesChart = new Chart(mostFiftiesCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Score',
          data: [],
          backgroundColor: 'purple'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    const mostCenturiesChart = new Chart(mostCenturiesCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Score',
          data: [],
          backgroundColor: 'red'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    return {
      orangeCapChart,
      mostFoursChart,
      mostSixesChart,
      mostFiftiesChart,
      mostCenturiesChart
    };
  };

  const updateChart = (chart, labels, data) => {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  };

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  return (
    <div>
      <h1>IPL Stats</h1>
      <select onChange={handleSeasonChange}>
        <option value="">Select Season</option>
        {Object.keys(iplData).map(season => (
          <option key={season} value={season}>{season}</option>
        ))}
      </select>
      <div className="charts-container">
        <div className="chart">
          <h3>Top Ten Orange Cap Players</h3>
          <canvas id="orangeCapChart" style={{ height: '50px' }} />
        </div>
        <div className="chart">
          <h3>Top Ten Players with Most Fours</h3>
          <canvas id="mostFoursChart" style={{ height: '50px' }} />
        </div>
        <div className="chart">
          <h3>Top Ten Players with Most Sixes</h3>
          <canvas id="mostSixesChart" style={{ height: '50px' }} />
        </div>
        <div className="chart">
          <h3>Top Ten Players with Most Fifties</h3>
          <canvas id="mostFiftiesChart" style={{ height: '50px' }} />
        </div>
        <div className="chart">
          <h3>Top Ten Players with Most Centuries</h3>
          <canvas id="mostCenturiesChart" style={{ height: '50px' }} />
        </div>
      </div>
    </div>
  );
};

export default App;
