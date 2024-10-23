import { ActionButton } from '@fluentui/react';
import { FC, useLayoutEffect, useState } from 'react';
import FilterBadges from './FilterBadges';

interface FilterBadgesContainerProps {
  selectedServices: string[];
  selectedControls: string[];
  removeFilter: (filter: string, type: 'service' | 'control') => void;
  handleClear: () => void;
}

const CustomSeparator: FC = () => (
  <span style={{ fontSize: '18px', paddingLeft: '10px', paddingTop: '4px', color: '#9C9C9C' }}>|</span>
);

const FilterBadgesContainer: FC<FilterBadgesContainerProps> = ({ selectedServices, selectedControls, removeFilter, handleClear }) => {

  const sortSelectedItems = (selectedItems: string[]): string[] => {
    return selectedItems.slice().sort((a, b) => {
      const firstCharA = a.charAt(0).toLowerCase();
      const firstCharB = b.charAt(0).toLowerCase();
      return firstCharA.localeCompare(firstCharB);
    });
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false); // Initially false

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };

    setIsSmallScreen(window.innerWidth < 400);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sortedSelectedServices = sortSelectedItems(selectedServices);
  const sortedSelectedControls = sortSelectedItems(selectedControls);

  return (
    <>
      {isSmallScreen ? (
        <div style={{ flexWrap: 'wrap', display: 'flex' }}>
          {(sortedSelectedControls.length > 0 || sortedSelectedServices.length > 0) && (
            <div>
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
                marginBottom: '0px',
                whiteSpace: 'nowrap',
              }}>Filtered by:</p>
              <FilterBadges
                filterItems={sortedSelectedServices}
                filterType="service"
                onRemoveFilter={(filter) => removeFilter(filter, 'service')}
              />
              {sortedSelectedControls.length > 0 && sortedSelectedServices.length > 0 && (
                <CustomSeparator />
              )}
              <FilterBadges
                filterItems={sortedSelectedControls}
                filterType="control"
                onRemoveFilter={(filter) => removeFilter(filter, 'control')}
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
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                }}>
                Clear all filters
              </ActionButton>
            </div>
          )}
        </div>
      ) : (
        <>
          {(sortedSelectedControls.length > 0 || sortedSelectedServices.length > 0) && (
            <div>
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
                marginBottom: '0px',
                whiteSpace: 'nowrap',
              }}>Filtered by:</p>
              <FilterBadges
                filterItems={sortedSelectedServices}
                filterType="service"
                onRemoveFilter={(filter) => removeFilter(filter, 'service')}
              />
              {sortedSelectedControls.length > 0 && sortedSelectedServices.length > 0 && (
                <CustomSeparator />
              )}
              <FilterBadges
                filterItems={sortedSelectedControls}
                filterType="control"
                onRemoveFilter={(filter) => removeFilter(filter, 'control')}
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
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                }}>
                Clear all filters
              </ActionButton>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FilterBadgesContainer;