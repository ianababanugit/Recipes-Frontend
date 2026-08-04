<template>
  <div>
    <LayoutHeader />
    <main class="content-container">
      <template v-if="data && status === 'success'">
        <div class="heading-section">
          <LayoutContainer>
            <BaseTypography tag="h1" variant="heading-01-semibold">
              {{ data.name }}
            </BaseTypography>
          </LayoutContainer>
          <RecipeDetailsHeroImage v-if="data.imageUri" :recipe="data" />
        </div>
        <LayoutContainer>
          <BaseTypography
            variant="body-04"
            color="neutral-08"
            class="characteristics-desktop"
          >
            {{ characteristicsText }}
          </BaseTypography>
          <BaseTypography tag="p" variant="body-03" class="description">
            {{ data.description }}
          </BaseTypography>
          <div class="characteristics-wrapper-mobile">
            <div class="characteristic">
              <Icon name="ep:food" class="characteristic-icon" />
              <BaseTypography
                tag="p"
                variant="body-05-semibold"
                color="neutral-08"
              >
                {{ data.recipeIngredients.length }} ингредиентов
              </BaseTypography>
            </div>
            <div v-if="data.timeToCookInMinutes" class="characteristic">
              <Icon name="ep:clock" class="characteristic-icon" />
              <BaseTypography
                tag="p"
                variant="body-05-semibold"
                color="neutral-08"
              >
                {{ data.timeToCookInMinutes }} минут
              </BaseTypography>
            </div>
          </div>
          <div class="ingredients-section">
            <div class="ingredients-section-header">
              <BaseTypography
                tag="h2"
                variant="body-01-semibold"
                class="ingredients-heading"
              >
                Ингредиенты
              </BaseTypography>
              <BaseCircularIconButton
                icon="fluent:task-list-24-regular"
                size="small"
                variant="primary"
                @click="hasCheckboxes = !hasCheckboxes"
              />
            </div>

            <ul class="ingredients-list">
              <li
                v-for="ingredient in data.recipeIngredients"
                :key="ingredient.id"
                class="ingredient checkbox-wrapper"
              >
                <BaseCheckbox
                  v-if="hasCheckboxes"
                  class="checkbox-ingredient"
                />
                <BaseTypography
                  tag="span"
                  variant="body-03"
                  class="ingredient-name"
                >
                  {{ ingredient.description }}
                </BaseTypography>
                <BaseTypography
                  v-if="ingredient.quantity && ingredient.unit"
                  tag="span"
                  variant="body-04"
                  color="neutral-08"
                  class="ingredient-quantity"
                >
                  {{ ` — ${ingredient.quantity} ${ingredient.unit || ""}` }}
                </BaseTypography>
              </li>
            </ul>
          </div>
          <div class="steps-section">
            <BaseTypography
              tag="h2"
              variant="body-01-semibold"
              class="steps-heading"
            >
              Процесс приготовления
            </BaseTypography>
            <ul class="steps-list">
              <li
                v-for="(step, index) in data.steps"
                :key="step + index"
                class="step"
              >
                <BaseTypography
                  tag="span"
                  variant="micro-01"
                  color="shade-01"
                  class="step-number"
                >
                  {{ index + 1 }}
                </BaseTypography>
                <BaseTypography tag="p" variant="body-03" class="step-text">
                  {{ step }}
                </BaseTypography>
              </li>
            </ul>
          </div>
        </LayoutContainer>
      </template>
      <LayoutContainer v-else>
        <LayoutPageLoader />
      </LayoutContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { Recipe } from "~/types/recipe";

const { params } = useRoute();
const { token } = useAuthStore();
const baseUrl = useBaseUrl();
const hasCheckboxes = ref(false);
const { data, status } = useFetch<Recipe>(`${baseUrl}/recipes/${params.id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const characteristicsText = computed(() =>
  [
    data.value?.recipeIngredients.length &&
      `${data.value?.recipeIngredients.length} ингридиентов`,
    data.value?.timeToCookInMinutes &&
      `${data.value?.timeToCookInMinutes} минут`,
  ]
    .filter(Boolean)
    .join(" • ")
);
</script>

<style lang="scss" scoped>
.content-container {
  padding: $spacing-8 0 $spacing-16;

  @media screen and (max-width: $small-screen) {
    padding: 0 0 $spacing-12;
  }
}

.heading-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
  margin-bottom: $spacing-5;

  @media screen and (max-width: $small-screen) {
    flex-direction: column-reverse;
    margin-bottom: $spacing-2;
  }
}

.description {
  margin-bottom: $spacing-8;
}

.characteristics-wrapper-mobile {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: $spacing-10;
  border: 1px solid $color-neutral-05;
  border-radius: 12px;
  padding: $spacing-4 $spacing-5;
  margin-bottom: $spacing-8;

  @media screen and (min-width: $medium-screen) {
    display: none;
  }
}

.characteristic {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-3;
}

.characteristic-icon {
  width: 48px;
  height: 48px;
  color: $color-neutral-07;
}

.characteristics-desktop {
  display: none;

  @media screen and (min-width: $medium-screen) {
    display: block;
    margin-bottom: $spacing-1;
  }
}

.ingredients-section {
  margin-bottom: $spacing-14;
  padding: $spacing-5 $spacing-5 $spacing-8;
  box-shadow: $elevation-02;
  border-radius: 12px;
}

.ingredients-heading {
  margin-bottom: $spacing-4;
}

.ingredients-list {
  display: inline-flex;
  flex-direction: column;
  gap: $spacing-2;
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps-section {
  margin-bottom: $spacing-20;
}

.steps-heading {
  margin-bottom: $spacing-6;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-10;
  list-style: none;
  padding: 0;
  margin: 0;
}

.step {
  display: flex;
  gap: $spacing-5;
  align-items: baseline;
  background: $color-neutral-01;
  padding: $spacing-5;
  border-radius: 12px;
  position: relative;
}

.checkbox-ingredient {
  padding-right: $spacing-3;
}
.checkbox-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.ingredients-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $color-primary-01;
  box-shadow: $elevation-02;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -12px;
  left: -14px;
}

.step-text {
  flex: 1;
}
</style>
