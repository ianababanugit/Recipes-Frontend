<template>
  <div class="container">
    <div>
      <slot />
    </div>
    <BaseDivider />
    <div class="footer">
      <BaseTypography variant="body-02"
        >Iana Incorporated © {{ year }}</BaseTypography
      >
    </div>
  </div>
</template>

<script setup lang="ts">
useHead(() => ({
  title: "Recipes",
}));

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.footer {
  height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: $small-screen) {
    height: 50px;
  }
}
</style>
