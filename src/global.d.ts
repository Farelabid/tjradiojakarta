declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare global {
  interface Window {
    gtag?: (
      event: 'config' | 'event' | 'js',
      action: string | Date,
      params?: { [key: string]: any }
    ) => void;
    dataLayer?: any[];
  }
}