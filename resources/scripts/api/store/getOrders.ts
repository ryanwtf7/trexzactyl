import http, { FractalResponseData, getPaginationSet, PaginatedResult } from '@/api/http';

export interface Order {
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

export type OrdersResponse = PaginatedResult<Order>;

/**
 * Get all orders for the authenticated user.
 */
export const getOrders = (page = 1): Promise<OrdersResponse> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/store/orders?page=${page}`)
            .then(({ data }) => {
                resolve({
                    items: (data.data || []).map((item: FractalResponseData) => item.attributes as Order),
                    pagination: getPaginationSet(data.meta.pagination),
                });
            })
            .catch(reject);
    });
};

/**
 * Get a specific order by ID.
 */
export const getOrder = (orderId: number): Promise<Order> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/store/orders/${orderId}`)
            .then(({ data }) => resolve(data.attributes as Order))
            .catch(reject);
    });
};

/**
 * Get orders by status.
 */
export const getOrdersByStatus = (status: string, page = 1): Promise<OrdersResponse> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/store/orders/status/${status}?page=${page}`)
            .then(({ data }) => {
                resolve({
                    items: (data.data || []).map((item: FractalResponseData) => item.attributes as Order),
                    pagination: getPaginationSet(data.meta.pagination),
                });
            })
            .catch(reject);
    });
};

/**
 * Get orders by currency/payment method.
 */
export const getOrdersByCurrency = (currency: string, page = 1): Promise<OrdersResponse> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/store/orders/currency/${currency}?page=${page}`)
            .then(({ data }) => {
                resolve({
                    items: (data.data || []).map((item: FractalResponseData) => item.attributes as Order),
                    pagination: getPaginationSet(data.meta.pagination),
                });
            })
            .catch(reject);
    });
};
