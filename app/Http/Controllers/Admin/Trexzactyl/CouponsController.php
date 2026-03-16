<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Carbon\Carbon;
use Illuminate\View\View;
use Trexzactyl\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Exceptions\DisplayException;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Exceptions\Model\DataValidationException;
use Trexzactyl\Exceptions\Repository\RecordNotFoundException;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\Coupons\IndexFormRequest;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\Coupons\StoreFormRequest;

class CouponsController extends Controller
{
    public function __construct(private AlertsMessageBag $alert, private SettingsRepositoryInterface $settings)
    {
    }

    public function index(): View
    {
        return view('admin.trexzactyl.coupons', [
            'coupons' => Coupon::all(),
            'enabled' => $this->settings->get('trexzactyl::coupons:enabled'),
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(IndexFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::coupons:' . $key, $value);
        }

        $this->alert->success('The coupons system has been successfully updated.')->flash();

        return redirect()->route('admin.trexzactyl.coupons');
    }

    /**
     * @throws DisplayException
     */
    public function store(StoreFormRequest $request): RedirectResponse
    {
        if ($request->input('expires')) {
            $expires_at = Carbon::now()->addHours($request->input('expires'));
        } else {
            $expires_at = null;
        }

        if (Coupon::where(['code' => $request->input('code')])->exists()) {
            throw new DisplayException('You cannot create a coupon with an already existing code.');
        }

        Coupon::query()->insert([
            'expires' => $expires_at,
            'created_at' => Carbon::now(),
            'code' => $request->input('code'),
            'uses' => $request->input('uses'),
            'cr_amount' => $request->input('credits'),
        ]);

        $this->alert->success('Successfully created a coupon.')->flash();

        return redirect()->route('admin.trexzactyl.coupons');
    }
}
