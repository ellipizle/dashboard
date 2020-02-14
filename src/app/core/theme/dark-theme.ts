const palette = {
	primary: '#3366ff',
	success: '#00d68f',
	info: '#0095ff',
	warning: '#ffaa00',
	danger: '#ff3d71'
};

export const DARK_THEME = {
	name: 'dark',
	variables: {
		fontMain: 'Open Sans, sans-serif',
		fontSecondary: 'Raleway, sans-serif',

		// bg: '#222b45',
		bg: '#212124',
		bg2: '#1a2138',
		bg3: '#151a30',
		bg4: '#101426',

		border: '#222b45',
		border2: '#1a2138',
		border3: '#151a30',
		border4: '#101426',
		border5: '#101426',

		fg: '#8f9bb3',
		fgHeading: '#ffffff',
		fgText: '#ffffff',
		fgHighlight: palette.primary,
		layoutBg: '#1b1b38',
		separator: '#1b1b38',

		primary: palette.primary,
		success: palette.success,
		info: palette.info,
		warning: palette.warning,
		danger: palette.danger,

		primaryLight: '#598bff',
		successLight: '#2ce69b',
		infoLight: '#42aaff',
		warningLight: '#ffc94d',
		dangerLight: '#ff708d'
	}
};
const baseThemeVariables = DARK_THEME.variables;
export const Dark_echarts = {
	bg: baseThemeVariables.bg,
	textColor: baseThemeVariables.fgText,
	axisLineColor: baseThemeVariables.fgText,
	splitLineColor: baseThemeVariables.separator,
	itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
	tooltipBackgroundColor: baseThemeVariables.primary,
	areaOpacity: '0.7'
};
