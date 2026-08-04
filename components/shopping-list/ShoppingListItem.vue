<template>
  <li>
    <div class="list-item-wrapper">
      <div class="checkbox-wrapper">
        <BaseCheckbox
          :modelValue="item.isPurchased"
          @update:model-value="handleToggle"
        />
        <BaseTypography
          class="text-wrapper"
          :class="{ purchased: item.isPurchased }"
          variant="body-02"
        >
          {{ item.text }}
        </BaseTypography>
      </div>

      <div>
        <!-- <BaseCircularIconButton
          icon="bytesize:edit"
          size="small"
          variant="quaternary"
        /> -->

        <BaseCircularIconButton
          class="delete-button"
          icon="ph:trash-bold"
          size="small"
          variant="quinary"
          @click="() => shoppingListStore.removeItem(item.id)"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useShoppingListStore } from "~/stores/shoppingList";
import { type ShoppingItem } from "~/stores/shoppingList";

const props = defineProps<{
  item: ShoppingItem;
}>();
const shoppingListStore = useShoppingListStore();

const handleToggle = () => {
  shoppingListStore.toggleItem(props.item.id);
};
</script>
<style lang="scss" scoped>
.content-container {
  padding: $spacing-8 0 $spacing-16;

  @media screen and (max-width: $small-screen) {
    padding: 0 0 $spacing-12;
  }
}

li {
  display: flex;
  align-items: center;
  gap: $spacing-3;
}

.purchased {
  text-decoration: line-through;
}
.list-item-wrapper {
  display: flex;
  align-items: row;
  justify-content: space-between;
  width: 100%;
}

.text-wrapper {
  width: 400px;
  margin-left: $spacing-3;

  @media screen and (max-width: $small-screen) {
    width: 200px;
  }
}
.checkbox-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.delete-button {
  border: none;
  margin-left: $spacing-3;
}
</style>
