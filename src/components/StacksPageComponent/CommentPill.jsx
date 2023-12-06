import { Delete } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const CommentPill = ({ comment, isSubmitting, index, comments, handleDeleteComment }) => {

    const handleDelete = () => {
        // Call the parent component's handleDeleteComment function
        handleDeleteComment(index);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1f1f1f', border: '2px solid #4e4e4e', color: '#f2f8fc', padding:'8px', borderRadius: '7px', position: 'relative' }}>
            <Typography sx={{ fontSize: '14px' }}>
                {comment.displayName} {isSubmitting && index === comments.length - 1 && (
                    <CircularProgress size={'8px'} sx={{ position: 'absolute', right: '8px', color: '#909394' }} />
                )}
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>{comment.text}</Typography>
        </Box>
        
    )
}

export default CommentPill;