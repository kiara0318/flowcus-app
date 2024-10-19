import React from "react";
import {PrimaryAppBar} from "../components";

export default {
    title: "Components/PrimaryAppBar", component: PrimaryAppBar,
};

const Template = (args) => <PrimaryAppBar {...args} />;

export const Default = Template.bind({});
Default.args = {};
