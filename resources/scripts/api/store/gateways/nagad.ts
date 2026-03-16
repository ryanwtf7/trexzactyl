import http from '@/api/http';

export interface NagadPaymentData {
    amount: number;
    transaction_id: string;
    sender_number: string;
}

export interface NagadInfoResponse {
    payment_method: string;
    instructions: string[];
    merchant_number: string;
    min_amount: number;
    max_amount: number;
    processing_time: string;
}

export interface PaymentResponse {
    id: number;
    user_id: number;
    amount: number;
    currency: string;
    payment_method: string;
    transaction_id: string;
    sender_number: string;
    status: string;
    status_label: string;
    rejection_reason?: string;
    processed_at?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Get Nagad payment information and instructions.
 */
export const getNagadInfo = (): Promise<NagadInfoResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/store/nagad/info')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

/**
 * Submit a Nagad payment.
 */
export const submitNagadPayment = (data: NagadPaymentData): Promise<PaymentResponse> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/store/nagad', data)
            .then(({ data }) => resolve(data.attributes))
            .catch(reject);
    });
};
