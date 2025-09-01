import React, { useEffect, useRef, useState } from 'react';

interface ThreeDSHelperProps {
  html: string;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

const ThreeDSHelper: React.FC<ThreeDSHelperProps> = ({
  html,
  onComplete,
  onError,
  onClose
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!html) return;

    try {
      // Decode HTML content
      const decodedHtml = decodeURIComponent(html);

      // Create a form element to submit the 3DS data
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = decodedHtml;

      const form = tempDiv.querySelector('form') as HTMLFormElement;
      if (!form) {
        setHasError(true);
        onError('No form found in 3DS HTML content');
        return;
      }

      // Set form target to our iframe
      form.target = '3ds-iframe';
      form.method = 'POST';

      // Add the form to our container
      if (formRef.current) {
        formRef.current.innerHTML = '';
        formRef.current.appendChild(form);
      }

      // Submit the form automatically
      setTimeout(() => {
        form.submit();
        setIsLoading(false);
      }, 500);

    } catch (error) {
      setHasError(true);
      onError('Failed to process 3DS HTML content: ' + (error as Error).message);
    }
  }, [html, onComplete, onError]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === '3DS_COMPLETE') {
        onComplete(event.data);
      } else if (event.data.type === '3DS_ERROR') {
        onError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete, onError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setHasError(true);
    onError('Failed to load 3DS iframe');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Güvenli Ödeme Doğrulama
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">3D Secure doğrulama hazırlanıyor...</span>
            </div>
          )}

          {hasError && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">3D Secure doğrulama başarısız</p>
              <p className="text-gray-600 text-sm mt-1">Lütfen sayfayı yenileyip tekrar deneyin</p>
            </div>
          )}

          {!hasError && (
            <div className="three-ds-container">
              <div ref={formRef} style={{ display: 'none' }} />
              <iframe
                ref={iframeRef}
                name="3ds-iframe"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  width: '100%',
                  height: '400px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: isLoading ? 'none' : 'block'
                }}
                title="3D Secure Payment Verification"
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
          <p className="text-sm text-gray-600">
            Bankanızın 3D Secure sayfasında işlem yapmanız gerekiyor.
            İşlem tamamlandıktan sonra otomatik olarak yönlendirileceksiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSHelper;
