import React, { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  action,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="py-10 md:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-gray-200 dark:border-slate-800 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {action && (
              <div className="flex-shrink-0 flex items-center">
                {action}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
