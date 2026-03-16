<?php

namespace Trexzactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Trexzactyl\Models\Ticket;
use Illuminate\View\Factory;
use Trexzactyl\Models\TicketMessage;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Http\Requests\Admin\Tickets\TicketStatusRequest;
use Trexzactyl\Http\Requests\Admin\Tickets\TicketToggleRequest;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Admin\Tickets\TicketMessageRequest;
use Trexzactyl\Services\Tickets\DiscordWebhookService;

class TicketsController extends Controller
{
    public function __construct(
        protected Factory $view,
        protected AlertsMessageBag $alert,
        protected SettingsRepositoryInterface $settings,
        protected DiscordWebhookService $webhookService
    ) {
    }

    /**
     * List the available tickets.
     */
    public function index(): View
    {
        return $this->view->make('admin.tickets.index', [
            'tickets' => Ticket::all(),
            'enabled' => $this->settings->get('Trexzactyl::tickets:enabled', false),
            'max' => $this->settings->get('Trexzactyl::tickets:max', 3),
            'webhook' => $this->settings->get('Trexzactyl::tickets:webhook', ''),
        ]);
    }

    /**
     * View a specific ticket.
     */
    public function view(int $id): View
    {
        return $this->view->make('admin.tickets.view', [
            'ticket' => Ticket::findOrFail($id),
            'messages' => TicketMessage::where('ticket_id', $id)->get(),
        ]);
    }

    /**
     * Enable or disable tickets on the system.
     */
    public function toggle(TicketToggleRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('Trexzactyl::tickets:' . $key, $value);
        }

        return redirect()->route('admin.tickets.index');
    }

    /**
     * Update the status of a ticket.
     */
    public function status(TicketStatusRequest $request, int $id): RedirectResponse
    {
        Ticket::findOrFail($id)->update(['status' => $request->input('status')]);

        TicketMessage::create([
            'user_id' => 0,
            'ticket_id' => $id,
            'content' => 'Ticket status has been set to ' . $request->input('status'),
        ]);

        return redirect()->route('admin.tickets.view', $id);
    }

    /**
     * Add a message to the ticket.
     */
    public function message(TicketMessageRequest $request, int $id): RedirectResponse
    {
        $message = TicketMessage::create([
            'user_id' => $request->user()->id,
            'ticket_id' => $id,
            'content' => $request->input('content'),
        ]);

        $ticket = Ticket::findOrFail($id);
        $ticket->user->notify(new \Trexzactyl\Notifications\TicketReply($ticket, $ticket->user, $message->content));

        $this->webhookService->dispatch(
            'New Staff Reply',
            $message->content,
            $id,
            $request->user()->email
        );

        return redirect()->route('admin.tickets.view', $id);
    }

    /**
     * Deletes a ticket and the associated messages.
     */
    public function delete(int $id): RedirectResponse
    {
        $ticket = Ticket::findOrFail($id);
        $ticketId = $ticket->id;
        $username = $ticket->user->username;
        $user = $ticket->user;

        $ticket->delete();
        TicketMessage::where('ticket_id', $id)->delete();

        $user->notify(new \Trexzactyl\Notifications\TicketDeleted($ticketId, $username));

        $this->alert->success('Ticket ' . $id . ' has been deleted.')->flash();

        return redirect()->route('admin.tickets.index');
    }
}
