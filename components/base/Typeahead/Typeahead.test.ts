import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseTypeahead from "./Typeahead.vue";

describe("BaseTypeahead", () => {
  it("renders the label when provided", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        label: "Test Label",
        helperText: "Helper text",
        items: ["apple", "banana", "grape"],
      },
    });

    expect(component.find("label").text()).toBe("Test Label");
  });

  it("displays filtered items when input matches", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        items: ["apple", "banana", "grape"],
      },
    });

    const input = component.find("input");
    await input.setValue("ap");
    await component.setProps({ modelValue: "ap" });

    // Await nextTick to allow for DOM updates after input change
    await component.vm.$nextTick();

    const options = component.findAll(".typeahead-option");
    expect(options.length).toBe(2);
    expect(options[0].text()).toBe("apple");
  });

  it("does not display options if no match found", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        modelValue: "xyz",
        items: ["apple", "banana", "grape"],
      },
    });

    const input = component.find("input");
    await input.setValue("xyz");

    // Await nextTick to allow for DOM updates after input change
    await component.vm.$nextTick();

    const options = component.findAll(".typeahead-option");
    expect(options.length).toBe(0);
  });

  it("emits update:modelValue when input changes", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        items: ["apple", "banana", "grape"],
      },
    });

    const input = component.find("input");
    await input.setValue("banana");

    // Ensure emitted event
    expect(component.emitted()["update:modelValue"]).toBeTruthy();
    expect(component.emitted()["update:modelValue"][0]).toEqual(["banana"]);
  });

  it("displays the error message when status is error", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        status: "error",
        errorMessage: "Error message",
        items: ["apple", "banana", "grape"],
      },
    });

    const errorMessage = component.find(".error-message-wrapper");
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe("Error message");
  });

  it("closes the options when an item is selected", async () => {
    const component = await mountSuspended(BaseTypeahead, {
      props: {
        id: "test-id",
        items: ["apple", "banana", "grape"],
      },
    });

    const input = component.find("input");
    await input.setValue("a");
    component.setProps({ modelValue: "a" });

    // Await nextTick to allow for DOM updates after input change
    await component.vm.$nextTick();

    let options = component.findAll(".typeahead-option");
    expect(options.length).toBe(3);

    await options[0].trigger("click");

    // Await nextTick to allow for dropdown to close
    await component.vm.$nextTick();

    options = component.findAll(".typeahead-option");
    expect(options.length).toBe(0);
  });
});
