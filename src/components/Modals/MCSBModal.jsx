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
      href={text} target="_blank" rel="noopener noreferrer"
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

const MCSBModal = ({ isOpen, onClose, rowData }) => {

  let referenceElement;

  if (rowData.reference === "Not Applicable") {
    referenceElement = <span>N/A</span>;
  } else {
    referenceElement = makeLink(rowData.reference);
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName={"contentContainer"}>
      <div className={"contentHeader"}>
        <p className={"title"}>Compliance Features by Service</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className={"contentBody"}>
        <p className={"firstChild"}><b>{rowData.control}</b></p>
        <p><b>Microsoft Cloud Security Benchmark ID:</b> {rowData.mcsbID}</p>
        <p><b>Service:</b> {rowData.service}</p>
        <p><b>MCSB Feature:</b> {rowData.actions}</p>
        <p><b>Feature Supported:</b> {rowData.supported}</p>
        <p><b>Feature Description</b> <br></br>{rowData.description}</p>
        <p><b>Feature Guidance</b> <br></br>{rowData.guidance}</p>
        <p><b>Feature Reference</b> <br></br> {referenceElement}</p>
      </div>
    </Modal>
  );
};

export default MCSBModal;