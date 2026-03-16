<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Trexzactyl\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Traits\NotificationHelper;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Notifications\PaymentApproved;
use Trexzactyl\Notifications\PaymentRejected;
use Trexzactyl\Notifications\PaymentProcessing;
use Trexzactyl\Http\Requests\Admin\Payments\RejectPaymentRequest;

class PaymentController extends Controller
{
    use NotificationHelper;

    public function __construct(private AlertsMessageBag $alert)
    {
    }

    public function index(Request $request): View
    {
        $status = $request->get('status', 'pending');
        $currency = $request->get('currency');
        
        $query = Payment::with('user')->orderBy('created_at', 'desc');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        if ($currency) {
            $query->where('payment_method', $currency);
        }
        
        $payments = $query->paginate(25);
        
        $stats = [
            'pending' => Payment::where('status', 'pending')->count(),
            'processing' => Payment::where('status', 'processing')->count(),
            'approved' => Payment::where('status', 'approved')->count(),
            'rejected' => Payment::where('status', 'rejected')->count(),
            'total' => Payment::count(),
        ];

        return view('admin.trexzactyl.payments', [
            'payments' => $payments,
            'stats' => $stats,
            'currentStatus' => $status,
            'currentCurrency' => $currency,
        ]);
    }

    public function setProcessing(int $id): RedirectResponse
    {
        $payment = Payment::findOrFail($id);

        if (!in_array($payment->status, ['pending'])) {
            $this->alert->danger('This payment cannot be set to processing from its current status.')->flash();
            return redirect()->back();
        }

        $payment->update([
            'status' => 'processing',
            'processed_at' => now(),
        ]);

        // Notify user
        $this->sendNotificationIfEnabled(
            $payment->user,
            new PaymentProcessing($payment),
            'payments',
            'processing'
        );

        $this->alert->success('Payment status updated to processing and user notified.')->flash();
        return redirect()->back();
    }

    public function approve(int $id): RedirectResponse
    {
        $payment = Payment::findOrFail($id);

        if (!in_array($payment->status, ['pending', 'processing'])) {
            $this->alert->danger('This payment has already been processed.')->flash();
            return redirect()->back();
        }

        $payment->update([
            'status' => 'approved',
            'processed_at' => now(),
        ]);

        // Add credits to user
        $user = $payment->user;
        $user->store_balance += $payment->amount;
        $user->save();

        // Notify user
        $this->sendNotificationIfEnabled(
            $user,
            new PaymentApproved($payment->amount, $payment->currency),
            'payments',
            'approved'
        );

        $this->alert->success('Payment approved, credits added, and user notified.')->flash();
        return redirect()->back();
    }

    public function reject(RejectPaymentRequest $request, int $id): RedirectResponse
    {
        $payment = Payment::findOrFail($id);

        if (!in_array($payment->status, ['pending', 'processing'])) {
            $this->alert->danger('This payment has already been processed.')->flash();
            return redirect()->back();
        }

        $payment->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'processed_at' => now(),
        ]);

        // Notify user
        $this->sendNotificationIfEnabled(
            $payment->user,
            new PaymentRejected($payment, $request->input('reason')),
            'payments',
            'rejected'
        );

        $this->alert->success('Payment rejected and user notified.')->flash();
        return redirect()->back();
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $action = $request->input('action');
        $paymentIds = $request->input('payment_ids', []);

        if (empty($paymentIds)) {
            $this->alert->danger('No payments selected.')->flash();
            return redirect()->back();
        }

        $payments = Payment::whereIn('id', $paymentIds)->get();
        $processed = 0;

        foreach ($payments as $payment) {
            switch ($action) {
                case 'approve':
                    if (in_array($payment->status, ['pending', 'processing'])) {
                        $payment->update([
                            'status' => 'approved',
                            'processed_at' => now(),
                        ]);
                        
                        $user = $payment->user;
                        $user->store_balance += $payment->amount;
                        $user->save();
                        
                        $user->notify(new PaymentApproved($payment->amount, $payment->currency));
                        $processed++;
                    }
                    break;

                case 'processing':
                    if ($payment->status === 'pending') {
                        $payment->update([
                            'status' => 'processing',
                            'processed_at' => now(),
                        ]);
                        
                        $payment->user->notify(new PaymentProcessing($payment));
                        $processed++;
                    }
                    break;

                case 'reject':
                    if (in_array($payment->status, ['pending', 'processing'])) {
                        $payment->update([
                            'status' => 'rejected',
                            'rejection_reason' => 'Bulk rejection',
                            'processed_at' => now(),
                        ]);
                        
                        $payment->user->notify(new PaymentRejected($payment, 'Bulk rejection'));
                        $processed++;
                    }
                    break;
            }
        }

        $this->alert->success("Processed {$processed} payments successfully.")->flash();
        return redirect()->back();
    }
}
