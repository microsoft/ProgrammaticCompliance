import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PoliciesModal from './PoliciesModal';

describe('PoliciesModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    rowData: {
      control: 'Control 1',
      mcsbID: 'MCSB123',
      service: 'Service 1',
      policy: 'Policy 1',
      description: 'This is a description.',
      policyID: 'Policy123',
    },
  };

  it('renders without crashing', () => {
    render(<PoliciesModal {...mockProps} />);
  });

  it('displays the correct title', () => {
    render(<PoliciesModal {...mockProps} />);
    expect(screen.getByText('Compliance Policies by Service')).toBeInTheDocument();
  });

  it('displays the correct control information', () => {
    render(<PoliciesModal {...mockProps} />);
    expect(screen.getByText('Control 1')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Cloud Security Benchmark ID:')).toBeInTheDocument();
    expect(screen.getByText('MCSB123')).toBeInTheDocument();
    expect(screen.getByText('Service:')).toBeInTheDocument();
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Policy Name')).toBeInTheDocument();
    expect(screen.getByText('Policy 1')).toBeInTheDocument();
    expect(screen.getByText('Policy Description')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
  });

  it('displays the correct reference link', () => {
    render(<PoliciesModal {...mockProps} />);
    const referenceLink = screen.getByText('See docs');
    expect(referenceLink).toBeInTheDocument();
    expect(referenceLink).toHaveAttribute('href', 'https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2FPolicy123');
  });

  it('calls onClose when the close button is clicked', () => {
    render(<PoliciesModal {...mockProps} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<PoliciesModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Compliance Policies by Service')).not.toBeInTheDocument();
  });
});