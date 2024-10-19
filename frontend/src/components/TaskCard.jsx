import React from "react";
import PropTypes from "prop-types";
import {Box, Card, Typography} from "@mui/material";

const TaskCard = ({emoji = "✅", name}) => {
    return (<div className="task-card">
        <Card>
            <Box display="flex" alignItems="center" padding="16px">
                <Typography variant="h5" sx={{mr: 1, minWidth: 24}}>
                    {emoji}
                </Typography>
                <Typography sx={{color: "text.secondary", fontSize: 16}}>
                    {name}
                </Typography>
            </Box>

        </Card>
    </div>);
};

TaskCard.propTypes = {
    emoji: PropTypes.string, name: PropTypes.string.isRequired,
};

export default TaskCard;