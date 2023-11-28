import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Post from '../../components/Post/Post';
import { Container, Grid, Typography, Chip } from '@mui/material';

const PostView = ({ posts }) => {
    const [selectedTag, setSelectedTag] = useState(null);

    const handleTagSelect = (tag) => {
        setSelectedTag(tag === selectedTag ? null : tag);
    };

    const filteredPosts = selectedTag
        ? posts.filter((post) => post.tags.includes(selectedTag))
        : posts;

    const uniqueTags = Array.from(
        new Set(posts.reduce((acc, post) => acc.concat(post.tags), []))
    );

    return (
        <>
            <Container maxWidth="md">
                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                    {uniqueTags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            onClick={() => handleTagSelect(tag)}
                            color={selectedTag === tag ? 'primary' : 'default'}
                            style={{cursor: 'pointer' }}
                        />
                    ))}
                    <Chip
                        label="All"
                        onClick={() => handleTagSelect(null)}
                        color={selectedTag === null ? 'primary' : 'default'}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <Grid container spacing={2}>
                    {filteredPosts.map((post) => (
                        <Grid item xs={12} key={post.id}>
                            <Post
                                id={post.id}
                                image_url={post.image_url}
                                user={post.user}
                                title={post.title}
                                caption={post.caption}
                                tags={post.tags}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default PostView;
