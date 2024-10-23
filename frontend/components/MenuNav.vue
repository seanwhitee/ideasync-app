<script setup>
const isOpen = defineModel();
const props = defineProps({
  items: Array,
});
</script>
<template>
  <div class="block md:hidden">
    <Icon name="mdi:menu" class="fixed top-4 right-4" @click="isOpen = true" />
    <UModal v-model="isOpen" fullscreen>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow',
          },
        }"
      >
        <div class="flex justify-end w-full mb-10">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
        
          <ul class="flex flex-col items-start justify-center gap-3">
            <NuxtLink
              @click="isOpen = false"
              v-for="item in items"
              :to="item.path"
              :key="item.name"
            >
              <li>
                {{ item.name }}
              </li>
            </NuxtLink>
          </ul>
        
      </UCard>
    </UModal>
  </div>
</template>
