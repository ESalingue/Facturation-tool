import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // Couleur principale (vert)
        },
        secondary: {
            main: '#ff5722', // Couleur secondaire (orange)
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;
