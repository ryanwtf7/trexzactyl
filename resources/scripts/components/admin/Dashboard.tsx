import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
    padding: 24px;
    background: #f9fafb;
    min-height: 100vh;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div<{ color: string }>`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-left: 4px solid ${(props) => props.color};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease-out;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const StatIcon = styled.div<{ color: string }>`
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: ${(props) => props.color}15;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    i {
        font-size: 28px;
        color: ${(props) => props.color};
    }
`;

const StatValue = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    line-height: 1;
`;

const StatLabel = styled.div`
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const StatChange = styled.div<{ positive: boolean }>`
    font-size: 0.875rem;
    color: ${(props) => (props.positive ? '#10b981' : '#ef4444')};
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

interface DashboardStats {
    servers: number;
    users: number;
    nodes: number;
    allocations: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        servers: 0,
        users: 0,
        nodes: 0,
        allocations: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch stats from API
        fetch('/admin/statistics.json')
            .then((res) => res.json())
            .then((data) => {
                setStats({
                    servers: data.servers || 0,
                    users: data.users || 0,
                    nodes: data.nodes || 0,
                    allocations: data.allocations || 0,
                });
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const statCards = [
        {
            icon: 'fa-server',
            value: stats.servers,
            label: 'Total Servers',
            color: '#3b82f6',
            change: '+12%',
            positive: true,
        },
        {
            icon: 'fa-users',
            value: stats.users,
            label: 'Total Users',
            color: '#10b981',
            change: '+8%',
            positive: true,
        },
        {
            icon: 'fa-hdd-o',
            value: stats.nodes,
            label: 'Nodes',
            color: '#8b5cf6',
            change: '+3%',
            positive: true,
        },
        {
            icon: 'fa-sitemap',
            value: stats.allocations,
            label: 'Allocations',
            color: '#f59e0b',
            change: '+15%',
            positive: true,
        },
    ];

    if (loading) {
        return (
            <DashboardContainer>
                <div style={{ textAlign: 'center', padding: '48px' }}>
                    <i className='fa fa-spinner fa-spin' style={{ fontSize: '48px', color: '#3b82f6' }}></i>
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading dashboard...</p>
                </div>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <StatsGrid>
                {statCards.map((card, index) => (
                    <StatCard key={index} color={card.color} style={{ animationDelay: `${index * 0.1}s` }}>
                        <StatIcon color={card.color}>
                            <i className={`fa ${card.icon}`}></i>
                        </StatIcon>
                        <StatValue>{card.value.toLocaleString()}</StatValue>
                        <StatLabel>{card.label}</StatLabel>
                        <StatChange positive={card.positive}>
                            <i className={`fa fa-arrow-${card.positive ? 'up' : 'down'}`}></i>
                            {card.change} from last month
                        </StatChange>
                    </StatCard>
                ))}
            </StatsGrid>
        </DashboardContainer>
    );
};

export default AdminDashboard;
