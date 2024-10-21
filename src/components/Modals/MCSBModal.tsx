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

interface MCSBModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: {
    control: string;
    mcsbID: string;
    service: string;
    actions: string;
    supported: string;
    description: string;
    guidance: string;
    reference: string;
  };
}

const makeLink = (text: string) => {
  return (
    <Link
      href={text} target="_blank" rel="noopener noreferrer"
    >
      See docs
    </Link>
  );
};

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

const MCSBModal: FC<MCSBModalProps> = ({ isOpen, onClose, rowData }) => {
  const { control, mcsbID, service, actions, supported, description, guidance, reference } = rowData;

  let referenceElement;

  if (reference === "Not Applicable") {
    referenceElement = <span>N/A</span>;
  } else {
    referenceElement = makeLink(reference);
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false} containerClassName={"contentContainer"}>
      <div className={"contentHeader"}>
        <p className={"title"}>Compliance Features by Service</p>
        <IconButton iconProps={iconProps} ariaLabel="Close" onClick={onClose} styles={iconButtonStyles} />
      </div>
      <div className={"contentBody"}>
        <p className={"firstChild"}><b>{control}</b></p>
        <p><b>Microsoft Cloud Security Benchmark ID:</b> {mcsbID}</p>
        <p><b>Service:</b> {service}</p>
        <p><b>MCSB Feature:</b> {actions}</p>
        <p><b>Feature Supported:</b> {supported}</p>
        <p><b>Feature Description</b> <br />{description}</p>
        <p><b>Feature Guidance</b> <br />{guidance}</p>
        <p><b>Feature Reference</b> <br /> {referenceElement}</p>
      </div>
    </Modal>
  );
};

export default MCSBModal;