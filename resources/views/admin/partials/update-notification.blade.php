@php
    $updateInfo = \Trexzactyl\Services\Helpers\UpdateCheckService::getUpdateInfo();
@endphp

@if($updateInfo['is_update_available'])
<div class="alert alert-warning alert-dismissible" id="update-notification" style="margin: 15px; border-radius: 8px; border-left: 4px solid #f39c12; animation: slideDown 0.3s ease-out;">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
    <h4><i class="icon fa fa-exclamation-triangle"></i> Update Available!</h4>
    <p>
        A new version of Trexzactyl is available. 
        <strong>{{ $updateInfo['current_version'] }}</strong> → <strong>{{ $updateInfo['latest_version'] }}</strong>
    </p>
    <a href="{{ $updateInfo['release_url'] }}" target="_blank" class="btn btn-sm btn-warning" style="margin-top: 10px;">
        <i class="fa fa-download"></i> View Release Notes & Update
    </a>
</div>

<style>
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

#update-notification {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

#update-notification .btn-warning {
    background-color: #f39c12;
    border-color: #e08e0b;
    transition: all 0.2s ease;
}

#update-notification .btn-warning:hover {
    background-color: #e08e0b;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
@endif
