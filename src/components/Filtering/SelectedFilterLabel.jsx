import React from 'react';
import { FontIcon, mergeStyleSets } from '@fluentui/react';

const SelectedFilterLabel = (props) => {
  const { text, filterType, onRemoveFilter } = props;

  const removeFilter = () => {
    onRemoveFilter(text, filterType);
  };

  const styles = mergeStyleSets({
    labelContainer: {
      display: 'inline-block',
      backgroundColor: '#EDEBE9',
      padding: '3px',
      borderRadius: 3,
      fontFamily: 'SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      textAlign: 'left',
      marginLeft: '12px',
      marginTop: '13px',
      whiteSpace: 'nowrap',
    },
    spanStyle: {
      marginLeft: '4px',
      marginRight: '4px',
    },
  });

  const iconClass = mergeStyleSets({
    fontSize: '10px',
    cursor: 'pointer',
    marginLeft: '5px',
  });

  return (
    <div className={styles.labelContainer}>
      <span className={styles.spanStyle}>{text}</span>
      <span className={styles.spanStyle}>
        <FontIcon style={iconClass} iconName="Cancel" onClick={removeFilter} aria-label="Cancel"/>
      </span>
    </div>
  );
};

export default SelectedFilterLabel;