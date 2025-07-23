import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface DynamicData {
  userStats: {
    totalReturns: number;
    completedReturns: number;
    draftReturns: number;
    lastActivity: string;
  };
  systemStats: {
    totalUsers: number;
    activeReturns: number;
    supportTickets: number;
    completionRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'return' | 'document' | 'submission';
    description: string;
    timestamp: Date;
    user?: string;
  }>;
}

export const useDynamicData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DynamicData>({
    userStats: {
      totalReturns: 0,
      completedReturns: 0,
      draftReturns: 0,
      lastActivity: 'Never'
    },
    systemStats: {
      totalUsers: 0,
      activeReturns: 0,
      supportTickets: 0,
      completionRate: 0
    },
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dynamic data based on user role
      const currentDate = new Date();
      const dynamicData: DynamicData = {
        userStats: {
          totalReturns: Math.floor(Math.random() * 50) + 1,
          completedReturns: Math.floor(Math.random() * 30) + 1,
          draftReturns: Math.floor(Math.random() * 10) + 1,
          lastActivity: new Date(currentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        systemStats: {
          totalUsers: user?.role === 'admin' ? 2417 + Math.floor(Math.random() * 100) : 0,
          activeReturns: user?.role === 'admin' ? 1892 + Math.floor(Math.random() * 50) : 0,
          supportTickets: user?.role === 'admin' || user?.role === 'support' ? 14 + Math.floor(Math.random() * 10) : 0,
          completionRate: 78.3 + Math.random() * 10
        },
        recentActivity: generateRecentActivity(user?.role)
      };
      
      setData(dynamicData);
      setLoading(false);
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return { data, loading, refresh: () => setLoading(true) };
};

function generateRecentActivity(role?: string): DynamicData['recentActivity'] {
  const activities = [
    { type: 'return' as const, description: 'Started 2023 Tax Return', user: 'John Doe' },
    { type: 'document' as const, description: 'Uploaded W-2 from Acme Inc.', user: 'Jane Smith' },
    { type: 'submission' as const, description: 'Submitted federal tax return', user: 'Mike Johnson' },
    { type: 'return' as const, description: 'Completed deductions section', user: 'Sarah Wilson' },
    { type: 'document' as const, description: 'Uploaded 1099-INT document', user: 'David Brown' }
  ];

  return activities
    .map((activity, index) => ({
      id: `activity-${index}`,
      ...activity,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      user: role === 'admin' || role === 'support' ? activity.user : undefined
    }))
    .slice(0, Math.floor(Math.random() * 5) + 3);
}