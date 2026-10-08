const accentGreen = '#52FF7B';
const darkGreen = 'rgba(24, 69, 52, 0.7)';
const darkGreenHover = 'rgba(46, 219, 103, 0.4)';
const borderCol = 'rgba(255, 255, 255, 0.08)';
const gridCol = 'rgba(255, 255, 255, 0.06)';
const mutedText = '#8FA5BC';

export const chartDatasets = {
  weekly: {
    labels: ['Wk 21', 'Wk 22', 'Wk 23', 'Wk 24', 'Wk 25', 'Wk 26', 'Wk 27', 'Wk 28'],
    yield: [420, 510, 480, 690, 580, 610, 650, 590],
    power: [180, 195, 190, 210, 200, 205, 220, 215],
    highlightIndex: 3,
  },
  monthly: {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
    yield: [1200, 1450, 1380, 2100, 1750, 1820, 1980, 1680],
    power: [450, 470, 460, 520, 490, 500, 530, 510],
    highlightIndex: 3,
  },
  yearly: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    yield: [12400, 14900, 16200, 15800, 19200, 24500, 21300, 23000],
    power: [4200, 4500, 4800, 4700, 5100, 5900, 5400, 5600],
    highlightIndex: 5,
  },
};

export function getYieldChartConfig(viewType) {
  const data = chartDatasets[viewType];
  const barBackgrounds = data.yield.map((_, index) =>
    index === data.highlightIndex ? accentGreen : darkGreen
  );
  const barHoverBackgrounds = data.yield.map((_, index) =>
    index === data.highlightIndex ? '#2EDB67' : darkGreenHover
  );

  return {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Yield',
          data: data.yield,
          backgroundColor: barBackgrounds,
          hoverBackgroundColor: barHoverBackgrounds,
          borderColor: 'rgba(82, 255, 123, 0.2)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.5,
          order: 2,
        },
        {
          type: 'line',
          label: 'Power',
          data: data.power,
          borderColor: '#F3F8FF',
          borderWidth: 2,
          pointBackgroundColor: '#021426',
          pointBorderColor: '#F3F8FF',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.4,
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#071B2F',
          titleColor: '#F3F8FF',
          bodyColor: '#8FA5BC',
          borderColor: 'rgba(82, 255, 123, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: 'Outfit', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          callbacks: {
            label(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label +=
                  context.dataset.type === 'line'
                    ? context.parsed.y + ' kWh'
                    : context.parsed.y + ' kg';
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color(context) {
              return context.index === data.highlightIndex ? accentGreen : mutedText;
            },
            font: { family: 'Inter', size: 10, weight: '600' },
          },
          border: { color: borderCol },
        },
        y: {
          grid: { color: gridCol },
          ticks: {
            color: mutedText,
            font: { family: 'Inter', size: 10 },
          },
          border: { color: borderCol },
        },
      },
    },
  };
}

export function getSparklineChartConfig() {
  const sparkData = [25, 45, 30, 20, 60, 40, 75, 55, 35, 50, 42, 68];

  return {
    type: 'bar',
    data: {
      labels: Array(sparkData.length).fill(''),
      datasets: [
        {
          data: sparkData,
          backgroundColor: sparkData.map((val) =>
            val > 60 ? 'rgba(82, 255, 123, 0.45)' : 'rgba(143, 165, 188, 0.15)'
          ),
          hoverBackgroundColor: 'rgba(82, 255, 123, 0.65)',
          borderRadius: 3,
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    },
  };
}

export const initialReportsData = [
  { id: 1, name: 'Q3_Nutrient_Audit_V2', date: '2023-10-12', time: '02:30 PM', type: 'efficiency' },
  { id: 2, name: 'Harvest_Projection_Main_B', date: '2023-10-10', time: '09:15 AM', type: 'projection' },
  { id: 3, name: 'Room_A_CO2_Incident_Log', date: '2023-10-05', time: '06:40 PM', type: 'incident' },
  { id: 4, name: 'Sensor_Calibration_Oct', date: '2023-10-02', time: '11:00 AM', type: 'maintenance' },
];

export const initialTimelineEvents = [
  {
    id: 1,
    title: 'Irrigation Protocol Activated',
    badge: 'automated',
    meta: 'Room 04',
    time: '14:20 PM',
    desc: 'Nutrient water cycle running for Zone B tomatoes.',
    node: 'success',
    isAutomated: true,
  },
  {
    id: 2,
    title: 'Manual CO2 Override',
    badge: 'manual',
    meta: 'User: admin_j.doe',
    time: '12:45 PM',
    desc: 'CO2 target concentration set to 800ppm.',
    node: 'neutral',
    isAutomated: false,
  },
  {
    id: 3,
    title: 'Cloud Sync Completed',
    badge: null,
    meta: 'Central Hub',
    time: '12:00 PM',
    desc: 'Telemetry data successfully uploaded to AWS cluster.',
    node: 'success',
    isAutomated: true,
  },
  {
    id: 4,
    title: 'Spectrum Shift: Day Phase',
    badge: null,
    meta: 'Global',
    time: '06:00 AM',
    desc: 'LED system shifted to active photosynthesis wavelengths.',
    node: 'success',
    isAutomated: true,
  },
];
