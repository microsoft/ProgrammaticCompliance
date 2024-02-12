import React from 'react';
import SelectedFilterLabel from './SelectedFilterLabel.js';

const FilterBadges = ({ filterItems, filterType, onRemoveFilter }) => {
  if (filterItems.length === 0) {
    return <></>;
  }

  return (
    <div>
      <p>
        {filterItems.map((filterItem, index) => (
          <SelectedFilterLabel
            key={index}
            text={filterItem}
            filterType={filterType}
            onRemoveFilter={onRemoveFilter}
          />
        ))}
      </p>
    </div>
  );
};

export default FilterBadges;