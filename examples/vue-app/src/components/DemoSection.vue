<template>
  <div class="demo-section">
    <div class="card">
      <h2>Encryption Demo</h2>
      <p class="card-description">
        Encrypt a number using FHE. The encrypted value can be used in smart contracts
        while keeping the original value private.
      </p>

      <div class="input-group">
        <label>Value to Encrypt</label>
        <input
          v-model="value"
          type="number"
          placeholder="Enter a number"
          :disabled="isEncrypting"
        />
      </div>

      <button
        @click="handleEncrypt"
        :disabled="isEncrypting || !value"
        class="encrypt-button"
      >
        {{ isEncrypting ? 'Encrypting...' : 'Encrypt Value' }}
      </button>

      <div v-if="encryptedValue" class="result-box">
        <h3>Encrypted Result:</h3>
        <pre>{{ encryptedValue }}</pre>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <div class="info-card">
      <h3>How it works</h3>
      <ol>
        <li>Enter a numeric value</li>
        <li>Click "Encrypt Value" to encrypt using FHE</li>
        <li>The encrypted data can be sent to smart contracts</li>
        <li>Computations can be performed on encrypted data</li>
        <li>Only authorized users can decrypt the results</li>
      </ol>

      <div class="privacy-notice">
        <strong>🔒 Privacy Guaranteed</strong>
        <p>
          Your data is encrypted client-side using fully homomorphic encryption.
          Nobody can see your original values, not even contract owners.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { encryptValue, type FHEVMClient } from '@fhevm/sdk';

const props = defineProps<{
  fhevmClient: FHEVMClient;
  userAddress: string;
}>();

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

const value = ref('');
const encryptedValue = ref('');
const isEncrypting = ref(false);
const error = ref('');

async function handleEncrypt() {
  if (!value.value) return;

  isEncrypting.value = true;
  error.value = '';

  try {
    const encrypted = await encryptValue(
      props.fhevmClient,
      BigInt(value.value),
      {
        contractAddress: CONTRACT_ADDRESS,
        userAddress: props.userAddress,
      }
    );

    encryptedValue.value = JSON.stringify(
      encrypted,
      (_, v) => (typeof v === 'bigint' ? v.toString() : v)
    ).substring(0, 200) + '...';
  } catch (err: any) {
    console.error('Encryption failed:', err);
    error.value = err.message || 'Encryption failed. Please try again.';
  } finally {
    isEncrypting.value = false;
  }
}
</script>

<style scoped>
.demo-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .demo-section {
    grid-template-columns: 1fr;
  }
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.card h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: white;
}

.card-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: white;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #42b883;
}

.encrypt-button {
  width: 100%;
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.encrypt-button:hover:not(:disabled) {
  background: #33a06f;
}

.encrypt-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-box {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.result-box h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: white;
}

.result-box pre {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #4ade80;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
}

.info-card {
  background: rgba(66, 184, 131, 0.1);
  border: 1px solid rgba(66, 184, 131, 0.3);
  border-radius: 12px;
  padding: 2rem;
}

.info-card h3 {
  margin-bottom: 1rem;
  color: #42b883;
}

.info-card ol {
  padding-left: 1.5rem;
  line-height: 2;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.info-card li {
  margin-bottom: 0.5rem;
}

.privacy-notice {
  background: rgba(66, 184, 131, 0.1);
  border: 1px solid rgba(66, 184, 131, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.privacy-notice strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #42b883;
}

.privacy-notice p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}
</style>
