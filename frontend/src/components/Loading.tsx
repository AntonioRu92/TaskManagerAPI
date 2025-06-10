import React from 'react';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'medium',
    text = 'Loading...',
    fullScreen = false
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'h-4 w-4';
            case 'medium':
                return 'h-8 w-8';
            case 'large':
                return 'h-12 w-12';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'small':
                return 'text-sm';
            case 'medium':
                return 'text-base';
            case 'large':
                return 'text-lg';
        }
    };

    const content = (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`${getSizeClasses()} animate-spin`}>
                <svg
                    className="w-full h-full text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>
            {text && (
                <p className={`${getTextSize()} text-gray-600 font-medium`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {content}
        </div>
    );
};

export default Loading;
