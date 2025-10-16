import React from 'react';

const ScrollArea = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`overflow-x-auto ${className}`}>
        {children}
    </div>
);

export { ScrollArea };