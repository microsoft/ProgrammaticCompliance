import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ACFModal from './ACFModal';

describe('ACFModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    rowData: {
      control: 'Control 1',
      acfID: 'ACF123',
      description: 'This is a description.',
      details: 'These are the details.\n* Item 1\n* Item 2',
    },
  };

  it('renders without crashing', () => {
    render(<ACFModal {...mockProps} />);
  });

  it('displays the correct title', () => {
    render(<ACFModal {...mockProps} />);
    expect(screen.getByText('Microsoft Cloud Compliance Foundation')).toBeInTheDocument();
  });

  it('displays the correct control information', () => {
    render(<ACFModal {...mockProps} />);
    expect(screen.getByText('Control 1')).toBeInTheDocument();
    expect(screen.getByText('Azure Control Framework ID:')).toBeInTheDocument();
    expect(screen.getByText('ACF123')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
  });

  it('formats the details correctly', () => {
    render(<ACFModal {...mockProps} />);
    const detailsElement = screen.getByText((content, element) => {
      return element?.tagName === 'DIV' && content.includes('• Item 1');
    });
    expect(detailsElement).toBeInTheDocument();
    expect(detailsElement.tagName).toBe('DIV');
  });

  it('calls onClose when the close button is clicked', () => {
    render(<ACFModal {...mockProps} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<ACFModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Microsoft Cloud Compliance Foundation')).not.toBeInTheDocument();
  });
});