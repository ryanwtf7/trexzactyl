import http from '@/api/http';

export interface PaymentMethod {
    name: string;
    currency: string;
    merchant_number?: string;
    min_amount?: number;
    max_amount?: number;
    enabled: boolean;
    type: 'manual' | 'automatic';
    public_key?: string;
    client_id?: string;
    sandbox?: boolean;
}

export interface PaymentMethodsResponse {
    payment_methods: Record<string, PaymentMethod>;
    default_currency: string;
    supported_currencies: string[];
}

/**
 * Get available payment methods and their configurations.
 */
export const getPaymentMethods = (): Promise<PaymentMethodsResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/store/payment-methods')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};
