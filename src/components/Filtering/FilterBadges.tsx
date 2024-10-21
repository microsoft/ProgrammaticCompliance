import { FC } from 'react';
import SelectedFilterLabel from './SelectedFilterLabel.jsx';

export interface FilterBadgesProps {
  filterItems: string[];
  filterType: string;
  onRemoveFilter: (filterItem: string, filterType: string) => void;
}

const FilterBadges: FC<FilterBadgesProps> = ({ filterItems, filterType, onRemoveFilter }) => {
  return (
    <>
      {filterItems.length === 0 ? (
        null
      ) : (
        filterItems.map((filterItem, index) => (
          <SelectedFilterLabel
            key={index}
            text={filterItem}
            filterType={filterType}
            onRemoveFilter={() => onRemoveFilter(filterItem, filterType)}
          />
        ))
      )}
    </>
  );
};

export default FilterBadges;