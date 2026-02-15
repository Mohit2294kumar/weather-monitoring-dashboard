//pages/_app.js
import '../styles/globals.css';  // Adjust the path as needed

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}