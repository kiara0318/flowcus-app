import React from "react";
import {EmojiPicker} from "../components"; // Adjust the import based on your actual file structure

export default {
    title: "Components/EmojiPicker",
    component: EmojiPicker,
};

const Template = (args) => <EmojiPicker {...args} />;

const defaultEmojiUrl = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2705.png";
const defaultEmoji = {
    getImageUrl: () => defaultEmojiUrl,
    emoji: "✅", // Emoji character (you can adjust this to match your default)
};

export const Default = Template.bind({});
Default.args = {
    defaultEmoji: defaultEmoji,
    onEmojiClick: (emojiObject) => console.log(emojiObject),
};

export const WithCustomSkinTone = Template.bind({});
WithCustomSkinTone.args = {
    defaultEmoji: {
        getImageUrl: () => "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png", // Example custom emoji URL
        emoji: "😍", // Custom emoji for this example
    },
    initialSkinTone: "medium",
    onEmojiClick: (emojiObject) => console.log(emojiObject),
};
