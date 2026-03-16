<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style type="text/css" rel="stylesheet" media="all">
        /* Media Queries */
        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
            }
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-text-size-adjust: none;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }
    </style>
</head>

<?php
/* Layout ------------------------------ */
$style = [
    'body' => 'margin: 0; padding: 0; width: 100%; background-color: #09090b; font-family: "Inter", Helvetica, Arial, sans-serif;',
    'email-wrapper' => 'width: 100%; margin: 0; padding: 50px 0; background-color: #09090b;',

    /* Masthead ----------------------- */
    'email-masthead' => 'padding: 0 0 30px 0; text-align: center;',
    'email-masthead_name' => 'font-size: 24px; font-weight: 800; color: #ffffff; text-decoration: none; letter-spacing: 0.05em;',

    'email-body' => 'width: 100%; margin: 0; padding: 0; background-color: #18181b; border-radius: 16px; border: 1px solid #27272a;',
    'email-body_inner' => 'width: auto; max-width: 570px; margin: 0 auto; padding: 0;',
    'email-body_cell' => 'padding: 40px;',

    'email-footer' => 'width: auto; max-width: 570px; margin: 0 auto; padding: 0; text-align: center;',
    'email-footer_cell' => 'color: #71717a; padding: 30px; text-align: center; font-size: 12px; line-height: 1.5;',

    /* Body ------------------------------ */
    'body_action' => 'width: 100%; margin: 30px auto; padding: 0; text-align: center;',
    'body_sub' => 'margin-top: 25px; padding-top: 25px; border-top: 1px solid #27272a;',

    /* Type ------------------------------ */
    'anchor' => 'color: #3b82f6; text-decoration: none; font-weight: 600;',
    'header-1' => 'margin-top: 0; color: #ffffff; font-size: 22px; font-weight: 700; text-align: left; line-height: 1.3; margin-bottom: 20px;',
    'paragraph' => 'margin-top: 0; color: #d4d4d8; font-size: 15px; line-height: 1.6em; margin-bottom: 20px;',
    'paragraph-sub' => 'margin-top: 0; color: #a1a1aa; font-size: 12px; line-height: 1.5em;',
    'paragraph-center' => 'text-align: center;',

    /* Buttons ------------------------------ */
    'button' => 'display: inline-block; padding: 12px 24px; background-color: #3b82f6; border-radius: 8px; color: #ffffff; font-size: 14px; font-weight: 600; text-align: center; text-decoration: none; transition: all 0.2s;',
    'button--green' => 'background-color: #22c55e;',
    'button--red' => 'background-color: #ef4444;',
    'button--blue' => 'background-color: #3b82f6;',
];
?>

<body style="{{ $style['body'] }}">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td style="{{ $style['email-wrapper'] }}" align="center">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <!-- Logo -->
                    <tr>
                        <td style="{{ $style['email-masthead'] }}">
                            <a href="{{ url('/') }}" target="_blank" style="text-decoration: none;">
                                @if(config('app.logo'))
                                    <img src="{{ config('app.logo') }}" alt="{{ config('app.name') }}"
                                        style="height: 48px; width: auto; display: block; margin: 0 auto; opacity: 0.9;">
                                @else
                                    <span style="{{ $style['email-masthead_name'] }}">{{ config('app.name') }}</span>
                                @endif
                            </a>
                        </td>
                    </tr>

                    <!-- Email Body -->
                    <tr>
                        <td align="center">
                            <table style="{{ $style['email-body'] }}" width="570" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="{{ $style['email-body_cell'] }}">
                                        <!-- Greeting -->
                                        <h1 style="{{ $style['header-1'] }}">
                                            @if (!empty($greeting))
                                                {{ $greeting }}
                                            @else
                                                @if ($level == 'error')
                                                    Whoops!
                                                @else
                                                    Greetings,
                                                @endif
                                            @endif
                                        </h1>

                                        <!-- Intro -->
                                        @foreach ($introLines as $line)
                                            <p style="{{ $style['paragraph'] }}">
                                                {!! $line !!}
                                            </p>
                                        @endforeach

                                        <!-- Action Button -->
                                        @if (isset($actionText))
                                                                                <table style="{{ $style['body_action'] }}" align="center" width="100%"
                                                                                    cellpadding="0" cellspacing="0">
                                                                                    <tr>
                                                                                        <td align="center">
                                                                                            <?php
                                            switch ($level) {
                                                case 'success':
                                                    $actionColor = 'button--green';
                                                    break;
                                                case 'error':
                                                    $actionColor = 'button--red';
                                                    break;
                                                default:
                                                    $actionColor = 'button--blue';
                                                    break;
                                            }
                                                                                                                                        ?>

                                                                                            <a href="{{ $actionUrl }}"
                                                                                                style="{{ $style['button'] }} {{ $style[$actionColor] }}"
                                                                                                class="button" target="_blank">
                                                                                                {{ $actionText }}
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                        @endif

                                        <!-- Outro -->
                                        @foreach ($outroLines as $line)
                                            <p style="{{ $style['paragraph'] }}">
                                                {{ $line }}
                                            </p>
                                        @endforeach

                                        <!-- Salutation -->
                                        <div
                                            style="margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 30px;">
                                            <p
                                                style="{{ $style['paragraph'] }}; font-style: italic; font-size: 14px; color: #737373;">
                                                Best regards,<br>
                                                <strong>{{ config('app.name') }} Team</strong>
                                            </p>
                                        </div>

                                        <!-- Sub Copy -->
                                        @if (isset($actionText))
                                            <table style="{{ $style['body_sub'] }}">
                                                <tr>
                                                    <td>
                                                        <p style="{{ $style['paragraph-sub'] }}">
                                                            If you’re having trouble clicking the "{{ $actionText }}"
                                                            button,
                                                            copy and paste the link below into your web browser:
                                                        </p>

                                                        <p style="{{ $style['paragraph-sub'] }}; margin-top: 10px;">
                                                            <a style="{{ $style['anchor'] }}" href="{{ $actionUrl }}"
                                                                target="_blank">
                                                                {{ $actionUrl }}
                                                            </a>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td>
                            <table style="{{ $style['email-footer'] }}" align="center" width="570" cellpadding="0"
                                cellspacing="0">
                                <tr>
                                    <td style="{{ $style['email-footer_cell'] }}">
                                        <p style="{{ $style['paragraph-sub'] }}">
                                            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
                                            <br>
                                            You can manage your notification preferences in your account settings.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>