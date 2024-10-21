import {
  getTheme,
  IButtonStyles,
  IIconProps,
  initializeIcons,
  Link,
  Modal,
} from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import { FC } from 'react';

import "../../styles/Modal.css";

initializeIcons();

const theme = getTheme();

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: {
    control: string;
    mcsbID: string;
    service: string;
    policy: string;
    description: string;
    policyID: string;
  };
}

const makeLink = (text: string) => (
  <Link
    href={`https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F${text}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    See docs
  </Link>
);

const iconProps: IIconProps = { iconName: 'Cancel' };

const iconButtonStyles: IButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const PoliciesModal: FC<PoliciesModalProps> = ({ isOpen, onClose, rowData }) => {
  const { control, mcsbID, service, policy, description, policyID } = rowData;
  const referenceElement = makeLink(policyID);

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName="contentContainer">
      <div className="contentHeader">
        <p className="title">Compliance Policies by Service</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className="contentBody">
        <p className="firstChild"><b>{control}</b></p>
        <p><b>Microsoft Cloud Security Benchmark ID:</b> {mcsbID}</p>
        <p><b>Service:</b> {service}</p>
        <p><b>Policy Name</b> <br /> {policy}</p>
        <p><b>Policy Description</b> <br />{description}</p>
        <p><b>Reference</b><br />{referenceElement}</p>
      </div>
    </Modal>
  );
};

export default PoliciesModal;