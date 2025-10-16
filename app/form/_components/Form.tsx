"use client";

import { TextInput, Textarea, Button, Group, Stack } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

export function Form() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      message: "",
      date: new Date(),
      time: "",
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        let datetime = null;
        if (values.date && values.time && /^\d{1,2}:\d{2}$/.test(values.time)) {
          const [h, m] = values.time.split(":").map(Number);
          datetime = dayjs(values.date)
            .hour(h)
            .minute(m)
            .second(0)
            .millisecond(0)
            .toISOString();
        }
        console.log({ ...values, datetime });
        alert(`Submitted!\nDatetime: ${datetime ?? "—"}`);
      })}
    >
      <Stack gap="md">
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="First Name"
          key={form.key("first_name")}
          {...form.getInputProps("first_name")}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="Last Name"
          key={form.key("last_name")}
          {...form.getInputProps("last_name")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Phone Number"
          placeholder="Phone Number"
          key={form.key("phone_number")}
          {...form.getInputProps("phone_number")}
        />

        <DatePickerInput
          label="Kuupäev"
          placeholder="Vali kuupäev"
          value={form.getValues().date as Date}
          onChange={(value) => form.setFieldValue("date", value ?? new Date())}
          key={form.key("date")}
        />

        <TimeInput
          label="Kellaaeg"
          placeholder="HH:MM"
          value={form.getValues().time as string}
          onChange={(e) => form.setFieldValue("time", e.currentTarget.value)}
          key={form.key("time")}
        />

        <Textarea
          withAsterisk
          label="Message"
          placeholder="Message"
          key={form.key("message")}
          {...form.getInputProps("message")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
}

// d@gmail.com
// + 000 000 000
