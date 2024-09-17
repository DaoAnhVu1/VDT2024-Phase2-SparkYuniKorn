import axios, { AxiosResponse } from 'axios';

class YuniKornClient {
    private static instance: YuniKornClient;
    private host: string;

    // Hardcoded host (replace with your actual host if needed)
    private constructor() {
        this.host = 'http://localhost:9889'; // Example hardcoded host
    }

    // Singleton method to return the single instance
    public static getInstance(): YuniKornClient {
        if (!YuniKornClient.instance) {
            YuniKornClient.instance = new YuniKornClient();
        }
        return YuniKornClient.instance;
    }

    // GET request method
    public async get(endpoint: string): Promise<AxiosResponse | undefined> {
        try {
            const url = `${this.host}${endpoint}`;
            const response = await axios.get(url);
            return response;
        } catch (error) {
            console.error(`GET request error for ${this.host}${endpoint}:`, error);
        }
    }

    // POST request method
    public async post(endpoint: string, data: any): Promise<AxiosResponse | undefined> {
        try {
            const url = `${this.host}${endpoint}`;
            const response = await axios.post(url, data);
            return response;
        } catch (error) {
            console.error(`POST request error for ${this.host}${endpoint}:`, error);
        }
    }
}

export default YuniKornClient;
