import React, { useState } from 'react';
import { DropdownMenuItemType, Dropdown, SearchBox } from '@fluentui/react';

const SearchableDropdown = (props) => {
    const [searchText, setSearchText] = useState("");

    const renderOption = (option) => {
        const isSearchBox = option.itemType === DropdownMenuItemType.Header && option.key === "FilterHeader";
        if (isSearchBox) {
            return (   
                <>
                    <SearchBox onChange={(ev, newValue) => setSearchText(newValue)} underlined={true} placeholder="Search options" />
                </>
            )
        }
        return (
            <div>
                {option.text}
            </div>
        )
    }

    return (
        <Dropdown
            {...props}
            options={[
                { key: 'FilterHeader', text: '-', itemType: DropdownMenuItemType.Header },
                { key: 'divider_filterHeader', text: '-', itemType: DropdownMenuItemType.Divider },
                ...props.options.map(option => !option.disabled && option.text.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ?
                    option : { ...option, hidden: true }
                ),
            ]}
            calloutProps={{ shouldRestoreFocus: false, setInitialFocus: false }}
            onRenderOption={renderOption}
            onDismiss={() => setSearchText('')}
        />
    );
};

export default SearchableDropdown;
