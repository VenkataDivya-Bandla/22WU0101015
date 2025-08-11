import React from 'react';

const RedirectionValidator = () => {
  // Validate shortcode format
  const validateShortcode = (shortcode) => {
    if (!shortcode || typeof shortcode !== 'string') {
      return { isValid: false, error: 'invalid' };
    }

    // Check if shortcode matches expected pattern (alphanumeric, 4-8 characters)
    const shortcodePattern = /^[a-zA-Z0-9]{4,8}$/;
    if (!shortcodePattern?.test(shortcode)) {
      return { isValid: false, error: 'invalid' };
    }

    return { isValid: true, error: null };
  };

  // Check if URL mapping exists and is valid
  const validateMapping = (shortcode) => {
    try {
      const urlMappings = JSON.parse(localStorage.getItem('linkshort_urls') || '[]');
      const mapping = urlMappings?.find(item => item?.shortcode === shortcode);

      if (!mapping) {
        return { isValid: false, error: 'notFound', mapping: null };
      }

      // Check if URL has expired
      if (mapping?.expiresAt) {
        const expirationTime = new Date(mapping.expiresAt);
        const currentTime = new Date();
        
        if (currentTime > expirationTime) {
          return { isValid: false, error: 'expired', mapping };
        }
      }

      // Validate original URL format
      try {
        new URL(mapping.originalUrl);
      } catch {
        return { isValid: false, error: 'invalid', mapping };
      }

      return { isValid: true, error: null, mapping };
    } catch (error) {
      return { isValid: false, error: 'networkError', mapping: null };
    }
  };

  // Main validation function
  const validateRedirection = (shortcode) => {
    // First validate shortcode format
    const shortcodeValidation = validateShortcode(shortcode);
    if (!shortcodeValidation?.isValid) {
      return shortcodeValidation;
    }

    // Then validate mapping existence and expiration
    return validateMapping(shortcode);
  };

  return { validateRedirection };
};

export default RedirectionValidator;