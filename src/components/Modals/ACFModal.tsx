import { getTheme, IButtonStyles, IIconProps, initializeIcons, Modal } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import { FC } from 'react';
import "../../styles/Modal.css";

initializeIcons();

const theme = getTheme();

interface ACFModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: {
    control: string;
    acfID: string;
    description: string;
    details: string;
  };
}

const ACFModal: FC<ACFModalProps> = ({ isOpen, onClose, rowData }) => {

  if (!rowData) {
    return <></>; // or return a fallback UI
  }

  const { control, acfID, description, details } = rowData;

  const formattedDetails = details
    ? details.replace(/\*/g, '•').replace(/\n/g, '<br>')
    : '';

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

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName={"contentContainer"}>
      <div className={"contentHeader"}>
        <p className={"title"}>Microsoft Cloud Compliance Foundation</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className={"contentBody"}>
        <p className={"firstChild"}><b>{control}</b></p>
        <p><b>Azure Control Framework ID:</b> {acfID}</p>
        <p><b>Description</b> <br /> {description}</p>
        <p><b>Details</b>
          <div dangerouslySetInnerHTML={{ __html: formattedDetails }} />
        </p>
      </div>
    </Modal>
  );
};

export default ACFModal;