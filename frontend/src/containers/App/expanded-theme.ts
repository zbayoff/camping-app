import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		cream?: Palette['primary'];
		brown?: Palette['primary'];
		yellow?: Palette['primary'];
		green?: Palette['primary'];
		teal?: Palette['primary'];
		greyBlue?: Palette['primary'];
		greyBlue2?: Palette['primary'];
		venmoBlue?: Palette['primary'];
        payPalBlue?: Palette['primary'];
	}
	interface PaletteOptions {
		cream?: PaletteOptions['primary'];
		brown?: PaletteOptions['primary'];
		yellow?: PaletteOptions['primary'];
		green?: PaletteOptions['primary'];
		teal?: PaletteOptions['primary'];
		greyBlue?: PaletteOptions['primary'];
		greyBlue2?: PaletteOptions['primary'];
		venmoBlue?: PaletteOptions['primary'];
        payPalBlue?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		greyBlue: true;
		greyBlue2: true;
		venmoBlue: true;
        payPalBlue: true;
	}

}
