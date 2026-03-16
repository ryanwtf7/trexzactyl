import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import { format, formatDistanceToNow } from 'date-fns';
import { getTickets, Ticket } from '@/api/account/tickets';
import PageContentBlock from '@/components/elements/PageContentBlock';
import NewTicketDialog from '@/components/tickets/forms/NewTicketDialog';

export default () => {
    const [visible, setVisible] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>();

    useEffect(() => {
        getTickets().then((d) => setTickets(d));
    }, []);

    if (!tickets) return <Spinner centered />;

    return (
        <PageContentBlock
            title={'Support Tickets'}
            description={'Need assistance? Create or manage your support tickets here.'}
            showFlashKey={'tickets'}
        >
            <NewTicketDialog open={visible} onClose={() => setVisible(false)} />
            <div className={'my-10 space-y-4'}>
                {tickets.map((ticket) => (
                    <Link to={`/tickets/${ticket.id}`} key={ticket.id} className={'block'}>
                        <div
                            css={tw`flex items-center p-6 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl transition-all duration-200 hover:border-blue-500 border-opacity-50 hover:bg-neutral-900 bg-opacity-80`}
                        >
                            <div className={'flex items-center min-w-0 flex-1'}>
                                <div
                                    css={tw`flex-none w-12 h-12 rounded-sm bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 flex items-center justify-center mr-6`}
                                >
                                    <p css={tw`text-blue-400 font-black text-lg`}>#{ticket.id}</p>
                                </div>
                                <div className={'flex flex-col min-w-0 truncate'}>
                                    <div className={'flex items-center mb-1'}>
                                        <p css={tw`text-neutral-100 font-bold truncate mr-4`}>{ticket.title}</p>
                                        <span
                                            css={tw`text-xs font-bold py-1 px-2.5 bg-neutral-900 bg-opacity-40 backdrop-blur-xl text-neutral-400 rounded-sm border border-neutral-700`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p css={tw`text-xs text-neutral-500 font-medium truncate opacity-60`}>
                                        {ticket.content}
                                    </p>
                                </div>
                            </div>
                            {ticket.createdAt && (
                                <div css={tw`hidden md:block flex-none w-48 ml-8 text-right`}>
                                    <p css={tw`text-xs font-bold text-neutral-300`}>
                                        {format(ticket.createdAt, 'MMM do, yyyy')}
                                    </p>
                                    <p css={tw`text-xs text-neutral-500 font-bold mt-1 opacity-50`}>
                                        {formatDistanceToNow(ticket.createdAt, {
                                            includeSeconds: true,
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            )}
                            <div css={tw`ml-8 text-neutral-500`}>
                                <MoreHorizontal size={20} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className={'w-full flex justify-end mt-2'}>
                <Button
                    onClick={() => setVisible(true)}
                    css={tw`bg-blue-600 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-30 hover:bg-blue-600 bg-opacity-20 hover:border-blue-500 border-opacity-60 font-bold text-sm px-6 py-2.5 rounded-sm transition-all`}
                >
                    Create New Ticket
                </Button>
            </div>
        </PageContentBlock>
    );
};
