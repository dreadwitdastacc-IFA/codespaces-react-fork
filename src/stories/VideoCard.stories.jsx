import React from 'react';
import VideoCard from '../VideoCard';

export default {
  title: 'Components/VideoCard',
  component: VideoCard,
};

const Template = (args) => <VideoCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  video: {
    title: 'High-Octane Demo',
    description: 'An action-packed preview for the app',
    url: 'https://example.com',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Action',
    liked: false,
  },
};
