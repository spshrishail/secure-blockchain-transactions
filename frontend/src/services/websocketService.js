import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        if (this.socket) return;

        this.socket = io(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket'],
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        // Listen for transaction updates
        this.socket.on('transactionUpdate', (transaction) => {
            this.notifyListeners('transaction', transaction);
        });

        // Listen for wallet balance updates
        this.socket.on('walletUpdate', (wallet) => {
            this.notifyListeners('wallet', wallet);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Add event listener
    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    // Remove event listener
    removeListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    // Notify all listeners of an event
    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;