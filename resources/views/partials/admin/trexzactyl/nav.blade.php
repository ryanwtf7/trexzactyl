@section('trexzactyl::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">

                    <li @if($activeTab === 'index') class="active " @endif>
                        <a href="{{ route('admin.index') }}">Home</a>
                    </li>
                    <li @if($activeTab === 'appearance') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.appearance') }}">Appearance</a>
                    </li>
                    <li @if($activeTab === 'mail') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.mail') }}">Mail</a>
                    </li>
                    <li @if($activeTab === 'advanced') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.advanced') }}">Advanced</a>
                    </li>
                    <li @if($activeTab === 'tickets') class="active" @endif>
                        <a href="{{ route('admin.tickets.index') }}">Tickets</a>
                    </li>

                    <li style="margin-left: 5px; margin-right: 5px;"><a>-</a></li>

                    <li @if($activeTab === 'store') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.store') }}">Storefront</a>
                    </li>
                    <li @if($activeTab === 'registration') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.registration') }}">Registration</a>
                    </li>
                    <li @if($activeTab === 'approvals') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.approvals') }}">Approvals</a>
                    </li>
                    <li @if($activeTab === 'payments') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.payments') }}">Payments</a>
                    </li>
                    <li @if($activeTab === 'server') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.server') }}">Server Settings</a>
                    </li>
                    <li @if($activeTab === 'referrals') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.referrals') }}">Referrals</a>
                    </li>
                    <li @if($activeTab === 'alerts') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.alerts') }}">Alerts</a>
                    </li>
                    <li @if($activeTab === 'coupons') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.coupons') }}">Coupons</a>
                    </li>
                    <li @if($activeTab === 'upgrade') class="active" @endif>
                        <a href="{{ route('admin.trexzactyl.upgrade') }}">Upgrade</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection