<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ config('app.name', 'Trexzactyl') }} - @yield('title')</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <meta name="_token" content="{{ csrf_token() }}">

    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/favicons/manifest.json">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
    <link rel="shortcut icon" href="/favicons/favicon.ico">
    <meta name="msapplication-config" content="/favicons/browserconfig.xml">
    <meta name="theme-color" content="#0e4688">

    <script src="https://unpkg.com/feather-icons"></script>

    @include('layouts.scripts')

    @section('scripts')
    {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
    {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
    {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
    {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
    {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
    {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
    <!-- Trexzactyl Unified Theme -->
    <link rel="stylesheet" href="/themes/trexzactyl/css/trexzactyl.css?v=<?php echo time(); ?>">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    @show
</head>

<body class="skin-blue fixed">
    <div class="wrapper">
        <header class="main-header">
            <a href="{{ route('index') }}" class="logo" style="padding-top: 10px !important; padding-bottom: 0 !important;">
                <img src="{{ config('app.logo') }}" width="48" height="48" />
            </a>
            <nav class="navbar navbar-static-top" role="navigation">
                <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" style="float: right; margin-right: 15px;">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </a>
            </nav>
        </header>
        <aside class="main-sidebar">
            <section class="sidebar">
                <ul class="sidebar-menu">
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.index') ?: 'active' }}">
                        <a href="{{ route('admin.index')}}">
                            <i data-feather="tool"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.tickets') ?: 'active' }}">
                        <a href="{{ route('admin.tickets.index')}}">
                            <i data-feather="help-circle"></i>
                            <span>Tickets</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                        <a href="{{ route('admin.api.index')}}">
                            <i data-feather="git-branch"></i>
                            <span>API</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                        <a href="{{ route('admin.databases') }}">
                            <i data-feather="database"></i>
                            <span>Databases</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                        <a href="{{ route('admin.locations') }}">
                            <i data-feather="navigation"></i>
                            <span>Locations</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                        <a href="{{ route('admin.nodes') }}">
                            <i data-feather="layers"></i>
                            <span>Nodes</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                        <a href="{{ route('admin.servers') }}">
                            <i data-feather="server"></i>
                            <span>Servers</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                        <a href="{{ route('admin.users') }}">
                            <i data-feather="users"></i>
                            <span>Users</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                        <a href="{{ route('admin.mounts') }}">
                            <i data-feather="hard-drive"></i>
                            <span>Mounts</span>
                        </a>
                    </li>
                    <li class="{{ !starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                        <a href="{{ route('admin.nests') }}">
                            <i data-feather="archive"></i>
                            <span>Nests</span>
                        </a>
                    </li>
                </ul>
            </section>
        </aside>
        <div class="content-wrapper">
            @include('admin.partials.update-notification')
            <section class="content-header">
                @yield('content-header')
            </section>
            <section class="content">
                <div class="row">
                    <div class="col-xs-12">
                        @if (count($errors) > 0)
                            <div class="alert alert-danger">
                                There was an error validating the data provided.<br><br>
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        @foreach (Alert::getMessages() as $type => $messages)
                            @foreach ($messages as $message)
                                <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                    {!! $message !!}
                                </div>
                            @endforeach
                        @endforeach
                    </div>
                </div>
                @yield('content')
            </section>
        </div>
    </div>
    @section('footer-scripts')
    <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
    <script>keyboardeventKeyPolyfill.polyfill();</script>

    {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
    {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
    {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
    <script src="/js/autocomplete.js" type="application/javascript"></script>

    <script>
        feather.replace()
    </script>

    <script>
        // Mobile sidebar toggle functionality
        document.addEventListener('DOMContentLoaded', function () {
            const toggleBtn = document.querySelector('.sidebar-toggle');
            const body = document.body;
            const sidebar = document.querySelector('.main-sidebar');
            const menuLinks = document.querySelectorAll('.sidebar-menu li a');

            // Toggle sidebar on button click
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    body.classList.toggle('sidebar-open');
                });
            }

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function (e) {
                if (window.innerWidth <= 767) {
                    if (!e.target.closest('.main-sidebar') && !e.target.closest('.sidebar-toggle')) {
                        body.classList.remove('sidebar-open');
                    }
                }
            });

            // Close sidebar when clicking a menu item on mobile
            menuLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    if (window.innerWidth <= 767) {
                        setTimeout(function () {
                            body.classList.remove('sidebar-open');
                        }, 200);
                    }
                });
            });

            // Prevent sidebar clicks from closing it
            if (sidebar) {
                sidebar.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            }
        });
    </script>

    @if(Auth::user()->root_admin)
        <script>
            $('#logoutButton').on('click', function (event) {
                event.preventDefault();

                var that = this;
                swal({
                    title: 'Do you want to log out?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d9534f',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Log out'
                }, function () {
                    $.ajax({
                        type: 'POST',
                        url: '{{ route('auth.logout') }}',
                        data: {
                            _token: '{{ csrf_token() }}'
                        }, complete: function () {
                            window.location.href = '{{route('auth.login')}}';
                        }
                    });
                });
            });
        </script>
    @endif

    <script>
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })
    </script>
    @show
</body>

</html>