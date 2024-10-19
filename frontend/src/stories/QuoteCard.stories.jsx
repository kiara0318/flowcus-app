import React from "react";
import {QuoteCard} from "../components";

export default {
    title: "Components/QuoteCard", component: QuoteCard, argTypes: {
        quote: {control: "text"}, author: {control: "text"}
    },
};

const Template = (args) => <QuoteCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    quote: "Do one thing every day that scares you.", author: "Eleanor Roosevelt"
};

export const Long = Template.bind({});
Long.args = {
    quote: "This is a quote ........................................................................................." +
        "............................................................................................................" +
        ".................................",
    author: "Me"
};

export const UnknownAuthor = Template.bind({});
UnknownAuthor.args = {
    quote: "This quote has an unknown author",
};
