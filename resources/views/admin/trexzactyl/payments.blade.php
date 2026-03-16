@extends('layouts.admin')
@include('partials.admin.trexzactyl.nav', ['activeTab' => 'payments'])

@section('title')
    Payment Management
@endsection

@section('content-header')
    <h1>Payment Management<small>Manage manual payments and their statuses.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Trexzactyl</li>
    </ol>
@endsection

@section('content')
    @yield('trexzactyl::nav')
    
    <!-- Statistics Cards -->
    <div class="row">
        <div class="col-lg-2 col-xs-6">
            <div class="small-box bg-yellow">
                <div class="inner">
                    <h3>{{ $stats['pending'] }}</h3>
                    <p>Pending</p>
                </div>
                <div class="icon">
                    <i class="fa fa-clock-o"></i>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-xs-6">
            <div class="small-box bg-blue">
                <div class="inner">
                    <h3>{{ $stats['processing'] }}</h3>
                    <p>Processing</p>
                </div>
                <div class="icon">
                    <i class="fa fa-spinner"></i>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-xs-6">
            <div class="small-box bg-green">
                <div class="inner">
                    <h3>{{ $stats['approved'] }}</h3>
                    <p>Approved</p>
                </div>
                <div class="icon">
                    <i class="fa fa-check"></i>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-xs-6">
            <div class="small-box bg-red">
                <div class="inner">
                    <h3>{{ $stats['rejected'] }}</h3>
                    <p>Rejected</p>
                </div>
                <div class="icon">
                    <i class="fa fa-times"></i>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-xs-6">
            <div class="small-box bg-gray">
                <div class="inner">
                    <h3>{{ $stats['total'] }}</h3>
                    <p>Total</p>
                </div>
                <div class="icon">
                    <i class="fa fa-list"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Filters</h3>
                </div>
                <div class="box-body">
                    <form method="GET" class="form-inline">
                        <div class="form-group">
                            <label for="status">Status:</label>
                            <select name="status" id="status" class="form-control">
                                <option value="all" {{ $currentStatus === 'all' ? 'selected' : '' }}>All</option>
                                <option value="pending" {{ $currentStatus === 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="processing" {{ $currentStatus === 'processing' ? 'selected' : '' }}>Processing</option>
                                <option value="approved" {{ $currentStatus === 'approved' ? 'selected' : '' }}>Approved</option>
                                <option value="rejected" {{ $currentStatus === 'rejected' ? 'selected' : '' }}>Rejected</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="currency">Payment Method:</label>
                            <select name="currency" id="currency" class="form-control">
                                <option value="">All</option>
                                <option value="bkash" {{ $currentCurrency === 'bkash' ? 'selected' : '' }}>bKash</option>
                                <option value="nagad" {{ $currentCurrency === 'nagad' ? 'selected' : '' }}>Nagad</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Filter</button>
                        <a href="{{ route('admin.trexzactyl.payments') }}" class="btn btn-default">Reset</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Payments Table -->
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Payments ({{ ucfirst($currentStatus) }})</h3>
                    <div class="box-tools pull-right">
                        @if($payments->count() > 0)
                            <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#bulkActionModal">
                                Bulk Actions
                            </button>
                        @endif
                    </div>
                </div>
                <div class="box-body">
                    @if($payments->count() > 0)
                        <form id="bulkForm">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" id="selectAll"></th>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Sender</th>
                                            <th>Transaction ID</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($payments as $payment)
                                            <tr>
                                                <td><input type="checkbox" name="payment_ids[]" value="{{ $payment->id }}" class="payment-checkbox"></td>
                                                <td>{{ $payment->id }}</td>
                                                <td>
                                                    <a href="{{ route('admin.users.view', $payment->user->id) }}">
                                                        {{ $payment->user->username }}
                                                    </a>
                                                </td>
                                                <td>{{ number_format($payment->amount) }} BDT</td>
                                                <td>
                                                    <span class="label label-info">
                                                        {{ $payment->payment_method === 'bkash' ? 'bKash' : ucfirst($payment->payment_method) }}
                                                    </span>
                                                </td>
                                                <td>{{ $payment->sender_number }}</td>
                                                <td><code>{{ $payment->transaction_id }}</code></td>
                                                <td>
                                                    @switch($payment->status)
                                                        @case('pending')
                                                            <span class="label label-warning">Pending</span>
                                                            @break
                                                        @case('processing')
                                                            <span class="label label-info">Processing</span>
                                                            @break
                                                        @case('approved')
                                                            <span class="label label-success">Approved</span>
                                                            @break
                                                        @case('rejected')
                                                            <span class="label label-danger">Rejected</span>
                                                            @break
                                                    @endswitch
                                                </td>
                                                <td>{{ $payment->created_at->format('d M Y H:i') }}</td>
                                                <td>
                                                    <div class="btn-group">
                                                        @if($payment->status === 'pending')
                                                            <form action="{{ route('admin.trexzactyl.payments.processing', $payment->id) }}" method="POST" style="display: inline;">
                                                                @csrf
                                                                <button type="submit" class="btn btn-xs btn-info" title="Set to Processing">
                                                                    <i class="fa fa-spinner"></i>
                                                                </button>
                                                            </form>
                                                        @endif
                                                        
                                                        @if(in_array($payment->status, ['pending', 'processing']))
                                                            <form action="{{ route('admin.trexzactyl.payments.approve', $payment->id) }}" method="POST" style="display: inline;">
                                                                @csrf
                                                                <button type="submit" class="btn btn-xs btn-success" title="Approve">
                                                                    <i class="fa fa-check"></i>
                                                                </button>
                                                            </form>
                                                            <button type="button" class="btn btn-xs btn-danger" title="Reject" 
                                                                    onclick="showRejectModal({{ $payment->id }})">
                                                                <i class="fa fa-times"></i>
                                                            </button>
                                                        @endif
                                                        
                                                        @if($payment->status === 'rejected' && $payment->rejection_reason)
                                                            <button type="button" class="btn btn-xs btn-default" title="View Reason" 
                                                                    onclick="showReasonModal('{{ addslashes($payment->rejection_reason) }}')">
                                                                <i class="fa fa-eye"></i>
                                                            </button>
                                                        @endif
                                                    </div>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </form>
                        
                        <!-- Pagination -->
                        <div class="text-center">
                            {{ $payments->appends(request()->query())->links() }}
                        </div>
                    @else
                        <div class="text-center">
                            <p>No payments found for the selected criteria.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Bulk Action Modal -->
    <div class="modal fade" id="bulkActionModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Bulk Actions</h4>
                </div>
                <form action="{{ route('admin.trexzactyl.payments.bulk') }}" method="POST" id="bulkActionForm">
                    @csrf
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="bulkAction">Action:</label>
                            <select name="action" id="bulkAction" class="form-control" required>
                                <option value="">Select Action</option>
                                <option value="processing">Set to Processing</option>
                                <option value="approve">Approve</option>
                                <option value="reject">Reject</option>
                            </select>
                        </div>
                        <div id="selectedCount" class="alert alert-info">
                            No payments selected
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Execute</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Reject Modal -->
    <div class="modal fade" id="rejectModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Reject Payment</h4>
                </div>
                <form id="rejectForm" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="reason">Rejection Reason:</label>
                            <textarea name="reason" id="reason" class="form-control" rows="4" 
                                      placeholder="Please provide a detailed reason for rejection..." required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-danger">Reject Payment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Reason Modal -->
    <div class="modal fade" id="reasonModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Rejection Reason</h4>
                </div>
                <div class="modal-body">
                    <p id="reasonText"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        // Select all functionality
        $('#selectAll').change(function() {
            $('.payment-checkbox').prop('checked', this.checked);
            updateSelectedCount();
        });

        $('.payment-checkbox').change(function() {
            updateSelectedCount();
        });

        function updateSelectedCount() {
            const selected = $('.payment-checkbox:checked').length;
            $('#selectedCount').text(selected + ' payment(s) selected');
        }

        // Bulk action form submission
        $('#bulkActionForm').submit(function(e) {
            const selectedIds = $('.payment-checkbox:checked').map(function() {
                return this.value;
            }).get();

            if (selectedIds.length === 0) {
                e.preventDefault();
                alert('Please select at least one payment.');
                return;
            }

            // Add selected IDs to form
            selectedIds.forEach(function(id) {
                $('<input>').attr({
                    type: 'hidden',
                    name: 'payment_ids[]',
                    value: id
                }).appendTo('#bulkActionForm');
            });
        });

        // Reject modal
        function showRejectModal(paymentId) {
            $('#rejectForm').attr('action', '{{ route("admin.trexzactyl.payments.reject", ":id") }}'.replace(':id', paymentId));
            $('#rejectModal').modal('show');
        }

        // Reason modal
        function showReasonModal(reason) {
            $('#reasonText').text(reason);
            $('#reasonModal').modal('show');
        }
    </script>
@endsection