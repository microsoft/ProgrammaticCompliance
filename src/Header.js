import * as React from "react";
import {
    SearchBox,
    Stack,
    Text,
    Icon,
    Persona,
    PersonaPresence,
    PersonaSize
} from "@fluentui/react";

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
            {/* <Stack.Item grow={6}>
                <SearchBox
                    placeholder="Search"
                    onSearch={(newValue) => console.log("value is " + newValue)}
                />
            </Stack.Item> */}
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
                    {/* <IconButton
                        iconProps={{ iconName: "Ringer" }}
                        title="Notifications"
                        ariaLabel="Notifications"
                        disabled={false}
                        checked={false}
                        styles={{
                            root: {
                                color: "white",
                            },
                        }}
                    />
                    <IconButton
                        iconProps={{ iconName: "Settings" }}
                        title="Settings"
                        ariaLabel="Settings"
                        disabled={false}
                        checked={false}
                        styles={{
                            root: {
                                color: "white",
                            },
                        }}
                    />
                    <IconButton
                        iconProps={{ iconName: "Help" }}
                        title="Help"
                        ariaLabel="Help"
                        disabled={false}
                        checked={false}
                        styles={{
                            root: {
                                color: "white",
                            },
                        }}
                    /> */}
                    {/* <Persona
                        {...examplePersona}
                        size={PersonaSize.size32}
                        hidePersonaDetails={true}
                        presence={PersonaPresence.online}
                    /> */}
                </Stack>
            </Stack.Item>
        </Stack>
    );
};

export default Header;