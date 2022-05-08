import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('[Button] component', () => {
  it('should be present on web page', () => {
    render(<Button />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
