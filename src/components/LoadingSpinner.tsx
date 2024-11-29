import React from "react";

export const LoadingSpinner = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div
      data-testid="loading-spinner"
      className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
    />
  </div>
));
