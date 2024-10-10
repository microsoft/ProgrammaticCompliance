import {
    Icon,
    Stack,
    Text
} from "@fluentui/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const examplePersona = {
    imageInitials: "MS",
    text: "Microsoft Test",
    secondaryText: "Software Engineer",
    tertiaryText: "pcompvteam@microsoft.com",
    optionalText: "Available anytime",
};

const iconProps = { iconName: 'Waffle' };

const Header = () => {
    return (
        <Stack
            disableShrink
            horizontal
            grow={1}
            verticalAlign="center"
            horizontalAlign="space-between"
            styles={{
                root: {
                    backgroundColor: "#0078D4",
                    height: "49px",
                    maxHeight: "49px",
                },
            }}
            aria-label="Banner"
        >
            <Stack.Item grow={3}>
                <Stack horizontal wrap={false} verticalAlign="center">
                    <Icon
                        iconProps={iconProps}
                        ariaLabel="Menu"
                        styles={{
                            icon: { color: '#0078D4', fontSize: 25 },
                            root: {
                                width: 50,
                                height: 50,
                            }
                        }}
                    />
                    <Text
                        key="productName"
                        variant={"large"}
                        styles={{
                            root: {
                                color: "white",
                            },
                        }}
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