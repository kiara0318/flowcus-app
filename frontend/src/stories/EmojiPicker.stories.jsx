import React from "react";
import {EmojiPicker} from "../components";

export default {
    title: "Components/EmojiPicker", component: EmojiPicker,
};

const Template = (args) => <EmojiPicker {...args} />;

export const Default = Template.bind({});
Default.args = {};
