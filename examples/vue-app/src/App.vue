<template>
  <div class="app">
    <header class="app-header">
      <h1>FHEVM Vue Demo</h1>
      <div class="wallet-section">
        <button v-if="!isConnected" @click="connect" class="connect-btn">
          Connect Wallet
        </button>
        <div v-else class="connected-info">
          <span>{{ shortenAddress(address!) }}</span>
          <button @click="disconnect" class="disconnect-btn">Disconnect</button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div v-if="!isConnected" class="welcome-card">
        <h2>Welcome to FHEVM SDK</h2>
        <p>Connect your wallet to start using fully homomorphic encryption</p>
        <button @click="connect" class="primary-button">Connect Wallet</button>
      </div>

      <div v-else-if="isInitializing" class="loading">
        <div class="spinner"></div>
        <p>Initializing FHEVM client...</p>
      </div>

      <DemoSection
        v-else-if="fhevmClient"
        :fhevmClient="fhevmClient"
        :userAddress="address!"
      />

      <div v-else class="error-card">
        <p>Failed to initialize FHEVM client</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAccount, useConnect, useDisconnect } from '@wagmi/vue';
import { injected } from 'wagmi/connectors';
import { createFHEVMClient, type FHEVMClient, VueAdapter } from '@fhevm/sdk';
import DemoSection from './components/DemoSection.vue';

const { address, isConnected } = useAccount();
const { connect: wagmiConnect } = useConnect();
const { disconnect: wagmiDisconnect } = useDisconnect();

const fhevmClient = ref<FHEVMClient | null>(null);
const isInitializing = ref(false);

function shortenAddress(addr: string): string {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

function connect() {
  wagmiConnect({ connector: injected() });
}

function disconnect() {
  wagmiDisconnect();
}

async function initFHEVM() {
  if (!isConnected.value || fhevmClient.value) return;

  isInitializing.value = true;
  try {
    const adapter = new VueAdapter({
      chainId: Number(import.meta.env.VITE_CHAIN_ID || 11155111),
      provider: import.meta.env.VITE_RPC_URL || '',
      debug: true,
    });

    const client = adapter.getClient();
    fhevmClient.value = client;
  } catch (error) {
    console.error('Failed to initialize FHEVM client:', error);
  } finally {
    isInitializing.value = false;
  }
}

watch(isConnected, (connected) => {
  if (connected) {
    initFHEVM();
  } else {
    fhevmClient.value = null;
  }
});

onMounted(() => {
  if (isConnected.value) {
    initFHEVM();
  }
});
</script>

<style scoped>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2rem;
  margin: 0;
}

.wallet-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.connect-btn,
.disconnect-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.connect-btn {
  background: #42b883;
  color: white;
  border: none;
}

.connect-btn:hover {
  background: #33a06f;
}

.disconnect-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.disconnect-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.connected-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.connected-info span {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.9);
}

.app-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-card,
.error-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
}

.welcome-card h2 {
  margin-bottom: 1rem;
}

.welcome-card p {
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.primary-button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.primary-button:hover {
  background: #33a06f;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-card p {
  color: #ff6b6b;
}
</style>
