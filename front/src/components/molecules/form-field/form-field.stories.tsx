import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField } from "./form-field";

const meta = {
  title: "Molecules/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "email",
    label: "メールアドレス",
    inputProps: { placeholder: "you@example.com" },
  },
};

export const WithHelperText: Story = {
  args: {
    id: "password",
    label: "パスワード",
    helperText: "8文字以上",
    inputProps: { type: "password" },
  },
};

export const RegisterForm: Story = {
  args: {
    id: "email-2",
    label: "メールアドレス",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormField
        id="email-2"
        label="メールアドレス"
        inputProps={{ placeholder: "you@example.com" }}
      />
      <FormField
        id="password-2"
        label="パスワード"
        helperText="8文字以上"
        inputProps={{ type: "password" }}
      />
    </div>
  ),
};
