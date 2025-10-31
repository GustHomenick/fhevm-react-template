import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { WagmiPlugin } from '@wagmi/vue';
import { injected } from 'wagmi/connectors';

const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RPC_URL),
  },
});

const app = createApp(App);
app.use(WagmiPlugin, { config });
app.mount('#app');
