<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Trexzactyl\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\ApprovalFormRequest;
use Trexzactyl\Exceptions\DisplayException;

class ApprovalsController extends Controller
{
    /**
     * ApprovalsController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings,
    ) {
    }

    /**
     * Render the Trexzactyl referrals interface.
     */
    public function index(): View
    {
        $users = User::where('approved', false)->get();

        return view('admin.trexzactyl.approvals', [
            'enabled' => $this->settings->get('trexzactyl::approvals:enabled', false),
            'webhook' => $this->settings->get('trexzactyl::approvals:webhook', ''),
            'users' => $users,
        ]);
    }

    /**
     * Updates the settings for approvals.
     *
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(ApprovalFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::approvals:' . $key, $value);
        }

        $this->alert->success('Trexzactyl Approval settings have been updated.')->flash();

        return redirect()->route('admin.trexzactyl.approvals');
    }

    /**
     * Perform a bulk action for approval status.
     */
    public function bulkAction(Request $request, string $action): RedirectResponse
    {
        if ($action === 'approve') {
            User::query()->where('approved', false)->update(['approved' => true]);
        } else {
            try {
                User::query()->where('approved', false)->delete();
            } catch (DisplayException $ex) {
                throw new DisplayException('Unable to complete action: ' . $ex->getMessage());
            }
        }

        $this->alert->success('All users have been ' . ($action === 'approve' ? 'approved ' : 'denied successfully.'))->flash();

        return redirect()->route('admin.trexzactyl.approvals');
    }

    /**
     * Approve an incoming approval request.
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $user = User::where('id', $id)->first();
        $user->update(['approved' => true]);
        // This gives the user access to the frontend.

        $this->alert->success($user->username . ' has been approved.')->flash();

        return redirect()->route('admin.trexzactyl.approvals');
    }

    /**
     * Deny an incoming approval request.
     */
    public function deny(Request $request, int $id): RedirectResponse
    {
        $user = User::where('id', $id)->first();
        $user->delete();
        // While typically we should look for associated servers, there
        // shouldn't be any present - as the user has been waiting for approval.

        $this->alert->success($user->username . ' has been denied.')->flash();

        return redirect()->route('admin.trexzactyl.approvals');
    }
}
