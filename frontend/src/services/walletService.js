import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class WalletService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Set auth token for requests
    setAuthToken(token) {
        if (token) {
            this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.api.defaults.headers.common['Authorization'];
        }
    }

    // Get wallet information
    async getWalletInfo() {
        try {
            const response = await this.api.get('/wallet/info');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Sign transaction
    async signTransaction(transactionData) {
        try {
            const response = await this.api.post('/wallet/sign-transaction', transactionData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Send transaction
    async sendTransaction(signedTransaction) {
        try {
            const response = await this.api.post('/wallet/send-transaction', { signedTransaction });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Handle errors
    handleError(error) {
        if (error.response) {
            // Server responded with error
            return new Error(error.response.data.message || 'Something went wrong');
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        } else {
            // Other errors
            return new Error('Error setting up request');
        }
    }
}

export default new WalletService(); 