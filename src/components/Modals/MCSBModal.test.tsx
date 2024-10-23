import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MCSBModal from './MCSBModal';

describe('MCSBModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    rowData: {
      control: 'Control 1',
      mcsbID: 'MCSB123',
      service: 'Service 1',
      actions: 'Action 1',
      supported: 'Yes',
      description: 'This is a description.',
      guidance: 'This is guidance.',
      reference: 'https://example.com',
    },
  };

  it('renders without crashing', () => {
    render(<MCSBModal {...mockProps} />);
  });

  it('displays the correct title', () => {
    render(<MCSBModal {...mockProps} />);
    expect(screen.getByText('Compliance Features by Service')).toBeInTheDocument();
  });

  it('displays the correct control information', () => {
    render(<MCSBModal {...mockProps} />);
    expect(screen.getByText('Control 1')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Cloud Security Benchmark ID:')).toBeInTheDocument();
    expect(screen.getByText('MCSB123')).toBeInTheDocument();
    expect(screen.getByText('Service:')).toBeInTheDocument();
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('MCSB Feature:')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Feature Supported:')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Feature Description')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
    expect(screen.getByText('Feature Guidance')).toBeInTheDocument();
    expect(screen.getByText('This is guidance.')).toBeInTheDocument();
  });

  it('displays the correct reference link', () => {
    render(<MCSBModal {...mockProps} />);
    const referenceLink = screen.getByText('See docs');
    expect(referenceLink).toBeInTheDocument();
    expect(referenceLink).toHaveAttribute('href', 'https://example.com');
  });

  it('displays "N/A" when reference is "Not Applicable"', () => {
    render(<MCSBModal {...mockProps} rowData={{ ...mockProps.rowData, reference: 'Not Applicable' }} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<MCSBModal {...mockProps} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<MCSBModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Compliance Features by Service')).not.toBeInTheDocument();
  });
});