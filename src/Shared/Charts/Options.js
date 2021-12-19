const tooltips = (theme) => {
    const {colors, white} = theme;
    return {
        enabled: true,
        mode: 'index',
        intersect: false,
        borderWidth: 1,
        borderColor: colors.gray[5],
        backgroundColor: white,
        titleFontColor: colors.dark[7],
        bodyFontColor: colors.gray[7],
        footerFontColor: colors.gray[7]
    };
};

const getHorizontalAxis = (theme, stacked = false) => {
    const {colors} = theme;
    return [
        {
            stacked: stacked,
            barThickness: 12,
            maxBarThickness: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            ticks: {fontColor: colors.gray[7]},
            gridLines: {display: false, drawBorder: false}
        }
    ];
};

const getVerticalAxis = (theme, stacked = false) => {
    const {colors} = theme;

    return [
        {
            stacked: stacked,
            ticks: {
                fontColor: colors.gray[7],
                beginAtZero: true,
                min: 0
            },
            gridLines: {
                borderDash: [7],
                borderDashOffset: [7],
                color: colors.gray[5],
                drawBorder: false,
                zeroLineBorderDash: [7],
                zeroLineBorderDashOffset: [7],
                zeroLineColor: colors.gray[5]
            }
        }
    ]
}

const getBarOptions = (legendConfig, theme) => {
    const {display = true, position = 'bottom'} = legendConfig || {};
    return {
        legend: {display, position},
        tooltips: tooltips(theme),
        scales: {
            xAxes: getHorizontalAxis(theme),
            yAxes: getVerticalAxis(theme)
        }
    };
};

const getHorizontalBarOptions = (legendConfig, theme) => {
    const {display = false, position = 'bottom'} = legendConfig || {};
    return {
        legend: {display, position},
        tooltips: tooltips(theme),
        scales: {
            xAxes: getVerticalAxis(theme),
            yAxes: getHorizontalAxis(theme)
        }
    };
};

export const CHART_TYPE = {
    BAR: 'BAR',
    HORIZONTAL_BAR: 'HORIZONTAL_BAR'
};

export const getOptions = (type, theme) => {
    const {legend} = {};
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        cornerRadius: 20,
    };
    switch (type) {
        case CHART_TYPE.BAR: {
            return {...commonOptions, ...getBarOptions(legend, theme)};
        }
        case CHART_TYPE.HORIZONTAL_BAR: {
            return {...commonOptions, ...getHorizontalBarOptions(legend, theme)};
        }
        default: {
            return commonOptions;
        }
    }
};
