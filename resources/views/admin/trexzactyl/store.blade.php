@extends('layouts.admin')
@include('partials.admin.trexzactyl.nav', ['activeTab' => 'store'])

@section('title')
    Trexzactyl Settings
@endsection

@section('content-header')
    <h1>Trexzactyl Store<small>Configure the Trexzactyl storefront.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Trexzactyl</li>
    </ol>
@endsection

@section('content')
    <style>
        /* These styles ensure visibility while matching the theme's structure */
        .box-header .box-title {
            font-weight: 600;
        }

        .form-group label {
            font-weight: 600;
        }

        .text-muted small {
            color: #888;
        }

        /* Ensure inputs are visible and interactive regardless of theme overrides */
        .form-control {
            background-color: #201F31 !important;
            color: #cad1d8 !important;
            border: 1px solid #201F31 !important;
        }

        /* Fix for dark themes where text might be invisible in the body */
        .box-body {
            position: relative;
        }
    </style>

    @yield('trexzactyl::nav')

    <div class="row">
        <form action="{{ route('admin.trexzactyl.store') }}" method="POST">
            <div class="col-xs-12">
                {{-- Storefront Settings --}}
                <div class="box @if($enabled == 'true') box-success @else box-danger @endif">
                    <div class="box-header with-border">
                        <i class="fa fa-shopping-cart"></i>
                        <h3 class="box-title">Trexzactyl Storefront <small>Enable and configure payment gateways.</small>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Storefront Enabled</label>
                                <select name="store:enabled" class="form-control">
                                    <option @if ($enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Determines whether users can access the store UI.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">PayPal Enabled</label>
                                <select name="store:paypal:enabled" class="form-control">
                                    <option @if ($paypal_enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($paypal_enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Allow credit purchases via PayPal.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">PayPal Client ID</label>
                                <input type="text" class="form-control" name="store:paypal:client_id"
                                    value="{{ $paypal_client_id }}" />
                                <p class="text-muted"><small>Your PayPal API Client ID.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">PayPal Client Secret</label>
                                <input type="password" class="form-control" name="store:paypal:client_secret"
                                    value="{{ $paypal_client_secret }}" />
                                <p class="text-muted"><small>Your PayPal API Client Secret.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Stripe Enabled</label>
                                <select name="store:stripe:enabled" class="form-control">
                                    <option @if ($stripe_enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($stripe_enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Allow credit purchases via Stripe.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Stripe Secret Key</label>
                                <input type="password" class="form-control" name="store:stripe:secret"
                                    value="{{ $stripe_secret }}" />
                                <p class="text-muted"><small>Your Stripe API Secret Key.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Stripe Webhook Secret</label>
                                <input type="password" class="form-control" name="store:stripe:webhook_secret"
                                    value="{{ $stripe_webhook_secret }}" />
                                <p class="text-muted"><small>Your Stripe Webhook Signing Secret.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">bKash Enabled</label>
                                <select name="store:bkash:enabled" class="form-control">
                                    <option @if ($bkash_enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($bkash_enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Allow credit purchases via bKash.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">bKash Number</label>
                                <input type="text" class="form-control" name="store:bkash:number"
                                    value="{{ $bkash_number }}" />
                                <p class="text-muted"><small>Personal bKash wallet number.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Nagad Enabled</label>
                                <select name="store:nagad:enabled" class="form-control">
                                    <option @if ($nagad_enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($nagad_enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                                <p class="text-muted"><small>Allow credit purchases via Nagad.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Nagad Number</label>
                                <input type="text" class="form-control" name="store:nagad:number"
                                    value="{{ $nagad_number }}" />
                                <p class="text-muted"><small>Personal Nagad wallet number.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Currency Code</label>
                                <select name="store:currency" class="form-control">
                                    @foreach ($currencies as $currency)
                                        <option @if ($selected_currency === $currency['code']) selected @endif
                                            value="{{ $currency['code'] }}">{{ $currency['name'] }} ({{ $currency['code'] }})
                                        </option>
                                    @endforeach
                                </select>
                                <p class="text-muted"><small>The asset currency code (e.g., BDT, USD).</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">USD to BDT Rate</label>
                                <input type="text" class="form-control" name="store:conversion_rate"
                                    value="{{ $conversion_rate }}" />
                                <p class="text-muted"><small>The conversion rate used for bKash/Nagad (e.g., 115).</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Idle Earning --}}
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-money"></i>
                        <h3 class="box-title">Idle Earning <small>Passive credit generation for active users.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Enabled</label>
                                <select name="earn:enabled" class="form-control">
                                    <option @if ($earn_enabled == 'false') selected @endif value="false">Disabled</option>
                                    <option @if ($earn_enabled == 'true') selected @endif value="true">Enabled</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Credits Per Minute</label>
                                <input type="text" class="form-control" name="earn:amount" value="{{ $earn_amount }}" />
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Resource Pricing --}}
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-dollar"></i>
                        <h3 class="box-title">Resource Pricing <small>Set the cost for each resource type.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 50% CPU</label>
                                <input type="text" class="form-control" name="store:cost:cpu" value="{{ $cpu }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1GB RAM</label>
                                <input type="text" class="form-control" name="store:cost:memory" value="{{ $memory }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1GB Disk</label>
                                <input type="text" class="form-control" name="store:cost:disk" value="{{ $disk }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per Slot</label>
                                <input type="text" class="form-control" name="store:cost:slot" value="{{ $slot }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per Port</label>
                                <input type="text" class="form-control" name="store:cost:port" value="{{ $port }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per Backup</label>
                                <input type="text" class="form-control" name="store:cost:backup" value="{{ $backup }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per Database</label>
                                <input type="text" class="form-control" name="store:cost:database"
                                    value="{{ $database }}" />
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Resource Limits --}}
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-area-chart"></i>
                        <h3 class="box-title">Resource Limits <small>Max resources allowed per server deployment.</small>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Max CPU (%)</label>
                                <input type="text" class="form-control" name="store:limit:cpu" value="{{ $limit_cpu }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Max RAM (MB)</label>
                                <input type="text" class="form-control" name="store:limit:memory"
                                    value="{{ $limit_memory }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Max Disk (MB)</label>
                                <input type="text" class="form-control" name="store:limit:disk" value="{{ $limit_disk }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Max Ports</label>
                                <input type="text" class="form-control" name="store:limit:port" value="{{ $limit_port }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Max Backups</label>
                                <input type="text" class="form-control" name="store:limit:backup"
                                    value="{{ $limit_backup }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Max Databases</label>
                                <input type="text" class="form-control" name="store:limit:database"
                                    value="{{ $limit_database }}" />
                            </div>
                        </div>
                    </div>
                </div>

                {!! csrf_field() !!}
                <button type="submit" name="_method" value="PATCH" class="btn btn-primary pull-right">Save Settings</button>
            </div>
        </form>
    </div>
@endsection