import * as React from 'react';
import {
  getTheme,
  Modal,
  initializeIcons,
  Link
} from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import "../../styles/Modal.css";

initializeIcons();

const theme = getTheme();

const makeLink = (text) => {
  return (
    <Link
      href={"https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F" + text} target="_blank" rel="noopener noreferrer"
    >
      See docs
    </Link>
  );
};

const iconProps = { iconName: 'Cancel' };

const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const PoliciesModal = ({ isOpen, onClose, rowData }) => {

  const referenceElement = makeLink(rowData.policyID);

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName={"contentContainer"}>
      <div className={"contentHeader"}>
        <p className={"title"}>Compliance Policies by Service</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className={"contentBody"}>
        <p className={"firstChild"}><b>{rowData.control}</b> </p>
        <p><b>Microsoft Cloud Security Benchmark ID:</b> {rowData.mcsbID}</p>
        <p><b>Service:</b> {rowData.service}</p>
        <p><b>Policy Name</b> <br></br> {rowData.policy}</p>
        <p><b>Policy Description</b> <br></br>{rowData.description}</p>
        <p><b>Reference</b><br></br>{referenceElement}</p>
      </div>
    </Modal >
  );
};

export default PoliciesModal;