import React from 'react';
import SelectedFilterLabel from './SelectedFilterLabel.jsx';

const FilterBadges = ({ filterItems, filterType, onRemoveFilter }) => {
  if (filterItems.length === 0) {
    return <></>;
  }

  return (
    <>
      {filterItems.map((filterItem, index) => (
        <SelectedFilterLabel
          key={index}
          text={filterItem}
          filterType={filterType}
          onRemoveFilter={onRemoveFilter}
        />
      ))}
    </>
  );
};

export default FilterBadges;