import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: { variant: 'contained' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Text: Story = {
  args: { variant: 'text' },
};
