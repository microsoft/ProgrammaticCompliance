import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Tests
describe('App Tests', () => {
    it('renders without crashing', () => {
      render(<App />);
    });
});
