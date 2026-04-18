import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePuterStore } from '../store/puterStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isReady } = usePuterStore();
    const location = useLocation();

    if (!isReady) {
        return null; // The RootComponent handles the loading spinner
    }

    if (!isAuthenticated) {
        const currentUrl = location.pathname + location.search;
        const encodedUrl = encodeURIComponent(currentUrl);
        return <Navigate to={`/auth?next=${encodedUrl}`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
