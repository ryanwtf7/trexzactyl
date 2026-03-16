<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Trexzactyl\Models\Payment;
use Trexzactyl\Http\Controllers\Api\Client\ClientApiController;
use Trexzactyl\Transformers\Api\Client\Store\OrderTransformer;

class OrderController extends ClientApiController
{
    /**
     * Get all orders for the authenticated user.
     */
    public function index(Request $request): array
    {
        $orders = Payment::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->fractal->collection($orders)
            ->transformWith($this->getTransformer(OrderTransformer::class))
            ->toArray();
    }

    /**
     * Get a specific order by ID.
     */
    public function show(Request $request, int $orderId): array
    {
        $order = Payment::where('user_id', $request->user()->id)
            ->where('id', $orderId)
            ->firstOrFail();

        return $this->fractal->item($order)
            ->transformWith($this->getTransformer(OrderTransformer::class))
            ->toArray();
    }

    /**
     * Get orders by status.
     */
    public function byStatus(Request $request, string $status): array
    {
        $validStatuses = ['pending', 'processing', 'approved', 'rejected'];
        
        if (!in_array($status, $validStatuses)) {
            return response()->json(['error' => 'Invalid status'], 400);
        }

        $orders = Payment::where('user_id', $request->user()->id)
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->fractal->collection($orders)
            ->transformWith($this->getTransformer(OrderTransformer::class))
            ->toArray();
    }

    /**
     * Get orders by currency (payment method).
     */
    public function byCurrency(Request $request, string $currency): array
    {
        $validCurrencies = ['bkash', 'nagad', 'stripe', 'paypal'];
        
        if (!in_array($currency, $validCurrencies)) {
            return response()->json(['error' => 'Invalid currency'], 400);
        }

        $orders = Payment::where('user_id', $request->user()->id)
            ->where('payment_method', $currency)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->fractal->collection($orders)
            ->transformWith($this->getTransformer(OrderTransformer::class))
            ->toArray();
    }
}