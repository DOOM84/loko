<template>
  <div class="overflow">
      <slot></slot>
  </div>
</template>


<style lang="scss" scoped>
  .overflow{
    overflow-x: auto;
  }
::v-slotted(table) {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 0.5px solid #ddd;

  thead {
    border-bottom: 0.5px solid #cccccc;
  }

  th {
    text-align: left;
    padding: 8px;
  }
  td {
    text-align: left;
    padding: 8px;
  }

}

</style>