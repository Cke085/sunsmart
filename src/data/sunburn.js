export function getSunburnInfo(uvLevel) {
  const v = Number(uvLevel) || 0

  if (v <= 2) {
    return {
      riskIndex: 1,
      riskLabel: 'Low sunburn risk',
      timeText: '',
    }
  }

  if (v <= 5) {
    return {
      riskIndex: 2,
      riskLabel: 'Moderate sunburn risk',
      timeText: '30–45 minutes',
    }
  }

  if (v <= 7) {
    return {
      riskIndex: 3,
      riskLabel: 'High sunburn risk',
      timeText: '20–30 minutes',
    }
  }

  if (v <= 10) {
    return {
      riskIndex: 4,
      riskLabel: 'Very high sunburn risk',
      timeText: '10–20 minutes',
    }
  }

  return {
    riskIndex: 5,
    riskLabel: 'Extreme sunburn risk',
    timeText: 'under 10 minutes',
  }
}

