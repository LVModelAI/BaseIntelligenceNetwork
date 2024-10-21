declare module 'react-google-recaptcha' {
    import * as React from 'react';
  
    export interface ReCAPTCHAProps {
      sitekey: string;
      onChange?: (token: string | null) => void;
      onExpired?: () => void;
      onErrored?: () => void;
      theme?: 'dark' | 'light';
      type?: 'image' | 'audio';
      tabindex?: number;
      stoken?: string;
      size?: 'compact' | 'normal' | 'invisible';
      badge?: 'bottomright' | 'bottomleft' | 'inline';
    }
  
    export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {}
  }
  