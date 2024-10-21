import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, SearchBox } from '@fluentui/react';
import { FC, useState } from 'react';

interface SearchableDropdownProps extends IDropdownProps {
    options: IDropdownOption[];
}

const SearchableDropdown: FC<SearchableDropdownProps> = ({
    options,
    ...dropdownProps
}) => {
    const [searchText, setSearchText] = useState<string>("");

    const renderOption = (option?: IDropdownOption): JSX.Element | null => {
        if (!option) return null;

        const isSearchBox = option.itemType === DropdownMenuItemType.Header && option.key === "FilterHeader";
        if (isSearchBox) {
            return (
                <SearchBox onChange={(_, newValue) => setSearchText(newValue || '')} underlined={true} placeholder="Search options" />
            );
        }
        return (
            <div>
                {option.text}
            </div>
        );
    };

    return (
        <Dropdown
            {...dropdownProps}
            options={[
                { key: 'FilterHeader', text: '-', itemType: DropdownMenuItemType.Header },
                { key: 'divider_filterHeader', text: '-', itemType: DropdownMenuItemType.Divider },
                ...options.map(option => !option.disabled && option.text.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ?
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