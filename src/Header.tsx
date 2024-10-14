import {
    Icon,
    IIconProps,
    IStackStyles,
    ITextStyles,
    Stack,
    Text
} from "@fluentui/react";

const iconProps: IIconProps = { iconName: 'Waffle' };

const stackStyles: IStackStyles = {
    root: {
        backgroundColor: "#0078D4",
        height: "49px",
        maxHeight: "49px",
    },
};

const iconStyles: IIconProps['styles'] = {
    root: {
        color: "#0078D4",
        fontSize: 25,
        width: 50,
        height: 50,
    }
};

const textStyles: ITextStyles = {
    root: {
        color: "white",
    },
};

const Header = () => {
    return (
        <Stack
            disableShrink
            horizontal
            grow={1}
            verticalAlign="center"
            horizontalAlign="space-between"
            styles={stackStyles}
            aria-label="Banner"
        >
            <Stack.Item grow={3}>
                <Stack horizontal wrap={false} verticalAlign="center">
                    <Icon
                        {...iconProps}
                        ariaLabel="Menu"
                        styles={iconStyles}
                    />
                    <Text
                        key="productName"
                        variant={"large"}
                        styles={textStyles}
                        nowrap
                        block
                    >
                        Programmatic Compliance
                    </Text>
                </Stack>
            </Stack.Item>
            <Stack.Item
                grow={3}
                styles={{
                    root: {
                        display: "flex",
                        justifyContent: "flex-end",
                    },
                }}
            >
                <Stack
                    horizontal
                    tokens={{ childrenGap: 10 }}
                    styles={{
                        root: {
                            paddingRight: 10,
                        },
                    }}
                >
                </Stack>
            </Stack.Item>
        </Stack>
    );
};

export default Header;