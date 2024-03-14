import React from 'react';
import FilterBadges from './FilterBadges';
import { ActionButton } from '@fluentui/react';

const CustomSeparator = () => (
  <span style={{ fontSize: '18px', paddingLeft: '10px', paddingTop: '27px', color: '#9C9C9C' }}>|</span>
);

const FilterBadgesContainer = (props) => {
  const { selectedServices, selectedControls, removeFilter, handleClear } = props;

  const sortSelectedItems = (selectedItems) => {
    return selectedItems.slice().sort((a, b) => {
      const firstCharA = a.charAt(0).toLowerCase();
      const firstCharB = b.charAt(0).toLowerCase();
      return firstCharA.localeCompare(firstCharB);
    });
  };

  const sortedSelectedServices = sortSelectedItems(selectedServices);
  const sortedSelectedControls = sortSelectedItems(selectedControls).slice(1);

  return (
    <>
      {(sortedSelectedControls.length > 0 || sortedSelectedServices.length > 0) && (
        <>
          <p style={{
            display: 'inline-block',
            padding: '3px',
            borderRadius: 3,
            fontFamily: 'SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '20px',
            textAlign: 'left',
            marginTop: '25px',
            whiteSpace: 'nowrap',
          }}>Filtered by:</p>
          <FilterBadges
            filterItems={sortedSelectedServices}
            filterType="service"
            onRemoveFilter={removeFilter}
          />
          {sortedSelectedControls.length > 0 && sortedSelectedServices.length > 0 && (
            <CustomSeparator />
          )}
          <FilterBadges
            filterItems={sortedSelectedControls}
            filterType="control"
            onRemoveFilter={removeFilter}
          />
          <CustomSeparator />
          <ActionButton onClick={handleClear} className="clear-button"
            style={{
              display: 'inline-block',
              padding: '3px',
              borderRadius: 3,
              fontFamily: 'SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '20px',
              textAlign: 'left',
              marginTop: '20px',
              whiteSpace: 'nowrap',
            }}>
            Clear all filters
          </ActionButton>
        </>
      )}
    </>
  );
};

export default FilterBadgesContainer;