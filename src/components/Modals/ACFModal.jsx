import React from 'react';
import { getTheme, Modal, initializeIcons } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import "../../styles/Modal.css";

initializeIcons();

const theme = getTheme();

const ACFModal = ({ isOpen, onClose, rowData }) => {
  const formattedDetails = rowData.details
    ? rowData.details.replace(/\*/g, '•').replace(/\n/g, '<br>')
    : '';

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

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName={"contentContainer"}>
      <div className={"contentHeader"}>
        <p className={"title"}>Microsoft Cloud Compliance Foundation</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className={"contentBody"}>
        <p className={"firstChild"}><b>{rowData.control}</b></p>
        <p><b>Azure Control Framework ID:</b> {rowData.acfID}</p>
        <p><b>Description</b> <br></br> {rowData.description}</p>
        <p><b>Details</b>
          <div dangerouslySetInnerHTML={{ __html: formattedDetails }} />
        </p>
      </div>
    </Modal>
  );
};

export default ACFModal;
